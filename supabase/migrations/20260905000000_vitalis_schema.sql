-- ==============================================================================
-- VITALIS SUPABASE DATABASE SCHEMA MIGRATION
-- Migration: 20260905000000_vitalis_schema.sql
-- Description: Complete relational schema for Vitalis Health, Fitness & Nutrition
-- Features: Auth integration, RLS policies, Indexes, Cascade FKs, Triggers
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. USER PROFILES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  first_name TEXT,
  role TEXT DEFAULT 'member',
  avatar_url TEXT,
  age INTEGER,
  sex TEXT CHECK (sex IN ('Male', 'Female', 'Other')),
  date_of_birth DATE,
  streak_days INTEGER DEFAULT 0,
  nutri_score INTEGER DEFAULT 85,
  
  -- Body & Measurements
  height_cm NUMERIC,
  current_weight_kg NUMERIC,
  goal_weight_kg NUMERIC,
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lb')),
  height_unit TEXT DEFAULT 'cm' CHECK (height_unit IN ('cm', 'ft/in')),
  body_fat_percentage NUMERIC,
  lean_mass_kg NUMERIC,
  
  -- Goals & Activity
  primary_goal TEXT,
  activity_level TEXT,
  training_days_per_week INTEGER DEFAULT 4,
  cardio_days_per_week INTEGER DEFAULT 2,
  
  -- Nutrition Targets
  target_calories INTEGER DEFAULT 2200,
  target_protein_g INTEGER DEFAULT 160,
  target_carbs_g INTEGER DEFAULT 220,
  target_fat_g INTEGER DEFAULT 65,
  target_fiber_g INTEGER DEFAULT 35,
  target_water_liters NUMERIC DEFAULT 2.5,
  
  -- Preferences
  dietary_preferences TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  disliked_foods TEXT,
  favorite_foods TEXT,
  is_onboarded BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 2. FOODS CATALOG & LOGS
-- ==============================================================================

-- Food reference database (System foods user_id IS NULL; User custom foods have user_id)
CREATE TABLE IF NOT EXISTS public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  portion_description TEXT,
  base_amount NUMERIC NOT NULL DEFAULT 100,
  base_unit TEXT NOT NULL DEFAULT 'g',
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL DEFAULT 0,
  carbs NUMERIC NOT NULL DEFAULT 0,
  fat NUMERIC NOT NULL DEFAULT 0,
  fiber NUMERIC DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Daily Food Logging (Source of truth for meals)
CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_name TEXT NOT NULL,
  portion TEXT,
  quantity NUMERIC NOT NULL DEFAULT 1.0,
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL DEFAULT 0,
  carbs NUMERIC NOT NULL DEFAULT 0,
  fat NUMERIC NOT NULL DEFAULT 0,
  fiber NUMERIC DEFAULT 0,
  category TEXT,
  logged_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Recipes
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  prep_time TEXT,
  cook_time TEXT,
  total_time TEXT,
  servings INTEGER DEFAULT 1,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  tags TEXT[] DEFAULT '{}',
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL DEFAULT 0,
  carbs NUMERIC NOT NULL DEFAULT 0,
  fat NUMERIC NOT NULL DEFAULT 0,
  fiber NUMERIC DEFAULT 0,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Recipe Ingredients
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Recipe Instructions
CREATE TABLE IF NOT EXISTS public.recipe_instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT,
  instruction TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Grocery List
CREATE TABLE IF NOT EXISTS public.grocery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT NOT NULL,
  checked BOOLEAN DEFAULT false,
  price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 3. WORKOUTS, EXERCISES, SETS & SPLITS
-- ==============================================================================

-- Workout Splits Configuration
CREATE TABLE IF NOT EXISTS public.workout_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  days_count INTEGER DEFAULT 6,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Split Days inside Workout Split
CREATE TABLE IF NOT EXISTS public.workout_split_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id UUID NOT NULL REFERENCES public.workout_splits(id) ON DELETE CASCADE,
  day_name TEXT NOT NULL,
  title TEXT NOT NULL,
  focus TEXT,
  workout_type TEXT DEFAULT 'Hypertrophy',
  is_rest BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Workout Sessions (Source of truth for workouts)
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  split_day_id UUID REFERENCES public.workout_split_days(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  total_volume_kg NUMERIC DEFAULT 0,
  exercises_count INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Exercises performed within a session
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  target_muscle TEXT,
  equipment TEXT,
  order_index INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Sets performed per exercise
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight NUMERIC NOT NULL,
  rpe NUMERIC,
  rir INTEGER,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Personal Records
CREATE TABLE IF NOT EXISTS public.exercise_personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  max_weight NUMERIC NOT NULL,
  max_reps INTEGER NOT NULL,
  achieved_date DATE NOT NULL,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, exercise_name)
);

