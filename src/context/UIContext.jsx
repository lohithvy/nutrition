import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUser, mockNotifications, mockGroceryList } from '../data/mockData';
import {
  STORAGE_KEYS,
  loadStoredData,
  saveStoredData,
} from '../utils/storage';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const [user, setUser] = useState(() =>
    loadStoredData(STORAGE_KEYS.USER, mockUser)
  );
  const [groceryList, setGroceryList] = useState(() =>
    loadStoredData(STORAGE_KEYS.GROCERY_LIST, mockGroceryList)
  );
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync user profile to localStorage
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.USER, user);
  }, [user]);

  // Sync grocery list to localStorage
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.GROCERY_LIST, groceryList);
  }, [groceryList]);

  // Global shortcut for Search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const openMobileNav = () => setIsMobileNavOpen(true);
  const closeMobileNav = () => setIsMobileNavOpen(false);
  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev);

  const openQuickLog = () => setIsQuickLogOpen(true);
  const closeQuickLog = () => setIsQuickLogOpen(false);
  const toggleQuickLog = () => setIsQuickLogOpen((prev) => !prev);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const toggleNotifications = () => setIsNotificationsOpen((prev) => !prev);
  const closeNotifications = () => setIsNotificationsOpen(false);

  const openProModal = () => setIsProModalOpen(true);
  const closeProModal = () => setIsProModalOpen(false);

  const openDatePicker = () => setIsDatePickerOpen(true);
  const closeDatePicker = () => setIsDatePickerOpen(false);

  // Toast feedback helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id ? null : prev));
    }, 3000);
  };

  // Grocery item toggle
  const toggleGroceryItem = (id) => {
    setGroceryList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Clear completed grocery items
  const clearCompletedGrocery = () => {
    setGroceryList((prev) => prev.filter((item) => !item.checked));
    showToast('Cleared completed grocery items', 'info');
  };

  // Notifications helpers
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  const value = {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebar,
    isMobileNavOpen,
    setIsMobileNavOpen,
    openMobileNav,
    closeMobileNav,
    toggleMobileNav,
    isQuickLogOpen,
    setIsQuickLogOpen,
    openQuickLog,
    closeQuickLog,
    toggleQuickLog,
    isSearchOpen,
    openSearch,
    closeSearch,
    isNotificationsOpen,
    toggleNotifications,
    closeNotifications,
    isProModalOpen,
    openProModal,
    closeProModal,
    isDatePickerOpen,
    openDatePicker,
    closeDatePicker,
    user,
    setUser,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    clearNotifications,
    groceryList,
    setGroceryList,
    toggleGroceryItem,
    clearCompletedGrocery,
    toastMessage,
    showToast,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up flex items-center gap-2.5 px-4 py-3 bg-surface-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-surface-800 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span>{toastMessage.message}</span>
        </div>
      )}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
