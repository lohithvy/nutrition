/**
 * Primary mock dataset for NutriFlow
 * Matches the metrics, user profile, navigation, and structure from the visual design specification.
 */

import { DEFAULT_USER_PROFILE } from '../utils/storage';

export const mockUser = {
  ...DEFAULT_USER_PROFILE,
  streakDays: 18,
  nutriScore: 84,
  currentWeight: 68.4,
  targetWeight: 65.0,
  weightUnit: "kg",
  aiMessage: "You're right on track today! 780 kcal remaining with optimal protein pacing toward your metabolic goal."
};

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { id: 'diary', label: 'Food Diary', path: '/diary', icon: 'BookOpen' },
  { id: 'assistant', label: 'Nutri AI', path: '/assistant', icon: 'Bot' },
  { id: 'insights', label: 'Nutrition Insights', path: '/insights', icon: 'Sparkles' },
  { id: 'meal-planner', label: 'Meal Planner', path: '/meal-planner', icon: 'CalendarDays' },
  { id: 'grocery', label: 'Smart Grocery', path: '/grocery', icon: 'ShoppingCart' },
  { id: 'recipes', label: 'Recipes', path: '/recipes', icon: 'ChefHat' },
  { id: 'scanner', label: 'Food Scanner', path: '/scanner', icon: 'Camera' },
  { id: 'barcode-scanner', label: 'Barcode Scanner', path: '/barcode-scanner', icon: 'Barcode' },
];

export const secondaryNavItems = [
  { id: 'settings', label: 'Profile / Settings', path: '/settings', icon: 'Settings' },
];

export const quickLogCategories = [
  { id: 'breakfast', name: 'Breakfast', icon: 'Sunrise', calories: '430 kcal' },
  { id: 'lunch', name: 'Lunch', icon: 'Sun', calories: '580 kcal' },
  { id: 'dinner', name: 'Dinner', icon: 'Moon', calories: 'Planned' },
  { id: 'snack', name: 'Snacks & Water', icon: 'Apple', calories: '410 kcal' },
];

export const frequentFoods = [
  { id: 'f1', name: 'Greek Yogurt (0% Fat)', portion: '170g', calories: 100, protein: 18, carbs: 6, fat: 0, category: 'Dairy', favorite: true },
  { id: 'f2', name: 'Organic Rolled Oats', portion: '50g', calories: 185, protein: 6.5, carbs: 32, fat: 3.5, category: 'Grains', favorite: true },
  { id: 'f3', name: 'Grilled Chicken Breast', portion: '150g', calories: 248, protein: 46, carbs: 0, fat: 5.5, category: 'Protein', favorite: true },
  { id: 'f4', name: 'Avocado Hass (Fresh)', portion: '80g', calories: 128, protein: 1.6, carbs: 6.8, fat: 11.7, category: 'Fats', favorite: false },
  { id: 'f5', name: 'Wild Alaskan Salmon Fillet', portion: '160g', calories: 280, protein: 34, carbs: 0, fat: 15, category: 'Protein', favorite: true },
  { id: 'f6', name: 'Fresh Blueberries', portion: '100g', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, category: 'Fruit', favorite: false },
  { id: 'f7', name: 'Almond Butter (Raw)', portion: '32g', calories: 196, protein: 7, carbs: 6, fat: 18, category: 'Fats', favorite: true },
  { id: 'f8', name: 'Quinoa Grain (Cooked)', portion: '185g', calories: 222, protein: 8.1, carbs: 39.4, fat: 3.6, category: 'Grains', favorite: false },
];

export const mockNotifications = [
  { id: 'n1', title: 'Metabolic Goal Reached', description: 'Optimal protein pacing achieved for your morning metabolic window.', time: '20m ago', unread: true, type: 'success' },
  { id: 'n2', title: 'Hydration Reminder', description: 'You are 700ml away from your cellular hydration target.', time: '1h ago', unread: true, type: 'info' },
  { id: 'n3', title: 'AI Meal Suggestion Ready', description: 'Chef AI created 3 nutrient-dense dinner recipes for your remaining macros.', time: '3h ago', unread: false, type: 'ai' },
];

