/**
 * NutriFlow Nutrition Context
 * Live macro engine, daily meal logging, hydration tracking, and custom recipes
 */

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import {
  FoodItem,
  LoggedFoodItem,
  DailyMealLog,
  MealTotals,
  DayTotals,
  MealType,
  Recipe,
} from '../types/nutrition';
import { NutritionTargets } from '../types/user';
import {
  STORAGE_KEYS,
  DEFAULT_TARGETS,
  loadStoredData,
  saveStoredData,
} from '../services/storage';
import { getTodayKey } from '../utils/date';
import {
  prebuiltRecipes,
  calculateRecipeNutrition,
} from '../data/foodDatabase';

import { useAuth } from './AuthContext';
import { nutritionService } from '../services/nutrition/nutritionService';
import { dailyTrackingService } from '../services/tracking/dailyTrackingService';

interface NutritionState {
  selectedDate: string;
  targets: NutritionTargets;
  logsByDate: Record<string, DailyMealLog>;
  customRecipes: Recipe[];
}

type NutritionAction =
  | { type: 'SET_INITIAL_STATE'; payload: NutritionState }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'SET_DAY_LOGS'; payload: { date: string; meals: Record<MealType, LoggedFoodItem[]>; water: number } }
  | { type: 'UPDATE_TARGETS'; payload: Partial<NutritionTargets> }
  | { type: 'ADD_FOOD'; payload: { food: FoodItem | Partial<LoggedFoodItem>; mealType: MealType; quantity: number; date?: string; id?: string } }
  | { type: 'UPDATE_FOOD_QUANTITY'; payload: { foodId: string; quantity: number; mealType: MealType; date?: string } }
  | { type: 'DELETE_FOOD'; payload: { foodId: string; mealType: MealType; date?: string } }
  | { type: 'CLEAR_MEAL'; payload: { mealType: MealType; date?: string } }
  | { type: 'ADD_WATER'; payload: { liters: number; date?: string } }
  | { type: 'SET_WATER'; payload: { liters: number; date?: string } }
  | { type: 'RESET_DAY'; payload: { date?: string } }
  | { type: 'CREATE_RECIPE'; payload: { recipe: Recipe } }
  | { type: 'UPDATE_RECIPE'; payload: { recipeId: string; recipe: Recipe } }
  | { type: 'DELETE_RECIPE'; payload: { recipeId: string } };

const defaultState: NutritionState = {
  selectedDate: getTodayKey(),
  targets: DEFAULT_TARGETS,
  logsByDate: {},
  customRecipes: [],
};

