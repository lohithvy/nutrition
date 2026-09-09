/**
 * NutriFlow DateSelectorBar Component
 * Prev/Next Day buttons, current date display, calendar picker trigger
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { formatDateDisplay, shiftDateKey } from '../../utils/date';

interface DateSelectorBarProps {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  onOpenDatePicker: () => void;
}

export function DateSelectorBar({
  selectedDate,
  onSelectDate,
  onOpenDatePicker,
}: DateSelectorBarProps) {
  const handlePrevDay = () => {
    const prevKey = shiftDateKey(selectedDate, -1);
    onSelectDate(prevKey);
  };

  const handleNextDay = () => {
    const nextKey = shiftDateKey(selectedDate, 1);
    onSelectDate(nextKey);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePrevDay}
        style={styles.arrowButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronLeft size={18} color={colors.surface[600]} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onOpenDatePicker}
        activeOpacity={0.8}
        style={styles.dateCenterButton}
      >
        <Calendar size={15} color={colors.brand.primary} style={styles.calendarIcon} />
        <Text style={styles.dateText}>{formatDateDisplay(selectedDate)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNextDay}
        style={styles.arrowButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ChevronRight size={18} color={colors.surface[600]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.subtle,
    marginBottom: spacing.md,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface[100],
  },
  dateCenterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.brand.light,
  },
  calendarIcon: {
    marginRight: 6,
  },
  dateText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },
});
