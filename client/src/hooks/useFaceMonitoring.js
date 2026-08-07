import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faceService } from '../services/MediaPipeFaceService';
import socketService from '../services/socketService';
import { violationLogger } from '../services/ViolationLogger';
import { 
  setFaceDetected, 
  incrementWarning, 
  incrementViolation,
  setCameraStatus 
} from '../redux/slices/proctoringSlice';

export const useFaceMonitoring = (videoRef, sessionId, isActive) => {
  const dispatch = useDispatch();
  const { faceDetected, cameraStatus } = useSelector((state) => state.proctoring);
  
  const faceLostTimerRef = useRef(null);
  const faceLostStartTimeRef = useRef(null);
  const [showWarning, setShowWarning] = useState(false);
  const hasLoggedViolationRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

  // Result handler moved to initFaceDetection directly

    // We don't auto-initialize here anymore; we rely on the component calling initFaceDetection 
    // when the video stream is actually ready.

    return () => {
      if (faceLostTimerRef.current) {
        clearInterval(faceLostTimerRef.current);
      }
      faceService.stop();
    };
  }, [isActive, sessionId, dispatch]);

  const initFaceDetection = async () => {
    try {
      if (videoRef.current && videoRef.current.video) {
        dispatch(setCameraStatus('INITIALIZING'));
        await faceService.initialize(videoRef.current.video, (result) => {
          dispatch(setFaceDetected(result));

          if (result.detected) {
            if (faceLostTimerRef.current) {
              clearInterval(faceLostTimerRef.current);
              faceLostTimerRef.current = null;
            }
            faceLostStartTimeRef.current = null;
            setShowWarning(false);
            hasLoggedViolationRef.current = false;
            socketService.emitFaceDetected(sessionId, result.confidence);
          } else {
            if (!faceLostStartTimeRef.current) {
              faceLostStartTimeRef.current = Date.now();
              socketService.emitFaceLost(sessionId);
              
              faceLostTimerRef.current = setInterval(() => {
                const timeLost = (Date.now() - faceLostStartTimeRef.current) / 1000;
                
                if (timeLost >= 5 && !showWarning) {
                  setShowWarning(true);
                  dispatch(incrementWarning());
                  socketService.emitWarningIssued(sessionId);
                }

                if (timeLost >= 10 && !hasLoggedViolationRef.current) {
                  hasLoggedViolationRef.current = true;
                  dispatch(incrementViolation());
                  const duration = Math.round(timeLost);
                  socketService.emitViolationLogged(sessionId, duration);
                  violationLogger.logFaceViolation(sessionId, 'FACE_NOT_FOUND', duration, 0).catch(err => console.error(err));
                }
              }, 1000);
            }
          }
        });
        dispatch(setCameraStatus('READY'));
      }
    } catch (error) {
      console.error("Failed to initialize Face Detection", error);
      dispatch(setCameraStatus('ERROR'));
    }
  };

  return { showWarning, cameraStatus, faceDetected, initFaceDetection };
};
