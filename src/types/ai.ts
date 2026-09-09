/**
 * AI Intelligence Layer Types (Vision Scanner, Workout Programming, Health Insights)
 */

export interface AIScanResult {
  id: string;
  name: string;
  confidence: number;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
  microNotes: string;
}

export interface AIMessage {
  id: number | string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  recommendation?: {
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
}

export interface AIHealthInsight {
  id: string;
  category: 'nutrition' | 'recovery' | 'training' | 'metabolism';
  title: string;
  summary: string;
  impactScore: 'positive' | 'warning' | 'neutral';
  actionPrompt?: string;
  generatedAt: string;
}
