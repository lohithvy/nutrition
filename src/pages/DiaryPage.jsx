import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { useUI } from '../context/UIContext';
import { useNutrition } from '../context/NutritionContext';
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
  Check,
  Calendar,
} from 'lucide-react';
import { formatDateDisplay } from '../../src/utils/storage';

const mealIcons = {
  breakfast: Sunrise,
  lunch: Sun,
  snack: Apple,
  dinner: Moon,
};

const mealDisplayNames = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Afternoon Snack & Water',
  dinner: 'Dinner',
};

export function DiaryPage() {
  const { openQuickLog, openDatePicker, showToast } = useUI();
  const {
    selectedDate,
    targets,
    totals,
    mealTotals,
    deleteFood,
    updateFoodQuantity,
    clearMeal,
  } = useNutrition();

  const [confirmClearMeal, setConfirmClearMeal] = useState(null);

  const mealKeys = ['breakfast', 'lunch', 'snack', 'dinner'];

  const handleDeleteItem = (mealKey, item) => {
    deleteFood(item.id, mealKey, selectedDate);
    showToast(`Removed "${item.name}" from ${mealDisplayNames[mealKey]}`);
  };

  const handleUpdateQty = (mealKey, item, delta) => {
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
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Food Diary"
        emoji="📖"
        subtitle={`Tracking meals, snacks, and macro distribution for ${formatDateDisplay(selectedDate)}`}
        badge={
          <Badge variant={totals.calories > 0 ? 'emerald' : 'slate'} dot>
            {totals.calories > 0 ? `${totals.calories} kcal Logged` : 'Empty Day'}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Calendar className="w-4 h-4" />}
              onClick={openDatePicker}
            >
              Change Date
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openQuickLog}
            >
              Log Food
            </Button>
          </div>
        }
      />

      {/* Daily Progress Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-surface-200/80 shadow-2xs">
        <div className="p-2 text-center border-r border-surface-150">
          <span className="text-xs text-surface-400 font-medium block uppercase tracking-wider">Remaining</span>
          <span className="text-xl font-extrabold text-surface-900">{totals.remainingCalories}</span>
          <span className="text-[10px] text-surface-500 block">{totals.calories} / {targets.calories} kcal</span>
        </div>
        <div className="p-2 text-center sm:border-r border-surface-150">
          <span className="text-xs text-emerald-600 font-medium block uppercase tracking-wider">Protein</span>
          <span className="text-xl font-extrabold text-emerald-700">{totals.protein}g</span>
          <span className="text-[10px] text-surface-500 block">Target: {targets.protein}g</span>
        </div>
        <div className="p-2 text-center border-r border-surface-150">
          <span className="text-xs text-amber-600 font-medium block uppercase tracking-wider">Carbs</span>
          <span className="text-xl font-extrabold text-amber-700">{totals.carbs}g</span>
          <span className="text-[10px] text-surface-500 block">Target: {targets.carbs}g</span>
        </div>
        <div className="p-2 text-center">
          <span className="text-xs text-purple-600 font-medium block uppercase tracking-wider">Fat</span>
          <span className="text-xl font-extrabold text-purple-700">{totals.fat}g</span>
          <span className="text-[10px] text-surface-500 block">Target: {targets.fat}g</span>
        </div>
      </div>

      {/* When absolutely nothing is logged across all meals */}
      {totals.itemsCount === 0 && (
        <EmptyState
          icon={<BookOpen className="w-7 h-7 text-emerald-600" />}
          title={`No meals logged for ${formatDateDisplay(selectedDate)}`}
          description="Track your calories, macronutrients, and water by adding food items or using the AI camera scanner."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={openQuickLog}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Log First Meal
            </Button>
          }
        />
      )}

      {/* Meal Breakdown Sections */}
      <div className="space-y-4">
        {mealKeys.map((key) => {
          const mealData = mealTotals[key] || { items: [], calories: 0, count: 0 };
          const Icon = mealIcons[key] || Sunrise;

          return (
            <Card key={key} hover>
              <CardHeader
                title={mealDisplayNames[key]}
                subtitle={`${mealData.count} item${mealData.count === 1 ? '' : 's'} logged`}
                icon={<Icon className="w-4 h-4 text-brand-primary" />}
                badge={
                  <Badge variant={mealData.calories > 0 ? 'amber' : 'slate'} size="sm">
                    <Flame className="w-3 h-3 mr-1" />
                    {mealData.calories} kcal
                  </Badge>
                }
                action={
                  <div className="flex items-center gap-1.5">
                    {mealData.count > 0 && (
                      <button
                        onClick={() => setConfirmClearMeal(key)}
                        className="text-[11px] text-surface-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Clear all items in meal"
                      >
                        Clear
                      </button>
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={openQuickLog}
                    >
                      Add Food
                    </Button>
                  </div>
                }
              />

              <CardContent className="pt-0">
                {mealData.items && mealData.items.length > 0 ? (
                  <div className="space-y-2">
                    {mealData.items.map((item) => {
                      const qty = item.quantity || 1;
                      const scaledKcal = Math.round((item.calories || 0) * qty);
                      const scaledProtein = Math.round((item.protein || 0) * qty * 10) / 10;
                      const scaledCarbs = Math.round((item.carbs || 0) * qty * 10) / 10;
                      const scaledFat = Math.round((item.fat || 0) * qty * 10) / 10;

                      return (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-surface-50/70 border border-surface-150 hover:border-surface-300 transition-colors gap-2 group"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-xs font-bold text-surface-900 block truncate">
                              {item.name}
                            </span>
                            <span className="text-[11px] text-surface-500 block">
                              {item.portion} • P: {scaledProtein}g • C: {scaledCarbs}g • F: {scaledFat}g
                            </span>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-surface-100">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border border-surface-200">
                              <button
                                onClick={() => handleUpdateQty(key, item, -0.5)}
                                className="text-surface-400 hover:text-surface-900 p-0.5"
                                title="Decrease serving"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold text-surface-800">{qty}x</span>
                              <button
                                onClick={() => handleUpdateQty(key, item, 0.5)}
                                className="text-surface-400 hover:text-surface-900 p-0.5"
                                title="Increase serving"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-extrabold text-surface-800 min-w-[60px] text-right">
                              {scaledKcal} kcal
                            </span>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteItem(key, item)}
                              className="p-1.5 text-surface-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete food entry and subtract nutrition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-surface-200 text-center text-xs text-surface-400">
                    No items logged for {mealDisplayNames[key].toLowerCase()} yet.{' '}
                    <button
                      onClick={openQuickLog}
                      className="text-brand-primary font-bold hover:underline cursor-pointer"
                    >
                      + Add food
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Clear Meal Confirmation Modal */}
      {confirmClearMeal && (
        <Modal
          isOpen={!!confirmClearMeal}
          onClose={() => setConfirmClearMeal(null)}
          title={`Clear ${mealDisplayNames[confirmClearMeal]}?`}
          description="Are you sure you want to remove all items logged in this meal? All calories and macros will be subtracted from today's totals."
          size="sm"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setConfirmClearMeal(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleConfirmClear}>
                Clear Meal
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
