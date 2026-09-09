/**
 * NutriFlow NutritionHomeScreen (Nutrition Hub)
 * Direct access to Diary, Recipes, AI Camera Scanner, Barcode UPC Scanner, Meal Planner, Grocery List, and AI Assistant
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BookOpen,
  ChefHat,
  Camera,
  Barcode,
  CalendarDays,
  ShoppingCart,
  Bot,
  Plus,
  ChevronRight,
  Flame,
  Droplets,
  Sparkles,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../../types/navigation';
import { formatDateDisplay } from '../../utils/date';
import { DateSelectorBar } from '../../components/common/DateSelectorBar';
import { DatePickerModal } from '../../components/common/DatePickerModal';
import { QuickLogBottomSheet } from '../../components/common/QuickLogBottomSheet';

export function NutritionHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<NutritionStackParamList>>();
  const {
    openQuickLog,
    closeQuickLog,
    isQuickLogOpen,
    openDatePicker,
    closeDatePicker,
    isDatePickerOpen,
    showToast,
  } = useUI();
  const { selectedDate, setSelectedDate, totals, targets, addFood } = useNutrition();

  const hubItems = [
    {
      id: 'diary',
      title: 'Food Diary',
      desc: 'Track daily meals, calories & macros',
      icon: BookOpen,
      color: colors.brand.primary,
      bgColor: colors.brand.light,
      action: () => navigation.navigate('Diary'),
      badge: `${totals.itemsCount} items`,
    },
    {
      id: 'scanner',
      title: 'AI Food Vision Scanner',
      desc: 'Computer vision food recognition',
      icon: Camera,
      color: colors.status.purple,
      bgColor: colors.status.purpleBg,
      action: () => navigation.navigate('FoodScanner'),
      badge: 'AI Vision 2.4',
    },
    {
      id: 'barcode',
      title: 'Smart Barcode Scanner',
      desc: 'Scan UPC barcodes on packaged foods',
      icon: Barcode,
      color: colors.status.info,
      bgColor: colors.status.infoBg,
      action: () => navigation.navigate('BarcodeScanner'),
      badge: 'UPC / EAN',
    },
    {
      id: 'recipes',
      title: 'Nutrient Recipes',
      desc: 'Chef catalog & custom recipe builder',
      icon: ChefHat,
      color: colors.nutri.energy,
      bgColor: '#FFF7ED',
      action: () => navigation.navigate('Recipes'),
      badge: 'Macro Engine',
    },
    {
      id: 'meal-plan',
      title: 'Weekly Meal Planner',
      desc: 'High-protein personalized schedule',
      icon: CalendarDays,
      color: colors.nutri.carbs,
      bgColor: colors.status.warningBg,
      action: () => navigation.navigate('MealPlan'),
      badge: '7 Days',
    },
    {
      id: 'grocery',
      title: 'Smart Grocery List',
      desc: 'Auto-consolidated ingredients & delivery',
      icon: ShoppingCart,
      color: colors.brand.primary,
      bgColor: colors.brand.light,
      action: () => navigation.navigate('Grocery'),
      badge: 'Delivery Ready',
    },
    {
      id: 'assistant',
      title: 'Nutri AI Assistant',
      desc: '24/7 metabolic coaching & meal formulation',
      icon: Bot,
      color: colors.status.purple,
      bgColor: colors.status.purpleBg,
      action: () => navigation.navigate('AIAssistant'),
      badge: 'Chat AI',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selector */}
        <DateSelectorBar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onOpenDatePicker={openDatePicker}
        />

        {/* Screen Header */}
        <ScreenHeader
          title="Nutrition & Meals"
          emoji="🥗"
          subtitle={`Manage your metabolic intake, meal planning, and recipes for ${formatDateDisplay(selectedDate)}.`}
          badge={<Badge variant="emerald">{totals.remainingCalories} kcal left</Badge>}
          actions={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} color="#FFF" />}
              onPress={openQuickLog}
            >
              Log Food
            </Button>
          }
        />

        {/* Quick Macro Snapshot Card */}
        <Card>
          <CardHeader
            title="Today's Macro Snapshot"
            subtitle={`${totals.calories} of ${targets.calories} kcal consumed`}
            icon={<Flame size={18} color={colors.brand.primary} />}
            action={
              <TouchableOpacity onPress={() => navigation.navigate('Diary')}>
                <Text style={styles.openDiaryText}>Open Diary →</Text>
              </TouchableOpacity>
            }
          />
          <CardContent>
            <View style={styles.snapshotGrid}>
              <View style={styles.snapshotBox}>
                <Text style={styles.snapshotNum}>{totals.protein}g</Text>
                <Text style={[styles.snapshotLabel, { color: colors.nutri.protein }]}>Protein</Text>
                <Text style={styles.snapshotTarget}>/ {targets.protein}g</Text>
              </View>
              <View style={styles.snapshotBox}>
                <Text style={styles.snapshotNum}>{totals.carbs}g</Text>
                <Text style={[styles.snapshotLabel, { color: colors.nutri.carbs }]}>Carbs</Text>
                <Text style={styles.snapshotTarget}>/ {targets.carbs}g</Text>
              </View>
              <View style={styles.snapshotBox}>
                <Text style={styles.snapshotNum}>{totals.fat}g</Text>
                <Text style={[styles.snapshotLabel, { color: colors.nutri.fat }]}>Fat</Text>
                <Text style={styles.snapshotTarget}>/ {targets.fat}g</Text>
              </View>
              <View style={styles.snapshotBox}>
                <Text style={styles.snapshotNum}>{totals.water}L</Text>
                <Text style={[styles.snapshotLabel, { color: colors.nutri.water }]}>Water</Text>
                <Text style={styles.snapshotTarget}>/ {targets.water}L</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Navigation Hub Items List */}
        <View style={styles.hubList}>
          {hubItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={item.action}
                activeOpacity={0.85}
                style={styles.hubCard}
              >
                <View style={[styles.hubIconWrapper, { backgroundColor: item.bgColor }]}>
                  <Icon size={22} color={item.color} />
                </View>
                <View style={styles.hubTextCol}>
                  <View style={styles.hubTitleRow}>
                    <Text style={styles.hubTitle}>{item.title}</Text>
                    {item.badge && (
                      <Badge variant="slate" size="sm">
                        {item.badge}
                      </Badge>
                    )}
                  </View>
                  <Text style={styles.hubDesc}>{item.desc}</Text>
                </View>
                <ChevronRight size={18} color={colors.surface[400]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Quick Log Bottom Sheet */}
      <QuickLogBottomSheet
        isOpen={isQuickLogOpen}
        onClose={closeQuickLog}
        selectedDate={selectedDate}
        onAddFood={(food, mealType, quantity) => {
          addFood(food, mealType, quantity, selectedDate);
          showToast(`Added ${quantity}x ${food.name}! 🥑`);
        }}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={closeDatePicker}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 32,
  },
  openDiaryText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },
  snapshotGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  snapshotBox: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surface[50],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surface[150],
  },
  snapshotNum: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
  },
  snapshotLabel: {
    fontSize: typography.size['2xs'],
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  snapshotTarget: {
    fontSize: typography.size['2xs'],
    color: colors.surface[400],
    marginTop: 1,
  },
  hubList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    padding: spacing.md,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.subtle,
  },
  hubIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  hubTextCol: {
    flex: 1,
    marginRight: spacing.sm,
  },
  hubTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  hubTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  hubDesc: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
    marginTop: 2,
  },
});
