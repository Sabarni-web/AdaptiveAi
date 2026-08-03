import React, { forwardRef } from 'react';
import clsx from 'clsx';

export const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  disabled = false,
  required = false,
  helperText,
  iconLeft,
  iconRight,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="absolute left-3 text-slate-400 dark:text-slate-500">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            'w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500/20',
            iconLeft && 'pl-10',
            iconRight && 'pr-10'
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 text-slate-400 dark:text-slate-500">
            {iconRight}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-slate-400 dark:text-slate-500">{helperText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
