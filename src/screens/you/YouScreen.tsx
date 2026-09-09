/**
 * NutriFlow YouScreen (Settings & Profile Hub)
 * Preserves all tabs: Personal & Body, Goals & Split, Diet & Restrictions, Targets, Preferences, Health Integrations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Target,
  Dumbbell,
  Utensils,
  Sliders,
  Check,
  Flame,
  Heart,
  Plus,
  X,
  Sparkles,
  Camera,
  LogOut,
  Activity,
  Crown,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useNutrition } from '../../context/NutritionContext';
import { useUI } from '../../context/UIContext';
import { ProPlanModal } from '../../components/common/ProPlanModal';

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
  { level: 'Sedentary', desc: 'Little to no exercise, desk job' },
  { level: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { level: 'Moderately Active', desc: 'Moderate training 3-5 days/week' },
  { level: 'Very Active', desc: 'Intense exercise 6-7 days/week' },
  { level: 'Extremely Active', desc: 'Heavy physical labor or 2x daily training' },
];

const DIET_PREFERENCES = [
  'No preference',
  'High Protein',
  'Mediterranean',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Low Carb',
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

export function YouScreen() {
  const { user, updateProfile, logout } = useAuth();
  const { targets, updateTargets } = useNutrition();
  const { showToast, isProModalOpen, openProModal, closeProModal } = useUI();

  const [activeTab, setActiveTab] = useState<'personal' | 'goals' | 'diet' | 'targets' | 'health'>('personal');

  // Form State: 1. Personal & Body
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [currentWeight, setCurrentWeight] = useState(String(user.body?.currentWeight || 68.4));
  const [goalWeight, setGoalWeight] = useState(String(user.body?.goalWeight || 65.0));
  const [height, setHeight] = useState(String(user.body?.height || 172));

  // Form State: 2. Goals
  const [primaryGoal, setPrimaryGoal] = useState(user.goals?.primaryGoal || 'Build Muscle');
  const [activityLevel, setActivityLevel] = useState(user.activity?.level || 'Moderately Active');

  // Form State: 3. Diet
  const [selectedDietPrefs, setSelectedDietPrefs] = useState<string[]>(user.diet?.preferences || ['High Protein']);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(user.diet?.allergies || ['Peanuts']);
  const [customAllergen, setCustomAllergen] = useState('');

  // Form State: 4. Targets
  const [calories, setCalories] = useState(String(targets.calories || 2200));
  const [protein, setProtein] = useState(String(targets.protein || 140));
  const [carbs, setCarbs] = useState(String(targets.carbs || 210));
  const [fat, setFat] = useState(String(targets.fat || 65));
  const [water, setWater] = useState(String(targets.water || 2.5));

  // Form State: 5. Health Connections
  const [healthKitConnected, setHealthKitConnected] = useState(true);
  const [healthConnectConnected, setHealthConnectConnected] = useState(false);

  const toggleDietPref = (pref: string) => {
    setSelectedDietPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const toggleAllergen = (all: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(all) ? prev.filter((a) => a !== all) : [...prev, all]
    );
  };

  const handleSaveAll = () => {
    updateProfile({
      name,
      email,
      body: {
        ...user.body,
        currentWeight: Number(currentWeight) || user.body.currentWeight,
        goalWeight: Number(goalWeight) || user.body.goalWeight,
        height: Number(height) || user.body.height,
      },
      goals: {
        ...user.goals,
        primaryGoal,
      },
      activity: {
        ...user.activity,
        level: activityLevel,
      },
      diet: {
        ...user.diet,
        preferences: selectedDietPrefs,
        allergies: selectedAllergens,
      },
      nutritionTargets: {
        calories: Number(calories) || targets.calories,
        protein: Number(protein) || targets.protein,
        carbs: Number(carbs) || targets.carbs,
        fat: Number(fat) || targets.fat,
        fiber: targets.fiber || 30,
        water: Number(water) || targets.water,
      },
    });

    updateTargets({
      calories: Number(calories) || targets.calories,
      protein: Number(protein) || targets.protein,
      carbs: Number(carbs) || targets.carbs,
      fat: Number(fat) || targets.fat,
      water: Number(water) || targets.water,
    });

    showToast('Profile and nutrition targets saved! ✨');
  };

  const tabs = [
    { id: 'personal', label: 'Personal & Body', icon: User },
    { id: 'goals', label: 'Goals & Activity', icon: Target },
    { id: 'diet', label: 'Diet & Allergens', icon: Utensils },
    { id: 'targets', label: 'Macro Targets', icon: Flame },
    { id: 'health', label: 'Health Connect', icon: Activity },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <ScreenHeader
          title="Profile & Settings"
          emoji="⚙️"
          subtitle="Configure body metrics, dietary restrictions, and metabolic goals."
          actions={
            <Button
              variant="primary"
              size="sm"
              onPress={handleSaveAll}
              leftIcon={<Check size={14} color="#FFF" />}
            >
              Save
            </Button>
          }
        />

        {/* Pro Banner */}
        <TouchableOpacity
          onPress={openProModal}
          activeOpacity={0.8}
          style={styles.proBanner}
        >
          <View style={styles.proLeft}>
            <View style={styles.crownIcon}>
              <Crown size={18} color="#FFF" />
            </View>
            <View>
              <Text style={styles.proTitle}>NutriFlow Pro Plus</Text>
              <Text style={styles.proSub}>All AI metabolic features active</Text>
            </View>
          </View>
          <Badge variant="amber" size="sm">
            Active
          </Badge>
        </TouchableOpacity>

        {/* Horizontal Tab Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                style={[styles.tabPill, isSelected && styles.tabPillActive]}
              >
                <Icon size={14} color={isSelected ? colors.surface.white : colors.surface[600]} />
                <Text style={[styles.tabPillText, isSelected && styles.tabPillTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tab 1: Personal & Body */}
        {activeTab === 'personal' && (
          <Card>
            <CardHeader title="Personal Information & Body Metrics" />
            <CardContent>
              <View style={styles.avatarRow}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitials}>{user.firstName[0]}</Text>
                  </View>
                )}
                <View style={styles.avatarTexts}>
                  <Text style={styles.avatarName}>{user.name}</Text>
                  <Text style={styles.avatarRole}>{user.role}</Text>
                </View>
              </View>

              <Input label="Full Name" value={name} onChangeText={setName} />
              <Input label="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Input
                    label="Current Weight (kg)"
                    value={currentWeight}
                    onChangeText={setCurrentWeight}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Goal Weight (kg)"
                    value={goalWeight}
                    onChangeText={setGoalWeight}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Height (cm)"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Goals & Activity */}
        {activeTab === 'goals' && (
          <Card>
            <CardHeader title="Primary Goal & Activity Level" />
            <CardContent>
              <Text style={styles.fieldSectionLabel}>Primary Fitness Goal</Text>
              <View style={styles.pillsGrid}>
                {PRIMARY_GOALS.map((g) => {
                  const isSelected = primaryGoal === g;
                  return (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setPrimaryGoal(g)}
                      style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                    >
                      <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.fieldSectionLabel, { marginTop: spacing.md }]}>Activity Level</Text>
              <View style={styles.activityList}>
                {ACTIVITY_LEVELS.map((act) => {
                  const isSelected = activityLevel === act.level;
                  return (
                    <TouchableOpacity
                      key={act.level}
                      onPress={() => setActivityLevel(act.level)}
                      style={[styles.activityItem, isSelected && styles.activityItemSelected]}
                    >
                      <View style={styles.activityInfo}>
                        <Text style={[styles.activityName, isSelected && styles.activityNameSelected]}>
                          {act.level}
                        </Text>
                        <Text style={styles.activityDesc}>{act.desc}</Text>
                      </View>
                      {isSelected && <Check size={16} color={colors.brand.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </CardContent>
          </Card>
        )}

        {/* Tab 3: Diet & Allergens */}
        {activeTab === 'diet' && (
          <Card>
            <CardHeader title="Dietary Preferences & Allergens" />
            <CardContent>
              <Text style={styles.fieldSectionLabel}>Dietary Preferences</Text>
              <View style={styles.pillsGrid}>
                {DIET_PREFERENCES.map((pref) => {
                  const isSelected = selectedDietPrefs.includes(pref);
                  return (
                    <TouchableOpacity
                      key={pref}
                      onPress={() => toggleDietPref(pref)}
                      style={[styles.optionPill, isSelected && styles.optionPillSelected]}
                    >
                      <Text style={[styles.optionPillText, isSelected && styles.optionPillTextSelected]}>
                        {pref}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={[styles.fieldSectionLabel, { marginTop: spacing.md }]}>Known Allergens</Text>
              <View style={styles.pillsGrid}>
                {COMMON_ALLERGENS.map((all) => {
                  const isSelected = selectedAllergens.includes(all);
                  return (
                    <TouchableOpacity
                      key={all}
                      onPress={() => toggleAllergen(all)}
                      style={[
                        styles.optionPill,
                        isSelected && { backgroundColor: colors.status.errorBg, borderColor: colors.status.errorBorder },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionPillText,
                          isSelected && { color: colors.status.error, fontWeight: typography.weight.bold },
                        ]}
                      >
                        {all}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </CardContent>
          </Card>
        )}

        {/* Tab 4: Macro Targets */}
        {activeTab === 'targets' && (
          <Card>
            <CardHeader title="Metabolic Macro Targets" />
            <CardContent>
              <Input
                label="Daily Calorie Budget (kcal)"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <Input
                    label="Protein (g)"
                    value={protein}
                    onChangeText={setProtein}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Carbs (g)"
                    value={carbs}
                    onChangeText={setCarbs}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.formCol}>
                  <Input
                    label="Fat (g)"
                    value={fat}
                    onChangeText={setFat}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <Input
                label="Daily Hydration Target (Liters)"
                value={water}
                onChangeText={setWater}
                keyboardType="numeric"
              />
            </CardContent>
          </Card>
        )}

        {/* Tab 5: Health Integrations */}
        {activeTab === 'health' && (
          <Card>
            <CardHeader title="Connected Health Services" subtitle="Apple HealthKit, Google Health Connect, and Wearables" />
            <CardContent>
              {/* Apple HealthKit */}
              <View style={styles.serviceRow}>
                <View style={styles.serviceLeft}>
                  <View style={[styles.serviceIconBox, { backgroundColor: '#FF2D55' }]}>
                    <Heart size={18} color="#FFF" />
                  </View>
                  <View>
                    <Text style={styles.serviceName}>Apple HealthKit</Text>
                    <Text style={styles.serviceDesc}>Steps, HRV, Resting Heart Rate, Active Calories</Text>
                  </View>
                </View>
                <Button
                  variant={healthKitConnected ? 'subtle' : 'outline'}
                  size="xs"
                  onPress={() => {
                    setHealthKitConnected(!healthKitConnected);
                    showToast(!healthKitConnected ? 'Apple HealthKit connected!' : 'Apple HealthKit disconnected');
                  }}
                >
                  {healthKitConnected ? 'Connected' : 'Connect'}
                </Button>
              </View>

              {/* Google Health Connect */}
              <View style={styles.serviceRow}>
                <View style={styles.serviceLeft}>
                  <View style={[styles.serviceIconBox, { backgroundColor: '#34A853' }]}>
                    <Activity size={18} color="#FFF" />
                  </View>
                  <View>
                    <Text style={styles.serviceName}>Google Health Connect</Text>
                    <Text style={styles.serviceDesc}>Sleep Stages, Steps, Heart Rate, Recovery</Text>
                  </View>
                </View>
                <Button
                  variant={healthConnectConnected ? 'subtle' : 'outline'}
                  size="xs"
                  onPress={() => {
                    setHealthConnectConnected(!healthConnectConnected);
                    showToast(!healthConnectConnected ? 'Google Health Connect synced!' : 'Disconnected');
                  }}
                >
                  {healthConnectConnected ? 'Connected' : 'Connect'}
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Save & Sign out buttons */}
        <View style={styles.bottomActions}>
          <Button
            variant="primary"
            size="lg"
            onPress={handleSaveAll}
            leftIcon={<Check size={16} color="#FFF" />}
            fullWidth
          >
            Save All Changes
          </Button>

          <Button
            variant="ghost"
            size="md"
            onPress={() => {
              if (Platform.OS === 'web') {
                logout();
              } else {
                Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
                ]);
              }
            }}
            leftIcon={<LogOut size={16} color={colors.status.error} />}
            textStyle={{ color: colors.status.error }}
            style={{ marginTop: spacing.xs }}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>

      {/* Pro Plan Modal */}
      <ProPlanModal
        isOpen={isProModalOpen}
        onClose={closeProModal}
        onUpgrade={() => showToast('Upgraded to Pro! 👑')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.status.warningBg,
    borderWidth: 1,
    borderColor: colors.status.warningBorder,
    borderRadius: radii.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  proLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crownIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.nutri.carbs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  proSub: {
    fontSize: typography.size['2xs'],
    color: colors.surface[600],
  },
  tabsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.surface.white,
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  tabPillActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  tabPillText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.surface[700],
  },
  tabPillTextActive: {
    color: colors.surface.white,
    fontWeight: typography.weight.bold,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    marginRight: spacing.md,
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarInitials: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.surface.white,
  },
  avatarTexts: {
    flex: 1,
  },
  avatarName: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  avatarRole: {
    fontSize: typography.size.xs,
    color: colors.brand.primary,
    marginTop: 2,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  formCol: {
    flex: 1,
  },
  fieldSectionLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[600],
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  optionPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.lg,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[200],
  },
  optionPillSelected: {
    backgroundColor: colors.brand.light,
    borderColor: colors.brand.primary,
  },
  optionPillText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.medium,
    color: colors.surface[700],
  },
  optionPillTextSelected: {
    color: colors.brand.primary,
    fontWeight: typography.weight.bold,
  },
  activityList: {
    gap: spacing.xs,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[150],
  },
  activityItemSelected: {
    backgroundColor: colors.brand.light,
    borderColor: colors.brand.primary,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  activityNameSelected: {
    color: colors.brand.primary,
  },
  activityDesc: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
    marginTop: 2,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  serviceIconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  serviceName: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  serviceDesc: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
    marginTop: 1,
  },
  bottomActions: {
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
});
