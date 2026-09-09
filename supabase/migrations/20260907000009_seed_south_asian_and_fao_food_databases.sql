-- ==============================================================================
-- VITALIS FOOD DATABASE: SOUTH ASIAN & FAO/INFOODS FOOD DATABASES SEED
-- Sources:
-- 1. FAO/INFOODS India - Nutritive Value of Indian Foods (NVIF / NIN-ICMR & FAO)
-- 2. FAO/INFOODS India - Common Recipes (NIN-ICMR & FAO)
-- 3. FAO/INFOODS Global Pulses (uPulses v1.0)
-- 4. FAO/INFOODS Global Fish & Shellfish (uFiSh v1.0)
-- 5. AFACI Asian Food Composition Database
-- 6. Nepalese Food Composition Table (DFTQC Nepal / FAO)
-- 7. Bangladesh Food Composition Table (INFS Dhaka University / FAO FCTB)
-- 8. Indonesia Food Composition Table (TKPI / Panganku / Kemenkes Indonesia)
-- Total unique records: 70
-- User ID: NULL (System Food reference catalog)
-- ==============================================================================

INSERT INTO public.foods (name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber, user_id) VALUES
  ('Bisi Bele Bath (Karnataka Spiced Rice, Toor Dal, Vegetables & Ghee)', 'Rice and Grain Dishes', '1 medium bowl (250g)', 100, 'g', 142, 4.8, 22.4, 3.8, 2.6, NULL),
  ('Ven Pongal (South Indian Ghee Rice & Split Moong Dal Khichdi with Cashews & Pepper)', 'Breakfast foods', '1 plate (200g)', 100, 'g', 178, 5.6, 26.2, 5.8, 2.2, NULL),
  ('Avial (Kerala Mixed Vegetables in Crushed Coconut & Sour Curd Gravy)', 'Vegetables and Sabzi', '1 bowl (180g)', 100, 'g', 108, 2.6, 11.2, 5.8, 3.4, NULL),
  ('Thepla (Gujarati Whole Wheat Methi Fenugreek Spiced Flatbread)', 'Roti and Indian Breads', '2 theplas (70g)', 100, 'g', 286, 7.8, 45.6, 8.2, 5.4, NULL),
  ('Khandvi (Gujarati Steamed Gram Flour Besan & Yogurt Rolls with Mustard Tempering)', 'Snacks and Chaat', '4 rolls (80g)', 100, 'g', 168, 6.8, 21.4, 6.2, 2.8, NULL),
  ('Undhiyu (Traditional Gujarati Mixed Winter Vegetable Stew with Fenugreek Muthiyas)', 'Vegetables and Sabzi', '1 bowl (200g)', 100, 'g', 154, 4.2, 17.8, 7.4, 4.8, NULL),
  ('Kootu (Tamil Nadu Mixed Vegetables & Chana Dal in Coconut Cumin Gravy)', 'Vegetables and Sabzi', '1 bowl (180g)', 100, 'g', 112, 4.6, 14.8, 3.8, 3.6, NULL),
  ('Poriyal (South Indian Dry Vegetable Stir-Fry with Mustard Seeds & Grated Coconut)', 'Vegetables and Sabzi', '1 cup (150g)', 100, 'g', 88, 2.4, 9.6, 4.4, 3.2, NULL),
  ('Pesarattu (Andhra Green Gram Whole Moong Dosa Flat Crepe)', 'Breakfast foods', '1 large dosa (110g)', 100, 'g', 198, 9.4, 31.8, 3.8, 4.8, NULL),
  ('Gongura Mutton (Andhra Spicy Mutton Curry with Sorrel Leaves)', 'Meat and Poultry', '1 serving (220g)', 100, 'g', 192, 17.4, 3.2, 12, 1.4, NULL),
  ('Kozhi Varuval (Chettinad Spicy Dry Pepper Chicken)', 'Chicken and Poultry', '1 plate (180g)', 100, 'g', 204, 21.8, 4.2, 10.8, 1.2, NULL),
  ('Meen Pollichathu (Kerala Spiced Pearl Spot Fish Wrapped in Banana Leaf)', 'Fish and Seafood', '1 whole fish (200g)', 100, 'g', 162, 18.6, 3.8, 7.8, 1.1, NULL),
  ('Pulihora / Tamarind Rice (Temple Style Spiced Rice with Peanuts & Curry Leaves)', 'Rice and Grain Dishes', '1 plate (200g)', 100, 'g', 186, 3.6, 32.4, 4.6, 2.1, NULL),
  ('Thalipeeth (Maharashtrian Multi-Grain Spiced Savory Flatbread)', 'Roti and Indian Breads', '1 piece (90g)', 100, 'g', 274, 8.6, 43.8, 7.2, 6.2, NULL),
  ('Pithla / Pitla (Maharashtrian Spiced Gram Flour Besan Curry)', 'Grain Legumes and Pulses', '1 bowl (180g)', 100, 'g', 134, 6.8, 15.2, 4.8, 3.4, NULL),
  ('Litti Chokha (Bihari Roasted Whole Wheat Balls Stuffed with Sattu & Roasted Eggplant Mash)', 'Rice and Grain Dishes', '2 littis with chokha (250g)', 100, 'g', 198, 7.2, 32.6, 4.6, 5.2, NULL),
  ('Sattu Drink (Roasted Bengal Gram Flour Refreshing Summer Beverage with Roasted Cumin)', 'Dairy and Beverages', '1 glass (250ml)', 100, 'g', 78, 4.2, 13.6, 0.8, 2.4, NULL),
  ('Macher Matha Diye Moong Dal (Bengali Roasted Moong Dal with Spiced Fish Head)', 'Dal and Lentil Dishes', '1 bowl (200g)', 100, 'g', 138, 9.8, 14.2, 4.6, 2.8, NULL),
  ('Horsegram / Kulthi (Macrotyloma uniflorum, Mature Seeds Boiled)', 'Grain Legumes and Pulses', '1 cup cooked (180g)', 100, 'g', 124, 8.8, 21.2, 0.6, 7.4, NULL),
  ('Moth Bean / Matki (Vigna aconitifolia, Boiled Whole Seeds)', 'Grain Legumes and Pulses', '1 cup cooked (180g)', 100, 'g', 118, 7.9, 20.6, 0.5, 6.8, NULL),
  ('Grass Pea / Khesari Dal (Lathyrus sativus, Split Boiled Dal)', 'Grain Legumes and Pulses', '1 cup cooked (180g)', 100, 'g', 128, 9.2, 21.8, 0.5, 6.2, NULL),
  ('Adzuki Bean (Vigna angularis, Whole Dried Seeds Boiled)', 'Grain Legumes and Pulses', '1 cup cooked (180g)', 100, 'g', 128, 7.5, 24.8, 0.2, 7.3, NULL),
  ('Winged Bean Seeds (Psophocarpus tetragonolobus, Boiled Mature Seeds)', 'Grain Legumes and Pulses', '1/2 cup cooked (90g)', 100, 'g', 164, 12.2, 16.4, 5.8, 6.4, NULL),
  ('Tepary Bean (Phaseolus acutifolius, Boiled)', 'Grain Legumes and Pulses', '1 cup cooked (180g)', 100, 'g', 126, 8.2, 22.4, 0.4, 7.8, NULL),
  ('Lupin Bean / Lupini (Lupinus albus, De-Bittered Boiled Seeds)', 'Grain Legumes and Pulses', '1/2 cup (80g)', 100, 'g', 119, 15.6, 9.9, 2.9, 2.8, NULL),
  ('Rohu Carp (Labeo rohita, Freshwater, Steamed Fillet)', 'Fish and Seafood', '1 fillet (150g)', 100, 'g', 102, 19.7, 0, 2.2, 0, NULL),
  ('Catla Carp (Gibelion catla, Freshwater, Baked Fillet)', 'Fish and Seafood', '1 fillet (150g)', 100, 'g', 111, 19.2, 0, 3.4, 0, NULL),
  ('Mrigal Carp (Cirrhinus mrigala, Steamed Flesh)', 'Fish and Seafood', '1 fillet (140g)', 100, 'g', 98, 19.4, 0, 1.8, 0, NULL),
  ('Hilsa / Ilish Shad (Tenualosa ilisha, Steamed Flesh)', 'Fish and Seafood', '1 steak (160g)', 100, 'g', 272, 21.8, 0, 19.4, 0, NULL),
  ('Indian Mackerel (Rastrelliger kanagurta, Baked Flesh)', 'Fish and Seafood', '1 fish (120g)', 100, 'g', 148, 21.4, 0, 6.8, 0, NULL),
  ('Bombay Duck (Harpadon nehereus, Fresh Raw Flesh)', 'Fish and Seafood', '1 serving (150g)', 100, 'g', 52, 11.2, 0, 0.8, 0, NULL),
  ('Bombay Duck (Sun-Dried Shutki Flesh)', 'Fish and Seafood', '2 dry pieces (40g)', 100, 'g', 294, 61.8, 0, 3.8, 0, NULL),
  ('Black Tiger Shrimp / Prawn (Penaeus monodon, Boiled Meat)', 'Fish and Seafood', '6 large prawns (100g)', 100, 'g', 99, 22.8, 0.2, 0.8, 0, NULL),
  ('Mud Crab (Scylla serrata, Steamed Meat)', 'Fish and Seafood', '1 serving meat (120g)', 100, 'g', 94, 20.1, 0, 1.2, 0, NULL),
  ('Kimchi (Traditional Korean Fermented Napa Cabbage with Radish & Chili)', 'Vegetables and Sabzi', '1 small bowl (80g)', 100, 'g', 23, 1.9, 3.4, 0.4, 2.2, NULL),
  ('Gochujang (Korean Fermented Red Chili Glutinous Rice Paste)', 'Condiments and Spices', '1 tablespoon (20g)', 100, 'g', 218, 4.8, 45.6, 1.8, 4.2, NULL),
  ('Doenjang (Traditional Korean Fermented Soybean Paste)', 'Condiments and Spices', '1 tablespoon (20g)', 100, 'g', 148, 12.4, 14.8, 4.2, 5.6, NULL),
  ('Bibimbap (Korean Warm Rice with Sautéed Vegetables, Egg & Gochujang)', 'Rice and Grain Dishes', '1 stone bowl (350g)', 100, 'g', 142, 5.6, 22.8, 3.4, 2.1, NULL),
  ('Japchae (Korean Stir-Fried Sweet Potato Glass Noodles with Beef & Vegetables)', 'Rice and Grain Dishes', '1 plate (200g)', 100, 'g', 168, 4.6, 26.4, 5.2, 1.8, NULL),
  ('Bulgogi (Korean Thin Sliced Marinated Grilled Beef Ribeye)', 'Meat and Poultry', '1 serving (150g)', 100, 'g', 214, 21.8, 7.2, 10.6, 0.4, NULL),
  ('Tteokbokki (Korean Chewy Cylindrical Rice Cakes in Sweet Spicy Gochujang Sauce)', 'Snacks and Chaat', '1 bowl (220g)', 100, 'g', 178, 3.8, 36.8, 1.8, 1.6, NULL),
  ('Gundruk (Traditional Nepalese Fermented & Sun-Dried Mustard Green Leaves)', 'Green Leafy Vegetables', '1 cup soup / serving (150g)', 100, 'g', 36, 3.8, 4.2, 0.4, 3.6, NULL),
  ('Dhindo / Dheedho (Nepalese Traditional Buckwheat / Millet Porridge Dough)', 'Cereals and Millets', '1 portion (200g)', 100, 'g', 142, 3.8, 29.8, 0.8, 2.8, NULL),
  ('Sel Roti (Nepalese Traditional Ring-Shaped Sweet Crispy Rice Bread Doughnut)', 'Baked Products', '1 sel roti (70g)', 100, 'g', 348, 4.8, 58.4, 11.2, 1.2, NULL),
  ('Kwati (Nepalese Sprouted Nine-Bean Protein Soup with Spices & Ghee)', 'Grain Legumes and Pulses', '1 bowl (250g)', 100, 'g', 124, 7.8, 18.6, 2.4, 5.6, NULL),
  ('Aloo Tama (Nepalese Potato, Fermented Bamboo Shoot & Black-Eyed Pea Curry)', 'Vegetables and Sabzi', '1 bowl (200g)', 100, 'g', 88, 3.2, 14.8, 1.8, 3.1, NULL),
  ('Nepalese Steamed Chicken Momo (Spiced Minced Chicken Dumplings)', 'Snacks and Chaat', '6 momos (150g)', 100, 'g', 176, 11.4, 20.8, 5.2, 1.1, NULL),
  ('Bara / Woh (Newari Savory Spiced Black Lentil / Moong Lentil Patty, Pan-Fried)', 'Snacks and Chaat', '2 patties (100g)', 100, 'g', 224, 10.2, 28.4, 7.8, 4.6, NULL),
  ('Yomari (Newari Steamed Rice Flour Dumpling Stuffed with Chaku Jaggery & Sesame)', 'Indian Sweets and Mithai', '1 yomari (80g)', 100, 'g', 268, 3.6, 54.2, 4.2, 2.1, NULL),
  ('Shorshe Ilish (Traditional Bengali Hilsa Fish in Mustard Paste Gravy)', 'Fish and Seafood', '1 piece with gravy (160g)', 100, 'g', 248, 17.8, 3.4, 18.2, 1.2, NULL),
  ('Rui Macher Kalia (Bengali Rohu Fish Rich Onion-Ginger-Spiced Curry)', 'Fish and Seafood', '1 piece with gravy (180g)', 100, 'g', 154, 15.6, 4.6, 8.2, 1.1, NULL),
  ('Chingri Malai Curry (Bengali Jumbo Prawns Simmered in Spiced Coconut Cream)', 'Fish and Seafood', '1 serving (200g)', 100, 'g', 188, 14.2, 5.6, 12.4, 1.2, NULL),
  ('Alu Bhorta (Bengali Mashed Potato with Mustard Oil, Roasted Red Chili & Onion)', 'Vegetables and Sabzi', '1 scoop / ball (80g)', 100, 'g', 122, 2.2, 18.4, 4.4, 2.1, NULL),
  ('Begun Bhorta (Bengali Char-Smoked Mashed Eggplant with Mustard Oil & Garlic)', 'Vegetables and Sabzi', '1 scoop (100g)', 100, 'g', 76, 1.8, 7.2, 4.8, 3.2, NULL),
  ('Shutki Bhorta (Spicy Bangladeshi Dry Fish Mash with Mustard Oil, Onion & Chili)', 'Fish and Seafood', '2 tablespoons (50g)', 100, 'g', 168, 19.4, 4.2, 7.8, 1.6, NULL),
  ('Dhaka Morog Polao (Fragrant Chinigura Rice Cooked with Tender Spiced Chicken & Ghee)', 'Chicken and Poultry', '1 plate (320g)', 100, 'g', 194, 9.8, 23.4, 7.1, 1.1, NULL),
  ('Bhuna Khichuri (Bengali Roast Moong Dal & Rice with Mustard Oil & Whole Spices)', 'Rice and Grain Dishes', '1 plate (250g)', 100, 'g', 162, 5.8, 26.2, 4.1, 2.4, NULL),
  ('Chotpoti (Bangladeshi Spiced White Pea Chaat with Boiled Egg, Potato & Tamarind Water)', 'Snacks and Chaat', '1 bowl (200g)', 100, 'g', 136, 6.4, 22.8, 2.2, 4.6, NULL),
  ('Fuchka (Bangladeshi Crispy Puris Filled with Spiced Pea Mash & Tangy Tamarind Tok)', 'Snacks and Chaat', '6 pieces (120g)', 100, 'g', 158, 4.6, 26.4, 3.8, 2.8, NULL),
  ('Tempeh / Tempe Kedelai (Raw Fermented Soybean Cake)', 'Grain Legumes and Pulses', '1 piece (100g)', 100, 'g', 192, 20.8, 7.6, 10.8, 4.8, NULL),
  ('Tempe Goreng (Crispy Indonesian Pan-Fried Spiced Tempeh Slices)', 'Grain Legumes and Pulses', '2 slices (80g)', 100, 'g', 268, 18.2, 9.4, 18, 4.2, NULL),
  ('Tempe Bacem (Sweet Braised Tempeh in Palm Sugar, Coriander & Coconut Water)', 'Grain Legumes and Pulses', '2 pieces (100g)', 100, 'g', 224, 16.4, 18.8, 9.2, 3.8, NULL),
  ('Rendang Daging Sapi (Padang Slow-Braised Spiced Beef in Caramelized Coconut Gravy)', 'Meat and Poultry', '1 piece / serving (150g)', 100, 'g', 242, 22.4, 4.8, 14.8, 1.4, NULL),
  ('Gado-Gado (Indonesian Steamed Vegetable Salad with Fried Tofu, Egg & Rich Peanut Sauce)', 'Vegetables and Sabzi', '1 plate (250g)', 100, 'g', 156, 6.8, 14.2, 8.4, 3.4, NULL),
  ('Soto Ayam (Indonesian Fragrant Turmeric Chicken Soup with Glass Noodles & Egg)', 'Chicken and Poultry', '1 bowl (300g)', 100, 'g', 104, 8.8, 8.4, 3.8, 0.8, NULL),
  ('Sate Ayam Madura (Grilled Chicken Skewers Glazed with Sweet Soy & Peanut Sauce)', 'Chicken and Poultry', '5 skewers (150g)', 100, 'g', 218, 20.4, 7.8, 11.6, 1.2, NULL),
  ('Bakso Sapi (Indonesian Springy Beef Meatball Soup with Noodles & Crisp Shallots)', 'Meat and Poultry', '1 bowl (300g)', 100, 'g', 134, 10.2, 14.6, 3.8, 0.8, NULL),
  ('Sayur Asem (Indonesian Sweet and Sour Tamarind Vegetable Soup with Chayote & Corn)', 'Vegetables and Sabzi', '1 bowl (220g)', 100, 'g', 46, 1.8, 8.4, 0.6, 2.1, NULL),
  ('Sambal Terasi (Indonesian Fresh Red Chili Paste with Toasted Shrimp Paste)', 'Condiments and Spices', '1 tablespoon (15g)', 100, 'g', 112, 4.8, 14.6, 4.1, 3.6, NULL),
  ('Pempek Palembang (Indonesian Savory Fish Cake with Tangy Sweet Cuko Vinegar Sauce)', 'Fish and Seafood', '2 pieces with cuko (140g)', 100, 'g', 174, 11.8, 23.4, 3.8, 0.8, NULL);
