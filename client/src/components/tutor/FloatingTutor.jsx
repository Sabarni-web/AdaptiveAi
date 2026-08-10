import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';
import { TutorChatPanel } from './TutorChatPanel';

export const FloatingTutor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isDraggingRef = useRef(false);
  
  const [tooltipMessage, setTooltipMessage] = useState('Ask AdaptiveAI');
  const [showGreeting, setShowGreeting] = useState(false);
  
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // We only want to restore position if we're not using default framer-motion constraints that pull it back
    // Framer motion drag can be tricky with absolute positioning, so we'll use a fixed position trick
    setHasMounted(true);
    
    // Greeting sequence
    setShowGreeting(true);
    setTooltipMessage('Hello learner 👋');
    
    const timer1 = setTimeout(() => {
      setTooltipMessage('Any kind of doubt? Feel free to ask me');
    }, 3500);
    
    const timer2 = setTimeout(() => {
      setShowGreeting(false);
      setTimeout(() => setTooltipMessage('Ask AdaptiveAI'), 500); // Reset for hover
    }, 20000); // Wait 20 seconds before disappearing
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = (event, info) => {
    // Small delay to prevent onClick from firing immediately after drag ends
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 150);
  };

  const handleClick = (e) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      return;
    }
    setIsOpen(true);
  };

  if (!hasMounted) return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[90]">
        <motion.div
          drag
          dragConstraints={windowSize.width > 0 ? { left: 0, right: windowSize.width - 56, top: 0, bottom: windowSize.height - 56 } : false}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={{ x: window.innerWidth - 100, y: window.innerHeight - 100 }}
          className="absolute pointer-events-auto cursor-grab active:cursor-grabbing flex flex-col items-center group"
          style={{ touchAction: 'none' }}
        >
          <div className={`absolute -top-10 transition-opacity bg-white dark:bg-[#1a2234] text-gray-900 dark:text-white text-xs px-3 py-1.5 rounded-md border border-gray-200 dark:border-white/10 whitespace-nowrap shadow-xl pointer-events-none ${showGreeting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {tooltipMessage}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#1a2234] border-b border-r border-gray-200 dark:border-white/10 rotate-45"></div>
          </div>

          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-gradient-to-tr from-mint to-teal-500 rounded-full shadow-[0_0_30px_rgba(20,241,149,0.3)] flex flex-col items-center justify-center text-dark-eval border-2 border-white/20 relative overflow-hidden"
          >
            {/* Sparkle Animation */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"
            />
            
            <Bot className="w-6 h-6 text-dark-eval" />
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <TutorChatPanel 
            isOpen={isOpen} 
            onClose={() => setIsOpen(false)} 
            onMinimize={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};