function nutritionReducer(state: NutritionState, action: NutritionAction): NutritionState {
  switch (action.type) {
    case 'SET_INITIAL_STATE': {
      return action.payload;
    }

    case 'SET_SELECTED_DATE': {
      return {
        ...state,
        selectedDate: action.payload,
      };
    }

    case 'UPDATE_TARGETS': {
      return {
        ...state,
        targets: {
          ...state.targets,
          ...action.payload,
        },
      };
    }

    case 'SET_DAY_LOGS': {
      const { date, meals, water } = action.payload;
      return {
        ...state,
        logsByDate: {
          ...state.logsByDate,
          [date]: {
            water,
            meals,
          },
        },
      };
    }

    case 'ADD_FOOD': {
      const { date, mealType, food, quantity = 1, id: customId } = action.payload;
      const targetDate = date || state.selectedDate;
      const targetMeal = (mealType || 'breakfast').toLowerCase() as MealType;

      const dayLog: DailyMealLog = state.logsByDate[targetDate] || {
        water: 0,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
      };

      const mealItems = dayLog.meals[targetMeal] || [];

      const newItem: LoggedFoodItem = {
        id: customId || 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        name: food.name || 'Custom Food',
        portion: food.portion || '1 serving',
        calories: Number(food.calories) || 0,
        protein: Number(food.protein) || 0,
        carbs: Number(food.carbs) || 0,
        fat: Number(food.fat) || 0,
        fiber: Number(food.fiber) || 0,
        category: food.category || 'General',
        quantity: Number(quantity) || 1,
        loggedAt: new Date().toISOString(),
      };

      return {
        ...state,
        logsByDate: {
          ...state.logsByDate,
          [targetDate]: {
            ...dayLog,
            meals: {
              ...dayLog.meals,
              [targetMeal]: [newItem, ...mealItems],
            },
          },
        },
      };
    }

    case 'UPDATE_FOOD_QUANTITY': {
      const { date, mealType, foodId, quantity } = action.payload;
      const targetDate = date || state.selectedDate;
      const targetMeal = (mealType || 'breakfast').toLowerCase() as MealType;

      const dayLog = state.logsByDate[targetDate];
      if (!dayLog || !dayLog.meals[targetMeal]) return state;

      const updatedMealItems = dayLog.meals[targetMeal].map((item) =>
        item.id === foodId ? { ...item, quantity: Math.max(0.25, Number(quantity)) } : item
      );

      return {
        ...state,
        logsByDate: {
          ...state.logsByDate,
          [targetDate]: {
            ...dayLog,
            meals: {
              ...dayLog.meals,
              [targetMeal]: updatedMealItems,
            },
          },
        },
      };
    }

    case 'DELETE_FOOD': {
      const { date, mealType, foodId } = action.payload;
      const targetDate = date || state.selectedDate;
      const targetMeal = (mealType || 'breakfast').toLowerCase() as MealType;

      const dayLog = state.logsByDate[targetDate];
      if (!dayLog || !dayLog.meals[targetMeal]) return state;

      const updatedMealItems = dayLog.meals[targetMeal].filter((item) => item.id !== foodId);

      return {
        ...state,
        logsByDate: {
          ...state.logsByDate,
          [targetDate]: {
            ...dayLog,
            meals: {
              ...dayLog.meals,
              [targetMeal]: updatedMealItems,
            },
          },
        },
      };
    }

    case 'CLEAR_MEAL': {
      const { date, mealType } = action.payload;
      const targetDate = date || state.selectedDate;
      const targetMeal = (mealType || 'breakfast').toLowerCase() as MealType;

      const dayLog = state.logsByDate[targetDate];
      if (!dayLog) return state;

      return {
        ...state,
        logsByDate: {
          ...state.logsByDate,
          [targetDate]: {
            ...dayLog,
            meals: {
              ...dayLog.meals,
              [targetMeal]: [],
            },
          },
        },
      };
    }

    case 'ADD_WATER': {
      const { date, liters = 0.25 } = action.payload;
      const targetDate = date || state.selectedDate;

      const dayLog = state.logsByDate[targetDate] || {
        water: 0,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
      };

      const currentWater = dayLog.water || 0;
      const newWater = Math.round((currentWater + Number(liters)) * 100) / 100;

      return {
        ...state,
        logsByDate: {
          ...state.logsByDate,
          [targetDate]: {
            ...dayLog,
            water: Math.max(0, newWater),
          },
        },
      };
    }

    case 'SET_WATER': {
      const { date, liters } = action.payload;
      const targetDate = date || state.selectedDate;

      const dayLog = state.logsByDate[targetDate] || {
        water: 0,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
      };

      return {
        ...state,
        logsByDate: {
          ...state.logsByDate,
          [targetDate]: {
            ...dayLog,
            water: Math.max(0, Number(liters) || 0),
          },
        },
      };
    }

    case 'RESET_DAY': {
      const { date } = action.payload;
      const targetDate = date || state.selectedDate;

      return {
        ...state,
        logsByDate: {
          ...state.logsByDate,
          [targetDate]: {
            water: 0,
            meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
          },
        },
      };
    }

    case 'CREATE_RECIPE': {
      return {
        ...state,
        customRecipes: [action.payload.recipe, ...state.customRecipes],
      };
    }

    case 'UPDATE_RECIPE': {
      const { recipeId, recipe } = action.payload;
      return {
        ...state,
        customRecipes: state.customRecipes.map((r) => (r.id === recipeId ? recipe : r)),
      };
    }

    case 'DELETE_RECIPE': {
      return {
        ...state,
        customRecipes: state.customRecipes.filter((r) => r.id !== action.payload.recipeId),
      };
    }

    default:
      return state;
  }
}

