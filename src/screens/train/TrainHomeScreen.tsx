import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrainStackParamList } from '../../types/navigation';
import { useWorkout } from '../../context/WorkoutContext';
import { useUI } from '../../context/UIContext';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Dumbbell,
  Play,
  Calendar,
  Flame,
  Clock,
  Timer,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Sliders,
  Plus,
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<TrainStackParamList>;

export function TrainHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { currentSplit, activeSession, startWorkout, restTimerSeconds, isRestTimerActive } = useWorkout();
  const { showToast } = useUI();

  const [selectedDay, setSelectedDay] = useState(2); // Tuesday / Day 2

  const weekSchedule = [
    { day: 'Mon', focus: 'Push Focus A', icon: '🔥', duration: '60 min', completed: true },
    { day: 'Tue', focus: 'Pull Focus A', icon: '⚡', duration: '55 min', active: true },
    { day: 'Wed', focus: 'Legs & Core', icon: '🦵', duration: '65 min' },
    { day: 'Thu', focus: 'Active Rest / Mobility', icon: '🧘', duration: '30 min' },
    { day: 'Fri', focus: 'Upper Body B', icon: '💪', duration: '60 min' },
    { day: 'Sat', focus: 'Lower Body B', icon: '🏃', duration: '50 min' },
    { day: 'Sun', focus: 'Metabolic Recovery', icon: '✨', duration: 'Rest' },
  ];

  const todayExercises = [
    { name: 'Barbell Deadlift', sets: '4 sets × 6-8 reps', targetWeight: '140 kg', rpe: 'RPE 8.5' },
    { name: 'Weighted Pull-Ups', sets: '3 sets × 8-10 reps', targetWeight: '+15 kg', rpe: 'RPE 8' },
    { name: 'Chest-Supported T-Bar Row', sets: '4 sets × 10-12 reps', targetWeight: '60 kg', rpe: 'RPE 8' },
    { name: 'Incline Dumbbell Curl', sets: '3 sets × 12-15 reps', targetWeight: '16 kg', rpe: 'RPE 9' },
    { name: 'Cable Face Pulls', sets: '4 sets × 15-20 reps', targetWeight: '27 kg', rpe: 'RPE 8.5' },
  ];

  const handleStartTodayWorkout = () => {
    startWorkout('Pull Focus A');
    navigation.navigate('ActiveWorkout', { workoutTitle: 'Pull Focus A' });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Training & Workouts"
        emoji="🏋️"
        subtitle="Progressive overload tracking, session logging & metabolic recovery pacing."
        rightAction={
          <Badge variant="emerald" dot>
            {currentSplit.name}
          </Badge>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Rest Timer Banner (if running) */}
        {isRestTimerActive && (
          <View style={styles.restBanner}>
            <View style={styles.restLeft}>
              <Timer size={20} color={colors.white} />
              <View>
                <Text style={styles.restTitle}>Rest Timer Running</Text>
                <Text style={styles.restCountdown}>{restTimerSeconds}s remaining</Text>
              </View>
            </View>
            <Button
              variant="outline"
              size="xs"
              style={styles.restResumeBtn}
              onPress={() => navigation.navigate('ActiveWorkout', { workoutTitle: 'Active Session' })}
            >
              Resume
            </Button>
          </View>
        )}

        {/* Hero Workout Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroBadgeRow}>
              <Badge variant="emerald" size="sm" dot>
                Today's Workout
              </Badge>
              <Badge variant="slate" size="sm">
                Day 2 of 6
              </Badge>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('WorkoutSplitEditor')}
              style={styles.editSplitBtn}
            >
              <Sliders size={14} color={colors.surface[600]} />
              <Text style={styles.editSplitText}>Edit Split</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroTitle}>Pull Focus A (Back & Biceps)</Text>
          <Text style={styles.heroSubtitle}>
            5 compound & isolation movements focused on vertical pull and scapular retraction.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Clock size={14} color={colors.surface[500]} />
              <Text style={styles.heroStatText}>55 mins</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Flame size={14} color={colors.nutrition.protein} />
              <Text style={styles.heroStatText}>420 kcal est.</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Dumbbell size={14} color={colors.brand.primary} />
              <Text style={styles.heroStatText}>5 Exercises</Text>
            </View>
          </View>

          <Button
            variant="primary"
            size="lg"
            leftIcon={<Play size={18} color={colors.white} fill={colors.white} />}
            onPress={handleStartTodayWorkout}
            style={styles.startBtn}
          >
            Start Workout Session
          </Button>
        </Card>

        {/* Weekly Split Schedule Strip */}
        <Card style={styles.scheduleCard}>
          <CardHeader
            title="Weekly Training Split"
            subtitle={`${currentSplit.name} • 5 Days Active`}
            badge={
              <TouchableOpacity onPress={() => navigation.navigate('WorkoutSplitEditor')}>
                <Text style={styles.manageText}>Customize</Text>
              </TouchableOpacity>
            }
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScroll}
          >
            {weekSchedule.map((item, idx) => {
              const isSelected = selectedDay === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => setSelectedDay(idx)}
                  style={[
                    styles.dayPill,
                    isSelected ? styles.dayPillSelected : styles.dayPillDefault,
                  ]}
                >
                  <Text style={styles.dayEmoji}>{item.icon}</Text>
                  <Text
                    style={[
                      styles.dayPillName,
                      isSelected ? styles.dayPillNameSelected : styles.dayPillNameDefault,
                    ]}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={[
                      styles.dayPillFocus,
                      isSelected ? styles.dayPillFocusSelected : styles.dayPillFocusDefault,
                    ]}
                    numberOfLines={1}
                  >
                    {item.focus}
                  </Text>
                  {item.completed && (
                    <View style={styles.checkDot}>
                      <CheckCircle2 size={10} color={colors.emerald[600]} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Card>

        {/* Exercises Preview List */}
        <Card style={styles.exercisesCard}>
          <CardHeader
            title="Planned Exercises"
            subtitle="Today's routine sequence"
            badge={<Badge variant="slate">5 Movements</Badge>}
          />

          <View style={styles.exerciseList}>
            {todayExercises.map((ex, idx) => (
              <View key={idx} style={styles.exerciseRow}>
                <View style={styles.indexCircle}>
                  <Text style={styles.indexText}>{idx + 1}</Text>
                </View>

                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{ex.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {ex.sets} • {ex.targetWeight}
                  </Text>
                </View>

                <Badge variant="emerald" size="sm">
                  {ex.rpe}
                </Badge>
              </View>
            ))}
          </View>
        </Card>

        {/* Metabolic Load & Volume Summary */}
        <Card style={styles.volumeCard}>
          <CardHeader
            title="Weekly Training Load"
            subtitle="Volume accumulation & recovery pacing"
            icon={<TrendingUp size={16} color={colors.brand.primary} />}
          />

          <View style={styles.volumeGrid}>
            <View style={styles.volumeStat}>
              <Text style={styles.volumeVal}>18,450 kg</Text>
              <Text style={styles.volumeLbl}>Weekly Volume</Text>
            </View>
            <View style={styles.volumeDivider} />
            <View style={styles.volumeStat}>
              <Text style={styles.volumeVal}>14 / 16</Text>
              <Text style={styles.volumeLbl}>Sets / Muscle Group</Text>
            </View>
            <View style={styles.volumeDivider} />
            <View style={styles.volumeStat}>
              <Text style={[styles.volumeVal, { color: colors.emerald[700] }]}>94%</Text>
              <Text style={styles.volumeLbl}>Recovery Ready</Text>
            </View>
          </View>
        </Card>

        <View style={{ height: spacing[12] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[4],
  },
  restBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface[900],
    borderRadius: radii['2xl'],
    padding: spacing[3.5],
    borderWidth: 1,
    borderColor: colors.surface[800],
    ...shadows.md,
  },
  restLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  restTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  restCountdown: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.mono,
    color: colors.emerald[400],
    marginTop: 2,
  },
  restResumeBtn: {
    borderColor: colors.surface[700],
  },
  heroCard: {
    padding: spacing[4.5],
    backgroundColor: colors.white,
    gap: spacing[3],
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  editSplitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    backgroundColor: colors.surface[100],
    borderRadius: radii.md,
  },
  editSplitText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[600],
  },
  heroTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  heroSubtitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[500],
    lineHeight: 18,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing[3],
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  heroStatText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[700],
  },
  heroDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.surface[200],
  },
  startBtn: {
    width: '100%',
  },
  scheduleCard: {
    padding: spacing[4],
  },
  manageText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.brand.primary,
  },
  daysScroll: {
    gap: spacing[2],
    paddingTop: spacing[2],
  },
  dayPill: {
    width: 90,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderRadius: radii['2xl'],
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
  },
  dayPillSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
    ...shadows.xs,
  },
  dayPillDefault: {
    backgroundColor: colors.surface[50],
    borderColor: colors.surface[200],
  },
  dayEmoji: {
    fontSize: 16,
  },
  dayPillName: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
  },
  dayPillNameSelected: {
    color: colors.white,
  },
  dayPillNameDefault: {
    color: colors.surface[800],
  },
  dayPillFocus: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
  dayPillFocusSelected: {
    color: colors.emerald[100],
  },
  dayPillFocusDefault: {
    color: colors.surface[500],
  },
  checkDot: {
    marginTop: 2,
  },
  exercisesCard: {
    padding: spacing[4],
  },
  exerciseList: {
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.emerald[50],
    borderWidth: 1,
    borderColor: colors.emerald[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.brand.primary,
  },
  exerciseInfo: {
    flex: 1,
    paddingHorizontal: spacing[3],
  },
  exerciseName: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  exerciseDetails: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    marginTop: 1,
  },
  volumeCard: {
    padding: spacing[4],
  },
  volumeGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: spacing[2],
  },
  volumeStat: {
    alignItems: 'center',
  },
  volumeVal: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  volumeLbl: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    marginTop: 2,
  },
  volumeDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.surface[200],
  },
});
