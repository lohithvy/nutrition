// Test script to verify Supabase Auth flow with project zqraxlkfiqgaecdslkzu
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...vals] = line.trim().split('=');
  if (key && vals.length) {
    env[key.trim()] = vals.join('=').trim();
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase Auth with URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

async function runTests() {
  const testEmail = `vitalis.test.${Date.now()}@gmail.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Alex Mercer';

  console.log('\n--- 1. SIGNUP TEST ---');
  console.log(`Signing up user: ${testEmail} (${testName})...`);
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: {
        full_name: testName,
        first_name: 'Alex',
      }
    }
  });

  if (signUpError) {
    console.error('❌ Sign up failed:', signUpError.message);
    process.exit(1);
  }

  const userId = signUpData.user?.id;
  console.log('✅ Sign up successful! User ID:', userId);

  // Wait 1 second for trigger execution
  await new Promise(r => setTimeout(r, 1000));

  console.log('\n--- 2. PROFILE CREATION TRIGGER TEST ---');
  console.log('Checking if public.profiles record was automatically created by trigger...');
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('❌ Profile fetch failed:', profileError.message);
  } else if (!profileData) {
    console.error('❌ Profile record not found for user ID:', userId);
  } else {
    console.log('✅ Profile record automatically created by trigger!');
    console.log('   Profile ID:', profileData.id);
    console.log('   Profile Name:', profileData.name);
    console.log('   Is Onboarded:', profileData.is_onboarded);
    console.log('   Target Calories:', profileData.target_calories);
    console.log('   Target Protein:', profileData.target_protein_g);
  }

  console.log('\n--- 3. LOGOUT TEST ---');
  console.log('Signing out...');
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    console.error('❌ Sign out failed:', signOutError.message);
  } else {
    console.log('✅ Signed out successfully.');
  }

  console.log('\n--- 4. LOGIN TEST ---');
  console.log(`Signing in with credentials (${testEmail})...`);
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInError) {
    console.error('❌ Sign in failed:', signInError.message);
  } else {
    console.log('✅ Sign in successful! Session token present:', !!signInData.session?.access_token);
    console.log('   Authenticated User ID:', signInData.user?.id);
  }

  console.log('\n--- 5. INVALID CREDENTIALS TEST ---');
  console.log('Testing invalid password error handling...');
  const { data: badSignInData, error: badSignInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: 'WrongPassword!',
  });

  if (badSignInError) {
    console.log('✅ Correctly caught invalid credentials error:', badSignInError.message);
  } else {
    console.error('❌ Expected invalid credentials error but signin succeeded.');
  }

  console.log('\n--- 6. SESSION RETRIEVAL & PROFILE UPDATE TEST ---');
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Active session user:', session?.user?.email);

  if (session) {
    console.log('Updating profile metrics & completing onboarding...');
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        current_weight_kg: 74.5,
        target_calories: 2200,
        target_protein_g: 165,
        primary_goal: 'hypertrophy',
        is_onboarded: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Profile update failed:', updateError.message);
    } else {
      console.log('✅ Profile updated successfully!');
      console.log('   New Weight:', updatedProfile.current_weight_kg, 'kg');
      console.log('   New Calories:', updatedProfile.target_calories);
      console.log('   Is Onboarded:', updatedProfile.is_onboarded);
    }
  }

  console.log('\n--- 7. FINAL SIGN OUT ---');
  await supabase.auth.signOut();
  console.log('✅ Signed out successfully. All tests complete!');
}

runTests().catch(console.error);
