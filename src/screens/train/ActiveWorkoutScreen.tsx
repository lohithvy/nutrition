import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrainStackParamList } from '../../types/navigation';
import { useWorkout } from '../../context/WorkoutContext';
import { useUI } from '../../context/UIContext';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  Check,
  Timer,
  Plus,
  Trash2,
  Flame,
  Award,
  ChevronLeft,
  FastForward,
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<TrainStackParamList>;
type RouteProps = RouteProp<TrainStackParamList, 'ActiveWorkout'>;

interface ExerciseSet {
  setNumber: number;
  prev: string;
  weight: string;
  reps: string;
  rpe: string;
  completed: boolean;
}

interface ActiveExerciseItem {
  id: string;
  name: string;
  targetSets: string;
  sets: ExerciseSet[];
}

export function ActiveWorkoutScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { workoutTitle = 'Pull Focus A' } = route.params || {};

  const {
    activeSession,
    completeWorkout,
    startRestTimer,
    cancelRestTimer,
    restTimerSeconds,
    isRestTimerActive,
  } = useWorkout();
  const { showToast } = useUI();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const [exercises, setExercises] = useState<ActiveExerciseItem[]>([
    {
      id: 'ex-1',
      name: 'Barbell Deadlift',
      targetSets: '4 sets × 6-8 reps',
      sets: [
        { setNumber: 1, prev: '135 kg × 8', weight: '140', reps: '8', rpe: '8', completed: false },
        { setNumber: 2, prev: '135 kg × 8', weight: '140', reps: '7', rpe: '8.5', completed: false },
        { setNumber: 3, prev: '140 kg × 6', weight: '140', reps: '6', rpe: '9', completed: false },
      ],
    },
    {
      id: 'ex-2',
      name: 'Weighted Pull-Ups',
      targetSets: '3 sets × 8-10 reps',
      sets: [
        { setNumber: 1, prev: '+15 kg × 9', weight: '15', reps: '10', rpe: '8', completed: false },
        { setNumber: 2, prev: '+15 kg × 8', weight: '15', reps: '8', rpe: '8.5', completed: false },
        { setNumber: 3, prev: '+15 kg × 8', weight: '15', reps: '8', rpe: '9', completed: false },
      ],
    },
    {
      id: 'ex-3',
      name: 'Chest-Supported T-Bar Row',
      targetSets: '3 sets × 10-12 reps',
      sets: [
        { setNumber: 1, prev: '60 kg × 12', weight: '60', reps: '12', rpe: '8', completed: false },
        { setNumber: 2, prev: '60 kg × 10', weight: '60', reps: '10', rpe: '8.5', completed: false },
      ],
    },
  ]);

  // Elapsed Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = (exId: string, setIdx: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const newSets = [...ex.sets];
        const wasCompleted = newSets[setIdx].completed;
        newSets[setIdx] = {
          ...newSets[setIdx],
          completed: !wasCompleted,
        };

        if (!wasCompleted) {
          // Trigger 90s rest timer
          startRestTimer(90);
          showToast(`Set ${setIdx + 1} logged! 90s Rest Timer started ⏱️`, 'success');
        }

        return { ...ex, sets: newSets };
      })
    );
  };

  const handleAddSet = (exId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const nextSetNum = ex.sets.length + 1;
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [
            ...ex.sets,
            {
              setNumber: nextSetNum,
              prev: `${lastSet ? lastSet.weight : 0} kg × ${lastSet ? lastSet.reps : 10}`,
              weight: lastSet ? lastSet.weight : '0',
              reps: lastSet ? lastSet.reps : '10',
              rpe: '8',
              completed: false,
            },
          ],
        };
      })
    );
  };

  const totalSetsCompleted = exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );

  const handleFinishWorkout = () => {
    setIsFinishModalOpen(false);
    completeWorkout({
      id: `w-${Date.now()}`,
      name: workoutTitle,
      date: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      caloriesBurned: Math.round((elapsedSeconds / 60) * 8),
      exercisesCount: exercises.length,
      totalVolumeKg: 4200,
    });
    showToast(`Workout "${workoutTitle}" saved! Great session! 🏆`, 'success');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={workoutTitle}
        emoji="⚡"
        subtitle={`Session elapsed: ${formatElapsed(elapsedSeconds)} • ${totalSetsCompleted} sets logged`}
        leftAction={
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={20} color={colors.surface[700]} />
          </TouchableOpacity>
        }
        rightAction={
          <Button
            variant="primary"
            size="xs"
            onPress={() => setIsFinishModalOpen(true)}
          >
            Finish
          </Button>
        }
      />

      {/* Rest Timer Floating Banner */}
      {isRestTimerActive && (
        <View style={styles.restBanner}>
          <View style={styles.restLeft}>
            <Timer size={18} color={colors.emerald[400]} />
            <Text style={styles.restText}>
              Resting: <Text style={styles.restSeconds}>{restTimerSeconds}s</Text>
            </Text>
          </View>
          <View style={styles.restActions}>
            <TouchableOpacity
              onPress={() => startRestTimer(restTimerSeconds + 30)}
              style={styles.restSmallBtn}
            >
              <Text style={styles.restSmallBtnText}>+30s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={cancelRestTimer}
              style={[styles.restSmallBtn, styles.restSkipBtn]}
            >
              <FastForward size={14} color={colors.white} />
              <Text style={styles.restSmallBtnText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((ex) => (
          <Card key={ex.id} style={styles.exerciseCard}>
            <CardHeader
              title={ex.name}
              subtitle={ex.targetSets}
              badge={
                <Badge variant="emerald" size="sm">
                  {ex.sets.filter((s) => s.completed).length}/{ex.sets.length} Done
                </Badge>
              }
            />

            {/* Set Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colHeader, styles.colSet]}>SET</Text>
              <Text style={[styles.colHeader, styles.colPrev]}>PREVIOUS</Text>
              <Text style={[styles.colHeader, styles.colInput]}>KG</Text>
              <Text style={[styles.colHeader, styles.colInput]}>REPS</Text>
              <Text style={[styles.colHeader, styles.colCheck]}>✓</Text>
            </View>

            {/* Set Rows */}
            <View style={styles.setRows}>
              {ex.sets.map((set, setIdx) => (
                <View
                  key={set.setNumber}
                  style={[
                    styles.setRow,
                    set.completed && styles.setRowCompleted,
                  ]}
                >
                  <Text style={[styles.setCell, styles.colSet]}>{set.setNumber}</Text>
                  <Text style={[styles.setCellPrev, styles.colPrev]}>{set.prev}</Text>

                  <View style={styles.colInput}>
                    <TextInput
                      value={set.weight}
                      onChangeText={(val) => {
                        const newSets = [...ex.sets];
                        newSets[setIdx].weight = val;
                        setExercises((prev) =>
                          prev.map((e) => (e.id === ex.id ? { ...e, sets: newSets } : e))
                        );
                      }}
                      keyboardType="numeric"
                      style={styles.setValInput}
                    />
                  </View>

                  <View style={styles.colInput}>
                    <TextInput
                      value={set.reps}
                      onChangeText={(val) => {
                        const newSets = [...ex.sets];
                        newSets[setIdx].reps = val;
                        setExercises((prev) =>
                          prev.map((e) => (e.id === ex.id ? { ...e, sets: newSets } : e))
                        );
                      }}
                      keyboardType="numeric"
                      style={styles.setValInput}
                    />
                  </View>

                  <View style={styles.colCheck}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleToggleSet(ex.id, setIdx)}
                      style={[
                        styles.checkBtn,
                        set.completed ? styles.checkBtnDone : styles.checkBtnDefault,
                      ]}
                    >
                      <Check
                        size={16}
                        color={set.completed ? colors.white : colors.surface[400]}
                        strokeWidth={3}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Add Set Button */}
            <View style={styles.addSetRow}>
              <Button
                variant="outline"
                size="xs"
                leftIcon={<Plus size={14} color={colors.surface[700]} />}
                onPress={() => handleAddSet(ex.id)}
              >
                Add Set
              </Button>
            </View>
          </Card>
        ))}

        <View style={{ height: spacing[16] }} />
      </ScrollView>

      {/* Complete Workout Confirmation Modal */}
      <Modal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        title="Complete Workout Session"
        description="Save your progressive overload sets and calculate metabolic calorie expenditure."
        footer={
          <View style={styles.modalFooter}>
            <Button
              variant="outline"
              size="sm"
              style={styles.modalFooterBtn}
              onPress={() => setIsFinishModalOpen(false)}
            >
              Keep Training
            </Button>
            <Button
              variant="primary"
              size="sm"
              style={styles.modalFooterBtn}
              leftIcon={<Award size={16} color={colors.white} />}
              onPress={handleFinishWorkout}
            >
              Save Session
            </Button>
          </View>
        }
      >
        <View style={styles.modalStats}>
          <View style={styles.modalStatBox}>
            <Text style={styles.modalStatVal}>{formatElapsed(elapsedSeconds)}</Text>
            <Text style={styles.modalStatLbl}>Duration</Text>
          </View>
          <View style={styles.modalStatBox}>
            <Text style={styles.modalStatVal}>{totalSetsCompleted}</Text>
            <Text style={styles.modalStatLbl}>Sets Logged</Text>
          </View>
          <View style={styles.modalStatBox}>
            <Text style={[styles.modalStatVal, { color: colors.nutrition.protein }]}>
              ~{Math.round((elapsedSeconds / 60) * 8)}
            </Text>
            <Text style={styles.modalStatLbl}>kcal Burned</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  backBtn: {
    padding: spacing[1],
    marginRight: spacing[1],
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
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[800],
  },
  restLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  restText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[300],
  },
  restSeconds: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.emerald[400],
  },
  restActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  restSmallBtn: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    backgroundColor: colors.surface[800],
    borderRadius: radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restSkipBtn: {
    backgroundColor: colors.brand.primary,
  },
  restSmallBtnText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  exerciseCard: {
    padding: spacing[4],
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[1.5],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
    marginTop: spacing[1],
  },
  colHeader: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[400],
    textAlign: 'center',
  },
  colSet: {
    width: 36,
  },
  colPrev: {
    flex: 2,
    textAlign: 'left',
    paddingLeft: spacing[2],
  },
  colInput: {
    flex: 1.2,
    paddingHorizontal: 3,
  },
  colCheck: {
    width: 44,
    alignItems: 'center',
  },
  setRows: {
    paddingVertical: spacing[1],
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
  },
  setRowCompleted: {
    backgroundColor: colors.emerald[50],
    borderRadius: radii.lg,
  },
  setCell: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[700],
    textAlign: 'center',
  },
  setCellPrev: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    paddingLeft: spacing[2],
  },
  setValInput: {
    backgroundColor: colors.surface[100],
    borderRadius: radii.md,
    textAlign: 'center',
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[900],
    paddingVertical: spacing[1],
  },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  checkBtnDefault: {
    backgroundColor: colors.white,
    borderColor: colors.surface[300],
  },
  checkBtnDone: {
    backgroundColor: colors.emerald[600],
    borderColor: colors.emerald[600],
  },
  addSetRow: {
    alignItems: 'center',
    marginTop: spacing[3],
  },
  modalFooter: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  modalFooterBtn: {
    flex: 1,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing[3],
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  modalStatBox: {
    alignItems: 'center',
  },
  modalStatVal: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  modalStatLbl: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    marginTop: 2,
  },
});
