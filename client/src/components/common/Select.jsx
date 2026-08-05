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
          className="text-sm font-semibold text-primary flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="absolute left-3 text-secondary">
            {iconLeft}
          </span>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={clsx(
            'w-full px-3.5 py-2 text-sm rounded-lg border bg-surface-2 text-primary transition-all outline-none focus:ring-2 focus:ring-mint disabled:opacity-50 appearance-none pr-10',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-hair focus:border-mint focus:ring-mint/20',
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
        <span className="absolute right-3 text-secondary pointer-events-none">
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
        <span className="text-xs text-secondary">{helperText}</span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
