/**
 * Massive Indian Food Dataset Builder
 * Generates thousands of authentic Indian dishes, regional preparations, street foods,
 * sweets, beverages, millets, vegetables, fruits, and proteins.
 */

const fs = require('fs');
const path = require('path');

const catalog = [];

function addFood(name, cat, portion, cal, prot, carb, fat, fib) {
  catalog.push({
    name,
    category: cat,
    portion_description: portion,
    base_amount: 100,
    base_unit: 'g',
    calories: cal,
    protein: prot,
    carbs: carb,
    fat: fat,
    fiber: fib,
  });
}

// -----------------------------------------------------------------------------
// 1. SOUTH INDIAN (TAMIL, KERALA, KARNATAKA, ANDHRA, TELANGANA)
// -----------------------------------------------------------------------------
// Idli & Paniyaram Varieties
addFood('Idli / Idly (Traditional Steamed Rice & Urad Dal Cake)', 'Breakfast foods', '2 medium idlis (80g)', 132, 4.4, 27.2, 0.4, 1.4);
addFood('Idli / Idly (Home-Style Steamed, Soft & Fluffy)', 'Breakfast foods', '2 idlis (80g)', 128, 4.2, 26.8, 0.3, 1.2);
addFood('Mini Ghee Podi Idli / Idly (Tossed in Gunpowder Podi & Pure Ghee)', 'Breakfast foods', '14 mini idlis (150g)', 214, 5.8, 29.4, 8.6, 2.4);
addFood('Kanchipuram Idli / Idly (Steamed with Cumin, Pepper, Ginger & Cashews in Banana Leaf)', 'Breakfast foods', '1 large idli (100g)', 168, 5.2, 26.4, 4.8, 1.8);
addFood('Ragi Idli / Idly (Finger Millet & Urad Dal Steamed Cakes)', 'Breakfast foods', '2 idlis (90g)', 122, 4.6, 24.8, 0.6, 3.4);
addFood('Foxtail Millet Idli / Thinai Idly (Nutrient-Dense Steamed Cakes)', 'Breakfast foods', '2 idlis (90g)', 126, 4.8, 25.1, 0.8, 3.2);
addFood('Little Millet Idli / Samai Idly (Fiber-Rich Steamed Cakes)', 'Breakfast foods', '2 idlis (90g)', 124, 4.5, 24.6, 0.7, 3.1);
addFood('Kodo Millet Idli / Varagu Idly (Low Glycemic Steamed Cakes)', 'Breakfast foods', '2 idlis (90g)', 125, 4.4, 25.2, 0.6, 3.5);
addFood('Barnyard Millet Idli / Kuthiraivali Idly (Light Steamed Millet Cakes)', 'Breakfast foods', '2 idlis (90g)', 120, 4.2, 24.1, 0.5, 3.8);
addFood('Oats Idli / Idly (Steamed Rolled Oats, Semolina & Curd Cakes)', 'Breakfast foods', '2 idlis (90g)', 142, 5.4, 24.2, 2.8, 2.6);
addFood('Rava Idli / Idly (Steamed Semolina Cakes with Mustard, Ginger & Cashews)', 'Breakfast foods', '2 idlis (100g)', 148, 4.6, 27.4, 2.4, 1.6);
addFood('Thatte Idli / Idly (Karnataka Plate-Sized Soft Steamed Rice Cake with Butter)', 'Breakfast foods', '1 thatte idli (140g)', 164, 4.8, 31.2, 2.2, 1.6);
addFood('Kotte Kadubu (Karnataka Idli Batter Steamed in Jackfruit Leaf Baskets)', 'Breakfast foods', '2 kadubus (120g)', 134, 4.3, 27.6, 0.4, 1.6);
addFood('Kuzhi Paniyaram / Paddu / Appey (Savory Spiced Rice & Lentil Dumplings)', 'Breakfast foods', '6 pieces (120g)', 184, 4.8, 28.6, 5.8, 2.2);
addFood('Sweet Kuzhi Paniyaram / Unniyappam (Rice Flour, Jaggery, Banana & Coconut Fritters)', 'Indian Sweets and Mithai', '4 pieces (100g)', 268, 3.6, 52.4, 5.2, 2.1);

// Dosa / Dosai Varieties
addFood('Plain Dosa / Dosai (Crispy Fermented Rice & Lentil Crepe)', 'Breakfast foods', '1 dosa (80g)', 168, 3.9, 29.4, 3.7, 1.4);
addFood('Ghee Roast Dosa / Dosai (Crisp Golden Crepe Roasted with Pure Desi Ghee)', 'Breakfast foods', '1 large dosa (100g)', 248, 4.2, 31.2, 11.8, 1.4);
addFood('Butter Dosa / Benne Dose (Davanagere Butter Dosa with Fresh White Butter)', 'Breakfast foods', '1 dosa (120g)', 268, 4.4, 32.4, 13.4, 1.6);
addFood('Masala Dosa / Dosai (Crispy Crepe Filled with Spiced Potato Mash)', 'Breakfast foods', '1 masala dosa (150g)', 186, 4.1, 28.4, 6.2, 2.2);
addFood('Mysore Masala Dosa / Dosai (Crisp Dosa with Red Garlic Chutney & Potato Mash)', 'Breakfast foods', '1 dosa (170g)', 212, 4.6, 29.8, 8.4, 2.6);
addFood('Set Dosa / Dosai (Soft Spongy Thick Dosas Served with Sagu & Chutney)', 'Breakfast foods', '3 small set dosas (150g)', 162, 4.2, 28.6, 3.4, 1.6);
addFood('Rava Dosa / Dosai (Crispy Lacey Semolina & Rice Flour Crepe)', 'Breakfast foods', '1 large dosa (100g)', 208, 4.4, 32.8, 6.8, 1.8);
addFood('Onion Rava Dosa / Dosai (Lacey Semolina Crepe Embedded with Diced Onions & Green Chilies)', 'Breakfast foods', '1 large dosa (120g)', 218, 4.6, 33.4, 7.2, 2.1);
addFood('Rava Masala Dosa / Dosai (Lacey Crispy Rava Crepe with Potato Masala)', 'Breakfast foods', '1 dosa (160g)', 204, 4.3, 30.8, 7.4, 2.4);
addFood('Neer Dosa / Dosai (Mangalorean Ultra-Soft Delicate Rice Crepe)', 'Breakfast foods', '3 neer dosas (120g)', 142, 2.6, 28.4, 1.8, 0.8);
addFood('Pesarattu (Andhra Moong Green Gram Crepe with Ginger & Cumin)', 'Breakfast foods', '1 large dosa (110g)', 198, 9.4, 31.8, 3.8, 4.8);
addFood('MLA Pesarattu (Andhra Whole Green Gram Dosa Stuffed with Upma)', 'Breakfast foods', '1 large stuffed dosa (180g)', 204, 7.8, 32.6, 4.8, 4.2);
addFood('Onion Pesarattu (Green Moong Crepe Topped with Sautéed Onions & Green Chilies)', 'Breakfast foods', '1 dosa (130g)', 192, 8.8, 31.2, 3.6, 4.6);
addFood('Adai (Tamil Multi-Lentil Protein Rich Pancake with Toor, Chana, Moong & Urad)', 'Breakfast foods', '1 large adai (120g)', 214, 8.6, 31.4, 6.2, 5.4);
addFood('Kal Dosa / Dosai (Soft Spongy Thick Tamil Nadu Tawa Crepe)', 'Breakfast foods', '2 kal dosas (140g)', 158, 3.8, 28.2, 3.1, 1.4);
addFood('Ragi Dosa / Dosai (Finger Millet & Rice Healthy Crepe)', 'Breakfast foods', '1 dosa (90g)', 154, 4.2, 27.6, 3.2, 3.6);
addFood('Wheat Dosa / Godhumai Dosai (Instant Whole Wheat Flour Pancake)', 'Breakfast foods', '2 dosas (100g)', 178, 5.8, 31.2, 3.6, 4.2);
addFood('Oats Dosa / Dosai (Quick Rolled Oats, Rice Flour & Buttermilk Crepe)', 'Breakfast foods', '1 dosa (90g)', 164, 5.2, 26.8, 4.1, 3.1);
addFood('Podi Dosa / Dosai (Crispy Crepe Smeared with Spicy Idli Podi & Sesame Oil)', 'Breakfast foods', '1 dosa (100g)', 236, 4.9, 29.8, 11.2, 2.8);
addFood('Cheese Dosa / Dosai (Crispy Dosa Stuffed with Melted Cheddar & Mozzarella)', 'Breakfast foods', '1 dosa (130g)', 248, 7.8, 27.4, 12.2, 1.4);
addFood('Paneer Dosa / Dosai (Crispy Crepe Stuffed with Spiced Grated Cottage Cheese)', 'Breakfast foods', '1 dosa (160g)', 224, 8.6, 26.8, 9.4, 2.1);
addFood('Egg Dosa / Muttai Dosai (Crispy Crepe Topped with Spiced Beaten Egg, Pepper & Curry Leaves)', 'Breakfast foods', '1 egg dosa (140g)', 218, 9.8, 24.6, 8.8, 1.2);
addFood('Chicken Dosa / Kari Dosai (Madurai Famous Thick Dosa Topped with Spicy Minced Chicken Gravy & Egg)', 'Chicken and Poultry', '1 kari dosa (220g)', 232, 14.8, 21.4, 9.8, 1.6);
addFood('Mutton Kari Dosa / Dosai (Madurai Style Thick Crepe Topped with Spicy Mutton Keema & Egg)', 'Meat and Poultry', '1 kari dosa (240g)', 246, 15.6, 20.8, 11.4, 1.4);

// Uthappam Varieties
addFood('Plain Uthappam (Thick Soft Fermented Rice & Lentil Pancake)', 'Breakfast foods', '1 uthappam (100g)', 158, 3.8, 28.4, 3.2, 1.4);
addFood('Onion Uthappam (Thick Savory Pancake Embedded with Caramelized Onions)', 'Breakfast foods', '1 uthappam (130g)', 168, 4.2, 28.8, 3.9, 2.1);
addFood('Tomato Uthappam (Thick Rice Pancake Topped with Juicy Diced Tomatoes & Cilantro)', 'Breakfast foods', '1 uthappam (130g)', 154, 3.9, 27.4, 3.4, 1.9);
addFood('Onion Tomato Uthappam (Thick Pancake Topped with Diced Onions, Tomatoes & Green Chilies)', 'Breakfast foods', '1 uthappam (140g)', 162, 4.1, 28.2, 3.6, 2.2);
addFood('Podi Uthappam (Thick Soft Pancake Sprinkled Generously with Spicy Gunpowder & Ghee)', 'Breakfast foods', '1 uthappam (120g)', 228, 4.8, 29.4, 10.2, 2.4);
addFood('Mix Veg Uthappam (Topped with Grated Carrots, Capsicum, Onions & Green Peas)', 'Breakfast foods', '1 uthappam (150g)', 164, 4.4, 28.6, 3.6, 2.8);
addFood('Cheese Uthappam (Thick Tawa Pancake Topped with Melted Cheese, Onion & Herbs)', 'Breakfast foods', '1 uthappam (140g)', 234, 7.6, 26.8, 10.8, 1.6);

// Appam, Puttu, Idiyappam & Parotta
addFood('Appam / Palappam (Kerala Lacy Fermented Rice & Coconut Milk Bowl Hopper)', 'Breakfast foods', '2 appams (100g)', 138, 2.4, 28.2, 1.8, 1.2);
addFood('Egg Appam / Muttai Appam (Kerala Appam with a Whole Poached Egg in the Soft Center)', 'Breakfast foods', '1 egg appam (90g)', 168, 6.8, 18.2, 7.4, 0.8);
addFood('Kallappam / Vellayappam (Thick Spongy Kerala Toddys / Yeast Rice Pancake with Cumin & Shallots)', 'Breakfast foods', '2 pieces (120g)', 152, 2.8, 29.4, 2.2, 1.4);
addFood('Idiyappam / Nool Puttu / String Hoppers (Steamed Delicate Rice Noodle Nests)', 'Breakfast foods', '3 nests (120g)', 124, 2.1, 27.4, 0.4, 1.1);
addFood('Ragi Idiyappam / Sevai (Finger Millet Steamed String Noodle Nests)', 'Breakfast foods', '3 nests (120g)', 118, 2.8, 25.2, 0.6, 3.2);
addFood('Lemon Sevai / Lemon Idiyappam (Rice Noodles Tempered with Lemon Juice, Mustard & Peanuts)', 'Breakfast foods', '1 plate (180g)', 168, 3.4, 28.6, 4.8, 1.6);
addFood('Coconut Sevai (Rice Noodles Tossed with Fresh Grated Coconut, Mustard & Curry Leaves)', 'Breakfast foods', '1 plate (180g)', 188, 3.2, 27.8, 7.2, 2.4);
addFood('Puttu (Kerala Steamed Cylindrical Coarse Rice Flour Layered with Fresh Grated Coconut)', 'Breakfast foods', '1 piece (140g)', 172, 3.6, 32.8, 3.2, 2.4);
addFood('Ragi Puttu (Steamed Finger Millet Flour Layered with Fresh Grated Coconut)', 'Breakfast foods', '1 piece (140g)', 164, 4.2, 30.6, 3.0, 4.6);
addFood('Wheat Puttu (Steamed Coarse Whole Wheat Flour Layered with Coconut)', 'Breakfast foods', '1 piece (140g)', 168, 4.8, 31.4, 2.8, 4.2);
addFood('Pathiri (Malabar Thin Soft Steamed Rice Flour Flatbread)', 'Roti and Indian Breads', '2 pathiris (60g)', 134, 2.2, 29.8, 0.4, 0.9);
addFood('Malabar Parotta / Kerala Parotta (Flaky Multi-Layered Pan-Fried Flatbread with Oil)', 'Roti and Indian Breads', '1 parotta (80g)', 324, 6.8, 46.2, 12.6, 1.8);
addFood('Coin Parotta (Mini Multi-Layered Crispy Malabar Parotta)', 'Roti and Indian Breads', '2 mini parottas (70g)', 328, 6.9, 46.4, 12.8, 1.8);
addFood('Veg Kothu Parotta (Shredded Parotta Stir-Fried with Vegetables, Salna Curry & Spices)', 'Rice and Grain Dishes', '1 plate (280g)', 214, 5.2, 29.4, 8.8, 3.2);
addFood('Egg Kothu Parotta (Shredded Parotta Stir-Fried with Scrambled Eggs, Onions & Salna)', 'Rice and Grain Dishes', '1 plate (300g)', 238, 9.4, 26.8, 10.6, 2.4);
addFood('Chicken Kothu Parotta (Shredded Parotta Stir-Fried with Spiced Chicken Pieces, Egg & Salna Gravy)', 'Chicken and Poultry', '1 plate (320g)', 256, 14.2, 24.6, 11.4, 2.2);
addFood('Mutton Kothu Parotta (Shredded Parotta Stir-Fried with Tender Mutton Chukka, Egg & Salna)', 'Meat and Poultry', '1 plate (320g)', 268, 15.4, 23.8, 12.8, 2.1);

