/**
 * NutriFlow UI Context (Toast notifications, Global Modals state)
 */

import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, radii, spacing, typography, shadows } from '../constants/theme';
import { NotificationItem, GroceryItem, MealType } from '../types/nutrition';
import { prebuiltRecipes } from '../data/foodDatabase';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

const mockNotifications: NotificationItem[] = [
  { id: 'n1', title: 'Metabolic Goal Reached', description: 'Optimal protein pacing achieved for your morning metabolic window.', time: '20m ago', unread: true, type: 'success' },
  { id: 'n2', title: 'Hydration Reminder', description: 'You are 700ml away from your cellular hydration target.', time: '1h ago', unread: true, type: 'info' },
  { id: 'n3', title: 'AI Meal Suggestion Ready', description: 'Chef AI created 3 nutrient-dense dinner recipes for your remaining macros.', time: '3h ago', unread: false, type: 'ai' },
];

const mockGroceryList: GroceryItem[] = [
  { id: 'g1', name: 'Organic Greek Yogurt (0% Fat)', category: 'Dairy & Eggs', quantity: '2 tubs (32 oz)', checked: false, price: 9.50 },
  { id: 'g2', name: 'Pasture-Raised Large Eggs', category: 'Dairy & Eggs', quantity: '1 dozen', checked: true, price: 5.99 },
  { id: 'g3', name: 'Wild Alaskan Sockeye Salmon', category: 'Fresh Seafood', quantity: '1.2 lbs', checked: false, price: 21.40 },
  { id: 'g4', name: 'Organic Boneless Chicken Breasts', category: 'Fresh Poultry', quantity: '2 lbs', checked: false, price: 14.80 },
  { id: 'g5', name: 'Organic Hass Avocados', category: 'Fresh Produce', quantity: '4 count', checked: true, price: 4.99 },
  { id: 'g6', name: 'Baby Spinach (Organic)', category: 'Fresh Produce', quantity: '16 oz tub', checked: false, price: 4.49 },
  { id: 'g7', name: 'Fresh Blueberries', category: 'Fresh Produce', quantity: '2 pints', checked: false, price: 6.99 },
  { id: 'g8', name: 'Organic Rolled Oats', category: 'Pantry & Grains', quantity: '32 oz bag', checked: true, price: 4.29 },
  { id: 'g9', name: 'Raw California Almonds', category: 'Pantry & Grains', quantity: '1 lb bag', checked: false, price: 7.99 },
];

interface UIContextType {
  isQuickLogOpen: boolean;
  quickLogInitialMeal: MealType;
  openQuickLog: (meal?: MealType) => void;
  closeQuickLog: () => void;
  isDatePickerOpen: boolean;
  openDatePicker: () => void;
  closeDatePicker: () => void;
  isProModalOpen: boolean;
  openProModal: () => void;
  closeProModal: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  groceryList: GroceryItem[];
  toggleGroceryItem: (id: string) => void;
  clearCompletedGrocery: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogInitialMeal, setQuickLogInitialMeal] = useState<MealType>('breakfast');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(mockGroceryList);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const newToast: ToastState = { id: Date.now(), message, type };
    setToast(newToast);
    setTimeout(() => {
      setToast((prev) => (prev?.id === newToast.id ? null : prev));
    }, 2800);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared');
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const clearCompletedGrocery = () => {
    setGroceryList((prev) => prev.filter((item) => !item.checked));
    showToast('Cleared completed grocery items', 'info');
  };

  const openQuickLog = (meal?: MealType) => {
    if (meal) setQuickLogInitialMeal(meal);
    setIsQuickLogOpen(true);
  };

  return (
    <UIContext.Provider
      value={{
        isQuickLogOpen,
        quickLogInitialMeal,
        openQuickLog,
        closeQuickLog: () => setIsQuickLogOpen(false),
        isDatePickerOpen,
        openDatePicker: () => setIsDatePickerOpen(true),
        closeDatePicker: () => setIsDatePickerOpen(false),
        isProModalOpen,
        openProModal: () => setIsProModalOpen(true),
        closeProModal: () => setIsProModalOpen(false),
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        notifications,
        markNotificationRead,
        clearNotifications,
        groceryList,
        toggleGroceryItem,
        clearCompletedGrocery,
        showToast,
      }}
    >
      {children}

      {/* Floating Native Toast Component */}
      {toast && (
        <View style={styles.toastContainer} pointerEvents="none">
          <View style={styles.toastCard}>
            <View style={styles.toastDot} />
            <Text style={styles.toastText} numberOfLines={2}>
              {toast.message}
            </Text>
          </View>
        </View>
      )}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextType {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 84,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface[900],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.xl,
    maxWidth: 400,
    width: '100%',
    ...shadows.modal,
  },
  toastDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
    backgroundColor: colors.brand[400],
    marginRight: spacing.sm,
  },
  toastText: {
    flex: 1,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.surface.white,
  },
});
