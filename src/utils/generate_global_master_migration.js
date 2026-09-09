/**
 * VITALIS - Global Food Composition Databases Master Importer
 * Datasets included (Legally Redistributable Open Datasets):
 * 1. Japan Standard Tables of Food Composition (MEXT Japan 8th Edition)
 * 2. FOODfiles New Zealand (Plant & Food Research / MOH NZ)
 * 3. Singapore Food Insights Database (HPB / SFA / data.gov.sg)
 * 4. Vietnamese Food Composition Table (NIN / FAO)
 * 5. Philippine Food Composition Tables (FNRI - DOST)
 * 6. Tunisian Food Composition Database (INNTA / FAO)
 * 7. Kenya Food Composition Tables (MOH Kenya / FAO 2018)
 * 8. Uganda Food Composition Table (MAAIF / FAO)
 * 9. FAO/INFOODS Global Databases (uFiSh, BioFoodComp, uPulses, WAFCT)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Standard Category Normalizer
function normalizeCategory(cat, name) {
  const n = (name || '').toLowerCase();
  const c = (cat || '').toLowerCase();

  if (c.includes('cereal') || c.includes('grain') || c.includes('rice') || c.includes('millet') || c.includes('wheat') || c.includes('oat') || c.includes('barley') || n.includes('rice') || n.includes('noodle') || n.includes('pasta')) {
    return 'Cereals and Millets';
  }
  if (c.includes('pulse') || c.includes('legume') || c.includes('bean') || c.includes('lentil') || c.includes('pea') || c.includes('dal') || c.includes('dhal') || c.includes('soy')) {
    return 'Grain Legumes and Pulses';
  }
  if (c.includes('green leaf') || c.includes('spinach') || c.includes('cabbage') || c.includes('kale') || c.includes('greens') || n.includes('spinach') || n.includes('bok choy') || n.includes('leaves')) {
    return 'Green Leafy Vegetables';
  }
  if (c.includes('vegetable') || c.includes('tuber') || c.includes('root') || c.includes('squash') || c.includes('gourd') || c.includes('mushroom') || c.includes('plantain') || c.includes('cassava') || c.includes('yam')) {
    return 'Vegetables and Sabzi';
  }
  if (c.includes('fruit') || c.includes('berry') || c.includes('citrus') || c.includes('melon') || c.includes('juice') || c.includes('banana') || c.includes('mango') || c.includes('apple')) {
    return 'Fruits and Fruit Juices';
  }
  if (c.includes('milk') || c.includes('dairy') || c.includes('yogurt') || c.includes('cheese') || c.includes('beverage') || c.includes('tea') || c.includes('coffee') || c.includes('drink')) {
    return 'Dairy and Beverages';
  }
  if (c.includes('fish') || c.includes('seafood') || c.includes('shrimp') || c.includes('prawn') || c.includes('crab') || c.includes('mussel') || c.includes('squid') || c.includes('finfish') || c.includes('crustacean')) {
    return 'Fish and Seafood';
  }
  if (c.includes('poultry') || c.includes('chicken') || c.includes('turkey') || c.includes('duck')) {
    return 'Chicken and Poultry';
  }
  if (c.includes('meat') || c.includes('beef') || c.includes('pork') || c.includes('lamb') || c.includes('mutton') || c.includes('veal') || c.includes('game') || c.includes('venison') || c.includes('goat')) {
    return 'Meat and Poultry';
  }
  if (c.includes('egg') || n.includes('egg')) {
    return 'Egg Dishes';
  }
  if (c.includes('nut') || c.includes('seed') || c.includes('oilseed') || c.includes('almond') || c.includes('walnut') || c.includes('peanut') || c.includes('sesame')) {
    return 'Nuts and Seeds';
  }
  if (c.includes('oil') || c.includes('fat') || c.includes('butter') || c.includes('ghee') || c.includes('lard')) {
    return 'Oils and Fats';
  }
  if (c.includes('spice') || c.includes('herb') || c.includes('condiment') || c.includes('sauce') || c.includes('paste') || c.includes('dressing')) {
    return 'Condiments and Spices';
  }
  if (c.includes('bakery') || c.includes('bread') || c.includes('cake') || c.includes('biscuit') || c.includes('pastry') || c.includes('cookie') || c.includes('roll')) {
    return 'Baked Products';
  }
  if (c.includes('sweet') || c.includes('dessert') || c.includes('sugar') || c.includes('honey') || c.includes('candy') || c.includes('chocolate') || c.includes('pudding') || c.includes('syrup')) {
    return 'Indian Sweets and Mithai';
  }
  if (c.includes('snack') || c.includes('fast food') || c.includes('street food') || c.includes('dumpling') || c.includes('roll')) {
    return 'Snacks and Chaat';
  }
  if (c.includes('dish') || c.includes('curry') || c.includes('soup') || c.includes('stew') || c.includes('meal') || c.includes('recipe')) {
    return 'Rice and Grain Dishes';
  }

  return 'Vegetables and Sabzi';
}

function parseNum(val, fallback = 0) {
  if (val === null || val === undefined || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : Number(val.toFixed(2));
  const clean = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? fallback : Number(num.toFixed(2));
}

// Generate Dataset records
async function run() {
  console.log('Fetching existing foods from Supabase for deduplication...');
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

  const existingNames = new Set(allExisting.map(r => r.name.toLowerCase().trim()));
  console.log(`Found ${existingNames.size} existing foods in database.`);

  const candidateList = [];

  // 1. JAPAN MEXT DATASET
  console.log('Loading MEXT Japan Standard Tables...');
  const mextItems = require('./data_mext_japan.json');
  for (const item of mextItems) {
    candidateList.push({
      name: item.name,
      category: normalizeCategory(item.category, item.name),
      portion_description: item.portion_description || '1 serving (100g)',
      base_amount: 100,
      base_unit: 'g',
      calories: parseNum(item.calories),
      protein: parseNum(item.protein),
      carbs: parseNum(item.carbs),
      fat: parseNum(item.fat),
      fiber: parseNum(item.fiber),
    });
  }

  // 2. NEW ZEALAND FOODFILES
  console.log('Loading New Zealand FOODfiles dataset...');
  const nzItems = require('./data_nz_foodfiles.json');
  for (const item of nzItems) {
    candidateList.push({
      name: item.name,
      category: normalizeCategory(item.category, item.name),
      portion_description: item.portion_description || '1 serving (100g)',
      base_amount: 100,
      base_unit: 'g',
      calories: parseNum(item.calories),
      protein: parseNum(item.protein),
      carbs: parseNum(item.carbs),
      fat: parseNum(item.fat),
      fiber: parseNum(item.fiber),
    });
  }

  // 3. SINGAPORE FOOD INSIGHTS
  console.log('Loading Singapore Food Insights dataset...');
  const sgItems = require('./data_singapore_hpb.json');
  for (const item of sgItems) {
    candidateList.push({
      name: item.name,
      category: normalizeCategory(item.category, item.name),
      portion_description: item.portion_description || '1 portion (100g)',
      base_amount: 100,
      base_unit: 'g',
      calories: parseNum(item.calories),
      protein: parseNum(item.protein),
      carbs: parseNum(item.carbs),
      fat: parseNum(item.fat),
      fiber: parseNum(item.fiber),
    });
  }

  // 4. FAO / INFOODS GLOBAL & REGIONAL (uFiSh, BioFoodComp, uPulses, WAFCT, Kenya, Uganda, Vietnam, Philippines, Tunisia)
  console.log('Loading FAO/INFOODS Global & Regional datasets...');
  const faoItems = require('./data_fao_global_regional.json');
  for (const item of faoItems) {
    candidateList.push({
      name: item.name,
      category: normalizeCategory(item.category, item.name),
      portion_description: item.portion_description || '1 serving (100g)',
      base_amount: 100,
      base_unit: 'g',
      calories: parseNum(item.calories),
      protein: parseNum(item.protein),
      carbs: parseNum(item.carbs),
      fat: parseNum(item.fat),
      fiber: parseNum(item.fiber),
    });
  }

  console.log(`Total raw candidate records across all datasets: ${candidateList.length}`);

  // Deduplicate and filter valid nutrition records
  const uniqueToInsert = [];
  let skippedDuplicates = 0;
  let skippedInvalid = 0;

  for (const item of candidateList) {
    const trimmedName = item.name.trim();
    const key = trimmedName.toLowerCase();

    // Must have a name and non-zero or defined energy/macros
    if (!trimmedName || item.calories === null || item.calories === undefined || isNaN(item.calories)) {
      skippedInvalid++;
      continue;
    }

    if (existingNames.has(key)) {
      skippedDuplicates++;
      continue;
    }

    uniqueToInsert.push({
      name: trimmedName,
      category: item.category,
      portion_description: item.portion_description,
      base_amount: 100,
      base_unit: item.base_unit || 'g',
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      fiber: item.fiber,
    });

    existingNames.add(key);
  }

  console.log(`\n======================================================`);
  console.log(`FINAL MASTER DATASET SUMMARY`);
  console.log(`- Unique Valid Records to Insert: ${uniqueToInsert.length}`);
  console.log(`- Duplicates Skipped: ${skippedDuplicates}`);
  console.log(`- Invalid/Missing Nutrients Skipped: ${skippedInvalid}`);
  console.log(`======================================================\n`);

  // Split into manageable SQL migration files or a clean master migration file
  const migrationPath = path.join(__dirname, '../../supabase/migrations/20260907000008_seed_global_food_composition_master.sql');
  
  let sqlContent = `-- ==============================================================================\n`;
  sqlContent += `-- VITALIS: GLOBAL FOOD-COMPOSITION MASTER SEED (OPEN OFFICIAL DATASETS)\n`;
  sqlContent += `-- Datasets Included:\n`;
  sqlContent += `-- 1. Japan Standard Tables of Food Composition (MEXT Japan 8th Edition)\n`;
  sqlContent += `-- 2. FOODfiles (New Zealand Food Composition Database - Plant & Food Research)\n`;
  sqlContent += `-- 3. Singapore Food Insights Database (HPB / SFA / data.gov.sg)\n`;
  sqlContent += `-- 4. Vietnamese Food Composition Table (NIN / FAO)\n`;
  sqlContent += `-- 5. Philippine Food Composition Tables (FNRI - DOST)\n`;
  sqlContent += `-- 6. Tunisian Food Composition Database (INNTA / FAO)\n`;
  sqlContent += `-- 7. Kenya Food Composition Tables (MOH Kenya / FAO 2018)\n`;
  sqlContent += `-- 8. Uganda Food Composition Table (MAAIF / FAO)\n`;
  sqlContent += `-- 9. FAO/INFOODS Global Databases (uFiSh, BioFoodComp, uPulses, WAFCT)\n`;
  sqlContent += `--\n`;
  sqlContent += `-- Total New Unique Foods: ${uniqueToInsert.length}\n`;
  sqlContent += `-- user_id: NULL (System Food reference catalog)\n`;
  sqlContent += `-- ==============================================================================\n\n`;

  const chunkSize = 500;
  for (let i = 0; i < uniqueToInsert.length; i += chunkSize) {
    const chunk = uniqueToInsert.slice(i, i + chunkSize);
    sqlContent += `INSERT INTO public.foods (name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber, user_id) VALUES\n`;
    
    const rows = chunk.map(f => {
      const nameEsc = f.name.replace(/'/g, "''");
      const catEsc = f.category.replace(/'/g, "''");
      const portionEsc = f.portion_description.replace(/'/g, "''");
      return `  ('${nameEsc}', '${catEsc}', '${portionEsc}', ${f.base_amount}, '${f.base_unit}', ${f.calories}, ${f.protein}, ${f.carbs}, ${f.fat}, ${f.fiber}, NULL)`;
    });
    sqlContent += rows.join(',\n') + ';\n\n';
  }

  fs.writeFileSync(migrationPath, sqlContent, 'utf8');
  console.log(`✅ Master migration created at: ${migrationPath}`);
}

run();
