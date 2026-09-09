/**
 * Workout, Training, and Exercise Types
 */

export interface ExerciseSet {
  id?: string;
  setNumber: number;
  reps: number;
  weight: number; // in kg or lb
  rpe?: number;   // Rate of Perceived Exertion (1-10)
  rir?: number;   // Reps in Reserve (0-5)
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
  targetMuscle: string;
  equipment: string;
  sets: ExerciseSet[];
  notes?: string;
  personalRecord?: {
    maxWeight: number;
    maxReps: number;
    date: string;
  };
}

export interface WorkoutSession {
  id: string;
  title?: string;
  name?: string;
  splitDayId?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  exercisesCount?: number;
  exercises?: Exercise[];
  totalVolumeKg: number;
  completed?: boolean;
  notes?: string;
}

export interface WorkoutSplitDay {
  day: string;
  title: string;
  focus?: string;
  isRest?: boolean;
}

export interface WorkoutSplit {
  id: string;
  name: string;
  description: string;
  daysCount?: number;
  days?: WorkoutSplitDay[];
}
