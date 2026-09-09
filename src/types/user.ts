/**
 * User Profile and Preference Types
 */

export interface BodyMetrics {
  currentWeight: number;
  goalWeight: number;
  height: number;
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'ft/in';
  bodyFatPercentage?: number;
  leanMass?: number;
}

export interface Goals {
  primaryGoal: string; // 'Lose Weight' | 'Maintain Weight' | 'Build Muscle' | 'Gain Weight' | 'Improve Fitness' | 'Improve General Health' | 'Improve Athletic Performance'
  targetTimeframe: string;
  targetDate: string;
  targetBodyComp: string;
  muscleBuildingPreference: string;
}

export interface ActivityProfile {
  level: string; // 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extremely Active'
  trainingDaysPerWeek: number;
  cardioDaysPerWeek: number;
}

export interface SplitDay {
  id: string;
  day: string;
  focus: string;
  type: 'Strength' | 'Hypertrophy' | 'Cardio' | 'Mobility' | 'Rest';
  isRest: boolean;
}

export interface WorkoutProfile {
  splitType: string; // 'Push / Pull / Legs' | 'Upper / Lower' | 'Full Body' | 'Bro Split' | 'Push / Pull' | 'Custom'
  days: SplitDay[];
}

export interface DietaryProfile {
  preferences: string[];
  allergies: string[];
  customAllergies: string[];
  dislikedFoods: string;
  favoriteFoods: string;
  preferredCuisines: string[];
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

export interface LifestylePreferences {
  mealsPerDay: number;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  cookingSkill: string;
  weeklyFoodBudget: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  firstName: string;
  email: string;
  role: string;
  avatar: string | null;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  streakDays: number;
  nutriScore: number;
  body: BodyMetrics;
  goals: Goals;
  activity: ActivityProfile;
  workout: WorkoutProfile;
  diet: DietaryProfile;
  nutritionTargets: NutritionTargets;
  preferences: LifestylePreferences;
}
