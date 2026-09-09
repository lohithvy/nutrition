import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useNutrition } from '../context/NutritionContext';
import { ProfilePhotoUploader } from '../components/profile/ProfilePhotoUploader';
import { WorkoutSplitManager } from '../components/profile/WorkoutSplitManager';
import {
  User,
  Target,
  Dumbbell,
  Utensils,
  Sliders,
  Check,
  Flame,
  ShieldCheck,
  Heart,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

const PRIMARY_GOALS = [
  'Lose Weight',
  'Maintain Weight',
  'Build Muscle',
  'Gain Weight',
  'Improve Fitness',
  'Improve General Health',
  'Improve Athletic Performance',
];

const ACTIVITY_LEVELS = [
  { level: 'Sedentary', desc: 'Little to no exercise, desk job (1.2x BMR)' },
  { level: 'Lightly Active', desc: 'Light exercise / walking 1-3 days/week (1.375x BMR)' },
  { level: 'Moderately Active', desc: 'Moderate training 3-5 days/week (1.55x BMR)' },
  { level: 'Very Active', desc: 'Intense exercise 6-7 days/week (1.725x BMR)' },
  { level: 'Extremely Active', desc: 'Heavy physical labor or 2x daily training (1.9x BMR)' },
];

const DIET_PREFERENCES = [
  'No preference',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Low Carb',
  'High Protein',
  'Mediterranean',
  'Gluten Free',
  'Dairy Free',
];

const COMMON_ALLERGENS = [
  'Peanuts',
  'Tree Nuts',
  'Dairy',
  'Eggs',
  'Soy',
  'Gluten',
  'Fish',
  'Shellfish',
  'Sesame',
];

const CUISINES = [
  'Mediterranean',
  'Japanese',
  'Mexican',
  'Italian',
  'Indian',
  'Thai',
  'American',
  'Middle Eastern',
];

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const { showToast } = useUI();
  const { user, updateProfile } = useAuth();
  const { targets, updateTargets } = useNutrition();

  const [activeTab, setActiveTab] = useState(initialTab);

  // Update active tab if searchParams change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // Form State: 1. Personal & Body
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [age, setAge] = useState(user.age || 28);
  const [sex, setSex] = useState(user.sex || 'Female');
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || '1998-04-12');

  const [currentWeight, setCurrentWeight] = useState(user.body?.currentWeight || 68.4);
  const [goalWeight, setGoalWeight] = useState(user.body?.goalWeight || 65.0);
  const [height, setHeight] = useState(user.body?.height || 172);
  const [weightUnit, setWeightUnit] = useState(user.body?.weightUnit || 'kg');
  const [heightUnit, setHeightUnit] = useState(user.body?.heightUnit || 'cm');

  // Form State: 2. Goals & Workout
  const [primaryGoal, setPrimaryGoal] = useState(user.goals?.primaryGoal || 'Build Muscle');
  const [targetTimeframe, setTargetTimeframe] = useState(user.goals?.targetTimeframe || '12 Weeks');
  const [targetBodyComp, setTargetBodyComp] = useState(user.goals?.targetBodyComp || 'Lean & Athletic');
  const [muscleBuildingPreference, setMuscleBuildingPreference] = useState(
    user.goals?.muscleBuildingPreference || 'Hypertrophy & Strength'
  );

  const [activityLevel, setActivityLevel] = useState(user.activity?.level || 'Moderately Active');
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState(user.activity?.trainingDaysPerWeek || 4);
  const [cardioDaysPerWeek, setCardioDaysPerWeek] = useState(user.activity?.cardioDaysPerWeek || 2);

  const [workoutSplit, setWorkoutSplit] = useState(user.workout || { splitType: 'Push / Pull / Legs', days: [] });

  // Form State: 3. Diet & Restrictions
  const [selectedDietPrefs, setSelectedDietPrefs] = useState(user.diet?.preferences || ['High Protein', 'Mediterranean']);
  const [selectedAllergens, setSelectedAllergens] = useState(user.diet?.allergies || ['Peanuts', 'Shellfish']);
  const [customAllergies, setCustomAllergies] = useState(user.diet?.customAllergies || []);
  const [newAllergenInput, setNewAllergenInput] = useState('');
  const [dislikedFoods, setDislikedFoods] = useState(user.diet?.dislikedFoods || 'Cilantro, Bitter Gourd');
  const [favoriteFoods, setFavoriteFoods] = useState(user.diet?.favoriteFoods || 'Avocado, Wild Alaskan Salmon, Greek Yogurt');
  const [preferredCuisines, setPreferredCuisines] = useState(user.diet?.preferredCuisines || ['Mediterranean', 'Japanese', 'Mexican']);

  // Form State: 4. Nutrition Targets
  const [calories, setCalories] = useState(targets.calories || 2200);
  const [protein, setProtein] = useState(targets.protein || 140);
  const [carbs, setCarbs] = useState(targets.carbs || 210);
  const [fat, setFat] = useState(targets.fat || 65);
  const [fiber, setFiber] = useState(targets.fiber || 30);
  const [water, setWater] = useState(targets.water || 2.5);

  // Form State: 5. Lifestyle & Preferences
  const [mealsPerDay, setMealsPerDay] = useState(user.preferences?.mealsPerDay || 4);
  const [breakfastTime, setBreakfastTime] = useState(user.preferences?.breakfastTime || '08:00');
  const [lunchTime, setLunchTime] = useState(user.preferences?.lunchTime || '12:30');
  const [dinnerTime, setDinnerTime] = useState(user.preferences?.dinnerTime || '19:00');
  const [cookingSkill, setCookingSkill] = useState(user.preferences?.cookingSkill || 'Intermediate');
  const [weeklyFoodBudget, setWeeklyFoodBudget] = useState(user.preferences?.weeklyFoodBudget || '$120 - $150');

  // Sync state if user or targets change from outside
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAge(user.age || 28);
      setSex(user.sex || 'Female');
      setDateOfBirth(user.dateOfBirth || '1998-04-12');
      if (user.body) {
        setCurrentWeight(user.body.currentWeight || 68.4);
        setGoalWeight(user.body.goalWeight || 65.0);
        setHeight(user.body.height || 172);
        setWeightUnit(user.body.weightUnit || 'kg');
        setHeightUnit(user.body.heightUnit || 'cm');
      }
      if (user.goals) {
        setPrimaryGoal(user.goals.primaryGoal || 'Build Muscle');
        setTargetTimeframe(user.goals.targetTimeframe || '12 Weeks');
        setTargetBodyComp(user.goals.targetBodyComp || 'Lean & Athletic');
        setMuscleBuildingPreference(user.goals.muscleBuildingPreference || 'Hypertrophy & Strength');
      }
      if (user.activity) {
        setActivityLevel(user.activity.level || 'Moderately Active');
        setTrainingDaysPerWeek(user.activity.trainingDaysPerWeek || 4);
        setCardioDaysPerWeek(user.activity.cardioDaysPerWeek || 2);
      }
      if (user.workout) {
        setWorkoutSplit(user.workout);
      }
      if (user.diet) {
        setSelectedDietPrefs(user.diet.preferences || []);
        setSelectedAllergens(user.diet.allergies || []);
        setCustomAllergies(user.diet.customAllergies || []);
        setDislikedFoods(user.diet.dislikedFoods || '');
        setFavoriteFoods(user.diet.favoriteFoods || '');
        setPreferredCuisines(user.diet.preferredCuisines || []);
      }
      if (user.preferences) {
        setMealsPerDay(user.preferences.mealsPerDay || 4);
        setBreakfastTime(user.preferences.breakfastTime || '08:00');
        setLunchTime(user.preferences.lunchTime || '12:30');
        setDinnerTime(user.preferences.dinnerTime || '19:00');
        setCookingSkill(user.preferences.cookingSkill || 'Intermediate');
        setWeeklyFoodBudget(user.preferences.weeklyFoodBudget || '$120 - $150');
      }
    }
  }, [user]);

  useEffect(() => {
    if (targets) {
      setCalories(targets.calories || 2200);
      setProtein(targets.protein || 140);
      setCarbs(targets.carbs || 210);
      setFat(targets.fat || 65);
      setFiber(targets.fiber || 30);
      setWater(targets.water || 2.5);
    }
  }, [targets]);

  const toggleDietPref = (pref) => {
    setSelectedDietPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const toggleAllergen = (item) => {
    setSelectedAllergens((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleAddCustomAllergen = (e) => {
    e?.preventDefault();
    const clean = newAllergenInput.trim();
    if (!clean) return;
    if (!customAllergies.includes(clean)) {
      setCustomAllergies((prev) => [...prev, clean]);
    }
    setNewAllergenInput('');
  };

  const handleRemoveCustomAllergen = (allergen) => {
    setCustomAllergies((prev) => prev.filter((a) => a !== allergen));
  };

  const toggleCuisine = (cuisine) => {
    setPreferredCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const handleSaveAll = (e) => {
    e?.preventDefault();

    const targetPayload = {
      calories: Number(calories) || 2200,
      protein: Number(protein) || 140,
      carbs: Number(carbs) || 210,
      fat: Number(fat) || 65,
      fiber: Number(fiber) || 30,
      water: Number(water) || 2.5,
    };

    // Update centralized profile
    updateProfile({
      name: name.trim() || user.name,
      firstName: (name.trim() || user.name).split(' ')[0],
      email: email.trim() || user.email,
      age: Number(age) || 28,
      sex,
      dateOfBirth,
      body: {
        currentWeight: Number(currentWeight) || 68.4,
        goalWeight: Number(goalWeight) || 65.0,
        height: Number(height) || 172,
        weightUnit,
        heightUnit,
      },
      goals: {
        primaryGoal,
        targetTimeframe,
        targetBodyComp,
        muscleBuildingPreference,
      },
      activity: {
        level: activityLevel,
        trainingDaysPerWeek: Number(trainingDaysPerWeek) || 4,
        cardioDaysPerWeek: Number(cardioDaysPerWeek) || 2,
      },
      workout: workoutSplit,
      diet: {
        preferences: selectedDietPrefs,
        allergies: selectedAllergens,
        customAllergies,
        dislikedFoods,
        favoriteFoods,
        preferredCuisines,
      },
      nutritionTargets: targetPayload,
      preferences: {
        mealsPerDay: Number(mealsPerDay) || 4,
        breakfastTime,
        lunchTime,
        dinnerTime,
        cookingSkill,
        weeklyFoodBudget,
      },
    });

    // Update targets in NutritionContext
    updateTargets(targetPayload);

    showToast('Profile, goals, and nutrition targets saved! ✅');
  };

  const tabs = [
    { id: 'profile', label: 'Profile & Body', icon: User },
    { id: 'goals', label: 'Goals & Workout', icon: Dumbbell },
    { id: 'diet', label: 'Diet & Allergies', icon: Utensils },
    { id: 'targets', label: 'Nutrition Targets', icon: Target },
    { id: 'lifestyle', label: 'Lifestyle & Sync', icon: Sliders },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Profile & Preferences"
        emoji="⚙️"
        subtitle={`Configure personal biometrics, training split, diet constraints, and daily metabolic targets for ${user.name}.`}
        badge={<Badge variant="amber">{user.role || 'Pro Member'}</Badge>}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Save All Changes
          </Button>
        }
      />

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-surface-200/80 shadow-2xs">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-primary text-white shadow-xs font-bold'
                  : 'bg-surface-50 hover:bg-surface-100 text-surface-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <Card hover>
        <form onSubmit={handleSaveAll}>
          <CardHeader
            title={
              activeTab === 'profile'
                ? 'Personal & Body Information'
                : activeTab === 'goals'
                ? 'Goals & Workout Training Split'
                : activeTab === 'diet'
                ? 'Dietary Preferences & Allergies'
                : activeTab === 'targets'
                ? 'Metabolic Daily Targets'
                : 'Lifestyle & Preferences'
            }
            subtitle="Centralized profile data persists automatically to local storage and calibrates your active NutriFlow experience."
          />

          <CardContent className="space-y-6">
            {/* TAB 1: PROFILE & BODY */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Photo Management */}
                <div>
                  <label className="text-xs font-bold text-surface-900 uppercase tracking-wider block mb-2">
                    Profile Avatar
                  </label>
                  <ProfilePhotoUploader />
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Biological Sex</label>
                      <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-surface-700 block mb-1">Age</label>
                        <input
                          type="number"
                          min="12"
                          max="120"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-surface-700 block mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="w-full px-2 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body Metrics & Units */}
                <div className="space-y-3 pt-2 border-t border-surface-150">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    Body Metrics & Measurements
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-surface-700">Current Weight</label>
                        <div className="flex rounded-lg bg-surface-200/60 p-0.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setWeightUnit('kg')}
                            className={`px-1.5 py-0.5 rounded-md font-bold ${
                              weightUnit === 'kg' ? 'bg-white text-surface-900 shadow-2xs' : 'text-surface-500'
                            }`}
                          >
                            kg
                          </button>
                          <button
                            type="button"
                            onClick={() => setWeightUnit('lb')}
                            className={`px-1.5 py-0.5 rounded-md font-bold ${
                              weightUnit === 'lb' ? 'bg-white text-surface-900 shadow-2xs' : 'text-surface-500'
                            }`}
                          >
                            lb
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        value={currentWeight}
                        onChange={(e) => setCurrentWeight(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Goal Weight ({weightUnit})</label>
                      <input
                        type="number"
                        step="0.1"
                        value={goalWeight}
                        onChange={(e) => setGoalWeight(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-surface-700">Height</label>
                        <div className="flex rounded-lg bg-surface-200/60 p-0.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setHeightUnit('cm')}
                            className={`px-1.5 py-0.5 rounded-md font-bold ${
                              heightUnit === 'cm' ? 'bg-white text-surface-900 shadow-2xs' : 'text-surface-500'
                            }`}
                          >
                            cm
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeightUnit('ft/in')}
                            className={`px-1.5 py-0.5 rounded-md font-bold ${
                              heightUnit === 'ft/in' ? 'bg-white text-surface-900 shadow-2xs' : 'text-surface-500'
                            }`}
                          >
                            ft
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GOALS & WORKOUT SPLIT */}
            {activeTab === 'goals' && (
              <div className="space-y-6">
                {/* Primary Goals Selection */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    1. Primary Metabolic & Body Goal
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRIMARY_GOALS.map((goal) => {
                      const isSelected = primaryGoal === goal;
                      return (
                        <button
                          type="button"
                          key={goal}
                          onClick={() => setPrimaryGoal(goal)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-brand-primary bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-2xs font-bold text-surface-900'
                              : 'border-surface-200/80 bg-white hover:bg-surface-50 text-surface-700'
                          }`}
                        >
                          <span className="text-xs block leading-snug">{goal}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Target Timeframe</label>
                      <select
                        value={targetTimeframe}
                        onChange={(e) => setTargetTimeframe(e.target.value)}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        <option value="6 Weeks">6 Weeks (Rapid)</option>
                        <option value="12 Weeks">12 Weeks (Standard)</option>
                        <option value="16 Weeks">16 Weeks (Sustained)</option>
                        <option value="6 Months">6 Months</option>
                        <option value="Ongoing">Ongoing Lifestyle</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Target Body Composition</label>
                      <select
                        value={targetBodyComp}
                        onChange={(e) => setTargetBodyComp(e.target.value)}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        <option value="Lean & Athletic">Lean & Athletic</option>
                        <option value="Bulking / Muscle Mass">Bulking / Muscle Mass</option>
                        <option value="Shredded / Cut">Shredded / Cut</option>
                        <option value="General Health Maintenance">General Health Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Muscle Building Focus</label>
                      <select
                        value={muscleBuildingPreference}
                        onChange={(e) => setMuscleBuildingPreference(e.target.value)}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        <option value="Hypertrophy & Strength">Hypertrophy & Strength</option>
                        <option value="Lean Muscle Tone">Lean Muscle Tone</option>
                        <option value="Endurance & Stamina">Endurance & Stamina</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Activity Level */}
                <div className="space-y-3 pt-2 border-t border-surface-150">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    2. Daily Activity Level
                  </h4>

                  <div className="space-y-2">
                    {ACTIVITY_LEVELS.map((item) => {
                      const isSelected = activityLevel === item.level;
                      return (
                        <div
                          key={item.level}
                          onClick={() => setActivityLevel(item.level)}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-brand-primary bg-emerald-50/60 ring-2 ring-emerald-500/20'
                              : 'border-surface-200/80 bg-white hover:bg-surface-50'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-surface-900 block">{item.level}</span>
                            <span className="text-[11px] text-surface-500">{item.desc}</span>
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-surface-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Resistance Training Days/Week</label>
                      <select
                        value={trainingDaysPerWeek}
                        onChange={(e) => setTrainingDaysPerWeek(Number(e.target.value))}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                          <option key={n} value={n}>
                            {n} day{n === 1 ? '' : 's'} / week
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Cardio / Conditioning Days/Week</label>
                      <select
                        value={cardioDaysPerWeek}
                        onChange={(e) => setCardioDaysPerWeek(Number(e.target.value))}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                          <option key={n} value={n}>
                            {n} day{n === 1 ? '' : 's'} / week
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Workout Split Manager */}
                <div className="space-y-3 pt-2 border-t border-surface-150">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    3. Workout & Training Split Schedule
                  </h4>
                  <WorkoutSplitManager
                    splitType={workoutSplit.splitType}
                    days={workoutSplit.days}
                    onChange={(updated) => setWorkoutSplit(updated)}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: DIET & ALLERGIES */}
            {activeTab === 'diet' && (
              <div className="space-y-6">
                {/* Dietary Preferences */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    1. Dietary Preferences
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {DIET_PREFERENCES.map((pref) => {
                      const isSelected = selectedDietPrefs.includes(pref);
                      return (
                        <button
                          type="button"
                          key={pref}
                          onClick={() => toggleDietPref(pref)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-brand-primary text-white shadow-xs font-bold'
                              : 'bg-surface-50 hover:bg-surface-100 text-surface-700 border border-surface-200/70'
                          }`}
                        >
                          {pref}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Food Allergies & Intolerances */}
                <div className="space-y-3 pt-2 border-t border-surface-150">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    2. Food Allergies & Intolerances
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_ALLERGENS.map((allergen) => {
                      const isSelected = selectedAllergens.includes(allergen);
                      return (
                        <button
                          type="button"
                          key={allergen}
                          onClick={() => toggleAllergen(allergen)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-rose-600 text-white shadow-xs font-bold'
                              : 'bg-surface-50 hover:bg-surface-100 text-surface-700 border border-surface-200/70'
                          }`}
                        >
                          {allergen}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Allergies Input */}
                  <div className="pt-2">
                    <label className="text-xs font-bold text-surface-700 block mb-1">Add Custom Restriction / Allergen</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newAllergenInput}
                        onChange={(e) => setNewAllergenInput(e.target.value)}
                        placeholder="e.g. Mustard, Sulfites, Pine Nuts..."
                        className="flex-1 px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCustomAllergen}
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        disabled={!newAllergenInput.trim()}
                      >
                        Add
                      </Button>
                    </div>

                    {customAllergies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {customAllergies.map((a) => (
                          <span
                            key={a}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold"
                          >
                            <span>{a}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomAllergen(a)}
                              className="text-rose-500 hover:text-rose-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Likes, Dislikes & Cuisines */}
                <div className="space-y-4 pt-2 border-t border-surface-150">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    3. Flavor & Cuisine Preferences
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Favorite Foods</label>
                      <input
                        type="text"
                        value={favoriteFoods}
                        onChange={(e) => setFavoriteFoods(e.target.value)}
                        placeholder="e.g. Avocado, Salmon, Quinoa..."
                        className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Disliked Foods / Ingredients</label>
                      <input
                        type="text"
                        value={dislikedFoods}
                        onChange={(e) => setDislikedFoods(e.target.value)}
                        placeholder="e.g. Cilantro, Bitter Melon..."
                        className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-surface-700 block mb-1.5">Preferred Cuisines</label>
                    <div className="flex flex-wrap gap-2">
                      {CUISINES.map((cuisine) => {
                        const isSelected = preferredCuisines.includes(cuisine);
                        return (
                          <button
                            type="button"
                            key={cuisine}
                            onClick={() => toggleCuisine(cuisine)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600 text-white shadow-xs font-bold'
                                : 'bg-surface-50 hover:bg-surface-100 text-surface-700 border border-surface-200/70'
                            }`}
                          >
                            {cuisine}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NUTRITION TARGETS */}
            {activeTab === 'targets' && (
              <div className="space-y-5">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Dynamic Pacing Synchronization</span>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      Configured targets calibrate the daily metabolic budget. Consumed calories and macros in your Dashboard are calculated in real-time from logged meals and water.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-surface-700 block mb-1">
                    Daily Caloric Budget (kcal)
                  </label>
                  <input
                    type="number"
                    min="800"
                    max="8000"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-3 py-2 text-base font-bold bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100">
                    <label className="text-xs font-bold text-emerald-800 block mb-1">Protein (g)</label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-bold bg-white border border-emerald-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/40 border border-amber-100">
                    <label className="text-xs font-bold text-amber-800 block mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      min="10"
                      max="800"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-bold bg-white border border-amber-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100">
                    <label className="text-xs font-bold text-purple-800 block mb-1">Fat (g)</label>
                    <input
                      type="number"
                      min="10"
                      max="300"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-bold bg-white border border-purple-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-teal-50/40 border border-teal-100">
                    <label className="text-xs font-bold text-teal-800 block mb-1">Fiber (g)</label>
                    <input
                      type="number"
                      min="5"
                      max="100"
                      value={fiber}
                      onChange={(e) => setFiber(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-bold bg-white border border-teal-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-sky-50/40 border border-sky-100">
                    <label className="text-xs font-bold text-sky-800 block mb-1">Water (L)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="10"
                      value={water}
                      onChange={(e) => setWater(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-bold bg-white border border-sky-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: LIFESTYLE & PREFERENCES */}
            {activeTab === 'lifestyle' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    Meal Timing & Routine
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Preferred Meals/Day</label>
                      <select
                        value={mealsPerDay}
                        onChange={(e) => setMealsPerDay(Number(e.target.value))}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        {[2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} Meals / Day
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Typical Breakfast</label>
                      <input
                        type="time"
                        value={breakfastTime}
                        onChange={(e) => setBreakfastTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Typical Lunch</label>
                      <input
                        type="time"
                        value={lunchTime}
                        onChange={(e) => setLunchTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Typical Dinner</label>
                      <input
                        type="time"
                        value={dinnerTime}
                        onChange={(e) => setDinnerTime(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Cooking Skill Level</label>
                      <select
                        value={cookingSkill}
                        onChange={(e) => setCookingSkill(e.target.value)}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        <option value="Beginner">Beginner (15-min quick meals)</option>
                        <option value="Intermediate">Intermediate (Comfortable with basic meal prep)</option>
                        <option value="Advanced">Advanced (Gourmet nutrition cooking)</option>
                        <option value="Master Chef">Master Chef</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-surface-700 block mb-1">Weekly Food Budget</label>
                      <select
                        value={weeklyFoodBudget}
                        onChange={(e) => setWeeklyFoodBudget(e.target.value)}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
                      >
                        <option value="< $75">Budget Friendly (&lt; $75/week)</option>
                        <option value="$75 - $120">Moderate ($75 - $120/week)</option>
                        <option value="$120 - $180">Premium Clean ($120 - $180/week)</option>
                        <option value="$180+">Organic / Gourmet ($180+/week)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Biometrics */}
                <div className="space-y-3 pt-2 border-t border-surface-150">
                  <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
                    Biometric Integrations
                  </h4>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-50 border border-surface-200/80">
                    <div>
                      <span className="text-xs font-bold text-surface-900 block">Apple Health & Watch</span>
                      <span className="text-[11px] text-surface-500">Continuous active calories and heart rate synchronization</span>
                    </div>
                    <Badge variant="emerald"><ShieldCheck className="w-3 h-3 mr-1" /> Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-50 border border-surface-200/80">
                    <div>
                      <span className="text-xs font-bold text-surface-900 block">Continuous Glucose Monitor (CGM)</span>
                      <span className="text-[11px] text-surface-500">Real-time glucose variability and insulin sensitivity score</span>
                    </div>
                    <Badge variant="emerald"><ShieldCheck className="w-3 h-3 mr-1" /> Connected</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <span className="text-xs text-surface-400">NutriFlow Client v2.0 • Local Storage Synced</span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Check className="w-4 h-4" />}
            >
              Save All Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