interface NutritionContextType {
  selectedDate: string;
  setSelectedDate: (dateKey: string) => void;
  targets: NutritionTargets;
  updateTargets: (newTargets: Partial<NutritionTargets>) => void;
  logsByDate: Record<string, DailyMealLog>;
  currentDayLog: DailyMealLog;
  totals: DayTotals;
  mealTotals: Record<MealType, MealTotals>;
  addFood: (food: FoodItem | Partial<LoggedFoodItem>, mealType?: MealType, quantity?: number, date?: string) => void;
  updateFoodQuantity: (foodId: string, quantity: number, mealType?: MealType, date?: string) => void;
  deleteFood: (foodId: string, mealType?: MealType, date?: string) => void;
  clearMeal: (mealType: MealType, date?: string) => void;
  addWater: (liters?: number, date?: string) => void;
  setWater: (liters: number, date?: string) => void;
  resetDay: (date?: string) => void;
  customRecipes: Recipe[];
  prebuiltRecipes: Recipe[];
  allRecipes: Recipe[];
  createRecipe: (recipeData: Partial<Recipe>) => Recipe;
  updateRecipe: (recipeId: string, recipeData: Partial<Recipe>) => Recipe;
  deleteRecipe: (recipeId: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

const NutritionContext = createContext<NutritionContextType | null>(null);

export function NutritionProvider({ children }: { children: React.ReactNode }) {
  const { sessionUserId } = useAuth();
  const [state, dispatch] = useReducer(nutritionReducer, defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    async function loadData() {
      const savedTargets = await loadStoredData<NutritionTargets>(STORAGE_KEYS.TARGETS, DEFAULT_TARGETS);
      const savedLogs = await loadStoredData<Record<string, DailyMealLog>>(STORAGE_KEYS.LOGS_BY_DATE, {});
      const savedDate = await loadStoredData<string>(STORAGE_KEYS.SELECTED_DATE, getTodayKey());
      const savedRecipes = await loadStoredData<Recipe[]>(STORAGE_KEYS.CUSTOM_RECIPES, []);

      dispatch({
        type: 'SET_INITIAL_STATE',
        payload: {
          selectedDate: savedDate,
          targets: savedTargets,
          logsByDate: savedLogs,
          customRecipes: savedRecipes,
        },
      });
      setIsLoaded(true);
    }
    loadData();
  }, []);

  // Synchronize logs from Supabase when user is authenticated or selectedDate changes
  useEffect(() => {
    if (!sessionUserId || sessionUserId === 'demo-user-elena') return;

    let isMounted = true;
    async function fetchSupabaseData() {
      try {
        const [foodRes, waterRes] = await Promise.all([
          nutritionService.getFoodLogs(sessionUserId!, state.selectedDate),
          dailyTrackingService.getWaterLogs(sessionUserId!, state.selectedDate),
        ]);

        if (!isMounted) return;

        if (!foodRes.error && !waterRes.error) {
          const meals: Record<MealType, LoggedFoodItem[]> = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: [],
          };

          for (const item of foodRes.data) {
            const mType = (item.meal_type || 'breakfast').toLowerCase() as MealType;
            if (meals[mType]) {
              meals[mType].push({
                id: item.id,
                name: item.food_name,
                portion: item.portion || '1 serving',
                calories: Number(item.calories) || 0,
                protein: Number(item.protein) || 0,
                carbs: Number(item.carbs) || 0,
                fat: Number(item.fat) || 0,
                fiber: Number(item.fiber) || 0,
                category: item.category || 'General',
                quantity: Number(item.quantity) || 1,
                loggedAt: item.logged_at,
              });
            }
          }

          dispatch({
            type: 'SET_DAY_LOGS',
            payload: {
              date: state.selectedDate,
              meals,
              water: waterRes.totalLiters,
            },
          });
        }
      } catch (err) {
        console.warn('Error fetching Supabase nutrition logs:', err);
      }
    }

    fetchSupabaseData();

    return () => {
      isMounted = false;
    };
  }, [sessionUserId, state.selectedDate]);

  // Save to AsyncStorage on changes
  useEffect(() => {
    if (isLoaded) {
      saveStoredData(STORAGE_KEYS.TARGETS, state.targets);
      saveStoredData(STORAGE_KEYS.LOGS_BY_DATE, state.logsByDate);
      saveStoredData(STORAGE_KEYS.SELECTED_DATE, state.selectedDate);
      saveStoredData(STORAGE_KEYS.CUSTOM_RECIPES, state.customRecipes);
    }
  }, [state, isLoaded]);

