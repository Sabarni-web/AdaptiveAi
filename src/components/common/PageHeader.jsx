import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const PageHeader = ({ title, description, breadcrumbs = [], actions = [] }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
      <div className="flex flex-col gap-1.5">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3 w-3 stroke-[2.5]" />}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {actions.map((action, idx) => (
            <div key={idx}>{action}</div>
          ))}
        </div>
      )}
    </div>
  );
};
