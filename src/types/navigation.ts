/**
 * React Navigation Type Definitions
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { Recipe } from './nutrition';

export type NutritionStackParamList = {
  NutritionHome: undefined;
  Diary: undefined;
  Recipes: undefined;
  RecipeDetail: { recipeId?: string; recipe?: Recipe } | undefined;
  RecipeBuilder: { initialRecipe?: Recipe } | undefined;
  FoodScanner: undefined;
  BarcodeScanner: undefined;
  MealPlan: undefined;
  Grocery: undefined;
  AIAssistant: undefined;
};

export type TrainStackParamList = {
  TrainHome: undefined;
  ActiveWorkout: { splitDayId?: string; splitTitle?: string; workoutTitle?: string } | undefined;
  WorkoutSplitEditor: undefined;
  WorkoutHistory: undefined;
};

export type ProgressStackParamList = {
  ProgressHome: undefined;
  Insights: undefined;
  MetricLog: { metricType?: 'weight' | 'bodyFat' | 'measurements' } | undefined;
};

export type YouStackParamList = {
  YouHome: { activeTab?: 'personal' | 'goals' | 'diet' | 'targets' | 'preferences' | 'health' } | undefined;
  HealthIntegrations: undefined;
  ProMembership: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  NutritionTab: NavigatorScreenParams<NutritionStackParamList>;
  TrainTab: NavigatorScreenParams<TrainStackParamList>;
  ProgressTab: NavigatorScreenParams<ProgressStackParamList>;
  YouTab: NavigatorScreenParams<YouStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: { email?: string } | undefined;
};

export type OnboardingStackParamList = {
  OnboardingWizard: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: undefined;
  MainApp: NavigatorScreenParams<MainTabParamList>;
};
