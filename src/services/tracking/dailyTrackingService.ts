/**
 * Vitalis / NutriFlow - Daily Tracking Service
 * Supabase integration for water_logs, step_logs, sleep_logs, and weight_logs
 */

import { supabase } from '../supabase';

export interface DbWaterLog {
  id: string;
  user_id: string;
  date: string;
  amount_liters: number;
  logged_at: string;
  created_at: string;
}

export interface DbStepLog {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  step_goal: number;
  distance_km: number;
  active_calories: number;
  source: string;
  synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DbSleepLog {
  id: string;
  user_id: string;
  date: string;
  start_time?: string;
  end_time?: string;
  duration_minutes: number;
  quality_score?: number;
  resting_heart_rate?: number;
  notes?: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface DbWeightLog {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number;
  body_fat_percentage?: number;
  lean_mass_kg?: number;
  muscle_mass_kg?: number;
  water_percentage?: number;
  notes?: string;
  logged_at: string;
  created_at: string;
}

export const dailyTrackingService = {
  // ==========================================
  // WATER LOGS (water_logs)
  // ==========================================
  async getWaterLogs(userId: string, date: string): Promise<{ data: DbWaterLog[]; totalLiters: number; error: any }> {
    try {
      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .order('logged_at', { ascending: false });

      if (error) return { data: [], totalLiters: 0, error };

      const logs = (data as DbWaterLog[]) || [];
      const totalLiters = logs.reduce((sum, item) => sum + (Number(item.amount_liters) || 0), 0);
      return { data: logs, totalLiters: Math.round(totalLiters * 100) / 100, error: null };
    } catch (err) {
      return { data: [], totalLiters: 0, error: err };
    }
  },

  async addWaterLog(userId: string, date: string, amountLiters: number): Promise<{ data: DbWaterLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('water_logs')
        .insert({
          user_id: userId,
          date,
          amount_liters: amountLiters,
          logged_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return { data: null, error };
      return { data: data as DbWaterLog, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteWaterLog(userId: string, logId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('water_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', userId);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  // ==========================================
  // STEP LOGS (step_logs)
  // ==========================================
  async getStepLog(userId: string, date: string): Promise<{ data: DbStepLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('step_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .maybeSingle();

      if (error) return { data: null, error };
      return { data: data as DbStepLog | null, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async upsertStepLog(
    userId: string,
    date: string,
    steps: number,
    stepGoal: number = 10000,
    source: string = 'manual'
  ): Promise<{ data: DbStepLog | null; error: any }> {
    try {
      const distanceKm = Math.round((steps * 0.00075) * 100) / 100;
      const activeCalories = Math.round(steps * 0.04);

      const { data, error } = await supabase
        .from('step_logs')
        .upsert(
          {
            user_id: userId,
            date,
            steps: Math.max(0, steps),
            step_goal: stepGoal,
            distance_km: distanceKm,
            active_calories: activeCalories,
            source,
            synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,date' }
        )
        .select()
        .single();

      if (error) return { data: null, error };
      return { data: data as DbStepLog, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteStepLog(userId: string, logId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('step_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', userId);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  // ==========================================
  // SLEEP LOGS (sleep_logs)
  // ==========================================
  async getSleepLog(userId: string, date: string): Promise<{ data: DbSleepLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .maybeSingle();

      if (error) return { data: null, error };
      return { data: data as DbSleepLog | null, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async upsertSleepLog(
    userId: string,
    date: string,
    durationMinutes: number,
    qualityScore?: number,
    startTime?: string,
    endTime?: string,
    notes?: string,
    restingHeartRate?: number
  ): Promise<{ data: DbSleepLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('sleep_logs')
        .upsert(
          {
            user_id: userId,
            date,
            duration_minutes: durationMinutes,
            quality_score: qualityScore ?? 85,
            start_time: startTime,
            end_time: endTime,
            notes,
            resting_heart_rate: restingHeartRate,
            source: 'manual',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,date' }
        )
        .select()
        .single();

      if (error) return { data: null, error };
      return { data: data as DbSleepLog, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteSleepLog(userId: string, logId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('sleep_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', userId);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  // ==========================================
  // WEIGHT LOGS (weight_logs)
  // ==========================================
  async getWeightLog(userId: string, date: string): Promise<{ data: DbWeightLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .maybeSingle();

      if (error) return { data: null, error };
      return { data: data as DbWeightLog | null, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async getLatestWeight(userId: string): Promise<{ data: DbWeightLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) return { data: null, error };
      return { data: data as DbWeightLog | null, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async upsertWeightLog(
    userId: string,
    date: string,
    weightKg: number,
    notes?: string
  ): Promise<{ data: DbWeightLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .upsert(
          {
            user_id: userId,
            date,
            weight_kg: weightKg,
            notes,
            logged_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,date' }
        )
        .select()
        .single();

      if (error) return { data: null, error };

      // Keep public.profiles in sync with latest logged weight
      await supabase
        .from('profiles')
        .update({
          current_weight_kg: weightKg,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      return { data: data as DbWeightLog, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async deleteWeightLog(userId: string, logId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('weight_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', userId);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },
};

export default dailyTrackingService;
