import React from 'react';
import { Cloud, CloudLightning, CloudOff } from 'lucide-react';
import clsx from 'clsx';

export const AutoSaveIndicator = ({ status = 'saved', lastSaved }) => {
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const config = {
    saving: {
      text: 'Saving draft to cloud...',
      color: 'text-blue-400',
      icon: <Cloud className="h-4 w-4 animate-pulse" />,
    },
    saved: {
      text: lastSaved ? `Draft saved at ${formatTime(lastSaved)}` : 'Draft saved locally',
      color: 'text-slate-400',
      icon: <Cloud className="h-4 w-4" />,
    },
    error: {
      text: 'Draft save failed. Retrying...',
      color: 'text-red-400',
      icon: <CloudOff className="h-4 w-4" />,
    },
  };

  const current = config[status] || config.saved;

  return (
    <div className={clsx('flex items-center gap-2 text-xs font-semibold', current.color)}>
      {current.icon}
      <span>{current.text}</span>
    </div>
  );
};
export default AutoSaveIndicator;
