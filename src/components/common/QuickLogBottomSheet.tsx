/**
 * NutriFlow QuickLogBottomSheet Component
 * Fixed-Header Food Logger with Default Logged Meal View & Live Supabase Search on Type
 * Connected to Supabase public.foods & public.food_logs
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  Search,
  Plus,
  Minus,
  Check,
  Flame,
  ChevronRight,
  X,
  ArrowLeft,
  CheckCircle2,
  Utensils,
  Trash2,
  Edit3,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FoodItem, LoggedFoodItem, MealType } from '../../types/nutrition';
import { formatDateDisplay } from '../../utils/date';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { useAuth } from '../../context/AuthContext';
import { nutritionService } from '../../services/nutrition/nutritionService';

interface QuickLogBottomSheetProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedDate?: string;
  onAddFood?: (food: FoodItem, mealType: MealType, quantity: number) => void;
  initialMeal?: MealType;
}

const quickMealCategories: { id: MealType; name: string; icon: string }[] = [
  { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
  { id: 'lunch', name: 'Lunch', icon: '☀️' },
  { id: 'dinner', name: 'Dinner', icon: '🌙' },
  { id: 'snack', name: 'Snack', icon: '🍎' },
];

export function QuickLogBottomSheet(props: QuickLogBottomSheetProps) {
  const ui = useUI();
  const nutrition = useNutrition();
  const { sessionUserId } = useAuth();

  const isOpen = props.isOpen !== undefined ? props.isOpen : ui.isQuickLogOpen;
  const onClose = props.onClose || ui.closeQuickLog;
  const selectedDate = props.selectedDate || nutrition.selectedDate;
  const onAddFood =
    props.onAddFood ||
    ((food, meal, qty) => nutrition.addFood(food, meal, qty, selectedDate));

  // Navigation & View state
  const [selectedMeal, setSelectedMeal] = useState<MealType>(
    props.initialMeal || ui.quickLogInitialMeal || 'breakfast'
  );
  const [activeTab, setActiveTab] = useState<'search' | 'detail'>('search');
  const [selectedFoodForDetail, setSelectedFoodForDetail] = useState<FoodItem | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Search & Category state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Detail / Quantity customizer state
  const [customQuantity, setCustomQuantity] = useState<number>(1);
  const [customQtyInput, setCustomQtyInput] = useState<string>('1');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Check if search mode is active (user typed something)
  const isSearchActive = searchQuery.trim().length > 0;

  // Logged foods for currently selected meal today
  const loggedMealItems: LoggedFoodItem[] = useMemo(() => {
    const dayLog = nutrition.currentDayLog;
    if (!dayLog || !dayLog.meals || !dayLog.meals[selectedMeal]) return [];
    return dayLog.meals[selectedMeal] || [];
  }, [nutrition.currentDayLog, selectedMeal]);

  // Total calories of logged foods for this meal
  const mealLoggedCalories = useMemo(() => {
    return loggedMealItems.reduce(
      (sum, item) => sum + Math.round(Number(item.calories || 0) * Number(item.quantity || 1)),
      0
    );
  }, [loggedMealItems]);

  // Load available categories on mount
  useEffect(() => {
    nutritionService.getFoodCategories().then(setCategories);
  }, []);

  // Sync initial meal and reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMeal(props.initialMeal || ui.quickLogInitialMeal || 'breakfast');
      setActiveTab('search');
      setSelectedFoodForDetail(null);
      setEditingLogId(null);
      setSearchQuery('');
      setSelectedCategory('All');
      setSavedSuccess(false);
      setIsSaving(false);
    }
  }, [isOpen, props.initialMeal, ui.quickLogInitialMeal]);

  // Debounced server-side search effect - ONLY runs when user types
  useEffect(() => {
    if (!isSearchActive) {
      setSearchResults([]);
      setIsLoading(false);
      setFetchError(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setFetchError(null);

    const timer = setTimeout(async () => {
      try {
        const { data, error } = await nutritionService.searchFoodDatabase(
          searchQuery,
          selectedCategory,
          40,
          sessionUserId
        );
        if (isMounted) {
          if (error && (!data || data.length === 0)) {
            setFetchError('Unable to load foods from database.');
          } else {
            setSearchResults(data || []);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setFetchError('Network error while searching foods.');
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory, sessionUserId, isSearchActive]);

  // Handle selecting a food from search results to add
  const handleSelectSearchFoodItem = (food: FoodItem) => {
    setSelectedFoodForDetail(food);
    setEditingLogId(null);
    setCustomQuantity(1);
    setCustomQtyInput('1');
    setSavedSuccess(false);
    setActiveTab('detail');
  };

  // Handle tapping an existing logged food item to view / edit quantity
  const handleSelectLoggedFoodItem = (item: LoggedFoodItem) => {
    const foodItem: FoodItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      portion: item.portion,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
    };
    setSelectedFoodForDetail(foodItem);
    setEditingLogId(item.id);
    const qty = item.quantity || 1;
    setCustomQuantity(qty);
    setCustomQtyInput(String(qty));
    setSavedSuccess(false);
    setActiveTab('detail');
  };

  // Handle deleting an existing logged food item
  const handleDeleteLoggedFoodItem = async (item: LoggedFoodItem) => {
    try {
      await nutrition.deleteFood(item.id, selectedMeal, selectedDate);
      ui.showToast(`Removed ${item.name} from ${mealDisplayName}`, 'info');
    } catch (err) {
      ui.showToast('Failed to delete food log', 'error');
    }
  };

  // Adjust quantity
  const handleAdjustQuantity = (delta: number) => {
    const next = Math.max(0.25, Math.round((customQuantity + delta) * 100) / 100);
    setCustomQuantity(next);
    setCustomQtyInput(String(next));
  };

  const handleSetExactQuantity = (qty: number) => {
    const safeQty = Math.max(0.1, Math.round(qty * 100) / 100);
    setCustomQuantity(safeQty);
    setCustomQtyInput(String(safeQty));
  };

  const handleQtyInputChange = (text: string) => {
    setCustomQtyInput(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed) && parsed > 0) {
      setCustomQuantity(parsed);
    }
  };

  const mealDisplayName =
    selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1);

  // Confirm Add or Update food log
  const handleConfirmLogFood = async () => {
    if (!selectedFoodForDetail) return;
    setIsSaving(true);
    try {
      if (editingLogId) {
        await nutrition.updateFoodQuantity(
          editingLogId,
          customQuantity,
          selectedMeal,
          selectedDate
        );
        setSavedSuccess(true);
        ui.showToast(
          `Updated ${selectedFoodForDetail.name} (${customQuantity}x) in ${mealDisplayName}! 🥗`,
          'success'
        );
      } else {
        await onAddFood(selectedFoodForDetail, selectedMeal, customQuantity);
        setSavedSuccess(true);
        ui.showToast(
          `Logged ${selectedFoodForDetail.name} (${customQuantity}x) to ${mealDisplayName}! 🥗`,
          'success'
        );
      }
      setTimeout(() => {
        setIsSaving(false);
        setSavedSuccess(false);
        setEditingLogId(null);
        setActiveTab('search');
        onClose();
      }, 500);
    } catch (err) {
      setIsSaving(false);
      ui.showToast('Failed to save food log', 'error');
    }
  };

  if (!isOpen) return null;

  // Recalculated macros for detail view
  const detailedMacros = selectedFoodForDetail
    ? {
        calories: Math.round(selectedFoodForDetail.calories * customQuantity),
        protein: Math.round(selectedFoodForDetail.protein * customQuantity * 10) / 10,
        carbs: Math.round(selectedFoodForDetail.carbs * customQuantity * 10) / 10,
        fat: Math.round(selectedFoodForDetail.fat * customQuantity * 10) / 10,
        fiber: Math.round((selectedFoodForDetail.fiber || 0) * customQuantity * 10) / 10,
      }
    : { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      hideHeader={true}
      scrollable={false}
      heightPercent={Platform.OS === 'web' ? 85 : 88}
      contentStyle={styles.sheetBodyContainer}
      footer={
        activeTab === 'detail' ? (
          <View style={styles.footerRow}>
            <Button
              variant="outline"
              size="md"
              onPress={() => setActiveTab('search')}
              style={styles.halfBtn}
              leftIcon={<ArrowLeft size={16} color={colors.surface[700]} />}
            >
              {editingLogId ? 'Back to Log' : 'Back to Search'}
            </Button>
            <Button
              variant="primary"
              size="md"
              onPress={handleConfirmLogFood}
              style={styles.halfBtn}
              disabled={isSaving}
              leftIcon={
                savedSuccess ? (
                  <CheckCircle2 size={16} color={colors.surface.white} />
                ) : isSaving ? (
                  <ActivityIndicator size="small" color={colors.surface.white} />
                ) : (
                  <Plus size={16} color={colors.surface.white} />
                )
              }
            >
              {savedSuccess
                ? 'Saved!'
                : isSaving
                ? 'Saving...'
                : editingLogId
                ? `Update ${mealDisplayName}`
                : `Log to ${mealDisplayName}`}
            </Button>
          </View>
        ) : (
          <View style={styles.footerRow}>
            <Button variant="outline" size="md" onPress={onClose} style={styles.halfBtn}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onPress={onClose} style={styles.halfBtn}>
              Done
            </Button>
          </View>
        )
      }
    >
      <View style={styles.container}>
        {/* ========================================================================= */}
        {/* VIEW 1: MEAL LOG / SEARCH                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'search' && (
          <View style={styles.searchMainWrapper}>
            {/* FIXED TOP HEADER & CONTROLS */}
            <View style={styles.fixedHeaderBox}>
              {/* Header Title & Close Button */}
              <View style={styles.titleRow}>
                <View>
                  <Text style={styles.mainTitle}>Add Food</Text>
                  <Text style={styles.mainSubtitle}>
                    Logging for {mealDisplayName} · {formatDateDisplay(selectedDate)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeCircleBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <X size={18} color={colors.surface[600]} />
                </TouchableOpacity>
              </View>

              {/* Target Meal Selector Bar */}
              <View style={styles.mealSelectorRow}>
                {quickMealCategories.map((meal) => {
                  const isSelected = selectedMeal === meal.id;
                  return (
                    <TouchableOpacity
                      key={meal.id}
                      onPress={() => setSelectedMeal(meal.id)}
                      style={[
                        styles.mealSelectorPill,
                        isSelected && styles.mealSelectorPillActive,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.mealSelectorIcon}>{meal.icon}</Text>
                      <Text
                        style={[
                          styles.mealSelectorText,
                          isSelected && styles.mealSelectorTextActive,
                        ]}
                      >
                        {meal.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* PROMINENT SEARCH BAR */}
              <View style={styles.searchBarContainer}>
                <Search size={18} color={colors.brand.primary} style={styles.searchIcon} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search foods..."
                  placeholderTextColor={colors.surface[400]}
                  style={styles.searchTextInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                />

                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    style={styles.clearSearchBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <X size={16} color={colors.surface[500]} />
                  </TouchableOpacity>
                )}
              </View>

              {/* CATEGORY FILTERS & META BAR — ONLY VISIBLE IN SEARCH MODE */}
              {isSearchActive ? (
                <>
                  <View style={styles.categoryScrollContainer}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.categoryScrollTrack}
                    >
                      {categories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <TouchableOpacity
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            style={[
                              styles.categoryFilterChip,
                              isSelected && styles.categoryFilterChipActive,
                            ]}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.categoryFilterChipText,
                                isSelected && styles.categoryFilterChipTextActive,
                              ]}
                            >
                              {cat}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  <View style={styles.resultsMetaBar}>
                    <Text style={styles.resultsCountLabel}>
                      {isLoading
                        ? 'Searching verified USDA database...'
                        : `${searchResults.length} matching foods found`}
                    </Text>
                    {selectedCategory !== 'All' && (
                      <TouchableOpacity
                        onPress={() => setSelectedCategory('All')}
                        style={styles.clearCatButton}
                      >
                        <Text style={styles.clearCatButtonText}>Reset Category</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              ) : (
                /* DEFAULT STATE HEADER: SHOWS LOGGED SUMMARY FOR THIS MEAL */
                <View style={styles.loggedHeaderBar}>
                  <Text style={styles.loggedHeaderTitle}>
                    TODAY'S {selectedMeal.toUpperCase()} ({loggedMealItems.length})
                  </Text>
                  {loggedMealItems.length > 0 && (
                    <Text style={styles.loggedHeaderCal}>
                      🔥 {mealLoggedCalories} kcal total
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* DEDICATED SCROLLABLE RESULTS AREA */}
            <ScrollView
              style={styles.resultsScrollView}
              contentContainerStyle={styles.resultsScrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {isSearchActive ? (
                /* ========================================================= */
                /* SEARCH RESULTS LIST                                       */
                /* ========================================================= */
                isLoading ? (
                  <View style={styles.centerLoadingState}>
                    <ActivityIndicator size="large" color={colors.brand.primary} />
                    <Text style={styles.loadingStateText}>
                      Searching verified USDA database...
                    </Text>
                  </View>
                ) : fetchError ? (
                  <View style={styles.stateCard}>
                    <Text style={styles.stateCardTitle}>⚠️ {fetchError}</Text>
                    <TouchableOpacity
                      onPress={() => setSearchQuery((q) => q)}
                      style={styles.retryActionBtn}
                    >
                      <Text style={styles.retryActionBtnText}>Tap to Retry</Text>
                    </TouchableOpacity>
                  </View>
                ) : searchResults.length === 0 ? (
                  <View style={styles.stateCard}>
                    <Utensils size={36} color={colors.surface[300]} style={{ marginBottom: 8 }} />
                    <Text style={styles.stateCardTitle}>
                      No foods found matching "{searchQuery}"
                    </Text>
                    <Text style={styles.stateCardSubtitle}>
                      Try searching for staple foods like chicken, egg, oats, avocado, rice, or salmon.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.foodCardsStack}>
                    {searchResults.map((food) => (
                      <TouchableOpacity
                        key={food.id}
                        onPress={() => handleSelectSearchFoodItem(food)}
                        style={styles.foodItemCard}
                        activeOpacity={0.7}
                      >
                        <View style={styles.foodCardBody}>
                          <View style={styles.foodTextGroup}>
                            <Text style={styles.foodItemName} numberOfLines={2}>
                              {food.name}
                            </Text>

                            <View style={styles.foodMetaBadgeRow}>
                              <Badge variant="slate" size="sm">
                                {food.portion || '100g serving'}
                              </Badge>
                              <Text style={styles.foodCategoryLabel} numberOfLines={1}>
                                {food.category}
                              </Text>
                            </View>

                            <View style={styles.foodMacroPreviewRow}>
                              <Text style={styles.macroCalVal}>
                                🔥 {Math.round(food.calories)} kcal
                              </Text>
                              <Text style={styles.macroPillVal}>P: {food.protein}g</Text>
                              <Text style={styles.macroPillVal}>C: {food.carbs}g</Text>
                              <Text style={styles.macroPillVal}>F: {food.fat}g</Text>
                              {Number(food.fiber) > 0 && (
                                <Text style={styles.macroPillVal}>Fib: {food.fiber}g</Text>
                              )}
                            </View>
                          </View>

                          <View style={styles.chevronCircle}>
                            <Plus size={16} color={colors.brand.primary} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )
              ) : (
                /* ========================================================= */
                /* DEFAULT STATE: SHOWS TODAY'S LOGGED FOODS FOR THIS MEAL   */
                /* ========================================================= */
                loggedMealItems.length === 0 ? (
                  <View style={styles.stateCard}>
                    <View style={styles.emptyIconBadge}>
                      <Utensils size={28} color={colors.brand.primary} />
                    </View>
                    <Text style={styles.stateCardTitle}>No foods added yet</Text>
                    <Text style={styles.stateCardSubtitle}>
                      Search for a food above to add it to your {mealDisplayName}.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.foodCardsStack}>
                    {loggedMealItems.map((item) => {
                      const totalCals = Math.round(Number(item.calories || 0) * Number(item.quantity || 1));
                      const totalP = Math.round(Number(item.protein || 0) * Number(item.quantity || 1) * 10) / 10;
                      const totalC = Math.round(Number(item.carbs || 0) * Number(item.quantity || 1) * 10) / 10;
                      const totalF = Math.round(Number(item.fat || 0) * Number(item.quantity || 1) * 10) / 10;
                      const totalFib = Math.round(Number(item.fiber || 0) * Number(item.quantity || 1) * 10) / 10;

                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleSelectLoggedFoodItem(item)}
                          style={styles.loggedFoodCard}
                          activeOpacity={0.7}
                        >
                          <View style={styles.foodCardBody}>
                            <View style={styles.foodTextGroup}>
                              <Text style={styles.foodItemName} numberOfLines={2}>
                                {item.name}
                              </Text>

                              <View style={styles.foodMetaBadgeRow}>
                                <Badge variant="emerald" size="sm">
                                  {item.quantity}x ({item.portion || '1 serving'})
                                </Badge>
                                <Text style={styles.foodCategoryLabel} numberOfLines={1}>
                                  {item.category}
                                </Text>
                              </View>

                              <View style={styles.foodMacroPreviewRow}>
                                <Text style={styles.macroCalVal}>
                                  🔥 {totalCals} kcal
                                </Text>
                                <Text style={styles.macroPillVal}>P: {totalP}g</Text>
                                <Text style={styles.macroPillVal}>C: {totalC}g</Text>
                                <Text style={styles.macroPillVal}>F: {totalF}g</Text>
                                {totalFib > 0 && (
                                  <Text style={styles.macroPillVal}>Fib: {totalFib}g</Text>
                                )}
                              </View>
                            </View>

                            <View style={styles.loggedCardActions}>
                              <TouchableOpacity
                                onPress={() => handleSelectLoggedFoodItem(item)}
                                style={styles.editActionCircle}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <Edit3 size={15} color={colors.surface[600]} />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleDeleteLoggedFoodItem(item)}
                                style={styles.deleteActionCircle}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                              >
                                <Trash2 size={15} color="#DC2626" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )
              )}
            </ScrollView>
          </View>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: FOOD DETAIL & QUANTITY CUSTOMIZER                                */}
        {/* ========================================================================= */}
        {activeTab === 'detail' && selectedFoodForDetail && (
          <ScrollView
            style={styles.detailScrollView}
            contentContainerStyle={styles.detailScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Food Title & USDA Badge Card */}
            <View style={styles.detailHeroBox}>
              <View style={styles.detailHeroTopRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.detailMainTitle}>
                    {selectedFoodForDetail.name}
                  </Text>
                  <Text style={styles.detailSubCategory}>
                    {selectedFoodForDetail.category} · {selectedFoodForDetail.portion || '100g serving'}
                  </Text>
                </View>
                <Badge variant={editingLogId ? 'emerald' : 'emerald'} size="sm">
                  {editingLogId ? 'Logged Item' : 'USDA Verified'}
                </Badge>
              </View>

              {/* Target Meal Switcher inside Detail */}
              <View style={styles.detailMealSection}>
                <Text style={styles.detailSectionSub}>LOGGING TO MEAL:</Text>
                <View style={styles.detailMealRow}>
                  {quickMealCategories.map((meal) => {
                    const isSelected = selectedMeal === meal.id;
                    return (
                      <TouchableOpacity
                        key={meal.id}
                        onPress={() => setSelectedMeal(meal.id)}
                        style={[
                          styles.detailMealPill,
                          isSelected && styles.detailMealPillSelected,
                        ]}
                      >
                        <Text style={styles.detailMealIcon}>{meal.icon}</Text>
                        <Text
                          style={[
                            styles.detailMealText,
                            isSelected && styles.detailMealTextSelected,
                          ]}
                        >
                          {meal.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Recalculated Calorie Hero Card */}
            <View style={styles.calorieBannerBox}>
              <View>
                <Text style={styles.calBigNumber}>{detailedMacros.calories}</Text>
                <Text style={styles.calBigUnit}>TOTAL CALORIES</Text>
              </View>
              <View style={styles.multiplierBadgeBox}>
                <Text style={styles.multiplierBadgeText}>{customQuantity}x serving</Text>
              </View>
            </View>

            {/* Recalculated 4-Macro Grid */}
            <View style={styles.macroBoxesGrid}>
              <View style={[styles.macroStatBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                <Text style={[styles.macroStatNumber, { color: '#1D4ED8' }]}>{detailedMacros.protein}g</Text>
                <Text style={styles.macroStatLabel}>PROTEIN</Text>
              </View>
              <View style={[styles.macroStatBox, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                <Text style={[styles.macroStatNumber, { color: '#B45309' }]}>{detailedMacros.carbs}g</Text>
                <Text style={styles.macroStatLabel}>CARBS</Text>
              </View>
              <View style={[styles.macroStatBox, { backgroundColor: '#FDF2F8', borderColor: '#FBCFE8' }]}>
                <Text style={[styles.macroStatNumber, { color: '#BE185D' }]}>{detailedMacros.fat}g</Text>
                <Text style={styles.macroStatLabel}>FAT</Text>
              </View>
              <View style={[styles.macroStatBox, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                <Text style={[styles.macroStatNumber, { color: '#047857' }]}>{detailedMacros.fiber}g</Text>
                <Text style={styles.macroStatLabel}>FIBER</Text>
              </View>
            </View>

            {/* Quantity Stepper & Preset Buttons */}
            <View style={styles.quantityCardWrapper}>
              <Text style={styles.quantityCardTitle}>SERVING QUANTITY</Text>

              <View style={styles.stepperControlRow}>
                <TouchableOpacity
                  onPress={() => handleAdjustQuantity(-0.25)}
                  style={styles.stepperActionBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Minus size={20} color={colors.surface[700]} />
                </TouchableOpacity>

                <View style={styles.stepperDisplayBox}>
                  <TextInput
                    value={customQtyInput}
                    onChangeText={handleQtyInputChange}
                    keyboardType="numeric"
                    style={styles.stepperTextEntry}
                    selectTextOnFocus
                  />
                  <Text style={styles.stepperUnitSub}>servings</Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleAdjustQuantity(0.25)}
                  style={styles.stepperActionBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Plus size={20} color={colors.surface[700]} />
                </TouchableOpacity>
              </View>

              {/* Multiplier Presets */}
              <View style={styles.multiplierPillsTrack}>
                {[0.5, 1.0, 1.5, 2.0, 3.0].map((preset) => {
                  const isMatch = customQuantity === preset;
                  return (
                    <TouchableOpacity
                      key={preset}
                      onPress={() => handleSetExactQuantity(preset)}
                      style={[
                        styles.presetChip,
                        isMatch && styles.presetChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          isMatch && styles.presetChipTextActive,
                        ]}
                      >
                        {preset}x
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBodyContainer: {
    padding: 0,
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  searchMainWrapper: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  fixedHeaderBox: {
    flexShrink: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[900],
  },
  mainSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.surface[500],
    marginTop: 1,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.surface[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: 4,
  },
  mealSelectorPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: radii.lg,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  mealSelectorPillActive: {
    backgroundColor: colors.brand.light,
    borderColor: colors.brand.primary,
  },
  mealSelectorIcon: {
    fontSize: 13,
  },
  mealSelectorText: {
    fontSize: typography.fontSize.xs,
    color: colors.surface[700],
    fontWeight: typography.fontWeight.semibold as any,
  },
  mealSelectorTextActive: {
    color: colors.brand.primary,
    fontWeight: typography.fontWeight.bold as any,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.surface[200],
    paddingHorizontal: spacing.md,
    height: 44,
    marginTop: 2,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchTextInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.surface[900],
    paddingVertical: 0,
  },

  clearSearchBtn: {
    padding: 4,
  },
  categoryScrollContainer: {
    marginHorizontal: -spacing.lg,
    marginTop: 4,
  },
  categoryScrollTrack: {
    paddingHorizontal: spacing.lg,
    gap: 6,
  },
  categoryFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surface[100],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  categoryFilterChipActive: {
    backgroundColor: colors.surface[900],
    borderColor: colors.surface[900],
  },
  categoryFilterChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.surface[600],
    fontWeight: typography.fontWeight.medium as any,
  },
  categoryFilterChipTextActive: {
    color: colors.surface.white,
    fontWeight: typography.fontWeight.bold as any,
  },
  resultsMetaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  resultsCountLabel: {
    fontSize: typography.fontSize['2xs'],
    color: colors.surface[500],
    fontWeight: typography.fontWeight.medium as any,
  },
  clearCatButton: {
    paddingVertical: 2,
  },
  clearCatButtonText: {
    fontSize: typography.fontSize['2xs'],
    color: colors.brand.primary,
    fontWeight: typography.fontWeight.semibold as any,
  },
  loggedHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 2,
  },
  loggedHeaderTitle: {
    fontSize: typography.fontSize['2xs'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[500],
    letterSpacing: 0.5,
  },
  loggedHeaderCal: {
    fontSize: typography.fontSize['2xs'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.nutrition.energy,
  },
  // SCROLLABLE RESULTS AREA
  resultsScrollView: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.surface[50],
  },
  resultsScrollContent: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  centerLoadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  loadingStateText: {
    fontSize: typography.fontSize.xs,
    color: colors.surface[500],
  },
  stateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: colors.surface.white,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  emptyIconBadge: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.brand.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stateCardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[800],
    textAlign: 'center',
  },
  stateCardSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.surface[500],
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
    lineHeight: 18,
  },
  retryActionBtn: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.brand.primary,
    borderRadius: radii.md,
  },
  retryActionBtnText: {
    color: colors.surface.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold as any,
  },
  foodCardsStack: {
    gap: spacing.sm,
  },
  foodItemCard: {
    backgroundColor: colors.surface.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.subtle,
  },
  loggedFoodCard: {
    backgroundColor: colors.surface.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.subtle,
  },
  foodCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodTextGroup: {
    flex: 1,
    marginRight: spacing.sm,
  },
  foodItemName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[900],
  },
  foodMetaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  foodCategoryLabel: {
    fontSize: typography.fontSize['2xs'],
    color: colors.surface[500],
    flex: 1,
  },
  foodMacroPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  macroCalVal: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.nutrition.energy,
  },
  macroPillVal: {
    fontSize: typography.fontSize['2xs'],
    color: colors.surface[600],
    fontWeight: typography.fontWeight.medium as any,
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.brand.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loggedCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editActionCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.surface[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionCircle: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // DETAIL VIEW STYLES
  detailScrollView: {
    flex: 1,
    minHeight: 0,
  },
  detailScrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
    gap: spacing.md,
  },
  detailHeroBox: {
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing.sm,
  },
  detailHeroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailMainTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[900],
  },
  detailSubCategory: {
    fontSize: typography.fontSize.xs,
    color: colors.surface[500],
    marginTop: 2,
  },
  detailMealSection: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.surface[200],
    paddingTop: spacing.xs,
  },
  detailSectionSub: {
    fontSize: typography.fontSize['2xs'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[500],
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  detailMealRow: {
    flexDirection: 'row',
    gap: 6,
  },
  detailMealPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: radii.md,
    backgroundColor: colors.surface[100],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  detailMealPillSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  detailMealIcon: {
    fontSize: 12,
  },
  detailMealText: {
    fontSize: typography.fontSize.xs,
    color: colors.surface[700],
    fontWeight: typography.fontWeight.medium as any,
  },
  detailMealTextSelected: {
    color: colors.surface.white,
    fontWeight: typography.fontWeight.bold as any,
  },
  calorieBannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface[900],
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  calBigNumber: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: '#FDE047',
  },
  calBigUnit: {
    fontSize: typography.fontSize['2xs'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[400],
    letterSpacing: 0.5,
  },
  multiplierBadgeBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radii.full,
  },
  multiplierBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.surface.white,
    fontWeight: typography.fontWeight.semibold as any,
  },
  macroBoxesGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  macroStatBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  macroStatNumber: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold as any,
  },
  macroStatLabel: {
    fontSize: typography.fontSize['2xs'],
    color: colors.surface[500],
    fontWeight: typography.fontWeight.semibold as any,
    marginTop: 2,
  },
  quantityCardWrapper: {
    backgroundColor: colors.surface.white,
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing.sm,
  },
  quantityCardTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[600],
    letterSpacing: 0.5,
  },
  stepperControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  stepperActionBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    backgroundColor: colors.surface[100],
    borderWidth: 1,
    borderColor: colors.surface[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDisplayBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperTextEntry: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.surface[900],
    textAlign: 'center',
    padding: 0,
    minWidth: 60,
  },
  stepperUnitSub: {
    fontSize: typography.fontSize['2xs'],
    color: colors.surface[500],
  },
  multiplierPillsTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: 4,
  },
  presetChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: radii.md,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  presetChipActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  presetChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.surface[700],
    fontWeight: typography.fontWeight.semibold as any,
  },
  presetChipTextActive: {
    color: colors.surface.white,
    fontWeight: typography.fontWeight.bold as any,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  halfBtn: {
    flex: 1,
  },
});
