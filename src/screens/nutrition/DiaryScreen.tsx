/**
 * NutriFlow DiaryScreen (Food Diary)
 * Ported 1:1 from DiaryPage.jsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BookOpen,
  Plus,
  Trash2,
  Sunrise,
  Sun,
  Moon,
  Apple,
  Flame,
  Minus,
  Calendar,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { DateSelectorBar } from '../../components/common/DateSelectorBar';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { StatRibbon } from '../../components/common/StatRibbon';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { QuickLogBottomSheet } from '../../components/common/QuickLogBottomSheet';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { MealType, LoggedFoodItem } from '../../types/nutrition';
import { formatDateDisplay } from '../../utils/date';

const mealDisplayNames: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Afternoon Snack & Water',
  dinner: 'Dinner',
};

export function DiaryScreen() {
  const {
    openQuickLog,
    closeQuickLog,
    isQuickLogOpen,
    openDatePicker,
    closeDatePicker,
    isDatePickerOpen,
    showToast,
  } = useUI();

  const {
    selectedDate,
    setSelectedDate,
    targets,
    totals,
    mealTotals,
    deleteFood,
    updateFoodQuantity,
    clearMeal,
    addFood,
  } = useNutrition();

  const [confirmClearMeal, setConfirmClearMeal] = useState<MealType | null>(null);

  const mealKeys: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

  const getMealIcon = (meal: MealType) => {
    switch (meal) {
      case 'breakfast':
        return <Sunrise size={18} color={colors.brand.primary} />;
      case 'lunch':
        return <Sun size={18} color={colors.nutri.carbs} />;
      case 'snack':
        return <Apple size={18} color={colors.status.error} />;
      case 'dinner':
        return <Moon size={18} color={colors.nutri.fat} />;
      default:
        return <Sunrise size={18} color={colors.brand.primary} />;
    }
  };

  const handleDeleteItem = (mealKey: MealType, item: LoggedFoodItem) => {
    deleteFood(item.id, mealKey, selectedDate);
    showToast(`Removed "${item.name}" from ${mealDisplayNames[mealKey]}`);
  };

  const handleUpdateQty = (mealKey: MealType, item: LoggedFoodItem, delta: number) => {
    const currentQty = item.quantity || 1;
    const newQty = Math.max(0.25, Math.round((currentQty + delta) * 100) / 100);
    updateFoodQuantity(item.id, newQty, mealKey, selectedDate);
  };

  const handleConfirmClear = () => {
    if (confirmClearMeal) {
      clearMeal(confirmClearMeal, selectedDate);
      showToast(`Cleared all items from ${mealDisplayNames[confirmClearMeal]}`);
      setConfirmClearMeal(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selector */}
        <DateSelectorBar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onOpenDatePicker={openDatePicker}
        />

        {/* Header */}
        <ScreenHeader
          title="Food Diary"
          emoji="📖"
          subtitle={`Tracking meals, snacks, and macro distribution for ${formatDateDisplay(selectedDate)}`}
          badge={
            <Badge variant={totals.calories > 0 ? 'emerald' : 'slate'} dot>
              {totals.calories > 0 ? `${totals.calories} kcal Logged` : 'Empty Day'}
            </Badge>
          }
          actions={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} color="#FFF" />}
              onPress={openQuickLog}
            >
              Log Food
            </Button>
          }
        />

        {/* Daily Stats Ribbon */}
        <StatRibbon totals={totals} targets={targets} />

        {/* When nothing is logged */}
        {totals.itemsCount === 0 && (
          <EmptyState
            icon={<BookOpen size={26} color={colors.brand.primary} />}
            title={`No meals logged for ${formatDateDisplay(selectedDate)}`}
            description="Track your calories, macronutrients, and water by adding food items or using the camera scanner."
            action={
              <Button
                variant="primary"
                size="md"
                onPress={openQuickLog}
                leftIcon={<Plus size={16} color="#FFF" />}
              >
                Log First Meal
              </Button>
            }
          />
        )}

        {/* Meal Breakdown Cards */}
        <View style={styles.mealsContainer}>
          {mealKeys.map((key) => {
            const mealData = mealTotals[key] || { items: [], calories: 0, count: 0 };

            return (
              <Card key={key}>
                <CardHeader
                  title={mealDisplayNames[key]}
                  subtitle={`${mealData.count} item${mealData.count === 1 ? '' : 's'} logged`}
                  icon={getMealIcon(key)}
                  badge={
                    <Badge variant={mealData.calories > 0 ? 'amber' : 'slate'} size="sm">
                      {mealData.calories} kcal
                    </Badge>
                  }
                  action={
                    <View style={styles.mealHeaderActions}>
                      {mealData.count > 0 && (
                        <TouchableOpacity
                          onPress={() => setConfirmClearMeal(key)}
                          style={styles.clearBtn}
                        >
                          <Text style={styles.clearBtnText}>Clear</Text>
                        </TouchableOpacity>
                      )}
                      <Button
                        variant="ghost"
                        size="xs"
                        leftIcon={<Plus size={12} color={colors.brand.primary} />}
                        onPress={() => openQuickLog(key)}
                      >
                        Add Food
                      </Button>
                    </View>
                  }
                />

                <CardContent>
                  {mealData.items && mealData.items.length > 0 ? (
                    <View style={styles.foodItemsList}>
                      {mealData.items.map((item) => {
                        const qty = item.quantity || 1;
                        const scaledKcal = Math.round((item.calories || 0) * qty);
                        const scaledProtein = Math.round((item.protein || 0) * qty * 10) / 10;
                        const scaledCarbs = Math.round((item.carbs || 0) * qty * 10) / 10;
                        const scaledFat = Math.round((item.fat || 0) * qty * 10) / 10;

                        return (
                          <View key={item.id} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                              <Text style={styles.itemName} numberOfLines={1}>
                                {item.name}
                              </Text>
                              <Text style={styles.itemMacros}>
                                {item.portion} • P: {scaledProtein}g • C: {scaledCarbs}g • F: {scaledFat}g
                              </Text>
                            </View>

                            <View style={styles.itemControls}>
                              {/* Quantity Stepper */}
                              <View style={styles.qtyBox}>
                                <TouchableOpacity
                                  onPress={() => handleUpdateQty(key, item, -0.5)}
                                  style={styles.qtyBtn}
                                >
                                  <Minus size={12} color={colors.surface[600]} />
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{qty}x</Text>
                                <TouchableOpacity
                                  onPress={() => handleUpdateQty(key, item, 0.5)}
                                  style={styles.qtyBtn}
                                >
                                  <Plus size={12} color={colors.surface[600]} />
                                </TouchableOpacity>
                              </View>

                              {/* Scaled Calories */}
                              <Text style={styles.itemKcal}>{scaledKcal} kcal</Text>

                              {/* Delete */}
                              <TouchableOpacity
                                onPress={() => handleDeleteItem(key, item)}
                                style={styles.deleteBtn}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <Trash2 size={15} color={colors.surface[400]} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={styles.emptyMealBox}>
                      <Text style={styles.emptyMealText}>
                        No items logged for {mealDisplayNames[key].toLowerCase()} yet.{' '}
                      </Text>
                      <TouchableOpacity onPress={() => openQuickLog(key)}>
                        <Text style={styles.emptyMealLink}>+ Add food</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Clear Meal Confirmation Modal */}
      {confirmClearMeal && (
        <Modal
          isOpen={!!confirmClearMeal}
          onClose={() => setConfirmClearMeal(null)}
          title={`Clear ${mealDisplayNames[confirmClearMeal]}?`}
          description="Are you sure you want to remove all items logged in this meal? All calories and macros will be subtracted."
          footer={
            <View style={styles.modalFooterRow}>
              <Button variant="outline" size="sm" onPress={() => setConfirmClearMeal(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onPress={handleConfirmClear}>
                Clear Meal
              </Button>
            </View>
          }
        >
          <Text style={styles.modalBodyText}>
            This action will reset {mealDisplayNames[confirmClearMeal]} to 0 items.
          </Text>
        </Modal>
      )}

      {/* Global Quick Log Bottom Sheet */}
      <QuickLogBottomSheet
        isOpen={isQuickLogOpen}
        onClose={closeQuickLog}
        selectedDate={selectedDate}
        onAddFood={(food, mealType, quantity) => {
          addFood(food, mealType, quantity, selectedDate);
          showToast(`Added ${quantity}x ${food.name}! 🥑`);
        }}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={closeDatePicker}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 32,
  },
  mealsContainer: {
    gap: spacing.sm,
  },
  mealHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.status.errorBg,
  },
  clearBtnText: {
    fontSize: typography.size['2xs'],
    color: colors.status.error,
    fontWeight: typography.weight.semibold,
  },
  foodItemsList: {
    gap: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface[50],
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[150],
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  itemName: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  itemMacros: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
    marginTop: 2,
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  qtyBtn: {
    padding: 3,
  },
  qtyText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
    marginHorizontal: 4,
  },
  itemKcal: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[800],
    minWidth: 50,
    textAlign: 'right',
  },
  deleteBtn: {
    padding: 4,
  },
  emptyMealBox: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyMealText: {
    fontSize: typography.size.xs,
    color: colors.surface[400],
  },
  emptyMealLink: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },
  modalFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalBodyText: {
    fontSize: typography.size.xs,
    color: colors.surface[600],
    lineHeight: 18,
  },
});
