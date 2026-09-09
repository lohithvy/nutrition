import React, { useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Sparkles, Droplets, Flame, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function NotificationsDropdown() {
  const { isNotificationsOpen, closeNotifications, notifications, markNotificationRead, clearNotifications } = useUI();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isNotificationsOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeNotifications();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen, closeNotifications]);

  if (!isNotificationsOpen) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const iconForType = (type) => {
    switch (type) {
      case 'success':
        return <Flame className="w-3.5 h-3.5 text-emerald-600" />;
      case 'info':
        return <Droplets className="w-3.5 h-3.5 text-sky-600" />;
      case 'ai':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-surface-600" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-4 top-16 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-surface-200/90 z-50 animate-slide-up overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-100 bg-surface-50/50">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Badge variant="emerald" size="sm">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-[11px] text-surface-500 hover:text-surface-900 font-medium px-2 py-1 rounded-lg hover:bg-surface-100 transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={closeNotifications}
            className="p-1 text-surface-400 hover:text-surface-700 rounded-lg hover:bg-surface-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto p-2 divide-y divide-surface-100">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-surface-400">
            No notifications at the moment
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-3 rounded-2xl transition-colors cursor-pointer flex items-start gap-3 ${
                n.unread ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-surface-50'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-white border border-surface-200/70 shadow-2xs flex items-center justify-center shrink-0 mt-0.5">
                {iconForType(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-surface-900 truncate">{n.title}</h4>
                  <span className="text-[10px] text-surface-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-surface-600 leading-snug mt-0.5">{n.description}</p>
              </div>
              {n.unread && (
                <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
