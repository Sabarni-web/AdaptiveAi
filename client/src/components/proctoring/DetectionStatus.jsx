import React from 'react';
import { motion } from 'framer-motion';

const DetectionStatus = ({ faceDetected, confidence }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700 shadow-xl flex items-center gap-3 z-20"
    >
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full animate-pulse ${faceDetected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm font-medium text-white">
          {faceDetected ? 'Face Detected' : 'Face Missing'}
        </span>
      </div>
      
      {faceDetected && (
        <div className="border-l border-gray-600 pl-3">
          <span className="text-xs text-gray-300">
            {Math.round(confidence)}% Match
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default DetectionStatus;
