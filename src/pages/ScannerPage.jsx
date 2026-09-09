import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useUI } from '../context/UIContext';
import { useNutrition } from '../context/NutritionContext';
import { Camera, Sparkles, Check, RefreshCw, Upload, Flame, Plus, Minus, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDateDisplay } from '../../src/utils/storage';

const mockDetectedMeals = [
  {
    id: 'scan-1',
    name: 'Grilled Herb Chicken with Quinoa & Asparagus',
    confidence: 97,
    portion: '280g plate',
    calories: 420,
    protein: 48,
    carbs: 28,
    fat: 12,
    fiber: 6,
    category: 'Protein',
    microNotes: 'Rich in Lean B-Vitamins, Zinc, and Dietary Magnesium.',
  },
  {
    id: 'scan-2',
    name: 'Avocado Toast with Poached Eggs',
    confidence: 95,
    portion: '1 plate (2 eggs + 1 slice)',
    calories: 340,
    protein: 18,
    carbs: 24,
    fat: 20,
    fiber: 7,
    category: 'Fats',
    microNotes: 'High in Monounsaturated Fatty Acids, Choline, and Folate.',
  },
  {
    id: 'scan-3',
    name: 'Wild Alaskan Salmon & Roasted Sweet Potato',
    confidence: 98,
    portion: '300g plate',
    calories: 490,
    protein: 44,
    carbs: 34,
    fat: 18,
    fiber: 5,
    category: 'Seafood',
    microNotes: 'High EPA/DHA Omega-3 profile and Beta-Carotene.',
  },
];

