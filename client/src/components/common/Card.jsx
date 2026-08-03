import React from 'react';
import clsx from 'clsx';

export const Card = ({
  children,
  title,
  description,
  footer,
  className = '',
  hover = false,
  clickable = false,
  onClick,
}) => {
  const CardElement = clickable ? 'button' : 'div';

  return (
    <CardElement
      onClick={clickable ? onClick : undefined}
      className={clsx(
        'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-left w-full transition-all duration-200',
        hover && 'hover:shadow-md hover:translate-y-[-2px]',
        clickable && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="text-slate-700 dark:text-slate-300">{children}</div>
      {footer && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2">
          {footer}
        </div>
      )}
    </CardElement>
  );
};
