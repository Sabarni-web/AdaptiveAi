import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert, ShieldCheck, AlertTriangle as ShieldWarning } from 'lucide-react';
import { toast } from 'sonner';
import { setPersonCount, setWarningLevel, deductIntegrityScore, incrementViolations } from '../../redux/slices/proctorSlice';
import proctoringService from '../../services/proctoringService';
import { useSocket } from '../../hooks/useSocket';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { voiceAlertService } from '../../services/voiceAlertService';
import { ExamViolationAlert } from './ExamViolationAlert';

const EXAM_MONITOR_CONFIG = {
  headTurnDurationMs: 800,
  noFaceGracePeriodMs: 1500,
  phoneConfirmationMs: 800,
  multiplePersonConfirmationMs: 800,
  phoneConfidence: 0.60,
  personConfidence: 0.50,
  yawThreshold: 25,
  pitchThreshold: 25
};

export const ProctoringPanel = ({ examId, questionNumber }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const [models, setModels] = useState({ coco: null, face: null });
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('Starting camera...');
  const { personCount, integrityScore } = useSelector((state) => state.proctor);
  const { sessionId } = examId ? { sessionId: examId } : { sessionId: 'unknown' };
  const socket = useSocket(examId);

  const [activeViolation, setActiveViolation] = useState(null); // { type, message }
  const [violationCounts, setViolationCounts] = useState({ headTurn: 0, multiplePerson: 0, phone: 0, noFace: 0 });

  const [proctorState, setProctorState] = useState('ONE_PERSON');
  const [debugInfo, setDebugInfo] = useState({
    faceDetected: 'WAITING',
    landmarks: 'WAITING',
    yaw: '0.0',
    neutralYaw: '0.0',
    relativeYaw: '0.0',
    pitch: '0.0',
    direction: 'CENTER',
    status: 'INITIALIZING',
    calibrating: 'WAITING'
  });

  const headPoseRef = useRef({
    isCalibrating: true,
    calibrationFrames: 0,
    yawSum: 0,
    pitchSum: 0,
    neutralYaw: 0,
    neutralPitch: 0,
    currentYaw: 0,
    currentPitch: 0,
    direction: 'CENTER'
  });

  // Debounce tracking refs based on timestamps
  const trackingRef = useRef({
    headTurnStart: 0,
    headTurnNormalStart: 0,
    noFaceStart: 0,
    noFaceNormalStart: 0,
    phoneStart: 0,
    multiplePersonStart: 0,
    lastReportedType: null
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

        localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: false
        });

        if (!isMounted) {
          localStream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
          setIsCameraActive(true);
          setCameraStatus('Initializing AI models...');

          try { await videoRef.current.play(); } catch (e) { }
        }

        const [coco, face] = await Promise.all([
          cocoSsd.load(),
          faceLandmarksDetection.createDetector(
            faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
            { runtime: 'tfjs' }
          )
        ]);

        if (isMounted) {
          setModels({ coco, face });
          setCameraStatus('Camera active');
        }

      } catch (err) {
        if (!isMounted) return;
        let errorMsg = 'Camera unavailable';
        if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
          errorMsg = 'Camera access is required for AI proctoring.';
        }
        setCameraStatus(errorMsg);
      }
    };

    initProctoring();

    return () => {
      isMounted = false;
      if (localStream) localStream.getTracks().forEach(t => t.stop());
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
      voiceAlertService.cancel();
    };
  }, []);

  const clearViolation = useCallback(() => {
    setActiveViolation(null);
    trackingRef.current.lastReportedType = null;
  }, []);

  const triggerViolation = useCallback(async (type, message, confidence = 1.0) => {
    if (trackingRef.current.lastReportedType === type) return;

    setActiveViolation({ type, message });
    trackingRef.current.lastReportedType = type;
    voiceAlertService.speakViolation(message, type);

    setViolationCounts(prev => ({
      ...prev,
      [type === 'HEAD_TURN' ? 'headTurn' : type === 'MULTIPLE_PERSON' ? 'multiplePerson' : type === 'NO_FACE' ? 'noFace' : 'phone']:
        prev[type === 'HEAD_TURN' ? 'headTurn' : type === 'MULTIPLE_PERSON' ? 'multiplePerson' : type === 'NO_FACE' ? 'noFace' : 'phone'] + 1
    }));

    if (type === 'MULTIPLE_PERSON') setProctorState('MULTIPLE_PERSONS');

    try {
      const ts = new Date().toISOString();
      const payload = {
        examSessionId: examId,
        violationType: type,
        message,
        confidence,
        duration: 2,
        metadata: { questionNumber }
      };
      // For unified endpoint
      await proctoringService.logExamViolation(payload);
      socket.socket?.emit('exam:violation', payload);
    } catch (err) {
      console.error('Error logging violation', err);
    }
  }, [examId, questionNumber, socket]);

  useEffect(() => {
    let intervalId;

    const detectFrame = async () => {
      if (!videoRef.current || !models.coco || !models.face || !isCameraActive || videoRef.current.readyState !== 4) return;

      const now = Date.now();
      const t = trackingRef.current;

      try {
        const [cocoPredictions, faces] = await Promise.all([
          models.coco.detect(videoRef.current),
          models.face.estimateFaces(videoRef.current, { flipHorizontal: false })
        ]);

        // 1. Phone Detection
        const phoneDetected = cocoPredictions.some(p => p.class === 'cell phone' && p.score >= EXAM_MONITOR_CONFIG.phoneConfidence);
        if (phoneDetected) {
          if (!trackingRef.current.phoneStart) trackingRef.current.phoneStart = now;
          else if (now - trackingRef.current.phoneStart > EXAM_MONITOR_CONFIG.phoneConfirmationMs) {
            triggerViolation('PHONE_DETECTED', 'Phones are not allowed');
          }
        } else {
          trackingRef.current.phoneStart = 0;
          if (trackingRef.current.lastReportedType === 'PHONE_DETECTED') clearViolation();
        }

        // 2. Multiple Person Detection
        const persons = cocoPredictions.filter(p => p.class === 'person' && p.score >= EXAM_MONITOR_CONFIG.personConfidence);
        const currentCount = persons.length;
        dispatch(setPersonCount(currentCount));

        if (currentCount > 1) {
          if (!trackingRef.current.multiplePersonStart) trackingRef.current.multiplePersonStart = now;
          else if (now - trackingRef.current.multiplePersonStart > EXAM_MONITOR_CONFIG.multiplePersonConfirmationMs) {
            triggerViolation('MULTIPLE_PERSON', 'More than one person is not allowed');
          }
        } else {
          trackingRef.current.multiplePersonStart = 0;
          if (currentCount === 1) setProctorState('ONE_PERSON');
          else if (currentCount === 0) setProctorState('NO_PERSON');
          if (t.lastReportedType === 'MULTIPLE_PERSON') clearViolation();
        }

        // 3. Face Presence & Head Direction
        if (faces.length === 0) {
           t.headTurnStart = 0;
           t.headTurnNormalStart = 0;
           t.isHeadTurn = false; 
           
           if (currentCount >= 1) {
              // Person is in frame but face not detected (e.g. turned away or angle)
              t.noFaceStart = 0;
              if (t.isNoFace) {
                 t.isNoFace = false;
                 if (t.lastReportedType === 'NO_FACE') clearViolation();
              }
              
              if (!t.headTurnStart) {
                 t.headTurnStart = now;
              } else if (now - t.headTurnStart > EXAM_MONITOR_CONFIG.headTurnDurationMs) {
                 t.isHeadTurn = true;
                 triggerViolation('HEAD_TURN', 'Please look at the screen');
              }
              
              setDebugInfo(prev => ({ ...prev, faceDetected: 'NO', landmarks: 'NO', status: t.isHeadTurn ? 'LOOKING AWAY' : 'PERSON DETECTED (NO FACE)' }));
           } else {
              if (!t.noFaceStart) {
                 t.noFaceStart = now;
              } else if (now - t.noFaceStart > EXAM_MONITOR_CONFIG.noFaceGracePeriodMs) {
                 if (!t.isNoFace) {
                    t.isNoFace = true;
                    triggerViolation('NO_FACE', 'Please return to the camera view');
                 } else {
                    voiceAlertService.speakViolation('Please return to the camera view.', 'NO_FACE');
                 }
              }
              setDebugInfo(prev => ({ ...prev, faceDetected: 'NO', landmarks: 'NO', status: t.isNoFace ? 'FACE NOT DETECTED' : 'GRACE PERIOD' }));
           }
        } else {
          // Face is present
          t.noFaceStart = 0;
          if (t.isNoFace) {
             t.isNoFace = false; // Immediately clears the NO_FACE active state
          }
          
          const keypoints = faces[0]?.keypoints;
          if (keypoints && keypoints.length >= 264) {
            const nose = keypoints[1];
            const leftEye = keypoints[33];
            const rightEye = keypoints[263];
            const chin = keypoints[152];

            if (leftEye && rightEye && nose && chin) {
              // Use Math.hypot to ensure distances are positive and unaffected by mirroring
              const distNoseLeft = Math.hypot(nose.x - leftEye.x, nose.y - leftEye.y);
              const distNoseRight = Math.hypot(nose.x - rightEye.x, nose.y - rightEye.y);

              // Yaw proxy mapped to roughly -50 to 50 "degrees"
              const yaw = ((distNoseLeft - distNoseRight) / (distNoseLeft + distNoseRight + 0.0001)) * 100;

              const eyeCenterY = (leftEye.y + rightEye.y) / 2;
              const distNoseEyeY = nose.y - eyeCenterY;
              const distNoseChinY = chin.y - nose.y;
              const pitch = (distNoseEyeY / (distNoseChinY + 0.0001)) * 100;

              const hp = headPoseRef.current;
              hp.currentYaw = yaw;
              hp.currentPitch = pitch;

              if (hp.isCalibrating) {
                hp.yawSum += yaw;
                hp.pitchSum += pitch;
                hp.calibrationFrames += 1;

                if (hp.calibrationFrames >= 25) { // ~5 seconds at 5fps for smooth calibration
                  hp.neutralYaw = hp.yawSum / hp.calibrationFrames;
                  hp.neutralPitch = hp.pitchSum / hp.calibrationFrames;
                  hp.isCalibrating = false;
                }
              } else {
                const yawDiff = yaw - hp.neutralYaw;
                const pitchDiff = pitch - hp.neutralPitch;

                const YAW_THRESHOLD = EXAM_MONITOR_CONFIG.yawThreshold;
                const PITCH_THRESHOLD = EXAM_MONITOR_CONFIG.pitchThreshold;

                const isLookingLeft = yawDiff < -YAW_THRESHOLD;
                const isLookingRight = yawDiff > YAW_THRESHOLD;
                const isLookingUp = pitchDiff < -PITCH_THRESHOLD;
                const isLookingDown = pitchDiff > PITCH_THRESHOLD;

                if (isLookingLeft) hp.direction = 'LEFT';
                else if (isLookingRight) hp.direction = 'RIGHT';
                else if (isLookingUp) hp.direction = 'UP';
                else if (isLookingDown) hp.direction = 'DOWN';
                else hp.direction = 'CENTER';

                if (isLookingLeft || isLookingRight || isLookingUp || isLookingDown) {
                  t.isHeadTurn = true;
                  if (!t.headTurnStart) {
                    t.headTurnStart = now;
                    t.headTurnNormalStart = 0;
                  } else if (now - t.headTurnStart > EXAM_MONITOR_CONFIG.headTurnDurationMs) {
                    triggerViolation('HEAD_TURN', 'Please look at the screen');
                  }
                } else {
                  t.isHeadTurn = false;
                  t.headTurnStart = 0;

                  // Temporal smoothing for recovery (~500ms)
                  if (t.lastReportedType === 'HEAD_TURN') {
                    if (!t.headTurnNormalStart) {
                      t.headTurnNormalStart = now;
                    } else if (now - t.headTurnNormalStart > 500) {
                      clearViolation();
                      t.headTurnNormalStart = 0;
                    }
                  }
                }
              }

              setDebugInfo({
                faceDetected: 'YES',
                landmarks: 'YES',
                yaw: hp.currentYaw.toFixed(1),
                neutralYaw: hp.neutralYaw.toFixed(1),
                relativeYaw: (!hp.isCalibrating ? (hp.currentYaw - hp.neutralYaw).toFixed(1) : '0.0'),
                pitch: hp.currentPitch.toFixed(1),
                direction: hp.direction,
                status: t.isHeadTurn ? 'LOOKING AWAY' : 'NORMAL',
                calibrating: hp.isCalibrating ? 'NOT READY' : 'READY'
              });
            }
            trackingRef.current.noFaceStart = now;
            trackingRef.current.noFaceNormalStart = 0;
          } else if (now - trackingRef.current.noFaceStart > EXAM_MONITOR_CONFIG.noFaceGracePeriodMs) {
            triggerViolation('NO_FACE', 'Please return to the camera view');
            voiceAlertService.speakViolation('Please return to the camera view.', 'NO_FACE');
          }

          setDebugInfo(prev => prev ? { ...prev, faceDetected: 'NO', landmarks: 'NO', status: 'FACE NOT DETECTED' } : null);
        }

        // Face returned recovery (immediate)
        if (faces.length > 0) {
          trackingRef.current.noFaceStart = 0;
          trackingRef.current.noFaceNormalStart = 0;
          if (trackingRef.current.lastReportedType === 'NO_FACE') {
            clearViolation();
          }
        }
      } catch (err) {
        // Model execution might throw if tab is backgrounded
      }
    };

    if (models.coco && models.face && isCameraActive) {
      intervalId = setInterval(detectFrame, 200); // 5 FPS
    }
    return () => clearInterval(intervalId);
  }, [models, isCameraActive, dispatch, triggerViolation, clearViolation]);

  return (
    <div className="relative flex flex-col p-3 rounded-2xl border backdrop-blur-md shadow-lg transition-colors border-hair bg-surface-2/80">

      <ExamViolationAlert activeViolation={activeViolation} />

      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
        {activeViolation ? (
          <span className="flex items-center gap-1 text-red-500"><ShieldAlert className="w-4 h-4" /> 🛡 AI PROCTOR 🔴</span>
        ) : (
          <span className="flex items-center gap-1 text-slate-300">🛡 AI PROCTOR 🟢</span>
        )}
        <span className={activeViolation ? "text-red-500 font-bold" : "text-mint"}>
          {activeViolation ? 'ATTENTION REQUIRED' : 'MONITORING ACTIVE'}
        </span>
      </div>

      <div className="text-center text-[10px] text-slate-500 mb-1 uppercase tracking-widest font-bold">LIVE CAMERA</div>

      <div className={`relative overflow-hidden rounded-xl border-2 transition-all bg-black ${activeViolation ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'border-slate-700/50'}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-48 h-36 object-cover bg-black"
        />
        {!isCameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-[11px] text-slate-400">
            <span className={cameraStatus.includes('error') || cameraStatus.includes('unavailable') || cameraStatus.includes('required') ? "text-red-400 font-medium" : ""}>
              {cameraStatus}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 bg-black/40 rounded-lg p-2 flex flex-col gap-1">
        <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider border-b border-white/10 pb-1 mb-1">
          Violations: {violationCounts.headTurn + violationCounts.multiplePerson + violationCounts.phone + violationCounts.noFace}
        </div>
        <div className="flex justify-between text-xs text-slate-300">
          <span>Looking Away:</span>
          <span className={violationCounts.headTurn > 0 ? "text-red-400 font-bold" : ""}>{violationCounts.headTurn}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-300">
          <span>Multiple People:</span>
          <span className={violationCounts.multiplePerson > 0 ? "text-red-400 font-bold" : ""}>{violationCounts.multiplePerson}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-300">
          <span>Phone Detected:</span>
          <span className={violationCounts.phone > 0 ? "text-red-400 font-bold" : ""}>{violationCounts.phone}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-300">
          <span>Student Not Visible:</span>
          <span className={violationCounts.noFace > 0 ? "text-red-400 font-bold" : ""}>{violationCounts.noFace}</span>
        </div>
      </div>

      <div className="mt-3 bg-black/80 rounded-lg p-3 flex flex-col gap-1 text-[11px] text-cyan-400 font-mono tracking-wider border border-cyan-500/30">
        <div className="text-center mb-1 font-bold text-white border-b border-cyan-500/30 pb-1">HEAD DETECTION DEBUG</div>
        <div className="flex justify-between"><span>Face detected:</span><span>{debugInfo.faceDetected}</span></div>
        <div className="flex justify-between"><span>Landmarks:</span><span>{debugInfo.landmarks}</span></div>
        <div className="flex justify-between mt-1 border-t border-cyan-500/10 pt-1"><span>Yaw:</span><span>{debugInfo.yaw}°</span></div>
        <div className="flex justify-between text-cyan-600"><span>Neutral yaw:</span><span>{debugInfo.neutralYaw}°</span></div>
        <div className="flex justify-between font-bold text-cyan-300"><span>Relative yaw:</span><span>{debugInfo.relativeYaw}°</span></div>
        <div className="flex justify-between mt-1 border-t border-cyan-500/10 pt-1"><span>Direction:</span><span>{debugInfo.direction}</span></div>
        <div className="flex justify-between"><span>Head state:</span><span className={debugInfo.status === 'LOOKING AWAY' || debugInfo.status === 'FACE NOT DETECTED' ? 'text-red-400 font-bold' : ''}>{debugInfo.status}</span></div>
        <div className="flex justify-between mt-1 border-t border-cyan-500/10 pt-1"><span>Calibration:</span><span className={debugInfo.calibrating === 'NOT READY' ? 'text-yellow-400' : 'text-green-400'}>{debugInfo.calibrating}</span></div>
      </div>
    </div>
  );
};

export default ProctoringPanel;
