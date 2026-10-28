import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert, ShieldCheck, AlertTriangle as ShieldWarning } from 'lucide-react';
import { toast } from 'sonner';
import { setPersonCount, setWarningLevel, deductIntegrityScore, incrementViolations, setHeadPose } from '../../redux/slices/proctorSlice';
import proctoringService from '../../services/proctoringService';
import { useSocket } from '../../hooks/useSocket';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { voiceAlertService } from '../../services/voiceAlertService';
import { ExamViolationAlert } from './ExamViolationAlert';

const EXAM_MONITOR_CONFIG = {
  headTurnDurationMs: 1400, // Require sustained head turn (>1.4s) before flagging
  noFaceGracePeriodMs: 3500, // Grace period before reporting student not visible
  lostFaceGracePeriodMs: 2500, // Grace period when person is detected but face mesh temporarily lost
  phoneConfirmationMs: 350, // Trigger promptly on phone presence
  multiplePersonConfirmationMs: 600, // Confirmation time for multiple persons
  phoneConfidence: 0.38, // Optimized threshold to capture phones held in hand or on desk
  personConfidence: 0.30, // Confident person threshold
  yawThreshold: 22, // Natural angle allowing scanning questions across screen without false triggers
  pitchThreshold: 25 // Natural angle allowing looking down at keyboard/bottom of screen
};

// Target classes from COCO-SSD associated with phones and mobile devices
const PHONE_CLASSES = new Set(['cell phone', 'remote', 'electronic device', 'telephone']);

