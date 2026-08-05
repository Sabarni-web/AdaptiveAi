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
        'card p-6 text-left w-full',
        clickable && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-mint',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold text-primary leading-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-secondary mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="text-primary">{children}</div>
      {footer && (
        <div className="mt-6 pt-4 border-t border-hair flex items-center justify-end gap-2">
          {footer}
        </div>
      )}
    </CardElement>
  );
};
