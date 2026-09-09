/**
 * Vitalis / NutriFlow - Supabase Workout Service
 * Workout sessions (workout_sessions), exercises and sets
 */

import { supabase } from '../supabase';
import { WorkoutSession, WorkoutSplit } from '../../types/workout';

export interface DbWorkoutSession {
  id: string;
  user_id: string;
  split_day_id?: string | null;
  title: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  duration_minutes?: number | null;
  calories_burned?: number | null;
  total_volume_kg?: number | null;
  exercises_count?: number | null;
  completed: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export const workoutService = {
  /**
   * Fetch workout sessions for a given date or all history
   */
  async getWorkoutSessions(userId: string, date?: string): Promise<{ data: DbWorkoutSession[]; error: any }> {
    try {
      let query = supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;
      if (error) return { data: [], error };
      return { data: (data as DbWorkoutSession[]) || [], error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  /**
   * Save / complete a workout session in public.workout_sessions
   */
  async saveWorkoutSession(
    userId: string,
    session: {
      title: string;
      date: string;
      startTime?: string;
      endTime?: string;
      durationMinutes?: number;
      caloriesBurned?: number;
      totalVolumeKg?: number;
      exercisesCount?: number;
      completed?: boolean;
      notes?: string;
    }
  ): Promise<{ data: DbWorkoutSession | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: userId,
          title: session.title,
          date: session.date,
          start_time: session.startTime ? new Date().toISOString() : null,
          end_time: session.endTime ? new Date().toISOString() : null,
          duration_minutes: session.durationMinutes || 45,
          calories_burned: session.caloriesBurned || 320,
          total_volume_kg: session.totalVolumeKg || 0,
          exercises_count: session.exercisesCount || 1,
          completed: session.completed ?? true,
          notes: session.notes || null,
        })
        .select()
        .single();

      if (error) return { data: null, error };
      return { data: data as DbWorkoutSession, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Delete a workout session
   */
  async deleteWorkoutSession(userId: string, sessionId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('workout_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  async getActiveSplit() {
    return {
      id: 'ppl-6',
      name: 'Push / Pull / Legs (6-Day PPL)',
      description: 'High-frequency split optimal for hypertrophy and strength progression.',
      daysCount: 6,
    };
  },

  async saveActiveSplit(split: WorkoutSplit) {
    // Persist split configuration
  },
};

export default workoutService;