  // Derived calculations for active date
  const currentDayLog: DailyMealLog = state.logsByDate[state.selectedDate] || {
    water: 0,
    meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
  };

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  // Per-meal totals
  const mealTotals = mealTypes.reduce((acc, type) => {
    const items = currentDayLog.meals?.[type] || [];
    const totals = items.reduce(
      (mAcc, item) => {
        const qty = item.quantity || 1;
        return {
          calories: mAcc.calories + Math.round((item.calories || 0) * qty),
          protein: mAcc.protein + Math.round((item.protein || 0) * qty * 10) / 10,
          carbs: mAcc.carbs + Math.round((item.carbs || 0) * qty * 10) / 10,
          fat: mAcc.fat + Math.round((item.fat || 0) * qty * 10) / 10,
          fiber: mAcc.fiber + Math.round((item.fiber || 0) * qty * 10) / 10,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    acc[type] = {
      ...totals,
      items,
      count: items.length,
    };
    return acc;
  }, {} as Record<MealType, MealTotals>);

  // Overall day totals
  const dayTotals = mealTypes.reduce(
    (acc, type) => {
      const mt = mealTotals[type];
      return {
        calories: acc.calories + mt.calories,
        protein: Math.round((acc.protein + mt.protein) * 10) / 10,
        carbs: Math.round((acc.carbs + mt.carbs) * 10) / 10,
        fat: Math.round((acc.fat + mt.fat) * 10) / 10,
        fiber: Math.round((acc.fiber + mt.fiber) * 10) / 10,
        itemsCount: acc.itemsCount + mt.count,
        mealsWithFood: acc.mealsWithFood + (mt.count > 0 ? 1 : 0),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, itemsCount: 0, mealsWithFood: 0 }
  );

  const remainingCalories = Math.max(0, state.targets.calories - dayTotals.calories);
  const waterConsumed = currentDayLog.water || 0;
  const waterRemaining = Math.max(0, Math.round((state.targets.water - waterConsumed) * 100) / 100);
  const waterPercent = Math.min(100, Math.round((waterConsumed / state.targets.water) * 100));

  const totals: DayTotals = {
    ...dayTotals,
    remainingCalories,
    water: waterConsumed,
    waterRemaining,
    waterPercent,
  };

  const allRecipes = [...state.customRecipes, ...prebuiltRecipes];

  const setSelectedDate = (dateKey: string) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: dateKey });
  };

  const updateTargets = (newTargets: Partial<NutritionTargets>) => {
    dispatch({ type: 'UPDATE_TARGETS', payload: newTargets });
  };

  const addFood = async (
    food: FoodItem | Partial<LoggedFoodItem>,
    mealType: MealType = 'breakfast',
    quantity: number = 1,
    date?: string
  ) => {
    const targetDate = date || state.selectedDate;
    const targetMeal = (mealType || 'breakfast').toLowerCase() as MealType;

    // If authenticated in Supabase, persist to food_logs
    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      try {
        const res = await nutritionService.addFoodLog(sessionUserId, {
          date: targetDate,
          mealType: targetMeal,
          foodName: food.name || 'Custom Food',
          portion: food.portion || '1 serving',
          quantity,
          calories: Number(food.calories) || 0,
          protein: Number(food.protein) || 0,
          carbs: Number(food.carbs) || 0,
          fat: Number(food.fat) || 0,
          fiber: Number(food.fiber) || 0,
          category: food.category || 'General',
          foodId: (food as any).foodId || (typeof food.id === 'string' && food.id.length === 36 ? food.id : undefined),
        });

        if (res.data) {
          dispatch({
            type: 'ADD_FOOD',
            payload: { food, mealType: targetMeal, quantity, date: targetDate, id: res.data.id },
          });
          return;
        }
      } catch (err) {
        console.warn('Failed to persist food log to Supabase:', err);
      }
    }

    dispatch({
      type: 'ADD_FOOD',
      payload: { food, mealType: targetMeal, quantity, date: targetDate },
    });
  };

