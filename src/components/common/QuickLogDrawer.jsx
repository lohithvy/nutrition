import React, { useState } from 'react';
import { Search, Plus, Sparkles, Check, Flame, ChevronRight, Heart, Minus } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { frequentFoods, quickLogCategories } from '../../data/mockData';
import { formatDateDisplay } from '../../utils/storage';

export function QuickLogDrawer() {
  const { isQuickLogOpen, closeQuickLog, showToast } = useUI();
  const { selectedDate, addFood } = useNutrition();

  const [selectedMealCategory, setSelectedMealCategory] = useState('breakfast');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState({});

  const getItemQty = (id) => quantities[id] || 1;

  const changeQty = (id, delta, e) => {
    e.stopPropagation();
    setQuantities((prev) => {
      const current = prev[id] || 1;
      const next = Math.max(0.25, Math.round((current + delta) * 100) / 100);
      return { ...prev, [id]: next };
    });
  };

  const handleAdd = (food) => {
    const qty = getItemQty(food.id);
    addFood(food, selectedMealCategory, qty, selectedDate);
    
    setAddedItems((prev) => ({ ...prev, [food.id]: true }));
    showToast(`Added ${qty}x ${food.name} (${Math.round(food.calories * qty)} kcal)! 🥑`);

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [food.id]: false }));
    }, 1200);
  };

  const handleAddAISuggestion = () => {
    const aiMeal = {
      id: 'ai-parfait',
      name: 'Greek Yogurt with Mixed Wild Berries',
      portion: '200g serving',
      calories: 145,
      protein: 18,
      carbs: 14,
      fat: 1.5,
      fiber: 3.5,
      category: 'Dairy',
    };
    addFood(aiMeal, selectedMealCategory, 1, selectedDate);
    setAddedItems((prev) => ({ ...prev, 'ai-suggest': true }));
    showToast(`Added AI suggestion to ${selectedMealCategory}! ✨`);

    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, 'ai-suggest': false }));
    }, 1200);
  };

  const filteredFoods = frequentFoods
    .filter((item) => (filterFavorites ? item.favorite : true))
    .filter(
      (item) =>
        item.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(localSearch.toLowerCase())
    );

  const handleDoneLogging = () => {
    closeQuickLog();
    showToast('Daily log updated! 🥑');
  };

  return (
    <Drawer
      isOpen={isQuickLogOpen}
      onClose={closeQuickLog}
      title="Quick Log Food"
      subtitle={`Logging for ${formatDateDisplay(selectedDate)}`}
      width="md"
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="outline" size="sm" onClick={closeQuickLog} className="w-1/2">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleDoneLogging} className="w-1/2">
            Done Logging
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search 1.2M+ verified foods or recipes..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            autoFocus
          />
        </div>

        {/* Meal Categories with Active Selection */}
        <div>
          <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2.5">
            Select Target Meal
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickLogCategories.map((meal) => {
              const isSelected = selectedMealCategory === meal.id;
              return (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => setSelectedMealCategory(meal.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-left group cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-brand-primary text-brand-primary shadow-2xs font-semibold'
                      : 'border-surface-200/80 bg-surface-50/50 hover:bg-surface-100/80 text-surface-800'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{meal.name}</span>
                    <span className="text-[10px] text-surface-400 block">{meal.calories}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-brand-primary translate-x-0.5' : 'text-surface-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Quick Suggestion Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-surface-900 block">AI Meal Predictor</span>
              <span className="text-[11px] text-surface-500 block">
                Log Greek Yogurt with Wild Berries (145 kcal)?
              </span>
            </div>
          </div>
          <Button variant="primary" size="xs" onClick={handleAddAISuggestion}>
            {addedItems['ai-suggest'] ? <Check className="w-3.5 h-3.5" /> : '+ Quick Add'}
          </Button>
        </div>

        {/* Frequent / Favorites Filter */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider">
              {filterFavorites ? 'Favorite Foods' : 'Frequent Foods'}
            </h4>
            <button
              onClick={() => setFilterFavorites((prev) => !prev)}
              className={`flex items-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors ${
                filterFavorites ? 'text-amber-600 underline' : 'text-emerald-700 hover:underline'
              }`}
            >
              <Heart className={`w-3 h-3 ${filterFavorites ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{filterFavorites ? 'Show All' : 'Favorites only'}</span>
            </button>
          </div>

          <div className="space-y-2">
            {filteredFoods.length === 0 ? (
              <div className="text-center py-6 text-xs text-surface-400">
                No matching foods found. Try a different search term.
              </div>
            ) : (
              filteredFoods.map((food) => {
                const isAdded = !!addedItems[food.id];
                const qty = getItemQty(food.id);
                const scaledKcal = Math.round((food.calories || 0) * qty);
                const scaledProtein = Math.round((food.protein || 0) * qty * 10) / 10;
                const scaledCarbs = Math.round((food.carbs || 0) * qty * 10) / 10;
                const scaledFat = Math.round((food.fat || 0) * qty * 10) / 10;

                return (
                  <div
                    key={food.id}
                    className="flex flex-col p-3 rounded-xl border border-surface-150 bg-white hover:border-surface-300 transition-all shadow-2xs gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-surface-900 truncate">
                            {food.name}
                          </span>
                          <Badge variant="slate" size="sm">
                            {food.portion}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2.5 mt-1 text-[11px] text-surface-500">
                          <span className="font-semibold text-amber-700 flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-amber-500" />
                            {scaledKcal} kcal
                          </span>
                          <span>P: {scaledProtein}g</span>
                          <span>C: {scaledCarbs}g</span>
                          <span>F: {scaledFat}g</span>
                        </div>
                      </div>

                      <Button
                        variant={isAdded ? 'primary' : 'outline'}
                        size="icon-sm"
                        onClick={() => handleAdd(food)}
                        className={isAdded ? 'bg-emerald-600' : ''}
                        title="Add food to log"
                      >
                        {isAdded ? <Check className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Serving Quantity Multiplier Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-surface-100/70 text-xs">
                      <span className="text-[11px] text-surface-400">Serving quantity:</span>
                      <div className="flex items-center gap-2 bg-surface-50 px-2 py-0.5 rounded-lg border border-surface-200">
                        <button
                          type="button"
                          onClick={(e) => changeQty(food.id, -0.5, e)}
                          className="text-surface-500 hover:text-surface-900 font-bold px-1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-surface-800 text-[11px]">{qty}x</span>
                        <button
                          type="button"
                          onClick={(e) => changeQty(food.id, 0.5, e)}
                          className="text-surface-500 hover:text-surface-900 font-bold px-1"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
