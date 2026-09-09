/**
 * NutriFlow RecipeDetailScreen
 * Full recipe view with ingredients checklist, step-by-step instructions, and diary logger
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Clock,
  ChefHat,
  Users,
  Plus,
  Minus,
  Check,
  BookOpen,
  ArrowLeft,
  Sparkles,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useNutrition } from '../../context/NutritionContext';
import { useUI } from '../../context/UIContext';
import { Recipe, MealType } from '../../types/nutrition';
import { formatDateDisplay } from '../../utils/date';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NutritionStackParamList } from '../../types/navigation';

export function RecipeDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<NutritionStackParamList, 'RecipeDetail'>>();
  const { addFood, selectedDate, getRecipeById } = useNutrition();
  const { showToast } = useUI();

  const recipeParam = route.params?.recipe;
  const recipeId = route.params?.recipeId;
  const recipe: Recipe | undefined = recipeParam || (recipeId ? getRecipeById(recipeId) : undefined);

  const [servingsToLog, setServingsToLog] = useState(1);
  const [targetMeal, setTargetMeal] = useState<MealType>('dinner');
  const [isLogged, setIsLogged] = useState(false);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Recipe not found</Text>
          <Button variant="primary" size="sm" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const nutrition = recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  const scaledCalories = Math.round((nutrition.calories || 0) * servingsToLog);
  const scaledProtein = Math.round((nutrition.protein || 0) * servingsToLog * 10) / 10;
  const scaledCarbs = Math.round((nutrition.carbs || 0) * servingsToLog * 10) / 10;
  const scaledFat = Math.round((nutrition.fat || 0) * servingsToLog * 10) / 10;

  const handleAddToDiary = () => {
    addFood(
      {
        name: recipe.name,
        portion: `${servingsToLog} serving(s) (${recipe.name})`,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        fiber: nutrition.fiber || 0,
        category: recipe.category || 'Recipes',
      },
      targetMeal,
      servingsToLog,
      selectedDate
    );

    setIsLogged(true);
    showToast(`Added ${servingsToLog}x ${recipe.name} (${scaledCalories} kcal) to ${targetMeal}! 🥑`);

    setTimeout(() => {
      setIsLogged(false);
    }, 1500);
  };

  const mealOptions: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Bar with Back Button */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color={colors.surface[700]} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle} numberOfLines={1}>
          {recipe.name}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroImgBox}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />
          <View style={styles.heroBadges}>
            <Badge variant="emerald" size="sm">
              {recipe.difficulty}
            </Badge>
            <Badge variant="dark" size="sm">
              {recipe.category}
            </Badge>
          </View>
        </View>

        {/* Title & Description */}
        <View style={styles.titleSection}>
          <Text style={styles.recipeTitle}>{recipe.name}</Text>
          <Text style={styles.recipeDesc}>{recipe.description}</Text>
        </View>

        {/* Timing Highlights Grid */}
        <View style={styles.timingGrid}>
          <View style={styles.timingCol}>
            <Text style={styles.timingLabel}>Prep Time</Text>
            <View style={styles.timingValRow}>
              <Clock size={13} color={colors.brand.primary} />
              <Text style={styles.timingVal}>{recipe.prepTime}</Text>
            </View>
          </View>

          <View style={styles.timingCol}>
            <Text style={styles.timingLabel}>Cook Time</Text>
            <View style={styles.timingValRow}>
              <Clock size={13} color={colors.nutri.carbs} />
              <Text style={styles.timingVal}>{recipe.cookTime || '15 min'}</Text>
            </View>
          </View>

          <View style={styles.timingCol}>
            <Text style={styles.timingLabel}>Total Time</Text>
            <View style={styles.timingValRow}>
              <Clock size={13} color={colors.status.purple} />
              <Text style={styles.timingVal}>{recipe.totalTime || '25 min'}</Text>
            </View>
          </View>

          <View style={styles.timingCol}>
            <Text style={styles.timingLabel}>Yield</Text>
            <View style={styles.timingValRow}>
              <Users size={13} color={colors.status.info} />
              <Text style={styles.timingVal}>{recipe.servings} serving(s)</Text>
            </View>
          </View>
        </View>

        {/* Nutrition Per Serving Card */}
        <Card>
          <CardHeader
            title="Nutrition (Per Serving)"
            badge={<Badge variant="emerald" size="sm">NutriPure Verified</Badge>}
          />
          <CardContent>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutriBox}>
                <Text style={styles.nutriNum}>{nutrition.calories}</Text>
                <Text style={styles.nutriLabel}>kcal</Text>
              </View>
              <View style={styles.nutriBox}>
                <Text style={[styles.nutriNum, { color: colors.nutri.protein }]}>{nutrition.protein}g</Text>
                <Text style={styles.nutriLabel}>Protein</Text>
              </View>
              <View style={styles.nutriBox}>
                <Text style={[styles.nutriNum, { color: colors.nutri.carbs }]}>{nutrition.carbs}g</Text>
                <Text style={styles.nutriLabel}>Carbs</Text>
              </View>
              <View style={styles.nutriBox}>
                <Text style={[styles.nutriNum, { color: colors.nutri.fat }]}>{nutrition.fat}g</Text>
                <Text style={styles.nutriLabel}>Fat</Text>
              </View>
              <View style={styles.nutriBox}>
                <Text style={[styles.nutriNum, { color: colors.brand.primary }]}>{nutrition.fiber || 0}g</Text>
                <Text style={styles.nutriLabel}>Fiber</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Required Ingredients */}
        <Card>
          <CardHeader
            title={`Required Ingredients (${recipe.ingredients?.length || 0})`}
            icon={<ChefHat size={16} color={colors.brand.primary} />}
          />
          <CardContent>
            <View style={styles.ingredientsList}>
              {(recipe.ingredients || []).map((ing, idx) => (
                <View key={idx} style={styles.ingredientRow}>
                  <View style={styles.ingLeft}>
                    <View style={styles.ingDot} />
                    <Text style={styles.ingName}>{ing.foodName}</Text>
                  </View>
                  <Badge variant="slate" size="sm">
                    {ing.quantity} {ing.unit}
                  </Badge>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Cooking Instructions */}
        <Card>
          <CardHeader
            title="Step-by-Step Cooking Instructions"
            icon={<BookOpen size={16} color={colors.brand.primary} />}
          />
          <CardContent>
            <View style={styles.stepsList}>
              {(recipe.instructions || []).map((step, idx) => {
                const stepNum = step.step || idx + 1;
                const title = step.title;
                const text = step.text || (typeof step === 'string' ? step : '');

                return (
                  <View key={idx} style={styles.stepItem}>
                    <View style={styles.stepBadgeCircle}>
                      <Text style={styles.stepNumText}>{stepNum}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      {title && <Text style={styles.stepTitle}>{title}</Text>}
                      <Text style={styles.stepText}>{text}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </CardContent>
        </Card>

        {/* Add to Diary Configurator Card */}
        <View style={styles.loggerCard}>
          <View style={styles.loggerTopRow}>
            <Text style={styles.loggerTitle}>
              Log to Diary for {formatDateDisplay(selectedDate)}
            </Text>
            <Text style={styles.loggerKcalTotal}>
              {scaledCalories} kcal ({scaledProtein}g P)
            </Text>
          </View>

          {/* Meal selector pills */}
          <View style={styles.mealPillsRow}>
            {mealOptions.map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setTargetMeal(m)}
                style={[styles.mealPill, targetMeal === m && styles.mealPillActive]}
              >
                <Text style={[styles.mealPillText, targetMeal === m && styles.mealPillTextActive]}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Servings Stepper */}
          <View style={styles.servingsStepperRow}>
            <Text style={styles.servingsLabel}>Servings to Log:</Text>
            <View style={styles.servingsControl}>
              <TouchableOpacity
                onPress={() => setServingsToLog((prev) => Math.max(0.5, prev - 0.5))}
                style={styles.stepperBtn}
              >
                <Minus size={14} color={colors.surface[600]} />
              </TouchableOpacity>
              <Text style={styles.servingsText}>{servingsToLog} serving(s)</Text>
              <TouchableOpacity
                onPress={() => setServingsToLog((prev) => prev + 0.5)}
                style={styles.stepperBtn}
              >
                <Plus size={14} color={colors.surface[600]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Log Button */}
          <Button
            variant="primary"
            size="lg"
            onPress={handleAddToDiary}
            leftIcon={isLogged ? <Check size={16} color="#FFF" /> : <Plus size={16} color="#FFF" />}
            fullWidth
            style={{ marginTop: spacing.sm }}
          >
            {isLogged ? 'Added to Food Diary!' : `Log ${servingsToLog}x to ${targetMeal.toUpperCase()}`}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[200],
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.surface[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 40,
    gap: spacing.md,
  },
  heroImgBox: {
    height: 220,
    borderRadius: radii['2xl'],
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.surface[200],
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  titleSection: {
    gap: 4,
  },
  recipeTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
  },
  recipeDesc: {
    fontSize: typography.size.xs,
    color: colors.surface[600],
    lineHeight: 18,
  },
  timingGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  timingCol: {
    flex: 1,
    backgroundColor: colors.surface.white,
    padding: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    alignItems: 'center',
  },
  timingLabel: {
    fontSize: typography.size['2xs'],
    color: colors.surface[400],
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
  },
  timingValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  timingVal: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[800],
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  nutriBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: colors.surface[50],
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surface[150],
  },
  nutriNum: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
  },
  nutriLabel: {
    fontSize: typography.size['2xs'],
    color: colors.surface[400],
    marginTop: 1,
  },
  ingredientsList: {
    gap: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface[50],
  },
  ingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  ingDot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
    backgroundColor: colors.brand.primary,
  },
  ingName: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.surface[800],
  },
  stepsList: {
    gap: spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.surface[50],
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  stepBadgeCircle: {
    width: 24,
    height: 24,
    borderRadius: radii.full,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
    marginBottom: 2,
  },
  stepText: {
    fontSize: typography.size.xs,
    color: colors.surface[600],
    lineHeight: 18,
  },
  loggerCard: {
    backgroundColor: colors.brand.light,
    borderRadius: radii['2xl'],
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.brand[200],
    gap: spacing.sm,
  },
  loggerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loggerTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.brand[950],
    flex: 1,
  },
  loggerKcalTotal: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.extrabold,
    color: colors.brand.primary,
  },
  mealPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  mealPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: radii.md,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: colors.surface[200],
    alignItems: 'center',
  },
  mealPillActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  mealPillText: {
    fontSize: typography.size['2xs'],
    fontWeight: typography.weight.semibold,
    color: colors.surface[700],
  },
  mealPillTextActive: {
    color: colors.surface.white,
    fontWeight: typography.weight.bold,
  },
  servingsStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servingsLabel: {
    fontSize: typography.size.xs,
    color: colors.surface[700],
    fontWeight: typography.weight.medium,
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.surface[200],
    gap: 8,
  },
  stepperBtn: {
    padding: 2,
  },
  servingsText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  notFoundText: {
    fontSize: typography.size.md,
    color: colors.surface[500],
  },
});
