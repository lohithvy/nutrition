/**
 * Native Storage Persistence Layer (AsyncStorage & SecureStore)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { UserProfile, NutritionTargets, SplitDay } from '../types/user';
import { GroceryItem, Recipe } from '../types/nutrition';

export const STORAGE_KEYS = {
  TARGETS: 'nutriflow_targets',
  LOGS_BY_DATE: 'nutriflow_logs_by_date',
  USER_PROFILE: 'nutriflow_user_profile',
  SELECTED_DATE: 'nutriflow_selected_date',
  GROCERY_LIST: 'nutriflow_grocery_list',
  CUSTOM_RECIPES: 'nutriflow_custom_recipes',
  WORKOUT_SESSIONS: 'nutriflow_workout_sessions',
  WORKOUT_HISTORY: 'nutriflow_workout_sessions',
  ACTIVE_WORKOUT: 'nutriflow_active_workout',
};

export const DEFAULT_TARGETS: NutritionTargets = {
  calories: 2200,
  protein: 140, // grams
  carbs: 210,   // grams
  fat: 65,      // grams
  fiber: 30,    // grams
  water: 2.5,   // Liters
};

export const DEFAULT_WORKOUT_SPLIT_DAYS: SplitDay[] = [
  { id: 'mon', day: 'Monday', focus: 'Push (Chest, Shoulders, Triceps)', type: 'Strength', isRest: false },
  { id: 'tue', day: 'Tuesday', focus: 'Pull (Back, Rear Delts, Biceps)', type: 'Strength', isRest: false },
  { id: 'wed', day: 'Wednesday', focus: 'Legs & Calves (Quad Dominant)', type: 'Hypertrophy', isRest: false },
  { id: 'thu', day: 'Thursday', focus: 'Active Recovery & Mobility', type: 'Rest', isRest: true },
  { id: 'fri', day: 'Friday', focus: 'Push & Pull Hypertrophy', type: 'Hypertrophy', isRest: false },
  { id: 'sat', day: 'Saturday', focus: 'Legs & Posterior Chain', type: 'Strength', isRest: false },
  { id: 'sun', day: 'Sunday', focus: 'Complete Rest & Recovery', type: 'Rest', isRest: true },
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Elena Vance',
  firstName: 'Elena',
  email: 'elena.vance@example.com',
  role: 'Pro Member',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  age: 28,
  sex: 'Female',
  dateOfBirth: '1998-04-12',
  streakDays: 18,
  nutriScore: 84,

  body: {
    currentWeight: 68.4,
    goalWeight: 65.0,
    height: 172,
    weightUnit: 'kg',
    heightUnit: 'cm',
  },

  goals: {
    primaryGoal: 'Build Muscle',
    targetTimeframe: '12 Weeks',
    targetDate: '2026-12-01',
    targetBodyComp: 'Lean & Athletic',
    muscleBuildingPreference: 'Hypertrophy & Strength',
  },

  activity: {
    level: 'Moderately Active',
    trainingDaysPerWeek: 4,
    cardioDaysPerWeek: 2,
  },

  workout: {
    splitType: 'Push / Pull / Legs',
    days: DEFAULT_WORKOUT_SPLIT_DAYS,
  },

  diet: {
    preferences: ['High Protein', 'Mediterranean'],
    allergies: ['Peanuts', 'Shellfish'],
    customAllergies: [],
    dislikedFoods: 'Cilantro, Bitter Gourd',
    favoriteFoods: 'Avocado, Wild Alaskan Salmon, Greek Yogurt',
    preferredCuisines: ['Mediterranean', 'Japanese', 'Mexican'],
  },

  nutritionTargets: DEFAULT_TARGETS,

  preferences: {
    mealsPerDay: 4,
    breakfastTime: '08:00',
    lunchTime: '12:30',
    dinnerTime: '19:00',
    cookingSkill: 'Intermediate',
    weeklyFoodBudget: '$120 - $150',
  },
};

export async function loadStoredData<T>(key: string, fallback: T): Promise<T> {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from AsyncStorage:`, err);
    return fallback;
  }
}

export async function saveStoredData<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to AsyncStorage:`, err);
  }
}

export async function saveSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(`secure_${key}`, value);
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (err) {
    console.warn(`Error writing secure key ${key}:`, err);
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return await AsyncStorage.getItem(`secure_${key}`);
  }
  try {
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.warn(`Error reading secure key ${key}:`, err);
    return null;
  }
}

export async function deleteSecureItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(`secure_${key}`);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (err) {
    console.warn(`Error deleting secure key ${key}:`, err);
  }
}
