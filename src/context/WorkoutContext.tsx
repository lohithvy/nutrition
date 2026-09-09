/**
 * NutriFlow Workout Context (Training, Active Sessions, Rest Timer, Splits)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkoutSession, Exercise, ExerciseSet, WorkoutSplit } from '../types/workout';
import { SplitDay } from '../types/user';
import { DEFAULT_WORKOUT_SPLIT_DAYS, loadStoredData, saveStoredData, STORAGE_KEYS } from '../services/storage';
import { getTodayKey } from '../utils/date';

import { useAuth } from './AuthContext';
import { workoutService } from '../services/workouts/workoutService';

interface WorkoutContextType {
  activeSession: WorkoutSession | null;
  currentSplit: WorkoutSplit;
  updateSplit: (split: WorkoutSplit) => void;
  startWorkout: (title: string, splitDayId?: string) => void;
  finishWorkout: () => void;
  completeWorkout: (session?: Partial<WorkoutSession>) => void;
  cancelWorkout: () => void;
  addExerciseToActive: (exerciseName: string, category: Exercise['category']) => void;
  addSetToExercise: (exerciseId: string, reps: number, weight: number) => void;
  toggleSetComplete: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, reps: number, weight: number) => void;
  workoutHistory: WorkoutSession[];
  restTimerSeconds: number;
  isRestTimerActive: boolean;
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  cancelRestTimer: () => void;
}

const mockDefaultExercises: Record<string, { name: string; category: Exercise['category']; defaultSets: number }[]> = {
  Push: [
    { name: 'Barbell Flat Bench Press', category: 'Chest', defaultSets: 4 },
    { name: 'Incline Dumbbell Press', category: 'Chest', defaultSets: 3 },
    { name: 'Standing Overhead Barbell Press', category: 'Shoulders', defaultSets: 3 },
    { name: 'Dumbbell Lateral Raises', category: 'Shoulders', defaultSets: 4 },
    { name: 'Cable Triceps Pushdowns', category: 'Arms', defaultSets: 3 },
  ],
  Pull: [
    { name: 'Conventional Barbell Deadlift', category: 'Back', defaultSets: 4 },
    { name: 'Neutral Grip Lat Pulldown', category: 'Back', defaultSets: 3 },
    { name: 'Chest-Supported Row', category: 'Back', defaultSets: 3 },
    { name: 'Rear Delt Flyes', category: 'Shoulders', defaultSets: 4 },
    { name: 'Incline Dumbbell Bicep Curls', category: 'Arms', defaultSets: 3 },
  ],
  Legs: [
    { name: 'Barbell Back Squat', category: 'Legs', defaultSets: 4 },
    { name: 'Romanian Deadlift (RDL)', category: 'Legs', defaultSets: 3 },
    { name: 'Leg Press (Quad Focus)', category: 'Legs', defaultSets: 3 },
    { name: 'Lying Hamstring Curls', category: 'Legs', defaultSets: 3 },
    { name: 'Standing Calf Raises', category: 'Legs', defaultSets: 4 },
  ],
};

const defaultSplit: WorkoutSplit = {
  id: 'ppl-6',
  name: 'Push / Pull / Legs (6-Day PPL)',
  description: 'High-frequency split optimal for hypertrophy and strength progression.',
  daysCount: 6,
};

const WorkoutContext = createContext<WorkoutContextType | null>(null);

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const { sessionUserId } = useAuth();
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [currentSplit, setCurrentSplit] = useState<WorkoutSplit>(defaultSplit);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([]);
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from AsyncStorage on mount
  useEffect(() => {
    async function initWorkouts() {
      const savedHistory = await loadStoredData<WorkoutSession[]>(
        STORAGE_KEYS.WORKOUT_HISTORY,
        []
      );
      setWorkoutHistory(savedHistory || []);
      setIsLoaded(true);
    }
    initWorkouts();
  }, []);

  // Fetch real workout history from Supabase if authenticated
  useEffect(() => {
    if (!sessionUserId || sessionUserId === 'demo-user-elena') return;

    let isMounted = true;
    async function fetchSupabaseWorkouts() {
      try {
        const { data, error } = await workoutService.getWorkoutSessions(sessionUserId!);
        if (!error && data && isMounted) {
          const mapped: WorkoutSession[] = data.map((d) => ({
            id: d.id,
            title: d.title,
            name: d.title,
            date: d.date,
            durationMinutes: d.duration_minutes || 45,
            totalVolumeKg: Number(d.total_volume_kg) || 0,
            completed: d.completed,
            notes: d.notes || undefined,
            exercises: [],
          }));
          setWorkoutHistory(mapped);
        }
      } catch (err) {
        console.warn('Error fetching Supabase workouts:', err);
      }
    }

    fetchSupabaseWorkouts();
    return () => {
      isMounted = false;
    };
  }, [sessionUserId]);

  // Save history on changes
  useEffect(() => {
    if (isLoaded) {
      saveStoredData(STORAGE_KEYS.WORKOUT_HISTORY, workoutHistory);
    }
  }, [workoutHistory, isLoaded]);

  // Rest timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isRestTimerActive && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsRestTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restTimerSeconds === 0) {
      setIsRestTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isRestTimerActive, restTimerSeconds]);

  const startRestTimer = (seconds: number) => {
    setRestTimerSeconds(seconds);
    setIsRestTimerActive(true);
  };

  const stopRestTimer = () => {
    setIsRestTimerActive(false);
    setRestTimerSeconds(0);
  };

  const cancelRestTimer = stopRestTimer;

  const updateSplit = (split: WorkoutSplit) => {
    setCurrentSplit(split);
  };

  const startWorkout = (title: string, splitDayId?: string) => {
    // Generate default exercise templates
    let categoryKey = 'Push';
    if (title.toLowerCase().includes('pull')) categoryKey = 'Pull';
    if (title.toLowerCase().includes('leg')) categoryKey = 'Legs';

    const defaultExList = mockDefaultExercises[categoryKey] || mockDefaultExercises.Push;

    const initialExercises: Exercise[] = defaultExList.map((ex, idx) => ({
      id: `ex-${Date.now()}-${idx}`,
      name: ex.name,
      category: ex.category,
      targetMuscle: ex.category,
      equipment: 'Barbell / Dumbbell',
      sets: Array.from({ length: ex.defaultSets }).map((_, sIdx) => ({
        id: `set-${Date.now()}-${idx}-${sIdx}`,
        setNumber: sIdx + 1,
        reps: sIdx === 0 ? 8 : 10,
        weight: 60,
        completed: false,
      })),
    }));

    const newSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      title,
      name: title,
      splitDayId,
      date: getTodayKey(),
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exercises: initialExercises,
      totalVolumeKg: 0,
      completed: false,
    };

    setActiveSession(newSession);
  };

  const finishWorkout = async () => {
    if (!activeSession) return;

    let totalVol = 0;
    for (const ex of activeSession.exercises || []) {
      for (const st of ex.sets || []) {
        if (st.completed) {
          totalVol += (st.reps || 0) * (st.weight || 0);
        }
      }
    }

    const durationMinutes = 48;
    const completedSession: WorkoutSession = {
      ...activeSession,
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes,
      totalVolumeKg: Math.round(totalVol),
      completed: true,
    };

    setWorkoutHistory((prev) => [completedSession, ...prev]);
    setActiveSession(null);
    stopRestTimer();

    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      try {
        await workoutService.saveWorkoutSession(sessionUserId, {
          title: completedSession.title || 'Workout Session',
          date: completedSession.date || getTodayKey(),
          durationMinutes,
          totalVolumeKg: Math.round(totalVol),
          exercisesCount: completedSession.exercises?.length || 1,
          completed: true,
        });
      } catch (err) {
        console.warn('Failed to save workout session to Supabase:', err);
      }
    }
  };

  const completeWorkout = async (customSession?: Partial<WorkoutSession>) => {
    const sessionToSave: WorkoutSession = {
      ...(activeSession || {
        id: `session-${Date.now()}`,
        title: 'Workout Session',
        date: getTodayKey(),
        totalVolumeKg: 4200,
        completed: true,
      }),
      ...(customSession || {}),
    };

    setWorkoutHistory((prev) => [sessionToSave, ...prev]);
    setActiveSession(null);
    stopRestTimer();

    if (sessionUserId && sessionUserId !== 'demo-user-elena') {
      try {
        await workoutService.saveWorkoutSession(sessionUserId, {
          title: sessionToSave.title || 'Workout Session',
          date: sessionToSave.date || getTodayKey(),
          durationMinutes: sessionToSave.durationMinutes || 45,
          totalVolumeKg: sessionToSave.totalVolumeKg || 0,
          exercisesCount: sessionToSave.exercises?.length || 1,
          completed: true,
        });
      } catch (err) {
        console.warn('Failed to save workout session to Supabase:', err);
      }
    }
  };

  const cancelWorkout = () => {
    setActiveSession(null);
    stopRestTimer();
  };

  const addExerciseToActive = (exerciseName: string, category: Exercise['category']) => {
    if (!activeSession) return;

    const newEx: Exercise = {
      id: `ex-${Date.now()}`,
      name: exerciseName,
      category,
      targetMuscle: category,
      equipment: 'Standard',
      sets: [
        { id: `set-${Date.now()}-1`, setNumber: 1, reps: 10, weight: 50, completed: false },
        { id: `set-${Date.now()}-2`, setNumber: 2, reps: 10, weight: 50, completed: false },
        { id: `set-${Date.now()}-3`, setNumber: 3, reps: 10, weight: 50, completed: false },
      ],
    };

    setActiveSession((prev) => (prev ? { ...prev, exercises: [...(prev.exercises || []), newEx] } : null));
  };

  const addSetToExercise = (exerciseId: string, reps: number, weight: number) => {
    if (!activeSession) return;

    setActiveSession((prev) => {
      if (!prev) return null;
      const updatedExercises = (prev.exercises || []).map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const nextSetNum = ex.sets.length + 1;
        const newSet: ExerciseSet = {
          id: `set-${Date.now()}-${nextSetNum}`,
          setNumber: nextSetNum,
          reps,
          weight,
          completed: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      });
      return { ...prev, exercises: updatedExercises };
    });
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    if (!activeSession) return;

    setActiveSession((prev) => {
      if (!prev) return null;
      const updatedExercises = (prev.exercises || []).map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const updatedSets = ex.sets.map((st) => {
          if (st.id === setId) {
            const nextCompleted = !st.completed;
            if (nextCompleted) {
              startRestTimer(90);
            }
            return { ...st, completed: nextCompleted };
          }
          return st;
        });
        return { ...ex, sets: updatedSets };
      });
      return { ...prev, exercises: updatedExercises };
    });
  };

  const updateSet = (exerciseId: string, setId: string, reps: number, weight: number) => {
    if (!activeSession) return;

    setActiveSession((prev) => {
      if (!prev) return null;
      const updatedExercises = (prev.exercises || []).map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const updatedSets = ex.sets.map((st) =>
          st.id === setId ? { ...st, reps: Math.max(1, reps), weight: Math.max(0, weight) } : st
        );
        return { ...ex, sets: updatedSets };
      });
      return { ...prev, exercises: updatedExercises };
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        activeSession,
        currentSplit,
        updateSplit,
        startWorkout,
        finishWorkout,
        completeWorkout,
        cancelWorkout,
        addExerciseToActive,
        addSetToExercise,
        toggleSetComplete,
        updateSet,
        workoutHistory,
        restTimerSeconds,
        isRestTimerActive,
        startRestTimer,
        stopRestTimer,
        cancelRestTimer,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout(): WorkoutContextType {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}
