import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 py-12 transition-colors duration-200">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <h1 className="text-9xl font-black tracking-tight text-slate-300 dark:text-slate-800">
          404
        </h1>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Page not found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="primary">Go back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
