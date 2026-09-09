/**
 * NutriFlow Native DatePickerModal Component
 * Full calendar grid matrix with month switching and quick presets (Yesterday, Today, Tomorrow)
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { getTodayKey, formatDateDisplay, shiftDateKey } from '../../utils/date';

import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';

interface DatePickerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  selectedDate?: string;
  onSelectDate?: (dateKey: string) => void;
}

export function DatePickerModal(props: DatePickerModalProps) {
  const ui = useUI();
  const nutrition = useNutrition();

  const isOpen = props.isOpen !== undefined ? props.isOpen : ui.isDatePickerOpen;
  const onClose = props.onClose || ui.closeDatePicker;
  const selectedDate = props.selectedDate || nutrition.selectedDate;
  const onSelectDate = props.onSelectDate || ((d: string) => { nutrition.setSelectedDate(d); ui.closeDatePicker(); });
  const initialYear = selectedDate ? parseInt(selectedDate.split('-')[0]) : new Date().getFullYear();
  const initialMonth = selectedDate ? parseInt(selectedDate.split('-')[1]) - 1 : new Date().getMonth();

  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);

  if (!isOpen) return null;

  const todayKey = getTodayKey();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDateKey = (dateKey: string) => {
    onSelectDate(dateKey);
    onClose();
  };

  const handleSelectPreset = (preset: 'yesterday' | 'today' | 'tomorrow') => {
    let targetKey = todayKey;
    if (preset === 'yesterday') targetKey = shiftDateKey(todayKey, -1);
    if (preset === 'tomorrow') targetKey = shiftDateKey(todayKey, 1);

    const [y, m] = targetKey.split('-').map(Number);
    setViewYear(y);
    setViewMonth(m - 1);
    handleSelectDateKey(targetKey);
  };

  // Build calendar matrix
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysArray: ({ dayNumber: number; dateKey: string } | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedD = String(d).padStart(2, '0');
    const formattedM = String(viewMonth + 1).padStart(2, '0');
    const dateKey = `${viewYear}-${formattedM}-${formattedD}`;
    daysArray.push({ dayNumber: d, dateKey });
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Date"
      description="View and log nutrition for any past, present, or future day."
    >
      <View style={styles.container}>
        {/* Presets Row */}
        <View style={styles.presetsRow}>
          <TouchableOpacity
            onPress={() => handleSelectPreset('yesterday')}
            style={styles.presetButton}
          >
            <Text style={styles.presetText}>Yesterday</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelectPreset('today')}
            style={[styles.presetButton, selectedDate === todayKey && styles.presetActive]}
          >
            <Text style={[styles.presetText, selectedDate === todayKey && styles.presetTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelectPreset('tomorrow')}
            style={styles.presetButton}
          >
            <Text style={styles.presetText}>Tomorrow</Text>
          </TouchableOpacity>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navBtn}>
            <ChevronLeft size={18} color={colors.surface[600]} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {monthNames[viewMonth]} {viewYear}
          </Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.navBtn}>
            <ChevronRight size={18} color={colors.surface[600]} />
          </TouchableOpacity>
        </View>

        {/* Calendar Day Labels */}
        <View style={styles.calendarGrid}>
          <View style={styles.weekLabelsRow}>
            {dayLabels.map((lbl) => (
              <Text key={lbl} style={styles.dayLabel}>
                {lbl}
              </Text>
            ))}
          </View>

          {/* Days */}
          <View style={styles.daysGrid}>
            {daysArray.map((item, idx) => {
              if (!item) {
                return <View key={`empty-${idx}`} style={styles.emptyDayCell} />;
              }

              const isSelected = item.dateKey === selectedDate;
              const isToday = item.dateKey === todayKey;

              return (
                <TouchableOpacity
                  key={item.dateKey}
                  onPress={() => handleSelectDateKey(item.dateKey)}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isToday && !isSelected && styles.dayCellToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayCellText,
                      isSelected && styles.dayCellTextSelected,
                      isToday && !isSelected && styles.dayCellTextToday,
                    ]}
                  >
                    {item.dayNumber}
                  </Text>
                  {isToday && !isSelected && <View style={styles.todayDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Active Selection Summary */}
        <View style={styles.activeSummaryRow}>
          <Text style={styles.summaryLabel}>Active Date:</Text>
          <Text style={styles.summaryValue}>{formatDateDisplay(selectedDate)}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  presetsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface[100],
    borderRadius: radii.lg,
    padding: 3,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  presetActive: {
    backgroundColor: colors.brand.primary,
    ...shadows.subtle,
  },
  presetText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.surface[700],
  },
  presetTextActive: {
    color: colors.surface.white,
    fontWeight: typography.weight.bold,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  navBtn: {
    padding: 6,
    borderRadius: radii.md,
    backgroundColor: colors.surface[100],
  },
  monthTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  calendarGrid: {
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  weekLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  dayLabel: {
    width: 34,
    textAlign: 'center',
    fontSize: typography.size['2xs'],
    fontWeight: typography.weight.bold,
    color: colors.surface[400],
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyDayCell: {
    width: 34,
    height: 34,
    marginVertical: 2,
  },
  dayCell: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  dayCellSelected: {
    backgroundColor: colors.brand.primary,
    ...shadows.subtle,
  },
  dayCellToday: {
    backgroundColor: colors.brand.light,
    borderWidth: 1,
    borderColor: colors.brand[300],
  },
  dayCellText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.surface[700],
  },
  dayCellTextSelected: {
    color: colors.surface.white,
    fontWeight: typography.weight.bold,
  },
  dayCellTextToday: {
    color: colors.brand.primary,
    fontWeight: typography.weight.bold,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.brand.primary,
    position: 'absolute',
    bottom: 3,
  },
  activeSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surface[100],
  },
  summaryLabel: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
  },
  summaryValue: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
});
