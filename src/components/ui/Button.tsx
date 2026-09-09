/**
 * NutriFlow Native Button Component
 * Matches visual source of truth: variants, sizes, loading states, icons
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'accent'
  | 'danger'
  | 'dark'
  | 'subtle';

export type ButtonSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'icon-xs'
  | 'icon-sm'
  | 'icon-md'
  | 'icon-lg';

interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export function Button({
  title,
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onPress,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const getVariantContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.brand.primary,
          ...shadows.subtle,
        };
      case 'secondary':
        return {
          backgroundColor: colors.surface[100],
        };
      case 'outline':
        return {
          backgroundColor: colors.surface.white,
          borderWidth: 1,
          borderColor: colors.surface[200],
          ...shadows.subtle,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'accent':
        return {
          backgroundColor: colors.nutri.carbs,
          ...shadows.subtle,
        };
      case 'danger':
        return {
          backgroundColor: colors.status.error,
          ...shadows.subtle,
        };
      case 'dark':
        return {
          backgroundColor: colors.surface[900],
          ...shadows.subtle,
        };
      case 'subtle':
        return {
          backgroundColor: colors.brand.light,
          borderWidth: 1,
          borderColor: colors.brand[200],
        };
      default:
        return { backgroundColor: colors.brand.primary };
    }
  };

  const getVariantTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'accent':
      case 'dark':
        return { color: colors.surface.white };
      case 'secondary':
        return { color: colors.surface[700] };
      case 'outline':
        return { color: colors.surface[700] };
      case 'ghost':
        return { color: colors.surface[600] };
      case 'subtle':
        return { color: colors.brand.primary };
      default:
        return { color: colors.surface.white };
    }
  };

  const getSizeContainerStyle = (): ViewStyle => {
    switch (size) {
      case 'xs':
        return { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.sm };
      case 'sm':
        return { paddingVertical: 7, paddingHorizontal: 12, borderRadius: radii.md };
      case 'md':
        return { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.md };
      case 'lg':
        return { paddingVertical: 13, paddingHorizontal: 20, borderRadius: radii.lg };
      case 'icon-xs':
        return { width: 28, height: 28, padding: 0, borderRadius: radii.sm, justifyContent: 'center', alignItems: 'center' };
      case 'icon-sm':
        return { width: 34, height: 34, padding: 0, borderRadius: radii.md, justifyContent: 'center', alignItems: 'center' };
      case 'icon-md':
        return { width: 42, height: 42, padding: 0, borderRadius: radii.md, justifyContent: 'center', alignItems: 'center' };
      case 'icon-lg':
        return { width: 48, height: 48, padding: 0, borderRadius: radii.lg, justifyContent: 'center', alignItems: 'center' };
      default:
        return { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.md };
    }
  };

  const getSizeTextStyle = (): TextStyle => {
    switch (size) {
      case 'xs':
        return { fontSize: typography.size.xs, fontWeight: typography.weight.semibold };
      case 'sm':
        return { fontSize: typography.size.sm, fontWeight: typography.weight.semibold };
      case 'md':
        return { fontSize: typography.size.base, fontWeight: typography.weight.semibold };
      case 'lg':
        return { fontSize: typography.size.md, fontWeight: typography.weight.bold };
      default:
        return { fontSize: typography.size.base, fontWeight: typography.weight.semibold };
    }
  };

  const renderedContent =
    typeof children === 'string' ? (
      <Text style={[styles.text, getVariantTextStyle(), getSizeTextStyle(), textStyle]}>{children}</Text>
    ) : children ? (
      children
    ) : title ? (
      <Text style={[styles.text, getVariantTextStyle(), getSizeTextStyle(), textStyle]}>{title}</Text>
    ) : null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.base,
        getVariantContainerStyle(),
        getSizeContainerStyle(),
        fullWidth && { width: '100%' },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'dark' || variant === 'danger' ? colors.surface.white : colors.brand.primary}
        />
      ) : (
        <View style={styles.innerRow}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          {renderedContent}
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  disabled: {
    opacity: 0.5,
  },
});
