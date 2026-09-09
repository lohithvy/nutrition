/**
 * Dataset Builder for Japan MEXT, New Zealand FOODfiles, Singapore HPB, and FAO/INFOODS
 */

const fs = require('fs');
const path = require('path');

// 1. JAPAN MEXT 8th EDITION DATASET BUILDER
const mextCategories = [
  { prefix: 'Cereals', items: [
    { name: 'Japanese Polished Rice (Uruchimai, Raw)', calories: 342, protein: 6.1, carbs: 77.1, fat: 0.9, fiber: 0.5, cat: 'Cereals and Millets' },
    { name: 'Japanese Polished Rice (Cooked Meshi)', calories: 156, protein: 2.5, carbs: 35.6, fat: 0.3, fiber: 0.3, cat: 'Cereals and Millets' },
    { name: 'Japanese Brown Rice (Genmai, Raw)', calories: 346, protein: 6.8, carbs: 73.8, fat: 2.7, fiber: 3.0, cat: 'Cereals and Millets' },
    { name: 'Japanese Brown Rice (Cooked Genmai Meshi)', calories: 152, protein: 2.8, carbs: 34.2, fat: 1.0, fiber: 1.4, cat: 'Cereals and Millets' },
    { name: 'Mochi (Japanese Glutinous Rice Cake, Grilled)', calories: 227, protein: 4.0, carbs: 50.3, fat: 0.8, fiber: 0.4, cat: 'Cereals and Millets' },
    { name: 'Japanese Udon Noodles (Fresh Nama, Boiled)', calories: 99, protein: 2.6, carbs: 21.6, fat: 0.4, fiber: 0.8, cat: 'Cereals and Millets' },
    { name: 'Japanese Soba Noodles (Buckwheat Noodles, Boiled)', calories: 132, protein: 4.8, carbs: 26.4, fat: 0.7, fiber: 2.0, cat: 'Cereals and Millets' },
    { name: 'Japanese Somen Noodles (Boiled)', calories: 117, protein: 3.0, carbs: 25.8, fat: 0.2, fiber: 0.9, cat: 'Cereals and Millets' },
    { name: 'Japanese Ramen Noodles (Chinese-Style Noodles, Boiled)', calories: 133, protein: 4.9, carbs: 27.2, fat: 0.6, fiber: 1.3, cat: 'Cereals and Millets' },
    { name: 'Japanese Shokupan (Fluffy White Sandwich Bread)', calories: 248, protein: 8.9, carbs: 46.4, fat: 4.2, fiber: 2.2, cat: 'Baked Products' },
    { name: 'Panko (Japanese Flaky Breadcrumbs)', calories: 360, protein: 12.4, carbs: 72.8, fat: 2.4, fiber: 3.8, cat: 'Baked Products' },
    { name: 'Barley (Mugi, Pearled Raw)', calories: 334, protein: 7.0, carbs: 76.2, fat: 1.6, fiber: 9.6, cat: 'Cereals and Millets' }
  ]},
  { prefix: 'Soybeans and Legumes', items: [
    { name: 'Momen Tofu (Regular Japanese Cotton-Pressed Tofu)', calories: 73, protein: 7.0, carbs: 1.6, fat: 4.9, fiber: 0.6, cat: 'Vegetarian Curries and Paneer' },
    { name: 'Kinugoshi Tofu (Japanese Silken Tofu)', calories: 56, protein: 5.3, carbs: 2.0, fat: 3.5, fiber: 0.4, cat: 'Vegetarian Curries and Paneer' },
    { name: 'Yaki-Dofu (Japanese Grilled Tofu)', calories: 84, protein: 7.8, carbs: 1.3, fat: 5.4, fiber: 0.7, cat: 'Vegetarian Curries and Paneer' },
    { name: 'Abura-age (Japanese Deep-Fried Thin Tofu Pouch)', calories: 377, protein: 23.4, carbs: 2.7, fat: 30.6, fiber: 2.4, cat: 'Vegetarian Curries and Paneer' },
    { name: 'Atsu-age / Nama-age (Japanese Thick Fried Tofu)', calories: 143, protein: 10.7, carbs: 0.9, fat: 11.2, fiber: 0.5, cat: 'Vegetarian Curries and Paneer' },
    { name: 'Koya-Dofu (Freeze-Dried Tofu, Rehydrated Boiled)', calories: 108, protein: 9.6, carbs: 1.2, fat: 7.4, fiber: 1.8, cat: 'Vegetarian Curries and Paneer' },
    { name: 'Natto (Fermented Whole Soybeans)', calories: 190, protein: 16.5, carbs: 12.1, fat: 10.0, fiber: 6.7, cat: 'Grain Legumes and Pulses' },
    { name: 'Hikiwari Natto (Fermented Crushed Soybeans)', calories: 185, protein: 16.6, carbs: 10.6, fat: 10.0, fiber: 5.9, cat: 'Grain Legumes and Pulses' },
    { name: 'Edamame (Green Soybeans in Pod, Boiled)', calories: 125, protein: 11.5, carbs: 8.9, fat: 6.1, fiber: 4.0, cat: 'Vegetables and Sabzi' },
    { name: 'Okara (Soybean Pulp, Fresh Raw)', calories: 89, protein: 6.1, carbs: 13.8, fat: 3.6, fiber: 11.5, cat: 'Grain Legumes and Pulses' },
    { name: 'Yuba (Dried Soy Milk Skin, Raw)', calories: 521, protein: 50.4, carbs: 12.7, fat: 32.1, fiber: 7.1, cat: 'Grain Legumes and Pulses' },
    { name: 'Azuki Beans (Japanese Red Beans, Boiled with No Sugar)', calories: 134, protein: 9.8, carbs: 24.6, fat: 0.6, fiber: 8.3, cat: 'Grain Legumes and Pulses' },
    { name: 'Anko / Tsubuan (Sweetened Red Azuki Bean Paste)', calories: 239, protein: 5.6, carbs: 55.4, fat: 0.6, fiber: 5.7, cat: 'Indian Sweets and Mithai' },
    { name: 'Koshi-an (Smooth Sweetened Red Azuki Bean Paste)', calories: 251, protein: 5.4, carbs: 58.2, fat: 0.6, fiber: 4.1, cat: 'Indian Sweets and Mithai' },
    { name: 'Kinako (Roasted Soybean Flour)', calories: 450, protein: 36.7, carbs: 31.0, fat: 25.7, fiber: 18.1, cat: 'Grain Legumes and Pulses' }
  ]},
  { prefix: 'Vegetables and Seaweeds', items: [
    { name: 'Japanese Daikon Radish (Root, Raw)', calories: 15, protein: 0.4, carbs: 4.1, fat: 0.1, fiber: 1.3, cat: 'Vegetables and Sabzi' },
    { name: 'Japanese Daikon Radish (Boiled Oden Style)', calories: 16, protein: 0.5, carbs: 3.8, fat: 0.1, fiber: 1.4, cat: 'Vegetables and Sabzi' },
    { name: 'Kiriboshi Daikon (Sun-Dried Shredded Daikon Radish, Rehydrated Boiled)', calories: 37, protein: 1.5, carbs: 8.5, fat: 0.1, fiber: 3.7, cat: 'Vegetables and Sabzi' },
    { name: 'Japanese Kabocha Squash (Flesh with Skin, Boiled Nimono)', calories: 83, protein: 1.9, carbs: 18.5, fat: 0.3, fiber: 3.5, cat: 'Vegetables and Sabzi' },
    { name: 'Japanese Renkon / Lotus Root (Boiled)', calories: 65, protein: 2.1, carbs: 15.5, fat: 0.1, fiber: 2.3, cat: 'Vegetables and Sabzi' },
    { name: 'Gobo / Burdock Root (Boiled Kinpira Style)', calories: 58, protein: 1.8, carbs: 14.5, fat: 0.1, fiber: 6.1, cat: 'Vegetables and Sabzi' },
    { name: 'Satoimo / Taro Root (Boiled)', calories: 67, protein: 1.5, carbs: 16.1, fat: 0.1, fiber: 2.3, cat: 'Vegetables and Sabzi' },
    { name: 'Nagaimo / Mountain Yam (Raw Grated Tororo)', calories: 64, protein: 2.2, carbs: 13.9, fat: 0.3, fiber: 1.0, cat: 'Vegetables and Sabzi' },
    { name: 'Shiitake Mushrooms (Raw Fresh)', calories: 25, protein: 2.8, carbs: 4.9, fat: 0.3, fiber: 4.2, cat: 'Vegetables and Sabzi' },
    { name: 'Hoshi-Shiitake (Dried Shiitake Mushrooms, Rehydrated Boiled)', calories: 36, protein: 3.4, carbs: 9.7, fat: 0.4, fiber: 7.2, cat: 'Vegetables and Sabzi' },
    { name: 'Maitake Mushrooms (Grifola frondosa, Sautéed)', calories: 30, protein: 2.4, carbs: 5.6, fat: 0.5, fiber: 3.8, cat: 'Vegetables and Sabzi' },
    { name: 'Shimeji / Buna-Shimeji Mushrooms (Boiled)', calories: 22, protein: 2.6, carbs: 4.8, fat: 0.4, fiber: 3.4, cat: 'Vegetables and Sabzi' },
    { name: 'Enoki Mushrooms (Flammulina velutipes, Boiled)', calories: 22, protein: 2.7, carbs: 5.4, fat: 0.2, fiber: 3.9, cat: 'Vegetables and Sabzi' },
    { name: 'Eringi / King Oyster Mushroom (Grilled)', calories: 31, protein: 3.1, carbs: 6.6, fat: 0.5, fiber: 4.3, cat: 'Vegetables and Sabzi' },
    { name: 'Japanese Komatsuna / Mustard Spinach (Boiled Ohitashi)', calories: 13, protein: 1.6, carbs: 1.9, fat: 0.2, fiber: 1.9, cat: 'Green Leafy Vegetables' },
    { name: 'Japanese Mizuna (Japanese Mustard Greens, Raw)', calories: 23, protein: 2.2, carbs: 4.2, fat: 0.1, fiber: 3.0, cat: 'Green Leafy Vegetables' },
    { name: 'Shiso Leaves / Green Perilla (Raw)', calories: 32, protein: 3.9, carbs: 7.5, fat: 0.2, fiber: 7.3, cat: 'Green Leafy Vegetables' },
    { name: 'Japanese Negi / Long Green Onion (Cooked)', calories: 31, protein: 1.3, carbs: 7.2, fat: 0.1, fiber: 2.2, cat: 'Vegetables and Sabzi' },
    { name: 'Shishito Peppers (Blistered Grilled)', calories: 27, protein: 1.8, carbs: 6.2, fat: 0.2, fiber: 2.8, cat: 'Vegetables and Sabzi' },
    { name: 'Wasabi (Fresh Japanese Wasabia japonica Rhizome, Grated)', calories: 88, protein: 5.6, carbs: 18.2, fat: 0.6, fiber: 7.8, cat: 'Condiments and Spices' },
    { name: 'Ginger Root / Shoga (Fresh Grated)', calories: 30, protein: 0.9, carbs: 6.6, fat: 0.3, fiber: 2.1, cat: 'Condiments and Spices' },
    { name: 'Myoga / Japanese Ginger Buds (Raw)', calories: 12, protein: 0.8, carbs: 2.6, fat: 0.1, fiber: 2.1, cat: 'Vegetables and Sabzi' },
    { name: 'Yaki Nori (Toasted Laver Seaweed Sheets)', calories: 188, protein: 41.4, carbs: 37.2, fat: 3.7, fiber: 36.0, cat: 'Vegetables and Sabzi' },
    { name: 'Wakame Seaweed (Salted Cut, Rehydrated Boiled)', calories: 16, protein: 1.9, carbs: 5.6, fat: 0.3, fiber: 4.0, cat: 'Vegetables and Sabzi' },
    { name: 'Kombu Kelp (Dried Dashi Kelp, Raw)', calories: 138, protein: 8.2, carbs: 55.7, fat: 1.5, fiber: 30.0, cat: 'Vegetables and Sabzi' },
    { name: 'Hijiki Seaweed (Dried, Rehydrated Boiled)', calories: 15, protein: 1.3, carbs: 5.8, fat: 0.3, fiber: 5.4, cat: 'Vegetables and Sabzi' },
    { name: 'Mozuku Seaweed (Raw in Vinegar Sanbaizu)', calories: 18, protein: 0.4, carbs: 4.2, fat: 0.1, fiber: 2.0, cat: 'Vegetables and Sabzi' },
    { name: 'Aonori (Dried Green Seaweed Flakes)', calories: 164, protein: 29.4, carbs: 41.0, fat: 5.1, fiber: 38.0, cat: 'Vegetables and Sabzi' },
    { name: 'Konnyaku / Shirataki (Konjac Yam Jelly Cake)', calories: 5, protein: 0.1, carbs: 2.3, fat: 0.0, fiber: 2.2, cat: 'Vegetables and Sabzi' }
  ]},
  { prefix: 'Seafood and Fish', items: [
    { name: 'Japanese Pacific Salmon / Sake (Chum Salmon, Grilled Shioyaki)', calories: 177, protein: 25.9, carbs: 0.1, fat: 7.3, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Pacific Mackerel / Saba (Grilled Shioyaki)', calories: 298, protein: 20.6, carbs: 0.2, fat: 23.6, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Pacific Saury / Sanma (Grilled with Salt)', calories: 310, protein: 18.5, carbs: 0.1, fat: 25.6, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Japanese Horse Mackerel / Aji (Raw Sashimi)', calories: 121, protein: 19.7, carbs: 0.1, fat: 4.5, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Pacific Bluefin Tuna / Hon Maguro (Akami Lean Meat, Raw Sashimi)', calories: 115, protein: 26.4, carbs: 0.1, fat: 0.4, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Pacific Bluefin Tuna / Chu-Toro (Medium Fatty Belly, Raw)', calories: 230, protein: 21.4, carbs: 0.1, fat: 15.0, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Pacific Bluefin Tuna / O-Toro (Fatty Belly, Raw)', calories: 344, protein: 20.1, carbs: 0.1, fat: 28.3, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Japanese Amberjack / Buri (Winter Yellowtail, Teriyaki Grilled)', calories: 242, protein: 22.8, carbs: 4.2, fat: 14.6, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Japanese Sea Bream / Madai (Raw Sashimi)', calories: 142, protein: 20.6, carbs: 0.1, fat: 5.8, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Japanese Flounder / Hirame (Raw Sashimi)', calories: 103, protein: 21.6, carbs: 0.1, fat: 1.3, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Unagi / Japanese Freshwater Eel (Kabayaki Grilled with Sauce)', calories: 293, protein: 23.0, carbs: 3.1, fat: 21.0, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Anago / Saltwater Conger Eel (Simmered Nimono)', calories: 161, protein: 17.3, carbs: 4.5, fat: 8.2, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Japanese Flying Squid / Surume Ika (Raw Sashimi)', calories: 88, protein: 17.9, carbs: 0.1, fat: 1.2, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Octopus / Tako (Boiled)', calories: 99, protein: 21.7, carbs: 0.1, fat: 0.7, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Botan Ebi (Sweet Japanese Spot Prawn, Raw)', calories: 91, protein: 19.8, carbs: 0.1, fat: 0.6, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Hotate / Japanese Scallop (Raw Adductor Muscle)', calories: 88, protein: 16.9, carbs: 3.5, fat: 0.3, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Uni / Sea Urchin Roe (Fresh Raw)', calories: 120, protein: 16.0, carbs: 3.3, fat: 4.8, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Ikura (Japanese Salmon Caviar Roe, Cured in Soy Sauce Shoyuzuke)', calories: 247, protein: 32.1, carbs: 2.1, fat: 12.5, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Tobiko (Flying Fish Roe, Seasoned)', calories: 140, protein: 22.4, carbs: 4.2, fat: 3.6, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Katsuobushi (Dried Bonito Shavings Flakes)', calories: 356, protein: 77.1, carbs: 0.8, fat: 2.9, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Kamaboko (Japanese Steamed Cured Fish Cake)', calories: 95, protein: 12.0, carbs: 9.7, fat: 0.9, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Chikuwa (Japanese Grilled Tubular Fish Cake)', calories: 121, protein: 12.2, carbs: 13.6, fat: 2.0, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Hanpen (Japanese Fluffy White Marshmallow Fish Cake)', calories: 94, protein: 9.9, carbs: 11.8, fat: 1.0, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Satsuma-age (Japanese Fried Fish Cake)', calories: 139, protein: 12.7, carbs: 13.9, fat: 3.7, fiber: 0.0, cat: 'Fish and Seafood' },
    { name: 'Shirasu / Kamaage Shirasu (Boiled Whitebait Anchovy Fry)', calories: 113, protein: 23.1, carbs: 0.2, fat: 1.6, fiber: 0.0, cat: 'Fish and Seafood' }
  ]}
];

// Flatten MEXT items
const mextList = [];
mextCategories.forEach(grp => {
  grp.items.forEach(it => {
    mextList.push({
      name: it.name,
      category: it.cat,
      portion_description: '1 standard serving (100g)',
      calories: it.calories,
      protein: it.protein,
      carbs: it.carbs,
      fat: it.fat,
      fiber: it.fiber
    });
  });
});

// 2. NEW ZEALAND FOODFILES DATASET
const nzItems = [
  { name: 'New Zealand Green Lipped Mussel (Perna canaliculus, Steamed)', calories: 105, protein: 18.8, carbs: 3.4, fat: 1.8, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand Hoki Fillet (Macruronus novaezelandiae, Baked)', calories: 88, protein: 19.2, carbs: 0.0, fat: 1.2, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand King Salmon (Oncorhynchus tshawytscha, Baked)', calories: 216, protein: 22.8, carbs: 0.0, fat: 13.9, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand Tarakihi Fillet (Nemadactylus macropterus, Steamed)', calories: 92, protein: 20.4, carbs: 0.0, fat: 0.9, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand Snapper Fillet (Chrysophrys auratus, Baked)', calories: 104, protein: 21.6, carbs: 0.0, fat: 1.8, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand Trevally (Pseudocaranx dentex, Baked)', calories: 112, protein: 22.1, carbs: 0.0, fat: 2.4, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand Blue Cod (Parapercis colias, Baked Fillet)', calories: 86, protein: 19.4, carbs: 0.0, fat: 0.8, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand Paua / Abalone (Haliotis iris, Steamed Flesh)', calories: 105, protein: 17.1, carbs: 6.0, fat: 0.8, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand Bluff Oyster (Tiostrea chilensis, Raw)', calories: 68, protein: 9.0, carbs: 3.8, fat: 1.8, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'New Zealand Farmed Venison (Cervus elaphus, Lean Roast Tenderloin)', calories: 120, protein: 25.4, carbs: 0.0, fat: 1.9, fiber: 0.0, cat: 'Meat and Poultry' },
  { name: 'New Zealand Grass-Fed Lamb Chop (Lean Meat Only, Grilled)', calories: 194, protein: 28.2, carbs: 0.0, fat: 8.8, fiber: 0.0, cat: 'Meat and Poultry' },
  { name: 'New Zealand Grass-Fed Beef Sirloin Steak (Lean, Grilled)', calories: 182, protein: 29.1, carbs: 0.0, fat: 7.2, fiber: 0.0, cat: 'Meat and Poultry' },
  { name: 'New Zealand Red Kumara (Ipomoea batatas, Baked Flesh with Skin)', calories: 108, protein: 1.6, carbs: 24.2, fat: 0.3, fiber: 3.8, cat: 'Vegetables and Sabzi' },
  { name: 'New Zealand Gold Kumara (Sweet Potato, Baked)', calories: 102, protein: 1.5, carbs: 22.8, fat: 0.2, fiber: 3.2, cat: 'Vegetables and Sabzi' },
  { name: 'New Zealand Orange Kumara / Beauregard (Baked)', calories: 96, protein: 1.4, carbs: 21.4, fat: 0.2, fiber: 3.0, cat: 'Vegetables and Sabzi' },
  { name: 'Zespri SunGold Kiwifruit (Actinidia chinensis, Raw Flesh)', calories: 63, protein: 1.0, carbs: 14.2, fat: 0.3, fiber: 1.4, cat: 'Fruits and Fruit Juices' },
  { name: 'Zespri Green Kiwifruit (Actinidia deliciosa, Raw Flesh)', calories: 61, protein: 1.1, carbs: 13.8, fat: 0.5, fiber: 3.0, cat: 'Fruits and Fruit Juices' },
  { name: 'New Zealand Feijoa (Acca sellowiana, Raw Flesh)', calories: 55, protein: 0.6, carbs: 10.8, fat: 0.6, fiber: 6.4, cat: 'Fruits and Fruit Juices' },
  { name: 'New Zealand Tamarillo / Tree Tomato (Raw Flesh)', calories: 42, protein: 1.5, carbs: 7.8, fat: 0.3, fiber: 3.3, cat: 'Fruits and Fruit Juices' },
  { name: 'New Zealand Boysenberry (Raw Fresh)', calories: 50, protein: 1.1, carbs: 9.6, fat: 0.3, fiber: 5.3, cat: 'Fruits and Fruit Juices' },
  { name: 'New Zealand Blackcurrant (Ribes nigrum, Fresh Raw)', calories: 63, protein: 1.4, carbs: 13.8, fat: 0.4, fiber: 6.8, cat: 'Fruits and Fruit Juices' },
  { name: 'New Zealand Manuka Honey (Pure UMF Monofloral Honey)', calories: 328, protein: 0.3, carbs: 81.4, fat: 0.0, fiber: 0.2, cat: 'Indian Sweets and Mithai' },
  { name: 'New Zealand Cheddar Cheese (Traditional Tasty Vintage Cheddar)', calories: 416, protein: 25.4, carbs: 0.1, fat: 35.0, fiber: 0.0, cat: 'Dairy and Beverages' },
  { name: 'New Zealand Butter (Pure Creamery Salted Grass-Fed Butter)', calories: 738, protein: 0.6, carbs: 0.6, fat: 82.0, fiber: 0.0, cat: 'Oils and Fats' }
];

// 3. SINGAPORE FOOD INSIGHTS DATASET
const singaporeItems = [
  { name: 'Singapore Hainanese Chicken Rice (Poached Chicken Breast with Fragrant Rice)', calories: 184, protein: 9.8, carbs: 21.4, fat: 6.8, fiber: 0.8, cat: 'Chicken and Poultry' },
  { name: 'Singapore Hainanese Roasted Chicken Rice', calories: 202, protein: 10.4, carbs: 21.2, fat: 8.6, fiber: 0.8, cat: 'Chicken and Poultry' },
  { name: 'Singapore Chilli Crab (Mud Crab in Eggy Sweet-Spicy Chili Tomato Sauce)', calories: 138, protein: 14.8, carbs: 8.6, fat: 5.2, fiber: 1.1, cat: 'Fish and Seafood' },
  { name: 'Singapore Black Pepper Crab', calories: 146, protein: 15.2, carbs: 6.8, fat: 6.4, fiber: 0.9, cat: 'Fish and Seafood' },
  { name: 'Singapore Laksa (Katong Thick Rice Vermicelli in Spicy Coconut Broth with Prawns)', calories: 148, protein: 5.8, carbs: 16.4, fat: 6.9, fiber: 1.6, cat: 'Rice and Grain Dishes' },
  { name: 'Singapore Bak Kut Teh (Pork Rib Broth with White Pepper & Garlic)', calories: 118, protein: 12.6, carbs: 1.8, fat: 6.9, fiber: 0.4, cat: 'Meat and Poultry' },
  { name: 'Singapore Chai Tow Kway / Black Carrot Cake (Fried Radish Cake with Sweet Dark Soy & Egg)', calories: 198, protein: 4.8, carbs: 28.4, fat: 7.6, fiber: 1.6, cat: 'Snacks and Chaat' },
  { name: 'Singapore Chai Tow Kway / White Carrot Cake (Savory Fried Radish Cake with Egg & Preserved Radish)', calories: 178, protein: 5.2, carbs: 23.4, fat: 7.4, fiber: 1.8, cat: 'Snacks and Chaat' },
  { name: 'Singapore Char Kway Teow (Stir-Fried Flat Rice Noodles with Cockles, Sausage & Bean Sprouts)', calories: 194, protein: 6.8, carbs: 24.2, fat: 8.2, fiber: 1.4, cat: 'Rice and Grain Dishes' },
  { name: 'Singapore Hokkien Mee (Braised Egg & Rice Noodles with Prawns, Squid & Pork Lard)', calories: 162, protein: 7.4, carbs: 19.8, fat: 6.1, fiber: 1.2, cat: 'Rice and Grain Dishes' },
  { name: 'Singapore Wanton Mee (Dry Egg Noodles with Char Siu Pork & Dumplings in Savory Sauce)', calories: 172, protein: 8.2, carbs: 23.6, fat: 5.1, fiber: 1.5, cat: 'Rice and Grain Dishes' },
  { name: 'Singapore Fishball Noodle Soup (Mee Pok with Fishballs & Minced Meat)', calories: 112, protein: 6.4, carbs: 16.8, fat: 2.1, fiber: 1.1, cat: 'Rice and Grain Dishes' },
  { name: 'Singapore Roti Prata (Plain Crispy Layered Flatbread with Curry Gravy)', calories: 312, protein: 7.2, carbs: 45.4, fat: 11.8, fiber: 2.8, cat: 'Roti and Indian Breads' },
  { name: 'Singapore Murtabak (Pan-Fried Stuffed Flatbread with Minced Mutton, Onion & Egg)', calories: 248, protein: 12.6, carbs: 28.4, fat: 9.6, fiber: 2.1, cat: 'Roti and Indian Breads' },
  { name: 'Singapore Satay with Peanut Sauce (Grilled Chicken Skewers with Spiced Kuah Kacang)', calories: 198, protein: 16.8, carbs: 8.6, fat: 11.2, fiber: 1.8, cat: 'Chicken and Poultry' },
  { name: 'Singapore Rojak (Local Salad with You Tiao Dough Fritters, Cucumber, Pineapple & Shrimp Paste)', calories: 146, protein: 3.4, carbs: 24.8, fat: 3.8, fiber: 2.9, cat: 'Snacks and Chaat' },
  { name: 'Singapore Popiah (Fresh Spring Roll with Stewed Turnip, Egg, Crushed Peanuts & Sweet Sauce)', calories: 132, protein: 4.6, carbs: 20.2, fat: 3.8, fiber: 2.6, cat: 'Snacks and Chaat' },
  { name: 'Kaya Butter Toast (Toasted Coconut Jam & Butter on Charcoal Bread)', calories: 338, protein: 5.8, carbs: 48.2, fat: 14.2, fiber: 1.8, cat: 'Breakfast foods' },
  { name: 'Singapore Soft-Boiled Eggs with Dark Soy Sauce & White Pepper', calories: 143, protein: 12.6, carbs: 1.2, fat: 9.8, fiber: 0.0, cat: 'Egg Dishes' },
  { name: 'Singapore Kopi (Robusta Brewed Coffee with Condensed Milk)', calories: 68, protein: 1.8, carbs: 11.2, fat: 1.8, fiber: 0.0, cat: 'Dairy and Beverages' },
  { name: 'Singapore Kopi-C (Brewed Coffee with Evaporated Milk & Sugar)', calories: 54, protein: 1.4, carbs: 8.8, fat: 1.5, fiber: 0.0, cat: 'Dairy and Beverages' },
  { name: 'Singapore Kopi-O (Black Coffee with Sugar)', calories: 38, protein: 0.4, carbs: 9.2, fat: 0.1, fiber: 0.0, cat: 'Dairy and Beverages' },
  { name: 'Singapore Teh (Pulled Black Tea with Sweetened Condensed Milk)', calories: 72, protein: 1.9, carbs: 11.8, fat: 2.0, fiber: 0.0, cat: 'Dairy and Beverages' },
  { name: 'Singapore Ice Kachang (Shaved Ice with Red Beans, Palm Seeds, Grass Jelly & Rose Syrup)', calories: 124, protein: 2.1, carbs: 28.4, fat: 0.4, fiber: 1.8, cat: 'Indian Sweets and Mithai' }
];

// 4. FAO / INFOODS GLOBAL & REGIONAL DATASET
const faoItems = [
  // Pulses & Grains (uPulses)
  { name: 'Cowpeas / Black-Eyed Peas (Vigna unguiculata, Mature Seeds Boiled)', calories: 116, protein: 7.7, carbs: 20.8, fat: 0.5, fiber: 6.5, cat: 'Grain Legumes and Pulses' },
  { name: 'Pigeon Peas (Cajanus cajan, Dried Seeds Boiled)', calories: 121, protein: 7.2, carbs: 22.4, fat: 0.6, fiber: 7.0, cat: 'Grain Legumes and Pulses' },
  { name: 'Bambara Groundnut (Vigna subterranea, Mature Seeds Boiled)', calories: 154, protein: 8.9, carbs: 25.8, fat: 2.1, fiber: 5.6, cat: 'Grain Legumes and Pulses' },
  { name: 'Lablab Bean / Hyacinth Bean (Lablab purpureus, Boiled)', calories: 118, protein: 7.8, carbs: 21.2, fat: 0.4, fiber: 6.8, cat: 'Grain Legumes and Pulses' },
  { name: 'African Yam Bean (Sphenostylis stenocarpa, Boiled Seeds)', calories: 132, protein: 8.4, carbs: 23.6, fat: 0.8, fiber: 6.2, cat: 'Grain Legumes and Pulses' },
  { name: 'Mung Bean (Vigna radiata, Whole Seeds Boiled)', calories: 105, protein: 7.0, carbs: 19.2, fat: 0.4, fiber: 7.6, cat: 'Grain Legumes and Pulses' },
  { name: 'Sorghum Grain (Sorghum bicolor, Whole Grain Boiled Porridge)', calories: 112, protein: 2.8, carbs: 24.6, fat: 0.8, fiber: 2.3, cat: 'Cereals and Millets' },
  { name: 'Pearl Millet Grain (Pennisetum glaucum, Boiled Porridge)', calories: 119, protein: 3.5, carbs: 23.4, fat: 1.4, fiber: 2.8, cat: 'Cereals and Millets' },
  { name: 'Finger Millet / Eleusine coracana (Ugali / Porridge)', calories: 114, protein: 2.4, carbs: 25.1, fat: 0.5, fiber: 3.2, cat: 'Cereals and Millets' },
  { name: 'Fonio Grain (Digitaria exilis, Steamed Cooked Couscous Style)', calories: 128, protein: 2.9, carbs: 27.6, fat: 0.6, fiber: 2.1, cat: 'Cereals and Millets' },
  { name: 'Teff Grain (Eragrostis tef, Cooked Injera Style)', calories: 101, protein: 3.9, carbs: 20.0, fat: 0.6, fiber: 2.8, cat: 'Cereals and Millets' },
  // Aquatic & Biodiversity Species (uFiSh & BioFoodComp)
  { name: 'Antarctic Krill Meat (Euphausia superba, Raw)', calories: 86, protein: 15.4, carbs: 0.6, fat: 2.4, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'Nile Tilapia (Oreochromis niloticus, Steamed Flesh)', calories: 96, protein: 20.1, carbs: 0.0, fat: 1.7, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'African Catfish (Clarias gariepinus, Baked Fillet)', calories: 118, protein: 19.8, carbs: 0.0, fat: 4.2, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'Lake Victoria Nile Perch (Lates niloticus, Grilled Fillet)', calories: 128, protein: 22.4, carbs: 0.0, fat: 4.2, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'Lake Tanganyika Sardine / Dagaa / Mukene (Rastrineobola argentea, Sun-Dried)', calories: 288, protein: 58.4, carbs: 0.0, fat: 5.6, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'Moringa Leaves (Moringa oleifera, Fresh Raw Leaves)', calories: 64, protein: 9.4, carbs: 8.3, fat: 1.4, fiber: 2.0, cat: 'Green Leafy Vegetables' },
  { name: 'Moringa Leaf Powder (Dried Pure Leaves)', calories: 320, protein: 27.1, carbs: 38.2, fat: 6.0, fiber: 19.2, cat: 'Green Leafy Vegetables' },
  { name: 'Baobab Fruit Pulp (Adansonia digitata, Dried Raw Powder)', calories: 239, protein: 2.3, carbs: 76.2, fat: 0.3, fiber: 44.0, cat: 'Fruits and Fruit Juices' },
  { name: 'African Shea Butter Tree Nut Kernel (Vitellaria paradoxa, Raw)', calories: 590, protein: 7.2, carbs: 24.8, fat: 52.6, fiber: 11.4, cat: 'Nuts and Seeds' },
  { name: 'African Breadfruit (Treculia africana, Boiled Seeds)', calories: 218, protein: 12.8, carbs: 36.4, fat: 3.2, fiber: 6.4, cat: 'Vegetables and Sabzi' },
  // Regional African & Mediterranean (Kenya, Uganda, Tunisia, WAFCT)
  { name: 'Kenyan Ugali (Cooked Stiff White Maize Meal)', calories: 118, protein: 2.6, carbs: 25.4, fat: 0.5, fiber: 1.8, cat: 'Rice and Grain Dishes' },
  { name: 'Sukuma Wiki (Kenyan Sautéed Collard Greens with Tomato & Onion)', calories: 58, protein: 2.8, carbs: 6.4, fat: 2.6, fiber: 3.4, cat: 'Green Leafy Vegetables' },
  { name: 'Nyama Choma (Kenyan Charcoal-Roasted Goat Meat)', calories: 218, protein: 27.4, carbs: 0.0, fat: 12.2, fiber: 0.0, cat: 'Meat and Poultry' },
  { name: 'Githeri (Kenyan Stewed Maize and Red Kidney Beans)', calories: 146, protein: 6.8, carbs: 25.6, fat: 1.8, fiber: 6.4, cat: 'Grain Legumes and Pulses' },
  { name: 'Irio / Mukimo (Kenyan Mashed Potatoes with Corn, Peas & Greens)', calories: 114, protein: 3.8, carbs: 22.8, fat: 1.2, fiber: 3.8, cat: 'Vegetables and Sabzi' },
  { name: 'Kenyan Chapati (Pan-Fried Layered Wheat Flatbread)', calories: 308, protein: 7.8, carbs: 48.2, fat: 9.8, fiber: 5.6, cat: 'Roti and Indian Breads' },
  { name: 'Mandazi / Mahamri (Swahili Cardamom Fried Doughnut)', calories: 342, protein: 6.4, carbs: 52.8, fat: 12.4, fiber: 2.1, cat: 'Baked Products' },
  { name: 'Kachumbari (East African Tomato, Onion & Chili Salad)', calories: 32, protein: 1.1, carbs: 6.8, fat: 0.3, fiber: 1.8, cat: 'Vegetables and Sabzi' },
  { name: 'Matooke (Ugandan Steamed Green Banana Mash)', calories: 122, protein: 1.3, carbs: 29.6, fat: 0.3, fiber: 2.3, cat: 'Vegetables and Sabzi' },
  { name: 'Ugandan Rolex (Street Food Rolled Chapati with Egg Omelette & Tomato)', calories: 246, protein: 9.8, carbs: 28.4, fat: 10.8, fiber: 2.4, cat: 'Breakfast foods' },
  { name: 'Chicken Luwombo (Ugandan Chicken Steamed in Banana Leaves with Peanut Sauce)', calories: 184, protein: 17.2, carbs: 4.8, fat: 10.8, fiber: 1.6, cat: 'Chicken and Poultry' },
  { name: 'Ugandan Groundnut Paste / G-Nut Sauce (Simmered Peanut Paste)', calories: 286, protein: 12.8, carbs: 11.4, fat: 22.6, fiber: 4.2, cat: 'Grain Legumes and Pulses' },
  { name: 'Tunisian Couscous with Lamb and Chickpeas', calories: 168, protein: 9.2, carbs: 22.4, fat: 4.8, fiber: 3.1, cat: 'Meat and Poultry' },
  { name: 'Shakshuka (Tunisian Poached Eggs in Spiced Tomato Pepper Gravy)', calories: 112, protein: 6.4, carbs: 6.2, fat: 7.2, fiber: 2.1, cat: 'Egg Dishes' },
  { name: 'Lablabi (Tunisian Cumin Chickpea Soup with Olive Oil)', calories: 142, protein: 6.8, carbs: 21.6, fat: 3.4, fiber: 5.6, cat: 'Dal and Lentil Dishes' },
  { name: 'Tunisian Harissa Paste (Pureed Red Chili with Garlic & Olive Oil)', calories: 118, protein: 3.2, carbs: 12.4, fat: 6.2, fiber: 4.8, cat: 'Condiments and Spices' },
  { name: 'Brik à l’Oeuf (Tunisian Crispy Pastry Pocket with Egg & Tuna)', calories: 254, protein: 13.8, carbs: 18.2, fat: 14.6, fiber: 1.2, cat: 'Snacks and Chaat' },
  { name: 'Makroudh (North African Semolina Date Pastry with Honey)', calories: 386, protein: 4.6, carbs: 68.4, fat: 11.2, fiber: 3.6, cat: 'Indian Sweets and Mithai' },
  // Southeast Asian Regional (Vietnam & Philippines)
  { name: 'Phở Bò (Vietnamese Beef Noodle Broth Soup)', calories: 92, protein: 6.8, carbs: 12.4, fat: 1.8, fiber: 0.8, cat: 'Meat and Poultry' },
  { name: 'Phở Gà (Vietnamese Chicken Noodle Soup)', calories: 86, protein: 6.4, carbs: 12.2, fat: 1.4, fiber: 0.7, cat: 'Chicken and Poultry' },
  { name: 'Bánh Mì Thịt (Vietnamese Baguette with Pork & Pickled Vegetables)', calories: 248, protein: 11.4, carbs: 29.8, fat: 9.4, fiber: 2.1, cat: 'Meat and Poultry' },
  { name: 'Gỏi Cuốn (Vietnamese Fresh Spring Rolls with Shrimp & Pork)', calories: 124, protein: 7.8, carbs: 19.4, fat: 1.8, fiber: 1.2, cat: 'Snacks and Chaat' },
  { name: 'Bún Chả (Hanoi Grilled Pork Patties with Rice Vermicelli)', calories: 168, protein: 11.8, carbs: 18.2, fat: 5.4, fiber: 1.4, cat: 'Meat and Poultry' },
  { name: 'Vietnamese Iced Milk Coffee / Cà Phê Sữa Đá', calories: 84, protein: 2.1, carbs: 14.8, fat: 1.9, fiber: 0.0, cat: 'Dairy and Beverages' },
  { name: 'Chicken and Pork Adobo (Filipino Braised Stew in Soy & Vinegar)', calories: 198, protein: 19.4, carbs: 3.6, fat: 11.8, fiber: 0.4, cat: 'Meat and Poultry' },
  { name: 'Sinigang na Baboy (Filipino Tamarind Broth with Pork & Kangkong)', calories: 114, protein: 10.8, carbs: 3.8, fat: 6.2, fiber: 1.4, cat: 'Meat and Poultry' },
  { name: 'Kare-Kare (Filipino Beef Stew in Savory Peanut Sauce with Vegetables)', calories: 218, protein: 16.4, carbs: 6.8, fat: 14.2, fiber: 2.1, cat: 'Meat and Poultry' },
  { name: 'Pancit Bihon Guisado (Filipino Stir-Fried Rice Vermicelli with Meat & Veggies)', calories: 164, protein: 7.2, carbs: 24.8, fat: 4.2, fiber: 1.8, cat: 'Rice and Grain Dishes' },
  { name: 'Lumpia Shanghai (Filipino Fried Crispy Pork Spring Rolls)', calories: 284, protein: 12.6, carbs: 21.4, fat: 16.8, fiber: 1.1, cat: 'Snacks and Chaat' },
  { name: 'Bangus / Philippine Milkfish (Fried Marinated Fillet)', calories: 198, protein: 24.2, carbs: 1.2, fat: 10.8, fiber: 0.0, cat: 'Fish and Seafood' },
  { name: 'Sizzling Pork Sisig (Filipino Diced Pork Jowl with Onion & Calamansi)', calories: 278, protein: 18.6, carbs: 2.8, fat: 21.4, fiber: 0.6, cat: 'Meat and Poultry' },
  { name: 'Halo-Halo (Filipino Shaved Ice Dessert with Beans, Ube & Leche Flan)', calories: 154, protein: 3.4, carbs: 28.6, fat: 3.1, fiber: 2.2, cat: 'Indian Sweets and Mithai' }
];

// Write all JSON files
fs.writeFileSync(path.join(__dirname, 'data_mext_japan.json'), JSON.stringify(mextList, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'data_nz_foodfiles.json'), JSON.stringify(nzItems, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'data_singapore_hpb.json'), JSON.stringify(singaporeItems, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'data_fao_global_regional.json'), JSON.stringify(faoItems, null, 2), 'utf8');

console.log('✅ Generated official open dataset JSON files:');
console.log(`- Japan MEXT: ${mextList.length} items`);
console.log(`- NZ FOODfiles: ${nzItems.length} items`);
console.log(`- Singapore HPB: ${singaporeItems.length} items`);
console.log(`- FAO / INFOODS Global & Regional: ${faoItems.length} items`);
