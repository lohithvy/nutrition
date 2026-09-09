/**
 * VITALIS - Comprehensive Master Importer for South Asian & FAO/INFOODS Databases
 * Datasets:
 * 1. FAO/INFOODS India - Nutritive Value of Indian Foods (NVIF)
 * 2. FAO/INFOODS India - Common Recipes (NIN-ICMR / FAO)
 * 3. FAO/INFOODS Global Food Composition Database for Pulses (uPulses v1.0)
 * 4. FAO/INFOODS Global Food Composition Database for Fish & Shellfish (uFiSh v1.0)
 * 5. AFACI Asian Food Composition Database
 * 6. Nepalese Food Composition Table (DFTQC / FAO)
 * 7. Bangladesh Food Composition Table (FCTB / INFS / FAO)
 * 8. Indonesia Food Composition Table (TKPI / Panganku)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function normalizeCategory(cat, name) {
  const n = (name || '').toLowerCase();
  const c = (cat || '').toLowerCase();

  if (c.includes('cereal') || c.includes('grain') || c.includes('rice') || c.includes('millet') || c.includes('wheat') || c.includes('oat') || c.includes('barley') || n.includes('rice') || n.includes('noodle') || n.includes('roti') || n.includes('bread')) {
    if (n.includes('roti') || n.includes('naan') || n.includes('paratha') || n.includes('chapati') || n.includes('puri') || n.includes('kulcha') || n.includes('thepla')) {
      return 'Roti and Indian Breads';
    }
    return 'Cereals and Millets';
  }
  if (c.includes('pulse') || c.includes('legume') || c.includes('bean') || c.includes('lentil') || c.includes('pea') || c.includes('dal') || c.includes('dhal') || c.includes('gram') || n.includes('dal') || n.includes('dhal')) {
    if (n.includes('curry') || n.includes('tadka') || n.includes('fry') || n.includes('sambar') || n.includes('rasam')) {
      return 'Dal and Lentil Dishes';
    }
    return 'Grain Legumes and Pulses';
  }
  if (c.includes('leaf') || c.includes('spinach') || c.includes('cabbage') || c.includes('greens') || n.includes('spinach') || n.includes('saag') || n.includes('methi') || n.includes('gundruk') || n.includes('leaves')) {
    return 'Green Leafy Vegetables';
  }
  if (c.includes('vegetable') || c.includes('tuber') || c.includes('root') || c.includes('gourd') || c.includes('brinjal') || c.includes('eggplant') || c.includes('potato') || c.includes('bhorta') || c.includes('sabzi')) {
    return 'Vegetables and Sabzi';
  }
  if (c.includes('fruit') || c.includes('juice') || c.includes('mango') || c.includes('banana') || c.includes('guava') || c.includes('papaya')) {
    return 'Fruits and Fruit Juices';
  }
  if (c.includes('milk') || c.includes('dairy') || c.includes('curd') || c.includes('yogurt') || c.includes('paneer') || c.includes('beverage') || c.includes('tea') || c.includes('drink')) {
    if (n.includes('paneer')) return 'Vegetarian Curries and Paneer';
    return 'Dairy and Beverages';
  }
  if (c.includes('fish') || c.includes('seafood') || c.includes('prawn') || c.includes('shrimp') || c.includes('crab') || c.includes('mussel') || c.includes('shutki') || c.includes('hilsa') || c.includes('carp') || n.includes('fish') || n.includes('macher') || n.includes('chingri')) {
    return 'Fish and Seafood';
  }
  if (c.includes('chicken') || c.includes('poultry') || n.includes('chicken') || n.includes('morog') || n.includes('korma') || n.includes('tikka')) {
    return 'Chicken and Poultry';
  }
  if (c.includes('meat') || c.includes('mutton') || c.includes('beef') || c.includes('lamb') || c.includes('goat') || c.includes('pork') || n.includes('mutton') || n.includes('gosht') || n.includes('rendang')) {
    return 'Meat and Poultry';
  }
  if (c.includes('egg') || n.includes('egg') || n.includes('dim')) {
    return 'Egg Dishes';
  }
  if (c.includes('snack') || c.includes('chaat') || c.includes('samosa') || c.includes('pakora') || c.includes('vada') || c.includes('momo') || c.includes('chotpoti') || c.includes('fuchka')) {
    return 'Snacks and Chaat';
  }
  if (c.includes('sweet') || c.includes('mithai') || c.includes('dessert') || c.includes('halwa') || c.includes('laddu') || c.includes('payasam') || c.includes('kheer') || c.includes('sandesh') || c.includes('rosogolla')) {
    return 'Indian Sweets and Mithai';
  }
  if (c.includes('breakfast') || n.includes('dosa') || n.includes('idli') || n.includes('upma') || n.includes('pongal') || n.includes('poha')) {
    return 'Breakfast foods';
  }
  if (c.includes('rice dish') || c.includes('biryani') || c.includes('pulao') || c.includes('khichdi') || c.includes('khichuri') || c.includes('bath') || c.includes('polao')) {
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

async function run() {
  console.log('Connecting to Supabase and fetching all existing records for deduplication...');
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

  const candidateFoods = require('./data_south_asian_master.json');
  console.log(`Loaded ${candidateFoods.length} items from South Asian & FAO master dataset.`);

  const uniqueToInsert = [];
  let duplicatesSkipped = 0;

  for (const item of candidateFoods) {
    const trimmedName = item.name.trim();
    const key = trimmedName.toLowerCase();

    if (!trimmedName || item.calories === null || item.calories === undefined || isNaN(item.calories)) {
      continue;
    }

    if (existingNames.has(key)) {
      duplicatesSkipped++;
      continue;
    }

    uniqueToInsert.push({
      name: trimmedName,
      category: item.category || normalizeCategory(item.category, item.name),
      portion_description: item.portion_description || '1 standard serving (100g)',
      base_amount: 100,
      base_unit: item.base_unit || 'g',
      calories: parseNum(item.calories),
      protein: parseNum(item.protein),
      carbs: parseNum(item.carbs),
      fat: parseNum(item.fat),
      fiber: parseNum(item.fiber),
    });

    existingNames.add(key);
  }

  console.log(`\n======================================================`);
  console.log(`SOUTH ASIAN & FAO/INFOODS MASTER IMPORT SUMMARY`);
  console.log(`- Unique New Records to Insert: ${uniqueToInsert.length}`);
  console.log(`- Duplicates Skipped: ${duplicatesSkipped}`);
  console.log(`======================================================\n`);

  const migrationPath = path.join(__dirname, '../../supabase/migrations/20260907000010_seed_south_asian_and_fao_master.sql');

  let sqlContent = `-- ==============================================================================\n`;
  sqlContent += `-- VITALIS: SOUTH ASIAN & FAO/INFOODS MASTER FOOD COMPOSITION SEED\n`;
  sqlContent += `-- Datasets Included:\n`;
  sqlContent += `-- 1. FAO/INFOODS India - Nutritive Value of Indian Foods (NVIF / NIN-ICMR & FAO)\n`;
  sqlContent += `-- 2. FAO/INFOODS India - Common Recipes (NIN-ICMR & FAO)\n`;
  sqlContent += `-- 3. FAO/INFOODS Global Pulses (uPulses v1.0)\n`;
  sqlContent += `-- 4. FAO/INFOODS Global Fish & Shellfish (uFiSh v1.0)\n`;
  sqlContent += `-- 5. AFACI Asian Food Composition Database\n`;
  sqlContent += `-- 6. Nepalese Food Composition Table (DFTQC Nepal / FAO)\n`;
  sqlContent += `-- 7. Bangladesh Food Composition Table (INFS Dhaka University / FAO FCTB)\n`;
  sqlContent += `-- 8. Indonesia Food Composition Table (TKPI / Panganku / Kemenkes Indonesia)\n`;
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
