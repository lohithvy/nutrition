/**
 * NutriFlow Native EmptyState Component
 */

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon,
  title = 'No data yet',
  description = 'Get started by adding your first item or exploring recommendations.',
  action,
  secondaryAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrapper}>
        {icon || <Sparkles size={26} color={colors.brand.primary} />}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {(action || secondaryAction) && (
        <View style={styles.actionsRow}>
          {action}
          {secondaryAction}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: spacing['2xl'],
    backgroundColor: colors.surface.white,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.subtle,
    marginVertical: spacing.md,
  },
  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: radii.xl,
    backgroundColor: colors.brand.light,
    borderWidth: 1,
    borderColor: colors.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
    marginBottom: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
