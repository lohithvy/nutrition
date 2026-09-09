/**
 * NutriFlow Native Card Component Suite
 * Includes Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';

export type CardVariant = 'default' | 'flat' | 'subtle' | 'emerald' | 'glass';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  hover?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function Card({
  children,
  variant = 'default',
  style,
  onPress,
}: CardProps) {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.surface.white,
          borderWidth: 1,
          borderColor: colors.surface[200],
          ...shadows.card,
        };
      case 'flat':
        return {
          backgroundColor: colors.surface.white,
          borderWidth: 1,
          borderColor: colors.surface[200],
        };
      case 'subtle':
        return {
          backgroundColor: colors.surface[50],
          borderWidth: 1,
          borderColor: colors.surface[200],
          ...shadows.subtle,
        };
      case 'emerald':
        return {
          backgroundColor: colors.brand.light,
          borderWidth: 1,
          borderColor: colors.brand[200],
          ...shadows.subtle,
        };
      case 'glass':
        return {
          backgroundColor: colors.surface.white,
          borderWidth: 1,
          borderColor: colors.surface[150],
          ...shadows.card,
        };
      default:
        return {
          backgroundColor: colors.surface.white,
          borderWidth: 1,
          borderColor: colors.surface[200],
          ...shadows.card,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.cardBase, getVariantStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.cardBase, getVariantStyle(), style]}>
      {children}
    </View>
  );
}

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function CardHeader({
  title,
  subtitle,
  icon,
  badge,
  action,
  children,
  style,
}: CardHeaderProps) {
  return (
    <View style={[styles.headerContainer, style]}>
      {(title || subtitle || icon) ? (
        <View style={styles.headerLeft}>
          {icon && (
            <View style={styles.headerIconWrapper}>
              {icon}
            </View>
          )}
          <View style={styles.headerTitles}>
            <View style={styles.titleBadgeRow}>
              {title && <Text style={styles.headerTitle}>{title}</Text>}
              {badge}
            </View>
            {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          </View>
        </View>
      ) : null}
      {children}
      {action && <View style={styles.headerAction}>{action}</View>}
    </View>
  );
}

export function CardTitle({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[styles.cardTitle, style]}>{children}</Text>;
}

export function CardDescription({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[styles.cardDesc, style]}>{children}</Text>;
}

export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.contentContainer, style]}>{children}</View>;
}

export function CardFooter({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.footerContainer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: radii.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  headerIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: colors.brand.light,
    borderWidth: 1,
    borderColor: colors.brand[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitles: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  headerTitle: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  headerSubtitle: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    marginTop: 2,
  },
  headerAction: {
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  cardDesc: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    marginTop: 2,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surface[100],
    backgroundColor: colors.surface[50],
  },
});
