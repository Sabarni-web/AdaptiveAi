import React, { useEffect } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

export const Drawer = ({
  isOpen,
  onClose,
  position = 'right',
  title,
  children,
  size = '380px',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const positions = {
    right: 'right-0 top-0 bottom-0 h-full border-l animate-[slideInRight_0.2s_ease-out]',
    left: 'left-0 top-0 bottom-0 h-full border-r animate-[slideInLeft_0.2s_ease-out]',
    top: 'left-0 right-0 top-0 w-full border-b animate-[slideInTop_0.2s_ease-out]',
    bottom: 'left-0 right-0 bottom-0 w-full border-t animate-[slideInBottom_0.2s_ease-out]',
  };

  const getStyle = () => {
    if (position === 'left' || position === 'right') {
      return { width: size };
    }
    return { height: size };
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        style={getStyle()}
        className={clsx(
          'absolute bg-white dark:bg-slate-800 shadow-xl overflow-hidden border-slate-205 dark:border-slate-700 flex flex-col',
          positions[position]
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInTop {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
        @keyframes slideInBottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
