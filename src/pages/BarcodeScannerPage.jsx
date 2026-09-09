import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useUI } from '../context/UIContext';
import { useNutrition } from '../context/NutritionContext';
import { Barcode, Check, Scan, ShieldCheck, Plus, Minus, RotateCcw, Search } from 'lucide-react';
import { formatDateDisplay } from '../../src/utils/storage';

const mockPackagedProducts = [
  {
    code: '0737628064502',
    name: 'Organic Rolled Oats (Gluten-Free)',
    brand: "Bob's Red Mill",
    serving: '50g (1/2 cup)',
    calories: 190,
    protein: 7,
    carbs: 32,
    fat: 3.5,
    fiber: 5,
    category: 'Grains',
  },
  {
    code: '0852390147281',
    name: 'Raw California Almond Butter',
    brand: 'Artisana Organics',
    serving: '32g (2 tbsp)',
    calories: 200,
    protein: 7,
    carbs: 6,
    fat: 18,
    fiber: 4,
    category: 'Fats',
  },
  {
    code: '0412208945104',
    name: '100% Pure Whey Isolate Protein',
    brand: 'Optimum Nutrition',
    serving: '30g scoop',
    calories: 120,
    protein: 25,
    carbs: 1,
    fat: 1,
    fiber: 0,
    category: 'Protein',
  },
];

export function BarcodeScannerPage() {
  const { showToast } = useUI();
  const { addFood, selectedDate } = useNutrition();

  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'result'
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [manualCode, setManualCode] = useState('');
  const [targetMeal, setTargetMeal] = useState('breakfast');
  const [quantity, setQuantity] = useState(1);

  const activeProduct = mockPackagedProducts[selectedProductIndex];

  const handleScanBarcode = (idx = selectedProductIndex) => {
    setSelectedProductIndex(idx);
    setScanState('scanning');
    setQuantity(1);

    setTimeout(() => {
      setScanState('result');
      showToast(`Barcode ${mockPackagedProducts[idx].code} recognized! 🏷️`);
    }, 900);
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const foundIdx = mockPackagedProducts.findIndex(
      (p) => p.code.includes(manualCode.trim()) || p.name.toLowerCase().includes(manualCode.toLowerCase())
    );

    if (foundIdx !== -1) {
      handleScanBarcode(foundIdx);
    } else {
      handleScanBarcode(0);
    }
  };

  const handleAddToDiary = () => {
    const foodToAdd = {
      name: `${activeProduct.name} (${activeProduct.brand})`,
      portion: activeProduct.serving,
      calories: activeProduct.calories,
      protein: activeProduct.protein,
      carbs: activeProduct.carbs,
      fat: activeProduct.fat,
      fiber: activeProduct.fiber,
      category: activeProduct.category,
    };

    addFood(foodToAdd, targetMeal, quantity, selectedDate);
    showToast(`Added ${quantity}x ${activeProduct.name} to ${targetMeal} on ${formatDateDisplay(selectedDate)}! 🥑`);
    setScanState('idle');
  };

  const scaledCalories = Math.round(activeProduct.calories * quantity);
  const scaledProtein = Math.round(activeProduct.protein * quantity * 10) / 10;
  const scaledCarbs = Math.round(activeProduct.carbs * quantity * 10) / 10;
  const scaledFat = Math.round(activeProduct.fat * quantity * 10) / 10;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Barcode Scanner"
        emoji="🏷️"
        subtitle={`Scan packaged food UPC barcodes to pull verified nutritional databases for ${formatDateDisplay(selectedDate)}.`}
        badge={<Badge variant="blue">UPC / EAN Database Connected</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Viewfinder Box */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="rounded-3xl bg-surface-900 border border-surface-800 p-6 flex flex-col justify-between aspect-4/3 relative overflow-hidden shadow-card">
            {/* Header */}
            <div className="flex items-center justify-between z-10">
              <Badge variant="dark" size="sm" className="bg-surface-800 text-sky-400 border-surface-700">
                <Scan className="w-3.5 h-3.5 mr-1" />
                Barcode Detector Active
              </Badge>
              <span className="font-mono text-xs text-surface-400">UPC: {activeProduct.code}</span>
            </div>

            {/* Laser Reticle & Scan State */}
            <div className="relative flex flex-col items-center justify-center my-6">
              <div className="w-64 h-32 border-2 border-sky-400/60 rounded-2xl relative flex items-center justify-center bg-sky-950/20 overflow-hidden">
                {scanState === 'scanning' ? (
                  <div className="w-full h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce" />
                ) : scanState === 'result' ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Barcode Decoded</span>
                  </div>
                ) : (
                  <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
                )}
                <Barcode className="w-32 h-32 text-white/10 absolute pointer-events-none" />
              </div>
              <span className="text-xs text-sky-300 font-mono mt-3">
                {scanState === 'scanning'
                  ? 'Decoding UPC barcode...'
                  : 'Align barcode within the laser target'}
              </span>
            </div>

            {/* Quick Test Barcode Pills & Manual Search */}
            <div className="z-10 flex flex-col gap-2.5 pt-2 border-t border-surface-800">
              <form onSubmit={handleManualSearch} className="flex items-center gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Enter UPC number or product name..."
                  className="flex-1 px-3 py-1.5 text-xs bg-surface-800 border border-surface-700 rounded-xl text-white placeholder:text-surface-500 focus:outline-none"
                />
                <Button type="submit" variant="primary" size="xs" leftIcon={<Search className="w-3.5 h-3.5" />}>
                  Find
                </Button>
              </form>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {mockPackagedProducts.map((p, idx) => (
                  <button
                    key={p.code}
                    onClick={() => handleScanBarcode(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedProductIndex === idx && scanState !== 'idle'
                        ? 'bg-brand-primary text-white font-bold shadow-xs'
                        : 'bg-surface-800 hover:bg-surface-700 text-surface-300 border border-surface-700'
                    }`}
                  >
                    {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Nutrition Facts Result Card */}
        <div className="lg:col-span-5 flex flex-col">
          <Card className="flex-1 flex flex-col justify-between">
            <CardHeader
              title={scanState === 'result' ? activeProduct.name : 'Nutrition Facts Preview'}
              subtitle={scanState === 'result' ? `Brand: ${activeProduct.brand}` : 'Scan a packaged item to inspect details'}
              badge={
                scanState === 'result' ? (
                  <Badge variant="emerald">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified Label
                  </Badge>
                ) : (
                  <Badge variant="slate">Awaiting Scan</Badge>
                )
              }
            />

            <CardContent className="space-y-4">
              {scanState === 'result' ? (
                <>
                  <div className="p-4 rounded-2xl bg-surface-50 border border-surface-200/80 space-y-3">
                    <div className="flex items-center justify-between border-b border-surface-200 pb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-surface-500">
                        Serving Size
                      </span>
                      <span className="text-xs font-bold text-surface-900">{activeProduct.serving}</span>
                    </div>

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

                    <div className="flex items-center justify-between text-xs text-surface-500 pt-1">
                      <span>Dietary Fiber: {activeProduct.fiber * quantity}g</span>
                      <span>Category: {activeProduct.category}</span>
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
                </>
              ) : (
                <div className="py-12 text-center text-xs text-surface-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-surface-100 text-surface-400 flex items-center justify-center mx-auto">
                    <Barcode className="w-6 h-6" />
                  </div>
                  <p>Scan a product barcode or pick a sample above to view verified nutrition facts.</p>
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
                  onClick={() => handleScanBarcode(0)}
                  leftIcon={<Scan className="w-4 h-4" />}
                  className="w-full"
                >
                  Scan Barcode
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
