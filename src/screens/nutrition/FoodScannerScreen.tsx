import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { formatDateDisplay } from '../../utils/date';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Camera,
  Sparkles,
  Check,
  RotateCcw,
  Plus,
  Minus,
  Flame,
  Info,
} from 'lucide-react-native';

const mockDetectedMeals = [
  {
    id: 'scan-1',
    name: 'Grilled Herb Chicken with Quinoa & Asparagus',
    confidence: 97,
    portion: '280g plate',
    calories: 420,
    protein: 48,
    carbs: 28,
    fat: 12,
    fiber: 6,
    category: 'Protein',
    microNotes: 'Rich in Lean B-Vitamins, Zinc, and Dietary Magnesium.',
  },
  {
    id: 'scan-2',
    name: 'Avocado Toast with Poached Eggs',
    confidence: 95,
    portion: '1 plate (2 eggs + 1 slice)',
    calories: 340,
    protein: 18,
    carbs: 24,
    fat: 20,
    fiber: 7,
    category: 'Fats',
    microNotes: 'High in Monounsaturated Fatty Acids, Choline, and Folate.',
  },
  {
    id: 'scan-3',
    name: 'Wild Alaskan Salmon & Roasted Sweet Potato',
    confidence: 98,
    portion: '300g plate',
    calories: 490,
    protein: 44,
    carbs: 34,
    fat: 18,
    fiber: 5,
    category: 'Seafood',
    microNotes: 'High EPA/DHA Omega-3 profile and Beta-Carotene.',
  },
];