// Vada, Bonda & Snack Varieties
addFood('Medu Vada / Ulundu Vadai (Crispy Golden Fried Urad Dal Donut Fritter)', 'Snacks and Chaat', '2 vadas (80g)', 248, 7.4, 26.8, 12.4, 3.6);
addFood('Sambar Vada / Vadai (Crispy Medu Vadas Soaked in Hot Drumstick Sambar)', 'Snacks and Chaat', '2 vadas with sambar (220g)', 154, 5.2, 19.4, 6.2, 2.8);
addFood('Dahi Vada / Thayir Vadai (Medu Vadas Soaked in Whisked Creamy Curd with Boondi & Mustard)', 'Snacks and Chaat', '2 vadas with curd (200g)', 162, 6.4, 18.2, 7.1, 2.2);
addFood('Rasa Vada / Vadai (Medu Vadas Soaked in Piping Hot Pepper Tomato Rasam)', 'Snacks and Chaat', '2 vadas with rasam (220g)', 138, 4.8, 18.6, 5.2, 2.4);
addFood('Masala Vada / Paruppu Vadai (Crispy Crunchy Chana Dal Fritters with Fennel & Onions)', 'Snacks and Chaat', '2 vadas (70g)', 268, 8.9, 29.4, 13.2, 5.2);
addFood('Keerai Vada / Vadai (Crispy Chana Dal Fritters Packed with Fresh Spinach / Amaranth Leaves)', 'Snacks and Chaat', '2 vadas (70g)', 252, 8.4, 27.8, 12.2, 5.8);
addFood('Mysore Bonda / Mangalore Bajji (Crispy Deep-Fried Maida & Curd Fluffy Fritters)', 'Snacks and Chaat', '3 bondas (90g)', 284, 6.2, 36.8, 12.4, 1.8);
addFood('Aloo Bonda / Potato Bonda (Spiced Potato Balls Dipped in Besan Batter & Deep Fried)', 'Snacks and Chaat', '2 bondas (100g)', 232, 4.6, 28.2, 11.2, 2.4);
addFood('Pazham Pori / Ethakka Appam (Kerala Sweet Ripe Nendran Banana Fritters in Crisp Batter)', 'Snacks and Chaat', '2 pieces (100g)', 238, 2.6, 42.4, 6.8, 2.4);
addFood('Neyyappam (Kerala Traditional Sweet Fried Rice & Jaggery Cakes in Pure Ghee)', 'Indian Sweets and Mithai', '2 pieces (80g)', 342, 3.4, 56.8, 11.6, 1.8);
addFood('Kozhukattai / Modak (Steamed Rice Flour Dumpling Stuffed with Coconut & Jaggery)', 'Indian Sweets and Mithai', '2 pieces (80g)', 224, 3.2, 44.8, 3.8, 1.8);

// Pongal & Upma Varieties
addFood('Ven Pongal / Ghee Pongal (Comforting Rice & Yellow Moong Dal Khichdi with Ghee, Cashews & Cumin)', 'Breakfast foods', '1 plate (200g)', 178, 5.6, 26.2, 5.8, 2.2);
addFood('Rava Pongal (Semolina & Moong Dal Cooked with Ghee, Black Pepper, Ginger & Cashews)', 'Breakfast foods', '1 plate (200g)', 184, 5.4, 27.4, 6.2, 2.0);
addFood('Millet Pongal / Thinai Pongal (Foxtail Millet & Moong Dal Healthy Ghee Khichdi)', 'Breakfast foods', '1 plate (200g)', 164, 5.8, 24.8, 4.8, 3.6);
addFood('Rava Upma / Uppittu (Roasted Semolina Cooked with Mustard, Ginger, Curry Leaves & Veggies)', 'Breakfast foods', '1 bowl (180g)', 154, 3.8, 25.8, 4.2, 1.8);
addFood('Semiya Upma / Vermicelli Upma (Wheat Vermicelli Sautéed with Vegetables & Mustard Tempering)', 'Breakfast foods', '1 bowl (180g)', 162, 4.1, 27.2, 4.4, 1.9);
addFood('Aval Upma / Poha Upma (South Indian Flattened Rice Upma with Mustard, Peanuts & Lemon)', 'Breakfast foods', '1 plate (180g)', 174, 3.9, 28.4, 5.2, 2.2);
addFood('Ragi Upma (Coarse Finger Millet Upma with Mustard & Green Chilies)', 'Breakfast foods', '1 bowl (180g)', 146, 4.4, 24.6, 3.6, 4.2);
addFood('Millet Upma (Mixed Barnyard & Little Millet Upma with Diced Carrots & Beans)', 'Breakfast foods', '1 bowl (180g)', 148, 4.6, 24.8, 3.8, 3.8);

// Flavored South Indian Rice Varieties
addFood('Bisi Bele Bath (Karnataka Authentic Rice, Toor Dal & Mixed Veg Stew with Ghee & Spices)', 'Rice and Grain Dishes', '1 bowl (250g)', 142, 4.8, 22.4, 3.8, 2.6);
addFood('Vangi Bath (Karnataka Spiced Brinjal Eggplant Rice with Vangi Bath Masala Powder & Ghee)', 'Rice and Grain Dishes', '1 plate (220g)', 164, 3.4, 27.8, 4.8, 2.4);
addFood('Puliyodarai / Tamarind Rice (Tamil Nadu Temple Style Rice in Tangy Spiced Tamarind Paste)', 'Rice and Grain Dishes', '1 plate (220g)', 186, 3.6, 32.4, 4.6, 2.1);
addFood('Lemon Rice / Chitranna (Rice Tempered with Turmeric, Fresh Lemon Juice, Peanuts & Curry Leaves)', 'Rice and Grain Dishes', '1 plate (220g)', 178, 3.4, 29.8, 5.2, 1.8);
addFood('Coconut Rice / Thengai Sadam (Rice Tossed with Fresh Grated Coconut, Cashews & Mustard)', 'Rice and Grain Dishes', '1 plate (200g)', 198, 3.6, 28.2, 8.2, 2.8);
addFood('Tomato Rice / Thakkali Sadam (Spiced Rice Cooked in Tangy Sautéed Onion Tomato Masala)', 'Rice and Grain Dishes', '1 plate (220g)', 168, 3.2, 27.4, 4.9, 2.1);
addFood('Curd Rice / Thayir Sadam / Daddojanam (Soft Mashed Rice in Fresh Curd with Mustard & Ginger Tempering)', 'Rice and Grain Dishes', '1 bowl (220g)', 132, 3.8, 20.4, 3.8, 0.8);
addFood('Sambar Rice / Sambar Sadam (Soft Rice Simmered with Vegetable Sambar & Ghee)', 'Rice and Grain Dishes', '1 bowl (250g)', 136, 4.2, 22.6, 3.2, 2.6);
addFood('Rasam Rice / Rasam Sadam (Steamed Rice Mixed with Aromatic Pepper Cumin Tomato Rasam & Ghee)', 'Rice and Grain Dishes', '1 bowl (220g)', 118, 2.8, 21.4, 2.4, 1.2);

// Sambars, Rasams & Kuzhambus
addFood('Traditional Drumstick Sambar / Murungakkai Sambar (Toor Dal Stew with Drumsticks & Shallots)', 'Dal and Lentil Dishes', '1 bowl (200g)', 78, 3.8, 10.8, 2.1, 2.8);
addFood('Shallot Sambar / Chinna Vengaya Sambar (Tamil Nadu Style Sweet-Tart Sambar with Small Onions)', 'Dal and Lentil Dishes', '1 bowl (200g)', 82, 3.6, 11.4, 2.4, 2.6);
addFood('Udupi Sambar (Karnataka Style Sweet & Tangy Toor Dal Sambar with Jaggery & Coconut)', 'Dal and Lentil Dishes', '1 bowl (200g)', 92, 3.9, 13.8, 2.4, 2.8);
addFood('Tomato Rasam / Thakkali Rasam (Tangy Aromatic Broth with Ripe Tomatoes, Tamarind & Spices)', 'Dal and Lentil Dishes', '1 cup (150ml)', 42, 1.2, 6.8, 1.1, 0.8);
addFood('Pepper Rasam / Milagu Rasam (Spicy Medicinal Black Pepper, Garlic & Cumin Broth)', 'Dal and Lentil Dishes', '1 cup (150ml)', 38, 1.4, 5.8, 1.0, 0.9);
addFood('Mysore Rasam (Rich Aromatic Rasam with Roasted Coriander, Chana Dal & Grated Coconut)', 'Dal and Lentil Dishes', '1 cup (150ml)', 56, 1.8, 7.8, 2.1, 1.2);
addFood('Garlic Rasam / Poondu Rasam (Digestive Broth with Crushed Whole Garlic Cloves & Black Pepper)', 'Dal and Lentil Dishes', '1 cup (150ml)', 46, 1.6, 6.4, 1.6, 0.8);
addFood('Mor Kuzhambu / Pulissery (South Indian Spiced Buttermilk & Coconut Curry with Ash Gourd)', 'Vegetables and Sabzi', '1 bowl (180g)', 86, 2.8, 6.8, 5.2, 1.4);
addFood('Vatha Kuzhambu (Sundakkai / Manathakkali Dried Berries in Spicy Tangy Tamarind Gravy)', 'Condiments and Spices', '1/2 cup (100g)', 118, 1.8, 14.2, 6.2, 2.4);
addFood('Ennai Kathirikai Kuzhambu (Chettinad Baby Brinjals in Rich Spiced Roasted Sesame Tamarind Paste)', 'Vegetables and Sabzi', '1 bowl (180g)', 138, 2.6, 11.4, 9.2, 3.8);

// Kerala Sadya & South Indian Veg Sides
addFood('Avial (Kerala Sadya Mixed Vegetables Stewed in Fresh Crushed Coconut, Cumin & Curd Gravy)', 'Vegetables and Sabzi', '1 bowl (180g)', 108, 2.6, 11.2, 5.8, 3.4);
addFood('Cabbage Poriyal / Thoran (Finely Shredded Cabbage Stir-Fried with Mustard, Green Chili & Coconut)', 'Vegetables and Sabzi', '1 cup (150g)', 78, 2.2, 7.6, 4.4, 2.8);
addFood('Beans Poriyal / Thoran (French Green Beans Sautéed with Mustard, Urad Dal & Grated Coconut)', 'Vegetables and Sabzi', '1 cup (150g)', 84, 2.8, 8.4, 4.4, 3.6);
addFood('Beetroot Poriyal / Thoran (Grated Beetroot Stir-Fry with Mustard Seeds & Coconut)', 'Vegetables and Sabzi', '1 cup (150g)', 88, 2.1, 11.2, 3.8, 3.2);
addFood('Erissery (Kerala Pumpkin & Red Cowpeas Simmered in Toasted Coconut Paste & Ghee)', 'Vegetables and Sabzi', '1 bowl (180g)', 118, 4.2, 14.6, 4.8, 3.8);
addFood('Olan (Kerala Sadya Mild Stew of Ash Gourd & Red Cowpeas in Rich Coconut Milk)', 'Vegetables and Sabzi', '1 bowl (180g)', 98, 2.8, 7.4, 6.6, 2.4);
addFood('Theeyal (Kerala Roasted Coconut & Tamarind Curry with Shallots or Bitter Gourd)', 'Vegetables and Sabzi', '1 bowl (180g)', 128, 2.4, 10.8, 8.4, 3.6);
addFood('Kalan (Traditional Kerala Sadya Yam & Raw Plantain Stew in Sour Curd & Coconut Gravy)', 'Vegetables and Sabzi', '1 bowl (180g)', 114, 2.6, 12.8, 5.8, 2.8);
addFood('Kerala Vegetable Stew (Mild Aromatic Potatoes, Carrots & Green Peas in Coconut Milk for Appam)', 'Vegetables and Sabzi', '1 bowl (200g)', 124, 2.2, 12.4, 7.4, 2.6);

// South Indian Non-Veg Dishes
addFood('Chicken Chettinad (Aromatic Spicy Pepper & Roasted Coconut Chicken Curry)', 'Chicken and Poultry', '1 serving (220g)', 188, 18.6, 4.2, 10.8, 1.4);
addFood('Chicken 65 (South Indian Deep-Fried Spiced Boneless Chicken Bites with Curry Leaves & Chili)', 'Chicken and Poultry', '6 pieces (150g)', 248, 22.4, 8.6, 13.8, 1.1);
addFood('Pepper Chicken / Kurumulaku Chicken (Spicy Dry Roasted Chicken in Crushed Black Pepper & Garlic)', 'Chicken and Poultry', '1 plate (180g)', 198, 21.2, 3.8, 10.9, 1.2);
addFood('Chicken Sukka / Kori Sukka (Mangalorean Dry Spiced Chicken with Fresh Roasted Coconut)', 'Chicken and Poultry', '1 plate (180g)', 214, 20.8, 4.6, 12.4, 2.1);
addFood('Natu Kozhi Curry (South Indian Village Country Chicken Curry with Whole Spices)', 'Chicken and Poultry', '1 serving (220g)', 178, 19.4, 3.2, 9.8, 0.9);
addFood('Mutton Chukka / Sukka (Chettinad Spicy Dry Roasted Tender Goat Meat with Shallots & Curry Leaves)', 'Meat and Poultry', '1 plate (160g)', 242, 22.8, 3.4, 15.2, 1.1);
addFood('Mutton Chettinad Curry (Rich Spicy Goat Meat Curry in Roasted Poppy Seeds & Coconut Gravy)', 'Meat and Poultry', '1 serving (220g)', 218, 19.8, 4.1, 13.6, 1.2);
addFood('Meen Kuzhambu (Tamil Nadu Tangy Spicy Fish Curry with Shallots, Garlic & Tamarind)', 'Fish and Seafood', '1 serving (200g)', 134, 16.8, 3.6, 5.8, 0.8);
addFood('Kerala Fish Curry / Meen Mulakittathu (Spicy Red Fish Curry with Kudampuli Kokum & Curry Leaves)', 'Fish and Seafood', '1 serving (200g)', 128, 17.2, 2.8, 5.4, 0.6);
addFood('Meen Pollichathu (Kerala Pearl Spot Karimeen Wrapped in Banana Leaf with Shallot-Tomato Masala)', 'Fish and Seafood', '1 whole fish (200g)', 162, 18.6, 3.8, 7.8, 1.1);
addFood('Fish Molee / Meen Moilee (Kerala Mild White Fish Stew in Coconut Milk, Green Chilies & Ginger)', 'Fish and Seafood', '1 serving (220g)', 148, 16.4, 4.2, 7.4, 0.8);
addFood('South Indian Fish Fry (Kingfish / Pomfret Marinated in Red Chili, Lemon & Fennel, Shallow Fried)', 'Fish and Seafood', '1 slice (120g)', 198, 22.4, 3.2, 10.6, 0.4);
addFood('Prawn Masala / Eral Thokku (Spicy South Indian Shrimps Sautéed with Caramelized Onions & Tomato)', 'Fish and Seafood', '1 plate (160g)', 142, 18.2, 5.4, 5.4, 1.2);
addFood('Prawn Fry / Eral Varuval (Dry Roasted Crispy Spiced Prawns with Curry Leaves & Black Pepper)', 'Fish and Seafood', '1 plate (140g)', 178, 21.6, 4.2, 8.2, 0.8);
addFood('Crab Masala / Nandu Masala (South Indian Spicy Mud Crab Curry with Fennel, Cumin & Black Pepper)', 'Fish and Seafood', '1 serving (200g)', 124, 15.8, 4.6, 4.8, 0.8);
addFood('Egg Roast / Muttai Roast (Kerala Style Hard Boiled Eggs in Thick Caramelized Onion Tomato Gravy)', 'Egg Dishes', '2 eggs with roast (160g)', 158, 11.8, 6.4, 9.6, 1.4);
addFood('Egg Poriyal / Muttai Poriyal (South Indian Scrambled Eggs with Onions, Green Chilies & Pepper)', 'Egg Dishes', '1 portion (120g)', 168, 12.4, 3.2, 11.6, 0.6);
addFood('Kerala Beef Fry / Beef Ularthiyathu (Slow-Roasted Tender Beef Chunks with Coconut Slivers & Spices)', 'Meat and Poultry', '1 plate (160g)', 254, 24.8, 2.8, 16.2, 0.8);

