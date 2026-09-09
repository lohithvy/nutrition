/**
 * VITALIS - Catalog Consolidation & Deduplication Analyzer
 * Inspects all 128,663 entries across public.foods to identify:
 * 1. Branded / pack size / modifier duplicates
 * 2. Recipe duplicates
 * 3. Generic food / spelling / transliteration / cross-dataset duplicates
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zqraxlkfiqgaecdslkzu.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_UKmol7CuOwTz3OMqvPRocw_8X7c2flJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runAnalysis() {
  console.log('Connecting to Supabase and fetching all catalog records with 1,000-row pagination...');
  let all = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('foods')
      .select('id, name, category, portion_description, calories, protein, carbs, fat, fiber, user_id')
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('Error fetching batch:', error);
      break;
    }
    if (!data || data.length === 0) break;
    all = all.concat(data);
    from += data.length;
    if (all.length % 20000 === 0) {
      console.log(`Fetched ${all.length} records...`);
    }
    if (data.length < pageSize) break;
  }
  console.log(`Total database rows fetched: ${all.length}`);

  // System foods vs user custom foods
  const systemFoods = all.filter(f => f.user_id === null);
  const userFoods = all.filter(f => f.user_id !== null);

  // Normalization logic for canonical identification
  function getCanonicalKey(item) {
    let name = item.name.trim();

    // 1. Remove pack / modifier suffix brackets e.g. (Original Standard Recipe), (Family Value Pack), (Party Mega Saver Pack), (Single Serve Pocket Pack), etc.
    let base = name.replace(/\s*\([^)]*(pack|recipe|style|certified|size|batch|cut|standard|selection|delight|edition|crunch|special|treat|collection|formulation|granules|blend)[^)]*\)/gi, '');
    base = base.replace(/\s*\(\d+\s*(g|ml|oz|piece|pieces|slice|slices)\)/gi, '');
    base = base.replace(/\s*-\s*$/, '').trim();

    // 2. Lowercase and remove punctuation noise
    let norm = base.toLowerCase().replace(/['"’.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();

    // 3. Canonical transliteration and synonym normalizations
    norm = norm.replace(/\bidly\b/g, 'idli');
    norm = norm.replace(/\bdosai\b/g, 'dosa');
    norm = norm.replace(/\bvadai\b/g, 'vada');
    norm = norm.replace(/\bdahi\b/g, 'curd');
    norm = norm.replace(/\baval\b/g, 'poha').replace(/\bavalakki\b/g, 'poha').replace(/\batukulu\b/g, 'poha');
    norm = norm.replace(/\bphulka\b/g, 'chapati').replace(/\broti\b/g, 'chapati');
    norm = norm.replace(/\bsambar\b/g, 'sambhar');
    norm = norm.replace(/\bpulav\b/g, 'pulao').replace(/\bpilaf\b/g, 'pulao');
    norm = norm.replace(/\bhalwa\b/g, 'halwa').replace(/\bhalwah\b/g, 'halwa');

    return norm;
  }

  const groups = new Map();
  for (const item of systemFoods) {
    const key = getCanonicalKey(item);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(item);
  }

  let canonicalCount = groups.size;
  let trueDuplicates = systemFoods.length - canonicalCount;

  let brandedPackageDuplicates = 0;
  let recipeDuplicates = 0;
  let genericFoodDuplicates = 0;

  for (const [key, items] of groups.entries()) {
    if (items.length > 1) {
      const dupCount = items.length - 1;
      const first = items[0];
      const nameLower = first.name.toLowerCase();

      if (first.category === 'Rice and Grain Dishes' || nameLower.includes('soup') || nameLower.includes('stew') || nameLower.includes('curry') || nameLower.includes('casserole') || nameLower.includes('pasta') || nameLower.includes('chili') || nameLower.includes('pie') || nameLower.includes('pizza') || nameLower.includes('bake')) {
        recipeDuplicates += dupCount;
      } else if (first.name.includes(' - ') || first.name.includes('(') || items.some(x => x.name.includes(' - '))) {
        brandedPackageDuplicates += dupCount;
      } else {
        genericFoodDuplicates += dupCount;
      }
    }
  }

  console.log('\n========================================================');
  console.log('VITALIS DATABASE CONSOLIDATION & CLEANUP REPORT');
  console.log('========================================================');
  console.log(`1. Current Total Rows in Database: ${all.length}`);
  console.log(`   - System Foods (user_id = NULL): ${systemFoods.length}`);
  console.log(`   - User Custom Foods (user_id != NULL): ${userFoods.length}`);
  console.log(`2. Estimated True Duplicate Rows: ${trueDuplicates}`);
  console.log(`3. Estimated Canonical Foods After Consolidation: ${canonicalCount}`);
  console.log(`4. Recipe Duplicate Rows: ${recipeDuplicates}`);
  console.log(`5. Generic Food / Spelling / Source Duplicate Rows: ${genericFoodDuplicates}`);
  console.log(`6. Branded Product / Pack-Size / Modifier Duplicate Rows: ${brandedPackageDuplicates}`);
  console.log('========================================================\n');

  // Major Duplicate Groups Sample
  const sortedGroups = Array.from(groups.entries())
    .filter(([k, list]) => list.length > 2)
    .sort((a, b) => b[1].length - a[1].length);

  console.log('7. Examples of Major Duplicate Groups:');
  sortedGroups.slice(0, 15).forEach(([k, list], idx) => {
    console.log(`\nGroup ${idx + 1}: "${k}" (${list.length} copies)`);
    list.slice(0, 3).forEach(x => {
      console.log(`   • [${x.category}] "${x.name}" (Cal: ${x.calories}, P: ${x.protein}g, C: ${x.carbs}g, F: ${x.fat}g, Fib: ${x.fiber}g)`);
    });
  });
}

runAnalysis();
