import React, { useState } from 'react';
import { Search, Flame, ArrowRight, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { frequentFoods, mockRecipes } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

export function GlobalSearchModal() {
  const { isSearchOpen, closeSearch, showToast } = useUI();
  const { addFood, selectedDate } = useNutrition();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredFoods = query.trim()
    ? frequentFoods.filter(
        (f) =>
          f.name.toLowerCase().includes(query.toLowerCase()) ||
          f.category.toLowerCase().includes(query.toLowerCase())
      )
    : frequentFoods.slice(0, 4);

  const filteredRecipes = query.trim()
    ? mockRecipes.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      )
    : mockRecipes.slice(0, 2);

  const handleSelectFood = (food) => {
    addFood(food, 'breakfast', 1, selectedDate);
    closeSearch();
    showToast(`Logged "${food.name}" (${food.calories} kcal)! 🥑`);
  };

  const handleSelectRecipe = (recipe) => {
    closeSearch();
    navigate('/recipes');
  };

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={closeSearch}
      title="Global NutriFlow Search"
      description="Quickly search foods, verified recipes, biomarkers, and insights"
      size="lg"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-surface-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a food (e.g. Avocado, Salmon), recipe, or goal..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-surface-50 border border-surface-200 rounded-2xl text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            autoFocus
          />
        </div>

        {/* Results Section: Foods */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-surface-400">
              Verified Foods ({filteredFoods.length})
            </span>
          </div>

          <div className="space-y-1.5">
            {filteredFoods.map((food) => (
              <button
                key={food.id}
                onClick={() => handleSelectFood(food)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/70 border border-transparent hover:border-emerald-200 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100/60 text-brand-primary flex items-center justify-center text-xs font-bold">
                    🥑
                  </div>
                  <div>
                    <span className="text-xs font-bold text-surface-900 block group-hover:text-brand-primary">
                      {food.name}
                    </span>
                    <span className="text-[10px] text-surface-500 block">
                      {food.portion} • {food.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="amber" size="sm">
                    {food.calories} kcal
                  </Badge>
                  <span className="text-xs text-brand-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                    + Log
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Section: Recipes */}
        <div className="pt-2 border-t border-surface-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-surface-400">
              Nutrient Recipes ({filteredRecipes.length})
            </span>
          </div>

          <div className="space-y-1.5">
            {filteredRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => handleSelectRecipe(recipe)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-100 border border-transparent hover:border-surface-200 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-surface-900 block truncate group-hover:text-brand-primary">
                      {recipe.title}
                    </span>
                    <span className="text-[10px] text-surface-500 block">
                      {recipe.time} • {recipe.protein}g protein
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-surface-400 group-hover:text-surface-700 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
