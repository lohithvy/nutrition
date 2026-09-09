/**
 * NutriFlow ScreenHeader Component
 * Title, Emoji, Subtitle, Status Badge, Action Buttons, and Alert Banners
 */

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';

interface ScreenHeaderProps {
  title: string;
  emoji?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  alertBanner?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({
  title,
  emoji,
  subtitle,
  badge,
  actions,
  leftAction,
  rightAction,
  alertBanner,
  style,
}: ScreenHeaderProps) {
  const finalRight = rightAction || actions;

  return (
    <View style={[styles.container, style]}>
      {/* Top Row: Title, Emoji, Badge, Actions */}
      <View style={styles.topRow}>
        {leftAction && <View style={styles.leftActionContainer}>{leftAction}</View>}
        <View style={styles.titleWrapper}>
          <View style={styles.titleRow}>
            {emoji && <Text style={styles.emoji}>{emoji}</Text>}
            <Text style={styles.title}>{title}</Text>
          </View>
          {badge && <View style={styles.badgeContainer}>{badge}</View>}
        </View>
        {finalRight && <View style={styles.actionsContainer}>{finalRight}</View>}
      </View>

      {/* Subtitle */}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {/* Optional Alert / Metabolic Banner */}
      {alertBanner && <View style={styles.bannerWrapper}>{alertBanner}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    marginBottom: spacing[2],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  leftActionContainer: {
    marginRight: 4,
  },
  titleWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  emoji: {
    fontSize: 22,
    marginRight: 2,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
    letterSpacing: -0.3,
  },
  badgeContainer: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    marginTop: 4,
    lineHeight: 17,
  },
  bannerWrapper: {
    marginTop: spacing.md,
  },
});