// -----------------------------------------------------------------------------
// 2. NORTH INDIAN (PUNJABI, MUGHLAI, AWADHI, RAJASTHANI, KASHMIRI)
// -----------------------------------------------------------------------------
// Dals & Legume Curries
addFood('Rajma Masala (Punjabi Red Kidney Beans Slow-Cooked in Rich Tomato Onion Ginger Gravy)', 'Dal and Lentil Dishes', '1 bowl (220g)', 138, 6.8, 18.6, 4.2, 5.4);
addFood('Amritsari Chole / Chana Masala (Authentic Punjabi Chickpeas Simmered with Anardana & Black Tea Spices)', 'Dal and Lentil Dishes', '1 bowl (220g)', 158, 7.8, 21.4, 4.8, 5.8);
addFood('Pindi Chole (Dry Roasted Rawalpindi Style Chickpeas with Roasted Cumin & Kasuri Methi)', 'Dal and Lentil Dishes', '1 bowl (200g)', 172, 8.4, 22.8, 5.6, 6.2);
addFood('Dal Makhani (Classic Black Urad Lentils & Kidney Beans Slow-Cooked with Butter, Cream & Tomato)', 'Dal and Lentil Dishes', '1 bowl (220g)', 162, 6.4, 16.8, 7.9, 4.2);
addFood('Dal Tadka (Yellow Toor & Moong Lentils Tempered with Ghee, Cumin, Garlic, Onion & Red Chili)', 'Dal and Lentil Dishes', '1 bowl (200g)', 118, 5.8, 14.6, 4.2, 3.6);
addFood('Dal Fry (Yellow Lentils Sautéed with Butter, Onions, Ginger, Garlic & Tomatoes)', 'Dal and Lentil Dishes', '1 bowl (200g)', 128, 5.6, 15.2, 5.2, 3.4);
addFood('Dal Palak (Nutritious Yellow Lentils Cooked with Fresh Pureed Spinach & Mild Spices)', 'Dal and Lentil Dishes', '1 bowl (200g)', 98, 5.4, 12.8, 3.2, 3.8);
addFood('Dal Panchratna / Panchmel Dal (Rajasthani 5-Lentil Protein Rich Curry Tempered in Desi Ghee)', 'Dal and Lentil Dishes', '1 bowl (200g)', 134, 7.2, 16.4, 4.4, 4.6);
addFood('Dal Baati Churma (Rajasthani Baked Wheat Baatis with Panchmel Dal & Sweet Crumb Churma)', 'Rice and Grain Dishes', '2 baatis with dal (300g)', 268, 7.4, 38.6, 9.6, 4.8);
addFood('Kadhi Pakora (Punjabi Sour Curd & Gram Flour Besan Gravy with Crispy Onion Fritters)', 'Vegetarian Curries and Paneer', '1 bowl (220g)', 148, 5.2, 14.6, 7.8, 2.1);
addFood('Kala Chana Curry (Spiced Black Chickpeas Cooked in Onion Tomato Gravy)', 'Dal and Lentil Dishes', '1 bowl (200g)', 142, 7.6, 19.8, 3.8, 6.4);
addFood('Lobia Masala (Black-Eyed Peas Cooked in Punjabi Spiced Onion Tomato Gravy)', 'Dal and Lentil Dishes', '1 bowl (200g)', 126, 6.8, 17.4, 3.4, 5.2);

// Sabzis & Paneer Dishes
addFood('Paneer Butter Masala (Cottage Cheese Cubes in Silky Rich Tomato Cashew Cream Butter Gravy)', 'Vegetarian Curries and Paneer', '1 bowl (220g)', 214, 8.8, 9.6, 16.2, 1.4);
addFood('Palak Paneer (Fresh Cottage Cheese Cubes in Spiced Pureed Green Spinach Gravy)', 'Vegetarian Curries and Paneer', '1 bowl (220g)', 168, 8.4, 6.2, 12.4, 2.8);
addFood('Kadai Paneer (Paneer Cubes Tossed with Crunchy Bell Peppers, Onions & Fresh Ground Kadai Masala)', 'Vegetarian Curries and Paneer', '1 bowl (220g)', 194, 9.2, 8.4, 14.1, 2.2);
addFood('Matar Paneer (Cottage Cheese and Tender Green Peas in Traditional Spiced Tomato Gravy)', 'Vegetarian Curries and Paneer', '1 bowl (220g)', 178, 8.6, 11.2, 10.8, 2.6);
addFood('Shahi Paneer (Royal Mughlai Cottage Cheese in Creamy White Cashew Almond & Cardamom Gravy)', 'Vegetarian Curries and Paneer', '1 bowl (220g)', 228, 8.2, 11.8, 16.8, 1.2);
addFood('Paneer Bhurji (Scrambled Fresh Cottage Cheese Sautéed with Onions, Tomatoes, Green Chilies & Spices)', 'Vegetarian Curries and Paneer', '1 plate (150g)', 232, 13.8, 5.4, 17.2, 1.4);
addFood('Paneer Tikka (Tandoor-Grilled Marinated Cottage Cheese Cubes with Bell Peppers & Onions)', 'Vegetarian Curries and Paneer', '6 pieces (180g)', 208, 14.4, 6.8, 13.8, 1.6);
addFood('Malai Kofta (Melt-in-Mouth Paneer & Potato Dumplings in Creamy Cashew Nut Gravy)', 'Vegetarian Curries and Paneer', '2 koftas with gravy (220g)', 242, 6.4, 18.2, 16.4, 2.2);
addFood('Aloo Gobi (Punjabi Classic Cauliflower & Potato Florets Tossed in Cumin, Turmeric & Ginger)', 'Vegetables and Sabzi', '1 bowl (180g)', 112, 2.8, 14.2, 5.1, 3.2);
addFood('Aloo Jeera (Boiled Potatoes Tossed with Roasted Cumin Seeds, Green Chilies & Fresh Cilantro)', 'Vegetables and Sabzi', '1 bowl (160g)', 128, 2.1, 18.4, 5.2, 2.4);
addFood('Aloo Matar (Home-Style Potatoes & Green Peas Cooked in Spiced Onion Tomato Gravy)', 'Vegetables and Sabzi', '1 bowl (180g)', 124, 3.4, 17.8, 4.6, 3.4);
addFood('Dum Aloo (Kashmiri Fried Baby Potatoes Simmered in Aromatic Fennel & Ginger Spiced Curd Gravy)', 'Vegetables and Sabzi', '1 bowl (200g)', 154, 3.2, 18.6, 7.6, 2.8);
addFood('Baingan Bharta (Charcoal-Roasted Smoked Mashed Eggplant with Sautéed Onions, Garlic & Tomatoes)', 'Vegetables and Sabzi', '1 bowl (180g)', 92, 2.1, 8.6, 5.6, 3.8);
addFood('Bhindi Masala (Tender Okra Ladies Finger Sautéed with Onions, Dry Mango Amchur & Spices)', 'Vegetables and Sabzi', '1 bowl (160g)', 118, 2.6, 11.4, 7.1, 3.6);
addFood('Sarson Ka Saag (Authentic Punjabi Mustard Greens & Spinach Slow-Cooked with Makki Atta & Ghee)', 'Green Leafy Vegetables', '1 bowl (200g)', 118, 4.2, 8.4, 7.8, 4.8);
addFood('Navratan Korma (Mughlai Sweet & Savory Mixed Vegetables, Paneer, Nuts & Dried Fruits in Creamy Gravy)', 'Vegetarian Curries and Paneer', '1 bowl (220g)', 198, 5.8, 16.2, 12.6, 2.8);
addFood('Mix Veg Curry (Homestyle Carrots, Beans, Peas, Cauliflower in Spiced Tomato Gravy)', 'Vegetables and Sabzi', '1 bowl (180g)', 106, 2.8, 12.4, 5.1, 3.4);

// North Indian Breads & Parathas
addFood('Phulka / Roti (Puffed Whole Wheat Flatbread Cooked on Tawa & Open Flame, No Ghee)', 'Roti and Indian Breads', '2 phulkas (60g)', 242, 8.2, 49.6, 1.4, 6.8);
addFood('Ghee Phulka / Roti (Soft Whole Wheat Flatbread Brushed with Desi Ghee)', 'Roti and Indian Breads', '2 phulkas with ghee (65g)', 284, 8.0, 48.4, 6.8, 6.6);
addFood('Tandoori Roti (Whole Wheat Flatbread Baked in High-Heat Clay Tandoor)', 'Roti and Indian Breads', '1 roti (70g)', 238, 7.8, 48.2, 1.6, 6.4);
addFood('Butter Tandoori Roti (Clay Oven Baked Whole Wheat Roti Brushed with Melted Butter)', 'Roti and Indian Breads', '1 roti (75g)', 282, 7.6, 47.4, 6.9, 6.2);
addFood('Plain Naan (Traditional Leavened White Flour Bread Baked in Clay Tandoor)', 'Roti and Indian Breads', '1 naan (90g)', 268, 7.8, 52.4, 3.2, 2.1);
addFood('Butter Naan (Soft Leavened Tandoori Naan Brushed Generously with Butter)', 'Roti and Indian Breads', '1 naan (100g)', 312, 7.6, 51.2, 8.6, 2.0);
addFood('Garlic Naan (Tandoori Naan Topped with Minced Roasted Garlic & Cilantro, Brushed with Butter)', 'Roti and Indian Breads', '1 naan (100g)', 316, 7.8, 50.8, 8.9, 2.2);
addFood('Rumali Roti (Ultra-Thin Hand-Tossed Soft Handkerchief Bread Cooked on Inverted Kadai)', 'Roti and Indian Breads', '1 roti (70g)', 256, 7.2, 51.4, 2.4, 2.2);
addFood('Missi Roti (Rajasthani Spiced Gram Flour Besan & Whole Wheat Flatbread with Ajwain)', 'Roti and Indian Breads', '1 roti (80g)', 274, 10.4, 46.8, 4.8, 6.2);
addFood('Makki Di Roti (Punjabi Yellow Cornmeal Flatbread Cooked with Desi Ghee)', 'Roti and Indian Breads', '1 roti (80g)', 288, 5.8, 48.6, 8.2, 4.8);
addFood('Bajra Roti (Pearl Millet Gluten-Free Flatbread Cooked on Tawa)', 'Roti and Indian Breads', '1 roti (80g)', 264, 7.4, 47.8, 4.6, 6.8);
addFood('Jowar Roti (Sorghum Millet Soft Gluten-Free Flatbread)', 'Roti and Indian Breads', '1 roti (80g)', 258, 6.8, 49.2, 3.8, 5.8);
addFood('Amritsari Kulcha (Layered Crisp Leavened Bread Stuffed with Spiced Potatoes & Baked in Tandoor)', 'Roti and Indian Breads', '1 kulcha (150g)', 286, 6.8, 44.2, 9.4, 3.2);
addFood('Bhature (Deep-Fried Fluffy Leavened Bread for Chole)', 'Roti and Indian Breads', '1 bhatura (90g)', 348, 7.2, 46.8, 14.8, 1.8);
addFood('Poori (Crispy Deep-Fried Puffed Whole Wheat Bread)', 'Roti and Indian Breads', '2 pooris (60g)', 364, 6.8, 45.2, 17.6, 4.4);
addFood('Aloo Paratha (Whole Wheat Flatbread Stuffed with Spiced Mashed Potatoes & Cooked with Butter)', 'Roti and Indian Breads', '1 paratha (140g)', 236, 5.8, 36.4, 7.8, 4.2);
addFood('Paneer Paratha (Whole Wheat Bread Stuffed with Spiced Grated Cottage Cheese & Herbs)', 'Roti and Indian Breads', '1 paratha (140g)', 268, 9.8, 32.4, 11.2, 4.0);
addFood('Gobi Paratha (Whole Wheat Flatbread Stuffed with Spiced Grated Cauliflower & Carom Seeds)', 'Roti and Indian Breads', '1 paratha (140g)', 224, 6.2, 34.8, 6.8, 4.6);
addFood('Mooli Paratha (Whole Wheat Bread Stuffed with Seasoned Grated White Radish & Green Chilies)', 'Roti and Indian Breads', '1 paratha (140g)', 218, 5.6, 35.2, 6.4, 4.4);
addFood('Methi Paratha (Whole Wheat Bread Kneaded with Fresh Fenugreek Leaves & Spices)', 'Roti and Indian Breads', '1 paratha (100g)', 254, 7.2, 41.8, 6.8, 5.6);
addFood('Pyaaz Paratha (Whole Wheat Bread Stuffed with Finely Diced Spiced Onions & Ajwain)', 'Roti and Indian Breads', '1 paratha (130g)', 228, 5.9, 36.2, 6.9, 4.2);
addFood('Laccha Paratha (Crispy Multi-Layered Whole Wheat Flatbread Cooked with Ghee)', 'Roti and Indian Breads', '1 paratha (100g)', 312, 6.8, 43.6, 12.4, 4.8);
addFood('Keema Paratha (Whole Wheat Bread Stuffed with Spiced Minced Mutton / Chicken Keema)', 'Meat and Poultry', '1 paratha (160g)', 278, 12.8, 31.4, 11.6, 3.8);

