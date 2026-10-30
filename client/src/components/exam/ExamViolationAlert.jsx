import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export const ExamViolationAlert = ({ activeViolation }) => {
  // LookingAwayWarning handles the top warning banner for HEAD_TURN cleanly without duplicate clutter
  if (!activeViolation || activeViolation.type === 'HEAD_TURN') return null;

  return (
    <AnimatePresence>
      <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none max-w-xl w-[90vw]"
        >
          <div className="bg-red-950/95 border-2 border-red-500 rounded-2xl px-6 py-4 shadow-[0_0_40px_rgba(239,68,68,0.6)] backdrop-blur-xl flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <ShieldAlert className="w-6 h-6 animate-pulse text-red-500" />
              <span className="text-xs font-black tracking-widest uppercase">PROCTOR INTEGRITY ALERT</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-white tracking-wide">
              {activeViolation.message}
            </div>
            <div className="text-xs text-red-300 font-semibold mt-1">
              Action recorded in exam session log.
            </div>
          </div>
        </motion.div>
    </AnimatePresence>
  );
};
