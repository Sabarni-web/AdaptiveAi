import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import DetectionStatus from './DetectionStatus';
import { useFaceMonitoring } from '../../hooks/useFaceMonitoring';
import { useDispatch } from 'react-redux';
import { setCameraStatus } from '../../redux/slices/proctoringSlice';

const CameraPreview = ({ sessionId, isActive, onWarningChange }) => {
  const webcamRef = useRef(null);
  const dispatch = useDispatch();
  
  const { showWarning, cameraStatus, faceDetected, initFaceDetection } = useFaceMonitoring(
    webcamRef, 
    sessionId, 
    isActive
  );

  useEffect(() => {
    if (onWarningChange) {
      onWarningChange(showWarning);
    }
  }, [showWarning, onWarningChange]);

  const handleUserMedia = () => {
    // Only initialize when video stream is actively flowing
    initFaceDetection();
  };

  const handleUserMediaError = () => {
    dispatch(setCameraStatus('DENIED'));
  };

  return (
    <div className="fixed bottom-6 right-6 w-64 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800/50 z-40 bg-black backdrop-blur-md">
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={true}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleUserMediaError}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay to show initializing state */}
      {cameraStatus === 'INITIALIZING' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
        </div>
      )}

      {/* Overlay if permission denied */}
      {cameraStatus === 'DENIED' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 p-4 text-center z-10">
          <span className="text-white text-sm font-bold">Camera Access Required</span>
          <span className="text-red-200 text-xs mt-1">Please allow camera permissions to continue.</span>
        </div>
      )}

      {cameraStatus === 'READY' && (
        <DetectionStatus 
          faceDetected={faceDetected} 
          confidence={0} 
        />
      )}
    </div>
  );
};

export default CameraPreview;