// North Indian Non-Veg Curries & Kebabs
addFood('Butter Chicken / Murgh Makhani (Tender Tandoori Chicken in Rich Creamy Tomato Butter Cashew Gravy)', 'Chicken and Poultry', '1 serving (250g)', 218, 17.4, 6.8, 13.8, 1.2);
addFood('Tandoori Chicken (Clay-Oven Roasted Whole Chicken Marinated in Spiced Yogurt & Mustard Oil)', 'Chicken and Poultry', '1 leg piece (160g)', 194, 24.6, 2.4, 9.4, 0.4);
addFood('Chicken Tikka Masala (Charcoal-Grilled Chicken Chunks in Spicy Creamy Onion Tomato Gravy)', 'Chicken and Poultry', '1 serving (240g)', 206, 18.2, 6.2, 12.1, 1.4);
addFood('Chicken Korma (Mughlai Style Chicken Simmered in Rich White Cashew, Yogurt & Saffron Gravy)', 'Chicken and Poultry', '1 serving (240g)', 224, 17.8, 5.8, 14.6, 1.1);
addFood('Kadai Chicken (Chicken Cooked with Bell Peppers, Onions & Freshly Pounded Coriander Kadai Spices)', 'Chicken and Poultry', '1 serving (240g)', 188, 19.2, 4.8, 10.4, 1.6);
addFood('Chicken Curry (Homestyle North Indian Chicken Cooked in Onion, Ginger, Garlic & Tomato Curry)', 'Chicken and Poultry', '1 serving (220g)', 168, 18.8, 3.8, 8.8, 1.1);
addFood('Rogan Josh (Traditional Kashmiri Tender Mutton Stew with Kashmiri Chili, Fennel & Ratanjot)', 'Meat and Poultry', '1 serving (220g)', 228, 20.4, 3.6, 14.8, 0.8);
addFood('Mutton Korma (Royal Awadhi Tender Goat Meat in Rich Cashew, Yogurt & Whole Spices Gravy)', 'Meat and Poultry', '1 serving (240g)', 248, 19.6, 4.8, 17.2, 0.8);
addFood('Keema Matar (Spiced Minced Mutton Cooked with Tender Green Peas, Ginger & Garam Masala)', 'Meat and Poultry', '1 serving (200g)', 214, 18.4, 6.2, 12.8, 2.1);
addFood('Nihari Gosht (Old Delhi Slow-Cooked Tender Beef / Mutton Shank Stew with Wheat Flour & Warm Spices)', 'Meat and Poultry', '1 bowl (250g)', 236, 21.2, 4.4, 14.8, 0.8);
addFood('Seekh Kebab (Charcoal-Grilled Spiced Minced Mutton Skewers with Herbs & Garlic)', 'Meat and Poultry', '2 skewers (140g)', 234, 21.8, 3.2, 14.8, 0.8);
addFood('Chicken Seekh Kebab (Tandoor-Grilled Spiced Minced Chicken Skewers)', 'Chicken and Poultry', '2 skewers (140g)', 188, 22.4, 3.4, 9.4, 0.6);
addFood('Galouti Kebab (Lucknowi Melt-in-Mouth Minced Mutton Patties Infused with Raw Papaya & 32 Spices)', 'Meat and Poultry', '3 kebabs (120g)', 256, 18.6, 4.8, 18.2, 0.6);
addFood('Shami Kebab (Pan-Fried Boiled Mutton & Chana Dal Patties with Herbs)', 'Meat and Poultry', '2 kebabs (100g)', 218, 17.4, 9.8, 12.2, 2.4);
addFood('Amritsari Fish Fry (Crispy Carom-Ajwain Spiced Gram Flour Batter Fried River Fish Fillets)', 'Fish and Seafood', '4 pieces (150g)', 212, 21.4, 6.8, 11.2, 0.8);
addFood('Fish Tikka (Tandoor-Roasted Spiced Yogurt Marinated Fish Cubes)', 'Fish and Seafood', '6 pieces (160g)', 164, 22.8, 3.4, 6.8, 0.4);
addFood('Egg Curry (Punjabi Style Boiled Eggs Simmered in Spiced Onion Tomato Gravy)', 'Egg Dishes', '2 eggs with gravy (200g)', 148, 10.4, 5.8, 9.2, 1.2);

// -----------------------------------------------------------------------------
// 3. BIRYANIS, PULAOS & FLAVORED RICE
// -----------------------------------------------------------------------------
addFood('Hyderabadi Chicken Dum Biryani (Fragrant Basmati Rice Layered with Marinated Spiced Chicken & Saffron)', 'Chicken and Poultry', '1 plate (350g)', 198, 11.4, 23.2, 6.8, 1.2);
addFood('Hyderabadi Mutton Dum Biryani (Slow-Cooked Dum Basmati Rice with Tender Spiced Goat Meat & Mint)', 'Meat and Poultry', '1 plate (350g)', 218, 12.8, 22.4, 8.9, 1.1);
addFood('Kolkata Chicken Biryani (Aromatic Lightly Spiced Rice with Chicken, Boiled Egg & Golden Potato)', 'Chicken and Poultry', '1 plate (380g)', 184, 9.8, 24.6, 5.4, 1.2);
addFood('Kolkata Mutton Biryani (Fragrant Awadhi-Style Rice with Tender Mutton, Fried Potato & Boiled Egg)', 'Meat and Poultry', '1 plate (380g)', 204, 11.2, 23.8, 7.4, 1.1);
addFood('Lucknowi / Awadhi Chicken Biryani (Pakki Biryani with Yakhni Flavored Long-Grain Basmati Rice)', 'Chicken and Poultry', '1 plate (350g)', 188, 10.8, 23.8, 5.8, 1.0);
addFood('Dindigul Thalappakatti Mutton Biryani (Seeraga Samba Short Grain Rice with Tender Country Mutton & Ghee)', 'Meat and Poultry', '1 plate (320g)', 228, 13.4, 22.8, 9.8, 1.4);
addFood('Ambur Chicken Biryani (Tamil Seeraga Samba Rice Cooked with Curd & Red Chili Paste Chicken)', 'Chicken and Poultry', '1 plate (320g)', 194, 11.8, 23.4, 6.2, 1.2);
addFood('Thalassery Chicken Biryani (Malabar Kaima / Jeerakasala Rice with Fried Onions, Cashews & Ghee)', 'Chicken and Poultry', '1 plate (320g)', 208, 11.2, 24.2, 7.4, 1.4);
addFood('Donne Chicken Biryani (Bangalore Style Mint & Coriander Marinated Chicken Cooked with Seeraga Samba Rice)', 'Chicken and Poultry', '1 plate (320g)', 196, 12.2, 23.6, 6.1, 1.4);
addFood('Egg Biryani (Fragrant Spiced Basmati Rice Layered with Hard Boiled Eggs & Caramelized Onions)', 'Egg Dishes', '1 plate (320g)', 174, 7.8, 24.8, 4.9, 1.2);
addFood('Fish Biryani (Layered Basmati Rice with Spiced Kingfish / Pomfret Fillets & Herbs)', 'Fish and Seafood', '1 plate (320g)', 168, 11.8, 23.2, 4.2, 1.0);
addFood('Prawn Biryani (Fragrant Basmati Rice Cooked with Marinated Juicy Prawns, Mint & Fried Shallots)', 'Fish and Seafood', '1 plate (320g)', 172, 12.4, 23.6, 4.4, 1.1);
addFood('Vegetable Dum Biryani (Basmati Rice Layered with Spiced Carrots, Beans, Peas, Potatoes & Mint)', 'Rice and Grain Dishes', '1 plate (320g)', 154, 4.2, 26.8, 3.8, 2.8);
addFood('Paneer Biryani (Fragrant Rice Cooked with Marinated Cottage Cheese Cubes & Saffron)', 'Vegetarian Curries and Paneer', '1 plate (320g)', 186, 7.2, 25.4, 6.4, 2.2);
addFood('Mushroom Biryani (Basmati Rice Cooked with Fresh Sliced Button Mushrooms & Biryani Spices)', 'Rice and Grain Dishes', '1 plate (300g)', 148, 4.6, 26.2, 3.2, 2.6);
addFood('Soya Chunks Biryani (High Protein Basmati Rice Cooked with Nutritious Soy Chunks & Spices)', 'Rice and Grain Dishes', '1 plate (300g)', 168, 8.8, 26.4, 3.4, 3.8);
addFood('Veg Pulao (Fragrant Basmati Rice Cooked with Whole Spices, Green Peas, Carrots & Beans)', 'Rice and Grain Dishes', '1 plate (250g)', 148, 3.8, 26.8, 3.2, 2.2);
addFood('Matar Pulao / Peas Pulao (Basmati Rice Cooked with Fresh Sweet Green Peas, Cumin & Ghee)', 'Rice and Grain Dishes', '1 plate (250g)', 146, 3.9, 27.2, 2.8, 2.4);
addFood('Kashmiri Pulao (Sweet Aromatic Basmati Rice Garnish with Saffron, Fresh Fruits, Nuts & Fried Onions)', 'Rice and Grain Dishes', '1 plate (250g)', 178, 4.2, 31.4, 4.6, 2.1);
addFood('Chicken Pulao (Basmati Rice Cooked in Aromatic Chicken Stock / Yakhni with Whole Spices)', 'Chicken and Poultry', '1 plate (300g)', 176, 11.2, 23.8, 4.2, 1.0);
addFood('Mutton Yakhni Pulao (Awadhi Style Basmati Rice Simmered in Rich Goat Bone Broth & Whole Spices)', 'Meat and Poultry', '1 plate (300g)', 198, 12.4, 23.2, 6.2, 0.9);
addFood('Jeera Rice (Long-Grain Basmati Rice Tempered with Roasted Cumin Seeds & Pure Desi Ghee)', 'Rice and Grain Dishes', '1 plate (200g)', 158, 2.9, 29.4, 3.4, 0.8);
addFood('Ghee Rice / Nei Choru (Fragrant Short-Grain Rice Cooked with Pure Ghee, Whole Spices, Fried Onions & Cashews)', 'Rice and Grain Dishes', '1 plate (200g)', 192, 3.4, 28.6, 7.4, 1.2);
addFood('Veg Fried Rice (Indo-Chinese Stir-Fried Basmati Rice with Diced Veggies, Soy Sauce & Spring Onions)', 'Rice and Grain Dishes', '1 plate (250g)', 164, 3.6, 28.2, 4.4, 1.8);
addFood('Egg Fried Rice (Wok-Tossed Rice with Scrambled Eggs, Garlic & Soy Sauce)', 'Egg Dishes', '1 plate (280g)', 184, 6.8, 26.4, 6.1, 1.2);
addFood('Chicken Fried Rice (Indo-Chinese Wok-Tossed Rice with Shredded Chicken, Egg & Vegetables)', 'Chicken and Poultry', '1 plate (300g)', 198, 11.8, 25.2, 6.4, 1.1);
addFood('Schezwan Fried Rice (Spicy Wok-Fried Rice in Red Schezwan Pepper Sauce)', 'Rice and Grain Dishes', '1 plate (260g)', 178, 4.2, 28.6, 5.4, 1.9);

