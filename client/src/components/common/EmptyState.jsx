import React from 'react';
import { Button } from './Button';

export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-hair rounded-2xl bg-surface-2">
      {icon && (
        <div className="text-mint border border-mint/30 rounded-full p-3 mb-4 h-12 w-12 flex items-center justify-center bg-mint/10">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-primary mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-secondary max-w-sm mb-6">
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