  const updateFoodQuantity = async (
    foodId: string,
    quantity: number,
    mealType: MealType = 'breakfast',
    date?: string
  ) => {
    const targetDate = date || state.selectedDate;
    const targetMeal = (mealType || 'breakfast').toLowerCase() as MealType;

    dispatch({
      type: 'UPDATE_FOOD_QUANTITY',
      payload: { foodId, quantity, mealType: targetMeal, date: targetDate },
    });

    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      try {
        await nutritionService.updateFoodLogQuantity(sessionUserId, foodId, quantity);
      } catch (err) {
        console.warn('Failed to update food quantity in Supabase:', err);
      }
    }
  };

  const deleteFood = async (foodId: string, mealType: MealType = 'breakfast', date?: string) => {
    const targetDate = date || state.selectedDate;
    const targetMeal = (mealType || 'breakfast').toLowerCase() as MealType;

    dispatch({
      type: 'DELETE_FOOD',
      payload: { foodId, mealType: targetMeal, date: targetDate },
    });

    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      try {
        await nutritionService.deleteFoodLog(sessionUserId, foodId);
      } catch (err) {
        console.warn('Failed to delete food log from Supabase:', err);
      }
    }
  };

  const clearMeal = (mealType: MealType, date?: string) => {
    dispatch({
      type: 'CLEAR_MEAL',
      payload: { mealType, date: date || state.selectedDate },
    });
  };

  const addWater = async (liters: number = 0.25, date?: string) => {
    const targetDate = date || state.selectedDate;

    dispatch({
      type: 'ADD_WATER',
      payload: { liters, date: targetDate },
    });

    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      try {
        await dailyTrackingService.addWaterLog(sessionUserId, targetDate, liters);
      } catch (err) {
        console.warn('Failed to add water log in Supabase:', err);
      }
    }
  };

  const setWater = (liters: number, date?: string) => {
    dispatch({
      type: 'SET_WATER',
      payload: { liters, date: date || state.selectedDate },
    });
  };

  const resetDay = (date?: string) => {
    dispatch({
      type: 'RESET_DAY',
      payload: { date: date || state.selectedDate },
    });
  };

  const createRecipe = (recipeData: Partial<Recipe>): Recipe => {
    const servings = Math.max(1, Number(recipeData.servings) || 1);
    const ingredients = recipeData.ingredients || [];
    const { perServing } = calculateRecipeNutrition(ingredients, servings);

    const newRecipe: Recipe = {
      id: 'custom-recipe-' + Date.now(),
      isCustom: true,
      name: recipeData.name || 'Custom Recipe',
      description: recipeData.description || 'Custom crafted nutrition formulation.',
      category: recipeData.category || 'High Protein',
      image:
        recipeData.image ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      prepTime: recipeData.prepTime || '10 min',
      cookTime: recipeData.cookTime || '15 min',
      totalTime: `${parseInt(recipeData.prepTime || '10') + parseInt(recipeData.cookTime || '15')} min`,
      servings,
      difficulty: recipeData.difficulty || 'Easy',
      tags: recipeData.tags || ['Custom', recipeData.category || 'Healthy'],
      ingredients,
      instructions: recipeData.instructions || [],
      nutrition: perServing,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'CREATE_RECIPE', payload: { recipe: newRecipe } });
    return newRecipe;
  };

  const updateRecipe = (recipeId: string, recipeData: Partial<Recipe>): Recipe => {
    const servings = Math.max(1, Number(recipeData.servings) || 1);
    const ingredients = recipeData.ingredients || [];
    const { perServing } = calculateRecipeNutrition(ingredients, servings);

    const updatedRecipe: Recipe = {
      ...recipeData,
      id: recipeId,
      isCustom: true,
      name: recipeData.name || 'Updated Recipe',
      description: recipeData.description || '',
      category: recipeData.category || 'High Protein',
      image: recipeData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      prepTime: recipeData.prepTime || '10 min',
      cookTime: recipeData.cookTime || '15 min',
      servings,
      difficulty: recipeData.difficulty || 'Easy',
      tags: recipeData.tags || ['Custom'],
      ingredients,
      instructions: recipeData.instructions || [],
      totalTime: `${parseInt(recipeData.prepTime || '10') + parseInt(recipeData.cookTime || '15')} min`,
      nutrition: perServing,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_RECIPE', payload: { recipeId, recipe: updatedRecipe } });
    return updatedRecipe;
  };

  const deleteRecipe = (recipeId: string) => {
    dispatch({ type: 'DELETE_RECIPE', payload: { recipeId } });
  };

  const getRecipeById = (id: string) => {
    return allRecipes.find((r) => r.id === id);
  };

  return (
    <NutritionContext.Provider
      value={{
        selectedDate: state.selectedDate,
        setSelectedDate,
        targets: state.targets,
        updateTargets,
        logsByDate: state.logsByDate,
        currentDayLog,
        totals,
        mealTotals,
        addFood,
        updateFoodQuantity,
        deleteFood,
        clearMeal,
        addWater,
        setWater,
        resetDay,
        customRecipes: state.customRecipes,
        prebuiltRecipes,
        allRecipes,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition(): NutritionContextType {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}