// -----------------------------------------------------------------------------
// 4. WEST / GUJARATI / MAHARASHTRIAN
// -----------------------------------------------------------------------------
addFood('Kanda Poha (Flattened Rice Sautéed with Caramelized Onions, Peanuts, Mustard Seeds & Lemon)', 'Breakfast foods', '1 plate (180g)', 178, 4.2, 29.6, 5.2, 2.4);
addFood('Batata Poha (Flattened Rice Sautéed with Diced Potatoes, Peanuts, Turmeric & Cilantro)', 'Breakfast foods', '1 plate (180g)', 184, 3.8, 31.2, 4.9, 2.2);
addFood('Indori Poha (Steamed Flattened Rice Topped with Jeeravan Masala, Sev, Pomegranate & Onions)', 'Breakfast foods', '1 plate (180g)', 192, 4.6, 32.4, 5.4, 2.6);
addFood('Pav Bhaji (Spiced Mashed Mixed Vegetable Curry with Potatoes, Tomatoes & Peas Cooked in Butter)', 'Vegetables and Sabzi', '1 bowl bhaji (200g)', 148, 3.6, 17.8, 7.4, 3.4);
addFood('Butter Pav (Soft White Bakery Buns Toasted Generously in Butter on Tawa)', 'Baked Products', '2 pavs (80g)', 298, 7.4, 46.8, 9.4, 1.8);
addFood('Vada Pav (Spiced Potato Fritter in Soft Pav Bun with Garlic Red Chutney & Fried Green Chili)', 'Snacks and Chaat', '1 vada pav (130g)', 264, 6.2, 38.4, 9.8, 2.8);
addFood('Misal Pav (Sprouted Moth Bean Spicy Kolhapuri Curry Topped with Crunchy Farsan & Served with Pav)', 'Snacks and Chaat', '1 plate (280g)', 194, 6.8, 26.4, 6.8, 4.6);
addFood('Dabeli / Kutchi Dabeli (Pav Stuffed with Spiced Mashed Potato, Masala Peanuts, Pomegranate & Chutney)', 'Snacks and Chaat', '1 dabeli (120g)', 248, 5.4, 39.2, 8.2, 3.2);
addFood('Sabudana Khichdi (Soaked Sago Tapioca Pearls Tossed with Roasted Peanuts, Green Chili & Cumin)', 'Breakfast foods', '1 plate (180g)', 258, 4.2, 42.6, 8.4, 1.8);
addFood('Sabudana Vada (Crispy Deep-Fried Sago Tapioca & Mashed Potato Patties with Crushed Peanuts)', 'Snacks and Chaat', '2 vadas (100g)', 312, 4.8, 46.2, 12.8, 2.0);
addFood('Thalipeeth (Maharashtrian Spiced Multi-Grain Flatbread Made from Bhajani Flour & Onions)', 'Roti and Indian Breads', '1 thalipeeth (90g)', 274, 8.6, 43.8, 7.2, 6.2);
addFood('Jowar Bhakri (Maharashtrian Sorghum Millet Hand-Pressed Traditional Flatbread)', 'Roti and Indian Breads', '1 bhakri (90g)', 258, 6.8, 49.2, 3.8, 5.8);
addFood('Bajra Bhakri (Pearl Millet Hand-Patted Flatbread Cooked on Clay Tawa)', 'Roti and Indian Breads', '1 bhakri (90g)', 264, 7.4, 47.8, 4.6, 6.8);
addFood('Pithla / Pitla (Maharashtrian Traditional Spiced Gram Flour Curry with Garlic Tempering)', 'Grain Legumes and Pulses', '1 bowl (180g)', 134, 6.8, 15.2, 4.8, 3.4);
addFood('Zunka (Dry Spiced Roasted Gram Flour Besan with Caramelized Onions & Coriander)', 'Grain Legumes and Pulses', '1 bowl (150g)', 184, 8.8, 21.4, 7.4, 4.2);
addFood('Bharli Vangi (Maharashtrian Stuffed Baby Brinjals in Roasted Peanut, Coconut & Goda Masala Gravy)', 'Vegetables and Sabzi', '1 bowl (180g)', 142, 3.8, 11.2, 9.4, 4.2);
addFood('Matki Usal (Sprouted Moth Beans Sautéed with Goda Masala, Mustard Seeds & Fresh Coconut)', 'Grain Legumes and Pulses', '1 bowl (180g)', 138, 7.4, 18.2, 4.4, 5.8);
addFood('Kothimbir Vadi (Steamed & Crispy Fried Fresh Coriander & Gram Flour Savory Cakes)', 'Snacks and Chaat', '4 vadis (100g)', 218, 7.8, 24.6, 10.2, 4.2);
addFood('Alu Vadi / Patra (Colocasia Leaves Smeared with Sweet-Spicy Gram Flour Paste, Steamed & Sliced)', 'Snacks and Chaat', '4 pieces (100g)', 186, 6.2, 26.4, 6.4, 3.8);
addFood('Khaman Dhokla (Soft Spongy Steamed Gram Flour Besan Cakes Tempered with Mustard & Green Chili)', 'Breakfast foods', '4 squares (120g)', 152, 6.2, 23.4, 3.8, 2.4);
addFood('Nylon Khaman (Ultra-Soft Juicy Gujarati Steamed Besan Sponge with Sugar Mustard Water)', 'Breakfast foods', '4 pieces (120g)', 164, 5.8, 26.8, 4.2, 2.1);
addFood('White Khatta Dhokla (Fermented Rice & Urad Dal Steamed Cakes Topped with Black Pepper)', 'Breakfast foods', '4 squares (120g)', 142, 4.8, 26.2, 2.2, 1.8);
addFood('Handvo (Gujarati Savory Baked Mixed Lentil & Rice Cake with Bottle Gourd, Sesame & Mustard)', 'Breakfast foods', '1 slice (120g)', 198, 7.2, 26.8, 7.4, 3.8);
addFood('Khandvi (Delicate Steamed Gram Flour & Buttermilk Rolls Tempered with Mustard Seeds & Coconut)', 'Snacks and Chaat', '4 rolls (80g)', 168, 6.8, 21.4, 6.2, 2.8);
addFood('Fafda (Crispy Deep-Fried Gram Flour Strips Seasoned with Ajwain, Served with Papaya Sambharo)', 'Snacks and Chaat', '4 strips (80g)', 386, 10.4, 42.8, 19.8, 4.2);
addFood('Methi Thepla (Gujarati Whole Wheat Flatbread Kneaded with Fresh Methi, Yogurt & Spices)', 'Roti and Indian Breads', '2 theplas (70g)', 286, 7.8, 45.6, 8.2, 5.4);
addFood('Doodhi Thepla (Whole Wheat Flatbread Kneaded with Grated Bottle Gourd & Carom Seeds)', 'Roti and Indian Breads', '2 theplas (70g)', 274, 7.4, 46.2, 6.8, 5.1);
addFood('Muthiya (Gujarati Steamed / Shallow-Fried Fenugreek & Bottle Gourd Dumplings with Sesame)', 'Snacks and Chaat', '4 pieces (100g)', 214, 6.8, 28.4, 8.4, 4.6);
addFood('Undhiyu (Authentic Surti Mixed Winter Vegetable Stew with Fenugreek Muthiyas & Coconut Paste)', 'Vegetables and Sabzi', '1 bowl (200g)', 154, 4.2, 17.8, 7.4, 4.8);
addFood('Sev Tameta Nu Shaak (Sweet, Tangy & Spicy Gujarati Tomato Curry Topped with Crispy Besan Sev)', 'Vegetables and Sabzi', '1 bowl (180g)', 168, 4.2, 16.4, 9.8, 2.6);
addFood('Dal Dhokli (Spiced Whole Wheat Pasta Dumplings Simmered in Sweet & Tangy Gujarati Toor Dal)', 'Dal and Lentil Dishes', '1 bowl (250g)', 162, 5.8, 26.4, 4.2, 3.8);
addFood('Gujarati Kadhi (Sweet & Tangy Thin Yogurt & Besan Curry Flavored with Cinnamon & Cloves)', 'Vegetarian Curries and Paneer', '1 bowl (180g)', 92, 2.8, 11.4, 4.1, 0.8);
addFood('Shrikhand (Creamy Strained Sweetened Hung Yogurt Flavored with Saffron & Cardamom)', 'Indian Sweets and Mithai', '1/2 cup (100g)', 268, 7.8, 34.2, 11.4, 0.0);
addFood('Amrakhand / Mango Shrikhand (Hung Curd Blended with Fresh Alphonso Mango Pulp & Cardamom)', 'Indian Sweets and Mithai', '1/2 cup (100g)', 248, 6.8, 36.4, 9.2, 0.6);
addFood('Puran Poli / Vedmi (Whole Wheat Sweet Flatbread Stuffed with Jaggery & Chana Dal Paste with Ghee)', 'Roti and Indian Breads', '1 puran poli (120g)', 284, 7.2, 54.2, 5.2, 4.8);
addFood('Basundi (Slow-Simmered Sweetened Condensed Milk Infused with Nutmeg, Cardamom & Pistachios)', 'Indian Sweets and Mithai', '1 cup (150ml)', 214, 6.8, 24.8, 10.2, 0.4);
addFood('Aamras (Pure Sweetened Alphonso Mango Pulp with Cardamom & Saffron)', 'Fruits and Fruit Juices', '1 cup (150g)', 128, 0.8, 30.2, 0.6, 2.1);

// -----------------------------------------------------------------------------
// 5. EAST / BENGALI / ODIA
// -----------------------------------------------------------------------------
addFood('Shorshe Ilish (Classic Bengali Hilsa Fish Steaks Simmered in Pungent Mustard Paste & Green Chilies)', 'Fish and Seafood', '1 piece with gravy (160g)', 248, 17.8, 3.4, 18.2, 1.2);
addFood('Rui Macher Kalia (Bengali Rich & Spicy Rohu Fish Curry with Caramelized Onions, Ginger & Raisins)', 'Fish and Seafood', '1 piece with gravy (180g)', 154, 15.6, 4.6, 8.2, 1.1);
addFood('Macher Jhol (Light Homestyle Fish Curry with Potatoes, Cauliflower / Pointed Gourd & Kalo Jeere)', 'Fish and Seafood', '1 bowl (200g)', 118, 14.2, 6.4, 4.6, 1.4);
addFood('Chingri Malai Curry (Jumbo Tiger Prawns Gently Simmered in Spiced Coconut Milk & Ghee)', 'Fish and Seafood', '1 serving (200g)', 188, 14.2, 5.6, 12.4, 1.2);
addFood('Doi Maach (Traditional Bengali Fish Steaks Cooked in Spiced Yogurt Gravy with Bay Leaves)', 'Fish and Seafood', '1 piece with gravy (180g)', 146, 16.2, 4.2, 7.2, 0.6);
addFood('Bhetki Macher Paturi (Asian Sea Bass Barramundi Fillet Coated in Mustard Paste Steamed in Banana Leaf)', 'Fish and Seafood', '1 piece (140g)', 168, 19.4, 3.2, 8.8, 1.0);
addFood('Kosha Mangsho (Slow-Cooked Bengali Dark & Rich Spiced Mutton Curry with Mustard Oil)', 'Meat and Poultry', '1 serving (220g)', 256, 21.8, 4.2, 17.2, 0.8);
addFood('Chicken Dak Bungalow (Colonial Style Spiced Chicken Curry with Whole Boiled Eggs & Potatoes)', 'Chicken and Poultry', '1 serving (250g)', 198, 18.2, 5.8, 11.4, 1.2);
addFood('Luchi (Traditional Bengali Deep-Fried Puffed Refined Flour Bread with Ghee)', 'Roti and Indian Breads', '2 luchis (50g)', 372, 6.4, 46.8, 18.4, 1.4);
addFood('Radhaballabhi (Bengali Deep-Fried Puffed Bread Stuffed with Spiced Urad Dal Paste)', 'Roti and Indian Breads', '2 pooris (80g)', 348, 8.4, 45.2, 15.6, 3.4);
addFood('Alur Dom / Bengali Dum Aloo (Baby Potatoes Cooked in Spicy Tomato Ginger Hing Gravy)', 'Vegetables and Sabzi', '1 bowl (180g)', 136, 2.8, 18.4, 5.8, 2.6);
addFood('Shukto (Traditional Bengali Bittersweet Mixed Vegetable Stew with Bitter Gourd, Bori & Milk)', 'Vegetables and Sabzi', '1 bowl (180g)', 92, 2.8, 11.4, 4.2, 2.8);
addFood('Cholar Dal (Bengali Chana Dal Cooked with Coconut Bits, Raisins, Ghee & Garam Masala)', 'Dal and Lentil Dishes', '1 bowl (200g)', 158, 7.4, 21.8, 5.4, 4.8);
addFood('Mochar Ghonto (Traditional Bengali Spiced Banana Flower Blossom Stir-Fry with Coconut & Potatoes)', 'Vegetables and Sabzi', '1 bowl (160g)', 104, 2.4, 14.8, 4.4, 5.2);
addFood('Aloo Posto (Potatoes Cooked in Rich Ground White Poppy Seed Paste with Mustard Oil & Green Chilies)', 'Vegetables and Sabzi', '1 bowl (180g)', 162, 3.8, 18.2, 8.6, 3.4);
addFood('Begun Bhaja (Bengali Pan-Fried Thick Eggplant Slices Marinated in Turmeric, Chili & Mustard Oil)', 'Vegetables and Sabzi', '2 slices (100g)', 134, 1.8, 9.4, 10.2, 3.2);
addFood('Mishti Doi (Authentic Bengali Sweet Fermented Caramelized Milk Yogurt in Clay Pot)', 'Indian Sweets and Mithai', '1 cup (120g)', 168, 4.8, 24.2, 6.1, 0.0);
addFood('Sandesh / Nolen Gur Sandesh (Fresh Chhena Fudge Infused with Date Palm Jaggery)', 'Indian Sweets and Mithai', '2 pieces (60g)', 248, 8.2, 36.4, 8.4, 0.2);
addFood('Rasgulla / Rosogolla (Spongy Cottage Cheese Chhena Spheres Simmered in Light Sugar Syrup)', 'Indian Sweets and Mithai', '2 pieces (100g)', 186, 4.2, 38.6, 2.0, 0.0);
addFood('Rasmalai (Soft Flat Chhena Patties Soaked in Saffron Cardamom Flavored Sweet Milk with Pistachios)', 'Indian Sweets and Mithai', '2 pieces (140g)', 214, 6.8, 28.4, 8.6, 0.2);
addFood('Cham Cham (Traditional Oval Chhena Sweet Coated in Condensed Milk Mawa & Coconut Flakes)', 'Indian Sweets and Mithai', '2 pieces (80g)', 268, 6.4, 44.8, 7.6, 0.2);
addFood('Chaler Payesh (Bengali Gobindobhog Rice Pudding Cooked in Full Cream Milk with Nolen Gur)', 'Indian Sweets and Mithai', '1 bowl (150g)', 184, 4.8, 28.4, 6.2, 0.6);
addFood('Pati Shapta Pitha (Thin Rice Flour & Semolina Crepe Stuffed with Kheer Mawa & Grated Coconut)', 'Indian Sweets and Mithai', '2 rolls (100g)', 242, 5.2, 42.8, 6.2, 1.4);
addFood('Dalma (Odia Traditional Toor Dal Cooked with Raw Papaya, Pumpkin, Brinjal & Roasted Cumin)', 'Dal and Lentil Dishes', '1 bowl (220g)', 112, 5.2, 16.4, 3.2, 4.2);
addFood('Pakhala Bhata (Odia Fermented Curd Rice with Tempered Cumin, Mustard & Green Chilies)', 'Rice and Grain Dishes', '1 bowl (250g)', 118, 3.2, 21.8, 2.4, 0.8);
addFood('Chhena Poda (Odia Caramelized Baked Cottage Cheese Cake Infused with Cardamom & Sugar)', 'Indian Sweets and Mithai', '1 slice (80g)', 284, 9.4, 38.2, 10.8, 0.2);
addFood('Dahi Bara Aloo Dum (Cuttack Street Style Urad Vadas in Spiced Yogurt with Tangy Potato Curry)', 'Snacks and Chaat', '1 plate (250g)', 164, 5.8, 22.4, 6.2, 2.8);
addFood('Ghuguni (Spiced Yellow Dried Peas Curry Cooked with Ginger, Garlic & Garam Masala)', 'Dal and Lentil Dishes', '1 bowl (200g)', 138, 7.2, 21.4, 3.1, 5.4);

