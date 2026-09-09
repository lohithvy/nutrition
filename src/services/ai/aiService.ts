import { FoodItem } from '../../types/nutrition';
import { UserProfile } from '../../types/user';

export interface AIMetabolicInput {
  user: UserProfile;
  loggedCalories: number;
  remainingCalories: number;
  loggedProtein: number;
  targetProtein: number;
  waterPercent: number;
  recentWorkoutType?: string;
  sleepHours?: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  actionType: 'log_food' | 'drink_water' | 'adjust_rest' | 'grocery_order';
  foodSuggestion?: Partial<FoodItem>;
  confidenceScore: number;
}

export interface AIInsight {
  category: 'glucose' | 'protein' | 'recovery' | 'micronutrient';
  title: string;
  body: string;
  severity: 'info' | 'positive' | 'warning';
}

export interface AIService {
  analyzeFoodImage(imageBase64: string): Promise<FoodItem[]>;
  generateMetabolicInsights(context: AIMetabolicInput): Promise<AIInsight[]>;
  getPersonalizedRecommendations(context: AIMetabolicInput): Promise<AIRecommendation[]>;
  chatWithNutritionAI(message: string, context: AIMetabolicInput): Promise<string>;
}

export const aiService: AIService = {
  async analyzeFoodImage(imageBase64: string) {
    // Vision AI pipeline
    return [];
  },

  async generateMetabolicInsights(context: AIMetabolicInput) {
    return [
      {
        category: 'protein',
        title: 'Optimal Protein Spacing',
        body: 'Distributing remaining protein across 2 distinct meals will elevate muscle protein synthesis.',
        severity: 'positive',
      },
      {
        category: 'glucose',
        title: 'Glycemic Index Balance',
        body: 'High dietary fiber intake today has mitigated insulin excursions post-prandial.',
        severity: 'info',
      },
    ];
  },

  async getPersonalizedRecommendations(context: AIMetabolicInput) {
    return [
      {
        id: 'rec-1',
        title: 'Pan-Seared Alaskan Salmon & Asparagus',
        description: 'Rich in EPA/DHA Omega-3s with 36g clean protein.',
        actionType: 'log_food',
        foodSuggestion: {
          name: 'Pan-Seared Alaskan Salmon & Asparagus',
          calories: 380,
          protein: 36,
          carbs: 6,
          fat: 18,
          fiber: 4,
        },
        confidenceScore: 0.98,
      },
    ];
  },

  async chatWithNutritionAI(message: string, context: AIMetabolicInput) {
    return `Based on your ${context.remainingCalories} kcal remaining budget and ${context.loggedProtein}g protein logged, prioritizing clean whole foods will optimize metabolic pacing.`;
  },
};
