import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export const LookingAwayWarning = () => {
  const { focusStatus } = useSelector(state => state.proctor);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    let timer;
    if (focusStatus === 'LOOKING_AWAY') {
      // Delay showing warning by 3 seconds
      timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [focusStatus]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-red-900/90 border-2 border-red-500 text-white px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)] backdrop-blur-md"
        >
          <div className="bg-red-500 p-2 rounded-full animate-pulse">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wide">Please Look at the Screen!</span>
            <span className="text-xs font-medium text-red-200">Prolonged looking away will result in integrity penalties.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
