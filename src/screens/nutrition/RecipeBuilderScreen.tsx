/**
 * NutriFlow RecipeBuilderScreen
 * Engineer custom recipes with live verified ingredient search and auto-macro calculation engine
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChefHat,
  Sparkles,
  Check,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useNutrition } from '../../context/NutritionContext';
import { useUI } from '../../context/UIContext';
import { foodDatabase, calculateRecipeNutrition } from '../../data/foodDatabase';
import { RecipeIngredient, RecipeInstruction, Recipe } from '../../types/nutrition';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NutritionStackParamList } from '../../types/navigation';

export function RecipeBuilderScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<NutritionStackParamList, 'RecipeBuilder'>>();
  const { createRecipe, updateRecipe } = useNutrition();
  const { showToast } = useUI();

  const initialRecipe = route.params?.initialRecipe;

  const [name, setName] = useState(initialRecipe?.name || '');
  const [description, setDescription] = useState(initialRecipe?.description || '');
  const [category, setCategory] = useState(initialRecipe?.category || 'High Protein');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(initialRecipe?.difficulty || 'Easy');
  const [servings, setServings] = useState(String(initialRecipe?.servings || 2));
  const [prepTime, setPrepTime] = useState(initialRecipe?.prepTime || '10 min');
  const [cookTime, setCookTime] = useState(initialRecipe?.cookTime || '15 min');

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(
    initialRecipe?.ingredients || [
      { foodId: 'food-chicken-breast', foodName: 'Grilled Chicken Breast', quantity: 200, unit: 'g' },
      { foodId: 'food-brown-rice', foodName: 'Brown Basmati Rice (Cooked)', quantity: 150, unit: 'g' },
    ]
  );

  const [instructions, setInstructions] = useState<RecipeInstruction[]>(
    initialRecipe?.instructions || [
      { step: 1, title: 'Prep Ingredients', text: 'Wash and slice all ingredients cleanly.' },
      { step: 2, title: 'Cook & Combine', text: 'Sear protein and combine with cooked grains.' },
    ]
  );

  // New ingredient form
  const [selectedFoodId, setSelectedFoodId] = useState(foodDatabase[0].id);
  const [newIngQty, setNewIngQty] = useState('100');
  const [newStepText, setNewStepText] = useState('');

  // Live Auto-computed nutrition
  const { total, perServing } = calculateRecipeNutrition(ingredients, Number(servings) || 1);

  const handleAddIngredient = () => {
    const food = foodDatabase.find((f) => f.id === selectedFoodId);
    if (!food) return;

    const newIng: RecipeIngredient = {
      foodId: food.id,
      foodName: food.name,
      quantity: Number(newIngQty) || 100,
      unit: food.baseUnit || 'g',
    };

    setIngredients((prev) => [...prev, newIng]);
    showToast(`Added ${newIng.quantity}${newIng.unit} ${food.name}! 🥗`);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    if (!newStepText.trim()) return;
    const newStep: RecipeInstruction = {
      step: instructions.length + 1,
      title: `Step ${instructions.length + 1}`,
      text: newStepText.trim(),
    };
    setInstructions((prev) => [...prev, newStep]);
    setNewStepText('');
  };

  const handleRemoveInstruction = (index: number) => {
    const updated = instructions
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, step: idx + 1, title: `Step ${idx + 1}` }));
    setInstructions(updated);
  };

  const handleSaveRecipe = () => {
    if (!name.trim()) {
      showToast('Please enter a recipe name', 'warning');
      return;
    }

    if (ingredients.length === 0) {
      showToast('Please add at least 1 ingredient', 'warning');
      return;
    }

    if (initialRecipe?.id) {
      updateRecipe(initialRecipe.id, {
        name,
        description,
        category,
        difficulty,
        servings: Number(servings) || 1,
        prepTime,
        cookTime,
        ingredients,
        instructions,
      });
      showToast(`Updated "${name}"! ✨`);
    } else {
      createRecipe({
        name,
        description,
        category,
        difficulty,
        servings: Number(servings) || 1,
        prepTime,
        cookTime,
        ingredients,
        instructions,
      });
      showToast(`Created custom recipe "${name}"! 🥗`);
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.surface[700]} />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>
          {initialRecipe ? 'Edit Recipe' : 'Recipe Builder'}
        </Text>
        <Button
          variant="primary"
          size="sm"
          onPress={handleSaveRecipe}
          leftIcon={<Check size={14} color="#FFF" />}
        >
          Save
        </Button>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Live Macro Computation Card */}
        <Card variant="emerald">
          <CardHeader
            title="Live Macro Computation Engine"
            badge={<Badge variant="emerald">Auto Scaled</Badge>}
            icon={<Sparkles size={18} color={colors.brand.primary} />}
          />
          <CardContent>
            <Text style={styles.macroSubtitle}>Per Serving ({servings} servings total):</Text>
            <View style={styles.liveMacroRow}>
              <View style={styles.liveMacroCol}>
                <Text style={styles.liveMacroNum}>{perServing.calories}</Text>
                <Text style={styles.liveMacroLabel}>kcal</Text>
              </View>
              <View style={styles.liveMacroCol}>
                <Text style={[styles.liveMacroNum, { color: colors.nutri.protein }]}>
                  {perServing.protein}g
                </Text>
                <Text style={styles.liveMacroLabel}>Protein</Text>
              </View>
              <View style={styles.liveMacroCol}>
                <Text style={[styles.liveMacroNum, { color: colors.nutri.carbs }]}>
                  {perServing.carbs}g
                </Text>
                <Text style={styles.liveMacroLabel}>Carbs</Text>
              </View>
              <View style={styles.liveMacroCol}>
                <Text style={[styles.liveMacroNum, { color: colors.nutri.fat }]}>
                  {perServing.fat}g
                </Text>
                <Text style={styles.liveMacroLabel}>Fat</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Recipe Basic Details */}
        <Card>
          <CardHeader title="Recipe Information" />
          <CardContent>
            <Input label="Recipe Title" value={name} onChangeText={setName} placeholder="e.g. Lemon Herb Salmon Bowl" />
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Flavor notes, diet profile, meal prep tips..."
              multiline
            />

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <Input
                  label="Servings Yield"
                  value={servings}
                  onChangeText={setServings}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formCol}>
                <Input label="Prep Time" value={prepTime} onChangeText={setPrepTime} />
              </View>
              <View style={styles.formCol}>
                <Input label="Cook Time" value={cookTime} onChangeText={setCookTime} />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Ingredient Formulation */}
        <Card>
          <CardHeader
            title={`Ingredients (${ingredients.length})`}
            icon={<ChefHat size={16} color={colors.brand.primary} />}
          />
          <CardContent>
            {/* Added Ingredients List */}
            <View style={styles.ingList}>
              {ingredients.map((ing, idx) => (
                <View key={idx} style={styles.ingItemRow}>
                  <View style={styles.ingItemInfo}>
                    <Text style={styles.ingItemName}>{ing.foodName}</Text>
                    <Text style={styles.ingItemQty}>
                      {ing.quantity} {ing.unit}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveIngredient(idx)}
                    style={styles.delIngBtn}
                  >
                    <Trash2 size={15} color={colors.status.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Add ingredient controls */}
            <View style={styles.addIngBox}>
              <Text style={styles.addIngLabel}>Add Food Item from Database</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.foodPickerScroll}
              >
                {foodDatabase.slice(0, 10).map((f) => (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => setSelectedFoodId(f.id)}
                    style={[
                      styles.foodPickerPill,
                      selectedFoodId === f.id && styles.foodPickerPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.foodPickerText,
                        selectedFoodId === f.id && styles.foodPickerTextActive,
                      ]}
                    >
                      {f.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.ingQtyRow}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Amount (g/units)"
                    value={newIngQty}
                    onChangeText={setNewIngQty}
                    keyboardType="numeric"
                    containerStyle={{ marginBottom: 0 }}
                  />
                </View>
                <Button
                  variant="primary"
                  size="md"
                  onPress={handleAddIngredient}
                  leftIcon={<Plus size={16} color="#FFF" />}
                  style={{ alignSelf: 'flex-end', height: 42 }}
                >
                  + Add
                </Button>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Step-by-Step Instructions */}
        <Card>
          <CardHeader title="Cooking Instructions" />
          <CardContent>
            <View style={styles.stepsList}>
              {instructions.map((st, idx) => (
                <View key={idx} style={styles.stepItemRow}>
                  <View style={styles.stepNumCircle}>
                    <Text style={styles.stepNumText}>{st.step}</Text>
                  </View>
                  <Text style={styles.stepText}>{st.text}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveInstruction(idx)}
                    style={styles.delStepBtn}
                  >
                    <Trash2 size={14} color={colors.surface[400]} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Add step input */}
            <View style={styles.addStepBox}>
              <Input
                label="New Step"
                value={newStepText}
                onChangeText={setNewStepText}
                placeholder="e.g. Sauté garlic until fragrant..."
                containerStyle={{ marginBottom: spacing.xs }}
              />
              <Button
                variant="outline"
                size="sm"
                onPress={handleAddInstruction}
                leftIcon={<Plus size={14} color={colors.brand.primary} />}
              >
                Add Step
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Save button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleSaveRecipe}
          leftIcon={<Check size={18} color="#FFF" />}
          fullWidth
        >
          {initialRecipe ? 'Update Recipe' : 'Save & Publish Recipe'}
        </Button>
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
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 40,
    gap: spacing.md,
  },
  macroSubtitle: {
    fontSize: typography.size.xs,
    color: colors.brand[800],
    fontWeight: typography.weight.medium,
    marginBottom: spacing.xs,
  },
  liveMacroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 2,
  },
  liveMacroCol: {
    flex: 1,
    backgroundColor: colors.surface.white,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.brand[200],
    alignItems: 'center',
  },
  liveMacroNum: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
  },
  liveMacroLabel: {
    fontSize: typography.size['2xs'],
    color: colors.surface[400],
    marginTop: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  formCol: {
    flex: 1,
  },
  ingList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  ingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface[50],
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  ingItemInfo: {
    flex: 1,
  },
  ingItemName: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  ingItemQty: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
  },
  delIngBtn: {
    padding: 6,
  },
  addIngBox: {
    backgroundColor: colors.surface[50],
    padding: spacing.md,
    borderRadius: radii.xl,
    gap: spacing.xs,
  },
  addIngLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[700],
  },
  foodPickerScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: spacing.xs,
  },
  foodPickerPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.md,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  foodPickerPillActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  foodPickerText: {
    fontSize: typography.size['2xs'],
    color: colors.surface[700],
    fontWeight: typography.weight.semibold,
  },
  foodPickerTextActive: {
    color: colors.surface.white,
    fontWeight: typography.weight.bold,
  },
  ingQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  stepsList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  stepItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface[50],
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  stepNumCircle: {
    width: 20,
    height: 20,
    borderRadius: radii.full,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: typography.size['2xs'],
    fontWeight: typography.weight.bold,
    color: colors.surface.white,
  },
  stepText: {
    flex: 1,
    fontSize: typography.size.xs,
    color: colors.surface[700],
  },
  delStepBtn: {
    padding: 4,
  },
  addStepBox: {
    gap: spacing.xs,
  },
});
