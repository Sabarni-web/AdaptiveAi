import React from 'react';
import { Card } from '../common/Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import clsx from 'clsx';

export const StatCard = ({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  color = 'bg-primary-50 text-primary-600',
  trend = 'neutral',
}) => {
  return (
    <Card hover className="!p-5">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {value}
          </span>
        </div>
        <div className={clsx('h-10 w-10 rounded-xl flex items-center justify-center shrink-0', color)}>
          {icon}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold">
        {trend === 'up' && (
          <span className="text-green-500 flex items-center">
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
            <span>+{change}%</span>
          </span>
        )}
        {trend === 'down' && (
          <span className="text-red-500 flex items-center">
            <ArrowDownRight className="h-4 w-4 stroke-[2.5]" />
            <span>-{change}%</span>
          </span>
        )}
        {trend === 'neutral' && (
          <span className="text-slate-400 flex items-center">
            <Minus className="h-4 w-4 stroke-[2.5]" />
            <span>{change}%</span>
          </span>
        )}
        <span className="text-slate-400 font-medium">{changeLabel}</span>
      </div>
    </Card>
  );
};
export default StatCard;
