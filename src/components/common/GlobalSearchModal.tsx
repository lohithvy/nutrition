/**
 * NutriFlow GlobalSearchModal Component
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Search, ArrowRight } from 'lucide-react-native';
import { colors, radii, spacing, typography } from '../../constants/theme';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { foodDatabase, prebuiltRecipes } from '../../data/foodDatabase';
import { FoodItem, Recipe } from '../../types/nutrition';

import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';

interface GlobalSearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectFood?: (food: FoodItem) => void;
  onSelectRecipe?: (recipe: Recipe) => void;
}

export function GlobalSearchModal(props: GlobalSearchModalProps) {
  const ui = useUI();
  const nutrition = useNutrition();

  const isOpen = props.isOpen !== undefined ? props.isOpen : ui.isSearchOpen;
  const onClose = props.onClose || ui.closeSearch;
  const onSelectFood = props.onSelectFood || ((food: FoodItem) => {
    nutrition.addFood(food, 'lunch', 1, nutrition.selectedDate);
    ui.showToast(`Logged "${food.name}" to Lunch! 🥑`, 'success');
    ui.closeSearch();
  });
  const onSelectRecipe = props.onSelectRecipe || ((recipe: Recipe) => {
    ui.showToast(`Selected Recipe: "${recipe.name}"! 🍲`, 'info');
    ui.closeSearch();
  });
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredFoods = query.trim()
    ? foodDatabase.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase())
      )
    : foodDatabase.slice(0, 4);

  const filteredRecipes = query.trim()
    ? prebuiltRecipes.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      )
    : prebuiltRecipes.slice(0, 2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Global Search"
      description="Quickly search foods, verified recipes, and ingredients"
    >
      <View style={styles.container}>
        {/* Search input */}
        <View style={styles.inputBox}>
          <Search size={16} color={colors.surface[400]} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Type a food (e.g. Avocado, Salmon)..."
            placeholderTextColor={colors.surface[400]}
            style={styles.input}
            autoFocus
            autoCapitalize="none"
          />
        </View>

        {/* Foods section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Verified Foods ({filteredFoods.length})
          </Text>
          <View style={styles.list}>
            {filteredFoods.map((food) => (
              <TouchableOpacity
                key={food.id}
                onPress={() => {
                  onSelectFood(food);
                  onClose();
                }}
                style={styles.foodRow}
              >
                <View style={styles.foodLeft}>
                  <Text style={styles.foodEmoji}>🥑</Text>
                  <View>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodSub}>{food.category}</Text>
                  </View>
                </View>
                <View style={styles.foodRight}>
                  <Badge variant="amber" size="sm">
                    {food.calories} kcal
                  </Badge>
                  <Text style={styles.logText}>+ Log</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recipes section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Nutrient Recipes ({filteredRecipes.length})
          </Text>
          <View style={styles.list}>
            {filteredRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() => {
                  onSelectRecipe(recipe);
                  onClose();
                }}
                style={styles.recipeRow}
              >
                <View style={styles.recipeLeft}>
                  <Image source={{ uri: recipe.image }} style={styles.recipeImg} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle} numberOfLines={1}>
                      {recipe.name}
                    </Text>
                    <Text style={styles.recipeSub}>
                      {recipe.prepTime} • {recipe.nutrition.protein}g protein
                    </Text>
                  </View>
                </View>
                <ArrowRight size={16} color={colors.surface[400]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface[50],
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.surface[200],
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.surface[900],
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.size['2xs'],
    fontWeight: typography.weight.bold,
    color: colors.surface[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    gap: spacing.xs,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.surface[50],
  },
  foodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  foodEmoji: {
    fontSize: 18,
  },
  foodName: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  foodSub: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
  },
  foodRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.brand.primary,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.surface[50],
  },
  recipeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: spacing.sm,
  },
  recipeImg: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  recipeSub: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
  },
});
