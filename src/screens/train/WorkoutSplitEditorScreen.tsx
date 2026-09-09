import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWorkout } from '../../context/WorkoutContext';
import { useUI } from '../../context/UIContext';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Sliders,
  Check,
  ChevronLeft,
  Calendar,
  Sparkles,
  Dumbbell,
} from 'lucide-react-native';

const splitPresets = [
  {
    id: 'ppl-6',
    name: 'Push / Pull / Legs (6-Day PPL)',
    description: 'High-frequency split optimal for hypertrophy and strength progression.',
    days: [
      { day: 'Monday', title: 'Push Focus A (Chest & Triceps)' },
      { day: 'Tuesday', title: 'Pull Focus A (Back & Biceps)' },
      { day: 'Wednesday', title: 'Legs & Core A (Quads & Calves)' },
      { day: 'Thursday', title: 'Push Focus B (Shoulders & Chest)' },
      { day: 'Friday', title: 'Pull Focus B (Lats & Posterior)' },
      { day: 'Saturday', title: 'Legs & Hamstrings B' },
      { day: 'Sunday', title: 'Metabolic Active Recovery' },
    ],
  },
  {
    id: 'ul-4',
    name: 'Upper / Lower (4-Day Split)',
    description: 'Balanced frequency allowing ample recovery for heavy compound lifts.',
    days: [
      { day: 'Monday', title: 'Upper Body Heavy A' },
      { day: 'Tuesday', title: 'Lower Body Quad Focus' },
      { day: 'Wednesday', title: 'Rest & Mobility' },
      { day: 'Thursday', title: 'Upper Body Hypertrophy B' },
      { day: 'Friday', title: 'Lower Body Posterior Chain' },
      { day: 'Saturday', title: 'Cardio & Conditioning' },
      { day: 'Sunday', title: 'Rest & Nutrient Sync' },
    ],
  },
  {
    id: 'fb-3',
    name: 'Full Body Compound (3-Day Split)',
    description: 'Maximum efficiency hitting each muscle group 3x weekly.',
    days: [
      { day: 'Monday', title: 'Full Body Strength A' },
      { day: 'Tuesday', title: 'Rest & Recovery' },
      { day: 'Wednesday', title: 'Full Body Hypertrophy B' },
      { day: 'Thursday', title: 'Rest & Zone 2 Cardio' },
      { day: 'Friday', title: 'Full Body Power & Core C' },
      { day: 'Saturday', title: 'Active Mobility' },
      { day: 'Sunday', title: 'Rest' },
    ],
  },
];

export function WorkoutSplitEditorScreen() {
  const navigation = useNavigation();
  const { currentSplit, updateSplit } = useWorkout();
  const { showToast } = useUI();

  const [selectedPresetId, setSelectedPresetId] = useState(
    currentSplit.id === 'ppl-6' || currentSplit.id === 'ul-4' || currentSplit.id === 'fb-3'
      ? currentSplit.id
      : 'ppl-6'
  );

  const activePreset = splitPresets.find((p) => p.id === selectedPresetId) || splitPresets[0];

  const handleApplySplit = () => {
    updateSplit({
      id: activePreset.id,
      name: activePreset.name,
      description: activePreset.description,
      daysCount: activePreset.days.filter((d) => !d.title.includes('Rest')).length,
    });
    showToast(`Updated active training split to "${activePreset.name}"! 🏋️`, 'success');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Workout Split Manager"
        emoji="⚙️"
        subtitle="Select or customize your weekly training schedule and focus distribution."
        leftAction={
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={20} color={colors.surface[700]} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preset Selection Cards */}
        <View style={styles.presetsList}>
          {splitPresets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <TouchableOpacity
                key={preset.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPresetId(preset.id)}
              >
                <Card
                  style={[
                    styles.presetCard,
                    isSelected && styles.presetCardSelected,
                  ]}
                >
                  <View style={styles.presetHeader}>
                    <View style={styles.presetIconRow}>
                      <View
                        style={[
                          styles.presetIconBox,
                          isSelected && styles.presetIconBoxSelected,
                        ]}
                      >
                        <Dumbbell
                          size={18}
                          color={isSelected ? colors.brand.primary : colors.surface[600]}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.presetTitle}>{preset.name}</Text>
                        <Text style={styles.presetDesc}>{preset.description}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.radioDot,
                        isSelected && styles.radioDotSelected,
                      ]}
                    >
                      {isSelected && <Check size={12} color={colors.white} strokeWidth={3} />}
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Schedule Breakdown for Selected Preset */}
        <Card style={styles.breakdownCard}>
          <CardHeader
            title="Weekly Schedule Preview"
            subtitle={`${activePreset.name}`}
            badge={<Badge variant="emerald">7-Day Plan</Badge>}
          />

          <View style={styles.daysList}>
            {activePreset.days.map((d, idx) => (
              <View key={idx} style={styles.dayRow}>
                <Text style={styles.dayName}>{d.day}</Text>
                <Text style={styles.dayFocus} numberOfLines={1}>
                  {d.title}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Apply Button */}
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Check size={18} color={colors.white} strokeWidth={3} />}
          onPress={handleApplySplit}
          style={styles.applyBtn}
        >
          Apply This Training Split
        </Button>

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
  backBtn: {
    padding: spacing[1],
    marginRight: spacing[1],
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[4],
  },
  presetsList: {
    gap: spacing[3],
  },
  presetCard: {
    padding: spacing[4],
    borderWidth: 1.5,
    borderColor: colors.surface[200],
  },
  presetCardSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.emerald[50],
    ...shadows.sm,
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  presetIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  presetIconBox: {
    width: 40,
    height: 40,
    borderRadius: radii.xl,
    backgroundColor: colors.surface[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetIconBoxSelected: {
    backgroundColor: colors.emerald[100],
  },
  presetTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  presetDesc: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[500],
    marginTop: 2,
    lineHeight: 16,
  },
  radioDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.surface[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.brand.primary,
  },
  breakdownCard: {
    padding: spacing[4],
  },
  daysList: {
    gap: spacing[2],
    paddingTop: spacing[2],
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
  },
  dayName: {
    width: 90,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[700],
  },
  dayFocus: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[900],
    textAlign: 'right',
  },
  applyBtn: {
    width: '100%',
    marginTop: spacing[2],
  },
});