export const mockRecipes = [
  {
    id: 'r1',
    title: 'Chicken & Avocado Healthy Bowl',
    category: 'High Protein',
    time: '20 min',
    calories: 480,
    protein: 42,
    carbs: 35,
    fat: 16,
    tags: ['High Protein', 'Gluten Free'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    description: 'Tender seasoned chicken breast with fresh avocado, quinoa, and a light lemon tahini dressing.'
  },
  {
    id: 'r2',
    title: 'Grilled Salmon Sheet Pan with Veggies',
    category: 'Omega-3 Rich',
    time: '25 min',
    calories: 520,
    protein: 38,
    carbs: 22,
    fat: 26,
    tags: ['Keto Friendly', 'Omega-3'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80',
    description: 'Wild Alaskan salmon roasted with asparagus, bell peppers, and fresh rosemary olive oil.'
  },
  {
    id: 'r3',
    title: 'Greek Berry Superfood Parfait',
    category: 'Quick Prep',
    time: '5 min',
    calories: 280,
    protein: 24,
    carbs: 30,
    fat: 4,
    tags: ['Vegetarian', 'Quick Prep'],
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80',
    description: 'Creamy zero-fat Greek yogurt layered with organic berries, raw chia seeds, and honey drizzle.'
  },
  {
    id: 'r4',
    title: 'Tofu & Edamame Protein Bowl',
    category: 'Plant Based',
    time: '15 min',
    calories: 390,
    protein: 28,
    carbs: 40,
    fat: 12,
    tags: ['Vegan', 'High Fiber'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=80',
    description: 'Crispy pan-seared organic tofu with steamed edamame, shredded purple cabbage, and sesame ginger glaze.'
  }
];

export const mockDiaryMeals = {
  breakfast: {
    name: 'Breakfast',
    targetCalories: 450,
    items: [
      { id: 'd1', name: 'Scrambled Eggs with Spinach', portion: '2 large eggs + 50g spinach', calories: 180, protein: 14, carbs: 2, fat: 12 },
      { id: 'd2', name: 'Sourdough Toast with Grass-fed Butter', portion: '1 slice (45g)', calories: 150, protein: 4, carbs: 24, fat: 4 },
      { id: 'd3', name: 'Black Coffee with Collagen Peptides', portion: '1 mug (10g collagen)', calories: 40, protein: 9, carbs: 0, fat: 0 },
    ]
  },
  lunch: {
    name: 'Lunch',
    targetCalories: 600,
    items: [
      { id: 'd4', name: 'Grilled Herb Chicken Breast', portion: '160g', calories: 260, protein: 48, carbs: 0, fat: 6 },
      { id: 'd5', name: 'Steamed Brown Rice', portion: '120g cooked', calories: 145, protein: 3, carbs: 31, fat: 1 },
      { id: 'd6', name: 'Steamed Broccoli with Olive Oil', portion: '100g', calories: 85, protein: 3, carbs: 6, fat: 5 },
    ]
  },
  snack: {
    name: 'Afternoon Snack',
    targetCalories: 300,
    items: [
      { id: 'd7', name: 'Greek Yogurt 0% with Blueberries', portion: '150g + 50g berries', calories: 120, protein: 15, carbs: 12, fat: 0 },
      { id: 'd8', name: 'Raw Walnuts', portion: '20g', calories: 130, protein: 3, carbs: 3, fat: 13 },
    ]
  },
  dinner: {
    name: 'Dinner',
    targetCalories: 650,
    items: [
      { id: 'd9', name: 'Pan-Seared Alaskan Salmon', portion: '150g', calories: 270, protein: 32, carbs: 0, fat: 14 },
      { id: 'd10', name: 'Roasted Sweet Potato Wedges', portion: '150g', calories: 135, protein: 2, carbs: 31, fat: 0 },
    ]
  }
};

export const mockGroceryList = [
  { id: 'g1', name: 'Organic Greek Yogurt (0% Fat)', category: 'Dairy & Eggs', quantity: '2 tubs (32 oz)', checked: false, price: 9.50 },
  { id: 'g2', name: 'Pasture-Raised Large Eggs', category: 'Dairy & Eggs', quantity: '1 dozen', checked: true, price: 5.99 },
  { id: 'g3', name: 'Wild Alaskan Sockeye Salmon', category: 'Fresh Seafood', quantity: '1.2 lbs', checked: false, price: 21.40 },
  { id: 'g4', name: 'Organic Boneless Chicken Breasts', category: 'Fresh Poultry', quantity: '2 lbs', checked: false, price: 14.80 },
  { id: 'g5', name: 'Organic Hass Avocados', category: 'Fresh Produce', quantity: '4 count', checked: true, price: 4.99 },
  { id: 'g6', name: 'Baby Spinach (Organic)', category: 'Fresh Produce', quantity: '16 oz tub', checked: false, price: 4.49 },
  { id: 'g7', name: 'Fresh Blueberries', category: 'Fresh Produce', quantity: '2 pints', checked: false, price: 6.99 },
  { id: 'g8', name: 'Organic Rolled Oats', category: 'Pantry & Grains', quantity: '32 oz bag', checked: true, price: 4.29 },
  { id: 'g9', name: 'Raw California Almonds', category: 'Pantry & Grains', quantity: '1 lb bag', checked: false, price: 7.99 },
];
