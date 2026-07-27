import React from 'react';
import clsx from 'clsx';

export const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  count = 1,
  className = '',
}) => {
  const baseStyles = 'animate-shimmer bg-slate-200 dark:bg-slate-700 rounded';

  const variants = {
    text: 'h-4 w-full rounded-sm',
    circular: 'rounded-full',
    rectangular: '',
    card: 'h-32 w-full rounded-xl',
  };

  const getStyle = () => {
    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;
    if (variant === 'circular' && !height && width) {
      style.height = width;
    }
    return style;
  };

  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={clsx(baseStyles, variants[variant], className)}
          style={getStyle()}
        />
      ))}
    </>
  );
};
