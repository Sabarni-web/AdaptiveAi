import React from 'react';
import clsx from 'clsx';

export const Switch = React.forwardRef(({ className, label, description, checked, onChange, disabled, ...props }, ref) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        {label && <span className="text-sm font-medium text-text-primary">{label}</span>}
        {description && <span className="text-xs text-text-secondary">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange && onChange(!checked)}
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-surface-light",
          className
        )}
        ref={ref}
        {...props}
      >
        <span
          className={clsx(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
});
Switch.displayName = "Switch";
