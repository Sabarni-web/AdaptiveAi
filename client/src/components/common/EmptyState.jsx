import React from 'react';
import { Button } from './Button';

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/10">
      {icon && (
        <div className="text-slate-400 dark:text-slate-500 mb-4 h-12 w-12 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
};
