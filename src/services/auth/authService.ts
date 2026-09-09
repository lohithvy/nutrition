/**
 * Vitalis / NutriFlow - Supabase Authentication & Profile Service
 */

import { supabase } from '../supabase';
import { UserProfile } from '../../types/user';
import { DEFAULT_USER_PROFILE } from '../storage';

// Helper to map Supabase profiles row to frontend UserProfile
export function mapDbProfileToUserProfile(dbRow: any, authEmail?: string): UserProfile {
  if (!dbRow) return { ...DEFAULT_USER_PROFILE, email: authEmail || DEFAULT_USER_PROFILE.email };

  return {
    id: dbRow.id,
    name: dbRow.name || dbRow.first_name || 'Member',
    firstName: dbRow.first_name || (dbRow.name ? dbRow.name.split(' ')[0] : 'Member'),
    email: dbRow.email || authEmail || DEFAULT_USER_PROFILE.email,
    role: dbRow.role || 'member',
    avatar: dbRow.avatar_url || null,
    age: dbRow.age || DEFAULT_USER_PROFILE.age,
    sex: dbRow.sex || DEFAULT_USER_PROFILE.sex,
    dateOfBirth: dbRow.date_of_birth || DEFAULT_USER_PROFILE.dateOfBirth,
    streakDays: dbRow.streak_days ?? DEFAULT_USER_PROFILE.streakDays,
    nutriScore: dbRow.nutri_score ?? DEFAULT_USER_PROFILE.nutriScore,
    body: {
      currentWeight: Number(dbRow.current_weight_kg) || DEFAULT_USER_PROFILE.body.currentWeight,
      goalWeight: Number(dbRow.goal_weight_kg) || DEFAULT_USER_PROFILE.body.goalWeight,
      height: Number(dbRow.height_cm) || DEFAULT_USER_PROFILE.body.height,
      weightUnit: (dbRow.weight_unit as 'kg' | 'lb') || DEFAULT_USER_PROFILE.body.weightUnit,
      heightUnit: (dbRow.height_unit as 'cm' | 'ft/in') || DEFAULT_USER_PROFILE.body.heightUnit,
      bodyFatPercentage: dbRow.body_fat_percentage != null ? Number(dbRow.body_fat_percentage) : DEFAULT_USER_PROFILE.body.bodyFatPercentage,
      leanMass: dbRow.lean_mass_kg != null ? Number(dbRow.lean_mass_kg) : DEFAULT_USER_PROFILE.body.leanMass,
    },
    goals: {
      primaryGoal: dbRow.primary_goal || DEFAULT_USER_PROFILE.goals.primaryGoal,
      targetTimeframe: DEFAULT_USER_PROFILE.goals.targetTimeframe,
      targetDate: DEFAULT_USER_PROFILE.goals.targetDate,
      targetBodyComp: DEFAULT_USER_PROFILE.goals.targetBodyComp,
      muscleBuildingPreference: DEFAULT_USER_PROFILE.goals.muscleBuildingPreference,
    },
    activity: {
      level: dbRow.activity_level || DEFAULT_USER_PROFILE.activity.level,
      trainingDaysPerWeek: dbRow.training_days_per_week ?? DEFAULT_USER_PROFILE.activity.trainingDaysPerWeek,
      cardioDaysPerWeek: dbRow.cardio_days_per_week ?? DEFAULT_USER_PROFILE.activity.cardioDaysPerWeek,
    },
    workout: DEFAULT_USER_PROFILE.workout,
    diet: {
      preferences: dbRow.dietary_preferences || DEFAULT_USER_PROFILE.diet.preferences,
      allergies: dbRow.allergies || DEFAULT_USER_PROFILE.diet.allergies,
      customAllergies: DEFAULT_USER_PROFILE.diet.customAllergies,
      dislikedFoods: dbRow.disliked_foods || DEFAULT_USER_PROFILE.diet.dislikedFoods,
      favoriteFoods: dbRow.favorite_foods || DEFAULT_USER_PROFILE.diet.favoriteFoods,
      preferredCuisines: DEFAULT_USER_PROFILE.diet.preferredCuisines,
    },
    nutritionTargets: {
      calories: Number(dbRow.target_calories) || DEFAULT_USER_PROFILE.nutritionTargets.calories,
      protein: Number(dbRow.target_protein_g) || DEFAULT_USER_PROFILE.nutritionTargets.protein,
      carbs: Number(dbRow.target_carbs_g) || DEFAULT_USER_PROFILE.nutritionTargets.carbs,
      fat: Number(dbRow.target_fat_g) || DEFAULT_USER_PROFILE.nutritionTargets.fat,
      fiber: Number(dbRow.target_fiber_g) || DEFAULT_USER_PROFILE.nutritionTargets.fiber,
      water: Number(dbRow.target_water_liters) || DEFAULT_USER_PROFILE.nutritionTargets.water,
    },
    preferences: DEFAULT_USER_PROFILE.preferences,
  };
}

