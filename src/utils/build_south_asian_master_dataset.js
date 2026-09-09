/**
 * Master Data Compiler for 8 South Asian & FAO/INFOODS Datasets
 */

const fs = require('fs');
const path = require('path');

// Compile master items from the 8 official datasets
const masterItems = [
  // 1. FAO/INFOODS India - Nutritive Value of Indian Foods (NVIF) & 2. Common Recipes
  { name: 'Bisi Bele Bath (Karnataka Spiced Rice, Toor Dal, Vegetables & Ghee)', calories: 142, protein: 4.8, carbs: 22.4, fat: 3.8, fiber: 2.6, category: 'Rice and Grain Dishes' },
  { name: 'Ven Pongal (South Indian Ghee Rice & Split Moong Dal Khichdi with Cashews & Pepper)', calories: 178, protein: 5.6, carbs: 26.2, fat: 5.8, fiber: 2.2, category: 'Breakfast foods' },
  { name: 'Sakkarai Pongal / Sweet Pongal (Jaggery Rice with Moong Dal & Ghee)', calories: 236, protein: 3.8, carbs: 46.8, fat: 4.4, fiber: 1.4, category: 'Indian Sweets and Mithai' },
  { name: 'Avial (Kerala Mixed Vegetables in Crushed Coconut & Sour Curd Gravy)', calories: 108, protein: 2.6, carbs: 11.2, fat: 5.8, fiber: 3.4, category: 'Vegetables and Sabzi' },
  { name: 'Thepla (Gujarati Whole Wheat Methi Fenugreek Spiced Flatbread)', calories: 286, protein: 7.8, carbs: 45.6, fat: 8.2, fiber: 5.4, category: 'Roti and Indian Breads' },
  { name: 'Khandvi (Gujarati Steamed Gram Flour Besan & Yogurt Rolls with Mustard Tempering)', calories: 168, protein: 6.8, carbs: 21.4, fat: 6.2, fiber: 2.8, category: 'Snacks and Chaat' },
  { name: 'Undhiyu (Traditional Gujarati Mixed Winter Vegetable Stew with Fenugreek Muthiyas)', calories: 154, protein: 4.2, carbs: 17.8, fat: 7.4, fiber: 4.8, category: 'Vegetables and Sabzi' },
  { name: 'Kootu (Tamil Nadu Mixed Vegetables & Chana Dal in Coconut Cumin Gravy)', calories: 112, protein: 4.6, carbs: 14.8, fat: 3.8, fiber: 3.6, category: 'Vegetables and Sabzi' },
  { name: 'Poriyal (South Indian Dry Vegetable Stir-Fry with Mustard Seeds & Grated Coconut)', calories: 88, protein: 2.4, carbs: 9.6, fat: 4.4, fiber: 3.2, category: 'Vegetables and Sabzi' },
  { name: 'Pesarattu (Andhra Green Gram Whole Moong Dosa Flat Crepe)', calories: 198, protein: 9.4, carbs: 31.8, fat: 3.8, fiber: 4.8, category: 'Breakfast foods' },
  { name: 'Gongura Mutton (Andhra Spicy Mutton Curry with Sorrel Leaves)', calories: 192, protein: 17.4, carbs: 3.2, fat: 12.0, fiber: 1.4, category: 'Meat and Poultry' },
  { name: 'Kozhi Varuval (Chettinad Spicy Dry Pepper Chicken)', calories: 204, protein: 21.8, carbs: 4.2, fat: 10.8, fiber: 1.2, category: 'Chicken and Poultry' },
  { name: 'Meen Pollichathu (Kerala Spiced Pearl Spot Fish Wrapped in Banana Leaf)', calories: 162, protein: 18.6, carbs: 3.8, fat: 7.8, fiber: 1.1, category: 'Fish and Seafood' },
  { name: 'Pulihora / Tamarind Rice (Temple Style Spiced Rice with Peanuts & Curry Leaves)', calories: 186, protein: 3.6, carbs: 32.4, fat: 4.6, fiber: 2.1, category: 'Rice and Grain Dishes' },
  { name: 'Thalipeeth (Maharashtrian Multi-Grain Spiced Savory Flatbread)', calories: 274, protein: 8.6, carbs: 43.8, fat: 7.2, fiber: 6.2, category: 'Roti and Indian Breads' },
  { name: 'Pithla / Pitla (Maharashtrian Spiced Gram Flour Besan Curry)', calories: 134, protein: 6.8, carbs: 15.2, fat: 4.8, fiber: 3.4, category: 'Grain Legumes and Pulses' },
  { name: 'Litti Chokha (Bihari Roasted Whole Wheat Balls Stuffed with Sattu & Roasted Eggplant Mash)', calories: 198, protein: 7.2, carbs: 32.6, fat: 4.6, fiber: 5.2, category: 'Rice and Grain Dishes' },
  { name: 'Sattu Drink (Roasted Bengal Gram Flour Refreshing Summer Beverage with Roasted Cumin)', calories: 78, protein: 4.2, carbs: 13.6, fat: 0.8, fiber: 2.4, category: 'Dairy and Beverages' },
  { name: 'Macher Matha Diye Moong Dal (Bengali Roasted Moong Dal with Spiced Fish Head)', calories: 138, protein: 9.8, carbs: 14.2, fat: 4.6, fiber: 2.8, category: 'Dal and Lentil Dishes' },
  { name: 'Kadhi Pakora (Punjabi Spiced Yogurt & Gram Flour Curry with Crispy Onion Fritters)', calories: 148, protein: 5.2, carbs: 14.6, fat: 7.8, fiber: 2.1, category: 'Vegetarian Curries and Paneer' },
  { name: 'Dal Makhani (Slow-Cooked Black Urad & Rajma in Butter and Cream Gravy)', calories: 162, protein: 6.4, carbs: 16.8, fat: 7.9, fiber: 4.2, category: 'Dal and Lentil Dishes' },
  { name: 'Misal Pav (Sprouted Moth Bean Spicy Curry with Farsan & Pav Bread)', calories: 194, protein: 6.8, carbs: 26.4, fat: 6.8, fiber: 4.6, category: 'Snacks and Chaat' },
  { name: 'Sabudana Khichdi (Tapioca Pearls Sautéed with Roasted Peanuts, Green Chili & Cumin)', calories: 258, protein: 4.2, carbs: 42.6, fat: 8.4, fiber: 1.8, category: 'Breakfast foods' },
  { name: 'Sabudana Vada (Crispy Fried Tapioca Sago & Mashed Potato Patties)', calories: 312, protein: 4.8, carbs: 46.2, fat: 12.8, fiber: 2.0, category: 'Snacks and Chaat' },
  { name: 'Khaman Dhokla (Steamed Gram Flour Besan Sponge Cake with Mustard & Green Chili Tempering)', calories: 152, protein: 6.2, carbs: 23.4, fat: 3.8, fiber: 2.4, category: 'Breakfast foods' },
  { name: 'Rava Idli (Steamed Semolina Cakes Tempered with Mustard, Ginger & Cashews)', calories: 142, protein: 4.4, carbs: 26.8, fat: 2.1, fiber: 1.6, category: 'Breakfast foods' },
  { name: 'Appam (Kerala Fermented Rice & Coconut Milk Lacy Hopper)', calories: 138, protein: 2.4, carbs: 28.2, fat: 1.8, fiber: 1.2, category: 'Breakfast foods' },
  { name: 'Idiyappam / String Hoppers (Steamed Rice Flour Noodle Nests)', calories: 124, protein: 2.1, carbs: 27.4, fat: 0.4, fiber: 1.1, category: 'Breakfast foods' },
  { name: 'Puttu (Kerala Steamed Cylindrical Coarse Rice Flour Layered with Fresh Grated Coconut)', calories: 172, protein: 3.6, carbs: 32.8, fat: 3.2, fiber: 2.4, category: 'Breakfast foods' },
  { name: 'Kadala Curry (Kerala Spicy Black Chickpea Coconut Gravy for Puttu)', calories: 148, protein: 7.2, carbs: 18.4, fat: 5.2, fiber: 5.8, category: 'Dal and Lentil Dishes' },

  // 3. FAO/INFOODS Global Pulses (uPulses v1.0)
  { name: 'Horsegram / Kulthi (Macrotyloma uniflorum, Mature Seeds Boiled)', calories: 124, protein: 8.8, carbs: 21.2, fat: 0.6, fiber: 7.4, category: 'Grain Legumes and Pulses' },
  { name: 'Moth Bean / Matki (Vigna aconitifolia, Boiled Whole Seeds)', calories: 118, protein: 7.9, carbs: 20.6, fat: 0.5, fiber: 6.8, category: 'Grain Legumes and Pulses' },
  { name: 'Grass Pea / Khesari Dal (Lathyrus sativus, Split Boiled Dal)', calories: 128, protein: 9.2, carbs: 21.8, fat: 0.5, fiber: 6.2, category: 'Grain Legumes and Pulses' },
  { name: 'Adzuki Bean (Vigna angularis, Whole Dried Seeds Boiled)', calories: 128, protein: 7.5, carbs: 24.8, fat: 0.2, fiber: 7.3, category: 'Grain Legumes and Pulses' },
  { name: 'Winged Bean Seeds (Psophocarpus tetragonolobus, Boiled Mature Seeds)', calories: 164, protein: 12.2, carbs: 16.4, fat: 5.8, fiber: 6.4, category: 'Grain Legumes and Pulses' },
  { name: 'Tepary Bean (Phaseolus acutifolius, Boiled)', calories: 126, protein: 8.2, carbs: 22.4, fat: 0.4, fiber: 7.8, category: 'Grain Legumes and Pulses' },
  { name: 'Lupin Bean / Lupini (Lupinus albus, De-Bittered Boiled Seeds)', calories: 119, protein: 15.6, carbs: 9.9, fat: 2.9, fiber: 2.8, category: 'Grain Legumes and Pulses' },
  { name: 'Bambara Groundnut (Vigna subterranea, Boiled Seeds)', calories: 154, protein: 8.9, carbs: 25.8, fat: 2.1, fiber: 5.6, category: 'Grain Legumes and Pulses' },
  { name: 'Lablab Bean / Val Dal (Lablab purpureus, Boiled Whole)', calories: 118, protein: 7.8, carbs: 21.2, fat: 0.4, fiber: 6.8, category: 'Grain Legumes and Pulses' },
  { name: 'African Yam Bean (Sphenostylis stenocarpa, Cooked Seeds)', calories: 132, protein: 8.4, carbs: 23.6, fat: 0.8, fiber: 6.2, category: 'Grain Legumes and Pulses' },

  // 4. FAO/INFOODS Global Fish & Shellfish (uFiSh v1.0)
  { name: 'Rohu Carp (Labeo rohita, Freshwater, Steamed Fillet)', calories: 102, protein: 19.7, carbs: 0.0, fat: 2.2, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Catla Carp (Gibelion catla, Freshwater, Baked Fillet)', calories: 111, protein: 19.2, carbs: 0.0, fat: 3.4, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Mrigal Carp (Cirrhinus mrigala, Steamed Flesh)', calories: 98, protein: 19.4, carbs: 0.0, fat: 1.8, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Hilsa / Ilish Shad (Tenualosa ilisha, Steamed Flesh)', calories: 272, protein: 21.8, carbs: 0.0, fat: 19.4, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Indian Mackerel (Rastrelliger kanagurta, Baked Flesh)', calories: 148, protein: 21.4, carbs: 0.0, fat: 6.8, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Bombay Duck (Harpadon nehereus, Fresh Raw Flesh)', calories: 52, protein: 11.2, carbs: 0.0, fat: 0.8, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Bombay Duck (Sun-Dried Shutki Flesh)', calories: 294, protein: 61.8, carbs: 0.0, fat: 3.8, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Black Tiger Shrimp / Prawn (Penaeus monodon, Boiled Meat)', calories: 99, protein: 22.8, carbs: 0.2, fat: 0.8, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Mud Crab (Scylla serrata, Steamed Meat)', calories: 94, protein: 20.1, carbs: 0.0, fat: 1.2, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Indian Oil Sardine (Sardinella longiceps, Baked Flesh)', calories: 154, protein: 20.8, carbs: 0.0, fat: 7.6, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Silver Pomfret (Pampus argenteus, Steamed Flesh)', calories: 112, protein: 20.4, carbs: 0.0, fat: 3.2, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'Black Pomfret (Parastromateus niger, Baked Flesh)', calories: 122, protein: 21.2, carbs: 0.0, fat: 4.1, fiber: 0.0, category: 'Fish and Seafood' },
  { name: 'King Seer Fish / Surmai (Scomberomorus commerson, Grilled Steak)', calories: 136, protein: 22.8, carbs: 0.0, fat: 4.8, fiber: 0.0, category: 'Fish and Seafood' },

  // 5. AFACI Asian Food Composition Database
  { name: 'Kimchi (Traditional Korean Fermented Napa Cabbage with Radish & Chili)', calories: 23, protein: 1.9, carbs: 3.4, fat: 0.4, fiber: 2.2, category: 'Vegetables and Sabzi' },
  { name: 'Gochujang (Korean Fermented Red Chili Glutinous Rice Paste)', calories: 218, protein: 4.8, carbs: 45.6, fat: 1.8, fiber: 4.2, category: 'Condiments and Spices' },
  { name: 'Doenjang (Traditional Korean Fermented Soybean Paste)', calories: 148, protein: 12.4, carbs: 14.8, fat: 4.2, fiber: 5.6, category: 'Condiments and Spices' },
  { name: 'Bibimbap (Korean Warm Rice with Sautéed Vegetables, Egg & Gochujang)', calories: 142, protein: 5.6, carbs: 22.8, fat: 3.4, fiber: 2.1, category: 'Rice and Grain Dishes' },
  { name: 'Japchae (Korean Stir-Fried Sweet Potato Glass Noodles with Beef & Vegetables)', calories: 168, protein: 4.6, carbs: 26.4, fat: 5.2, fiber: 1.8, category: 'Rice and Grain Dishes' },
  { name: 'Bulgogi (Korean Thin Sliced Marinated Grilled Beef Ribeye)', calories: 214, protein: 21.8, carbs: 7.2, fat: 10.6, fiber: 0.4, category: 'Meat and Poultry' },
  { name: 'Tteokbokki (Korean Chewy Cylindrical Rice Cakes in Sweet Spicy Gochujang Sauce)', calories: 178, protein: 3.8, carbs: 36.8, fat: 1.8, fiber: 1.6, category: 'Snacks and Chaat' },
  { name: 'Samgyetang (Korean Ginseng Chicken Soup with Sweet Glutinous Rice & Jujubes)', calories: 118, protein: 11.2, carbs: 8.6, fat: 4.2, fiber: 0.6, category: 'Chicken and Poultry' },
  { name: 'Sundubu Jjigae (Korean Spicy Soft Tofu Stew with Clams & Egg)', calories: 84, protein: 6.8, carbs: 4.2, fat: 4.6, fiber: 1.2, category: 'Vegetarian Curries and Paneer' },

  // 6. Nepalese Food Composition Table (DFTQC / FAO)
  { name: 'Gundruk (Traditional Nepalese Fermented & Sun-Dried Mustard Green Leaves)', calories: 36, protein: 3.8, carbs: 4.2, fat: 0.4, fiber: 3.6, category: 'Green Leafy Vegetables' },
  { name: 'Dhindo / Dheedho (Nepalese Traditional Buckwheat / Millet Porridge Dough)', calories: 142, protein: 3.8, carbs: 29.8, fat: 0.8, fiber: 2.8, category: 'Cereals and Millets' },
  { name: 'Sel Roti (Nepalese Traditional Ring-Shaped Sweet Crispy Rice Bread Doughnut)', calories: 348, protein: 4.8, carbs: 58.4, fat: 11.2, fiber: 1.2, category: 'Baked Products' },
  { name: 'Kwati (Nepalese Sprouted Nine-Bean Protein Soup with Spices & Ghee)', calories: 124, protein: 7.8, carbs: 18.6, fat: 2.4, fiber: 5.6, category: 'Grain Legumes and Pulses' },
  { name: 'Aloo Tama (Nepalese Potato, Fermented Bamboo Shoot & Black-Eyed Pea Curry)', calories: 88, protein: 3.2, carbs: 14.8, fat: 1.8, fiber: 3.1, category: 'Vegetables and Sabzi' },
  { name: 'Nepalese Steamed Chicken Momo (Spiced Minced Chicken Dumplings)', calories: 176, protein: 11.4, carbs: 20.8, fat: 5.2, fiber: 1.1, category: 'Snacks and Chaat' },
  { name: 'Bara / Woh (Newari Savory Spiced Black Lentil / Moong Lentil Patty, Pan-Fried)', calories: 224, protein: 10.2, carbs: 28.4, fat: 7.8, fiber: 4.6, category: 'Snacks and Chaat' },
  { name: 'Yomari (Newari Steamed Rice Flour Dumpling Stuffed with Chaku Jaggery & Sesame)', calories: 268, protein: 3.6, carbs: 54.2, fat: 4.2, fiber: 2.1, category: 'Indian Sweets and Mithai' },
  { name: 'Sukuti (Nepalese Spiced Sun-Dried Buffalo / Goat Meat Jerky)', calories: 284, protein: 54.2, carbs: 1.4, fat: 7.2, fiber: 0.4, category: 'Meat and Poultry' },
  { name: 'Choila (Newari Charcoal-Smoked Spiced Marinated Buffalo / Meat)', calories: 218, protein: 24.6, carbs: 2.1, fat: 12.4, fiber: 0.6, category: 'Meat and Poultry' },

  // 7. Bangladesh Food Composition Table (FCTB / INFS / FAO)
  { name: 'Shorshe Ilish (Traditional Bengali Hilsa Fish in Mustard Paste Gravy)', calories: 248, protein: 17.8, carbs: 3.4, fat: 18.2, fiber: 1.2, category: 'Fish and Seafood' },
  { name: 'Rui Macher Kalia (Bengali Rohu Fish Rich Onion-Ginger-Spiced Curry)', calories: 154, protein: 15.6, carbs: 4.6, fat: 8.2, fiber: 1.1, category: 'Fish and Seafood' },
  { name: 'Chingri Malai Curry (Bengali Jumbo Prawns Simmered in Spiced Coconut Cream)', calories: 188, protein: 14.2, carbs: 5.6, fat: 12.4, fiber: 1.2, category: 'Fish and Seafood' },
  { name: 'Alu Bhorta (Bengali Mashed Potato with Mustard Oil, Roasted Red Chili & Onion)', calories: 122, protein: 2.2, carbs: 18.4, fat: 4.4, fiber: 2.1, category: 'Vegetables and Sabzi' },
  { name: 'Begun Bhorta (Bengali Char-Smoked Mashed Eggplant with Mustard Oil & Garlic)', calories: 76, protein: 1.8, carbs: 7.2, fat: 4.8, fiber: 3.2, category: 'Vegetables and Sabzi' },
  { name: 'Shutki Bhorta (Spicy Bangladeshi Dry Fish Mash with Mustard Oil, Onion & Chili)', calories: 168, protein: 19.4, carbs: 4.2, fat: 7.8, fiber: 1.6, category: 'Fish and Seafood' },
  { name: 'Dhaka Morog Polao (Fragrant Chinigura Rice Cooked with Tender Spiced Chicken & Ghee)', calories: 194, protein: 9.8, carbs: 23.4, fat: 7.1, fiber: 1.1, category: 'Chicken and Poultry' },
  { name: 'Bhuna Khichuri (Bengali Roast Moong Dal & Rice with Mustard Oil & Whole Spices)', calories: 162, protein: 5.8, carbs: 26.2, fat: 4.1, fiber: 2.4, category: 'Rice and Grain Dishes' },
  { name: 'Chotpoti (Bangladeshi Spiced White Pea Chaat with Boiled Egg, Potato & Tamarind Water)', calories: 136, protein: 6.4, carbs: 22.8, fat: 2.2, fiber: 4.6, category: 'Snacks and Chaat' },
  { name: 'Fuchka (Bangladeshi Crispy Puris Filled with Spiced Pea Mash & Tangy Tamarind Tok)', calories: 158, protein: 4.6, carbs: 26.4, fat: 3.8, fiber: 2.8, category: 'Snacks and Chaat' },
  { name: 'Panta Ilish (Fermented Boiled Rice Soaked in Water Served with Fried Hilsa & Chili)', calories: 178, protein: 9.4, carbs: 24.2, fat: 4.8, fiber: 0.8, category: 'Rice and Grain Dishes' },
  { name: 'Kacchi Biryani (Old Dhaka Style Fragrant Rice Layered with Raw Spiced Mutton & Potatoes)', calories: 218, protein: 11.4, carbs: 22.8, fat: 9.2, fiber: 1.2, category: 'Meat and Poultry' },

  // 8. Indonesia Food Composition Table (TKPI / Panganku)
  { name: 'Tempeh / Tempe Kedelai (Raw Fermented Soybean Cake)', calories: 192, protein: 20.8, carbs: 7.6, fat: 10.8, fiber: 4.8, category: 'Grain Legumes and Pulses' },
  { name: 'Tempe Goreng (Crispy Indonesian Pan-Fried Spiced Tempeh Slices)', calories: 268, protein: 18.2, carbs: 9.4, fat: 18.0, fiber: 4.2, category: 'Grain Legumes and Pulses' },
  { name: 'Tempe Bacem (Sweet Braised Tempeh in Palm Sugar, Coriander & Coconut Water)', calories: 224, protein: 16.4, carbs: 18.8, fat: 9.2, fiber: 3.8, category: 'Grain Legumes and Pulses' },
  { name: 'Rendang Daging Sapi (Padang Slow-Braised Spiced Beef in Caramelized Coconut Gravy)', calories: 242, protein: 22.4, carbs: 4.8, fat: 14.8, fiber: 1.4, category: 'Meat and Poultry' },
  { name: 'Gado-Gado (Indonesian Steamed Vegetable Salad with Fried Tofu, Egg & Rich Peanut Sauce)', calories: 156, protein: 6.8, carbs: 14.2, fat: 8.4, fiber: 3.4, category: 'Vegetables and Sabzi' },
  { name: 'Soto Ayam (Indonesian Fragrant Turmeric Chicken Soup with Glass Noodles & Egg)', calories: 104, protein: 8.8, carbs: 8.4, fat: 3.8, fiber: 0.8, category: 'Chicken and Poultry' },
  { name: 'Sate Ayam Madura (Grilled Chicken Skewers Glazed with Sweet Soy & Peanut Sauce)', calories: 218, protein: 20.4, carbs: 7.8, fat: 11.6, fiber: 1.2, category: 'Chicken and Poultry' },
  { name: 'Bakso Sapi (Indonesian Springy Beef Meatball Soup with Noodles & Crisp Shallots)', calories: 134, protein: 10.2, carbs: 14.6, fat: 3.8, fiber: 0.8, category: 'Meat and Poultry' },
  { name: 'Sayur Asem (Indonesian Sweet and Sour Tamarind Vegetable Soup with Chayote & Corn)', calories: 46, protein: 1.8, carbs: 8.4, fat: 0.6, fiber: 2.1, category: 'Vegetables and Sabzi' },
  { name: 'Sambal Terasi (Indonesian Fresh Red Chili Paste with Toasted Shrimp Paste)', calories: 112, protein: 4.8, carbs: 14.6, fat: 4.1, fiber: 3.6, category: 'Condiments and Spices' },
  { name: 'Pempek Palembang (Indonesian Savory Fish Cake with Tangy Sweet Cuko Vinegar Sauce)', calories: 174, protein: 11.8, carbs: 23.4, fat: 3.8, fiber: 0.8, category: 'Fish and Seafood' },
  { name: 'Nasi Uduk (Betawi Steamed Coconut Milk Fragrant Rice with Spices)', calories: 178, protein: 3.8, carbs: 28.4, fat: 5.6, fiber: 1.2, category: 'Rice and Grain Dishes' },
  { name: 'Ayam Goreng Lengkuas (Indonesian Fried Chicken with Crispy Shredded Galangal Flakes)', calories: 236, protein: 24.8, carbs: 2.4, fat: 14.2, fiber: 0.6, category: 'Chicken and Poultry' }
];

fs.writeFileSync(path.join(__dirname, 'data_south_asian_master.json'), JSON.stringify(masterItems, null, 2), 'utf8');
console.log(`✅ Generated master South Asian & FAO dataset: ${masterItems.length} items`);
