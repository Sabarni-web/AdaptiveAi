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
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          className={clsx(
            'w-full px-3.5 py-2 text-sm rounded-lg border bg-surface-2 text-primary transition-all outline-none focus:ring-2 focus:ring-mint disabled:opacity-50',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-hair focus:border-mint focus:ring-mint/20',
            iconLeft && 'pl-10',
            iconRight && 'pr-10'
          )}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 text-secondary">
            {iconRight}
          </span>
        )}
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      {!error && helperText && (
        <span className="text-xs text-secondary">{helperText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
