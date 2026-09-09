/**
 * NutriFlow Native ProgressBar & LoadingState Components
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  progress,
  color = colors.brand.primary,
  height = 6,
  trackColor = colors.surface[200],
  style,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
}

interface LoadingStateProps {
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export function LoadingState({ message = 'Loading...', style }: LoadingStateProps) {
  return (
    <View style={[styles.loadingContainer, style]}>
      <ActivityIndicator size="large" color={colors.brand.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: radii.full,
  },
  loadingContainer: {
    padding: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.size.xs,
    color: colors.surface[500],
    fontWeight: typography.weight.medium,
  },
});
