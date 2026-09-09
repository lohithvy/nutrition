import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useUI } from '../context/UIContext';
import { useNutrition } from '../context/NutritionContext';
import { Sparkles, Plus, Flame, Activity, Droplets, Target, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDateDisplay } from '../../src/utils/storage';

export function DashboardPage() {
  const { user, openQuickLog, showToast } = useUI();
  const { selectedDate, targets, totals, updateTargets, addWater } = useNutrition();

  const [isRecalibrateModalOpen, setIsRecalibrateModalOpen] = useState(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Recalibrate local state
  const [targetCalories, setTargetCalories] = useState(targets.calories);
  const [targetProtein, setTargetProtein] = useState(targets.protein);
  const [targetCarbs, setTargetCarbs] = useState(targets.carbs);
  const [targetFat, setTargetFat] = useState(targets.fat);
  const [targetWater, setTargetWater] = useState(targets.water);

  const handleOpenRecalibrate = () => {
    setTargetCalories(targets.calories);
    setTargetProtein(targets.protein);
    setTargetCarbs(targets.carbs);
    setTargetFat(targets.fat);
    setTargetWater(targets.water);
    setIsRecalibrateModalOpen(true);
  };

  const handleSaveTargets = () => {
    updateTargets({
      calories: Number(targetCalories),
      protein: Number(targetProtein),
      carbs: Number(targetCarbs),
      fat: Number(targetFat),
      water: Number(targetWater),
    });
    setIsRecalibrateModalOpen(false);
    showToast('Daily nutrition targets updated! 🎯');
  };

  const proteinPercent = Math.min(100, Math.round((totals.protein / targets.protein) * 100));
  const carbsPercent = Math.min(100, Math.round((totals.carbs / targets.carbs) * 100));
  const fatPercent = Math.min(100, Math.round((totals.fat / targets.fat) * 100));
  const calPercent = Math.min(100, Math.round((totals.calories / targets.calories) * 100));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`Good morning, ${user.firstName}`}
        emoji="🥑"
        badge={
          <Badge variant={totals.calories > 0 ? 'emerald' : 'slate'} dot>
            {totals.calories > 0 ? 'Metabolic Zone Active' : 'Ready to Log Today'}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenRecalibrate}
            >
              Recalibrate Targets
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openQuickLog}
            >
              Log Food
            </Button>
          </div>
        }
        alertBanner={
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-950">
                  {totals.calories > 0
                    ? `You're tracking for ${formatDateDisplay(selectedDate)}: ${totals.remainingCalories} kcal remaining with ${totals.protein}g protein logged.`
                    : `No meals logged yet for ${formatDateDisplay(selectedDate)}. Start your day by logging breakfast or morning hydration.`}
                </p>
                <p className="text-[11px] text-emerald-700">
                  Calculated from your resting metabolic target of {targets.calories} kcal/day.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenRecalibrate}
              className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline shrink-0 cursor-pointer"
            >
              Recalibrate targets <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* Component Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Energy & Target Overview */}
        <Card hover>
          <CardHeader
            title="Energy & Macronutrients"
            subtitle={`Target: ${targets.calories} kcal`}
            icon={<Flame className="w-4 h-4 text-emerald-600" />}
            badge={
              <Badge variant={totals.calories > 0 ? 'amber' : 'slate'}>
                {totals.calories > 0 ? `${calPercent}% Consumed` : 'Empty Log'}
              </Badge>
            }
          />
          <CardContent>
            <div className="flex items-center justify-between my-2 p-4 rounded-2xl bg-surface-50 border border-surface-200/60">
              <div>
                <span className="text-3xl font-extrabold text-surface-900 tracking-tight">
                  {totals.remainingCalories}
                </span>
                <span className="text-xs text-surface-500 block font-medium">kcal remaining</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-surface-700">
                  {totals.calories} / {targets.calories}
                </span>
                <span className="text-xs text-surface-400 block">kcal consumed</span>
              </div>
            </div>

            {/* Macro Progress Bars */}
            <div className="space-y-2 mt-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-surface-500 font-medium">Protein: {totals.protein}g / {targets.protein}g</span>
                  <span className="font-bold text-emerald-700">{proteinPercent}%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-surface-500 font-medium">Carbs: {totals.carbs}g / {targets.carbs}g</span>
                  <span className="font-bold text-amber-700">{carbsPercent}%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${carbsPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-surface-500 font-medium">Fat: {totals.fat}g / {targets.fat}g</span>
                  <span className="font-bold text-purple-700">{fatPercent}%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${fatPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/diary" className="hover:underline text-brand-primary font-semibold">
              View Food Diary ({totals.itemsCount} items)
            </Link>
            <Button variant="ghost" size="xs" onClick={openQuickLog}>+ Quick Log</Button>
          </CardFooter>
        </Card>

        {/* Card 2: Hydration Tracker with Live +250ml Action */}
        <Card hover>
          <CardHeader
            title="Hydration & Electrolytes"
            subtitle={`Target: ${targets.water} L`}
            icon={<Droplets className="w-4 h-4 text-sky-600" />}
            badge={<Badge variant="blue">{totals.waterPercent}% Goal</Badge>}
          />
          <CardContent>
            <div className="flex items-center justify-between my-2 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div>
                <span className="text-3xl font-extrabold text-sky-950 tracking-tight">
                  {totals.water}
                </span>
                <span className="text-xs text-sky-700 block font-medium">Liters consumed</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-sky-900">
                  Target: {targets.water}L
                </span>
                <span className="text-xs text-sky-600 block">
                  {totals.water >= targets.water
                    ? 'Target Achieved! 🎉'
                    : `${Math.round(totals.waterRemaining * 1000)}ml needed`}
                </span>
              </div>
            </div>

            <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden mt-3">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totals.waterPercent}%` }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <span>Cellular Electrolytes in Range</span>
            <Button
              variant="subtle"
              size="xs"
              onClick={() => addWater(0.25)}
              className="text-sky-700 bg-sky-50 hover:bg-sky-100 border-sky-200"
            >
              +250ml Water
            </Button>
          </CardFooter>
        </Card>

        {/* Card 3: NutriScore with Live Breakdown Modal */}
        <Card hover>
          <CardHeader
            title="NutriScore Index"
            subtitle="Biomarker density"
            icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            badge={<Badge variant="emerald">{totals.calories > 0 ? 'Top 5%' : 'Optimal'}</Badge>}
          />
          <CardContent>
            <div className="flex items-center justify-between my-2 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100">
              <div>
                <span className="text-3xl font-extrabold text-emerald-950 tracking-tight">
                  {totals.calories > 0 ? Math.min(98, 70 + Math.round(proteinPercent * 0.2)) : 84}
                  <span className="text-sm font-semibold text-emerald-600">/100</span>
                </span>
                <span className="text-xs text-emerald-700 block font-medium">Superfood Density</span>
              </div>
              <div className="text-right">
                <Badge variant="emerald" size="sm">Excellent</Badge>
                <span className="text-xs text-surface-400 block mt-1">{user.streakDays} day streak 🔥</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-surface-500 mt-3 pt-2">
              <span>Fiber: {totals.fiber}g</span>
              <span>Meals logged: {totals.mealsWithFood}</span>
            </div>
          </CardContent>
          <CardFooter>
            <span>Based on active date nutrient density</span>
            <Button variant="ghost" size="xs" onClick={() => setIsScoreModalOpen(true)}>
              View Breakdown
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Target Recalibration Modal */}
      <Modal
        isOpen={isRecalibrateModalOpen}
        onClose={() => setIsRecalibrateModalOpen(false)}
        title="Recalibrate Daily Metabolic Targets"
        description="Adjust your calorie and macronutrient targets based on your active fitness plan."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsRecalibrateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveTargets} leftIcon={<Check className="w-4 h-4" />}>
              Save Targets
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-surface-700 block mb-1">Daily Calorie Budget (kcal)</label>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-xs font-bold text-emerald-700 block mb-1">Protein (g)</label>
              <input
                type="number"
                value={targetProtein}
                onChange={(e) => setTargetProtein(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-amber-700 block mb-1">Carbs (g)</label>
              <input
                type="number"
                value={targetCarbs}
                onChange={(e) => setTargetCarbs(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-purple-700 block mb-1">Fat (g)</label>
              <input
                type="number"
                value={targetFat}
                onChange={(e) => setTargetFat(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-sky-700 block mb-1">Water (L)</label>
              <input
                type="number"
                step="0.1"
                value={targetWater}
                onChange={(e) => setTargetWater(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* NutriScore Breakdown Modal */}
      <Modal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        title="NutriScore Index Breakdown"
        description="Comprehensive analysis of nutrient density, micronutrients, and antioxidant balance."
        size="md"
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsScoreModalOpen(false)}>
            Close Breakdown
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-surface-600">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <span className="font-bold text-emerald-950">NutriScore Rating</span>
            <span className="text-base font-extrabold text-emerald-700">
              {totals.calories > 0 ? Math.min(98, 70 + Math.round(proteinPercent * 0.2)) : 84}/100
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between p-2 rounded-xl bg-surface-50">
              <span>Whole Food Density</span>
              <span className="font-bold text-surface-900">92%</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-surface-50">
              <span>Fiber Pacing</span>
              <span className="font-bold text-surface-900">{totals.fiber}g logged</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-surface-50">
              <span>Hydration Status</span>
              <span className="font-bold text-surface-900">{totals.waterPercent}% Met</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
