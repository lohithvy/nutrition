/**
 * Safe localStorage persistence layer for NutriFlow
 */

export const STORAGE_KEYS = {
  TARGETS: 'nutriflow_targets',
  LOGS_BY_DATE: 'nutriflow_logs_by_date',
  USER: 'nutriflow_user',
  AUTH_USER: 'nutriflow_auth_user',
  USER_PROFILE: 'nutriflow_user_profile',
  SELECTED_DATE: 'nutriflow_selected_date',
  GROCERY_LIST: 'nutriflow_grocery_list',
  CUSTOM_RECIPES: 'nutriflow_custom_recipes',
};

export const DEFAULT_TARGETS = {
  calories: 2200,
  protein: 140, // grams
  carbs: 210,   // grams
  fat: 65,      // grams
  fiber: 30,    // grams
  water: 2.5,   // Liters
};

export const DEFAULT_WORKOUT_SPLIT_DAYS = [
  { id: 'mon', day: 'Monday', focus: 'Chest + Triceps', type: 'Strength', isRest: false },
  { id: 'tue', day: 'Tuesday', focus: 'Back + Biceps', type: 'Strength', isRest: false },
  { id: 'wed', day: 'Wednesday', focus: 'Active Recovery & Mobility', type: 'Rest', isRest: true },
  { id: 'thu', day: 'Thursday', focus: 'Legs & Calves', type: 'Hypertrophy', isRest: false },
  { id: 'fri', day: 'Friday', focus: 'Shoulders + Core', type: 'Hypertrophy', isRest: false },
  { id: 'sat', day: 'Saturday', focus: 'Zone 2 Cardio & Pacing', type: 'Cardio', isRest: false },
  { id: 'sun', day: 'Sunday', focus: 'Complete Rest', type: 'Rest', isRest: true },
];

export const DEFAULT_USER_PROFILE = {
  name: 'Elena Vance',
  firstName: 'Elena',
  email: 'elena.vance@example.com',
  role: 'Pro Member',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  age: 28,
  sex: 'Female',
  dateOfBirth: '1998-04-12',

  body: {
    currentWeight: 68.4,
    goalWeight: 65.0,
    height: 172,
    weightUnit: 'kg', // 'kg' | 'lb'
    heightUnit: 'cm', // 'cm' | 'ft/in'
  },

  goals: {
    primaryGoal: 'Build Muscle', // 'Lose Weight' | 'Maintain Weight' | 'Build Muscle' | 'Gain Weight' | 'Improve Fitness' | 'Improve General Health' | 'Improve Athletic Performance'
    targetTimeframe: '12 Weeks',
    targetDate: '2026-12-01',
    targetBodyComp: 'Lean & Athletic',
    muscleBuildingPreference: 'Hypertrophy & Strength',
  },

  activity: {
    level: 'Moderately Active', // 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extremely Active'
    trainingDaysPerWeek: 4,
    cardioDaysPerWeek: 2,
  },

  workout: {
    splitType: 'Push / Pull / Legs', // 'Push / Pull / Legs' | 'Upper / Lower' | 'Full Body' | 'Bro Split' | 'Push / Pull' | 'Custom'
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

export function getTodayKey() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateKey) {
  if (!dateKey) return '';
  const [year, month, day] = dateKey.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  const todayKey = getTodayKey();
  const isToday = dateKey === todayKey;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  const isYesterday = dateKey === yKey;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tKey = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  const isTomorrow = dateKey === tKey;

  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
  
  if (isToday) return `Today, ${weekday} ${monthName} ${day}`;
  if (isYesterday) return `Yesterday, ${weekday} ${monthName} ${day}`;
  if (isTomorrow) return `Tomorrow, ${weekday} ${monthName} ${day}`;

  return `${weekday}, ${monthName} ${day}`;
}

export function shiftDateKey(dateKey, deltaDays) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  dateObj.setDate(dateObj.getDate() + deltaDays);
  const nextYear = dateObj.getFullYear();
  const nextMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
  const nextDay = String(dateObj.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function loadStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

export function saveStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
}
