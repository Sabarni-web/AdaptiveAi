import React, { forwardRef } from 'react';
import clsx from 'clsx';

export const Textarea = forwardRef(({
  label,
  placeholder,
  error,
  disabled = false,
  required = false,
  helperText,
  rows = 4,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={clsx(
          'w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900 resize-y',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500/20'
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-slate-400 dark:text-slate-500">{helperText}</span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
