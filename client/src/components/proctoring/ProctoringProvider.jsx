import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsMonitoring, resetProctoring } from '../../redux/slices/proctoringSlice';

const ProctoringContext = createContext(null);

export const useProctoring = () => useContext(ProctoringContext);

export const ProctoringProvider = ({ children, sessionId }) => {
  const dispatch = useDispatch();
  const [examStarted, setExamStarted] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(resetProctoring());
    };
  }, [dispatch]);

  const handleStartExam = () => {
    setExamStarted(true);
    dispatch(setIsMonitoring(true));
  };

  const contextValue = {
    examStarted,
    startExam: handleStartExam,
    isReady: true,
  };

  return (
    <ProctoringContext.Provider value={contextValue}>
      {/* Block content until exam starts, if required */}
      {!examStarted ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to begin?</h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 text-left">
              <ul className="list-disc pl-4 space-y-2">
                <li>Ensure you are in a quiet environment.</li>
                <li>Do not switch tabs during the exam.</li>
              </ul>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30"
            >
              Start Examination
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </ProctoringContext.Provider>
  );
};
