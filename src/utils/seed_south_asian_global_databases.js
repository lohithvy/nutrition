/**
 * VITALIS - South Asian & FAO/INFOODS Food Composition Databases Seed
 * Datasets:
 * 1. FAO/INFOODS India – Nutritive Value of Indian Foods (NVIF / NIN-ICMR & FAO)
 * 2. FAO/INFOODS India – Balanced Diets and Nutritive Value of Common Recipes (NIN-ICMR & FAO)
 * 3. FAO/INFOODS Global Food Composition Database for Pulses (uPulses v1.0)
 * 4. FAO/INFOODS Global Food Composition Database for Fish & Shellfish (uFiSh v1.0)
 * 5. AFACI Asian Food Composition Database (Asian Food and Agriculture Cooperation Initiative / RDA)
 * 6. Nepalese Food Composition Table (DFTQC Nepal / FAO)
 * 7. Bangladesh Food Composition Table (INFS University of Dhaka / FAO FCTB)
 * 8. Indonesia Food Composition Table (TKPI / Panganku / Kemenkes Indonesia)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================================
// 1 & 2. FAO/INFOODS India - Nutritive Value of Indian Foods & Common Recipes
// ============================================================================
const faoIndiaFoods = [
  {
    name: 'Bisi Bele Bath (Karnataka Spiced Rice, Toor Dal, Vegetables & Ghee)',
    category: 'Rice and Grain Dishes',
    portion_description: '1 medium bowl (250g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 142,
    protein: 4.8,
    carbs: 22.4,
    fat: 3.8,
    fiber: 2.6,
  },
  {
    name: 'Ven Pongal (South Indian Ghee Rice & Split Moong Dal Khichdi with Cashews & Pepper)',
    category: 'Breakfast foods',
    portion_description: '1 plate (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 178,
    protein: 5.6,
    carbs: 26.2,
    fat: 5.8,
    fiber: 2.2,
  },
  {
    name: 'Avial (Kerala Mixed Vegetables in Crushed Coconut & Sour Curd Gravy)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 bowl (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 108,
    protein: 2.6,
    carbs: 11.2,
    fat: 5.8,
    fiber: 3.4,
  },
  {
    name: 'Thepla (Gujarati Whole Wheat Methi Fenugreek Spiced Flatbread)',
    category: 'Roti and Indian Breads',
    portion_description: '2 theplas (70g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 286,
    protein: 7.8,
    carbs: 45.6,
    fat: 8.2,
    fiber: 5.4,
  },
  {
    name: 'Khandvi (Gujarati Steamed Gram Flour Besan & Yogurt Rolls with Mustard Tempering)',
    category: 'Snacks and Chaat',
    portion_description: '4 rolls (80g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 168,
    protein: 6.8,
    carbs: 21.4,
    fat: 6.2,
    fiber: 2.8,
  },
  {
    name: 'Undhiyu (Traditional Gujarati Mixed Winter Vegetable Stew with Fenugreek Muthiyas)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 bowl (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 154,
    protein: 4.2,
    carbs: 17.8,
    fat: 7.4,
    fiber: 4.8,
  },
  {
    name: 'Kootu (Tamil Nadu Mixed Vegetables & Chana Dal in Coconut Cumin Gravy)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 bowl (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 112,
    protein: 4.6,
    carbs: 14.8,
    fat: 3.8,
    fiber: 3.6,
  },
  {
    name: 'Poriyal (South Indian Dry Vegetable Stir-Fry with Mustard Seeds & Grated Coconut)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 cup (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 88,
    protein: 2.4,
    carbs: 9.6,
    fat: 4.4,
    fiber: 3.2,
  },
  {
    name: 'Pesarattu (Andhra Green Gram Whole Moong Dosa Flat Crepe)',
    category: 'Breakfast foods',
    portion_description: '1 large dosa (110g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 198,
    protein: 9.4,
    carbs: 31.8,
    fat: 3.8,
    fiber: 4.8,
  },
  {
    name: 'Gongura Mutton (Andhra Spicy Mutton Curry with Sorrel Leaves)',
    category: 'Meat and Poultry',
    portion_description: '1 serving (220g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 192,
    protein: 17.4,
    carbs: 3.2,
    fat: 12.0,
    fiber: 1.4,
  },
  {
    name: 'Kozhi Varuval (Chettinad Spicy Dry Pepper Chicken)',
    category: 'Chicken and Poultry',
    portion_description: '1 plate (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 204,
    protein: 21.8,
    carbs: 4.2,
    fat: 10.8,
    fiber: 1.2,
  },
  {
    name: 'Meen Pollichathu (Kerala Spiced Pearl Spot Fish Wrapped in Banana Leaf)',
    category: 'Fish and Seafood',
    portion_description: '1 whole fish (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 162,
    protein: 18.6,
    carbs: 3.8,
    fat: 7.8,
    fiber: 1.1,
  },
  {
    name: 'Pulihora / Tamarind Rice (Temple Style Spiced Rice with Peanuts & Curry Leaves)',
    category: 'Rice and Grain Dishes',
    portion_description: '1 plate (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 186,
    protein: 3.6,
    carbs: 32.4,
    fat: 4.6,
    fiber: 2.1,
  },
  {
    name: 'Thalipeeth (Maharashtrian Multi-Grain Spiced Savory Flatbread)',
    category: 'Roti and Indian Breads',
    portion_description: '1 piece (90g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 274,
    protein: 8.6,
    carbs: 43.8,
    fat: 7.2,
    fiber: 6.2,
  },
  {
    name: 'Pithla / Pitla (Maharashtrian Spiced Gram Flour Besan Curry)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1 bowl (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 134,
    protein: 6.8,
    carbs: 15.2,
    fat: 4.8,
    fiber: 3.4,
  },
  {
    name: 'Litti Chokha (Bihari Roasted Whole Wheat Balls Stuffed with Sattu & Roasted Eggplant Mash)',
    category: 'Rice and Grain Dishes',
    portion_description: '2 littis with chokha (250g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 198,
    protein: 7.2,
    carbs: 32.6,
    fat: 4.6,
    fiber: 5.2,
  },
  {
    name: 'Sattu Drink (Roasted Bengal Gram Flour Refreshing Summer Beverage with Roasted Cumin)',
    category: 'Dairy and Beverages',
    portion_description: '1 glass (250ml)',
    base_amount: 100,
    base_unit: 'g',
    calories: 78,
    protein: 4.2,
    carbs: 13.6,
    fat: 0.8,
    fiber: 2.4,
  },
  {
    name: 'Macher Matha Diye Moong Dal (Bengali Roasted Moong Dal with Spiced Fish Head)',
    category: 'Dal and Lentil Dishes',
    portion_description: '1 bowl (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 138,
    protein: 9.8,
    carbs: 14.2,
    fat: 4.6,
    fiber: 2.8,
  }
];

// ============================================================================
// 3. FAO/INFOODS Global Food Composition Database for Pulses (uPulses v1.0)
// ============================================================================
const uPulsesFoods = [
  {
    name: 'Horsegram / Kulthi (Macrotyloma uniflorum, Mature Seeds Boiled)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1 cup cooked (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 124,
    protein: 8.8,
    carbs: 21.2,
    fat: 0.6,
    fiber: 7.4,
  },
  {
    name: 'Moth Bean / Matki (Vigna aconitifolia, Boiled Whole Seeds)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1 cup cooked (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 118,
    protein: 7.9,
    carbs: 20.6,
    fat: 0.5,
    fiber: 6.8,
  },
  {
    name: 'Grass Pea / Khesari Dal (Lathyrus sativus, Split Boiled Dal)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1 cup cooked (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 128,
    protein: 9.2,
    carbs: 21.8,
    fat: 0.5,
    fiber: 6.2,
  },
  {
    name: 'Adzuki Bean (Vigna angularis, Whole Dried Seeds Boiled)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1 cup cooked (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 128,
    protein: 7.5,
    carbs: 24.8,
    fat: 0.2,
    fiber: 7.3,
  },
  {
    name: 'Winged Bean Seeds (Psophocarpus tetragonolobus, Boiled Mature Seeds)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1/2 cup cooked (90g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 164,
    protein: 12.2,
    carbs: 16.4,
    fat: 5.8,
    fiber: 6.4,
  },
  {
    name: 'Tepary Bean (Phaseolus acutifolius, Boiled)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1 cup cooked (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 126,
    protein: 8.2,
    carbs: 22.4,
    fat: 0.4,
    fiber: 7.8,
  },
  {
    name: 'Lupin Bean / Lupini (Lupinus albus, De-Bittered Boiled Seeds)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1/2 cup (80g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 119,
    protein: 15.6,
    carbs: 9.9,
    fat: 2.9,
    fiber: 2.8,
  }
];

// ============================================================================
// 4. FAO/INFOODS Global Food Composition Database for Fish & Shellfish (uFiSh v1.0)
// ============================================================================
const uFiShFoods = [
  {
    name: 'Rohu Carp (Labeo rohita, Freshwater, Steamed Fillet)',
    category: 'Fish and Seafood',
    portion_description: '1 fillet (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 102,
    protein: 19.7,
    carbs: 0.0,
    fat: 2.2,
    fiber: 0.0,
  },
  {
    name: 'Catla Carp (Gibelion catla, Freshwater, Baked Fillet)',
    category: 'Fish and Seafood',
    portion_description: '1 fillet (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 111,
    protein: 19.2,
    carbs: 0.0,
    fat: 3.4,
    fiber: 0.0,
  },
  {
    name: 'Mrigal Carp (Cirrhinus mrigala, Steamed Flesh)',
    category: 'Fish and Seafood',
    portion_description: '1 fillet (140g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 98,
    protein: 19.4,
    carbs: 0.0,
    fat: 1.8,
    fiber: 0.0,
  },
  {
    name: 'Hilsa / Ilish Shad (Tenualosa ilisha, Steamed Flesh)',
    category: 'Fish and Seafood',
    portion_description: '1 steak (160g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 272,
    protein: 21.8,
    carbs: 0.0,
    fat: 19.4,
    fiber: 0.0,
  },
  {
    name: 'Indian Mackerel (Rastrelliger kanagurta, Baked Flesh)',
    category: 'Fish and Seafood',
    portion_description: '1 fish (120g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 148,
    protein: 21.4,
    carbs: 0.0,
    fat: 6.8,
    fiber: 0.0,
  },
  {
    name: 'Bombay Duck (Harpadon nehereus, Fresh Raw Flesh)',
    category: 'Fish and Seafood',
    portion_description: '1 serving (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 52,
    protein: 11.2,
    carbs: 0.0,
    fat: 0.8,
    fiber: 0.0,
  },
  {
    name: 'Bombay Duck (Sun-Dried Shutki Flesh)',
    category: 'Fish and Seafood',
    portion_description: '2 dry pieces (40g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 294,
    protein: 61.8,
    carbs: 0.0,
    fat: 3.8,
    fiber: 0.0,
  },
  {
    name: 'Black Tiger Shrimp / Prawn (Penaeus monodon, Boiled Meat)',
    category: 'Fish and Seafood',
    portion_description: '6 large prawns (100g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 99,
    protein: 22.8,
    carbs: 0.2,
    fat: 0.8,
    fiber: 0.0,
  },
  {
    name: 'Mud Crab (Scylla serrata, Steamed Meat)',
    category: 'Fish and Seafood',
    portion_description: '1 serving meat (120g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 94,
    protein: 20.1,
    carbs: 0.0,
    fat: 1.2,
    fiber: 0.0,
  }
];

// ============================================================================
// 5. AFACI Asian Food Composition Database (AFACI / RDA)
// ============================================================================
const afaciFoods = [
  {
    name: 'Kimchi (Traditional Korean Fermented Napa Cabbage with Radish & Chili)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 small bowl (80g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 23,
    protein: 1.9,
    carbs: 3.4,
    fat: 0.4,
    fiber: 2.2,
  },
  {
    name: 'Gochujang (Korean Fermented Red Chili Glutinous Rice Paste)',
    category: 'Condiments and Spices',
    portion_description: '1 tablespoon (20g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 218,
    protein: 4.8,
    carbs: 45.6,
    fat: 1.8,
    fiber: 4.2,
  },
  {
    name: 'Doenjang (Traditional Korean Fermented Soybean Paste)',
    category: 'Condiments and Spices',
    portion_description: '1 tablespoon (20g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 148,
    protein: 12.4,
    carbs: 14.8,
    fat: 4.2,
    fiber: 5.6,
  },
  {
    name: 'Bibimbap (Korean Warm Rice with Sautéed Vegetables, Egg & Gochujang)',
    category: 'Rice and Grain Dishes',
    portion_description: '1 stone bowl (350g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 142,
    protein: 5.6,
    carbs: 22.8,
    fat: 3.4,
    fiber: 2.1,
  },
  {
    name: 'Japchae (Korean Stir-Fried Sweet Potato Glass Noodles with Beef & Vegetables)',
    category: 'Rice and Grain Dishes',
    portion_description: '1 plate (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 168,
    protein: 4.6,
    carbs: 26.4,
    fat: 5.2,
    fiber: 1.8,
  },
  {
    name: 'Bulgogi (Korean Thin Sliced Marinated Grilled Beef Ribeye)',
    category: 'Meat and Poultry',
    portion_description: '1 serving (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 214,
    protein: 21.8,
    carbs: 7.2,
    fat: 10.6,
    fiber: 0.4,
  },
  {
    name: 'Tteokbokki (Korean Chewy Cylindrical Rice Cakes in Sweet Spicy Gochujang Sauce)',
    category: 'Snacks and Chaat',
    portion_description: '1 bowl (220g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 178,
    protein: 3.8,
    carbs: 36.8,
    fat: 1.8,
    fiber: 1.6,
  }
];

// ============================================================================
// 6. Nepalese Food Composition Table (DFTQC Nepal / FAO)
// ============================================================================
const nepalFoods = [
  {
    name: 'Gundruk (Traditional Nepalese Fermented & Sun-Dried Mustard Green Leaves)',
    category: 'Green Leafy Vegetables',
    portion_description: '1 cup soup / serving (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 36,
    protein: 3.8,
    carbs: 4.2,
    fat: 0.4,
    fiber: 3.6,
  },
  {
    name: 'Dhindo / Dheedho (Nepalese Traditional Buckwheat / Millet Porridge Dough)',
    category: 'Cereals and Millets',
    portion_description: '1 portion (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 142,
    protein: 3.8,
    carbs: 29.8,
    fat: 0.8,
    fiber: 2.8,
  },
  {
    name: 'Sel Roti (Nepalese Traditional Ring-Shaped Sweet Crispy Rice Bread Doughnut)',
    category: 'Baked Products',
    portion_description: '1 sel roti (70g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 348,
    protein: 4.8,
    carbs: 58.4,
    fat: 11.2,
    fiber: 1.2,
  },
  {
    name: 'Kwati (Nepalese Sprouted Nine-Bean Protein Soup with Spices & Ghee)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1 bowl (250g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 124,
    protein: 7.8,
    carbs: 18.6,
    fat: 2.4,
    fiber: 5.6,
  },
  {
    name: 'Aloo Tama (Nepalese Potato, Fermented Bamboo Shoot & Black-Eyed Pea Curry)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 bowl (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 88,
    protein: 3.2,
    carbs: 14.8,
    fat: 1.8,
    fiber: 3.1,
  },
  {
    name: 'Nepalese Steamed Chicken Momo (Spiced Minced Chicken Dumplings)',
    category: 'Snacks and Chaat',
    portion_description: '6 momos (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 176,
    protein: 11.4,
    carbs: 20.8,
    fat: 5.2,
    fiber: 1.1,
  },
  {
    name: 'Bara / Woh (Newari Savory Spiced Black Lentil / Moong Lentil Patty, Pan-Fried)',
    category: 'Snacks and Chaat',
    portion_description: '2 patties (100g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 224,
    protein: 10.2,
    carbs: 28.4,
    fat: 7.8,
    fiber: 4.6,
  },
  {
    name: 'Yomari (Newari Steamed Rice Flour Dumpling Stuffed with Chaku Jaggery & Sesame)',
    category: 'Indian Sweets and Mithai',
    portion_description: '1 yomari (80g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 268,
    protein: 3.6,
    carbs: 54.2,
    fat: 4.2,
    fiber: 2.1,
  }
];

// ============================================================================
// 7. Bangladesh Food Composition Table (INFS Dhaka University / FAO FCTB)
// ============================================================================
const bangladeshFoods = [
  {
    name: 'Shorshe Ilish (Traditional Bengali Hilsa Fish in Mustard Paste Gravy)',
    category: 'Fish and Seafood',
    portion_description: '1 piece with gravy (160g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 248,
    protein: 17.8,
    carbs: 3.4,
    fat: 18.2,
    fiber: 1.2,
  },
  {
    name: 'Rui Macher Kalia (Bengali Rohu Fish Rich Onion-Ginger-Spiced Curry)',
    category: 'Fish and Seafood',
    portion_description: '1 piece with gravy (180g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 154,
    protein: 15.6,
    carbs: 4.6,
    fat: 8.2,
    fiber: 1.1,
  },
  {
    name: 'Chingri Malai Curry (Bengali Jumbo Prawns Simmered in Spiced Coconut Cream)',
    category: 'Fish and Seafood',
    portion_description: '1 serving (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 188,
    protein: 14.2,
    carbs: 5.6,
    fat: 12.4,
    fiber: 1.2,
  },
  {
    name: 'Alu Bhorta (Bengali Mashed Potato with Mustard Oil, Roasted Red Chili & Onion)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 scoop / ball (80g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 122,
    protein: 2.2,
    carbs: 18.4,
    fat: 4.4,
    fiber: 2.1,
  },
  {
    name: 'Begun Bhorta (Bengali Char-Smoked Mashed Eggplant with Mustard Oil & Garlic)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 scoop (100g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 76,
    protein: 1.8,
    carbs: 7.2,
    fat: 4.8,
    fiber: 3.2,
  },
  {
    name: 'Shutki Bhorta (Spicy Bangladeshi Dry Fish Mash with Mustard Oil, Onion & Chili)',
    category: 'Fish and Seafood',
    portion_description: '2 tablespoons (50g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 168,
    protein: 19.4,
    carbs: 4.2,
    fat: 7.8,
    fiber: 1.6,
  },
  {
    name: 'Dhaka Morog Polao (Fragrant Chinigura Rice Cooked with Tender Spiced Chicken & Ghee)',
    category: 'Chicken and Poultry',
    portion_description: '1 plate (320g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 194,
    protein: 9.8,
    carbs: 23.4,
    fat: 7.1,
    fiber: 1.1,
  },
  {
    name: 'Bhuna Khichuri (Bengali Roast Moong Dal & Rice with Mustard Oil & Whole Spices)',
    category: 'Rice and Grain Dishes',
    portion_description: '1 plate (250g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 162,
    protein: 5.8,
    carbs: 26.2,
    fat: 4.1,
    fiber: 2.4,
  },
  {
    name: 'Chotpoti (Bangladeshi Spiced White Pea Chaat with Boiled Egg, Potato & Tamarind Water)',
    category: 'Snacks and Chaat',
    portion_description: '1 bowl (200g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 136,
    protein: 6.4,
    carbs: 22.8,
    fat: 2.2,
    fiber: 4.6,
  },
  {
    name: 'Fuchka (Bangladeshi Crispy Puris Filled with Spiced Pea Mash & Tangy Tamarind Tok)',
    category: 'Snacks and Chaat',
    portion_description: '6 pieces (120g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 158,
    protein: 4.6,
    carbs: 26.4,
    fat: 3.8,
    fiber: 2.8,
  }
];

// ============================================================================
// 8. Indonesia Food Composition Table (TKPI / Kemenkes Indonesia / Panganku)
// ============================================================================
const indonesiaFoods = [
  {
    name: 'Tempeh / Tempe Kedelai (Raw Fermented Soybean Cake)',
    category: 'Grain Legumes and Pulses',
    portion_description: '1 piece (100g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 192,
    protein: 20.8,
    carbs: 7.6,
    fat: 10.8,
    fiber: 4.8,
  },
  {
    name: 'Tempe Goreng (Crispy Indonesian Pan-Fried Spiced Tempeh Slices)',
    category: 'Grain Legumes and Pulses',
    portion_description: '2 slices (80g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 268,
    protein: 18.2,
    carbs: 9.4,
    fat: 18.0,
    fiber: 4.2,
  },
  {
    name: 'Tempe Bacem (Sweet Braised Tempeh in Palm Sugar, Coriander & Coconut Water)',
    category: 'Grain Legumes and Pulses',
    portion_description: '2 pieces (100g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 224,
    protein: 16.4,
    carbs: 18.8,
    fat: 9.2,
    fiber: 3.8,
  },
  {
    name: 'Rendang Daging Sapi (Padang Slow-Braised Spiced Beef in Caramelized Coconut Gravy)',
    category: 'Meat and Poultry',
    portion_description: '1 piece / serving (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 242,
    protein: 22.4,
    carbs: 4.8,
    fat: 14.8,
    fiber: 1.4,
  },
  {
    name: 'Gado-Gado (Indonesian Steamed Vegetable Salad with Fried Tofu, Egg & Rich Peanut Sauce)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 plate (250g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 156,
    protein: 6.8,
    carbs: 14.2,
    fat: 8.4,
    fiber: 3.4,
  },
  {
    name: 'Soto Ayam (Indonesian Fragrant Turmeric Chicken Soup with Glass Noodles & Egg)',
    category: 'Chicken and Poultry',
    portion_description: '1 bowl (300g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 104,
    protein: 8.8,
    carbs: 8.4,
    fat: 3.8,
    fiber: 0.8,
  },
  {
    name: 'Sate Ayam Madura (Grilled Chicken Skewers Glazed with Sweet Soy & Peanut Sauce)',
    category: 'Chicken and Poultry',
    portion_description: '5 skewers (150g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 218,
    protein: 20.4,
    carbs: 7.8,
    fat: 11.6,
    fiber: 1.2,
  },
  {
    name: 'Bakso Sapi (Indonesian Springy Beef Meatball Soup with Noodles & Crisp Shallots)',
    category: 'Meat and Poultry',
    portion_description: '1 bowl (300g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 134,
    protein: 10.2,
    carbs: 14.6,
    fat: 3.8,
    fiber: 0.8,
  },
  {
    name: 'Sayur Asem (Indonesian Sweet and Sour Tamarind Vegetable Soup with Chayote & Corn)',
    category: 'Vegetables and Sabzi',
    portion_description: '1 bowl (220g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 46,
    protein: 1.8,
    carbs: 8.4,
    fat: 0.6,
    fiber: 2.1,
  },
  {
    name: 'Sambal Terasi (Indonesian Fresh Red Chili Paste with Toasted Shrimp Paste)',
    category: 'Condiments and Spices',
    portion_description: '1 tablespoon (15g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 112,
    protein: 4.8,
    carbs: 14.6,
    fat: 4.1,
    fiber: 3.6,
  },
  {
    name: 'Pempek Palembang (Indonesian Savory Fish Cake with Tangy Sweet Cuko Vinegar Sauce)',
    category: 'Fish and Seafood',
    portion_description: '2 pieces with cuko (140g)',
    base_amount: 100,
    base_unit: 'g',
    calories: 174,
    protein: 11.8,
    carbs: 23.4,
    fat: 3.8,
    fiber: 0.8,
  }
];

async function generateMigration() {
  console.log('================================================================');
  console.log('VITALIS: SEEDING SOUTH ASIAN & FAO/INFOODS FOOD DATABASES');
  console.log('1. FAO/INFOODS India - Nutritive Value of Indian Foods');
  console.log('2. FAO/INFOODS India - Common Recipes');
  console.log('3. FAO/INFOODS Global Pulses (uPulses v1.0)');
  console.log('4. FAO/INFOODS Global Fish & Shellfish (uFiSh v1.0)');
  console.log('5. AFACI Asian Food Composition Database');
  console.log('6. Nepalese Food Composition Table');
  console.log('7. Bangladesh Food Composition Table (FCTB)');
  console.log('8. Indonesia Food Composition Table (TKPI / Panganku)');
  console.log('================================================================\n');

  const allCandidates = [
    ...faoIndiaFoods,
    ...uPulsesFoods,
    ...uFiShFoods,
    ...afaciFoods,
    ...nepalFoods,
    ...bangladeshFoods,
    ...indonesiaFoods,
  ];

  console.log(`Total candidate records: ${allCandidates.length}`);

  // Fetch all existing foods from Supabase for deduplication
  let allExisting = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data: batch, error: fetchErr } = await supabase
      .from('foods')
      .select('name')
      .range(from, from + pageSize - 1);

    if (fetchErr) {
      console.error('❌ Error fetching existing foods:', fetchErr);
      return;
    }
    allExisting = allExisting.concat(batch || []);
    if (!batch || batch.length < pageSize) break;
    from += pageSize;
  }

  const existingNames = new Set((allExisting || []).map(r => r.name.toLowerCase().trim()));
  console.log(`Found ${existingNames.size} existing foods in database.`);

  const toInsert = [];
  const skipped = [];

  for (const food of allCandidates) {
    const key = food.name.toLowerCase().trim();
    if (existingNames.has(key)) {
      skipped.push(food.name);
    } else {
      toInsert.push({
        name: food.name,
        category: food.category,
        portion_description: food.portion_description,
        base_amount: food.base_amount,
        base_unit: food.base_unit,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber,
        user_id: null,
      });
      existingNames.add(key);
    }
  }

  console.log(`\nReady to insert: ${toInsert.length} new unique foods.`);
  console.log(`Skipped duplicates: ${skipped.length} foods.`);

  // Write SQL migration
  const migrationPath = path.join(__dirname, '../../supabase/migrations/20260907000009_seed_south_asian_and_fao_food_databases.sql');
  let sqlContent = `-- ==============================================================================\n`;
  sqlContent += `-- VITALIS FOOD DATABASE: SOUTH ASIAN & FAO/INFOODS FOOD DATABASES SEED\n`;
  sqlContent += `-- Sources:\n`;
  sqlContent += `-- 1. FAO/INFOODS India - Nutritive Value of Indian Foods (NVIF / NIN-ICMR & FAO)\n`;
  sqlContent += `-- 2. FAO/INFOODS India - Common Recipes (NIN-ICMR & FAO)\n`;
  sqlContent += `-- 3. FAO/INFOODS Global Pulses (uPulses v1.0)\n`;
  sqlContent += `-- 4. FAO/INFOODS Global Fish & Shellfish (uFiSh v1.0)\n`;
  sqlContent += `-- 5. AFACI Asian Food Composition Database\n`;
  sqlContent += `-- 6. Nepalese Food Composition Table (DFTQC Nepal / FAO)\n`;
  sqlContent += `-- 7. Bangladesh Food Composition Table (INFS Dhaka University / FAO FCTB)\n`;
  sqlContent += `-- 8. Indonesia Food Composition Table (TKPI / Panganku / Kemenkes Indonesia)\n`;
  sqlContent += `-- Total unique records: ${toInsert.length}\n`;
  sqlContent += `-- User ID: NULL (System Food reference catalog)\n`;
  sqlContent += `-- ==============================================================================\n\n`;
  sqlContent += `INSERT INTO public.foods (name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber, user_id) VALUES\n`;

  const valueRows = toInsert.map(f => {
    const nameEsc = f.name.replace(/'/g, "''");
    const catEsc = f.category.replace(/'/g, "''");
    const portionEsc = f.portion_description.replace(/'/g, "''");
    return `  ('${nameEsc}', '${catEsc}', '${portionEsc}', ${f.base_amount}, '${f.base_unit}', ${f.calories}, ${f.protein}, ${f.carbs}, ${f.fat}, ${f.fiber}, NULL)`;
  });

  sqlContent += valueRows.join(',\n') + ';\n';

  fs.writeFileSync(migrationPath, sqlContent, 'utf8');
  console.log(`\n✅ Generated migration SQL file: ${migrationPath}`);
}

generateMigration();
