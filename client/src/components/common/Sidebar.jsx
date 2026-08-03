import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  FileSpreadsheet,
  GraduationCap,
  TrendingUp,
  Settings as SettingsIcon,
  BookOpen,
  Calendar,
  Activity,
  CheckSquare,
  Users,
  Database,
  History,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';
import { toggleSidebarCollapse } from '../../redux/slices/uiSlice';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);

  const role = user?.role || 'student'; // fallback

  const getMenuItems = () => {
    switch (role) {
      case 'student':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
          { label: 'My Exams', path: '/student/exams', icon: <GraduationCap className="h-5 w-5" /> },
          { label: 'Results', path: '/student/results', icon: <CheckSquare className="h-5 w-5" /> },
          { label: 'Analytics', path: '/analytics', icon: <TrendingUp className="h-5 w-5" /> },
          { label: 'Settings', path: '/settings', icon: <SettingsIcon className="h-5 w-5" /> },
        ];
      case 'teacher':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
          { label: 'Question Bank', path: '/teacher/question-bank', icon: <Database className="h-5 w-5" /> },
          { label: 'Exam Scheduler', path: '/teacher/scheduler', icon: <Calendar className="h-5 w-5" /> },
          { label: 'Live Monitor', path: '/teacher/monitor', icon: <Activity className="h-5 w-5" /> },
          { label: 'Grade Review', path: '/teacher/grade-review', icon: <FileSpreadsheet className="h-5 w-5" /> },
          { label: 'Analytics', path: '/analytics', icon: <TrendingUp className="h-5 w-5" /> },
          { label: 'Settings', path: '/settings', icon: <SettingsIcon className="h-5 w-5" /> },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
          { label: 'Question Generator', path: '/admin/generator', icon: <Database className="h-5 w-5" /> },
          { label: 'User Management', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
          { label: 'Subjects', path: '/admin/subjects', icon: <BookOpen className="h-5 w-5" /> },
          { label: 'System Analytics', path: '/admin/analytics', icon: <ShieldCheck className="h-5 w-5" /> },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History className="h-5 w-5" /> },
          { label: 'Settings', path: '/settings', icon: <SettingsIcon className="h-5 w-5" /> },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={clsx(
        'fixed top-16 bottom-0 left-0 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-205 dark:border-slate-800/80 transition-all duration-300 z-40 flex flex-col justify-between',
        sidebarCollapsed ? 'w-20' : 'w-64',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group duration-150',
                isActive
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
              )
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span
              className={clsx(
                'transition-all duration-300 whitespace-nowrap',
                sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
        <button
          onClick={() => dispatch(toggleSidebarCollapse())}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
};
