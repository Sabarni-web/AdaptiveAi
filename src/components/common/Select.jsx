import React, { forwardRef } from 'react';
import clsx from 'clsx';

export const Select = forwardRef(({
  label,
  options = [],
  placeholder,
  error,
  disabled = false,
  required = false,
  helperText,
  iconLeft,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={selectId}
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
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={clsx(
            'w-full px-3.5 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900 appearance-none pr-10',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-300 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500/20',
            iconLeft && 'pl-10'
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none">
          <svg
            className="h-4 w-4 stroke-[2]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-slate-400 dark:text-slate-500">{helperText}</span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
