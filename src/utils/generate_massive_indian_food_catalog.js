/**
 * VITALIS - Massive Indian Food Catalog Generator
 * Expands the Indian Food Database with thousands of real Indian foods, dishes, regional preparations,
 * restaurant foods, street foods, sweets, beverages, millets, fruits, vegetables, and protein variants.
 * 
 * Sources & Nutritional References:
 * - ICMR - National Institute of Nutrition (NIN)
 * - Indian Food Composition Tables (IFCT 2017)
 * - Nutritive Value of Indian Foods (NVIF)
 * - Anuvaad Indian Nutrient Databank (INDB)
 * - Standardized Indian Recipe Nutritional Guidelines
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseNum(val, fallback = 0) {
  if (val === null || val === undefined || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : Number(val.toFixed(2));
  const clean = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? fallback : Number(num.toFixed(2));
}

// Generate the large Indian catalog
async function buildAndMigrate() {
  console.log('================================================================');
  console.log('VITALIS: GENERATING MASSIVE EXPANDED INDIAN FOOD CATALOG');
  console.log('================================================================\n');

  // Load datasets from builders
  const datasetFile = path.join(__dirname, 'data_massive_indian_catalog.json');
  if (!fs.existsSync(datasetFile)) {
    console.error('Dataset JSON does not exist. Please run builder first.');
    return;
  }

  const rawList = JSON.parse(fs.readFileSync(datasetFile, 'utf8'));
  console.log(`Loaded ${rawList.length} candidate Indian food items from builder.`);

  // Connect to Supabase and fetch all existing records for 100% deduplication
  console.log('Fetching all existing foods from Supabase database...');
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
  console.log(`Found ${existingNames.size} existing foods currently in database.`);

  const toInsert = [];
  let duplicateCount = 0;

  for (const item of rawList) {
    const trimmedName = (item.name || '').trim();
    const key = trimmedName.toLowerCase();

    if (!trimmedName || item.calories === null || item.calories === undefined || isNaN(item.calories)) {
      continue;
    }

    if (existingNames.has(key)) {
      duplicateCount++;
      continue;
    }

    toInsert.push({
      name: trimmedName,
      category: item.category || 'Vegetables and Sabzi',
      portion_description: item.portion_description || '1 standard serving (100g)',
      base_amount: 100,
      base_unit: item.base_unit || 'g',
      calories: parseNum(item.calories),
      protein: parseNum(item.protein),
      carbs: parseNum(item.carbs),
      fat: parseNum(item.fat),
      fiber: parseNum(item.fiber),
      user_id: null
    });

    existingNames.add(key);
  }

  console.log(`\n======================================================`);
  console.log(`MASSIVE INDIAN FOOD CATALOG SUMMARY`);
  console.log(`- Unique New Foods Ready for Insertion: ${toInsert.length}`);
  console.log(`- Duplicate Records Skipped: ${duplicateCount}`);
  console.log(`======================================================\n`);

  // Write migration SQL file in chunks of 500
  const migrationPath = path.join(__dirname, '../../supabase/migrations/20260907000011_seed_massive_indian_food_catalog.sql');
  let sqlContent = `-- ==============================================================================\n`;
  sqlContent += `-- VITALIS: MASSIVE EXPANDED INDIAN FOOD CATALOG SEED\n`;
  sqlContent += `-- Sources: ICMR-NIN (IFCT 2017), NVIF, Anuvaad INDB, Standardized Indian Recipes\n`;
  sqlContent += `-- Total New Unique Foods: ${toInsert.length}\n`;
  sqlContent += `-- user_id: NULL (System Food reference catalog)\n`;
  sqlContent += `-- ==============================================================================\n\n`;

  const chunkSize = 500;
  for (let i = 0; i < toInsert.length; i += chunkSize) {
    const chunk = toInsert.slice(i, i + chunkSize);
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
  console.log(`✅ Created massive migration file at: ${migrationPath}`);
}

buildAndMigrate();
