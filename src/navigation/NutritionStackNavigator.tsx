import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NutritionStackParamList } from '../types/navigation';
import { DiaryScreen } from '../screens/nutrition/DiaryScreen';
import { RecipesScreen } from '../screens/nutrition/RecipesScreen';
import { RecipeDetailScreen } from '../screens/nutrition/RecipeDetailScreen';
import { RecipeBuilderScreen } from '../screens/nutrition/RecipeBuilderScreen';
import { FoodScannerScreen } from '../screens/nutrition/FoodScannerScreen';
import { BarcodeScannerScreen } from '../screens/nutrition/BarcodeScannerScreen';
import { MealPlanScreen } from '../screens/nutrition/MealPlanScreen';
import { GroceryScreen } from '../screens/nutrition/GroceryScreen';
import { AIAssistantScreen } from '../screens/nutrition/AIAssistantScreen';

const Stack = createNativeStackNavigator<NutritionStackParamList>();

export function NutritionStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Diary"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Diary" component={DiaryScreen} />
      <Stack.Screen name="Recipes" component={RecipesScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="RecipeBuilder" component={RecipeBuilderScreen} />
      <Stack.Screen name="FoodScanner" component={FoodScannerScreen} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
      <Stack.Screen name="MealPlan" component={MealPlanScreen} />
      <Stack.Screen name="Grocery" component={GroceryScreen} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
    </Stack.Navigator>
  );
}
