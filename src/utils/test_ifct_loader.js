/**
 * Vitalis Indian Food Database Importer
 * Sources:
 * 1. Anuvaad Indian Nutrient Databank (INDB)
 * 2. ICMR-NIN Indian Food Composition Tables (IFCT 2017)
 * 
 * Maps: name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber
 * System foods: user_id = NULL
 */

const fs = require('fs');
const path = require('path');
const csvx = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. Group Mapping for IFCT categories
const GROUP_CATEGORY_MAP = {
  'Cereals and Millets': 'Cereals and Millets',
  'Grain Legumes': 'Grain Legumes and Pulses',
  'Green Leafy Vegetables': 'Green Leafy Vegetables',
  'Other Vegetables': 'Vegetables and Sabzi',
  'Fruits': 'Fruits and Fruit Juices',
  'Roots and Tubers': 'Vegetables and Sabzi',
  'Condiments and Spices': 'Condiments and Spices',
  'Nuts and Oilseeds': 'Nuts and Oilseeds',
  'Milk and Milk Products': 'Dairy and Beverages',
  'Meat and Poultry': 'Meat and Poultry',
  'Fish and Other Sea Foods': 'Fish and Seafood',
  'Sugars': 'Indian Sweets and Mithai',
  'Fats and Edible Oils': 'Fats and Oils',
  'Miscellaneous': 'Snacks and Chaat',
};

// 2. Format localized names nicely
function extractPopularAliases(langStr) {
  if (!langStr) return '';
  const aliases = [];
  const parts = langStr.split(';');
  for (const p of parts) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    // e.g. "H. Ramdana", "Tam. Keerai vidai", "Tel. Thotakoora ginjalu", "Kan. Danthu beeja"
    const match = trimmed.match(/^(?:A|B|G|H|Kan|Kash|Mal|M|Mar|N|O|P|Tam|Tel|U)\.\s*([^,\[\(\.\;]+)/i);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name && !aliases.includes(name) && aliases.length < 4) {
        aliases.push(name);
      }
    }
  }
  return aliases.join(', ');
}

// 3. Extract IFCT raw foods
function getIFCTFoods() {
  const compCsvPath = path.join(__dirname, '../../node_modules/@ifct2017/compositions/index.csv');
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

  const foods = [];

  for (const row of records) {
    const code = getCol(row, 'code');
    const rawName = getCol(row, 'name');
    const sciName = getCol(row, 'scie');
    const langStr = getCol(row, 'lang');
    const grup = getCol(row, 'grup');
    const enerc = parseFloat(getCol(row, 'enerc')) || 0; // in kJ
    const prot = parseFloat(getCol(row, 'protcnt')) || 0;
    const fat = parseFloat(getCol(row, 'fatce')) || 0;
    const carbs = parseFloat(getCol(row, 'choavldf')) || 0;
    const fiber = parseFloat(getCol(row, 'fibtg')) || 0;

    // Convert kJ to kcal (standard 4.184 kJ/kcal)
    const kcal = Math.round(enerc / 4.184);

    const aliases = extractPopularAliases(langStr);
    let displayName = rawName;
    if (aliases) {
      displayName = `${rawName} (${aliases})`;
    }

    const category = GROUP_CATEGORY_MAP[grup] || 'Vegetables and Sabzi';
    let portion = '100g raw / edible portion';
    if (category.includes('Milk') || category.includes('Dairy')) {
      portion = '100ml / 100g';
    } else if (category.includes('Spices') || category.includes('Fats')) {
      portion = '1 tablespoon (15g)';
    }

    foods.push({
      code,
      name: displayName,
      raw_name: rawName,
      category,
      portion_description: portion,
      base_amount: 100,
      base_unit: 'g',
      calories: kcal,
      protein: Math.round(prot * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
    });
  }

  return foods;
}

console.log('IFCT Foods Loaded:', getIFCTFoods().length);
