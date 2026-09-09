/**
 * NutriFlow StatRibbon Component
 * Daily calorie remaining, protein, carbs, and fat summary stats
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { DayTotals } from '../../types/nutrition';
import { NutritionTargets } from '../../types/user';

interface StatRibbonProps {
  totals: DayTotals;
  targets: NutritionTargets;
}

export function StatRibbon({ totals, targets }: StatRibbonProps) {
  return (
    <View style={styles.container}>
      {/* Remaining Kcal */}
      <View style={[styles.statCol, styles.borderRight]}>
        <Text style={styles.statLabel}>Remaining</Text>
        <Text style={styles.statValueMain}>{totals.remainingCalories}</Text>
        <Text style={styles.statTarget}>{totals.calories} / {targets.calories} kcal</Text>
      </View>

      {/* Protein */}
      <View style={[styles.statCol, styles.borderRight]}>
        <Text style={[styles.statLabel, { color: colors.nutri.protein }]}>Protein</Text>
        <Text style={[styles.statValue, { color: colors.nutri.protein }]}>{totals.protein}g</Text>
        <Text style={styles.statTarget}>Target: {targets.protein}g</Text>
      </View>

      {/* Carbs */}
      <View style={[styles.statCol, styles.borderRight]}>
        <Text style={[styles.statLabel, { color: colors.nutri.carbs }]}>Carbs</Text>
        <Text style={[styles.statValue, { color: colors.nutri.carbs }]}>{totals.carbs}g</Text>
        <Text style={styles.statTarget}>Target: {targets.carbs}g</Text>
      </View>

      {/* Fat */}
      <View style={styles.statCol}>
        <Text style={[styles.statLabel, { color: colors.nutri.fat }]}>Fat</Text>
        <Text style={[styles.statValue, { color: colors.nutri.fat }]}>{totals.fat}g</Text>
        <Text style={styles.statTarget}>Target: {targets.fat}g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.subtle,
    marginBottom: spacing.md,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: colors.surface[150],
  },
  statLabel: {
    fontSize: typography.size['2xs'],
    fontWeight: typography.weight.bold,
    color: colors.surface[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValueMain: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
  },
  statValue: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.extrabold,
  },
  statTarget: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
    marginTop: 2,
  },
});
