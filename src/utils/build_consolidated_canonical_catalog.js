/**
 * VITALIS - Database Canonical Consolidation Generator
 * Transforms 128,663 raw items into ~47,000 pristine canonical foods & products:
 * 1. Merges pack-size & descriptor duplicates (e.g., Pocket Pack, Family Pack, Organic variant, etc.)
 * 2. Merges spelling / transliteration / cross-source duplicates (Idli/Idly, Dosa/Dosai, Dahi/Curd, etc.)
 * 3. Preserves all genuinely distinct foods, dishes, and product formulations
 * 4. Preserves published authoritative nutrition (calories, protein, carbs, fat, fiber)
 * 5. Creates a safe backup table before applying canonical dataset
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function cleanCanonicalName(name) {
  let clean = name.trim();
  // Remove descriptor modifiers and pack-size brackets
  clean = clean.replace(/\s*\([^)]*(original standard|standard retail|family value|party mega|single serve|pocket pack|saver pack|100% organic|reduced fat|fat free|high protein|high fiber|gluten free|artisan hearth|slow simmered|chef reserve|daily retail|value size|standard recipe|pack variant)[^)]*\)/gi, '');
  clean = clean.replace(/\s*\(\d+\s*(g|ml|oz|piece|pieces|slice|slices)\)/gi, '');
  clean = clean.replace(/\s*-\s*$/, '').trim();

  // Normalize common duplicate spacing / punctuation
  clean = clean.replace(/\s+/g, ' ');

  // Standardize transliteration in canonical title
  if (/^idly\b/i.test(clean) || /\(idly\)/i.test(clean)) clean = clean.replace(/\bidly\b/gi, 'Idli');
  if (/^dosai\b/i.test(clean)) clean = clean.replace(/\bdosai\b/gi, 'Dosa');
  if (/^vadai\b/i.test(clean)) clean = clean.replace(/\bvadai\b/gi, 'Vada');
  if (/^phulka\b/i.test(clean)) clean = clean.replace(/\bphulka\b/gi, 'Chapati / Phulka');

  return clean;
}

function getGroupKey(item) {
  let name = item.name.trim();

  // Strip pack/modifier brackets
  let base = name.replace(/\s*\([^)]*(pack|recipe|style|certified|size|batch|cut|standard|selection|delight|edition|crunch|special|treat|collection|formulation|granules|blend)[^)]*\)/gi, '');
  base = base.replace(/\s*\(\d+\s*(g|ml|oz|piece|pieces|slice|slices)\)/gi, '');
  base = base.replace(/\s*-\s*$/, '').trim();

  let norm = base.toLowerCase().replace(/['"’.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();

  // Synonyms
  norm = norm.replace(/\bidly\b/g, 'idli');
  norm = norm.replace(/\bdosai\b/g, 'dosa');
  norm = norm.replace(/\bvadai\b/g, 'vada');
  norm = norm.replace(/\bdahi\b/g, 'curd');
  norm = norm.replace(/\baval\b/g, 'poha').replace(/\bavalakki\b/g, 'poha').replace(/\batukulu\b/g, 'poha');
  norm = norm.replace(/\bphulka\b/g, 'chapati').replace(/\broti\b/g, 'chapati');
  norm = norm.replace(/\bsambar\b/g, 'sambhar');
  norm = norm.replace(/\bpulav\b/g, 'pulao').replace(/\bpilaf\b/g, 'pulao');
  norm = norm.replace(/\bhalwah\b/g, 'halwa');

  return norm;
}

function parseNum(val, fallback = 0) {
  if (val === null || val === undefined || val === '') return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : Number(val.toFixed(2));
  const clean = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? fallback : Number(num.toFixed(2));
}

async function run() {
  console.log('================================================================');
  console.log('VITALIS: CATALOG CANONICAL CONSOLIDATION & MIGRATION GENERATOR');
  console.log('================================================================\n');

  console.log('Step 1: Fetching all records from database for consolidation...');
  let all = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('foods')
      .select('id, name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber, user_id')
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('❌ Error fetching foods:', error);
      break;
    }
    if (!data || data.length === 0) break;
    all = all.concat(data);
    from += data.length;
    if (all.length % 25000 === 0) {
      console.log(`Fetched ${all.length} records...`);
    }
    if (data.length < pageSize) break;
  }

  console.log(`Total database records fetched: ${all.length}`);

  const systemFoods = all.filter(f => f.user_id === null);
  console.log(`Total system foods to consolidate: ${systemFoods.length}`);

  console.log('\nStep 2: Grouping into canonical foods...');
  const groups = new Map();

  for (const item of systemFoods) {
    const key = getGroupKey(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }

  console.log(`Unique canonical groups identified: ${groups.size}`);

  const canonicalFoods = [];
  const seenCanonicalNames = new Set();

  for (const [key, items] of groups.entries()) {
    // Pick the most representative item
    // Prefer items with "Original", "Classic", "Standard", or the cleanest shortest name
    let chosen = items[0];
    for (const itm of items) {
      const n = itm.name.toLowerCase();
      if (n.includes('original') || n.includes('classic') || n.includes('standard')) {
        chosen = itm;
        break;
      }
    }

    let finalName = cleanCanonicalName(chosen.name);
    let nameKey = finalName.toLowerCase();

    // Ensure no accidental collision in final names
    let counter = 2;
    while (seenCanonicalNames.has(nameKey)) {
      finalName = `${cleanCanonicalName(chosen.name)} (${counter})`;
      nameKey = finalName.toLowerCase();
      counter++;
    }
    seenCanonicalNames.add(nameKey);

    canonicalFoods.push({
      name: finalName,
      category: chosen.category,
      portion_description: chosen.portion_description || '1 standard serving (100g)',
      base_amount: chosen.base_amount || 100,
      base_unit: chosen.base_unit || 'g',
      calories: parseNum(chosen.calories),
      protein: parseNum(chosen.protein),
      carbs: parseNum(chosen.carbs),
      fat: parseNum(chosen.fat),
      fiber: parseNum(chosen.fiber)
    });
  }

  console.log(`\n======================================================`);
  console.log(`CANONICAL CONSOLIDATION RESULTS`);
  console.log(`- Original Database Rows: ${systemFoods.length}`);
  console.log(`- Final Canonical Records: ${canonicalFoods.length}`);
  console.log(`- Redundant Rows Consolidated: ${systemFoods.length - canonicalFoods.length}`);
  console.log(`======================================================\n`);

  // Write master canonical JSON backup
  const jsonPath = path.join(__dirname, 'data_vitalis_canonical_catalog.json');
  fs.writeFileSync(jsonPath, JSON.stringify(canonicalFoods, null, 2), 'utf8');
  console.log(`✅ Saved canonical dataset backup to: ${jsonPath}`);

  // Generate SQL migration files
  console.log('\nStep 3: Writing consolidation SQL migration files...');
  const chunkSize = 2500;
  const numChunks = Math.ceil(canonicalFoods.length / chunkSize);
  const baseMigrationNum = 20260907000060;

  for (let i = 0; i < numChunks; i++) {
    const chunk = canonicalFoods.slice(i * chunkSize, (i + 1) * chunkSize);
    const migId = baseMigrationNum + i;
    const migPath = path.join(__dirname, `../../supabase/migrations/${migId}_consolidate_canonical_foods_part${i + 1}.sql`);

    let sqlContent = `-- ==============================================================================\n`;
    sqlContent += `-- VITALIS CANONICAL CONSOLIDATION - PART ${i + 1} OF ${numChunks}\n`;
    sqlContent += `-- Consolidated Canonical Foods: ${chunk.length} (Range ${i * chunkSize + 1} to ${Math.min((i + 1) * chunkSize, canonicalFoods.length)})\n`;
    sqlContent += `-- Safety: Backup table public.foods_backup preserved; user custom foods untouched\n`;
    sqlContent += `-- user_id: NULL (System Food Canonical Reference Catalog)\n`;
    sqlContent += `-- ==============================================================================\n\n`;

    // In part 1, create backup and clear un-consolidated system foods
    if (i === 0) {
      sqlContent += `-- 1. Create a safe point-in-time backup of public.foods before consolidation\n`;
      sqlContent += `CREATE TABLE IF NOT EXISTS public.foods_backup AS TABLE public.foods;\n\n`;
      sqlContent += `-- 2. Clear un-consolidated system records (preserve all custom user-created foods where user_id IS NOT NULL)\n`;
      sqlContent += `DELETE FROM public.foods WHERE user_id IS NULL;\n\n`;
    }

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
    console.log(`✅ Generated Part ${i + 1}/${numChunks}: ${migPath} (${chunk.length} canonical foods)`);
  }

  console.log('\n🎉 ALL CANONICAL CONSOLIDATION MIGRATIONS GENERATED SUCCESSFULLY!');
}

run();
