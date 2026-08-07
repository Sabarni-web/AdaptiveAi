import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsMonitoring, resetProctoring } from '../../redux/slices/proctoringSlice';
import CameraPreview from './CameraPreview';
import WarningPopup from './WarningPopup';

const ProctoringContext = createContext(null);

export const useProctoring = () => useContext(ProctoringContext);

export const ProctoringProvider = ({ children, sessionId, requireFaceToStart = true }) => {
  const dispatch = useDispatch();
  const [examStarted, setExamStarted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { faceDetected, cameraStatus } = useSelector(state => state.proctoring);

  useEffect(() => {
    return () => {
      dispatch(resetProctoring());
    };
  }, [dispatch]);

  const handleStartExam = () => {
    if (requireFaceToStart && !faceDetected) {
      alert("No Face Detected. Please position yourself in front of the camera.");
      return;
    }
    setExamStarted(true);
    dispatch(setIsMonitoring(true));
  };

  const contextValue = {
    examStarted,
    startExam: handleStartExam,
    isReady: faceDetected && cameraStatus === 'READY',
    cameraStatus
  };

  return (
    <ProctoringContext.Provider value={contextValue}>
      {/* We always show the camera preview to allow detection before exam starts */}
      <CameraPreview 
        sessionId={sessionId} 
        isActive={true} 
        onWarningChange={setShowWarning}
      />
      
      <WarningPopup show={showWarning && examStarted} />

      {/* Block content until exam starts, if required */}
      {!examStarted ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to begin?</h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 text-left">
              <ul className="list-disc pl-4 space-y-2">
                <li>Ensure you are in a well-lit room.</li>
                <li>Position your face clearly in the camera frame.</li>
                <li>Do not look away from the screen for extended periods.</li>
                <li>Looking away for more than 10 seconds will log an integrity violation.</li>
              </ul>
            </div>

            {cameraStatus === 'DENIED' ? (
              <div className="text-red-500 font-medium mb-4">
                Camera access is required to proceed. Please check your browser permissions.
              </div>
            ) : (
              <button
                onClick={handleStartExam}
                disabled={!faceDetected}
                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all ${
                  faceDetected 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {faceDetected ? 'Start Examination' : 'Waiting for face detection...'}
              </button>
            )}
          </div>
        </div>
      ) : (
        children
      )}
    </ProctoringContext.Provider>
  );
};
