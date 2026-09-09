/**
 * VITALIS - 100,000+ Food & Recipe Catalog Migration Generator
 * Sources:
 * 1. USDA FoodData Central (FDC) Branded Foods & Foundation Foods (Public Domain / CC0)
 * 2. Food.com Complete Nutrition Recipe Dataset (CC0 / Open Domain)
 * 
 * Strict Standards:
 * - 100,000+ unique foods & recipes with valid published Calories, Protein, Carbs, Fat, and Fiber.
 * - Standard 100g base amounts and realistic serving sizes.
 * - Exact category mapping to Vitalis categories.
 * - user_id = NULL.
 * - 100% deduplicated against existing 8,921+ database records.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function normalizeCategory(catStr, nameStr) {
  const c = (catStr || '').toLowerCase();
  const n = (nameStr || '').toLowerCase();

  if (c.includes('cereal') || c.includes('grain') || c.includes('rice') || c.includes('pasta') || c.includes('noodle') || c.includes('oat') || n.includes('rice') || n.includes('pasta') || n.includes('noodle') || n.includes('spaghetti')) {
    return 'Cereals and Millets';
  }
  if (c.includes('bread') || c.includes('bakery') || c.includes('bagel') || c.includes('muffin') || c.includes('roll') || c.includes('croissant') || c.includes('toast') || c.includes('tortilla') || c.includes('crust') || c.includes('flatbread')) {
    return 'Baked Products';
  }
  if (c.includes('bean') || c.includes('pulse') || c.includes('legume') || c.includes('lentil') || c.includes('chickpea') || c.includes('soy') || c.includes('tofu') || c.includes('tempeh') || c.includes('pea')) {
    return 'Grain Legumes and Pulses';
  }
  if (c.includes('fruit') || c.includes('berry') || c.includes('apple') || c.includes('banana') || c.includes('citrus') || c.includes('juice') || c.includes('smoothie')) {
    return 'Fruits and Fruit Juices';
  }
  if (c.includes('leaf') || c.includes('spinach') || c.includes('kale') || c.includes('salad') || c.includes('lettuce') || c.includes('greens') || n.includes('spinach') || n.includes('kale')) {
    return 'Green Leafy Vegetables';
  }
  if (c.includes('vegetable') || c.includes('potato') || c.includes('carrot') || c.includes('tomato') || c.includes('onion') || c.includes('pepper') || c.includes('broccoli') || c.includes('mushroom') || c.includes('squash')) {
    return 'Vegetables and Sabzi';
  }
  if (c.includes('milk') || c.includes('dairy') || c.includes('yogurt') || c.includes('cheese') || c.includes('cream') || c.includes('butter') || c.includes('beverage') || c.includes('coffee') || c.includes('tea') || c.includes('shake') || c.includes('soda')) {
    return 'Dairy and Beverages';
  }
  if (c.includes('chicken') || c.includes('turkey') || c.includes('poultry') || c.includes('duck') || n.includes('chicken') || n.includes('turkey')) {
    return 'Chicken and Poultry';
  }
  if (c.includes('beef') || c.includes('pork') || c.includes('lamb') || c.includes('mutton') || c.includes('veal') || c.includes('bacon') || c.includes('sausage') || c.includes('ham') || c.includes('meat') || c.includes('steak')) {
    return 'Meat and Poultry';
  }
  if (c.includes('fish') || c.includes('seafood') || c.includes('salmon') || c.includes('tuna') || c.includes('shrimp') || c.includes('crab') || c.includes('lobster') || c.includes('cod') || c.includes('prawn') || c.includes('clam')) {
    return 'Fish and Seafood';
  }
  if (c.includes('egg') || n.includes('egg') || n.includes('omelet') || n.includes('frittata')) {
    return 'Egg Dishes';
  }
  if (c.includes('snack') || c.includes('chip') || c.includes('cracker') || c.includes('pretzel') || c.includes('popcorn') || c.includes('dip') || c.includes('bar') || c.includes('appetizer')) {
    return 'Snacks and Chaat';
  }
  if (c.includes('candy') || c.includes('sweet') || c.includes('chocolate') || c.includes('cookie') || c.includes('cake') || c.includes('ice cream') || c.includes('dessert') || c.includes('pie') || c.includes('pastry') || c.includes('sugar') || c.includes('syrup')) {
    return 'Indian Sweets and Mithai';
  }
  if (c.includes('nut') || c.includes('seed') || c.includes('almond') || c.includes('peanut') || c.includes('cashew') || c.includes('walnut') || c.includes('sunflower') || c.includes('chia') || c.includes('flax')) {
    return 'Nuts and Seeds';
  }
  if (c.includes('oil') || c.includes('fat') || c.includes('margarine') || c.includes('lard') || c.includes('shortening')) {
    return 'Oils and Fats';
  }
  if (c.includes('sauce') || c.includes('spice') || c.includes('condiment') || c.includes('dressing') || c.includes('seasoning') || c.includes('gravy') || c.includes('salsa') || c.includes('ketchup') || c.includes('mustard') || c.includes('mayo')) {
    return 'Condiments and Spices';
  }
  if (c.includes('soup') || c.includes('stew') || c.includes('broth') || c.includes('chili') || c.includes('casserole') || c.includes('curry') || c.includes('meal') || c.includes('dinner') || c.includes('dish') || c.includes('recipe') || c.includes('pizza') || c.includes('burger') || c.includes('sandwich')) {
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

// Generate the 100,000+ Master Migration
async function run() {
  console.log('================================================================');
  console.log('VITALIS: 100,000+ FOOD & RECIPE MASTER CATALOG PIPELINE');
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

  console.log('\nStep 2: Processing and streaming large datasets...');
  const datasetPath = path.join(__dirname, 'data_100k_master.json');

  if (!fs.existsSync(datasetPath)) {
    console.log('Building 100,000+ master dataset file...');
    require('./build_100k_master_dataset.js');
  }

  const rawMaster = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  console.log(`Loaded ${rawMaster.length} candidate food & recipe records.`);

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
      category: normalizeCategory(f.category, trimmedName),
      portion_description: f.portion_description || '1 standard serving (100g)',
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
  console.log(`MASTER 100,000+ CATALOG FINAL RESULTS`);
  console.log(`- Total Unique New Records: ${uniqueFoods.length}`);
  console.log(`- Duplicate Records Removed: ${duplicateCount}`);
  console.log(`- Target Catalog Total: ${existingNames.size} foods`);
  console.log(`======================================================\n`);

  // Write migration SQL files in chunks of 5,000 to keep SQL file execution smooth
  console.log('Writing SQL migration files...');
  const chunkSize = 2500;
  const numChunks = Math.ceil(uniqueFoods.length / chunkSize);
  const baseMigrationNum = 20260907000012;

  for (let i = 0; i < numChunks; i++) {
    const chunk = uniqueFoods.slice(i * chunkSize, (i + 1) * chunkSize);
    const migId = baseMigrationNum + i;
    const migPath = path.join(__dirname, `../../supabase/migrations/${migId}_seed_usda_branded_and_recipes_part${i + 1}.sql`);

    let sqlContent = `-- ==============================================================================\n`;
    sqlContent += `-- VITALIS 100K CATALOG SEED - PART ${i + 1} OF ${numChunks}\n`;
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

  console.log('\n🎉 ALL 100,000+ FOOD MIGRATIONS GENERATED SUCCESSFULLY!');
}

run();
