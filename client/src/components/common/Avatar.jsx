import React, { useState } from 'react';
import clsx from 'clsx';

export const Avatar = ({
  src,
  alt = 'User avatar',
  fallback,
  size = 'md',
  status,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-slate-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={clsx(
          'flex items-center justify-center rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold border border-slate-100 dark:border-slate-800',
          sizes[size],
          className
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{fallback ? getInitials(fallback) : '?'}</span>
        )}
      </div>
      {status && statusColors[status] && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-slate-900',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};
