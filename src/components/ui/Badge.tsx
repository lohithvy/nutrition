/**
 * NutriFlow Native Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';

export type BadgeVariant =
  | 'emerald'
  | 'amber'
  | 'blue'
  | 'purple'
  | 'rose'
  | 'slate'
  | 'dark'
  | 'primary';

export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children?: React.ReactNode;
  label?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({
  children,
  label,
  variant = 'emerald',
  size = 'md',
  dot = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: BadgeProps) {
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle; dot: string } => {
    switch (variant) {
      case 'emerald':
        return {
          container: { backgroundColor: colors.brand.light, borderColor: colors.brand[200] },
          text: { color: colors.brand.primary },
          dot: colors.brand[500],
        };
      case 'amber':
        return {
          container: { backgroundColor: colors.status.warningBg, borderColor: colors.status.warningBorder },
          text: { color: colors.status.warning },
          dot: colors.status.warning,
        };
      case 'blue':
        return {
          container: { backgroundColor: colors.status.infoBg, borderColor: colors.status.infoBorder },
          text: { color: colors.status.info },
          dot: colors.status.info,
        };
      case 'purple':
        return {
          container: { backgroundColor: colors.status.purpleBg, borderColor: colors.status.purpleBorder },
          text: { color: colors.status.purple },
          dot: colors.status.purple,
        };
      case 'rose':
        return {
          container: { backgroundColor: colors.status.errorBg, borderColor: colors.status.errorBorder },
          text: { color: colors.status.error },
          dot: colors.status.error,
        };
      case 'slate':
        return {
          container: { backgroundColor: colors.surface[100], borderColor: colors.surface[200] },
          text: { color: colors.surface[600] },
          dot: colors.surface[400],
        };
      case 'dark':
        return {
          container: { backgroundColor: colors.surface[900], borderColor: colors.surface[800] },
          text: { color: colors.surface.white },
          dot: colors.brand[400],
        };
      case 'primary':
        return {
          container: { backgroundColor: colors.brand.primary, borderColor: colors.brand.primary },
          text: { color: colors.surface.white },
          dot: colors.brand[200],
        };
      default:
        return {
          container: { backgroundColor: colors.brand.light, borderColor: colors.brand[200] },
          text: { color: colors.brand.primary },
          dot: colors.brand[500],
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: 2, paddingHorizontal: 7 },
          text: { fontSize: typography.size['2xs'], fontWeight: typography.weight.medium },
        };
      case 'md':
        return {
          container: { paddingVertical: 4, paddingHorizontal: 9 },
          text: { fontSize: typography.size.xs, fontWeight: typography.weight.semibold },
        };
      case 'lg':
        return {
          container: { paddingVertical: 6, paddingHorizontal: 12 },
          text: { fontSize: typography.size.sm, fontWeight: typography.weight.bold },
        };
      default:
        return {
          container: { paddingVertical: 4, paddingHorizontal: 9 },
          text: { fontSize: typography.size.xs, fontWeight: typography.weight.semibold },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <View style={[styles.base, vStyles.container, sStyles.container, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: vStyles.dot }]} />}
      {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
      <Text style={[styles.text, vStyles.text, sStyles.text, textStyle]}>
        {label || children}
      </Text>
      {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
    marginRight: 5,
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
});
