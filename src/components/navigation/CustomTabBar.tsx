/**
 * NutriFlow Custom Bottom Tab Bar
 * 5 Tabs: HOME, NUTRITION, TRAIN, PROGRESS, YOU
 * Plus elevated Quick Log modal trigger or active tab styling
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  TrendingUp,
  User,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, isFocused: boolean) => {
    const iconSize = 22;
    const strokeColor = isFocused ? colors.brand.primary : colors.surface[400];

    switch (routeName) {
      case 'HomeTab':
        return <LayoutDashboard size={iconSize} color={strokeColor} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'NutritionTab':
        return <Utensils size={iconSize} color={strokeColor} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'TrainTab':
        return <Dumbbell size={iconSize} color={strokeColor} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'ProgressTab':
        return <TrendingUp size={iconSize} color={strokeColor} strokeWidth={isFocused ? 2.5 : 2} />;
      case 'YouTab':
        return <User size={iconSize} color={strokeColor} strokeWidth={isFocused ? 2.5 : 2} />;
      default:
        return <LayoutDashboard size={iconSize} color={strokeColor} strokeWidth={2} />;
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'HomeTab':
        return 'Home';
      case 'NutritionTab':
        return 'Nutrition';
      case 'TrainTab':
        return 'Train';
      case 'ProgressTab':
        return 'Progress';
      case 'YouTab':
        return 'You';
      default:
        return routeName;
    }
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isFocused && styles.iconWrapperActive]}>
                {getIcon(route.name, isFocused)}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {getLabel(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: colors.surface.white,
    borderTopWidth: 1,
    borderTopColor: colors.surface[200],
    paddingTop: 8,
    ...shadows.card,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  iconWrapperActive: {
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: typography.size['2xs'],
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.brand.primary,
    fontWeight: typography.weight.bold,
  },
  tabLabelInactive: {
    color: colors.surface[500],
    fontWeight: typography.weight.medium,
  },
});