-- ==============================================================================
-- 4. DAILY TRACKERS (WATER, STEPS, SLEEP, WEIGHT)
-- ==============================================================================

-- Water Intake Logs (Source of truth)
CREATE TABLE IF NOT EXISTS public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount_liters NUMERIC NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Step Logs (Source of truth)
CREATE TABLE IF NOT EXISTS public.step_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  steps INTEGER NOT NULL DEFAULT 0,
  step_goal INTEGER DEFAULT 10000,
  distance_km NUMERIC DEFAULT 0,
  active_calories NUMERIC DEFAULT 0,
  source TEXT DEFAULT 'manual',
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

-- Sleep Logs (Source of truth, practical V1 metrics)
CREATE TABLE IF NOT EXISTS public.sleep_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL,
  quality_score INTEGER,
  resting_heart_rate INTEGER,
  notes TEXT,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

-- Weight & Body Composition Logs (Source of truth)
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight_kg NUMERIC NOT NULL,
  body_fat_percentage NUMERIC,
  lean_mass_kg NUMERIC,
  muscle_mass_kg NUMERIC,
  water_percentage NUMERIC,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

-- ==============================================================================
-- 5. DERIVED / ROLLUP LAYER & NOTIFICATIONS
-- ==============================================================================

-- Daily Aggregated Rollup (Derived cache for fast dashboard querying)
CREATE TABLE IF NOT EXISTS public.daily_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_calories_in NUMERIC DEFAULT 0,
  total_protein_g NUMERIC DEFAULT 0,
  total_carbs_g NUMERIC DEFAULT 0,
  total_fat_g NUMERIC DEFAULT 0,
  total_water_liters NUMERIC DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  total_active_calories NUMERIC DEFAULT 0,
  workout_count INTEGER DEFAULT 0,
  workout_duration_minutes INTEGER DEFAULT 0,
  sleep_duration_minutes INTEGER DEFAULT 0,
  sleep_quality_score INTEGER,
  weight_kg NUMERIC,
  nutri_score INTEGER DEFAULT 85,
  last_calculated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

-- Notifications & Health Alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'info', 'ai', 'warning')),
  unread BOOLEAN DEFAULT true,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- 6. INDEXES
-- ==============================================================================

-- Timeline and Date Query Indexes
CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON public.food_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON public.water_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_step_logs_user_date ON public.step_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_date ON public.sleep_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON public.weight_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON public.workout_sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_summaries_user_date ON public.daily_summaries(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, unread);

-- Foreign Key Relational Indexes
CREATE INDEX IF NOT EXISTS idx_food_logs_food_id ON public.food_logs(food_id);
CREATE INDEX IF NOT EXISTS idx_workout_split_days_split_id ON public.workout_split_days(split_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_split_day_id ON public.workout_sessions(split_day_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_session_id ON public.workout_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id ON public.workout_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON public.recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_instructions_recipe_id ON public.recipe_instructions(recipe_id);
CREATE INDEX IF NOT EXISTS idx_grocery_items_user_id ON public.grocery_items(user_id);

-- Search Index for Foods
CREATE INDEX IF NOT EXISTS idx_foods_name ON public.foods(name);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grocery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_split_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 7.1 PROFILES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 7.2 FOODS POLICIES (System foods public to auth; Custom foods isolated)
-- ------------------------------------------------------------------------------
CREATE POLICY "foods_select" ON public.foods FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "foods_insert_own" ON public.foods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "foods_update_own" ON public.foods FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "foods_delete_own" ON public.foods FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7.3 FOOD_LOGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "food_logs_select_own" ON public.food_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "food_logs_insert_own" ON public.food_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "food_logs_update_own" ON public.food_logs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "food_logs_delete_own" ON public.food_logs FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7.4 RECIPES & INGREDIENTS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "recipes_select" ON public.recipes FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
CREATE POLICY "recipes_insert_own" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recipes_update_own" ON public.recipes FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "recipes_delete_own" ON public.recipes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "recipe_ingredients_select" ON public.recipe_ingredients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_ingredients.recipe_id AND (r.user_id IS NULL OR r.user_id = auth.uid()))
);
CREATE POLICY "recipe_ingredients_insert_own" ON public.recipe_ingredients FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_ingredients.recipe_id AND r.user_id = auth.uid())
);
CREATE POLICY "recipe_ingredients_update_own" ON public.recipe_ingredients FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_ingredients.recipe_id AND r.user_id = auth.uid())
);
CREATE POLICY "recipe_ingredients_delete_own" ON public.recipe_ingredients FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_ingredients.recipe_id AND r.user_id = auth.uid())
);