// -----------------------------------------------------------------------------
// 6. NORTH-EAST & HIMALAYAN
// -----------------------------------------------------------------------------
addFood('Steamed Chicken Momo (Delicate Thin-Skin Dumplings Stuffed with Spiced Minced Chicken)', 'Snacks and Chaat', '6 momos (150g)', 176, 11.4, 20.8, 5.2, 1.1);
addFood('Steamed Veg Momo (Dumplings Stuffed with Minced Cabbage, Carrots, Onions & Ginger)', 'Snacks and Chaat', '6 momos (150g)', 142, 4.2, 24.8, 3.4, 2.2);
addFood('Fried Chicken Momo (Crispy Deep-Fried Minced Chicken Dumplings)', 'Snacks and Chaat', '6 momos (150g)', 248, 12.2, 22.4, 12.6, 1.2);
addFood('Jhol Momo (Steamed Momos Served in Spicy Tangy Sesame Soybean Broth)', 'Snacks and Chaat', '6 momos in broth (250g)', 168, 9.8, 19.4, 6.2, 1.8);
addFood('Thukpa Veg (Tibetan Noodle Soup with Sautéed Vegetables in Aromatic Ginger Garlic Broth)', 'Rice and Grain Dishes', '1 large bowl (350g)', 98, 3.4, 16.8, 2.1, 2.2);
addFood('Thukpa Chicken (Tibetan Noodle Soup with Shredded Chicken & Vegetables in Rich Bone Broth)', 'Chicken and Poultry', '1 large bowl (380g)', 134, 9.2, 15.4, 4.1, 1.6);
addFood('Street Style Veg Chowmein (Wok-Tossed Noodles with Shredded Cabbage, Capsicum, Chili & Soy)', 'Rice and Grain Dishes', '1 plate (250g)', 168, 3.8, 27.6, 5.1, 2.1);
addFood('Gundruk Soup (Fermented Mustard Leaf Broth with Potatoes, Tomatoes & Himalayan Spices)', 'Green Leafy Vegetables', '1 bowl (200g)', 36, 3.8, 4.2, 0.4, 3.6);
addFood('Dhindo (Traditional Nepalese Buckwheat / Millet Porridge Dough Served with Ghee)', 'Cereals and Millets', '1 portion (200g)', 142, 3.8, 29.8, 0.8, 2.8);
addFood('Sel Roti (Traditional Crispy Sweet Rice Flour Ring Doughnut with Cardamom & Ghee)', 'Baked Products', '1 sel roti (70g)', 348, 4.8, 58.4, 11.2, 1.2);
addFood('Kwati (Nepalese Sprouted 9-Bean Protein Soup Cooked with Ajwain & Ghee)', 'Grain Legumes and Pulses', '1 bowl (250g)', 124, 7.8, 18.6, 2.4, 5.6);
addFood('Aloo Tama (Nepalese Fermented Bamboo Shoot, Black-Eyed Pea & Potato Curry)', 'Vegetables and Sabzi', '1 bowl (200g)', 88, 3.2, 14.8, 1.8, 3.1);
addFood('Ema Datshi (Bhutanese National Dish of Spicy Hot Chilies Cooked in Yak / Cow Cheese Gravy)', 'Vegetarian Curries and Paneer', '1 bowl (160g)', 168, 7.4, 5.8, 13.6, 2.2);

// -----------------------------------------------------------------------------
// 7. STREET FOOD & FAST FOOD
// -----------------------------------------------------------------------------
addFood('Samosa / Aloo Samosa (Crisp Golden Flaky Pastry Filled with Spiced Potato & Peas)', 'Snacks and Chaat', '1 samosa (90g)', 268, 4.4, 32.8, 13.6, 2.8);
addFood('Punjabi Samosa (Large Crispy Samosa with Coarsely Mashed Spiced Potatoes & Whole Coriander)', 'Snacks and Chaat', '1 samosa (110g)', 274, 4.6, 33.4, 13.8, 2.9);
addFood('Chicken Samosa (Crisp Pastry Triangles Stuffed with Spiced Minced Chicken Keema)', 'Chicken and Poultry', '2 samosas (100g)', 284, 13.8, 26.4, 14.2, 1.6);
addFood('Paneer Samosa (Crisp Pastry Stuffed with Spiced Crumbled Cottage Cheese & Herbs)', 'Vegetarian Curries and Paneer', '2 samosas (100g)', 292, 9.4, 28.6, 16.0, 1.8);
addFood('Pyaaz Kachori (Jodhpur Famous Flaky Deep-Fried Pastry Stuffed with Spicy Caramelized Onion Masala)', 'Snacks and Chaat', '1 kachori (100g)', 348, 5.8, 38.6, 19.4, 3.2);
addFood('Khasta Kachori / Moong Dal Kachori (Crispy Puffed Pastry Filled with Spiced Moong Dal Paste)', 'Snacks and Chaat', '2 kachoris (80g)', 364, 7.4, 41.2, 19.8, 4.2);
addFood('Raj Kachori (Large Crispy Puri Stuffed with Sprouts, Potatoes, Sweet & Spicy Chutneys, Dahi & Sev)', 'Snacks and Chaat', '1 large kachori (220g)', 224, 5.2, 28.4, 10.4, 3.4);
addFood('Pani Puri / Golgappa / Puchka (Crispy Hollow Puris Filled with Spiced Potatoes, Chickpeas & Mint-Tamarind Water)', 'Snacks and Chaat', '6 puris (120g)', 148, 3.2, 24.6, 4.2, 2.4);
addFood('Sev Puri (Flat Crispy Puris Topped with Diced Potatoes, Onions, 3 Chutneys & Mountain of Sev)', 'Snacks and Chaat', '6 pieces (140g)', 238, 5.4, 32.6, 10.2, 3.1);
addFood('Dahi Puri (Crisp Hollow Puris Filled with Potatoes, Sweet Yogurt, Tamarind Chutney & Sev)', 'Snacks and Chaat', '6 puris (160g)', 198, 5.1, 28.4, 7.6, 2.2);
addFood('Bhel Puri (Puffed Rice Tossed with Sev, Chopped Onions, Tomatoes, Cilantro, Tangy Tamarind & Green Chutneys)', 'Snacks and Chaat', '1 plate (150g)', 214, 5.2, 34.8, 6.8, 3.4);
addFood('Sukha Bhel (Dry Puffed Rice Snack with Sev, Masala Peanuts, Spices & Cilantro)', 'Snacks and Chaat', '1 plate (120g)', 242, 6.4, 38.2, 7.6, 3.8);
addFood('Ragda Pattice (Crispy Pan-Fried Potato Cutlets Topped with Warm White Pea Curry & Chutneys)', 'Snacks and Chaat', '2 pattice with ragda (220g)', 168, 5.4, 24.8, 5.8, 4.2);
addFood('Aloo Tikki Chaat (Crispy Pan-Fried Potato Cutlet with Chole, Sweet Curd, Mint & Tamarind Chutneys)', 'Snacks and Chaat', '1 plate (200g)', 184, 5.1, 26.2, 6.8, 3.4);
addFood('Papdi Chaat (Crispy Flour Crackers Topped with Boiled Potatoes, Chickpeas, Sweet Yogurt & Chutneys)', 'Snacks and Chaat', '1 plate (180g)', 208, 5.6, 28.4, 8.4, 2.8);
addFood('Dahi Bhalla / Dahi Vada (Soft Steamed Urad Dal Dumplings in Creamy Spiced Sweet Curd with Roasted Cumin)', 'Snacks and Chaat', '2 pieces (180g)', 164, 6.2, 19.8, 6.8, 2.1);
addFood('Samosa Chaat (Crushed Aloo Samosa Topped with Spicy Chole, Sweet Yogurt, Chutneys & Sev)', 'Snacks and Chaat', '1 plate (250g)', 218, 5.8, 28.4, 9.8, 3.8);
addFood('Onion Pakora / Kanda Bhaji (Crispy Deep-Fried Sliced Onion Fritters in Spiced Gram Flour Batter)', 'Snacks and Chaat', '1 plate (100g)', 284, 5.6, 28.2, 16.8, 3.8);
addFood('Paneer Pakora (Cottage Cheese Slices Sandwiched with Green Chutney, Dipped in Besan Batter & Fried)', 'Vegetarian Curries and Paneer', '4 pieces (120g)', 296, 12.4, 18.2, 19.6, 2.1);
addFood('Bread Pakora (Triangular Bread Slices Stuffed with Spiced Potatoes, Dipped in Besan & Deep Fried)', 'Snacks and Chaat', '1 piece (120g)', 268, 6.2, 32.4, 12.8, 2.6);
addFood('Mirchi Bajji (Large Green Chilies Stuffed with Ajwain Salt, Dipped in Besan Batter & Crispy Fried)', 'Snacks and Chaat', '2 pieces (100g)', 234, 4.8, 24.6, 13.2, 3.2);
addFood('Gobi 65 (Crispy Spiced Cauliflower Florets Deep Fried with Curry Leaves & Chili Garlic Paste)', 'Vegetables and Sabzi', '1 plate (150g)', 198, 4.4, 22.6, 10.4, 3.6);
addFood('Chicken Lollipop (Crispy Indo-Chinese Frenched Chicken Wings Deep Fried in Spiced Batter)', 'Chicken and Poultry', '4 pieces (160g)', 242, 19.8, 9.4, 14.2, 0.8);
addFood('Veg Spring Roll (Crispy Golden Fried Pastry Rolls Stuffed with Shredded Vegetables & Noodles)', 'Snacks and Chaat', '2 rolls (100g)', 238, 4.6, 28.4, 11.8, 2.4);
addFood('Kolkata Egg Roll (Flaky Paratha Lined with Fried Egg, Stuffed with Sliced Onions, Cucumber & Sauce)', 'Egg Dishes', '1 roll (180g)', 248, 8.8, 28.6, 11.4, 2.1);
addFood('Kolkata Chicken Kathi Roll (Flaky Paratha Stuffed with Charred Chicken Boti Tikka, Onion & Green Chutney)', 'Chicken and Poultry', '1 roll (200g)', 264, 14.8, 27.2, 11.8, 2.2);
addFood('Paneer Kathi Roll (Paratha Roll Stuffed with Spiced Tandoori Paneer Tikka Cubes, Capsicum & Mint Dip)', 'Vegetarian Curries and Paneer', '1 roll (200g)', 258, 10.2, 28.4, 12.2, 2.4);
addFood('Indian Style Chicken Shawarma (Pita Bread Stuffed with Roasted Spiced Chicken, Garlic Toum & Pickles)', 'Chicken and Poultry', '1 roll (220g)', 236, 15.4, 24.8, 8.8, 2.1);

// -----------------------------------------------------------------------------
// 8. MILLETS & HEALTH FOODS
// -----------------------------------------------------------------------------
addFood('Ragi Mudde / Ragi Sangati (Karnataka Traditional Steamed Finger Millet Soft Dumpling Ball)', 'Cereals and Millets', '1 mudde (200g)', 128, 3.4, 27.2, 0.6, 3.8);
addFood('Ragi Porridge / Ragi Malt (Finger Millet Flour Boiled in Milk / Water with Jaggery & Cardamom)', 'Dairy and Beverages', '1 glass (250ml)', 94, 2.8, 18.2, 1.2, 2.1);
addFood('Ragi Salted Buttermilk Porridge / Ragi Ambali (Fermented Ragi Flour in Spiced Buttermilk)', 'Dairy and Beverages', '1 glass (250ml)', 68, 2.4, 12.4, 0.8, 2.4);
addFood('Bajra Khichdi (Whole Pearl Millet & Yellow Moong Dal Cooked Soft with Desi Ghee & Spices)', 'Cereals and Millets', '1 bowl (200g)', 148, 5.4, 24.8, 3.6, 4.6);
addFood('Foxtail Millet Upma (Thinai Roasted Grains Cooked with Vegetables & Mustard Tempering)', 'Cereals and Millets', '1 bowl (180g)', 148, 4.6, 24.8, 3.8, 3.8);
addFood('Foxtail Millet Khichdi (Thinai & Split Moong Dal Healthy Comfort Porridge with Ghee)', 'Cereals and Millets', '1 bowl (200g)', 136, 5.2, 22.8, 3.1, 3.6);
addFood('Little Millet Pongal / Samai Pongal (Little Millet & Moong Dal Ghee Pongal with Cashews)', 'Cereals and Millets', '1 plate (200g)', 164, 5.4, 24.6, 4.8, 3.4);
addFood('Kodo Millet Rice / Varagu Sadam (Steamed Kodo Millet Grains)', 'Cereals and Millets', '1 plate (180g)', 122, 3.4, 25.8, 0.6, 3.8);
addFood('Barnyard Millet Khichdi / Sanwa Khichdi (Barnyard Millet & Moong Dal Fasting / Vrat Khichdi)', 'Cereals and Millets', '1 bowl (200g)', 134, 4.8, 23.4, 2.8, 4.2);
addFood('Proso Millet Pulao (Chenna Millet Grains Cooked with Sautéed Vegetables & Whole Spices)', 'Cereals and Millets', '1 plate (200g)', 152, 4.8, 26.4, 3.2, 3.6);
addFood('Multigrain Roti (Whole Wheat, Ragi, Jowar, Oats & Soya Flour Flatbread)', 'Roti and Indian Breads', '1 roti (70g)', 268, 10.8, 46.4, 3.8, 7.8);
addFood('Quinoa Veg Upma (Healthy Quinoa Grains Sautéed with Mustard, Curry Leaves & Diced Vegetables)', 'Cereals and Millets', '1 bowl (180g)', 142, 5.2, 22.4, 3.8, 3.4);
addFood('Sattu Drink (Roasted Bengal Gram Flour Refreshing Drink with Roasted Cumin & Black Salt)', 'Dairy and Beverages', '1 glass (250ml)', 78, 4.2, 13.6, 0.8, 2.4);
addFood('Sweet Sattu Drink (Roasted Gram Sattu Powder Blended with Chilled Water & Jaggery)', 'Dairy and Beverages', '1 glass (250ml)', 114, 3.8, 23.4, 0.6, 2.2);
addFood('Moong Sprouts Salad (Sprouted Green Gram with Diced Onions, Tomatoes, Lemon & Chaat Masala)', 'Grain Legumes and Pulses', '1 bowl (150g)', 82, 6.8, 13.4, 0.4, 4.8);
addFood('Mixed Sprouts Chaat (Sprouted Moong, Kala Chana & Matki Tossed with Lime & Spices)', 'Grain Legumes and Pulses', '1 bowl (150g)', 96, 7.4, 15.2, 0.6, 5.4);

