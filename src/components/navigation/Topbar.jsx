import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useNutrition } from '../../context/NutritionContext';
import { Button } from '../ui/Button';
import { NotificationsDropdown } from '../common/NotificationsDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { formatDateDisplay, shiftDateKey } from '../../utils/storage';

export function Topbar() {
  const {
    openMobileNav,
    openQuickLog,
    openSearch,
    openDatePicker,
    toggleNotifications,
    notifications,
  } = useUI();

  const { user, isAuthenticated } = useAuth();
  const { selectedDate, setSelectedDate } = useNutrition();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handlePrevDay = () => {
    setSelectedDate(shiftDateKey(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(shiftDateKey(selectedDate, 1));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'NF';

  return (
    <header className="h-16 bg-white border-b border-surface-200/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-2xs">
      {/* Left Section: Mobile Menu & Date Navigator */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={openMobileNav}
          className="md:hidden p-2 rounded-xl text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Date Selector Pill */}
        <div className="flex items-center rounded-xl border border-surface-200 bg-surface-50/60 p-0.5 shadow-2xs">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-white transition-all cursor-pointer"
            title="Previous Day"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={openDatePicker}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-surface-800 hover:text-brand-primary hover:bg-white rounded-lg transition-colors cursor-pointer"
            title="Open Calendar Date Picker"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            <span className="hidden sm:inline">{formatDateDisplay(selectedDate)}</span>
            <span className="sm:hidden">
              {selectedDate ? selectedDate.slice(5) : 'Date'}
            </span>
            <ChevronDown className="w-3 h-3 text-surface-400" />
          </button>

          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-white transition-all cursor-pointer"
            title="Next Day"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Section: Search Input */}
      <div className="flex-1 max-w-md hidden sm:block mx-2">
        <button
          onClick={openSearch}
          type="button"
          className="w-full relative flex items-center justify-between pl-9 pr-3 py-1.5 text-xs bg-surface-50/90 border border-surface-200/90 rounded-xl text-surface-400 hover:text-surface-600 hover:border-surface-300 transition-all text-left cursor-pointer shadow-2xs"
        >
          <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <span className="truncate">Search food, recipe or insight...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-surface-400 bg-white border border-surface-200 rounded-md shadow-2xs shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Section: Actions & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
        {/* Primary "+ Log Food" Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={openQuickLog}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-xs shadow-emerald-700/20"
        >
          <span className="hidden xs:inline">Log Food</span>
          <span className="xs:hidden">Log</span>
        </Button>

        {/* Notifications Button with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative p-2 rounded-xl text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary ring-2 ring-white animate-pulse" />
            )}
          </button>
          <NotificationsDropdown />
        </div>

        {/* Profile Avatar Button with Interactive Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            className="flex items-center pl-1 border-l border-surface-200/80 group cursor-pointer focus:outline-none"
            title="Open Account Menu"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white group-hover:ring-brand-primary shadow-2xs transition-all"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white font-bold text-xs flex items-center justify-center ring-2 ring-white group-hover:ring-brand-primary shadow-2xs transition-all">
                {initials}
              </div>
            )}
          </button>

          <ProfileDropdown
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
