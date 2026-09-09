import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../../types/navigation';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  CalendarDays,
  Sparkles,
  ShoppingCart,
  Plus,
  Clock,
  Flame,
  CheckCircle2,
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<NutritionStackParamList>;

interface DayMeal {
  type: string;
  title: string;
  kcal: number;
  protein: string;
  carbs: string;
  fat: string;
  time: string;
}

export function MealPlanScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { openQuickLog, showToast } = useUI();
  const { addFood, selectedDate } = useNutrition();

  const [activeDay, setActiveDay] = useState('Wed');
  const [isGenerating, setIsGenerating] = useState(false);

  const days = [
    { label: 'Mon', date: 'Oct 22' },
    { label: 'Tue', date: 'Oct 23' },
    { label: 'Wed', date: 'Oct 24', isToday: true },
    { label: 'Thu', date: 'Oct 25' },
    { label: 'Fri', date: 'Oct 26' },
    { label: 'Sat', date: 'Oct 27' },
    { label: 'Sun', date: 'Oct 28' },
  ];

  const dayMeals: DayMeal[] = [
    {
      type: 'Breakfast',
      title: 'Spinach & Egg White Scramble + Avocado',
      kcal: 430,
      protein: '38g',
      carbs: '12g',
      fat: '22g',
      time: '15m',
    },
    {
      type: 'Lunch',
      title: 'Mediterranean Herb Chicken & Quinoa',
      kcal: 580,
      protein: '52g',
      carbs: '48g',
      fat: '14g',
      time: '20m',
    },
    {
      type: 'Afternoon Snack',
      title: 'Greek Yogurt 0% + Walnuts & Blueberries',
      kcal: 260,
      protein: '22g',
      carbs: '18g',
      fat: '8g',
      time: '5m',
    },
    {
      type: 'Dinner',
      title: 'Wild Alaskan Salmon & Roasted Asparagus',
      kcal: 620,
      protein: '46g',
      carbs: '14g',
      fat: '32g',
      time: '25m',
    },
  ];

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('AI synthesized 7-day personalized meal plan! 🥗', 'success');
    }, 1200);
  };

  const handleLogMeal = (meal: DayMeal) => {
    const mealKeyMap: Record<string, 'breakfast' | 'lunch' | 'dinner' | 'snack'> = {
      Breakfast: 'breakfast',
      Lunch: 'lunch',
      Dinner: 'dinner',
      'Afternoon Snack': 'snack',
    };
    const mealKey = mealKeyMap[meal.type] || 'lunch';

    addFood(
      {
        name: meal.title,
        portion: '1 serving',
        calories: meal.kcal,
        protein: parseFloat(meal.protein),
        carbs: parseFloat(meal.carbs),
        fat: parseFloat(meal.fat),
        fiber: 5,
        category: 'Meal',
      },
      mealKey,
      1,
      selectedDate
    );
    showToast(`Logged "${meal.title}" to ${meal.type}! 🥑`, 'success');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Meal Planner"
        emoji="📅"
        subtitle="Weekly high-protein and nutrient dense meal schedule customized to your macros."
        rightAction={
          <Badge variant="amber" dot>
            Week 43 Active
          </Badge>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Actions Bar */}
        <View style={styles.actionRow}>
          <Button
            variant="outline"
            size="sm"
            style={styles.actionButton}
            leftIcon={<ShoppingCart size={16} color={colors.surface[700]} />}
            onPress={() => navigation.navigate('Grocery')}
          >
            Grocery List
          </Button>
          <Button
            variant="primary"
            size="sm"
            style={styles.actionButton}
            isLoading={isGenerating}
            leftIcon={<Sparkles size={16} color={colors.white} />}
            onPress={handleGenerateAI}
          >
            Generate AI Plan
          </Button>
        </View>

        {/* Day Selector Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScroll}
          style={styles.daysContainer}
        >
          {days.map((d) => {
            const isSelected = activeDay === d.label;
            return (
              <TouchableOpacity
                key={d.label}
                activeOpacity={0.7}
                onPress={() => setActiveDay(d.label)}
                style={[
                  styles.dayTab,
                  isSelected ? styles.dayTabSelected : styles.dayTabDefault,
                ]}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    isSelected ? styles.dayLabelSelected : styles.dayLabelDefault,
                  ]}
                >
                  {d.label}
                </Text>
                <Text
                  style={[
                    styles.dayDate,
                    isSelected ? styles.dayDateSelected : styles.dayDateDefault,
                  ]}
                >
                  {d.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Daily Planned Totals Summary Banner */}
        <View style={styles.totalsBanner}>
          <View style={styles.totalStat}>
            <Text style={styles.totalStatValue}>1,890</Text>
            <Text style={styles.totalStatLabel}>kcal Total</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalStat}>
            <Text style={[styles.totalStatValue, { color: colors.nutrition.protein }]}>
              158g
            </Text>
            <Text style={styles.totalStatLabel}>Protein</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalStat}>
            <Text style={[styles.totalStatValue, { color: colors.nutrition.carbs }]}>
              92g
            </Text>
            <Text style={styles.totalStatLabel}>Carbs</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalStat}>
            <Text style={[styles.totalStatValue, { color: colors.nutrition.fat }]}>
              76g
            </Text>
            <Text style={styles.totalStatLabel}>Fat</Text>
          </View>
        </View>

        {/* Day's Meals List */}
        <View style={styles.mealsList}>
          {dayMeals.map((meal, idx) => (
            <Card key={idx} style={styles.mealCard}>
              <View style={styles.mealHeaderRow}>
                <View style={styles.mealTypeBadgeRow}>
                  <View style={styles.typeIconContainer}>
                    <Text style={styles.typeInitial}>{meal.type[0]}</Text>
                  </View>
                  <View>
                    <View style={styles.badgeLine}>
                      <Text style={styles.mealType}>{meal.type}</Text>
                      <Badge variant="slate" size="sm">
                        {meal.time}
                      </Badge>
                    </View>
                    <Text style={styles.mealTitle}>{meal.title}</Text>
                  </View>
                </View>
              </View>

              {/* Macro Bar */}
              <View style={styles.mealFooterRow}>
                <View style={styles.macroPills}>
                  <View style={styles.macroPill}>
                    <Text style={styles.macroPillValue}>{meal.kcal} kcal</Text>
                  </View>
                  <View style={[styles.macroPill, { backgroundColor: colors.emerald[50] }]}>
                    <Text style={[styles.macroPillValue, { color: colors.nutrition.protein }]}>
                      {meal.protein} P
                    </Text>
                  </View>
                  <View style={[styles.macroPill, { backgroundColor: colors.amber[50] }]}>
                    <Text style={[styles.macroPillValue, { color: colors.nutrition.carbs }]}>
                      {meal.carbs} C
                    </Text>
                  </View>
                  <View style={[styles.macroPill, { backgroundColor: colors.purple[50] }]}>
                    <Text style={[styles.macroPillValue, { color: colors.nutrition.fat }]}>
                      {meal.fat} F
                    </Text>
                  </View>
                </View>

                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<Plus size={14} color={colors.brand.primary} />}
                  onPress={() => handleLogMeal(meal)}
                >
                  Log
                </Button>
              </View>
            </Card>
          ))}
        </View>

        <View style={{ height: spacing[12] }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  scrollContent: {
    padding: spacing[4],
    gap: spacing[4],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actionButton: {
    flex: 1,
  },
  daysContainer: {
    backgroundColor: colors.white,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.xs,
  },
  daysScroll: {
    padding: spacing[2],
    gap: spacing[1.5],
  },
  dayTab: {
    minWidth: 64,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTabSelected: {
    backgroundColor: colors.brand.primary,
    ...shadows.xs,
  },
  dayTabDefault: {
    backgroundColor: colors.surface[50],
  },
  dayLabel: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
  },
  dayLabelSelected: {
    color: colors.white,
  },
  dayLabelDefault: {
    color: colors.surface[700],
  },
  dayDate: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    marginTop: 2,
  },
  dayDateSelected: {
    color: colors.emerald[100],
  },
  dayDateDefault: {
    color: colors.surface[400],
  },
  totalsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.xs,
  },
  totalStat: {
    alignItems: 'center',
    flex: 1,
  },
  totalStatValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  totalStatLabel: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
    marginTop: 1,
  },
  totalDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.surface[200],
  },
  mealsList: {
    gap: spacing[3],
  },
  mealCard: {
    padding: spacing[4],
  },
  mealHeaderRow: {
    marginBottom: spacing[3],
  },
  mealTypeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  typeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: radii.lg,
    backgroundColor: colors.emerald[50],
    borderWidth: 1,
    borderColor: colors.emerald[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeInitial: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.brand.primary,
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  mealType: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
    marginTop: 2,
    maxWidth: 240,
  },
  mealFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.surface[100],
    paddingTop: spacing[2.5],
  },
  macroPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  macroPill: {
    backgroundColor: colors.surface[100],
    paddingVertical: 2,
    paddingHorizontal: spacing[2],
    borderRadius: radii.full,
  },
  macroPillValue: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[700],
  },
});