export function FoodScannerScreen() {
  const { showToast } = useUI();
  const { addFood, selectedDate } = useNutrition();

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'result'>('idle');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [targetMeal, setTargetMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [quantity, setQuantity] = useState(1);

  const activeMeal = mockDetectedMeals[selectedPresetIndex];

  const handleStartScan = (presetIdx = selectedPresetIndex) => {
    setSelectedPresetIndex(presetIdx);
    setScanState('scanning');
    setQuantity(1);

    setTimeout(() => {
      setScanState('result');
      showToast(
        `Plate detected: "${mockDetectedMeals[presetIdx].name}" (${mockDetectedMeals[presetIdx].confidence}% match)! ✨`,
        'success'
      );
    }, 1200);
  };

  const handleAddToDiary = () => {
    addFood(
      {
        name: activeMeal.name,
        portion: activeMeal.portion,
        calories: activeMeal.calories,
        protein: activeMeal.protein,
        carbs: activeMeal.carbs,
        fat: activeMeal.fat,
        fiber: activeMeal.fiber,
        category: activeMeal.category,
      },
      targetMeal,
      quantity,
      selectedDate
    );

    showToast(
      `Added ${quantity}x ${activeMeal.name} to ${targetMeal} on ${formatDateDisplay(selectedDate)}! 🥑`,
      'success'
    );
    setScanState('idle');
  };

  const scaledCalories = Math.round(activeMeal.calories * quantity);
  const scaledProtein = Math.round(activeMeal.protein * quantity * 10) / 10;
  const scaledCarbs = Math.round(activeMeal.carbs * quantity * 10) / 10;
  const scaledFat = Math.round(activeMeal.fat * quantity * 10) / 10;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="AI Food Vision Scanner"
        emoji="📸"
        subtitle={`Point camera or tap sample plate to auto-estimate macros for ${formatDateDisplay(selectedDate)}.`}
        rightAction={
          <Badge variant="purple" dot>
            Vision AI v2.4
          </Badge>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera Viewfinder Simulation Box */}
        <View style={styles.viewfinderContainer}>
          {/* Viewfinder Header */}
          <View style={styles.viewfinderHeader}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live Camera Ready</Text>
            </View>
            <Badge variant="dark" size="sm">
              HD 1080p AI
            </Badge>
          </View>

          {/* Reticle Area */}
          <View style={styles.reticleArea}>
            <View style={styles.reticleBox}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {scanState === 'scanning' ? (
                <View style={styles.scanningCenter}>
                  <ActivityIndicator size="large" color={colors.emerald[400]} />
                  <Text style={styles.scanningText}>Analyzing Plate...</Text>
                  <Text style={styles.scanningSub}>Segmenting portion sizes</Text>
                </View>
              ) : scanState === 'result' ? (
                <View style={styles.scanningCenter}>
                  <View style={styles.checkCircle}>
                    <Check size={24} color={colors.emerald[400]} strokeWidth={3} />
                  </View>
                  <Text style={styles.scanningText}>Plate Recognized</Text>
                </View>
              ) : (
                <View style={styles.scanningCenter}>
                  <Camera size={36} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.alignText}>Align meal in frame</Text>
                </View>
              )}
            </View>
          </View>

          {/* Presets Row */}
          <View style={styles.presetSection}>
            <Text style={styles.presetHeading}>Select sample meal:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetScroll}
            >
              {mockDetectedMeals.map((meal, idx) => {
                const isSelected = selectedPresetIndex === idx && scanState !== 'idle';
                return (
                  <TouchableOpacity
                    key={meal.id}
                    activeOpacity={0.7}
                    onPress={() => handleStartScan(idx)}
                    style={[
                      styles.presetPill,
                      isSelected ? styles.presetPillSelected : styles.presetPillDefault,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetPillText,
                        isSelected ? styles.presetPillTextSelected : styles.presetPillTextDefault,
                      ]}
                    >
                      {meal.name.split(' ')[0]} {meal.name.split(' ')[1]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Recognition Results Card */}
        <Card style={styles.resultCard}>
          <CardHeader
            title={scanState === 'result' ? 'Detection Results' : 'Scanner Preview'}
            subtitle={
              scanState === 'result'
                ? `AI Confidence: ${activeMeal.confidence}%`
                : 'Scan a meal to view macronutrient breakdown'
            }
            badge={
              scanState === 'result' ? (
                <Badge variant="emerald">{activeMeal.confidence}% Match</Badge>
              ) : (
                <Badge variant="slate">Awaiting Scan</Badge>
              )
            }
          />

          {scanState === 'result' ? (
            <View style={styles.resultBody}>
              {/* Meal Title & Portion */}
              <View style={styles.mealSummaryBox}>
                <Text style={styles.mealName}>{activeMeal.name}</Text>
                <Text style={styles.mealPortion}>Detected: {activeMeal.portion}</Text>

                {/* Macro Grid */}
                <View style={styles.macroGrid}>
                  <View style={styles.macroCell}>
                    <Text style={styles.macroCellVal}>{scaledCalories}</Text>
                    <Text style={styles.macroCellLbl}>kcal</Text>
                  </View>
                  <View style={styles.macroCell}>
                    <Text style={[styles.macroCellVal, { color: colors.nutrition.protein }]}>
                      {scaledProtein}g
                    </Text>
                    <Text style={styles.macroCellLbl}>Protein</Text>
                  </View>
                  <View style={styles.macroCell}>
                    <Text style={[styles.macroCellVal, { color: colors.nutrition.carbs }]}>
                      {scaledCarbs}g
                    </Text>
                    <Text style={styles.macroCellLbl}>Carbs</Text>
                  </View>
                  <View style={styles.macroCell}>
                    <Text style={[styles.macroCellVal, { color: colors.nutrition.fat }]}>
                      {scaledFat}g
                    </Text>
                    <Text style={styles.macroCellLbl}>Fat</Text>
                  </View>
                </View>
              </View>

              {/* Quantity Stepper & Meal Slot */}
              <View style={styles.controlsRow}>
                {/* Stepper */}
                <View style={styles.stepperContainer}>
                  <Text style={styles.controlLabel}>Multiplier</Text>
                  <View style={styles.stepperBox}>
                    <TouchableOpacity
                      onPress={() => setQuantity((prev) => Math.max(0.5, prev - 0.5))}
                      style={styles.stepBtn}
                    >
                      <Minus size={14} color={colors.surface[700]} />
                    </TouchableOpacity>
                    <Text style={styles.stepVal}>{quantity}x</Text>
                    <TouchableOpacity
                      onPress={() => setQuantity((prev) => prev + 0.5)}
                      style={styles.stepBtn}
                    >
                      <Plus size={14} color={colors.surface[700]} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Target Meal Selector */}
                <View style={styles.mealSlotContainer}>
                  <Text style={styles.controlLabel}>Log to Meal</Text>
                  <View style={styles.slotPills}>
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((slot) => {
                      const isSel = targetMeal === slot;
                      return (
                        <TouchableOpacity
                          key={slot}
                          onPress={() => setTargetMeal(slot)}
                          style={[
                            styles.slotPill,
                            isSel && styles.slotPillSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotPillText,
                              isSel && styles.slotPillTextSelected,
                            ]}
                          >
                            {slot[0].toUpperCase() + slot.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              {/* Micronutrient Insight */}
              <View style={styles.microBox}>
                <Sparkles size={16} color={colors.brand.primary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.microTitle}>Micronutrient Profile</Text>
                  <Text style={styles.microDesc}>{activeMeal.microNotes}</Text>
                </View>
              </View>

              {/* Actions Footer */}
              <View style={styles.footerRow}>
                <Button
                  variant="outline"
                  size="sm"
                  style={styles.rescanBtn}
                  leftIcon={<RotateCcw size={16} color={colors.surface[700]} />}
                  onPress={() => setScanState('idle')}
                >
                  Rescan
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  style={styles.addBtn}
                  leftIcon={<Plus size={16} color={colors.white} />}
                  onPress={handleAddToDiary}
                >
                  Add to Diary ({scaledCalories} kcal)
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <Camera size={24} color={colors.surface[400]} />
              </View>
              <Text style={styles.emptyText}>
                Tap "Scan Plate" or select one of the meal presets above to analyze the meal.
              </Text>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Camera size={18} color={colors.white} />}
                onPress={() => handleStartScan(0)}
                style={{ width: '100%', marginTop: spacing[3] }}
              >
                Scan Plate
              </Button>
            </View>
          )}
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
  viewfinderContainer: {
    backgroundColor: colors.surface[900],
    borderRadius: radii['3xl'],
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.surface[800],
    ...shadows.card,
  },
  viewfinderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.surface[700],
    gap: spacing[1.5],
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emerald[400],
  },
  liveText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.emerald[400],
  },
  reticleArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[8],
  },
  reticleBox: {
    width: 200,
    height: 180,
    borderRadius: radii['2xl'],
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(52, 211, 153, 0.7)',
    backgroundColor: 'rgba(6, 78, 59, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: colors.emerald[400],
  },
  cornerTL: {
    top: 4,
    left: 4,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTR: {
    top: 4,
    right: 4,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBL: {
    bottom: 4,
    left: 4,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBR: {
    bottom: 4,
    right: 4,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  scanningCenter: {
    alignItems: 'center',
    gap: spacing[2],
  },
  scanningText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.emerald[300],
  },
  scanningSub: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(52, 211, 153, 0.8)',
  },
  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  presetSection: {
    borderTopWidth: 1,
    borderTopColor: colors.surface[800],
    paddingTop: spacing[3],
    gap: spacing[2],
  },
  presetHeading: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
  },
  presetScroll: {
    gap: spacing[2],
  },
  presetPill: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  presetPillSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  presetPillDefault: {
    backgroundColor: colors.surface[800],
    borderColor: colors.surface[700],
  },
  presetPillText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.semibold,
  },
  presetPillTextSelected: {
    color: colors.white,
    fontFamily: typography.fontFamily.bold,
  },
  presetPillTextDefault: {
    color: colors.surface[300],
  },
  resultCard: {
    padding: spacing[4],
  },
  resultBody: {
    gap: spacing[3.5],
    marginTop: spacing[2],
  },
  mealSummaryBox: {
    backgroundColor: colors.surface[50],
    borderRadius: radii['2xl'],
    padding: spacing[3.5],
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[2],
  },
  mealName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  mealPortion: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  macroGrid: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[1],
  },
  macroCell: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.xs,
  },
  macroCellVal: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  macroCellLbl: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
    marginTop: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  stepperContainer: {
    flex: 1,
    gap: spacing[1],
  },
  mealSlotContainer: {
    flex: 2,
    gap: spacing[1],
  },
  controlLabel: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[500],
  },
  stepperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing[1.5],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  stepBtn: {
    padding: spacing[1.5],
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  stepVal: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  slotPills: {
    flexDirection: 'row',
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  slotPill: {
    flex: 1,
    paddingVertical: spacing[1.5],
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  slotPillSelected: {
    backgroundColor: colors.brand.primary,
  },
  slotPillText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[600],
  },
  slotPillTextSelected: {
    color: colors.white,
  },
  microBox: {
    flexDirection: 'row',
    gap: spacing[2.5],
    padding: spacing[3],
    backgroundColor: colors.emerald[50],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.emerald[100],
  },
  microTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.emerald[950],
  },
  microDesc: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.normal,
    color: colors.emerald[800],
    marginTop: 2,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  rescanBtn: {
    flex: 1,
  },
  addBtn: {
    flex: 2,
  },
  emptyStateContainer: {
    paddingVertical: spacing[8],
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[400],
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing[4],
  },
});