// -----------------------------------------------------------------------------
// 9. COMMON PROTEIN FOODS (EGGS, PANEER, MEATS, FISH, POULTRY)
// -----------------------------------------------------------------------------
addFood('Whole Boiled Egg (Large Hen Egg Hard Boiled)', 'Egg Dishes', '1 egg (50g)', 143, 12.6, 0.7, 9.5, 0.0);
addFood('Boiled Egg White (Large Hen Egg White Only)', 'Egg Dishes', '1 egg white (33g)', 52, 10.9, 0.7, 0.2, 0.0);
addFood('Fried Egg Sunny Side Up (Egg Cooked in 1 tsp Oil/Butter)', 'Egg Dishes', '1 egg (50g)', 196, 13.6, 0.8, 15.3, 0.0);
addFood('Plain Omelette (Beaten Egg Cooked on Tawa in 1 tsp Oil)', 'Egg Dishes', '2-egg omelette (100g)', 184, 12.8, 1.2, 14.2, 0.0);
addFood('Masala Omelette (Indian Style Eggs Beaten with Onions, Green Chilies, Tomatoes & Coriander)', 'Egg Dishes', '2-egg omelette (130g)', 174, 11.6, 3.4, 12.6, 0.6);
addFood('Egg Bhurji / Indian Scrambled Eggs (Eggs Sautéed with Spiced Onions, Tomatoes & Butter)', 'Egg Dishes', '1 bowl (150g)', 182, 12.2, 4.1, 13.0, 0.6);
addFood('Fresh Paneer / Indian Cottage Cheese (Full Fat Cow Milk Paneer)', 'Vegetarian Curries and Paneer', '1 block (100g)', 296, 18.3, 3.6, 23.1, 0.0);
addFood('Low Fat Paneer / Skimmed Milk Paneer (Low Fat Cottage Cheese)', 'Vegetarian Curries and Paneer', '1 block (100g)', 174, 24.8, 4.2, 6.4, 0.0);
addFood('Soya Chunks (Dried Defatted Soya Protein Chunks, Raw)', 'Grain Legumes and Pulses', '1 cup dry (50g)', 345, 52.0, 33.0, 0.5, 13.0);
addFood('Soya Chunks Curry (Boiled Soft Soya Chunks Simmered in Spiced Onion Tomato Gravy)', 'Grain Legumes and Pulses', '1 bowl (200g)', 148, 14.2, 12.4, 4.6, 4.8);
addFood('Soya Granules Bhurji (High Protein Minced Soya Granules Sautéed with Onions, Peas & Spices)', 'Grain Legumes and Pulses', '1 bowl (180g)', 158, 16.4, 11.8, 5.2, 5.2);
addFood('Tofu (Firm Soybean Curd, Raw)', 'Vegetarian Curries and Paneer', '1 block (100g)', 76, 8.1, 1.9, 4.8, 0.4);
addFood('Chicken Breast (Skinless Boneless Raw)', 'Chicken and Poultry', '1 fillet (150g)', 110, 23.1, 0.0, 1.2, 0.0);
addFood('Boiled Chicken Breast (Skinless Shredded Lean Breast Meat, Boiled in Water with Salt)', 'Chicken and Poultry', '1 breast piece (120g)', 151, 31.0, 0.0, 3.2, 0.0);
addFood('Grilled Chicken Breast (Marinated in Lemon, Garlic, Black Pepper & Herbs, Grilled)', 'Chicken and Poultry', '1 breast fillet (140g)', 164, 29.8, 0.6, 4.8, 0.0);
addFood('Chicken Thigh (Skinless Raw Meat)', 'Chicken and Poultry', '1 thigh (120g)', 138, 19.8, 0.0, 6.4, 0.0);
addFood('Chicken Drumstick / Leg (Skinless Cooked Meat)', 'Chicken and Poultry', '1 drumstick (90g)', 162, 26.2, 0.0, 6.2, 0.0);
addFood('Chicken Liver (Raw Fresh Fresh Organs)', 'Chicken and Poultry', '1 portion (100g)', 119, 16.9, 0.7, 4.8, 0.0);
addFood('Lean Goat Mutton (Raw Boneless Meat)', 'Meat and Poultry', '1 serving (150g)', 143, 20.6, 0.0, 6.8, 0.0);
addFood('Mutton Curry Meat (Cooked Goat Meat Chunks, Medium Fat)', 'Meat and Poultry', '1 portion (140g)', 234, 25.4, 0.0, 14.6, 0.0);
addFood('Rohu Freshwater Fish (Labeo rohita, Raw Cleaned Fillet)', 'Fish and Seafood', '1 fillet (150g)', 97, 16.6, 0.0, 1.4, 0.0);
addFood('Catla Freshwater Fish (Gibelion catla, Raw Fillet)', 'Fish and Seafood', '1 fillet (150g)', 106, 17.2, 0.0, 2.2, 0.0);
addFood('Hilsa / Ilish River Fish (Tenualosa ilisha, Raw Rich Oily Fish)', 'Fish and Seafood', '1 steak (160g)', 272, 21.8, 0.0, 19.4, 0.0);
addFood('White Pomfret (Pampus argenteus, Raw Whole Fish)', 'Fish and Seafood', '1 fish (150g)', 102, 17.4, 0.0, 1.8, 0.0);
addFood('Black Pomfret (Parastromateus niger, Raw Fillet)', 'Fish and Seafood', '1 fillet (150g)', 111, 18.2, 0.0, 2.6, 0.0);
addFood('Surmai / King Seer Fish (Scomberomorus commerson, Raw Steak)', 'Fish and Seafood', '1 steak (160g)', 124, 20.8, 0.0, 3.8, 0.0);
addFood('Indian Mackerel (Rastrelliger kanagurta, Raw Oily Fish)', 'Fish and Seafood', '1 whole fish (120g)', 139, 18.9, 0.0, 6.2, 0.0);
addFood('Indian Oil Sardine (Sardinella longiceps, Raw Fresh)', 'Fish and Seafood', '3 sardines (100g)', 148, 19.6, 0.0, 7.2, 0.0);
addFood('Prawns / Tiger Shrimp (Penaeus monodon, Raw Cleaned Meat)', 'Fish and Seafood', '6 prawns (100g)', 85, 18.1, 0.2, 0.8, 0.0);
addFood('Mud Crab Meat (Scylla serrata, Steamed Fresh)', 'Fish and Seafood', '1 cup meat (120g)', 94, 20.1, 0.0, 1.2, 0.0);
addFood('Squid / Calamari (Loligo duvauceli, Raw Cleaned Rings)', 'Fish and Seafood', '1 cup rings (100g)', 92, 15.6, 0.8, 1.4, 0.0);

