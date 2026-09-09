import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Activity,
  Heart,
  Flame,
  Scale,
  ShieldCheck,
} from 'lucide-react-native';

export function OnboardingScreen() {
  const { user, updateUser, completeOnboarding } = useAuth();
  const { showToast } = useUI();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Biometrics
  const [weightKg, setWeightKg] = useState(68.4);
  const [heightCm, setHeightCm] = useState(175);
  const [activityLevel, setActivityLevel] = useState('moderate');

  // Step 2: Goal
  const [primaryGoal, setPrimaryGoal] = useState('recomp');

  // Step 3: Diet
  const [dietaryPreference, setDietaryPreference] = useState('High-Protein Balanced');

  // Step 4: Health Kit sync
  const [isHealthKitEnabled, setIsHealthKitEnabled] = useState(true);

  const activityOptions = [
    { key: 'sedentary', label: 'Sedentary', desc: 'Desk job, minimal daily movement' },
    { key: 'light', label: 'Light Activity', desc: '1-3 light sessions per week' },
    { key: 'moderate', label: 'Moderate Exercise', desc: '3-5 training sessions per week' },
    { key: 'very_active', label: 'Intense Athlete', desc: '6-7 heavy training sessions' },
  ];

  const goalOptions = [
    { key: 'fat_loss', label: 'Metabolic Fat Loss', desc: 'Caloric deficit with high protein retention', emoji: '🔥' },
    { key: 'recomp', label: 'Body Recomposition', desc: 'Simultaneous fat loss and lean hypertrophy', emoji: '⚡' },
    { key: 'hypertrophy', label: 'Lean Hypertrophy', desc: 'Caloric surplus for muscle synthesis', emoji: '💪' },
    { key: 'endurance', label: 'Cardio & Endurance', desc: 'High glycogen replenishment pacing', emoji: '🏃' },
  ];

  const dietOptions = [
    'High-Protein Balanced',
    'Mediterranean & Low GI',
    'Ketogenic & Low Carb',
    'Plant-Based & Vegan',
    'Paleo Clean Whole Foods',
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Calculate and save personalized plan
      updateUser({
        body: {
          ...user.body,
          currentWeight: weightKg,
          height: heightCm,
        },
        activity: {
          ...user.activity,
          level: activityLevel === 'sedentary' ? 'Sedentary' : activityLevel === 'light' ? 'Lightly Active' : activityLevel === 'moderate' ? 'Moderately Active' : 'Very Active',
        },
        goals: {
          ...user.goals,
          primaryGoal: primaryGoal,
        },
        diet: {
          ...user.diet,
          preferences: [dietaryPreference],
        },
      });
      completeOnboarding();
      showToast('Personalized metabolic targets calibrated! 🥑', 'success');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Progress Bar */}
      <View style={styles.headerArea}>
        <View style={styles.stepCountRow}>
          <Text style={styles.stepTitle}>
            Step {step} of {totalSteps}
          </Text>
          <Badge variant="emerald" size="sm">
            {Math.round((step / totalSteps) * 100)}% Complete
          </Badge>
        </View>
        <ProgressBar
          progress={(step / totalSteps) * 100}
          color={colors.brand.primary}
          height={6}
          style={styles.progressBar}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Biometrics & Activity */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.introHeader}>
              <Text style={styles.heading}>Biometrics & Activity</Text>
              <Text style={styles.subheading}>
                Used to calculate your exact Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).
              </Text>
            </View>

            <Card style={styles.stepCard}>
              <Text style={styles.fieldLabel}>CURRENT WEIGHT: {weightKg} KG</Text>
              <View style={styles.selectorRow}>
                {[65, 68.4, 72, 75, 80, 85].map((w) => (
                  <TouchableOpacity
                    key={w}
                    onPress={() => setWeightKg(w)}
                    style={[
                      styles.numPill,
                      weightKg === w && styles.numPillSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.numPillText,
                        weightKg === w && styles.numPillTextSelected,
                      ]}
                    >
                      {w} kg
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.fieldLabel, { marginTop: spacing[4] }]}>
                DAILY ACTIVITY LEVEL
              </Text>
              <View style={styles.optionsList}>
                {activityOptions.map((opt) => {
                  const isSel = activityLevel === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setActivityLevel(opt.key)}
                      style={[
                        styles.optionCard,
                        isSel && styles.optionCardSelected,
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.optionTitle}>{opt.label}</Text>
                        <Text style={styles.optionDesc}>{opt.desc}</Text>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          isSel && styles.radioCircleSelected,
                        ]}
                      >
                        {isSel && <Check size={12} color={colors.white} strokeWidth={3} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          </View>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.introHeader}>
              <Text style={styles.heading}>Primary Metabolic Goal</Text>
              <Text style={styles.subheading}>
                We calibrate your macro distribution ratios (P/C/F) according to your physiological focus.
              </Text>
            </View>

            <View style={styles.optionsList}>
              {goalOptions.map((opt) => {
                const isSel = primaryGoal === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setPrimaryGoal(opt.key)}
                    style={[
                      styles.optionCard,
                      isSel && styles.optionCardSelected,
                    ]}
                  >
                    <Text style={styles.goalEmoji}>{opt.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.optionTitle}>{opt.label}</Text>
                      <Text style={styles.optionDesc}>{opt.desc}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioCircle,
                        isSel && styles.radioCircleSelected,
                      ]}
                    >
                      {isSel && <Check size={12} color={colors.white} strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Diet Preference */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.introHeader}>
              <Text style={styles.heading}>Dietary Archetype</Text>
              <Text style={styles.subheading}>
                Tailor automated meal plans and grocery lists to your eating philosophy.
              </Text>
            </View>

            <View style={styles.optionsList}>
              {dietOptions.map((diet) => {
                const isSel = dietaryPreference === diet;
                return (
                  <TouchableOpacity
                    key={diet}
                    onPress={() => setDietaryPreference(diet)}
                    style={[
                      styles.optionCard,
                      isSel && styles.optionCardSelected,
                    ]}
                  >
                    <Text style={styles.optionTitle}>{diet}</Text>
                    <View
                      style={[
                        styles.radioCircle,
                        isSel && styles.radioCircleSelected,
                      ]}
                    >
                      {isSel && <Check size={12} color={colors.white} strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 4: Wearable Connection & Final Sync */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <View style={styles.introHeader}>
              <Text style={styles.heading}>Connect Health Ecosystem</Text>
              <Text style={styles.subheading}>
                Automatically synchronize active calorie burn, sleep stages, and weight scales.
              </Text>
            </View>

            <Card style={styles.stepCard}>
              <View style={styles.healthRow}>
                <View style={styles.healthLeft}>
                  <Heart size={24} color="#e11d48" />
                  <View>
                    <Text style={styles.healthName}>Apple Health / Google Connect</Text>
                    <Text style={styles.healthDesc}>Continuous biometric synchronization</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setIsHealthKitEnabled(!isHealthKitEnabled)}
                  style={[
                    styles.toggleBtn,
                    isHealthKitEnabled ? styles.toggleBtnOn : styles.toggleBtnOff,
                  ]}
                >
                  <Text style={styles.toggleBtnText}>
                    {isHealthKitEnabled ? 'CONNECTED' : 'CONNECT'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Calculated Summary Preview Box */}
              <View style={styles.targetPreview}>
                <Text style={styles.previewTitle}>🎯 Your Calibrated Daily Targets</Text>
                <View style={styles.previewGrid}>
                  <View style={styles.previewCell}>
                    <Text style={styles.previewVal}>2,150</Text>
                    <Text style={styles.previewLbl}>kcal / day</Text>
                  </View>
                  <View style={styles.previewCell}>
                    <Text style={[styles.previewVal, { color: colors.nutrition.protein }]}>
                      160g
                    </Text>
                    <Text style={styles.previewLbl}>Protein</Text>
                  </View>
                  <View style={styles.previewCell}>
                    <Text style={[styles.previewVal, { color: colors.nutrition.carbs }]}>
                      210g
                    </Text>
                    <Text style={styles.previewLbl}>Carbs</Text>
                  </View>
                  <View style={styles.previewCell}>
                    <Text style={[styles.previewVal, { color: colors.nutrition.fat }]}>
                      65g
                    </Text>
                    <Text style={styles.previewLbl}>Fat</Text>
                  </View>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Footer Navigation Buttons */}
        <View style={styles.navRow}>
          {step > 1 ? (
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft size={16} color={colors.surface[700]} />}
              onPress={() => setStep(step - 1)}
              style={styles.backButton}
            >
              Back
            </Button>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          <Button
            variant="primary"
            size="md"
            leftIcon={
              step === totalSteps ? (
                <Sparkles size={16} color={colors.white} />
              ) : (
                <ArrowRight size={16} color={colors.white} />
              )
            }
            onPress={handleNext}
            style={styles.nextButton}
          >
            {step === totalSteps ? 'Enter NutriFlow' : 'Continue'}
          </Button>
        </View>

        <View style={{ height: spacing[8] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  headerArea: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
    paddingBottom: spacing[3],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
    gap: spacing[2],
  },
  stepCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[600],
  },
  progressBar: {
    borderRadius: radii.full,
  },
  scrollContent: {
    padding: spacing[5],
    gap: spacing[4],
  },
  stepContent: {
    gap: spacing[4],
  },
  introHeader: {
    gap: spacing[1.5],
  },
  heading: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  subheading: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[500],
    lineHeight: 18,
  },
  stepCard: {
    padding: spacing[4.5],
  },
  fieldLabel: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[400],
    letterSpacing: 0.5,
    marginBottom: spacing[2],
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  numPill: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3.5],
    borderRadius: radii.xl,
    backgroundColor: colors.surface[100],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  numPillSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  numPillText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[700],
  },
  numPillTextSelected: {
    color: colors.white,
  },
  optionsList: {
    gap: spacing[2.5],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3.5],
    backgroundColor: colors.white,
    borderRadius: radii['2xl'],
    borderWidth: 1.5,
    borderColor: colors.surface[200],
    gap: spacing[3],
    ...shadows.xs,
  },
  optionCardSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.emerald[50],
  },
  goalEmoji: {
    fontSize: 22,
  },
  optionTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  optionDesc: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[500],
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.surface[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primary,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  healthName: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  healthDesc: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[500],
    marginTop: 1,
  },
  toggleBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radii.xl,
  },
  toggleBtnOn: {
    backgroundColor: colors.emerald[100],
  },
  toggleBtnOff: {
    backgroundColor: colors.surface[200],
  },
  toggleBtnText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    color: colors.emerald[800],
  },
  targetPreview: {
    marginTop: spacing[4],
    padding: spacing[3.5],
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: spacing[2],
  },
  previewTitle: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[800],
  },
  previewGrid: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  previewCell: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  previewVal: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  previewLbl: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[400],
    marginTop: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
