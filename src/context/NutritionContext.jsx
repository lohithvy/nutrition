import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  STORAGE_KEYS,
  DEFAULT_TARGETS,
  getTodayKey,
  loadStoredData,
  saveStoredData,
} from '../utils/storage';
import {
  prebuiltRecipes,
  calculateRecipeNutrition,
} from '../data/foodDatabase';

const NutritionContext = createContext(null);

const initialState = () => {
  const savedTargets = loadStoredData(STORAGE_KEYS.TARGETS, DEFAULT_TARGETS);
  const savedLogs = loadStoredData(STORAGE_KEYS.LOGS_BY_DATE, {});
  const savedDate = loadStoredData(STORAGE_KEYS.SELECTED_DATE, getTodayKey());
  const savedRecipes = loadStoredData(STORAGE_KEYS.CUSTOM_RECIPES, []);

  return {
    selectedDate: savedDate,
    targets: savedTargets,
    logsByDate: savedLogs,
    customRecipes: savedRecipes,
  };
};

function nutritionReducer(state, action) {
  switch (action.type) {
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

    case 'ADD_FOOD': {
      const { date, mealType, food, quantity = 1 } = action.payload;
      const targetDate = date || state.selectedDate;
      const targetMeal = (mealType || 'breakfast').toLowerCase();

      const dayLog = state.logsByDate[targetDate] || {
        water: 0,
        meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
      };

      const mealItems = dayLog.meals[targetMeal] || [];

      const newItem = {
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        name: food.name,
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
      const targetMeal = (mealType || 'breakfast').toLowerCase();

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
      const targetMeal = (mealType || 'breakfast').toLowerCase();

      const dayLog = state.logsByDate[targetDate];
      if (!dayLog || !dayLog.meals[targetMeal]) return state;

      const updatedMealItems = dayLog.meals[targetMeal].filter(
        (item) => item.id !== foodId
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

    case 'CLEAR_MEAL': {
      const { date, mealType } = action.payload;
      const targetDate = date || state.selectedDate;
      const targetMeal = (mealType || 'breakfast').toLowerCase();

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

    // Custom Recipe Actions
    case 'CREATE_RECIPE': {
      const { recipe } = action.payload;
      return {
        ...state,
        customRecipes: [recipe, ...state.customRecipes],
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
      const { recipeId } = action.payload;
      return {
        ...state,
        customRecipes: state.customRecipes.filter((r) => r.id !== recipeId),
      };
    }

    default:
      return state;
  }
}

export function NutritionProvider({ children }) {
  const [state, dispatch] = useReducer(nutritionReducer, null, initialState);

  // Sync state to localStorage
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.TARGETS, state.targets);
  }, [state.targets]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.LOGS_BY_DATE, state.logsByDate);
  }, [state.logsByDate]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.SELECTED_DATE, state.selectedDate);
  }, [state.selectedDate]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.CUSTOM_RECIPES, state.customRecipes);
  }, [state.customRecipes]);

  // Derived calculations for active date
  const currentDayLog = state.logsByDate[state.selectedDate] || {
    water: 0,
    meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
  };

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

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
  }, {});

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

  const totals = {
    ...dayTotals,
    remainingCalories,
    water: waterConsumed,
    waterRemaining,
    waterPercent,
  };

  // Combined Recipe List (Custom user recipes + Prebuilt catalog)
  const allRecipes = [...state.customRecipes, ...prebuiltRecipes];

  // Dispatch action helpers
  const setSelectedDate = (dateKey) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: dateKey });
  };

  const updateTargets = (newTargets) => {
    dispatch({ type: 'UPDATE_TARGETS', payload: newTargets });
  };

  const addFood = (food, mealType = 'breakfast', quantity = 1, date = null) => {
    dispatch({
      type: 'ADD_FOOD',
      payload: { food, mealType, quantity, date: date || state.selectedDate },
    });
  };

  const updateFoodQuantity = (foodId, quantity, mealType = 'breakfast', date = null) => {
    dispatch({
      type: 'UPDATE_FOOD_QUANTITY',
      payload: { foodId, quantity, mealType, date: date || state.selectedDate },
    });
  };

  const deleteFood = (foodId, mealType = 'breakfast', date = null) => {
    dispatch({
      type: 'DELETE_FOOD',
      payload: { foodId, mealType, date: date || state.selectedDate },
    });
  };

  const clearMeal = (mealType, date = null) => {
    dispatch({
      type: 'CLEAR_MEAL',
      payload: { mealType, date: date || state.selectedDate },
    });
  };

  const addWater = (liters = 0.25, date = null) => {
    dispatch({
      type: 'ADD_WATER',
      payload: { liters, date: date || state.selectedDate },
    });
  };

  const setWater = (liters, date = null) => {
    dispatch({
      type: 'SET_WATER',
      payload: { liters, date: date || state.selectedDate },
    });
  };

  const resetDay = (date = null) => {
    dispatch({
      type: 'RESET_DAY',
      payload: { date: date || state.selectedDate },
    });
  };

  // Recipe helpers with auto-nutrition engine
  const createRecipe = (recipeData) => {
    const servings = Math.max(1, Number(recipeData.servings) || 1);
    const { perServing } = calculateRecipeNutrition(recipeData.ingredients, servings);

    const newRecipe = {
      id: 'custom-recipe-' + Date.now(),
      isCustom: true,
      name: recipeData.name,
      description: recipeData.description || 'Custom crafted recipe.',
      category: recipeData.category || 'High Protein',
      image:
        recipeData.image ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      prepTime: recipeData.prepTime || '10 min',
      cookTime: recipeData.cookTime || '15 min',
      totalTime: `${parseInt(recipeData.prepTime || 10) + parseInt(recipeData.cookTime || 15)} min`,
      servings,
      difficulty: recipeData.difficulty || 'Easy',
      tags: recipeData.tags || ['Custom', recipeData.category || 'Healthy'],
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      nutrition: perServing,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'CREATE_RECIPE', payload: { recipe: newRecipe } });
    return newRecipe;
  };

  const updateRecipe = (recipeId, recipeData) => {
    const servings = Math.max(1, Number(recipeData.servings) || 1);
    const { perServing } = calculateRecipeNutrition(recipeData.ingredients, servings);

    const updatedRecipe = {
      ...recipeData,
      id: recipeId,
      isCustom: true,
      servings,
      totalTime: `${parseInt(recipeData.prepTime || 10) + parseInt(recipeData.cookTime || 15)} min`,
      nutrition: perServing,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_RECIPE', payload: { recipeId, recipe: updatedRecipe } });
    return updatedRecipe;
  };

  const deleteRecipe = (recipeId) => {
    dispatch({ type: 'DELETE_RECIPE', payload: { recipeId } });
  };

  const getRecipeById = (id) => {
    return allRecipes.find((r) => r.id === id);
  };

  const value = {
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
    // Recipe state and helpers
    customRecipes: state.customRecipes,
    prebuiltRecipes,
    allRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  };

  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>;
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}