export const ProctoringPanel = ({ examId, questionNumber }) => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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
    neutralPitch: 100,
    currentYaw: 0,
    currentPitch: 100,
    direction: 'CENTER'
  });

  // Debounce tracking refs based on timestamps
  const trackingRef = useRef({
    headTurnStart: 0,
    headTurnNormalStart: 0,
    noFaceStart: 0,
    noFaceNormalStart: 0,
    phoneStart: 0,
    phoneNormalStart: 0,
    multiplePersonStart: 0,
    multiplePersonNormalStart: 0,
    lastReportedType: null,
    lastPersonSeenTime: Date.now(),
    lastFaceSeenTime: Date.now(),
    isHeadTurn: false,
    isNoFace: false
  });

  const isDetectingRef = useRef(false);

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
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
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
          cocoSsd.load({ base: 'lite_mobilenet_v2' }),
          faceLandmarksDetection.createDetector(
            faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
            { runtime: 'tfjs', maxFaces: 1, refineLandmarks: false }
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
    dispatch(setWarningLevel('SAFE'));
  }, [dispatch]);

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

    dispatch(incrementViolations());
    dispatch(deductIntegrityScore(type === 'HEAD_TURN' ? 5 : type === 'PHONE_DETECTED' ? 15 : 10));
    dispatch(setWarningLevel('MEDIUM'));

    if (type === 'MULTIPLE_PERSON') setProctorState('MULTIPLE_PERSONS');

    try {
      const payload = {
        examSessionId: examId,
        violationType: type,
        message,
        confidence,
        duration: 2,
        metadata: { questionNumber }
      };
      await proctoringService.logExamViolation(payload);
      socket.socket?.emit('exam:violation', payload);

      if (type === 'HEAD_TURN') {
        socket.socket?.emit('lookingAwayViolation', {
          sessionId: examId,
          duration: 2,
          direction: headPoseRef.current.direction || 'AWAY'
        });
      }
    } catch (err) {
      console.error('Error logging violation', err);
    }
  }, [examId, questionNumber, socket, dispatch]);

  useEffect(() => {
    let animFrameId;

    const detectFrame = async () => {
      if (
        !videoRef.current ||
        !models.coco ||
        !models.face ||
        !isCameraActive ||
        videoRef.current.readyState < 2 ||
        isDetectingRef.current
      ) {
        animFrameId = setTimeout(detectFrame, 120);
        return;
      }

      isDetectingRef.current = true;
      const now = Date.now();
      const t = trackingRef.current;
      const videoEl = videoRef.current;

      try {
        const [cocoPredictions, faces] = await Promise.all([
          models.coco.detect(videoEl),
          models.face.estimateFaces(videoEl, { flipHorizontal: false })
        ]);

        // Draw bounding boxes on canvas for live proctor feedback
        const canvas = canvasRef.current;
        if (canvas && videoEl.videoWidth && videoEl.videoHeight) {
          if (canvas.width !== videoEl.videoWidth || canvas.height !== videoEl.videoHeight) {
            canvas.width = videoEl.videoWidth;
            canvas.height = videoEl.videoHeight;
          }
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw phone detections
          cocoPredictions.forEach(pred => {
            const isPhone = PHONE_CLASSES.has(pred.class.toLowerCase()) && pred.score >= EXAM_MONITOR_CONFIG.phoneConfidence;
            const isPerson = pred.class.toLowerCase() === 'person' && pred.score >= EXAM_MONITOR_CONFIG.personConfidence;
            
            if (isPhone) {
              const [x, y, w, h] = pred.bbox;
              ctx.strokeStyle = '#ef4444';
              ctx.lineWidth = 3;
              ctx.strokeRect(x, y, w, h);
              ctx.fillStyle = '#ef4444';
              ctx.font = 'bold 14px monospace';
              ctx.fillText(`PHONE ${(pred.score * 100).toFixed(0)}%`, x, Math.max(y - 5, 15));
            } else if (isPerson && cocoPredictions.filter(p => p.class === 'person').length > 1) {
              const [x, y, w, h] = pred.bbox;
              ctx.strokeStyle = '#f97316';
              ctx.lineWidth = 2;
              ctx.strokeRect(x, y, w, h);
              ctx.fillStyle = '#f97316';
              ctx.font = 'bold 12px monospace';
              ctx.fillText(`PERSON`, x, Math.max(y - 5, 12));
            }
          });

          // Draw face landmark indicator when face is tracked
          if (faces.length > 0 && faces[0]?.box) {
            const b = faces[0].box;
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(b.xMin, b.yMin, b.width, b.height);
          }
        }

        // 1. Phone Detection (Checks 'cell phone', 'remote', 'telephone' etc.)
        const detectedPhoneObj = cocoPredictions.find(
          p => PHONE_CLASSES.has(p.class.toLowerCase()) && p.score >= EXAM_MONITOR_CONFIG.phoneConfidence
        );
        const phoneDetected = !!detectedPhoneObj;

        if (phoneDetected) {
          t.phoneNormalStart = 0;
          if (!t.phoneStart) t.phoneStart = now;
          else if (now - t.phoneStart > EXAM_MONITOR_CONFIG.phoneConfirmationMs) {
            triggerViolation('PHONE_DETECTED', 'Phones are not allowed', detectedPhoneObj.score);
          }
        } else {
          t.phoneStart = 0;
          if (t.lastReportedType === 'PHONE_DETECTED') {
            if (!t.phoneNormalStart) t.phoneNormalStart = now;
            else if (now - t.phoneNormalStart > 400) {
              clearViolation();
              t.phoneNormalStart = 0;
            }
          }
        }

        // 2. Multiple Person Detection
        // Count persons from COCO-SSD and distinct faces from Face Mesh
        const personBoxes = cocoPredictions.filter(
          p => p.class === 'person' && p.score >= EXAM_MONITOR_CONFIG.personConfidence
        );
        const faceCount = faces.length;
        const personCountCoco = personBoxes.length;

        // Effective people count: max of faces detected or person bodies detected
        const effectivePeopleCount = Math.max(faceCount, personCountCoco);
        dispatch(setPersonCount(effectivePeopleCount));

        if (effectivePeopleCount >= 1) {
          t.lastPersonSeenTime = now;
        }

        if (effectivePeopleCount > 1) {
          t.multiplePersonNormalStart = 0;
          if (!t.multiplePersonStart) t.multiplePersonStart = now;
          else if (now - t.multiplePersonStart > EXAM_MONITOR_CONFIG.multiplePersonConfirmationMs) {
            triggerViolation('MULTIPLE_PERSON', 'More than one person is not allowed');
          }
        } else {
          t.multiplePersonStart = 0;
          if (effectivePeopleCount === 1) setProctorState('ONE_PERSON');
          else if (effectivePeopleCount === 0) setProctorState('NO_PERSON');

          if (t.lastReportedType === 'MULTIPLE_PERSON') {
            if (!t.multiplePersonNormalStart) t.multiplePersonNormalStart = now;
            else if (now - t.multiplePersonNormalStart > 400) {
              clearViolation();
              t.multiplePersonNormalStart = 0;
            }
          }
        }

        // 3. Face & Head Pose Tracking
        const isPersonPresent = effectivePeopleCount >= 1 || (now - t.lastPersonSeenTime < 2500);

        if (faces.length > 0) {
          t.lastFaceSeenTime = now;
          t.noFaceStart = 0;
          t.lostFaceStart = 0;
          t.isNoFace = false;
          if (t.lastReportedType === 'NO_FACE') {
            clearViolation();
          }

          const primaryFace = faces[0];
          const keypoints = primaryFace?.keypoints;

          if (keypoints && keypoints.length >= 264) {
            const nose = keypoints[1];
            const leftEye = keypoints[33];
            const rightEye = keypoints[263];
            const chin = keypoints[152];

            if (leftEye && rightEye && nose && chin) {
              const distNoseLeft = Math.hypot(nose.x - leftEye.x, nose.y - leftEye.y);
              const distNoseRight = Math.hypot(nose.x - rightEye.x, nose.y - rightEye.y);

              // Yaw calculation (-50 to 50 scale)
              const yaw = ((distNoseLeft - distNoseRight) / (distNoseLeft + distNoseRight + 0.0001)) * 100;

              const eyeCenterY = (leftEye.y + rightEye.y) / 2;
              const distNoseEyeY = nose.y - eyeCenterY;
              const distNoseChinY = chin.y - nose.y;
              const pitch = (distNoseEyeY / (distNoseChinY + 0.0001)) * 100;

              const hp = headPoseRef.current;
              hp.currentYaw = yaw;
              hp.currentPitch = pitch;

              // Fast calibration when facing forward
              if (hp.isCalibrating) {
                if (Math.abs(yaw) < 12 && pitch > 65 && pitch < 135) {
                  hp.yawSum += yaw;
                  hp.pitchSum += pitch;
                  hp.calibrationFrames += 1;

                  if (hp.calibrationFrames >= 6) {
                    hp.neutralYaw = Math.max(-8, Math.min(8, hp.yawSum / hp.calibrationFrames));
                    hp.neutralPitch = Math.max(80, Math.min(120, hp.pitchSum / hp.calibrationFrames));
                    hp.isCalibrating = false;
                  }
                }
              }

              const yawDiff = yaw - hp.neutralYaw;
              const pitchDiff = pitch - hp.neutralPitch;

              const isLookingLeft = yawDiff < -EXAM_MONITOR_CONFIG.yawThreshold;
              const isLookingRight = yawDiff > EXAM_MONITOR_CONFIG.yawThreshold;
              const isLookingUp = pitchDiff < -EXAM_MONITOR_CONFIG.pitchThreshold;
              const isLookingDown = pitchDiff > EXAM_MONITOR_CONFIG.pitchThreshold;

              if (isLookingLeft) hp.direction = 'LEFT';
              else if (isLookingRight) hp.direction = 'RIGHT';
              else if (isLookingUp) hp.direction = 'UP';
              else if (isLookingDown) hp.direction = 'DOWN';
              else hp.direction = 'CENTER';

              const isLookingAway = isLookingLeft || isLookingRight || isLookingUp || isLookingDown;

              if (isLookingAway) {
                t.isHeadTurn = true;
                t.headTurnNormalStart = 0;
                if (!t.headTurnStart) {
                  t.headTurnStart = now;
                } else if (now - t.headTurnStart > EXAM_MONITOR_CONFIG.headTurnDurationMs) {
                  triggerViolation('HEAD_TURN', 'Please look at the screen');
                  dispatch(setHeadPose({
                    headDirection: hp.direction,
                    yaw,
                    pitch,
                    focusStatus: 'LOOKING_AWAY'
                  }));
                }
              } else {
                t.isHeadTurn = false;
                t.headTurnStart = 0;

                if (t.lastReportedType === 'HEAD_TURN') {
                  if (!t.headTurnNormalStart) {
                    t.headTurnNormalStart = now;
                  } else if (now - t.headTurnNormalStart > 350) {
                    clearViolation();
                    t.headTurnNormalStart = 0;
                    dispatch(setHeadPose({
                      headDirection: 'FORWARD',
                      yaw,
                      pitch,
                      focusStatus: 'FOCUSED'
                    }));
                  }
                }
              }

              setDebugInfo({
                faceDetected: `YES (${faces.length})`,
                landmarks: 'YES',
                yaw: hp.currentYaw.toFixed(1),
                neutralYaw: hp.neutralYaw.toFixed(1),
                relativeYaw: (!hp.isCalibrating ? yawDiff.toFixed(1) : '0.0'),
                pitch: hp.currentPitch.toFixed(1),
                direction: hp.direction,
                status: t.isHeadTurn ? 'LOOKING AWAY' : phoneDetected ? 'PHONE DETECTED' : effectivePeopleCount > 1 ? 'MULTIPLE PEOPLE' : 'NORMAL',
                calibrating: hp.isCalibrating ? 'CALIBRATING' : 'READY'
              });
            }
          }
        } else {
          // Face mesh keypoints NOT detected in this frame (faces.length === 0)
          if (isPersonPresent) {
            // Student is in frame and centered (confirmed by COCO-SSD person detection).
            // Do NOT trigger HEAD_TURN or penalize looking away!
            t.headTurnStart = 0;
            t.headTurnNormalStart = 0;
            t.isHeadTurn = false;
            t.lostFaceStart = 0;
            t.noFaceStart = 0;
            t.isNoFace = false;

            // If a previous head turn or no face violation was active, clear it now
            if (t.lastReportedType === 'HEAD_TURN' || t.lastReportedType === 'NO_FACE') {
              clearViolation();
            }

            // Keep status as FOCUSED so the "Please Look at the Screen" banner does NOT pop up
            dispatch(setHeadPose({
              headDirection: 'FORWARD',
              yaw: 0,
              pitch: 0,
              focusStatus: 'FOCUSED'
            }));

            setDebugInfo(prev => ({
              ...prev,
              faceDetected: 'PRESENT (MONITORING)',
              landmarks: 'TRACKING',
              direction: 'CENTER',
              status: phoneDetected ? 'PHONE DETECTED' : effectivePeopleCount > 1 ? 'MULTIPLE PEOPLE' : 'FOCUSED'
            }));
          } else {
            // Neither person nor face detected: student stepped away from camera
            t.headTurnStart = 0;
            t.headTurnNormalStart = 0;
            t.lostFaceStart = 0;
            t.isHeadTurn = false;

            if (!t.noFaceStart) {
              t.noFaceStart = now;
            } else if (now - t.noFaceStart > EXAM_MONITOR_CONFIG.noFaceGracePeriodMs) {
              if (!t.isNoFace) {
                t.isNoFace = true;
                triggerViolation('NO_FACE', 'Please return to the camera view');
                dispatch(setHeadPose({
                  headDirection: 'AWAY',
                  focusStatus: 'LOOKING_AWAY'
                }));
              } else {
                voiceAlertService.speakViolation('Please return to the camera view.', 'NO_FACE');
              }
            }

            setDebugInfo(prev => ({
              ...prev,
              faceDetected: 'NO',
              landmarks: 'NO',
              status: t.isNoFace ? 'STUDENT NOT VISIBLE' : 'AWAY (GRACE PERIOD)'
            }));
          }
        }
      } catch (err) {
        // Model execution might throw if tab is backgrounded
      } finally {
        isDetectingRef.current = false;
        animFrameId = setTimeout(detectFrame, 120);
      }
    };

    if (models.coco && models.face && isCameraActive) {
      animFrameId = setTimeout(detectFrame, 120);
    }
    return () => clearTimeout(animFrameId);
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
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-48 h-36 pointer-events-none object-cover"
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
