/**
 * VITALIS - Indian Packaged & Branded Food Catalog Migration Generator
 * Sources: Open Food Facts (ODbL 1.0) & USDA FoodData Central Branded Foods (CC0)
 * 
 * Target: ~11,800 authentic Indian packaged products across snacks, biscuits, noodles,
 * dairy, chocolates, beverages, ready-to-eat meals, spreads, flours, oils and health drinks.
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

async function run() {
  console.log('================================================================');
  console.log('VITALIS: INDIAN PACKAGED & BRANDED FOOD MIGRATION PIPELINE');
  console.log('================================================================\n');

  console.log('Step 1: Connecting to Supabase to fetch existing food names for deduplication...');
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

  console.log('\nStep 2: Processing Indian packaged dataset...');
  const datasetPath = path.join(__dirname, 'data_indian_packaged_master.json');

  if (!fs.existsSync(datasetPath)) {
    console.log('Building dataset...');
    require('./build_indian_packaged_foods_dataset.js');
  }

  const rawMaster = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  console.log(`Loaded ${rawMaster.length} candidate packaged products.`);

  const uniqueFoods = [];
  let duplicateCount = 0;

  for (const f of rawMaster) {
    const trimmedName = (f.name || '').trim();
    const key = trimmedName.toLowerCase();

    if (!trimmedName || f.calories === null || f.calories === undefined || isNaN(f.calories)) {
      continue;
    }

    if (existingNames.has(key)) {
      duplicateCount++;
      continue;
    }

    uniqueFoods.push({
      name: trimmedName,
      category: f.category || 'Snacks and Chaat',
      portion_description: f.portion_description || '1 pack (100g)',
      base_amount: 100,
      base_unit: f.base_unit || 'g',
      calories: parseNum(f.calories),
      protein: parseNum(f.protein),
      carbs: parseNum(f.carbs),
      fat: parseNum(f.fat),
      fiber: parseNum(f.fiber),
    });

    existingNames.add(key);
  }

  console.log(`\n======================================================`);
  console.log(`INDIAN PACKAGED FOOD CATALOG RESULTS`);
  console.log(`- Total Unique New Records: ${uniqueFoods.length}`);
  console.log(`- Duplicate Records Removed: ${duplicateCount}`);
  console.log(`- Target Catalog Total: ${existingNames.size} foods`);
  console.log(`======================================================\n`);

  // Write migration SQL files in chunks of 2,500
  console.log('Writing SQL migration files...');
  const chunkSize = 2500;
  const numChunks = Math.ceil(uniqueFoods.length / chunkSize);
  const baseMigrationNum = 20260907000055;

  for (let i = 0; i < numChunks; i++) {
    const chunk = uniqueFoods.slice(i * chunkSize, (i + 1) * chunkSize);
    const migId = baseMigrationNum + i;
    const migPath = path.join(__dirname, `../../supabase/migrations/${migId}_seed_indian_packaged_branded_foods_part${i + 1}.sql`);

    let sqlContent = `-- ==============================================================================\n`;
    sqlContent += `-- VITALIS INDIAN PACKAGED & BRANDED FOOD SEED - PART ${i + 1} OF ${numChunks}\n`;
    sqlContent += `-- Sources: Open Food Facts (ODbL 1.0) & USDA FoodData Central (CC0)\n`;
    sqlContent += `-- Attribution: (c) Open Food Facts contributors & USDA FoodData Central\n`;
    sqlContent += `-- Chunk Size: ${chunk.length} foods (Range ${i * chunkSize + 1} to ${Math.min((i + 1) * chunkSize, uniqueFoods.length)})\n`;
    sqlContent += `-- user_id: NULL (System Food Reference Catalog)\n`;
    sqlContent += `-- ==============================================================================\n\n`;

    // Group into multi-row inserts of 500
    const innerChunk = 500;
    for (let j = 0; j < chunk.length; j += innerChunk) {
      const subChunk = chunk.slice(j, j + innerChunk);
      sqlContent += `INSERT INTO public.foods (name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber, user_id) VALUES\n`;
      const rows = subChunk.map(item => {
        const nameEsc = item.name.replace(/'/g, "''");
        const catEsc = item.category.replace(/'/g, "''");
        const portionEsc = item.portion_description.replace(/'/g, "''");
        return `  ('${nameEsc}', '${catEsc}', '${portionEsc}', ${item.base_amount}, '${item.base_unit}', ${item.calories}, ${item.protein}, ${item.carbs}, ${item.fat}, ${item.fiber}, NULL)`;
      });
      sqlContent += rows.join(',\n') + ';\n\n';
    }

    fs.writeFileSync(migPath, sqlContent, 'utf8');
    console.log(`✅ Generated Part ${i + 1}/${numChunks}: ${migPath} (${chunk.length} foods)`);
  }

  console.log('\n🎉 ALL INDIAN PACKAGED FOOD MIGRATIONS GENERATED SUCCESSFULLY!');
}

run();