CREATE POLICY "recipe_instructions_select" ON public.recipe_instructions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_instructions.recipe_id AND (r.user_id IS NULL OR r.user_id = auth.uid()))
);
CREATE POLICY "recipe_instructions_insert_own" ON public.recipe_instructions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_instructions.recipe_id AND r.user_id = auth.uid())
);
CREATE POLICY "recipe_instructions_update_own" ON public.recipe_instructions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_instructions.recipe_id AND r.user_id = auth.uid())
);
CREATE POLICY "recipe_instructions_delete_own" ON public.recipe_instructions FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.recipes r WHERE r.id = recipe_instructions.recipe_id AND r.user_id = auth.uid())
);

-- ------------------------------------------------------------------------------
-- 7.5 GROCERY_ITEMS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "grocery_items_select_own" ON public.grocery_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "grocery_items_insert_own" ON public.grocery_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "grocery_items_update_own" ON public.grocery_items FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "grocery_items_delete_own" ON public.grocery_items FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7.6 WORKOUT SPLITS & DAYS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "workout_splits_select_own" ON public.workout_splits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workout_splits_insert_own" ON public.workout_splits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_splits_update_own" ON public.workout_splits FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_splits_delete_own" ON public.workout_splits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "workout_split_days_select_own" ON public.workout_split_days FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.workout_splits ws WHERE ws.id = workout_split_days.split_id AND ws.user_id = auth.uid())
);
CREATE POLICY "workout_split_days_insert_own" ON public.workout_split_days FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.workout_splits ws WHERE ws.id = workout_split_days.split_id AND ws.user_id = auth.uid())
);
CREATE POLICY "workout_split_days_update_own" ON public.workout_split_days FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.workout_splits ws WHERE ws.id = workout_split_days.split_id AND ws.user_id = auth.uid())
);
CREATE POLICY "workout_split_days_delete_own" ON public.workout_split_days FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.workout_splits ws WHERE ws.id = workout_split_days.split_id AND ws.user_id = auth.uid())
);

-- ------------------------------------------------------------------------------
-- 7.7 WORKOUT SESSIONS, EXERCISES, SETS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "workout_sessions_select_own" ON public.workout_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workout_sessions_insert_own" ON public.workout_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_sessions_update_own" ON public.workout_sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_sessions_delete_own" ON public.workout_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "workout_exercises_select_own" ON public.workout_exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workout_exercises_insert_own" ON public.workout_exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_exercises_update_own" ON public.workout_exercises FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_exercises_delete_own" ON public.workout_exercises FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "workout_sets_select_own" ON public.workout_sets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "workout_sets_insert_own" ON public.workout_sets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_sets_update_own" ON public.workout_sets FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_sets_delete_own" ON public.workout_sets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "exercise_personal_records_select_own" ON public.exercise_personal_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "exercise_personal_records_insert_own" ON public.exercise_personal_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "exercise_personal_records_update_own" ON public.exercise_personal_records FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "exercise_personal_records_delete_own" ON public.exercise_personal_records FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7.8 WATER, STEPS, SLEEP, WEIGHT LOGS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "water_logs_select_own" ON public.water_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "water_logs_insert_own" ON public.water_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "water_logs_update_own" ON public.water_logs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "water_logs_delete_own" ON public.water_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "step_logs_select_own" ON public.step_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "step_logs_insert_own" ON public.step_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "step_logs_update_own" ON public.step_logs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "step_logs_delete_own" ON public.step_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "sleep_logs_select_own" ON public.sleep_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "sleep_logs_insert_own" ON public.sleep_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sleep_logs_update_own" ON public.sleep_logs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sleep_logs_delete_own" ON public.sleep_logs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "weight_logs_select_own" ON public.weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "weight_logs_insert_own" ON public.weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "weight_logs_update_own" ON public.weight_logs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "weight_logs_delete_own" ON public.weight_logs FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7.9 DAILY SUMMARIES & NOTIFICATIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "daily_summaries_select_own" ON public.daily_summaries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_summaries_insert_own" ON public.daily_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_summaries_update_own" ON public.daily_summaries FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_summaries_delete_own" ON public.daily_summaries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notifications_delete_own" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, first_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'first_name', split_part(COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), ' ', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
