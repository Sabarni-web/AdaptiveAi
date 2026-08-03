import React from 'react';
import clsx from 'clsx';

export const Badge = ({ variant = 'default', size = 'md', children, className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full';

  const variants = {
    default: 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
    success: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
    warning: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
    danger: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
