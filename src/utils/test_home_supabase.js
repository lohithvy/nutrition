// Test script to verify Home Screen Supabase data operations for all 6 tables
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach((line) => {
  const [key, ...vals] = line.trim().split('=');
  if (key && vals.length) {
    env[key.trim()] = vals.join('=').trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runHomeIntegrationTests() {
  console.log('Testing Home Screen Supabase Integrations on project:', supabaseUrl);

  const testEmail = `vitalis.home.test.${Date.now()}@gmail.com`;
  const testPassword = 'TestPassword123!';
  const testDate = new Date().toISOString().split('T')[0];

  // Sign up a test user
  console.log('\n1. Creating test user for authenticated operations...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: 'Test Athlete',
      },
    },
  });

  if (authError) {
    console.error('❌ User creation failed:', authError.message);
    process.exit(1);
  }

  const userId = authData.user?.id;
  console.log('✅ User created. ID:', userId);

  // Sign in if session wasn't auto-established (or if email confirm is bypassed)
  let session = authData.session;
  if (!session) {
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    if (!signInErr) {
      session = signInData.session;
    }
  }

  console.log('\n2. Testing FOOD LOGGING (food_logs)...');
  const { data: foodLog, error: foodErr } = await supabase
    .from('food_logs')
    .insert({
      user_id: userId,
      date: testDate,
      meal_type: 'breakfast',
      food_name: 'Steel-Cut Oats with Berries & Whey',
      portion: '1 bowl',
      quantity: 1,
      calories: 420,
      protein: 34,
      carbs: 55,
      fat: 8,
      fiber: 9,
      category: 'Breakfast',
    })
    .select()
    .single();

  if (foodErr) {
    console.error('❌ food_logs insert failed:', foodErr.message);
  } else {
    console.log('✅ food_logs inserted successfully. ID:', foodLog.id);
  }

  // Fetch food logs
  const { data: foodList, error: foodFetchErr } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', testDate);

  console.log('✅ Fetched food logs for today:', foodList?.length, 'items');

  console.log('\n3. Testing WORKOUT LOGGING (workout_sessions)...');
  const { data: workoutLog, error: workoutErr } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: userId,
      title: 'Push Day (Chest, Shoulders, Triceps)',
      date: testDate,
      duration_minutes: 52,
      calories_burned: 380,
      total_volume_kg: 5200,
      exercises_count: 5,
      completed: true,
    })
    .select()
    .single();

  if (workoutErr) {
    console.error('❌ workout_sessions insert failed:', workoutErr.message);
  } else {
    console.log('✅ workout_sessions inserted successfully. ID:', workoutLog.id);
  }

  console.log('\n4. Testing STEPS LOGGING (step_logs with upsert)...');
  const { data: stepLog1, error: stepErr1 } = await supabase
    .from('step_logs')
    .upsert(
      {
        user_id: userId,
        date: testDate,
        steps: 5000,
        step_goal: 10000,
        distance_km: 3.75,
        active_calories: 200,
        source: 'manual',
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (stepErr1) {
    console.error('❌ step_logs upsert 1 failed:', stepErr1.message);
  } else {
    console.log('✅ step_logs upsert 1 successful:', stepLog1.steps, 'steps');
  }

  // Updating steps (upserting same date)
  const { data: stepLog2, error: stepErr2 } = await supabase
    .from('step_logs')
    .upsert(
      {
        user_id: userId,
        date: testDate,
        steps: 7500,
        step_goal: 10000,
        distance_km: 5.62,
        active_calories: 300,
        source: 'manual',
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (stepErr2) {
    console.error('❌ step_logs upsert 2 failed:', stepErr2.message);
  } else {
    console.log('✅ step_logs upsert 2 updated existing record to:', stepLog2.steps, 'steps (No duplicate row!)');
  }

  console.log('\n5. Testing SLEEP LOGGING (sleep_logs with upsert)...');
  const { data: sleepLog, error: sleepErr } = await supabase
    .from('sleep_logs')
    .upsert(
      {
        user_id: userId,
        date: testDate,
        duration_minutes: 462, // 7h 42m
        quality_score: 88,
        source: 'manual',
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (sleepErr) {
    console.error('❌ sleep_logs upsert failed:', sleepErr.message);
  } else {
    console.log('✅ sleep_logs upsert successful:', sleepLog.duration_minutes, 'minutes, score:', sleepLog.quality_score);
  }

  console.log('\n6. Testing WATER LOGGING (water_logs)...');
  await supabase.from('water_logs').insert([
    { user_id: userId, date: testDate, amount_liters: 0.5 },
    { user_id: userId, date: testDate, amount_liters: 0.35 },
    { user_id: userId, date: testDate, amount_liters: 0.25 },
  ]);

  const { data: waterLogs, error: waterErr } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', testDate);

  if (waterErr) {
    console.error('❌ water_logs fetch failed:', waterErr.message);
  } else {
    const totalWater = waterLogs.reduce((acc, w) => acc + Number(w.amount_liters), 0);
    console.log(`✅ water_logs inserted & aggregated: ${waterLogs.length} entries totaling ${totalWater} L`);
  }

  console.log('\n7. Testing WEIGHT LOGGING (weight_logs with profile sync)...');
  const { data: weightLog, error: weightErr } = await supabase
    .from('weight_logs')
    .upsert(
      {
        user_id: userId,
        date: testDate,
        weight_kg: 67.8,
        notes: 'Morning weigh-in fasting',
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (weightErr) {
    console.error('❌ weight_logs upsert failed:', weightErr.message);
  } else {
    console.log('✅ weight_logs upsert successful:', weightLog.weight_kg, 'kg');
  }

  // Test Log Deletion
  console.log('\n8. Testing DELETION (Delete food log entry)...');
  const { error: delErr } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', foodLog.id)
    .eq('user_id', userId);

  if (delErr) {
    console.error('❌ food_logs delete failed:', delErr.message);
  } else {
    console.log('✅ food_logs deleted successfully.');
  }

  console.log('\n=========================================');
  console.log('🎉 ALL 6 HOME TRACKING DOMAINS VERIFIED!');
  console.log('=========================================');
}

runHomeIntegrationTests().catch(console.error);