export function ScannerPage() {
  const { showToast } = useUI();
  const { addFood, selectedDate } = useNutrition();
  const navigate = useNavigate();

  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'result'
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [targetMeal, setTargetMeal] = useState('lunch');
  const [quantity, setQuantity] = useState(1);

  const activeMeal = mockDetectedMeals[selectedPresetIndex];

  const handleStartScan = (presetIdx = selectedPresetIndex) => {
    setSelectedPresetIndex(presetIdx);
    setScanState('scanning');
    setQuantity(1);

    setTimeout(() => {
      setScanState('result');
      showToast(`Plate detected: "${mockDetectedMeals[presetIdx].name}" (${mockDetectedMeals[presetIdx].confidence}% match)! ✨`);
    }, 1200);
  };

  const handleAddToDiary = () => {
    const foodToAdd = {
      name: activeMeal.name,
      portion: activeMeal.portion,
      calories: activeMeal.calories,
      protein: activeMeal.protein,
      carbs: activeMeal.carbs,
      fat: activeMeal.fat,
      fiber: activeMeal.fiber,
      category: activeMeal.category,
    };

    addFood(foodToAdd, targetMeal, quantity, selectedDate);
    showToast(`Added ${quantity}x ${activeMeal.name} to ${targetMeal} on ${formatDateDisplay(selectedDate)}! 🥑`);
    setScanState('idle');
  };

  const scaledCalories = Math.round(activeMeal.calories * quantity);
  const scaledProtein = Math.round(activeMeal.protein * quantity * 10) / 10;
  const scaledCarbs = Math.round(activeMeal.carbs * quantity * 10) / 10;
  const scaledFat = Math.round(activeMeal.fat * quantity * 10) / 10;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Food Vision Scanner"
        emoji="📸"
        subtitle={`Point your camera or select a sample plate to auto-estimate macros for ${formatDateDisplay(selectedDate)}.`}
        badge={<Badge variant="purple" dot>Vision AI Model v2.4 Active</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Viewfinder Camera Simulation */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative aspect-4/3 rounded-3xl bg-surface-900 overflow-hidden shadow-card border border-surface-800 flex flex-col justify-between p-6">
            {/* Viewfinder Header */}
            <div className="flex items-center justify-between z-10">
              <Badge variant="dark" size="sm" className="bg-surface-800/90 text-emerald-400 border-surface-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1.5" />
                Live Camera Ready
              </Badge>
              <Badge variant="dark" size="sm" className="bg-surface-800/90 text-white border-surface-700">
                HD 1080p AI
              </Badge>
            </div>

            {/* Viewfinder Target Reticle & State Overlay */}
            <div className="relative flex-1 flex items-center justify-center my-4">
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-3xl border-2 border-dashed border-emerald-400/70 flex items-center justify-center relative bg-emerald-950/10">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />

                {scanState === 'scanning' ? (
                  <div className="flex flex-col items-center gap-3 p-4 text-center">
                    <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
                    <div>
                      <span className="text-xs text-emerald-300 font-bold block">Analyzing Plate...</span>
                      <span className="text-[10px] text-emerald-400/80 block mt-0.5">Segmenting portion sizes</span>
                    </div>
                  </div>
                ) : scanState === 'result' ? (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <span className="text-xs text-emerald-300 font-bold">Plate Recognized</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="w-12 h-12 text-white/40" />
                    <span className="text-[11px] text-white/60">Align meal in frame</span>
                  </div>
                )}
              </div>
            </div>

            {/* Presets & Scan Controls */}
            <div className="z-10 flex flex-col gap-2 pt-2 border-t border-surface-800">
              <div className="flex items-center justify-between text-xs text-surface-400">
                <span>Select sample meal:</span>
                <span className="text-[11px] text-emerald-400">3 AI presets ready</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {mockDetectedMeals.map((meal, idx) => (
                  <button
                    key={meal.id}
                    onClick={() => handleStartScan(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedPresetIndex === idx && scanState !== 'idle'
                        ? 'bg-brand-primary text-white font-bold shadow-xs'
                        : 'bg-surface-800 hover:bg-surface-700 text-surface-300 border border-surface-700'
                    }`}
                  >
                    {meal.name.split(' ')[0]} {meal.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recognition Results & Add to Diary */}
        <div className="lg:col-span-5 flex flex-col">
          <Card className="flex-1 flex flex-col justify-between">
            <CardHeader
              title={scanState === 'result' ? 'Detection Results' : 'Scanner Preview'}
              subtitle={
                scanState === 'result'
                  ? `AI Confidence: ${activeMeal.confidence}%`
                  : 'Scan a meal to view macronutrient breakdown'
              }
              badge={
                scanState === 'result' ? (
                  <Badge variant="emerald">{activeMeal.confidence}% Match</Badge>
                ) : (
                  <Badge variant="slate">Awaiting Scan</Badge>
                )
              }
            />

            <CardContent className="space-y-4">
              {scanState === 'result' ? (
                <>
                  <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200/80 space-y-3">
                    <div>
                      <span className="text-sm font-bold text-surface-900 block leading-tight">
                        {activeMeal.name}
                      </span>
                      <span className="text-xs text-surface-500 block mt-0.5">
                        Detected: {activeMeal.portion}
                      </span>
                    </div>

                    {/* Macro Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-white border border-surface-200/60 shadow-2xs">
                        <span className="text-base font-extrabold text-surface-900 block">{scaledCalories}</span>
                        <span className="text-[10px] text-surface-400 block font-medium">kcal</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-surface-200/60 shadow-2xs">
                        <span className="text-base font-extrabold text-emerald-700 block">{scaledProtein}g</span>
                        <span className="text-[10px] text-surface-400 block font-medium">Protein</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-surface-200/60 shadow-2xs">
                        <span className="text-base font-extrabold text-amber-700 block">{scaledCarbs}g</span>
                        <span className="text-[10px] text-surface-400 block font-medium">Carbs</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-surface-200/60 shadow-2xs">
                        <span className="text-base font-extrabold text-purple-700 block">{scaledFat}g</span>
                        <span className="text-[10px] text-surface-400 block font-medium">Fat</span>
                      </div>
                    </div>
                  </div>

                  {/* Serving Multiplier & Target Meal */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-surface-500 block mb-1">
                        Serving Multiplier
                      </label>
                      <div className="flex items-center justify-between bg-surface-50 p-1.5 rounded-xl border border-surface-200">
                        <button
                          onClick={() => setQuantity((prev) => Math.max(0.5, prev - 0.5))}
                          className="p-1 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-surface-900">{quantity}x</span>
                        <button
                          onClick={() => setQuantity((prev) => prev + 0.5)}
                          className="p-1 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-surface-500 block mb-1">
                        Log to Meal
                      </label>
                      <select
                        value={targetMeal}
                        onChange={(e) => setTargetMeal(e.target.value)}
                        className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Afternoon Snack</option>
                      </select>
                    </div>
                  </div>

                  {/* Micronutrient Insight */}
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">Micronutrient Profile</span>
                      <p className="text-[11px] text-emerald-800 leading-snug">{activeMeal.microNotes}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-surface-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-surface-100 text-surface-400 flex items-center justify-center mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p>Click "Scan Plate" or select one of the meal presets to analyze the meal.</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="gap-2">
              {scanState === 'result' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScanState('idle')}
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    className="w-1/3"
                  >
                    Rescan
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddToDiary}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="w-2/3"
                  >
                    Add to Diary ({scaledCalories} kcal)
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleStartScan(0)}
                  leftIcon={<Camera className="w-4 h-4" />}
                  className="w-full"
                >
                  Scan Plate
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
