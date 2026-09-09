/**
 * Vitalis - Core Home Experience Screen
 *
 * Core Purpose:
 * 1. Let the user quickly choose what they want to track ("WHAT DO YOU WANT TO TRACK?")
 * 2. Show everything they have logged today ("TODAY'S LOGS" chronological timeline)
 * 3. Let the user tap any item to enter its detailed tracking flow
 *
 * Information Architecture:
 * HEADER
 * ↓
 * QUICK TRACKING (6 Actionable Cards: Food, Workout, Steps, Sleep, Water, Weight)
 * ↓
 * TODAY'S LOGS (Chronological activity feed with interactive inspectors)
 * ↓
 * BOTTOM NAVIGATION
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Utensils,
  Dumbbell,
  Footprints,
  Moon,
  Droplets,
  Scale,
  Plus,
  Bell,
  Calendar,
  ChevronRight,
  ArrowRight,
  Clock,
  Flame,
  Check,
  RotateCcw,
  Trash2,
  AlertTriangle,
  Sparkles,
  Zap,
  CheckCircle2,
  Play,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';

import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useNutrition } from '../../context/NutritionContext';
import { useWorkout } from '../../context/WorkoutContext';
import { formatDateDisplay } from '../../utils/date';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { QuickLogBottomSheet } from '../../components/common/QuickLogBottomSheet';
import { MealType, LoggedFoodItem } from '../../types/nutrition';
import { nutritionService, DbFoodLog } from '../../services/nutrition/nutritionService';
import { workoutService, DbWorkoutSession } from '../../services/workouts/workoutService';
import {
  dailyTrackingService,
  DbWaterLog,
  DbStepLog,
  DbSleepLog,
  DbWeightLog,
} from '../../services/tracking/dailyTrackingService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type HomeScenario = 'populated' | 'partial' | 'empty' | 'loading' | 'error';

interface TimelineLogItem {
  id: string;
  type: 'food' | 'workout' | 'steps' | 'sleep' | 'water' | 'weight';
  mealType?: MealType;
  time: string;
  emoji: string;
  title: string;
  subtitle: string;
  details?: string;
  metaBadge?: string;
  metaBadgeVariant?: 'emerald' | 'amber' | 'blue' | 'purple' | 'slate' | 'rose';
  rawPayload?: any;
}

function formatTimeString(isoString?: string | null): string {
  if (!isoString) return 'Today';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Today';
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } catch {
    return 'Today';
  }
}

function formatMinutesToHours(totalMinutes?: number | null): string {
  if (!totalMinutes || totalMinutes <= 0) return '0h';
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user, sessionUserId, updateProfile } = useAuth();
  const {
    isQuickLogOpen,
    openQuickLog,
    closeQuickLog,
    isDatePickerOpen,
    openDatePicker,
    closeDatePicker,
    showToast,
    notifications,
    markNotificationRead,
  } = useUI();

  const {
    selectedDate,
    setSelectedDate,
    targets,
    totals,
    addWater,
    addFood,
    deleteFood,
  } = useNutrition();

  const { startWorkout } = useWorkout();

  // Multi-state scenario switcher
  const [scenario, setScenario] = useState<HomeScenario>('populated');

  // Tracking details modals
  const [activeTrackingSheet, setActiveTrackingSheet] = useState<
    'food' | 'workout' | 'steps' | 'sleep' | 'water' | 'weight' | null
  >(null);

  // Inspector for selected timeline log
  const [selectedLog, setSelectedLog] = useState<TimelineLogItem | null>(null);

  // Local state for Quick Trackers
  const [customWaterInput, setCustomWaterInput] = useState('350');
  const [weightInput, setWeightInput] = useState(String(user.body?.currentWeight || 68.4));
  const [stepsCount, setStepsCount] = useState(6420);
  const [sleepHours, setSleepHours] = useState('7h 42m');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedMealForFoodModal, setSelectedMealForFoodModal] = useState<MealType>('lunch');

  // Supabase live database states
  const [supabaseFoodLogs, setSupabaseFoodLogs] = useState<DbFoodLog[]>([]);
  const [supabaseWorkoutLogs, setSupabaseWorkoutLogs] = useState<DbWorkoutSession[]>([]);
  const [supabaseStepLog, setSupabaseStepLog] = useState<DbStepLog | null>(null);
  const [supabaseSleepLog, setSupabaseSleepLog] = useState<DbSleepLog | null>(null);
  const [supabaseWaterLogs, setSupabaseWaterLogs] = useState<DbWaterLog[]>([]);
  const [supabaseWeightLog, setSupabaseWeightLog] = useState<DbWeightLog | null>(null);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);
  const isSupabaseUser = Boolean(sessionUserId && sessionUserId !== 'demo-user-elena');

  // Load all tracking data from Supabase
  useEffect(() => {
    if (!isSupabaseUser) {
      setIsLoadingSupabase(false);
      return;
    }

    let isMounted = true;
    setIsLoadingSupabase(true);

    async function loadAllTrackingData() {
      try {
        const [foodRes, workoutRes, stepRes, sleepRes, waterRes, weightRes] = await Promise.all([
          nutritionService.getFoodLogs(sessionUserId!, selectedDate),
          workoutService.getWorkoutSessions(sessionUserId!, selectedDate),
          dailyTrackingService.getStepLog(sessionUserId!, selectedDate),
          dailyTrackingService.getSleepLog(sessionUserId!, selectedDate),
          dailyTrackingService.getWaterLogs(sessionUserId!, selectedDate),
          dailyTrackingService.getWeightLog(sessionUserId!, selectedDate),
        ]);

        if (!isMounted) return;

        if (!foodRes.error && foodRes.data) setSupabaseFoodLogs(foodRes.data);
        if (!workoutRes.error && workoutRes.data) setSupabaseWorkoutLogs(workoutRes.data);
        if (!stepRes.error) {
          setSupabaseStepLog(stepRes.data);
          if (stepRes.data) setStepsCount(stepRes.data.steps);
        }
        if (!sleepRes.error) {
          setSupabaseSleepLog(sleepRes.data);
          if (sleepRes.data) setSleepHours(formatMinutesToHours(sleepRes.data.duration_minutes));
        }
        if (!waterRes.error && waterRes.data) setSupabaseWaterLogs(waterRes.data);
        if (!weightRes.error) {
          setSupabaseWeightLog(weightRes.data);
          if (weightRes.data) setWeightInput(String(weightRes.data.weight_kg));
        }
      } catch (e) {
        console.error('Failed to load tracking data from Supabase:', e);
      } finally {
        if (isMounted) setIsLoadingSupabase(false);
      }
    }

    loadAllTrackingData();

    return () => {
      isMounted = false;
    };
  }, [sessionUserId, selectedDate, refreshKey, isSupabaseUser]);

  // Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Formatted date
  const formattedDate = useMemo(() => {
    return formatDateDisplay(selectedDate);
  }, [selectedDate]);

  // Derived calculations for summary cards
  const foodKcalSum = useMemo(() => {
    if (isSupabaseUser) {
      return supabaseFoodLogs.reduce(
        (sum, f) => sum + Math.round(Number(f.calories || 0) * (Number(f.quantity) || 1)),
        0
      );
    }
    return totals.calories;
  }, [isSupabaseUser, supabaseFoodLogs, totals.calories]);

  const foodProteinSum = useMemo(() => {
    if (isSupabaseUser) {
      return Math.round(
        supabaseFoodLogs.reduce(
          (sum, f) => sum + Number(f.protein || 0) * (Number(f.quantity) || 1),
          0
        )
      );
    }
    return totals.protein;
  }, [isSupabaseUser, supabaseFoodLogs, totals.protein]);

  const waterSumLiters = useMemo(() => {
    if (isSupabaseUser) {
      return (
        Math.round(
          supabaseWaterLogs.reduce((sum, w) => sum + (Number(w.amount_liters) || 0), 0) * 100
        ) / 100
      );
    }
    return totals.water;
  }, [isSupabaseUser, supabaseWaterLogs, totals.water]);

  // Current values
  const currentKcal = scenario === 'empty' ? 0 : foodKcalSum;
  const currentProtein = scenario === 'empty' ? 0 : foodProteinSum;
  const currentWater = scenario === 'empty' ? 0 : waterSumLiters;
  const currentWeight = isSupabaseUser
    ? supabaseWeightLog?.weight_kg || user.body?.currentWeight || 68.4
    : user.body?.currentWeight || 68.4;
  const currentSteps =
    scenario === 'empty' ? 0 : isSupabaseUser ? supabaseStepLog?.steps ?? 0 : stepsCount;
  const currentSleep =
    scenario === 'empty'
      ? '--'
      : isSupabaseUser
      ? supabaseSleepLog
        ? formatMinutesToHours(supabaseSleepLog.duration_minutes)
        : 'Log sleep'
      : sleepHours;
  const currentWorkout =
    scenario === 'empty'
      ? 'Not logged'
      : isSupabaseUser
      ? supabaseWorkoutLogs.length > 0
        ? `${supabaseWorkoutLogs[0].title} (${supabaseWorkoutLogs[0].duration_minutes || 45}m)`
        : 'Log workout'
      : 'Pull Day (52m)';

  // Build Chronological Timeline Logs
  const timelineLogs: TimelineLogItem[] = useMemo(() => {
    if (scenario === 'empty') return [];

    if (isSupabaseUser) {
      const items: (TimelineLogItem & { sortTime: number })[] = [];

      // 1. Food logs
      supabaseFoodLogs.forEach((f) => {
        const mType = (f.meal_type || 'breakfast').toLowerCase() as MealType;
        const totalCals = Math.round(Number(f.calories || 0) * (Number(f.quantity) || 1));
        const totalP = Math.round(Number(f.protein || 0) * (Number(f.quantity) || 1));
        const totalC = Math.round(Number(f.carbs || 0) * (Number(f.quantity) || 1));
        const totalF = Math.round(Number(f.fat || 0) * (Number(f.quantity) || 1));

        const emoji =
          mType === 'breakfast' ? '🍳' : mType === 'lunch' ? '🍛' : mType === 'dinner' ? '🥩' : '🥑';

        items.push({
          id: f.id,
          type: 'food',
          mealType: mType,
          time: formatTimeString(f.logged_at),
          emoji,
          title: mType.charAt(0).toUpperCase() + mType.slice(1),
          subtitle: f.food_name,
          details: `${totalCals} kcal · ${totalP}g P · ${totalC}g C · ${totalF}g F`,
          metaBadge: `${totalCals} kcal`,
          metaBadgeVariant: 'emerald',
          rawPayload: f,
          sortTime: new Date(f.logged_at || f.created_at).getTime() || Date.now(),
        });
      });

      // 2. Workout sessions
      supabaseWorkoutLogs.forEach((w) => {
        items.push({
          id: w.id,
          type: 'workout',
          time: formatTimeString(w.start_time || w.created_at),
          emoji: '🏋️',
          title: 'Workout Session',
          subtitle: w.title,
          details: `${w.exercises_count || 1} exercises · ${w.duration_minutes || 45} min · ${Number(
            w.total_volume_kg || 0
          ).toLocaleString()} kg volume`,
          metaBadge: `${w.duration_minutes || 45} min`,
          metaBadgeVariant: 'amber',
          rawPayload: w,
          sortTime: new Date(w.start_time || w.created_at).getTime() || Date.now(),
        });
      });

      // 3. Water logs
      supabaseWaterLogs.forEach((w) => {
        const ml = Math.round(Number(w.amount_liters) * 1000);
        items.push({
          id: w.id,
          type: 'water',
          time: formatTimeString(w.logged_at),
          emoji: '💧',
          title: 'Water',
          subtitle: `${ml} ml hydration logged`,
          details: `Logged for ${formattedDate}`,
          metaBadge: `+${ml} ml`,
          metaBadgeVariant: 'blue',
          rawPayload: w,
          sortTime: new Date(w.logged_at || w.created_at).getTime() || Date.now(),
        });
      });

      // 4. Step log
      if (supabaseStepLog && supabaseStepLog.steps > 0) {
        items.push({
          id: supabaseStepLog.id,
          type: 'steps',
          time: formatTimeString(
            supabaseStepLog.synced_at || supabaseStepLog.updated_at || supabaseStepLog.created_at
          ),
          emoji: '👟',
          title: 'Steps',
          subtitle: `${supabaseStepLog.steps.toLocaleString()} steps logged`,
          details: `${Math.round(
            (supabaseStepLog.steps / (supabaseStepLog.step_goal || 10000)) * 100
          )}% of 10,000 daily goal`,
          metaBadge: `${supabaseStepLog.steps.toLocaleString()} steps`,
          metaBadgeVariant: 'slate',
          rawPayload: supabaseStepLog,
          sortTime:
            new Date(supabaseStepLog.updated_at || supabaseStepLog.created_at).getTime() || Date.now(),
        });
      }

      // 5. Sleep log
      if (supabaseSleepLog && supabaseSleepLog.duration_minutes > 0) {
        items.push({
          id: supabaseSleepLog.id,
          type: 'sleep',
          time: formatTimeString(supabaseSleepLog.created_at),
          emoji: '🌙',
          title: 'Sleep Tracked',
          subtitle: `${formatMinutesToHours(supabaseSleepLog.duration_minutes)} duration · ${
            supabaseSleepLog.quality_score || 85
          }% Quality`,
          details: supabaseSleepLog.notes || `Logged for ${formattedDate}`,
          metaBadge: formatMinutesToHours(supabaseSleepLog.duration_minutes),
          metaBadgeVariant: 'purple',
          rawPayload: supabaseSleepLog,
          sortTime: new Date(supabaseSleepLog.created_at).getTime() || Date.now(),
        });
      }

      // 6. Weight log
      if (supabaseWeightLog) {
        items.push({
          id: supabaseWeightLog.id,
          type: 'weight',
          time: formatTimeString(supabaseWeightLog.logged_at || supabaseWeightLog.created_at),
          emoji: '⚖️',
          title: 'Weight Logged',
          subtitle: `${supabaseWeightLog.weight_kg} kg`,
          details: `Recorded for ${formattedDate}`,
          metaBadge: `${supabaseWeightLog.weight_kg} kg`,
          metaBadgeVariant: 'slate',
          rawPayload: supabaseWeightLog,
          sortTime:
            new Date(supabaseWeightLog.logged_at || supabaseWeightLog.created_at).getTime() ||
            Date.now(),
        });
      }

      items.sort((a, b) => b.sortTime - a.sortTime);
      return items;
    }

    if (scenario === 'partial') {
      return [
        {
          id: 'log-water-1',
          type: 'water',
          time: '10:15 AM',
          emoji: '💧',
          title: 'Water',
          subtitle: '500 ml consumed',
          details: 'Hydration Pacing',
          metaBadge: '500 ml',
          metaBadgeVariant: 'blue',
        },
        {
          id: 'log-breakfast-1',
          type: 'food',
          mealType: 'breakfast',
          time: '8:32 AM',
          emoji: '🍳',
          title: 'Breakfast',
          subtitle: 'Spinach & Egg White Scramble + Oats',
          details: '420 kcal · 32g protein · 48g carbs',
          metaBadge: '420 kcal',
          metaBadgeVariant: 'emerald',
        },
        {
          id: 'log-sleep-1',
          type: 'sleep',
          time: '6:30 AM',
          emoji: '🌙',
          title: 'Sleep',
          subtitle: '7h 42m duration · 88% Quality',
          details: '11:15 PM - 6:57 AM',
          metaBadge: '88% Score',
          metaBadgeVariant: 'purple',
        },
      ];
    }

    // Default Populated State for Demo
    return [
      {
        id: 'log-workout-1',
        type: 'workout',
        time: '6:05 PM',
        emoji: '🏋️',
        title: 'Workout Session',
        subtitle: 'Pull Day (Back & Biceps)',
        details: '5 exercises · 14 sets · 4,200 kg volume · 52 min',
        metaBadge: '52 min',
        metaBadgeVariant: 'amber',
      },
      {
        id: 'log-lunch-1',
        type: 'food',
        mealType: 'lunch',
        time: '1:18 PM',
        emoji: '🍛',
        title: 'Lunch',
        subtitle: 'Mediterranean Herb Chicken & Quinoa Bowl',
        details: '650 kcal · 48g protein · 52g carbs · 14g fat',
        metaBadge: '650 kcal',
        metaBadgeVariant: 'emerald',
      },
      {
        id: 'log-steps-1',
        type: 'steps',
        time: '12:40 PM',
        emoji: '👟',
        title: 'Steps',
        subtitle: '6,420 steps logged',
        details: '64% of 10,000 daily goal',
        metaBadge: '6,420 steps',
        metaBadgeVariant: 'slate',
      },
      {
        id: 'log-water-1',
        type: 'water',
        time: '10:15 AM',
        emoji: '💧',
        title: 'Water',
        subtitle: '500 ml hydration logged',
        details: '1.8L of 2.5L daily target',
        metaBadge: '+500 ml',
        metaBadgeVariant: 'blue',
      },
      {
        id: 'log-breakfast-1',
        type: 'food',
        mealType: 'breakfast',
        time: '8:32 AM',
        emoji: '🍳',
        title: 'Breakfast',
        subtitle: 'Organic Rolled Oats + Pasture Eggs',
        details: '420 kcal · 32g protein · 38g carbs · 12g fat',
        metaBadge: '420 kcal',
        metaBadgeVariant: 'emerald',
      },
      {
        id: 'log-weight-1',
        type: 'weight',
        time: '7:15 AM',
        emoji: '⚖️',
        title: 'Weight Logged',
        subtitle: '68.4 kg',
        details: '↓ 0.2 kg from yesterday · ↓ 1.8 kg this month',
        metaBadge: '68.4 kg',
        metaBadgeVariant: 'slate',
      },
      {
        id: 'log-sleep-1',
        type: 'sleep',
        time: '6:30 AM',
        emoji: '🌙',
        title: 'Sleep Tracked',
        subtitle: '7h 42m duration · 88% Quality Score',
        details: '11:15 PM - 6:57 AM · Deep sleep: 1h 48m',
        metaBadge: '7h 42m',
        metaBadgeVariant: 'purple',
      },
    ];
  }, [
    scenario,
    isSupabaseUser,
    supabaseFoodLogs,
    supabaseWorkoutLogs,
    supabaseWaterLogs,
    supabaseStepLog,
    supabaseSleepLog,
    supabaseWeightLog,
    formattedDate,
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Handlers
  const handleSaveWeight = async () => {
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 0) {
      if (isSupabaseUser) {
        await dailyTrackingService.upsertWeightLog(sessionUserId!, selectedDate, val);
        triggerRefresh();
      }
      updateProfile({ body: { ...user.body, currentWeight: val } });
      setActiveTrackingSheet(null);
      showToast(`Weight saved: ${val} kg! ⚖️`, 'success');
    }
  };

  const handleAddQuickWater = async (amountLiters: number) => {
    addWater(amountLiters);
    if (isSupabaseUser) {
      await dailyTrackingService.addWaterLog(sessionUserId!, selectedDate, amountLiters);
      triggerRefresh();
    }
    showToast(`Added +${Math.round(amountLiters * 1000)}ml water! 💧`, 'success');
  };

  const handleAddCustomWater = async () => {
    const ml = parseInt(customWaterInput);
    if (!isNaN(ml) && ml > 0) {
      const liters = ml / 1000;
      addWater(liters);
      if (isSupabaseUser) {
        await dailyTrackingService.addWaterLog(sessionUserId!, selectedDate, liters);
        triggerRefresh();
      }
      setActiveTrackingSheet(null);
      showToast(`Added +${ml}ml water! 💧`, 'success');
    }
  };

  const handleAddManualSteps = async (delta: number) => {
    const nextSteps = currentSteps + delta;
    setStepsCount(nextSteps);
    if (isSupabaseUser) {
      await dailyTrackingService.upsertStepLog(sessionUserId!, selectedDate, nextSteps);
      triggerRefresh();
    }
    showToast(`Added +${delta.toLocaleString()} steps! 👟`, 'success');
    setActiveTrackingSheet(null);
  };

  const handleSaveSleep = async (durationMins: number, quality: number = 88) => {
    setSleepHours(formatMinutesToHours(durationMins));
    if (isSupabaseUser) {
      await dailyTrackingService.upsertSleepLog(sessionUserId!, selectedDate, durationMins, quality);
      triggerRefresh();
    }
    showToast(`Sleep logged: ${formatMinutesToHours(durationMins)}! 🌙`, 'success');
    setActiveTrackingSheet(null);
  };

  const handleDeleteTimelineLog = async (logItem: TimelineLogItem) => {
    if (!logItem) return;

    if (isSupabaseUser) {
      try {
        if (logItem.type === 'food') {
          await nutritionService.deleteFoodLog(sessionUserId!, logItem.id);
          deleteFood(logItem.id, logItem.mealType);
        } else if (logItem.type === 'workout') {
          await workoutService.deleteWorkoutSession(sessionUserId!, logItem.id);
        } else if (logItem.type === 'water') {
          await dailyTrackingService.deleteWaterLog(sessionUserId!, logItem.id);
        } else if (logItem.type === 'steps') {
          await dailyTrackingService.deleteStepLog(sessionUserId!, logItem.id);
        } else if (logItem.type === 'sleep') {
          await dailyTrackingService.deleteSleepLog(sessionUserId!, logItem.id);
        } else if (logItem.type === 'weight') {
          await dailyTrackingService.deleteWeightLog(sessionUserId!, logItem.id);
        }
        triggerRefresh();
      } catch (err) {
        console.warn('Failed to delete log from Supabase:', err);
      }
    } else {
      if (logItem.type === 'food' && logItem.mealType) {
        deleteFood(logItem.id, logItem.mealType);
      }
    }

    showToast(`${logItem.title} log deleted 🗑️`, 'info');
    setSelectedLog(null);
  };

  const handleStartWorkoutAction = () => {
    setActiveTrackingSheet(null);
    startWorkout('Pull Day (Back & Biceps)');
    navigation.navigate('TrainTab', {
      screen: 'ActiveWorkout',
      params: { workoutTitle: 'Pull Day (Back & Biceps)' },
    });
  };

  // Food items for the selected meal tab inside Food Modal
  const mealItemsForModal = useMemo(() => {
    if (isSupabaseUser) {
      return supabaseFoodLogs
        .filter((f) => (f.meal_type || '').toLowerCase() === selectedMealForFoodModal.toLowerCase())
        .map((f) => ({
          id: f.id,
          name: f.food_name,
          portion: f.portion,
          calories: Math.round(Number(f.calories || 0) * (Number(f.quantity) || 1)),
          protein: Math.round(Number(f.protein || 0) * (Number(f.quantity) || 1)),
          carbs: Math.round(Number(f.carbs || 0) * (Number(f.quantity) || 1)),
          fat: Math.round(Number(f.fat || 0) * (Number(f.quantity) || 1)),
          quantity: f.quantity,
        }));
    }
    return [
      {
        id: 'sample-1',
        name:
          selectedMealForFoodModal === 'breakfast'
            ? 'Spinach & Egg White Scramble'
            : selectedMealForFoodModal === 'lunch'
            ? 'Mediterranean Herb Chicken & Quinoa'
            : selectedMealForFoodModal === 'dinner'
            ? 'Wild Alaskan Salmon & Asparagus'
            : 'Greek Yogurt + Blueberries',
        portion: '1 serving',
        calories:
          selectedMealForFoodModal === 'breakfast'
            ? 420
            : selectedMealForFoodModal === 'lunch'
            ? 650
            : selectedMealForFoodModal === 'dinner'
            ? 580
            : 180,
        protein:
          selectedMealForFoodModal === 'breakfast'
            ? 32
            : selectedMealForFoodModal === 'lunch'
            ? 48
            : selectedMealForFoodModal === 'dinner'
            ? 46
            : 18,
        carbs:
          selectedMealForFoodModal === 'breakfast'
            ? 48
            : selectedMealForFoodModal === 'lunch'
            ? 52
            : selectedMealForFoodModal === 'dinner'
            ? 18
            : 14,
        fat:
          selectedMealForFoodModal === 'breakfast'
            ? 12
            : selectedMealForFoodModal === 'lunch'
            ? 14
            : selectedMealForFoodModal === 'dinner'
            ? 24
            : 2,
        quantity: 1,
      },
    ];
  }, [isSupabaseUser, supabaseFoodLogs, selectedMealForFoodModal]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* NON-BLOCKING ERROR / SYNC BANNER                             */}
        {/* ============================================================ */}
        {scenario === 'error' && (
          <View style={styles.errorBanner}>
            <View style={styles.errorLeft}>
              <AlertTriangle size={16} color={colors.amber[700]} />
              <Text style={styles.errorText}>Steps sensor could not be synced.</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                showToast('Retrying sensor sync...', 'info');
                setScenario('populated');
              }}
              style={styles.retryBtn}
            >
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* 1. HEADER                                                    */}
        {/* ============================================================ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>
              {greeting}, {user.firstName || 'Elena'} 👋
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={openDatePicker}
              style={styles.dateSelector}
            >
              <Calendar size={13} color={colors.surface[500]} />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            {/* Notifications Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsNotificationsOpen(true)}
              style={styles.iconBtn}
            >
              <Bell size={18} color={colors.surface[700]} />
              {unreadCount > 0 && <View style={styles.notifBadgeDot} />}
            </TouchableOpacity>

            {/* Profile Avatar Access */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('YouTab')}
              style={styles.avatarBtn}
            >
              <Text style={styles.avatarLetter}>
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'E'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* 2. TRACK TODAY SECTION                                        */}
        {/* ============================================================ */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>TRACK TODAY</Text>
        </View>

        {scenario === 'loading' ? (
          /* Subtle Loading Skeleton Cards */
          <View style={styles.trackingContainer}>
            {/* Skeleton Large Food Card */}
            <View style={[styles.foodPrimaryCard, styles.skeletonFoodCard]} />

            {/* Skeleton 2-Column Grid (2 Rows) */}
            <View style={styles.compactRow}>
              <View style={[styles.compactCard, styles.skeletonCompactCard]} />
              <View style={[styles.compactCard, styles.skeletonCompactCard]} />
            </View>
            <View style={styles.compactRow}>
              <View style={[styles.compactCard, styles.skeletonCompactCard]} />
              <View style={[styles.compactCard, styles.skeletonCompactCard]} />
            </View>

            {/* Skeleton Full-width Weight Card */}
            <View style={[styles.weightCardFull, styles.skeletonWeightCard]} />
          </View>
        ) : (
          /* Hierarchical Tracking Cards: FOOD Dominant (2-card size) + Secondary + Supporting */
          <View style={styles.trackingContainer}>
            {/* 1. DOMINANT PRIMARY TRACKER: FOOD */}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => setActiveTrackingSheet('food')}
              style={styles.foodPrimaryCard}
            >
              {/* Header: Label + Track Action */}
              <View style={styles.foodCardHeader}>
                <View style={styles.foodCardHeaderLeft}>
                  <View style={styles.foodIconBox}>
                    <Utensils size={16} color={colors.brand.primary} />
                  </View>
                  <Text style={styles.foodCardTitle}>FOOD</Text>
                </View>

                <View style={styles.foodActionPill}>
                  <Text style={styles.foodActionText}>Track</Text>
                  <ArrowRight size={13} color={colors.brand.primary} />
                </View>
              </View>

              {/* Main Summary: Calories (Large Strong Typography) + Protein */}
              <View style={styles.foodStatsRow}>
                <View style={styles.foodCalorieGroup}>
                  <Text style={styles.foodCalorieValue}>
                    {scenario === 'empty' ? '0' : currentKcal.toLocaleString()}
                  </Text>
                  <Text style={styles.foodCalorieUnit}>kcal today</Text>
                </View>

                <View style={styles.foodProteinBadge}>
                  <Text style={styles.foodProteinText}>
                    {scenario === 'empty' ? '0g' : `${currentProtein}g`} protein
                  </Text>
                </View>
              </View>

              {/* Subtle Calorie Progress Indicator */}
              <View style={styles.foodProgressWrap}>
                <View style={styles.foodProgressBarBg}>
                  <View
                    style={[
                      styles.foodProgressBarFill,
                      {
                        width: `${Math.min(
                          100,
                          Math.max(
                            scenario === 'empty' ? 0 : 5,
                            Math.round((currentKcal / (targets.calories || 2200)) * 100)
                          )
                        )}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Subtle Meals Indication: Breakfast · Lunch · Snack · Dinner */}
              <View style={styles.foodMealsStrip}>
                <Text style={styles.foodMealsText}>
                  Breakfast · Lunch · Snack · Dinner
                </Text>
              </View>
            </TouchableOpacity>

            {/* 2. SECONDARY & SUPPORTING 2-COLUMN GRID (2 ROWS) */}
            <View style={styles.compactRow}>
              {/* 2.1 WORKOUT (Secondary) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTrackingSheet('workout')}
                style={styles.compactCard}
              >
                <View style={styles.compactCardTop}>
                  <View style={[styles.compactIconBox, { backgroundColor: colors.amber[50] }]}>
                    <Dumbbell size={16} color={colors.amber[600]} />
                  </View>
                  <ChevronRight size={14} color={colors.surface[400]} />
                </View>
                <View style={styles.compactCardBottom}>
                  <Text style={styles.compactCardTitle}>WORKOUT</Text>
                  <Text style={styles.compactCardStatus} numberOfLines={1}>
                    {scenario === 'empty' ? 'Log workout' : currentWorkout}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 2.2 STEPS (Secondary) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTrackingSheet('steps')}
                style={styles.compactCard}
              >
                <View style={styles.compactCardTop}>
                  <View style={[styles.compactIconBox, { backgroundColor: colors.surface[100] }]}>
                    <Footprints size={16} color={colors.surface[700]} />
                  </View>
                  <ChevronRight size={14} color={colors.surface[400]} />
                </View>
                <View style={styles.compactCardBottom}>
                  <Text style={styles.compactCardTitle}>STEPS</Text>
                  <Text style={styles.compactCardStatus} numberOfLines={1}>
                    {scenario === 'empty' ? '0 steps' : `${currentSteps.toLocaleString()} steps`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.compactRow}>
              {/* 2.3 SLEEP (Supporting) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTrackingSheet('sleep')}
                style={styles.compactCard}
              >
                <View style={styles.compactCardTop}>
                  <View style={[styles.compactIconBox, { backgroundColor: colors.purple[50] }]}>
                    <Moon size={16} color={colors.purple[600]} />
                  </View>
                  <ChevronRight size={14} color={colors.surface[400]} />
                </View>
                <View style={styles.compactCardBottom}>
                  <Text style={styles.compactCardTitle}>SLEEP</Text>
                  <Text style={styles.compactCardStatus} numberOfLines={1}>
                    {scenario === 'empty' ? 'Log sleep' : currentSleep}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 2.4 WATER (Supporting) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setActiveTrackingSheet('water')}
                style={styles.compactCard}
              >
                <View style={styles.compactCardTop}>
                  <View style={[styles.compactIconBox, { backgroundColor: colors.sky[50] }]}>
                    <Droplets size={16} color={colors.nutrition.water} />
                  </View>
                  <ChevronRight size={14} color={colors.surface[400]} />
                </View>
                <View style={styles.compactCardBottom}>
                  <Text style={styles.compactCardTitle}>WATER</Text>
                  <Text style={styles.compactCardStatus} numberOfLines={1}>
                    {scenario === 'empty' ? '0.0 / 2.5 L' : `${currentWater.toFixed(1)} / 2.5 L`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* 3. SUPPORTING FULL-WIDTH COMPACT: WEIGHT */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTrackingSheet('weight')}
              style={styles.weightCardFull}
            >
              <View style={styles.weightCardLeft}>
                <View style={[styles.compactIconBox, { backgroundColor: colors.emerald[50] }]}>
                  <Scale size={16} color={colors.emerald[700]} />
                </View>
                <View style={styles.weightCardTextGroup}>
                  <Text style={styles.compactCardTitle}>WEIGHT</Text>
                  <Text style={styles.compactCardStatus}>
                    {scenario === 'empty' ? 'Log weight' : `${currentWeight} kg`}
                  </Text>
                </View>
              </View>
              <ChevronRight size={14} color={colors.surface[400]} />
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* 4. TODAY'S LOGS (CHRONOLOGICAL ACTIVITY TIMELINE)             */}
        {/* ============================================================ */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>TODAY'S LOGS</Text>
          {timelineLogs.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('NutritionTab', { screen: 'Diary' })}
              style={styles.viewAllLogsBtn}
            >
              <Text style={styles.viewAllLogsText}>
                {timelineLogs.length} activities · View all →
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {scenario === 'loading' ? (
          /* Timeline Skeleton Loading State */
          <View style={styles.timelineContainer}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.timelineItem, styles.skeletonItem]} />
            ))}
          </View>
        ) : timelineLogs.length === 0 ? (
          /* 6. CLEAN ENCOURAGING EMPTY STATE */
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyIconCircle}>
              <Sparkles size={20} color={colors.surface[400]} />
            </View>
            <Text style={styles.emptyHeading}>Nothing logged yet.</Text>
            <Text style={styles.emptySub}>
              Start tracking your day by adding your first activity.
            </Text>

            {/* Useful Quick Action Buttons */}
            <View style={styles.emptyActionsRow}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={14} color={colors.white} />}
                onPress={openQuickLog}
              >
                + Log Food
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Droplets size={14} color={colors.nutrition.water} />}
                onPress={() => handleAddQuickWater(0.25)}
              >
                + Water
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Scale size={14} color={colors.surface[700]} />}
                onPress={() => setActiveTrackingSheet('weight')}
              >
                + Weight
              </Button>
            </View>
          </View>
        ) : (
          /* Chronological Activity Feed */
          <View style={styles.timelineContainer}>
            {timelineLogs.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.75}
                onPress={() => setSelectedLog(item)}
                style={[
                  styles.timelineItem,
                  idx === timelineLogs.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                {/* Time & Emoji Icon */}
                <View style={styles.timelineLeft}>
                  <View style={styles.timelineIconBox}>
                    <Text style={styles.timelineEmoji}>{item.emoji}</Text>
                  </View>
                </View>

                {/* Main Content */}
                <View style={styles.timelineCenter}>
                  <View style={styles.timelineTitleRow}>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.timelineSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                  {item.details && (
                    <Text style={styles.timelineDetails} numberOfLines={1}>
                      {item.details}
                    </Text>
                  )}
                </View>

                {/* Right Badge & Arrow */}
                <View style={styles.timelineRight}>
                  {item.metaBadge && (
                    <Badge variant={item.metaBadgeVariant || 'slate'} size="sm">
                      {item.metaBadge}
                    </Badge>
                  )}
                  <ChevronRight size={14} color={colors.surface[400]} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: spacing[12] }} />
      </ScrollView>

      {/* ============================================================ */}
      {/* 3. TRACKING FLOW MODALS (SLIDE-UP DETAILS FOR EACH OPTION)   */}
      {/* ============================================================ */}

      {/* 3.1 FOOD TRACKING FLOW MODAL */}
      <Modal
        isOpen={activeTrackingSheet === 'food'}
        onClose={() => setActiveTrackingSheet(null)}
        title="Food Tracking"
        description="Select a meal slot to log or manage foods, calories & macros."
        footer={
          <View style={styles.modalActionsRow}>
            <Button
              variant="outline"
              size="sm"
              style={{ flex: 1 }}
              onPress={() => {
                setActiveTrackingSheet(null);
                navigation.navigate('NutritionTab', { screen: 'Diary' });
              }}
            >
              Open Food Diary
            </Button>
            <Button
              variant="primary"
              size="sm"
              style={{ flex: 1 }}
              leftIcon={<Plus size={14} color={colors.white} />}
              onPress={() => {
                const meal = selectedMealForFoodModal;
                setActiveTrackingSheet(null);
                openQuickLog(meal);
              }}
            >
              + Log Food
            </Button>
          </View>
        }
      >
        <View style={styles.modalBodyList}>
          {/* Meal Slot Pickers */}
          <View style={styles.mealSlotsRow}>
            {(['breakfast', 'lunch', 'snack', 'dinner'] as MealType[]).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setSelectedMealForFoodModal(m)}
                style={[
                  styles.mealSlotTab,
                  selectedMealForFoodModal === m && styles.mealSlotTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.mealSlotTabText,
                    selectedMealForFoodModal === m && styles.mealSlotTabTextActive,
                  ]}
                >
                  {m === 'snack' ? 'Snacks' : m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logged items in selected meal */}
          <View style={styles.mealItemsContainer}>
            <Text style={styles.modalSubHeader}>
              LOGGED IN {selectedMealForFoodModal.toUpperCase()}
            </Text>
            {mealItemsForModal.length === 0 ? (
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.surface[400],
                  paddingVertical: spacing[3],
                  textAlign: 'center',
                }}
              >
                No foods logged in {selectedMealForFoodModal} yet.
              </Text>
            ) : (
              mealItemsForModal.map((item) => (
                <View key={item.id} style={styles.mealItemBox}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mealItemName}>{item.name}</Text>
                    <Text style={styles.mealItemMacros}>
                      {item.calories} kcal · {item.protein}g P · {item.carbs}g C · {item.fat}g F
                    </Text>
                  </View>
                  <Badge variant="emerald" size="sm">
                    {item.portion || `${item.quantity || 1} serving`}
                  </Badge>
                </View>
              ))
            )}
          </View>
        </View>
      </Modal>

      {/* 3.2 WORKOUT TRACKING MODAL */}
      <Modal
        isOpen={activeTrackingSheet === 'workout'}
        onClose={() => setActiveTrackingSheet(null)}
        title="Training & Workouts"
        description="View today's routine, record progressive overload sets, or start workout."
        footer={
          <View style={styles.modalActionsRow}>
            <Button
              variant="outline"
              size="sm"
              style={{ flex: 1 }}
              onPress={() => {
                setActiveTrackingSheet(null);
                navigation.navigate('TrainTab');
              }}
            >
              Training Splits
            </Button>
            <Button
              variant="primary"
              size="sm"
              style={{ flex: 1 }}
              leftIcon={<Play size={14} color={colors.white} fill={colors.white} />}
              onPress={handleStartWorkoutAction}
            >
              Start Workout
            </Button>
          </View>
        }
      >
        <View style={styles.modalBodyList}>
          <View style={styles.routineHeaderCard}>
            <View>
              <Text style={styles.routineTitle}>Pull Day (Back & Biceps)</Text>
              <Text style={styles.routineSubtitle}>5 compound & isolation movements · ~55 min</Text>
            </View>
            <Badge variant="amber">Today's Split</Badge>
          </View>

          <View style={styles.exercisesMiniList}>
            <Text style={styles.modalSubHeader}>PLANNED MOVEMENTS</Text>
            <View style={styles.exerciseRowMini}>
              <Text style={styles.exerciseNameMini}>1. Barbell Deadlift</Text>
              <Text style={styles.exerciseSetsMini}>4 sets × 6-8 reps (140 kg)</Text>
            </View>
            <View style={styles.exerciseRowMini}>
              <Text style={styles.exerciseNameMini}>2. Weighted Pull-Ups</Text>
              <Text style={styles.exerciseSetsMini}>3 sets × 8-10 reps (+15 kg)</Text>
            </View>
            <View style={styles.exerciseRowMini}>
              <Text style={styles.exerciseNameMini}>3. Chest-Supported T-Bar Row</Text>
              <Text style={styles.exerciseSetsMini}>4 sets × 10-12 reps (60 kg)</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* 3.3 STEPS TRACKING MODAL */}
      <Modal
        isOpen={activeTrackingSheet === 'steps'}
        onClose={() => setActiveTrackingSheet(null)}
        title="Daily Steps Tracking"
        description="Daily movement volume & pedometer sensor sync."
        footer={
          <Button
            variant="primary"
            size="sm"
            onPress={() => setActiveTrackingSheet(null)}
          >
            Done
          </Button>
        }
      >
        <View style={styles.stepsModalBody}>
          <View style={styles.stepsBigStatBox}>
            <Footprints size={24} color={colors.surface[700]} />
            <Text style={styles.stepsBigNumber}>{currentSteps.toLocaleString()}</Text>
            <Text style={styles.stepsGoalSub}>of 10,000 daily step goal (64%)</Text>
          </View>

          <Text style={styles.modalSubHeader}>MANUAL STEP ADJUSTMENT</Text>
          <View style={styles.stepQuickButtons}>
            <TouchableOpacity
              onPress={() => handleAddManualSteps(500)}
              style={styles.stepAddPill}
            >
              <Text style={styles.stepAddPillText}>+500 steps</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAddManualSteps(1000)}
              style={styles.stepAddPill}
            >
              <Text style={styles.stepAddPillText}>+1,000 steps</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAddManualSteps(2500)}
              style={styles.stepAddPill}
            >
              <Text style={styles.stepAddPillText}>+2,500 steps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3.4 SLEEP TRACKING MODAL */}
      <Modal
        isOpen={activeTrackingSheet === 'sleep'}
        onClose={() => setActiveTrackingSheet(null)}
        title="Sleep Tracking"
        description="Sleep duration, circadian stages & autonomic recovery score."
        footer={
          <Button
            variant="primary"
            size="sm"
            onPress={() => setActiveTrackingSheet(null)}
          >
            Done
          </Button>
        }
      >
        <View style={styles.modalBodyList}>
          <View style={styles.sleepStatCard}>
            <View>
              <Text style={styles.sleepDurationBig}>7h 42m</Text>
              <Text style={styles.sleepTimeWindow}>11:15 PM - 6:57 AM</Text>
            </View>
            <Badge variant="purple">88% Quality</Badge>
          </View>

          <View style={styles.sleepStagesRow}>
            <TouchableOpacity
              onPress={() => handleSaveSleep(420, 85)}
              style={styles.sleepStageCell}
            >
              <Text style={styles.sleepStageVal}>7h 00m</Text>
              <Text style={styles.sleepStageLbl}>7 Hours</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSaveSleep(462, 88)}
              style={styles.sleepStageCell}
            >
              <Text style={styles.sleepStageVal}>7h 42m</Text>
              <Text style={styles.sleepStageLbl}>Optimal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSaveSleep(510, 92)}
              style={styles.sleepStageCell}
            >
              <Text style={styles.sleepStageVal}>8h 30m</Text>
              <Text style={styles.sleepStageLbl}>Recovery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3.5 HYDRATION TRACKING MODAL */}
      <Modal
        isOpen={activeTrackingSheet === 'water'}
        onClose={() => setActiveTrackingSheet(null)}
        title="Hydration Tracking"
        description="Cellular hydration pacing & fluid intake logger."
        footer={
          <Button
            variant="primary"
            size="sm"
            onPress={() => setActiveTrackingSheet(null)}
          >
            Done
          </Button>
        }
      >
        <View style={styles.modalBodyList}>
          <View style={styles.waterHeaderCard}>
            <View>
              <Text style={styles.waterBigNumber}>{currentWater.toFixed(1)} / 2.5 L</Text>
              <Text style={styles.waterGoalSub}>
                {currentWater >= 2.5
                  ? 'Daily hydration target achieved! 🎉'
                  : `${Math.round((2.5 - currentWater) * 1000)} ml remaining today`}
              </Text>
            </View>
            <Badge variant="blue">{Math.min(100, Math.round((currentWater / 2.5) * 100))}% Goal</Badge>
          </View>

          <Text style={styles.modalSubHeader}>QUICK LOG ACTIONS</Text>
          <View style={styles.waterButtonsRow}>
            <TouchableOpacity
              onPress={() => handleAddQuickWater(0.25)}
              style={styles.waterLogBtn}
            >
              <Droplets size={16} color={colors.nutrition.water} />
              <Text style={styles.waterLogBtnText}>+250 ml</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAddQuickWater(0.5)}
              style={styles.waterLogBtn}
            >
              <Droplets size={16} color={colors.nutrition.water} />
              <Text style={styles.waterLogBtnText}>+500 ml</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalSubHeader, { marginTop: spacing[3] }]}>CUSTOM AMOUNT (ML)</Text>
          <View style={styles.customWaterRow}>
            <TextInput
              value={customWaterInput}
              onChangeText={setCustomWaterInput}
              keyboardType="numeric"
              placeholder="e.g. 350"
              style={styles.customWaterInput}
            />
            <Button variant="primary" size="sm" onPress={handleAddCustomWater}>
              Add
            </Button>
          </View>
        </View>
      </Modal>

      {/* 3.6 WEIGHT TRACKING MODAL */}
      <Modal
        isOpen={activeTrackingSheet === 'weight'}
        onClose={() => setActiveTrackingSheet(null)}
        title="Body Weight Tracking"
        description="Record body mass to track weekly composition progression."
        footer={
          <View style={styles.modalActionsRow}>
            <Button
              variant="outline"
              size="sm"
              style={{ flex: 1 }}
              onPress={() => setActiveTrackingSheet(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              style={{ flex: 1 }}
              onPress={handleSaveWeight}
            >
              Save Weight
            </Button>
          </View>
        }
      >
        <View style={styles.weightModalBody}>
          <Text style={styles.modalSubHeader}>CURRENT WEIGHT (KG)</Text>
          <View style={styles.weightStepperRow}>
            <TouchableOpacity
              onPress={() => setWeightInput((prev) => (parseFloat(prev || '68') - 0.1).toFixed(1))}
              style={styles.weightStepperBtn}
            >
              <Text style={styles.stepperBtnText}>-</Text>
            </TouchableOpacity>

            <TextInput
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="decimal-pad"
              style={styles.weightBigInputField}
            />

            <TouchableOpacity
              onPress={() => setWeightInput((prev) => (parseFloat(prev || '68') + 0.1).toFixed(1))}
              style={styles.weightStepperBtn}
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.weightTrendNotice}>
            ↓ 1.8 kg this month · Goal: 65.0 kg
          </Text>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* 5. LOG INSPECTOR MODAL (TAP ANY LOG IN TIMELINE)             */}
      {/* ============================================================ */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`${selectedLog.emoji} ${selectedLog.title}`}
          description={`Logged at ${selectedLog.time} for ${formattedDate}`}
          footer={
            <View style={styles.modalActionsRow}>
              <Button
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
                onPress={() => handleDeleteTimelineLog(selectedLog)}
              >
                Delete Log
              </Button>
              <Button
                variant="primary"
                size="sm"
                style={{ flex: 1 }}
                onPress={() => setSelectedLog(null)}
              >
                Close
              </Button>
            </View>
          }
        >
          <View style={styles.inspectorCard}>
            <Text style={styles.inspectorHeadline}>{selectedLog.subtitle}</Text>
            {selectedLog.details && (
              <Text style={styles.inspectorDetails}>{selectedLog.details}</Text>
            )}
            {selectedLog.metaBadge && (
              <Badge variant={selectedLog.metaBadgeVariant || 'emerald'} size="sm" style={{ alignSelf: 'flex-start', marginTop: spacing[2] }}>
                {selectedLog.metaBadge}
              </Badge>
            )}
          </View>
        </Modal>
      )}

      {/* ============================================================ */}
      {/* NOTIFICATIONS MODAL                                          */}
      {/* ============================================================ */}
      <Modal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Alerts & Reminders"
        description="Daily metabolic guidance & hydration reminders."
        footer={
          <Button variant="primary" size="sm" onPress={() => setIsNotificationsOpen(false)}>
            Dismiss
          </Button>
        }
      >
        <View style={styles.notificationsList}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => markNotificationRead(item.id)}
              style={[
                styles.notificationItem,
                item.unread && styles.notificationItemUnread,
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.notifTitleRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifTime}>{item.time}</Text>
                </View>
                <Text style={styles.notifDesc}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* Global Bottom Sheet & Date Picker */}
      <QuickLogBottomSheet
        isOpen={isQuickLogOpen}
        onClose={closeQuickLog}
        selectedDate={selectedDate}
        onAddFood={(food, mealType, quantity) => {
          addFood(food, mealType, quantity, selectedDate);
          showToast(`Added ${quantity}x ${food.name}! 🥑`, 'success');
        }}
      />

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={closeDatePicker}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[1.5],
    paddingBottom: spacing[8],
    gap: spacing[3],
  },
  scenarioBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2.5],
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[2],
  },
  scenarioLabel: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[400],
    letterSpacing: 0.5,
  },
  scenarioScroll: {
    gap: spacing[1.5],
  },
  scenarioPill: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: 3,
    borderRadius: radii.md,
    backgroundColor: colors.surface[100],
  },
  scenarioPillActive: {
    backgroundColor: colors.brand.primary,
  },
  scenarioPillText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[600],
  },
  scenarioPillTextActive: {
    color: colors.white,
    fontFamily: typography.fontFamily.bold,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.amber[50],
    borderRadius: radii.xl,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderWidth: 1,
    borderColor: colors.amber[200],
  },
  errorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  errorText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.amber[900],
  },
  retryBtn: {
    backgroundColor: colors.amber[200],
    paddingHorizontal: spacing[2.5],
    paddingVertical: 3,
    borderRadius: radii.md,
  },
  retryBtnText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    color: colors.amber[950],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[1],
  },
  headerLeft: {
    gap: 2,
  },
  greetingText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
    letterSpacing: -0.3,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.surface[200],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...shadows.xs,
  },
  notifBadgeDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.rose[500],
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.xl,
    backgroundColor: colors.emerald[100],
    borderWidth: 1.5,
    borderColor: colors.emerald[300],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.xs,
  },
  avatarLetter: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.brand.primary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[0.5],
  },
  sectionTitle: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[400],
    letterSpacing: 0.6,
  },
  viewAllLogsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllLogsText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.brand.primary,
  },
  logsCountText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
  },
  trackingContainer: {
    gap: spacing[2.5],
  },
  foodPrimaryCard: {
    backgroundColor: colors.white,
    borderRadius: radii['2xl'],
    padding: spacing[3.5],
    borderWidth: 1.5,
    borderColor: colors.emerald[200],
    gap: spacing[2.5],
    ...shadows.sm,
  },
  foodCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  foodIconBox: {
    width: 30,
    height: 30,
    borderRadius: radii.lg,
    backgroundColor: colors.emerald[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodCardTitle: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[600],
    letterSpacing: 0.8,
  },
  foodActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.emerald[50],
    paddingHorizontal: spacing[2.5],
    paddingVertical: 3.5,
    borderRadius: radii.full,
  },
  foodActionText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    color: colors.brand.primary,
  },
  foodStatsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  foodCalorieGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[1.5],
  },
  foodCalorieValue: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
    letterSpacing: -0.5,
  },
  foodCalorieUnit: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  foodProteinBadge: {
    backgroundColor: colors.surface[100],
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  foodProteinText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[700],
  },
  foodProgressWrap: {
    marginVertical: 1,
  },
  foodProgressBarBg: {
    height: 4,
    backgroundColor: colors.surface[100],
    borderRadius: 2,
    overflow: 'hidden',
  },
  foodProgressBarFill: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: 2,
  },
  foodMealsStrip: {
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.surface[100],
  },
  foodMealsText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
    letterSpacing: 0.2,
  },
  compactRow: {
    flexDirection: 'row',
    gap: spacing[2.5],
  },
  compactCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: colors.surface[200],
    justifyContent: 'space-between',
    gap: spacing[2],
    ...shadows.xs,
  },
  compactCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactIconBox: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactCardBottom: {
    gap: 2,
  },
  compactCardTitle: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[400],
    letterSpacing: 0.5,
  },
  compactCardStatus: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  weightCardFull: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3.5],
    borderWidth: 1,
    borderColor: colors.surface[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.xs,
  },
  weightCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  weightCardTextGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[2],
  },
  skeletonFoodCard: {
    height: 136,
    backgroundColor: colors.surface[150],
    borderColor: colors.surface[200],
  },
  skeletonCompactCard: {
    height: 72,
    backgroundColor: colors.surface[150],
    borderColor: colors.surface[200],
  },
  skeletonWeightCard: {
    height: 52,
    backgroundColor: colors.surface[150],
    borderColor: colors.surface[200],
  },
  timelineContainer: {
    backgroundColor: colors.white,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.surface[200],
    overflow: 'hidden',
    ...shadows.card,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3.5],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
    gap: spacing[3],
  },
  skeletonItem: {
    height: 60,
    backgroundColor: colors.surface[100],
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineIconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.xl,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineEmoji: {
    fontSize: 16,
  },
  timelineCenter: {
    flex: 1,
    gap: 2,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  timelineTime: {
    fontSize: 10,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
  },
  timelineSubtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[700],
  },
  timelineDetails: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[400],
  },
  timelineRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  emptyStateContainer: {
    backgroundColor: colors.white,
    borderRadius: radii['2xl'],
    padding: spacing[5],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[2],
    ...shadows.xs,
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHeading: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[800],
  },
  emptySub: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[500],
    textAlign: 'center',
    lineHeight: 16,
  },
  emptyActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  modalBodyList: {
    gap: spacing[3],
    paddingVertical: spacing[1],
  },
  modalSubHeader: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[400],
    letterSpacing: 0.5,
    marginBottom: spacing[1],
  },
  mealSlotsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface[100],
    borderRadius: radii.xl,
    padding: 3,
  },
  mealSlotTab: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  mealSlotTabActive: {
    backgroundColor: colors.white,
    ...shadows.xs,
  },
  mealSlotTabText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[600],
  },
  mealSlotTabTextActive: {
    fontFamily: typography.fontFamily.bold,
    color: colors.brand.primary,
  },
  mealItemsContainer: {
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[2],
  },
  mealItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: spacing[2.5],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  mealItemName: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[900],
  },
  mealItemMacros: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    marginTop: 2,
  },
  routineHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface[50],
    padding: spacing[3],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  routineTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[900],
  },
  routineSubtitle: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    marginTop: 2,
  },
  exercisesMiniList: {
    gap: spacing[1.5],
  },
  exerciseRowMini: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[1.5],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
  },
  exerciseNameMini: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semibold,
    color: colors.surface[800],
  },
  exerciseSetsMini: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  stepsModalBody: {
    alignItems: 'center',
    paddingVertical: spacing[2],
    gap: spacing[3],
  },
  stepsBigStatBox: {
    alignItems: 'center',
    backgroundColor: colors.surface[50],
    padding: spacing[4],
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.surface[200],
    width: '100%',
    gap: spacing[1],
  },
  stepsBigNumber: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  stepsGoalSub: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  stepQuickButtons: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  stepAddPill: {
    backgroundColor: colors.surface[100],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  stepAddPillText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[700],
  },
  sleepStatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.purple[50],
    padding: spacing[3.5],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.purple[200],
  },
  sleepDurationBig: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.purple[950],
  },
  sleepTimeWindow: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.purple[700],
    marginTop: 2,
  },
  sleepStagesRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  sleepStageCell: {
    flex: 1,
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing[2.5],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  sleepStageVal: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[900],
  },
  sleepStageLbl: {
    fontSize: 9,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
    marginTop: 2,
  },
  waterHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.sky[50],
    padding: spacing[3.5],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.sky[200],
  },
  waterBigNumber: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.sky[950],
  },
  waterGoalSub: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.sky[700],
    marginTop: 2,
  },
  waterButtonsRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  waterLogBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sky[50],
    borderWidth: 1,
    borderColor: colors.sky[200],
    paddingVertical: spacing[2.5],
    borderRadius: radii.xl,
    gap: 6,
  },
  waterLogBtnText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.sky[800],
  },
  customWaterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  customWaterInput: {
    flex: 1,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
    borderRadius: radii.xl,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[900],
  },
  weightModalBody: {
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  weightStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  weightStepperBtn: {
    width: 44,
    height: 44,
    borderRadius: radii.xl,
    backgroundColor: colors.surface[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  stepperBtnText: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[700],
  },
  weightBigInputField: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
    textAlign: 'center',
    minWidth: 120,
    paddingVertical: spacing[2],
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  weightTrendNotice: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    textAlign: 'center',
    marginTop: spacing[1],
  },
  inspectorCard: {
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing[3.5],
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[1],
  },
  inspectorHeadline: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[900],
  },
  inspectorDetails: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[600],
    lineHeight: 16,
  },
  notificationsList: {
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  notificationItem: {
    padding: spacing[3],
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[1],
  },
  notificationItemUnread: {
    backgroundColor: colors.emerald[50],
    borderColor: colors.emerald[100],
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[900],
  },
  notifTime: {
    fontSize: 9,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
  },
  notifDesc: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[600],
  },
});
