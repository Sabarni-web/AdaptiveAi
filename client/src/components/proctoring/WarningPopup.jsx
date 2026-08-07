import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const WarningPopup = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: -50 }}
          className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-red-500/90 backdrop-blur-md border border-red-400 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-300 animate-pulse" />
            <div>
              <h3 className="font-bold text-lg">Warning: Face Not Detected</h3>
              <p className="text-sm text-red-100">Please return to the camera immediately.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WarningPopup;
