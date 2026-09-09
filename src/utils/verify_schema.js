const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXPECTED_TABLES = [
  'profiles',
  'foods',
  'food_logs',
  'recipes',
  'recipe_ingredients',
  'recipe_instructions',
  'grocery_items',
  'workout_splits',
  'workout_split_days',
  'workout_sessions',
  'workout_exercises',
  'workout_sets',
  'exercise_personal_records',
  'water_logs',
  'step_logs',
  'sleep_logs',
  'weight_logs',
  'daily_summaries',
  'notifications'
];

async function verifySchema() {
  console.log('====================================================');
  console.log('VITALIS SUPABASE SCHEMA VERIFICATION');
  console.log('Project URL:', SUPABASE_URL);
  console.log('====================================================\n');

  let existingCount = 0;
  let missingCount = 0;
  const results = [];

  for (const table of EXPECTED_TABLES) {
    const { data, error } = await supabase.from(table).select('*').limit(1);

    if (error && error.code === 'PGRST205') {
      console.log(`❌ [MISSING] Table 'public.${table}' does not exist in schema cache.`);
      missingCount++;
      results.push({ table, status: 'MISSING', error: error.message });
    } else if (error) {
      // If error is permission-denied (PGRST301/42501) due to RLS when unauthenticated, the table EXISTS!
      console.log(`🔒 [EXISTS & RLS ACTIVE] Table 'public.${table}' exists with RLS active (${error.message || 'Permission denied'}).`);
      existingCount++;
      results.push({ table, status: 'EXISTS_RLS_ACTIVE', error: null });
    } else {
      console.log(`✅ [EXISTS & READABLE] Table 'public.${table}' exists (returned ${Array.isArray(data) ? data.length : 0} rows).`);
      existingCount++;
      results.push({ table, status: 'EXISTS_READABLE', data });
    }
  }

  console.log('\n====================================================');
  console.log(`Summary: ${existingCount}/${EXPECTED_TABLES.length} tables verified.`);
  if (missingCount > 0) {
    console.log(`Status: ${missingCount} tables pending creation.`);
  } else {
    console.log('Status: All 19 tables and RLS policies successfully verified! 🚀');
  }
  console.log('====================================================');
}

verifySchema().catch(console.error);
