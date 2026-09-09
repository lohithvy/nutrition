import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ShoppingCart,
  Sparkles,
  Bot,
  ChefHat,
  Camera,
  Barcode,
  Settings,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { navItems, secondaryNavItems } from '../../data/mockData';
import { Badge } from '../ui/Badge';

const iconMap = {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ShoppingCart,
  Sparkles,
  Bot,
  ChefHat,
  Camera,
  Barcode,
  Settings,
};

export function Sidebar({ className }) {
  const { openProModal } = useUI();
  const { user } = useAuth();
  const location = useLocation();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'NF';

  return (
    <aside
      className={cn(
        'w-64 bg-white border-r border-surface-200/80 h-screen flex flex-col justify-between shrink-0 select-none z-30 sticky top-0',
        className
      )}
    >
      {/* Top: Brand & Main Navigation */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 pb-4 flex items-center justify-between border-b border-surface-100/80">
          <NavLink to="/dashboard" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-brand-primary text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" className="w-5 h-5">
                <path d="M12 28C12 20 18 13 28 12C28 20 22 28 12 28Z" fill="#34D399" />
                <path d="M13 27C17 22 23 18 28 12" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-surface-900 block leading-tight">
                NutriFlow
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 tracking-wider uppercase block">
                NutriPure AI
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isDashboard = item.path === '/dashboard';
            const isActive = isDashboard
              ? location.pathname === '/dashboard' || location.pathname === '/'
              : location.pathname === item.path;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer',
                  isActive
                    ? 'bg-brand-primary text-white shadow-xs font-bold'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100/80'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                    isActive ? 'text-white' : 'text-surface-400 group-hover:text-surface-700'
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.id === 'assistant' && (
                  <Badge
                    variant={isActive ? 'emerald' : 'purple'}
                    size="sm"
                    className={cn(
                      'text-[10px] py-0 px-1.5',
                      isActive && 'bg-white/20 text-white border-white/20'
                    )}
                  >
                    AI
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Pro Upgrade & User Profile */}
      <div className="p-3 border-t border-surface-100 bg-surface-50/40 space-y-2.5 shrink-0">
        {/* Pro Banner Button */}
        <button
          onClick={openProModal}
          className="w-full p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/60 shadow-subtle hover:border-amber-300 hover:shadow-xs transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-amber-900 tracking-tight">Pro Plan Active</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded-md">
              Manage
            </span>
          </div>
          <p className="text-[11px] text-amber-800/80 leading-snug">
            Real-time biomarker & macro auto-tuning unlocked.
          </p>
        </button>

        {/* Secondary Links (Settings) */}
        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = iconMap[item.icon] || Settings;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer',
                  isActive
                    ? 'bg-surface-200 text-surface-900 font-bold'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                )}
              >
                <Icon className="w-4 h-4 text-surface-400" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Card linking to /settings */}
        <NavLink
          to="/settings"
          className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-emerald-50/50 border border-surface-200/60 hover:border-brand-primary/40 shadow-2xs transition-all cursor-pointer group"
          title={`Manage ${user?.name || 'User'} Profile & Targets`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-500/30 group-hover:ring-brand-primary"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white font-bold text-xs flex items-center justify-center ring-1 ring-emerald-500/30">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs font-bold text-surface-900 block truncate leading-tight group-hover:text-brand-primary">
                {user?.name || 'User'}
              </span>
              <span className="text-[10px] text-surface-400 block truncate">
                {user?.role || 'Member'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-surface-400 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-transform" />
        </NavLink>
      </div>
    </aside>
  );
}
