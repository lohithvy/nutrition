import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  Sparkles,
  Bot,
  CalendarDays,
  ShoppingCart,
  ChefHat,
  Camera,
  Barcode,
  Settings,
  Crown,
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { navItems, secondaryNavItems } from '../../data/mockData';
import { Drawer } from '../ui/Drawer';

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

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav, openQuickLog, openProModal } = useUI();
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

  const mobileBottomItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'diary', label: 'Diary', path: '/diary', icon: BookOpen },
    { id: 'quick-log', label: 'Log', action: openQuickLog, icon: Plus, isAction: true },
    { id: 'insights', label: 'Insights', path: '/insights', icon: Sparkles },
    { id: 'assistant', label: 'Nutri AI', path: '/assistant', icon: Bot },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-surface-200/80 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {mobileBottomItems.map((item) => {
            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center -mt-5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full w-12 h-12 shadow-lg shadow-emerald-700/30 active:scale-95 transition-transform cursor-pointer"
                  aria-label="Quick Log Food"
                >
                  <item.icon className="w-6 h-6 stroke-[2.5]" />
                </button>
              );
            }

            const isDashboard = item.path === '/dashboard';
            const isActive = isDashboard
              ? location.pathname === '/dashboard' || location.pathname === '/'
              : location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'text-brand-primary font-bold'
                    : 'text-surface-500 hover:text-surface-900'
                )}
              >
                <Icon className={cn('w-5 h-5 mb-0.5', isActive ? 'stroke-[2.5]' : 'stroke-2')} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Slide-over Full Drawer Menu on Mobile */}
      <Drawer
        isOpen={isMobileNavOpen}
        onClose={closeMobileNav}
        position="left"
        width="sm"
        title="NutriFlow Navigation"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-1">
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
                  onClick={closeMobileNav}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer',
                    isActive
                      ? 'bg-brand-primary text-white font-bold shadow-xs'
                      : 'text-surface-600 hover:bg-surface-100'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-4 border-t border-surface-100 space-y-3">
            {/* Pro Plan Trigger */}
            <button
              onClick={() => {
                closeMobileNav();
                openProModal();
              }}
              className="w-full p-3 rounded-2xl bg-amber-50 border border-amber-200/60 text-left cursor-pointer hover:bg-amber-100/60 transition-colors"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Crown className="w-4 h-4 text-amber-600 fill-amber-600" />
                <span className="text-xs font-bold text-amber-900">Pro Member</span>
              </div>
              <p className="text-[11px] text-amber-800/80">
                All advanced wellness tracking active.
              </p>
            </button>

            {secondaryNavItems.map((item) => {
              const Icon = iconMap[item.icon] || Settings;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={closeMobileNav}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-surface-600 hover:bg-surface-100 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* User Profile item */}
            <NavLink
              to="/settings"
              onClick={closeMobileNav}
              className="flex items-center gap-3 pt-2 p-2 rounded-xl hover:bg-surface-100 transition-colors cursor-pointer"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand-primary text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/20">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-surface-900 truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-surface-500 truncate">{user?.email || 'user@example.com'}</p>
              </div>
            </NavLink>
          </div>
        </div>
      </Drawer>
    </>
  );
}