// -----------------------------------------------------------------------------
// 10. RAW INGREDIENTS, GRAINS, DALS, VEGETABLES & FRUITS
// -----------------------------------------------------------------------------
addFood('Basmati Rice (Raw Milled Long Grain)', 'Cereals and Millets', '1 cup raw (180g)', 349, 7.8, 77.2, 0.6, 1.4);
addFood('Basmati Rice (Cooked Steamed Plain White Rice)', 'Cereals and Millets', '1 cup cooked (150g)', 130, 2.7, 28.2, 0.3, 0.4);
addFood('Sona Masoori Rice (Raw Medium Grain)', 'Cereals and Millets', '1 cup raw (180g)', 348, 7.2, 78.4, 0.5, 1.2);
addFood('Sona Masoori Rice (Cooked Steamed White Rice)', 'Cereals and Millets', '1 cup cooked (150g)', 132, 2.6, 28.6, 0.2, 0.4);
addFood('Ponni Rice (Cooked Steamed Tamil Parboiled Rice)', 'Cereals and Millets', '1 cup cooked (150g)', 134, 2.8, 29.1, 0.3, 0.6);
addFood('Kerala Red Matta Rice (Cooked Steamed Unpolished Rice)', 'Cereals and Millets', '1 cup cooked (150g)', 142, 3.2, 30.4, 0.6, 1.8);
addFood('Brown Rice (Cooked Whole Grain Rice)', 'Cereals and Millets', '1 cup cooked (150g)', 123, 2.7, 25.6, 1.0, 1.6);
addFood('Whole Wheat Flour / Chakki Atta (Raw Pure Grain Flour)', 'Cereals and Millets', '1 cup (120g)', 340, 12.1, 71.2, 1.7, 11.2);
addFood('Besan / Gram Flour (Raw Bengal Gram Chickpea Flour)', 'Grain Legumes and Pulses', '1 cup (100g)', 387, 22.4, 57.8, 5.4, 10.8);
addFood('Sooji / Semolina / Rava (Raw Wheat Granules)', 'Cereals and Millets', '1 cup (160g)', 360, 12.7, 72.8, 1.1, 3.9);
addFood('Toor Dal / Arhar Dal (Raw Split Pigeon Peas)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 343, 22.3, 62.8, 1.5, 15.0);
addFood('Toor Dal (Cooked Plain Boiled Dal with Turmeric & Salt)', 'Dal and Lentil Dishes', '1 bowl cooked (200g)', 116, 7.2, 19.8, 0.8, 4.6);
addFood('Moong Dal / Yellow Split Moong (Raw Dehusked Mung Beans)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 347, 24.5, 59.9, 1.2, 16.3);
addFood('Moong Dal (Cooked Plain Boiled Dal)', 'Dal and Lentil Dishes', '1 bowl cooked (200g)', 105, 7.0, 19.2, 0.4, 7.6);
addFood('Chana Dal / Split Bengal Gram (Raw)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 372, 20.8, 59.8, 5.6, 18.3);
addFood('Masoor Dal / Red Split Lentils (Raw)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 343, 25.1, 60.1, 1.0, 10.8);
addFood('Urad Dal / Black Gram Split (Raw Dehusked)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 341, 25.2, 58.9, 1.4, 18.3);
addFood('Whole Urad / Sabut Urad (Raw Black Lentils)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 347, 24.0, 60.0, 1.4, 17.6);
addFood('Kabuli Chana / White Chickpeas (Raw Dried Chickpeas)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 364, 19.3, 60.6, 6.0, 17.4);
addFood('Kala Chana / Brown Chickpeas (Raw Desi Chickpeas)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 360, 20.5, 58.2, 5.3, 25.2);
addFood('Rajma / Red Kidney Beans (Raw Dried Beans)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 333, 24.0, 60.0, 0.8, 24.9);
addFood('Lobia / Cowpeas (Raw White Black-Eyed Peas)', 'Grain Legumes and Pulses', '1 cup raw (180g)', 336, 23.5, 60.0, 1.3, 11.0);
addFood('Alphonso Mango (Fresh Ripe Sweet Indian Mango Flesh)', 'Fruits and Fruit Juices', '1 medium mango (200g)', 65, 0.8, 15.0, 0.4, 1.6);
addFood('Kesar Mango (Fresh Ripe Indian Mango Flesh)', 'Fruits and Fruit Juices', '1 mango (200g)', 64, 0.7, 14.8, 0.3, 1.6);
addFood('Indian Banana / Robusta Banana (Fresh Ripe Fruit)', 'Fruits and Fruit Juices', '1 banana (100g)', 89, 1.1, 22.8, 0.3, 2.6);
addFood('Kerala Nendran Banana (Fresh Raw Cooking Plantain)', 'Fruits and Fruit Juices', '1 banana (120g)', 116, 1.3, 29.8, 0.3, 2.8);
addFood('Indian Guava / Amrood (Fresh White Flesh with Seeds)', 'Fruits and Fruit Juices', '1 medium guava (100g)', 68, 2.6, 14.3, 1.0, 5.4);
addFood('Papaya / Papita (Fresh Ripe Orange Flesh)', 'Fruits and Fruit Juices', '1 cup cubes (140g)', 43, 0.5, 10.8, 0.3, 1.7);
addFood('Pomegranate / Anar (Fresh Crimson Arils/Seeds)', 'Fruits and Fruit Juices', '1 cup arils (150g)', 83, 1.7, 18.7, 1.2, 4.0);
addFood('Mosambi / Sweet Lime (Fresh Whole Segments)', 'Fruits and Fruit Juices', '1 fruit (130g)', 43, 0.8, 9.3, 0.3, 0.5);
addFood('Amla / Indian Gooseberry (Fresh Raw Nutrient-Rich Fruit)', 'Fruits and Fruit Juices', '2 amlas (50g)', 44, 0.9, 10.2, 0.6, 4.3);
addFood('Chikoo / Sapodilla (Fresh Ripe Brown Flesh)', 'Fruits and Fruit Juices', '1 chikoo (80g)', 83, 0.4, 20.0, 1.1, 5.3);
addFood('Sitaphal / Custard Apple (Fresh Creamy Sweet Flesh)', 'Fruits and Fruit Juices', '1 fruit (120g pulp)', 94, 2.1, 23.6, 0.3, 4.4);
addFood('Fresh Coconut Kernel (Solid White Coconut Meat)', 'Fruits and Fruit Juices', '1 piece (50g)', 354, 3.3, 15.2, 33.5, 9.0);
addFood('Tender Coconut Water (Fresh Chilled Coconut Electrolyte Water)', 'Dairy and Beverages', '1 coconut (250ml)', 19, 0.7, 3.7, 0.2, 1.1);

// -----------------------------------------------------------------------------
// 11. INDIAN SWEETS & MITHAI
// -----------------------------------------------------------------------------
addFood('Gulab Jamun (Deep-Fried Mawa & Paneer Balls in Rose Cardamom Saffron Sugar Syrup)', 'Indian Sweets and Mithai', '2 pieces (100g)', 324, 4.6, 52.8, 11.2, 0.8);
addFood('Kala Jamun (Crisp Dark Caramelized Mawa Dumplings in Rose Sugar Syrup)', 'Indian Sweets and Mithai', '2 pieces (100g)', 336, 4.8, 54.2, 11.8, 0.8);
addFood('Jalebi (Crispy Fermented Flour Swirls Deep Fried in Ghee & Dipped in Saffron Syrup)', 'Indian Sweets and Mithai', '3 jalebis (80g)', 388, 3.2, 72.4, 10.2, 0.4);
addFood('Imarti / Jangiri (Crisp Urad Dal Batter Flower Swirls Soaked in Rose Cardamom Sugar Syrup)', 'Indian Sweets and Mithai', '2 pieces (80g)', 354, 4.8, 64.2, 9.4, 1.2);
addFood('Motichoor Ladoo (Tiny Gram Flour Pearls Fried in Desi Ghee & Bound with Saffron Sugar Syrup)', 'Indian Sweets and Mithai', '2 ladoos (80g)', 398, 4.2, 62.4, 15.6, 1.2);
addFood('Besan Ladoo (Roasted Gram Flour with Desi Ghee, Cardamom & Sugar Powder)', 'Indian Sweets and Mithai', '2 ladoos (80g)', 464, 8.4, 54.8, 24.8, 3.6);
addFood('Boondi Ladoo (Crispy Fried Gram Flour Drops Bound with Cardamom Saffron Syrup & Cashews)', 'Indian Sweets and Mithai', '2 ladoos (80g)', 412, 4.8, 64.6, 15.8, 1.4);
addFood('Mysore Pak (Traditional Karnataka Melt-in-Mouth Gram Flour Besan Fudge in Pure Ghee)', 'Indian Sweets and Mithai', '2 pieces (60g)', 524, 5.6, 48.2, 34.8, 1.8);
addFood('Kaju Katli / Kaju Barfi (Diamond Cashew Nut Silver Leaf Fudge with Cardamom)', 'Indian Sweets and Mithai', '2 pieces (50g)', 448, 9.6, 56.4, 21.2, 1.8);
addFood('Kaju Pista Roll (Cashew Nut Fudge Cylinders Stuffed with Crushed Green Pistachios)', 'Indian Sweets and Mithai', '2 rolls (60g)', 456, 10.2, 54.8, 22.4, 2.0);
addFood('Mawa Barfi / Khoya Barfi (Classic Reduced Solid Milk Fudge with Cardamom & Pistachios)', 'Indian Sweets and Mithai', '2 pieces (60g)', 386, 9.8, 48.2, 17.8, 0.0);
addFood('Coconut Barfi / Nariyal Ladoo (Fresh Grated Coconut Fudge with Condensed Milk & Cardamom)', 'Indian Sweets and Mithai', '2 pieces (60g)', 398, 5.4, 52.6, 19.4, 3.8);
addFood('Doodh Peda / Milk Peda (Soft Round Reduced Milk Fudge Flavored with Cardamom & Saffron)', 'Indian Sweets and Mithai', '2 pedas (60g)', 378, 9.2, 51.4, 15.8, 0.0);
addFood('Dharwad Peda (Karnataka Famous Caramelized Brown Milk Mawa Fudge Rolled in Sugar)', 'Indian Sweets and Mithai', '2 pedas (60g)', 408, 8.8, 54.2, 18.2, 0.0);
addFood('Gajar Ka Halwa / Carrot Halwa (Grated Red Carrots Simmered in Milk, Khoya, Ghee, Sugar & Nuts)', 'Indian Sweets and Mithai', '1 bowl (150g)', 248, 4.8, 32.4, 11.6, 2.4);
addFood('Moong Dal Halwa (Rich Yellow Moong Dal Paste Roasted in Desi Ghee with Saffron & Nuts)', 'Indian Sweets and Mithai', '1 bowl (120g)', 384, 7.8, 44.6, 20.4, 2.8);
addFood('Atta Ka Halwa / Kada Prashad (Gurdwara Style Whole Wheat Flour Roasted in Equal Parts Desi Ghee)', 'Indian Sweets and Mithai', '1 bowl (120g)', 426, 5.2, 48.4, 24.2, 3.4);
addFood('Sooji Halwa / Rava Kesari (Golden Roasted Semolina with Ghee, Sugar, Saffron, Cashews & Raisins)', 'Indian Sweets and Mithai', '1 bowl (140g)', 298, 3.8, 46.8, 11.2, 1.4);
addFood('Rice Kheer (Creamy Slow-Simmered Fragrant Basmati Rice Pudding with Cardamom & Nuts)', 'Indian Sweets and Mithai', '1 bowl (180g)', 164, 4.2, 24.8, 5.6, 0.4);
addFood('Semiya Payasam / Vermicelli Kheer (Roasted Wheat Vermicelli Simmered in Sweet Milk & Ghee)', 'Indian Sweets and Mithai', '1 bowl (180g)', 172, 4.4, 26.2, 5.8, 0.8);
addFood('Ada Pradhaman (Kerala Traditional Festive Payasam with Steamed Rice Flakes, Coconut Milk & Jaggery)', 'Indian Sweets and Mithai', '1 bowl (180g)', 214, 3.2, 34.6, 7.4, 1.2);
addFood('Palada Payasam (Kerala Rice Flake Pudding Cooked in Condensed Milk with Ghee & Cardamom)', 'Indian Sweets and Mithai', '1 bowl (180g)', 198, 4.6, 29.8, 7.2, 0.4);
addFood('Phirni (Traditional Kashmiri Creamy Ground Rice Pudding in Earthen Clay Kasora with Pistachios)', 'Indian Sweets and Mithai', '1 bowl (150g)', 168, 4.6, 25.2, 5.8, 0.4);
addFood('Malai Kulfi (Traditional Slow-Reduced Dense Indian Ice Cream on Stick with Cardamom)', 'Indian Sweets and Mithai', '1 kulfi (80g)', 236, 6.2, 22.8, 13.8, 0.0);
addFood('Pista Kulfi (Indian Dense Ice Cream Infused with Crushed Green Pistachios & Saffron)', 'Indian Sweets and Mithai', '1 kulfi (80g)', 242, 6.8, 23.4, 14.1, 0.6);
addFood('Royal Falooda (Chilled Rose Milk Layered with Basil Seeds Sabja, Falooda Sev, Kulfi & Nuts)', 'Indian Sweets and Mithai', '1 tall glass (280ml)', 184, 4.2, 31.8, 5.2, 1.6);
addFood('Ghevar (Rajasthani Disc-Shaped Honeycomb Crisp Pastry Soaked in Sugar Syrup & Topped with Rabri)', 'Indian Sweets and Mithai', '1 slice (100g)', 394, 5.4, 52.8, 18.6, 1.1);
addFood('Malpua (Rich Cardamom-Flavored Fried Pancakes Soaked in Saffron Syrup with Rabri Garnish)', 'Indian Sweets and Mithai', '2 malpuas (100g)', 334, 5.2, 48.6, 14.2, 1.0);
addFood('Soan Papdi (Flaky Melt-in-Mouth Crisp Gram Flour & Ghee Thread Sweet with Almonds)', 'Indian Sweets and Mithai', '2 pieces (50g)', 488, 6.4, 62.8, 24.2, 1.8);
addFood('Agra Petha (Translucent Ash Gourd Winter Melon Candied in Saffron Flavored Sugar Syrup)', 'Indian Sweets and Mithai', '2 pieces (60g)', 284, 0.6, 70.4, 0.2, 1.2);
addFood('Rabri / Rabdi (Thick Clotted Cream Layers Simmered in Sweet Milk with Saffron & Nuts)', 'Indian Sweets and Mithai', '1 bowl (120g)', 268, 8.4, 28.2, 14.0, 0.0);
addFood('Kalakand (Soft Moist Crumbled Milk Chhena Fudge Flavored with Cardamom & Pistachios)', 'Indian Sweets and Mithai', '2 pieces (60g)', 312, 8.6, 38.4, 14.2, 0.0);

// -----------------------------------------------------------------------------
// 12. BEVERAGES & CHAI
// -----------------------------------------------------------------------------
addFood('Masala Chai / Indian Spiced Milk Tea (Brewed CTC Black Tea with Milk, Cardamom, Ginger & Sugar)', 'Dairy and Beverages', '1 cup (150ml)', 74, 2.2, 10.4, 2.6, 0.0);
addFood('Adrak Chai / Ginger Tea (Strong Brewed Milk Tea with Fresh Crushed Ginger & Sugar)', 'Dairy and Beverages', '1 cup (150ml)', 72, 2.1, 10.2, 2.5, 0.0);
addFood('Elaichi Chai / Cardamom Tea (Aromatic Black Tea with Milk & Green Cardamom Pods)', 'Dairy and Beverages', '1 cup (150ml)', 73, 2.2, 10.3, 2.5, 0.0);
addFood('Cutting Chai (Mumbai Style Strong Half-Glass Kadak Spiced Milk Tea)', 'Dairy and Beverages', '1 cutting cup (100ml)', 76, 2.3, 10.8, 2.7, 0.0);
addFood('Black Tea / Sulaimani Chai (Spiced Black Tea with Lemon, Mint & Cardamom, No Milk)', 'Dairy and Beverages', '1 cup (150ml)', 28, 0.2, 6.8, 0.0, 0.0);
addFood('South Indian Filter Coffee (Brewed Coffee Decoction with Chicory & Steamed Full-Cream Frothy Milk)', 'Dairy and Beverages', '1 davarah (150ml)', 88, 2.8, 9.8, 4.1, 0.0);
addFood('Cold Coffee (Chilled Blended Milk with Coffee Decoction, Sugar & Ice Cream)', 'Dairy and Beverages', '1 glass (250ml)', 118, 3.4, 16.8, 4.4, 0.2);
addFood('Sweet Lassi (Thick Chilled Whisked Yogurt Drink Sweetened with Sugar, Cardamom & Malai Cream)', 'Dairy and Beverages', '1 tall glass (250ml)', 112, 3.6, 17.4, 3.2, 0.0);
addFood('Salted Lassi (Whisked Curd Drink with Roasted Cumin, Black Salt & Fresh Mint Leaves)', 'Dairy and Beverages', '1 tall glass (250ml)', 56, 3.2, 4.8, 2.6, 0.2);
addFood('Mango Lassi (Creamy Whisked Curd Blended with Fresh Alphonso Mango Pulp & Cardamom)', 'Dairy and Beverages', '1 tall glass (250ml)', 128, 3.4, 21.8, 3.2, 0.4);
addFood('Chaas / Spiced Buttermilk / Moru / Majjiga (Thin Refreshing Churned Curd with Green Chili, Ginger & Curry Leaves)', 'Dairy and Beverages', '1 glass (200ml)', 32, 1.8, 3.2, 1.4, 0.1);
addFood('Badam Milk (Chilled Sweet Milk Flavored with Almond Paste, Saffron & Cardamom)', 'Dairy and Beverages', '1 glass (200ml)', 124, 4.6, 16.8, 4.4, 0.6);
addFood('Rose Milk (Chilled Milk Blended with Sweet Fragrant Rose Syrup)', 'Dairy and Beverages', '1 glass (200ml)', 98, 3.2, 15.4, 2.8, 0.0);
addFood('Thandai (Holi Festive Chilled Milk with Ground Almonds, Poppy Seeds, Fennel, Cardamom, Rose & Saffron)', 'Dairy and Beverages', '1 glass (200ml)', 148, 5.2, 18.6, 6.4, 0.8);
addFood('Horlicks with Milk (Hot Whole Milk Stirred with Malted Horlicks Nutrition Powder)', 'Dairy and Beverages', '1 mug (200ml)', 94, 3.8, 12.8, 3.2, 0.4);
addFood('Bournvita with Milk (Hot Milk Mixed with Cadbury Bournvita Chocolate Malt Powder)', 'Dairy and Beverages', '1 mug (200ml)', 96, 3.6, 13.4, 3.2, 0.4);
addFood('Jal Jeera (Spicy Tangy Refreshing Drink with Cumin, Mint, Tamarind, Black Salt & Boondi)', 'Dairy and Beverages', '1 glass (200ml)', 24, 0.4, 5.2, 0.2, 0.4);
addFood('Nimbu Pani / Shikanji (Fresh Squeezed Lemonade with Sugar, Mint, Roasted Cumin & Black Salt)', 'Dairy and Beverages', '1 glass (200ml)', 42, 0.2, 10.4, 0.0, 0.2);
addFood('Aam Panna (Traditional Summer Tonic from Roasted Raw Green Mangoes with Cumin & Mint)', 'Dairy and Beverages', '1 glass (200ml)', 56, 0.4, 13.8, 0.1, 0.8);
addFood('Kokum Sharbat (Tangy Red Kokum Fruit Infusion with Roasted Cumin & Black Salt)', 'Dairy and Beverages', '1 glass (200ml)', 48, 0.2, 11.8, 0.1, 0.4);
addFood('Sugarcane Juice / Ganne Ka Ras (Freshly Pressed Cold Sugarcane Juice with Ginger, Lemon & Mint)', 'Dairy and Beverages', '1 glass (250ml)', 68, 0.4, 17.2, 0.0, 0.4);

// -----------------------------------------------------------------------------
// 13. MERGE FULL IFCT 2017 SCIENTIFIC ANALYTICAL DATABASE
// -----------------------------------------------------------------------------
const csvx = require('csv-parse/sync');

const GROUP_CATEGORY_MAP = {
  'Cereals and Millets': 'Cereals and Millets',
  'Grain Legumes': 'Grain Legumes and Pulses',
  'Green Leafy Vegetables': 'Green Leafy Vegetables',
  'Other Vegetables': 'Vegetables and Sabzi',
  'Fruits': 'Fruits and Fruit Juices',
  'Roots and Tubers': 'Vegetables and Sabzi',
  'Condiments and Spices': 'Condiments and Spices',
  'Nuts and Oilseeds': 'Nuts and Seeds',
  'Milk and Milk Products': 'Dairy and Beverages',
  'Meat and Poultry': 'Meat and Poultry',
  'Fish and Other Sea Foods': 'Fish and Seafood',
  'Sugars': 'Indian Sweets and Mithai',
  'Fats and Edible Oils': 'Oils and Fats',
  'Miscellaneous': 'Snacks and Chaat',
};

function extractAliases(langStr) {
  if (!langStr) return '';
  const aliases = [];
  const parts = langStr.split(';');
  for (const p of parts) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(?:A|B|G|H|Kan|Kash|Mal|M|Mar|N|O|P|Tam|Tel|U|S|Kh|E)\.\s*([^,\[\(\.\;]+)/i);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name && !aliases.includes(name) && aliases.length < 3) {
        aliases.push(name);
      }
    }
  }
  return aliases.join(', ');
}

function loadIFCTAndSave() {
  const compCsvPath = path.join(__dirname, '../../node_modules/@ifct2017/compositions/index.csv');
  if (fs.existsSync(compCsvPath)) {
    const content = fs.readFileSync(compCsvPath, 'utf8');
    const records = csvx.parse(content, {
      columns: true,
      skip_empty_lines: true,
      comment: '#',
    });

    const getCol = (row, field) => {
      for (const k of Object.keys(row)) {
        if (k.endsWith(`; ${field}`) || k === field) {
          return row[k];
        }
      }
      return '';
    };

    let ifctCount = 0;
    for (const row of records) {
      const rawName = getCol(row, 'name');
      const langStr = getCol(row, 'lang');
      const grup = getCol(row, 'grup');
      const enerc = parseFloat(getCol(row, 'enerc')) || 0; // kJ
      const prot = parseFloat(getCol(row, 'protcnt')) || 0;
      const fat = parseFloat(getCol(row, 'fatce')) || 0;
      const carbs = parseFloat(getCol(row, 'choavldf')) || 0;
      const fiber = parseFloat(getCol(row, 'fibtg')) || 0;

      const kcal = Math.round(enerc / 4.184);
      const aliases = extractAliases(langStr);
      let displayName = rawName;
      if (aliases) displayName = `${rawName} (${aliases})`;

      const category = GROUP_CATEGORY_MAP[grup] || 'Vegetables and Sabzi';

      addFood(
        displayName,
        category,
        '100g raw / edible portion',
        kcal,
        Math.round(prot * 10) / 10,
        Math.round(carbs * 10) / 10,
        Math.round(fat * 10) / 10,
        Math.round(fiber * 10) / 10
      );
      ifctCount++;
    }
    console.log(`Loaded ${ifctCount} IFCT analytical foods.`);
  }

  // Write catalog JSON
  const outputPath = path.join(__dirname, 'data_massive_indian_catalog.json');
  fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`✅ Generated massive Indian catalog with ${catalog.length} total authentic dishes & analytical foods at: ${outputPath}`);
}

loadIFCTAndSave();


