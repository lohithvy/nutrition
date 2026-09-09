/**
 * Nutrition, Food Database, Meal Logging, and Recipe Types
 */

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  portion?: string;
  baseAmount?: number;
  baseUnit?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  favorite?: boolean;
}

export interface LoggedFoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
  quantity: number;
  loggedAt: string;
}

export interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  items: LoggedFoodItem[];
  count: number;
}

export interface DailyMealLog {
  water: number;
  meals: {
    breakfast: LoggedFoodItem[];
    lunch: LoggedFoodItem[];
    dinner: LoggedFoodItem[];
    snack: LoggedFoodItem[];
  };
}

export type DailyLog = DailyMealLog;

export interface DayTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  itemsCount: number;
  mealsWithFood: number;
  remainingCalories: number;
  water: number;
  waterRemaining: number;
  waterPercent: number;
}

export interface RecipeIngredient {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
}

export interface RecipeInstruction {
  step: number;
  title?: string;
  text: string;
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Recipe {
  id: string;
  name: string;
  title?: string; // alias
  description: string;
  category: string;
  image: string;
  prepTime: string;
  cookTime?: string;
  totalTime?: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  nutrition: RecipeNutrition;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  checked: boolean;
  price?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: 'success' | 'info' | 'ai' | 'warning';
}
