import React, { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  className = '',
}) => {
  const [openIds, setOpenIds] = useState(defaultOpen);

  const toggleItem = (id) => {
    if (allowMultiple) {
      if (openIds.includes(id)) {
        setOpenIds(openIds.filter((item) => item !== id));
      } else {
        setOpenIds([...openIds, id]);
      }
    } else {
      setOpenIds(openIds.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={clsx('flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden', className)}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            className={clsx(
              'border-b border-slate-200 dark:border-slate-700 last:border-b-0',
              isOpen && 'bg-slate-50/50 dark:bg-slate-800/20'
            )}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={clsx(
                  'h-4 w-4 text-slate-400 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <div
              className={clsx(
                'overflow-hidden transition-all duration-200 ease-in-out',
                isOpen ? 'max-h-[1000px] border-t border-slate-100 dark:border-slate-700' : 'max-h-0'
              )}
            >
              <div className="px-5 py-4 text-sm text-slate-600 dark:text-slate-350 leading-relaxed bg-white dark:bg-slate-900/40">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
