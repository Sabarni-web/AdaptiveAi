import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Bell, Sun, Moon, Search, LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import { toggleSidebar, setTheme } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { Avatar } from './Avatar';
import { Dropdown } from './Dropdown';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((state) => state.ui.theme);
  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector((state) => state.ui.notifications);
  const [showSearch, setShowSearch] = useState(false);

  const toggleThemeMode = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenuItems = [
    {
      label: 'Profile',
      icon: <User className="h-4 w-4" />,
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Settings',
      icon: <SettingsIcon className="h-4 w-4" />,
      onClick: () => navigate('/settings'),
    },
    { divider: true },
    {
      label: 'Logout',
      icon: <LogOut className="h-4 w-4" />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 h-16 border-b border-hair shadow-sm z-50 flex items-center justify-between px-6 transition-colors duration-200 ${theme === 'light' ? 'bg-black text-white' : 'bg-[#39FFB0] text-black'}`}>
      {/* Brand Logo & Burger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={`lg:hidden p-1 rounded-lg transition-colors ${theme === 'light' ? 'text-white hover:text-gray-200' : 'text-black hover:text-gray-800'}`}
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className={`text-xl font-extrabold tracking-tight ${theme === 'light' ? 'text-white' : 'text-black'}`}>
            AdaptiveAI
          </span>
        </Link>
      </div>

      {/* Global search */}
      <div className="hidden md:flex items-center relative w-80">
        <Search className={`absolute left-3 h-4.5 w-4.5 ${theme === 'light' ? 'text-white' : 'text-black'}`} />
        <input
          type="text"
          placeholder="Search exams, lessons, logs..."
          className={`w-full pl-10 pr-4 py-1.5 text-xs rounded-xl bg-transparent border border-hair outline-none focus:ring-2 transition-all ${theme === 'light' ? 'text-white placeholder-gray-400 focus:ring-white' : 'text-black placeholder-black focus:ring-black'}`}
        />
      </div>

      {/* Action tray */}
      <div className="flex items-center gap-4">
        {/* Mobile Search Button */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`md:hidden p-1.5 hover:bg-green-700 rounded-xl ${theme === 'light' ? 'text-white hover:text-gray-200' : 'text-black hover:text-gray-800'}`}
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleThemeMode}
          className={`p-1.5 hover:bg-green-700 rounded-xl transition-colors ${theme === 'light' ? 'text-white hover:text-gray-200' : 'text-black hover:text-gray-800'}`}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <button className={`relative p-1.5 hover:bg-green-700 rounded-xl transition-colors ${theme === 'light' ? 'text-white hover:text-gray-200' : 'text-black hover:text-gray-800'}`}>
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>

        {/* Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 focus:outline-none">
              <Avatar
                src={user?.avatar}
                fallback={user?.name || 'User'}
                size="sm"
                status="online"
              />
              <span className={`hidden sm:inline text-sm font-semibold ${theme === 'light' ? 'text-white' : 'text-black'}`}>
                {user?.name || 'Account'}
              </span>
            </button>
          }
          items={userMenuItems}
        />
      </div>
    </nav>
  );
};
