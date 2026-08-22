import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export const ExamViolationAlert = ({ activeViolation }) => {
  return (
    <AnimatePresence>
      {activeViolation && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-0 top-4 mx-auto w-fit z-50 pointer-events-none"
        >
          <div className="bg-red-950/90 border-2 border-red-500 rounded-xl px-6 py-4 shadow-[0_0_30px_rgba(239,68,68,0.4)] backdrop-blur-md flex flex-col items-center">
            <div className="flex items-center gap-3 text-red-500 mb-1">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-bold tracking-widest uppercase">Exam Monitoring Alert</span>
            </div>
            <div className="text-xl font-bold text-white uppercase tracking-wider">
              {activeViolation.message}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