// Helper to map frontend UserProfile back to public.profiles DB fields
export function mapUserProfileToDbFields(profile: Partial<UserProfile>, isOnboarded?: boolean) {
  const fields: Record<string, any> = {};

  if (profile.name !== undefined) fields.name = profile.name;
  if (profile.firstName !== undefined) fields.first_name = profile.firstName;
  if (profile.avatar !== undefined) fields.avatar_url = profile.avatar;
  if (profile.age !== undefined) fields.age = profile.age;
  if (profile.sex !== undefined) fields.sex = profile.sex;
  if (profile.dateOfBirth !== undefined) fields.date_of_birth = profile.dateOfBirth;
  if (profile.streakDays !== undefined) fields.streak_days = profile.streakDays;
  if (profile.nutriScore !== undefined) fields.nutri_score = profile.nutriScore;

  if (profile.body) {
    if (profile.body.currentWeight !== undefined) fields.current_weight_kg = profile.body.currentWeight;
    if (profile.body.goalWeight !== undefined) fields.goal_weight_kg = profile.body.goalWeight;
    if (profile.body.height !== undefined) fields.height_cm = profile.body.height;
    if (profile.body.weightUnit !== undefined) fields.weight_unit = profile.body.weightUnit;
    if (profile.body.heightUnit !== undefined) fields.height_unit = profile.body.heightUnit;
    if (profile.body.bodyFatPercentage !== undefined) fields.body_fat_percentage = profile.body.bodyFatPercentage;
    if (profile.body.leanMass !== undefined) fields.lean_mass_kg = profile.body.leanMass;
  }

  if (profile.goals?.primaryGoal !== undefined) fields.primary_goal = profile.goals.primaryGoal;
  if (profile.activity) {
    if (profile.activity.level !== undefined) fields.activity_level = profile.activity.level;
    if (profile.activity.trainingDaysPerWeek !== undefined) fields.training_days_per_week = profile.activity.trainingDaysPerWeek;
    if (profile.activity.cardioDaysPerWeek !== undefined) fields.cardio_days_per_week = profile.activity.cardioDaysPerWeek;
  }

  if (profile.diet) {
    if (profile.diet.preferences !== undefined) fields.dietary_preferences = profile.diet.preferences;
    if (profile.diet.allergies !== undefined) fields.allergies = profile.diet.allergies;
    if (profile.diet.dislikedFoods !== undefined) fields.disliked_foods = profile.diet.dislikedFoods;
    if (profile.diet.favoriteFoods !== undefined) fields.favorite_foods = profile.diet.favoriteFoods;
  }

  if (profile.nutritionTargets) {
    if (profile.nutritionTargets.calories !== undefined) fields.target_calories = profile.nutritionTargets.calories;
    if (profile.nutritionTargets.protein !== undefined) fields.target_protein_g = profile.nutritionTargets.protein;
    if (profile.nutritionTargets.carbs !== undefined) fields.target_carbs_g = profile.nutritionTargets.carbs;
    if (profile.nutritionTargets.fat !== undefined) fields.target_fat_g = profile.nutritionTargets.fat;
    if (profile.nutritionTargets.fiber !== undefined) fields.target_fiber_g = profile.nutritionTargets.fiber;
    if (profile.nutritionTargets.water !== undefined) fields.target_water_liters = profile.nutritionTargets.water;
  }

  if (isOnboarded !== undefined) {
    fields.is_onboarded = isOnboarded;
  }

  fields.updated_at = new Date().toISOString();

  return fields;
}

export const authService = {
  /**
   * Sign in with email & password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { session: null, user: null, error };
    return { session: data.session, user: data.user, error: null };
  },

  /**
   * Sign up with email, password & full name
   */
  async signUp(email: string, password: string, name: string) {
    const trimmedName = name.trim();
    const firstName = trimmedName.split(' ')[0] || 'Member';
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: trimmedName,
          first_name: firstName,
        },
      },
    });
    if (error) return { session: null, user: null, error };
    return { session: data.session, user: data.user, error: null };
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Get active session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) return null;
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Send password recovery email
   */
  async resetPasswordForEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    return { error };
  },

  /**
   * Load user profile from public.profiles table
   */
  async fetchProfile(userId: string, email?: string): Promise<{ profile: UserProfile | null; isOnboarded: boolean; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        return { profile: null, isOnboarded: false, error };
      }

      if (!data) {
        return { profile: null, isOnboarded: false, error: null };
      }

      return {
        profile: mapDbProfileToUserProfile(data, email),
        isOnboarded: data.is_onboarded ?? false,
        error: null,
      };
    } catch (e) {
      return { profile: null, isOnboarded: false, error: e };
    }
  },

  /**
   * Update profile in public.profiles table
   */
  async updateProfile(userId: string, profile: Partial<UserProfile>, isOnboarded?: boolean) {
    const fields = mapUserProfileToDbFields(profile, isOnboarded);
    const { data, error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};

export default authService;
