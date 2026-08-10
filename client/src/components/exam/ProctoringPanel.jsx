import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert, ShieldCheck, AlertTriangle as ShieldWarning } from 'lucide-react';
import { toast } from 'sonner';
import { setPersonCount, setWarningLevel, deductIntegrityScore, incrementViolations } from '../../redux/slices/proctorSlice';
import proctoringService from '../../services/proctoringService';
import { useSocket } from '../../hooks/useSocket';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export const ProctoringPanel = ({ examId, questionNumber }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('Starting camera...'); 
  const { personCount, integrityScore } = useSelector((state) => state.proctor);
  const { sessionId } = examId ? { sessionId: examId } : { sessionId: 'unknown' }; 
  const socket = useSocket(examId);

  const [proctorState, setProctorState] = useState('ONE_PERSON'); // ONE_PERSON, MULTIPLE_PERSONS, NO_PERSON
  
  // Debounce tracking refs
  const detectionCounts = useRef({
    0: 0,
    1: 0,
    'multiple': 0
  });

  useEffect(() => {
    let localStream = null;
    let isMounted = true;

    const initProctoring = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error('Your browser does not support camera access.');
        }
        
        setCameraStatus('Camera permission required');
        
        // Exact params requested
        localStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            },
            audio: false
        });
        
        if (!isMounted) {
          localStream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
          setIsCameraActive(true);
          setCameraStatus('Camera active');
          
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.warn('AutoPlay blocked', playErr);
          }
        }
        
        const loadedModel = await cocoSsd.load();
        if (isMounted) setModel(loadedModel);
        
      } catch (err) {
        if (!isMounted) return;
        console.error('Proctoring Init Error:', err);
        
        let errorMsg = 'Camera unavailable';
        if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
          errorMsg = 'Camera access is required for AI proctoring. Please allow camera access in your browser and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMsg = 'No camera device found.';
        } else if (err.name === 'NotReadableError') {
          errorMsg = 'Camera is already in use by another application.';
        } else if (err.message) {
          errorMsg = err.message;
        }
        setCameraStatus(errorMsg);
      }
    };

    initProctoring();

    return () => {
      isMounted = false;
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  useEffect(() => {
    let intervalId;
    const CONFIRMATION_THRESHOLD = 4; // Approx 2 seconds at 500ms intervals

    const detectFrame = async () => {
      if (videoRef.current && model && isCameraActive && videoRef.current.readyState === 4) {
        const predictions = await model.detect(videoRef.current);
        const persons = predictions.filter(p => p.class === 'person');
        const currentCount = persons.length;
        
        dispatch(setPersonCount(currentCount));

        let rawState = 'ONE_PERSON';
        if (currentCount > 1) rawState = 'MULTIPLE_PERSONS';
        if (currentCount === 0) rawState = 'NO_PERSON';

        for (let key in detectionCounts.current) {
           if (
             (key === '0' && rawState === 'NO_PERSON') || 
             (key === '1' && rawState === 'ONE_PERSON') || 
             (key === 'multiple' && rawState === 'MULTIPLE_PERSONS')
           ) {
             detectionCounts.current[key] += 1;
           } else {
             detectionCounts.current[key] = 0;
           }
        }

        if (rawState === 'MULTIPLE_PERSONS' && detectionCounts.current['multiple'] === CONFIRMATION_THRESHOLD && proctorState !== 'MULTIPLE_PERSONS') {
           setProctorState('MULTIPLE_PERSONS');
           dispatch(setWarningLevel('HIGH'));
           playWarningSound();
           logViolationEvent('MULTIPLE_PERSONS', currentCount, 'HIGH', 10);
        } else if (rawState === 'NO_PERSON' && detectionCounts.current['0'] === CONFIRMATION_THRESHOLD && proctorState !== 'NO_PERSON') {
           setProctorState('NO_PERSON');
           dispatch(setWarningLevel('MEDIUM'));
           logViolationEvent('NO_PERSON', 0, 'MEDIUM', 5);
        } else if (rawState === 'ONE_PERSON' && detectionCounts.current['1'] === CONFIRMATION_THRESHOLD && proctorState !== 'ONE_PERSON') {
           setProctorState('ONE_PERSON');
           dispatch(setWarningLevel('SAFE'));
           socket.socket?.emit('multiplePersonResolved', { sessionId: examId });
        }
      }
    };

    if (model && isCameraActive) {
      intervalId = setInterval(detectFrame, 500);
    }
    return () => clearInterval(intervalId);
  }, [model, isCameraActive, dispatch, examId, socket, proctorState]);

  const logViolationEvent = (type, count, severity, penalty) => {
      const ts = new Date().toISOString();
      const eventPayload = {
         type,
         personCount: count,
         timestamp: ts,
         severity,
         // Include legacy fields to satisfy existing backend database schemas:
         examId,
         questionNumber: questionNumber || 1,
         personsDetected: count,
         duration: 2, 
         warningLevel: severity,
         integrityPenalty: penalty
      };
      
      if (type === 'MULTIPLE_PERSONS') {
         toast.error('⚠ MULTIPLE PEOPLE DETECTED');
         socket.socket?.emit('multiplePersonDetected', { sessionId: examId, personsDetected: count });
      } else if (type === 'NO_PERSON') {
         toast.warning('NO PERSON DETECTED');
      }
      
      dispatch(deductIntegrityScore(penalty));
      socket.socket?.emit('integrityUpdated', { sessionId: examId, newScore: Math.max(0, integrityScore - penalty) });
      proctoringService.logViolation(eventPayload).catch(e => console.error(e));
  };

  const playWarningSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); 
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch(e) {}
  };

  const renderHeaderUI = () => {
     if (proctorState === 'ONE_PERSON') {
        return (
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            <span className="flex items-center gap-1">🛡 AI PROCTOR 🟢</span>
            <span className="text-mint">ONE PERSON</span>
          </div>
        );
     }
     if (proctorState === 'MULTIPLE_PERSONS') {
        return (
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-red-500 mb-2">
            <span className="flex items-center gap-1"><ShieldAlert className="w-4 h-4" /> 🛡 AI PROCTOR 🔴</span>
            <span>⚠ MULTIPLE PEOPLE DETECTED</span>
          </div>
        );
     }
     if (proctorState === 'NO_PERSON') {
        return (
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-amber-500 mb-2">
            <span className="flex items-center gap-1"><ShieldWarning className="w-4 h-4" /> 🛡 AI PROCTOR 🟠</span>
            <span>NO PERSON DETECTED</span>
          </div>
        );
     }
  }

  const borderColor = proctorState === 'ONE_PERSON' ? 'border-hair bg-surface-2/80' : 
                      proctorState === 'MULTIPLE_PERSONS' ? 'border-red-500 bg-red-900/20 animate-pulse' : 
                      'border-amber-500 bg-amber-900/20';
                      
  const cameraBorder = proctorState === 'ONE_PERSON' ? 'border-slate-700/50' : 
                       proctorState === 'MULTIPLE_PERSONS' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                       'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';

  return (
    <div className={`relative flex flex-col p-3 rounded-2xl border backdrop-blur-md shadow-lg transition-colors ${borderColor}`}>
      
      {renderHeaderUI()}
      <div className="text-center text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">LIVE CAMERA</div>

      <div className={`relative overflow-hidden rounded-xl border-2 transition-all bg-black ${cameraBorder}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-48 h-36 object-cover bg-black"
        />
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-[11px] text-slate-400">
            <span className={cameraStatus.includes('error') || cameraStatus.includes('unavailable') || cameraStatus.includes('required') || cameraStatus.includes('access is required') ? "text-red-400 font-medium" : ""}>
               {cameraStatus}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xs font-semibold px-1 mt-2">
        <div className="flex flex-col text-left">
          <span className="text-slate-500">People detected</span>
          <span className={proctorState !== 'ONE_PERSON' ? (proctorState === 'MULTIPLE_PERSONS' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold') : 'text-slate-200'}>
            {personCount}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-slate-500">Integrity</span>
          <span className={integrityScore < 70 ? 'text-red-400 font-bold' : 'text-mint'}>
            {integrityScore}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProctoringPanel;
