import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import {
  User,
  Settings,
  Target,
  Dumbbell,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function ProfileDropdown({ isOpen, onClose }) {
  const {
    isAuthenticated,
    user,
    openLogin,
    openSignup,
    openSignout,
  } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigate = (path, tabKey) => {
    onClose();
    if (tabKey) {
      navigate(`${path}?tab=${tabKey}`);
    } else {
      navigate(path);
    }
  };

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'NF';

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl border border-surface-200/90 shadow-xl z-50 p-2 space-y-1 animate-fade-in"
    >
      {/* Header Profile Summary */}
      <div className="p-3 rounded-2xl bg-surface-50 border border-surface-150/70">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-brand-primary text-white font-bold text-sm flex items-center justify-center ring-2 ring-emerald-500/20">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-surface-900 truncate">
              {isAuthenticated ? user.name : 'Guest User'}
            </h4>
            <p className="text-[11px] text-surface-500 truncate">
              {isAuthenticated ? user.email : 'Not signed in'}
            </p>
            <div className="mt-1">
              {isAuthenticated ? (
                <Badge variant="amber" size="sm" className="text-[10px] py-0">
                  {user.role || 'Pro Member'}
                </Badge>
              ) : (
                <Badge variant="slate" size="sm" className="text-[10px] py-0">
                  Mock Session
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Options */}
      <div className="pt-1 space-y-0.5 text-xs">
        <button
          type="button"
          onClick={() => handleNavigate('/settings', 'profile')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-surface-700 hover:text-surface-900 hover:bg-surface-100 transition-colors text-left cursor-pointer"
        >
          <User className="w-4 h-4 text-brand-primary" />
          <span className="font-semibold">Profile & Body Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate('/settings', 'goals')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-surface-700 hover:text-surface-900 hover:bg-surface-100 transition-colors text-left cursor-pointer"
        >
          <Dumbbell className="w-4 h-4 text-purple-600" />
          <span className="font-semibold">Goals & Workout Split</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate('/settings', 'targets')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-surface-700 hover:text-surface-900 hover:bg-surface-100 transition-colors text-left cursor-pointer"
        >
          <Target className="w-4 h-4 text-amber-600" />
          <span className="font-semibold">Nutrition Targets</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate('/settings')}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-surface-700 hover:text-surface-900 hover:bg-surface-100 transition-colors text-left cursor-pointer"
        >
          <Settings className="w-4 h-4 text-surface-500" />
          <span className="font-semibold">All Settings & Preferences</span>
        </button>
      </div>

      {/* Auth Actions Footer */}
      <div className="pt-1.5 border-t border-surface-150">
        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => {
              onClose();
              openSignout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 p-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                openLogin();
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-600 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                openSignup();
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-surface-100 text-surface-800 text-xs font-bold hover:bg-surface-200 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
