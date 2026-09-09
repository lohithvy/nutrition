/**
 * Vitalis / NutriFlow - Supabase Nutrition Service
 * Food catalog, meal logging (food_logs), recipes & nutrition calculations
 */

import { supabase } from '../supabase';
import { DailyLog, FoodItem, LoggedFoodItem, MealType, Recipe } from '../../types/nutrition';
import { foodDatabase, prebuiltRecipes } from '../../data/foodDatabase';

export interface DbFoodLog {
  id: string;
  user_id: string;
  food_id?: string | null;
  date: string;
  meal_type: MealType;
  food_name: string;
  portion?: string | null;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category?: string | null;
  logged_at: string;
  created_at: string;
  updated_at: string;
}

export interface NewFoodLogInput {
  foodId?: string;
  date: string;
  mealType: MealType;
  foodName: string;
  portion?: string;
  quantity?: number;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  category?: string;
}

const isValidUuid = (id?: string | null): boolean => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export const nutritionService = {
  /**
   * Fetch all food logs for a given user & date
   */
  async getFoodLogs(userId: string, date: string): Promise<{ data: DbFoodLog[]; error: any }> {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .order('logged_at', { ascending: false });

      if (error) return { data: [], error };
      return { data: (data as DbFoodLog[]) || [], error: null };
    } catch (err) {
      return { data: [], error: err };
    }
  },

  /**
   * Add a new food log entry in public.food_logs
   */
  async addFoodLog(userId: string, input: NewFoodLogInput): Promise<{ data: DbFoodLog | null; error: any }> {
    try {
      const qty = input.quantity ?? 1;
      const { data, error } = await supabase
        .from('food_logs')
        .insert({
          user_id: userId,
          food_id: input.foodId || null,
          date: input.date,
          meal_type: input.mealType,
          food_name: input.foodName,
          portion: input.portion || '1 serving',
          quantity: qty,
          calories: input.calories,
          protein: input.protein ?? 0,
          carbs: input.carbs ?? 0,
          fat: input.fat ?? 0,
          fiber: input.fiber ?? 0,
          category: input.category || 'General',
          logged_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) return { data: null, error };
      return { data: data as DbFoodLog, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Update food log quantity
   */
  async updateFoodLogQuantity(userId: string, logId: string, quantity: number): Promise<{ data: DbFoodLog | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .update({
          quantity: Math.max(0.25, quantity),
          updated_at: new Date().toISOString(),
        })
        .eq('id', logId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) return { data: null, error };
      return { data: data as DbFoodLog, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Delete a food log entry
   */
  async deleteFoodLog(userId: string, logId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('food_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', userId);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Search foods database from Supabase public.foods (System foods + user custom foods)
   */
  async searchFoodDatabase(
    query?: string,
    category?: string,
    limit: number = 40,
    userId?: string | null
  ): Promise<{ data: FoodItem[]; error: any }> {
    try {
      let queryBuilder = supabase
        .from('foods')
        .select('id, name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber, is_favorite');

      if (isValidUuid(userId)) {
        queryBuilder = queryBuilder.or(`user_id.is.null,user_id.eq.${userId}`);
      } else {
        queryBuilder = queryBuilder.is('user_id', null);
      }

      const q = query ? query.trim() : '';
      if (q) {
        queryBuilder = queryBuilder.ilike('name', `%${q}%`);
      }

      if (category && category !== 'All') {
        queryBuilder = queryBuilder.ilike('category', `%${category.trim()}%`);
      }

      queryBuilder = queryBuilder.order('name', { ascending: true }).limit(limit);

      const { data, error } = await queryBuilder;

      if (error) {
        console.warn('Error fetching foods from Supabase, using local fallback:', error);
        // Fallback to local dataset if offline
        const fallback = foodDatabase.filter((f: FoodItem) => {
          const matchQuery = !q || f.name.toLowerCase().includes(q.toLowerCase()) || f.category.toLowerCase().includes(q.toLowerCase());
          const matchCat = !category || category === 'All' || f.category === category;
          return matchQuery && matchCat;
        });
        return { data: fallback, error };
      }

      const mapped: FoodItem[] = (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        portion: row.portion_description || '100g serving',
        baseAmount: Number(row.base_amount || 100),
        baseUnit: row.base_unit || 'g',
        calories: Number(row.calories || 0),
        protein: Number(row.protein || 0),
        carbs: Number(row.carbs || 0),
        fat: Number(row.fat || 0),
        fiber: Number(row.fiber || 0),
        favorite: Boolean(row.is_favorite),
      }));

      return { data: mapped, error: null };
    } catch (err) {
      console.warn('Exception during searchFoodDatabase:', err);
      return { data: foodDatabase, error: err };
    }
  },

  /**
   * Get list of food categories
   */
  async getFoodCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('category')
        .is('user_id', null)
        .limit(300);

      if (!error && data && data.length > 0) {
        const uniqueCats = Array.from(
          new Set(data.map((r: any) => r.category).filter(Boolean))
        ).sort();
        return ['All', ...uniqueCats];
      }
    } catch (e) {
      // ignore
    }
    return [
      'All',
      'Chicken, whole pieces',
      'Fish',
      'Beef, excludes ground',
      'Ground beef',
      'Turkey, duck, other poultry',
      'Shellfish',
      'Eggs and omelets',
      'Cheese',
      'Yogurt, regular',
      'Yogurt, Greek',
      'Milk, whole',
      'Milk, reduced fat',
      'Milk, lowfat',
      'Milk, nonfat',
      'Plant-based milk',
      'Cold cuts and cured meats',
      'Pork',
      'Sausages',
      'Bacon',
      'Dips, gravies, other sauces',
      'Ice cream and frozen dairy desserts',
    ];
  },


  /**
   * Recipes catalog
   */
  async getRecipes(): Promise<Recipe[]> {
    return prebuiltRecipes;
  },

  async saveRecipe(recipe: Recipe) {
    // Optional persistence
  },

  async deleteRecipe(recipeId: string) {
    // Optional deletion
  },
};

export default nutritionService;
