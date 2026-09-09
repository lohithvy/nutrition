/**
 * NutriFlow RecipesScreen
 * Ported 1:1 from RecipesPage.jsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChefHat,
  Plus,
  Sparkles,
  Search,
  Clock,
  Check,
  Edit2,
  Trash2,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { Recipe } from '../../types/nutrition';
import { formatDateDisplay } from '../../utils/date';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../../types/navigation';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'High Protein',
  'High Fiber',
  'Low Calorie',
  'Vegetarian',
  'Quick & Easy',
];

export function RecipesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<NutritionStackParamList>>();
  const { showToast } = useUI();
  const {
    customRecipes,
    prebuiltRecipes,
    deleteRecipe,
    addFood,
    selectedDate,
  } = useNutrition();

  const [activeSourceTab, setActiveSourceTab] = useState<'prebuilt' | 'custom'>('prebuilt');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedRecipes, setLoggedRecipes] = useState<Record<string, boolean>>({});

  const activeCatalog = activeSourceTab === 'prebuilt' ? prebuiltRecipes : customRecipes;

  const filteredRecipes = activeCatalog.filter((recipe) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      recipe.category === selectedCategory ||
      (recipe.tags && recipe.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()));

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName = recipe.name?.toLowerCase().includes(query);
    const matchesDesc = recipe.description?.toLowerCase().includes(query);
    const matchesIngredients = recipe.ingredients?.some((ing) =>
      ing.foodName?.toLowerCase().includes(query)
    );
    const matchesTags = recipe.tags?.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && (matchesName || matchesDesc || matchesIngredients || matchesTags);
  });

  const handleQuickLog = (recipe: Recipe) => {
    const nut = recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    addFood(
      {
        name: recipe.name,
        portion: `1 serving (${recipe.name})`,
        calories: nut.calories || 0,
        protein: nut.protein || 0,
        carbs: nut.carbs || 0,
        fat: nut.fat || 0,
        fiber: nut.fiber || 0,
        category: recipe.category || 'Recipes',
      },
      'dinner',
      1,
      selectedDate
    );

    setLoggedRecipes((prev) => ({ ...prev, [recipe.id]: true }));
    showToast(`Logged "${recipe.name}" (1 serving) to Dinner! 🥗`);

    setTimeout(() => {
      setLoggedRecipes((prev) => ({ ...prev, [recipe.id]: false }));
    }, 1600);
  };

  const handleDeleteCustom = (recipe: Recipe) => {
    Alert.alert('Delete Recipe', `Are you sure you want to delete "${recipe.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteRecipe(recipe.id);
          showToast(`Deleted "${recipe.name}" from your custom recipes`, 'info');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Nutrient Recipes"
          emoji="🥗"
          subtitle={`Chef recipes or custom engineered meals for ${formatDateDisplay(selectedDate)}.`}
          actions={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} color="#FFF" />}
              onPress={() => navigation.navigate('RecipeBuilder', {})}
            >
              Create Recipe
            </Button>
          }
        />

        {/* Top Controls: Source switcher */}
        <View style={styles.topControlsCard}>
          <View style={styles.sourceSwitcherRow}>
            <TouchableOpacity
              onPress={() => {
                setActiveSourceTab('prebuilt');
                setSelectedCategory('All');
              }}
              style={[styles.sourceTabBtn, activeSourceTab === 'prebuilt' && styles.sourceTabActive]}
            >
              <Sparkles size={14} color={activeSourceTab === 'prebuilt' ? colors.brand.primary : colors.surface[500]} />
              <Text style={[styles.sourceTabText, activeSourceTab === 'prebuilt' && styles.sourceTabTextActive]}>
                Catalog ({prebuiltRecipes.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setActiveSourceTab('custom');
                setSelectedCategory('All');
              }}
              style={[styles.sourceTabBtn, activeSourceTab === 'custom' && styles.sourceTabActive]}
            >
              <ChefHat size={14} color={activeSourceTab === 'custom' ? colors.status.purple : colors.surface[500]} />
              <Text style={[styles.sourceTabText, activeSourceTab === 'custom' && styles.sourceTabTextActive]}>
                My Recipes ({customRecipes.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Search size={15} color={colors.surface[400]} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search recipes, ingredients, tags..."
              placeholderTextColor={colors.surface[400]}
              style={styles.searchInput}
              autoCapitalize="none"
            />
          </View>

          {/* Category Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryPillsRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[styles.catPill, isSelected && styles.catPillSelected]}
                >
                  <Text style={[styles.catPillText, isSelected && styles.catPillTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Recipes List / Grid */}
        {filteredRecipes.length === 0 ? (
          activeSourceTab === 'custom' && customRecipes.length === 0 ? (
            <EmptyState
              icon={<ChefHat size={28} color={colors.status.purple} />}
              title="No Custom Recipes Yet"
              description="Build your own signature meals with automatic live calorie and macronutrient computation."
              action={
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Plus size={16} color="#FFF" />}
                  onPress={() => navigation.navigate('RecipeBuilder', {})}
                >
                  Create Your First Recipe
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="No Recipes Found"
              description={`No recipes match your filter "${selectedCategory}".`}
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </Button>
              }
            />
          )
        ) : (
          <View style={styles.recipeList}>
            {filteredRecipes.map((recipe) => {
              const isLogged = !!loggedRecipes[recipe.id];
              const nut = recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 };

              return (
                <Card
                  key={recipe.id}
                  onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, recipe })}
                >
                  {/* Hero Image */}
                  <View style={styles.recipeImgWrapper}>
                    <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                    <View style={styles.imgBadgesTop}>
                      <Badge variant="emerald" size="sm">
                        {recipe.difficulty}
                      </Badge>
                      <Badge variant="dark" size="sm">
                        {recipe.category}
                      </Badge>
                      {recipe.isCustom && (
                        <Badge variant="purple" size="sm">
                          My Recipe
                        </Badge>
                      )}
                    </View>
                    <View style={styles.timeBadgeBottom}>
                      <Badge variant="slate" size="sm" leftIcon={<Clock size={11} color={colors.brand.primary} />}>
                        {recipe.totalTime || recipe.prepTime}
                      </Badge>
                    </View>
                  </View>

                  {/* Body Content */}
                  <View style={styles.recipeBody}>
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                    <Text style={styles.recipeDesc} numberOfLines={2}>
                      {recipe.description}
                    </Text>

                    {/* 4-Macro Grid */}
                    <View style={styles.macroGrid}>
                      <View style={styles.macroCol}>
                        <Text style={styles.macroVal}>{nut.calories}</Text>
                        <Text style={styles.macroLabel}>kcal</Text>
                      </View>
                      <View style={styles.macroCol}>
                        <Text style={[styles.macroVal, { color: colors.nutri.protein }]}>{nut.protein}g</Text>
                        <Text style={styles.macroLabel}>Protein</Text>
                      </View>
                      <View style={styles.macroCol}>
                        <Text style={[styles.macroVal, { color: colors.nutri.carbs }]}>{nut.carbs}g</Text>
                        <Text style={styles.macroLabel}>Carbs</Text>
                      </View>
                      <View style={styles.macroCol}>
                        <Text style={[styles.macroVal, { color: colors.nutri.fat }]}>{nut.fat}g</Text>
                        <Text style={styles.macroLabel}>Fat</Text>
                      </View>
                    </View>

                    {/* Ingredients count preview */}
                    <Text style={styles.ingPreviewText}>
                      {recipe.ingredients?.length || 0} ingredients • {recipe.servings} serving(s)
                    </Text>

                    {/* Actions */}
                    <View style={styles.recipeActionRow}>
                      <Button
                        variant={isLogged ? 'primary' : 'outline'}
                        size="sm"
                        onPress={() => handleQuickLog(recipe)}
                        leftIcon={isLogged ? <Check size={14} color="#FFF" /> : <Plus size={14} color={colors.brand.primary} />}
                        style={{ flex: 1 }}
                      >
                        {isLogged ? 'Logged!' : 'Log to Diary'}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, recipe })}
                      >
                        View
                      </Button>
                    </View>

                    {/* Custom recipe edit/delete */}
                    {recipe.isCustom && (
                      <View style={styles.customEditRow}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('RecipeBuilder', { initialRecipe: recipe })}
                          style={styles.editBtn}
                        >
                          <Edit2 size={13} color={colors.surface[600]} />
                          <Text style={styles.editBtnText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteCustom(recipe)}
                          style={styles.editBtn}
                        >
                          <Trash2 size={13} color={colors.status.error} />
                          <Text style={[styles.editBtnText, { color: colors.status.error }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
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
  topControlsCard: {
    backgroundColor: colors.surface.white,
    padding: spacing.md,
    borderRadius: radii['2xl'],
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.subtle,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sourceSwitcherRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface[100],
    borderRadius: radii.xl,
    padding: 3,
  },
  sourceTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: radii.lg,
  },
  sourceTabActive: {
    backgroundColor: colors.surface.white,
    ...shadows.subtle,
  },
  sourceTabText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.surface[600],
  },
  sourceTabTextActive: {
    color: colors.surface[900],
    fontWeight: typography.weight.bold,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface[50],
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.surface[200],
    paddingHorizontal: spacing.sm,
    height: 40,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.surface[900],
  },
  categoryPillsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  catPill: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radii.md,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  catPillSelected: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  catPillText: {
    fontSize: typography.size['2xs'],
    fontWeight: typography.weight.semibold,
    color: colors.surface[600],
  },
  catPillTextSelected: {
    color: colors.surface.white,
    fontWeight: typography.weight.bold,
  },
  recipeList: {
    gap: spacing.md,
  },
  recipeImgWrapper: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.surface[200],
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  imgBadgesTop: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  timeBadgeBottom: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  recipeBody: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  recipeName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  recipeDesc: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    lineHeight: 16,
  },
  macroGrid: {
    flexDirection: 'row',
    backgroundColor: colors.surface[50],
    borderRadius: radii.lg,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.surface[150],
    marginVertical: 4,
  },
  macroCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  macroVal: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
  },
  macroLabel: {
    fontSize: typography.size['2xs'],
    color: colors.surface[400],
    marginTop: 1,
  },
  ingPreviewText: {
    fontSize: typography.size['2xs'],
    color: colors.surface[400],
  },
  recipeActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  customEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.md,
    paddingTop: spacing.xs,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.surface[100],
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  editBtnText: {
    fontSize: typography.size['2xs'],
    color: colors.surface[600],
    fontWeight: typography.weight.semibold,
  },
});
