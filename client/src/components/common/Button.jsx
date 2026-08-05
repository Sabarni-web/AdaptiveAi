import React from 'react';
import clsx from 'clsx';
import { Loader } from './Loader';

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-void disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'btn-mint',
    secondary: 'bg-surface-2 text-primary hover:bg-surface focus:ring-mint',
    danger: 'bg-red-soft text-void hover:opacity-90 focus:ring-red-soft',
    ghost: 'bg-transparent text-secondary hover:bg-surface-2 hover:text-primary focus:ring-mint',
    outline: 'border border-hair text-primary bg-transparent hover:bg-surface-2 focus:ring-mint',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    icon: 'p-2',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        isLoading && 'relative !text-transparent pointer-events-none',
        className
      )}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center text-current">
          <Loader size="sm" color="text-current" />
        </span>
      )}
      {children}
    </button>
  );
};
