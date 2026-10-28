import React from 'react';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';

export const Switch = React.forwardRef(({ className, label, description, checked, onChange, disabled, ...props }, ref) => {
  const isChecked = Boolean(checked);

  return (
    <div className="flex items-center justify-between py-2.5 group">
      <div className="flex flex-col pr-4">
        {label && (
          <span className={clsx(
            "text-sm font-semibold transition-colors",
            isChecked ? "text-white" : "text-slate-300"
          )}>
            {label}
          </span>
        )}
        {description && (
          <span className="text-xs text-text-secondary mt-0.5">{description}</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Clear Text State Badge (ON / OFF) */}
        <span className={clsx(
          "text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase transition-all duration-300",
          isChecked 
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
            : "bg-slate-800/60 text-slate-400 border border-slate-700/50"
        )}>
          {isChecked ? "ON" : "OFF"}
        </span>

        {/* Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={() => onChange && onChange(!isChecked)}
          className={clsx(
            "relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
            isChecked 
              ? "bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.45)] border border-emerald-400" 
              : "bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600/60 shadow-inner",
            className
          )}
          ref={ref}
          {...props}
        >
          {/* Thumb with Icon */}
          <span
            className={clsx(
              "pointer-events-none flex items-center justify-center h-5.5 w-5.5 rounded-full shadow-md transition-all duration-300 transform",
              isChecked 
                ? "translate-x-6 bg-white text-emerald-600" 
                : "translate-x-0.5 bg-slate-400 text-slate-800"
            )}
          >
            {isChecked ? (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            ) : (
              <X className="w-3.5 h-3.5 stroke-[3]" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
});
Switch.displayName = "Switch";

