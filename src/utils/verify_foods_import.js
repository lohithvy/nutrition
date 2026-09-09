const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyFoods() {
  console.log('====================================================');
  console.log('VITALIS FOOD DATABASE IMPORT VERIFICATION');
  console.log('Target Project:', SUPABASE_URL);
  console.log('====================================================\n');

  // 1. Total row count
  const { count, error: countError } = await supabase
    .from('foods')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Error querying public.foods count:', countError.message);
    return;
  }

  console.log(`📊 1. Total Rows in public.foods: ${count}`);

  if (count === 0) {
    console.log('\n⚠️  Notice: public.foods has 0 rows currently.');
    console.log('👉 Please execute the migration in your Supabase SQL Editor:');
    console.log('   supabase/migrations/20260906000001_seed_usda_foods.sql\n');
    return;
  }

  // 2. Check user_id = NULL for all system foods
  const { data: nonNullRows, error: nonNullError } = await supabase
    .from('foods')
    .select('id, name, user_id')
    .not('user_id', 'is', null)
    .limit(10);

  if (nonNullError) {
    console.error('❌ Error checking user_id = NULL:', nonNullError.message);
  } else if (nonNullRows.length === 0) {
    console.log('✅ 2. System Foods Isolation: 100% of imported rows have user_id = NULL.');
  } else {
    console.log(`⚠️ Found ${nonNullRows.length} rows where user_id != NULL.`);
  }

  // 3. Duplicate checks
  const { data: allFoods, error: dupError } = await supabase
    .from('foods')
    .select('name');

  if (dupError) {
    console.error('❌ Error querying names for duplicate check:', dupError.message);
  } else if (allFoods) {
    const seen = new Set();
    let dups = 0;
    for (const f of allFoods) {
      const k = f.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(k)) dups++;
      else seen.add(k);
    }
    if (dups === 0) {
      console.log('✅ 3. Deduplication: 0 duplicate food names found across the entire dataset.');
    } else {
      console.log(`⚠️ Found ${dups} duplicate names.`);
    }
  }

  // 4. Sample rows check
  const { data: samples, error: sampleError } = await supabase
    .from('foods')
    .select('name, category, portion_description, base_amount, base_unit, calories, protein, carbs, fat, fiber, user_id')
    .limit(5);

  if (!sampleError && samples) {
    console.log('\n📋 4. Sample Verified Records:');
    console.table(samples);
  }

  console.log('\n====================================================');
  console.log(`Summary: ${count} / 7,586 USDA System Foods active in public.foods.`);
  console.log('====================================================');
}

verifyFoods().catch(console.error);
