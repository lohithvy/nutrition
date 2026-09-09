/**
 * Master Indian Food Database Migration Generator
 * Combines all unique Indian foods and recipes from:
 * 1. Anuvaad Indian Nutrient Databank (INDB)
 * 2. ICMR-NIN Indian Food Composition Tables (IFCT 2017)
 * 3. Indian Food Nutritional Values Dataset (Kaggle)
 * 4. Nourish Indian Food Dataset (ICMR-NIN Validated)
 * 5. Anna-Data Indian Culinary Dataset (Hugging Face)
 * 6. OpenNosh Food Datasets (Gujarati & North Indian Packs)
 * 7. inrfood API Database
 * 
 * Strict Standards:
 * - Exact published nutrition values per 100g base amount
 * - user_id = NULL
 * - Full deduplication across all sources & existing USDA foods
 */

const fs = require('fs');
const path = require('path');
const csvx = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

function extractPopularAliases(langStr) {
  if (!langStr) return '';
  const aliases = [];
  const parts = langStr.split(';');
  for (const p of parts) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^(?:A|B|G|H|Kan|Kash|Mal|M|Mar|N|O|P|Tam|Tel|U|S|Kh|E)\.\s*([^,\[\(\.\;]+)/i);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name && !aliases.includes(name) && aliases.length < 4) {
        aliases.push(name);
      }
    }
  }
  return aliases.join(', ');
}

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
    const rawName = getCol(row, 'name');
    const langStr = getCol(row, 'lang');
    const grup = getCol(row, 'grup');
    const enerc = parseFloat(getCol(row, 'enerc')) || 0;
    const prot = parseFloat(getCol(row, 'protcnt')) || 0;
    const fat = parseFloat(getCol(row, 'fatce')) || 0;
    const carbs = parseFloat(getCol(row, 'choavldf')) || 0;
    const fiber = parseFloat(getCol(row, 'fibtg')) || 0;

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
      name: displayName,
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

// Load previously defined curated datasets
const anuvaadScript = require('./seed_anuvaad_indian_foods.js');
const additionalScript = require('./seed_additional_datasets.js');

async function buildMasterMigration() {
  console.log('================================================================');
  console.log('BUILDING MASTER CONSOLIDATED INDIAN FOOD CATALOG FOR VITALIS');
  console.log('================================================================\n');

  // Load from individual seed modules
  // We can re-read the generated migrations to gather all candidate foods cleanly
  const mig3Path = path.join(__dirname, '../../supabase/migrations/20260907000003_seed_anuvaad_indian_foods.sql');
  const mig4Path = path.join(__dirname, '../../supabase/migrations/20260907000004_seed_additional_indian_datasets.sql');

  const parseSqlMigration = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    const text = fs.readFileSync(filePath, 'utf8');
    const rows = [];
    const regex = /\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([0-9.]+),\s*'([^']+)',\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*NULL\)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      rows.push({
        name: match[1],
        category: match[2],
        portion_description: match[3],
        base_amount: parseFloat(match[4]),
        base_unit: match[5],
        calories: parseFloat(match[6]),
        protein: parseFloat(match[7]),
        carbs: parseFloat(match[8]),
        fat: parseFloat(match[9]),
        fiber: parseFloat(match[10]),
        user_id: null,
      });
    }
    return rows;
  };

  const pool3 = parseSqlMigration(mig3Path);
  const pool4 = parseSqlMigration(mig4Path);

  console.log(`Pool 1 (Anuvaad INDB & IFCT 2017): ${pool3.length} items`);
  console.log(`Pool 2 (Kaggle, OpenNosh, Nourish, Anna-Data, inrfood): ${pool4.length} items`);

  // Fetch USDA existing foods from Supabase
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
  console.log(`Found ${existingNames.size} existing USDA foods in database.`);

  const masterList = [];
  const duplicates = [];

  for (const food of [...pool3, ...pool4]) {
    const key = food.name.toLowerCase().trim();
    if (existingNames.has(key)) {
      duplicates.push(food.name);
    } else {
      masterList.push(food);
      existingNames.add(key);
    }
  }

  console.log(`\nConsolidated Master Unique Indian Foods: ${masterList.length}`);
  console.log(`Duplicates avoided: ${duplicates.length}`);

  // Write Master SQL Migration
  const masterMigrationPath = path.join(__dirname, '../../supabase/migrations/20260907000005_seed_complete_indian_food_catalog.sql');
  let sqlContent = `-- ==============================================================================\n`;
  sqlContent += `-- VITALIS FOOD DATABASE: MASTER INDIAN FOOD CATALOG & NUTRIENT DATABANK\n`;
  sqlContent += `-- Total unique Indian foods & recipes: ${masterList.length}\n`;
  sqlContent += `-- Sources:\n`;
  sqlContent += `-- 1. Anuvaad Indian Nutrient Databank (INDB) (anuvaad.org.in)\n`;
  sqlContent += `-- 2. ICMR-NIN Indian Food Composition Tables (IFCT 2017)\n`;
  sqlContent += `-- 3. Indian Food Nutritional Values Dataset (Kaggle)\n`;
  sqlContent += `-- 4. Nourish Indian Food Dataset (ICMR-NIN Validated)\n`;
  sqlContent += `-- 5. Anna-Data Indian Culinary Dataset (Hugging Face)\n`;
  sqlContent += `-- 6. OpenNosh Gujarati & North Indian Datasets (opennosh)\n`;
  sqlContent += `-- 7. inrfood API Database\n`;
  sqlContent += `-- User ID: NULL (System Food reference catalog)\n`;
  sqlContent += `-- ==============================================================================\n\n`;
  sqlContent += `INSERT INTO public.foods (name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber, user_id) VALUES\n`;

  const valueRows = masterList.map(f => {
    const nameEsc = f.name.replace(/'/g, "''");
    const catEsc = f.category.replace(/'/g, "''");
    const portionEsc = f.portion_description.replace(/'/g, "''");
    return `  ('${nameEsc}', '${catEsc}', '${portionEsc}', ${f.base_amount}, '${f.base_unit}', ${f.calories}, ${f.protein}, ${f.carbs}, ${f.fat}, ${f.fiber}, NULL)`;
  });

  sqlContent += valueRows.join(',\n') + ';\n';

  fs.writeFileSync(masterMigrationPath, sqlContent, 'utf8');
  console.log(`\n✅ Generated Master migration SQL file: ${masterMigrationPath}`);
}

buildMasterMigration();
