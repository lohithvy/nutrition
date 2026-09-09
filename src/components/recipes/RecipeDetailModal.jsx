import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNutrition } from '../../context/NutritionContext';
import { useUI } from '../../context/UIContext';
import {
  Clock,
  ChefHat,
  Flame,
  Users,
  Check,
  Plus,
  Minus,
  Sparkles,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { formatDateDisplay } from '../../utils/storage';

export function RecipeDetailModal({ recipe, isOpen, onClose }) {
  const { addFood, selectedDate } = useNutrition();
  const { showToast } = useUI();

  const [targetMeal, setTargetMeal] = useState('dinner');
  const [servingsToLog, setServingsToLog] = useState(1);
  const [isLogged, setIsLogged] = useState(false);

  if (!recipe || !isOpen) return null;

  const nutrition = recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  const scaledCalories = Math.round((nutrition.calories || 0) * servingsToLog);
  const scaledProtein = Math.round((nutrition.protein || 0) * servingsToLog * 10) / 10;
  const scaledCarbs = Math.round((nutrition.carbs || 0) * servingsToLog * 10) / 10;
  const scaledFat = Math.round((nutrition.fat || 0) * servingsToLog * 10) / 10;
  const scaledFiber = Math.round((nutrition.fiber || 0) * servingsToLog * 10) / 10;

  const handleAddToDiary = () => {
    addFood(
      {
        name: recipe.name,
        portion: `${servingsToLog} serving${servingsToLog === 1 ? '' : 's'} (${recipe.name})`,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        fiber: nutrition.fiber,
        category: recipe.category || 'Recipes',
      },
      targetMeal,
      servingsToLog,
      selectedDate
    );

    setIsLogged(true);
    showToast(
      `Added ${servingsToLog}x ${recipe.name} (${scaledCalories} kcal) to ${targetMeal} on ${formatDateDisplay(selectedDate)}! 🥑`
    );

    setTimeout(() => {
      setIsLogged(false);
      onClose();
    }, 900);
  };

  const difficultyColors = {
    Easy: 'emerald',
    Medium: 'amber',
    Hard: 'rose',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recipe.name}
      description={recipe.category}
      size="xl"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3 text-xs text-surface-600">
            <span className="font-bold text-surface-900">{scaledCalories} kcal total</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">{scaledProtein}g Protein</span>
            <span>•</span>
            <span className="text-amber-700 font-semibold">{scaledCarbs}g Carbs</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToDiary}
              leftIcon={isLogged ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {isLogged ? 'Added to Food Diary!' : `Log ${servingsToLog}x to Diary`}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hero Image & Quick Badges */}
        <div className="relative h-60 w-full rounded-3xl overflow-hidden bg-surface-100 shadow-sm border border-surface-200/80">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <Badge variant={difficultyColors[recipe.difficulty] || 'emerald'} size="sm">
              {recipe.difficulty}
            </Badge>
            <Badge variant="dark" size="sm" className="bg-surface-900/80 backdrop-blur-xs">
              {recipe.category}
            </Badge>
            {recipe.isCustom && (
              <Badge variant="purple" size="sm">
                My Recipe
              </Badge>
            )}
          </div>
        </div>

        {/* Description & Timing Highlights */}
        <div>
          <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
            {recipe.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <div className="p-3 rounded-2xl bg-surface-50 border border-surface-200/70 text-center">
              <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider block">
                Prep Time
              </span>
              <span className="text-xs font-extrabold text-surface-800 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                {recipe.prepTime}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-50 border border-surface-200/70 text-center">
              <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider block">
                Cook Time
              </span>
              <span className="text-xs font-extrabold text-surface-800 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {recipe.cookTime}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-50 border border-surface-200/70 text-center">
              <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider block">
                Total Time
              </span>
              <span className="text-xs font-extrabold text-surface-800 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                {recipe.totalTime}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-surface-50 border border-surface-200/70 text-center">
              <span className="text-[10px] text-surface-400 uppercase font-bold tracking-wider block">
                Recipe Yield
              </span>
              <span className="text-xs font-extrabold text-surface-800 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-sky-500" />
                {recipe.servings} serving{recipe.servings === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        {/* Nutrition Breakdown Card */}
        <div className="p-4 rounded-3xl bg-surface-50 border border-surface-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-surface-900 uppercase tracking-wider">
              Nutrition Breakdown (Per Serving)
            </span>
            <Badge variant="emerald" size="sm">
              <Sparkles className="w-3 h-3 mr-1" />
              NutriPure Verified
            </Badge>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-white border border-surface-200/70 shadow-2xs">
              <span className="text-base font-extrabold text-surface-900 block">{nutrition.calories}</span>
              <span className="text-[10px] text-surface-400 block font-medium">kcal</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border border-surface-200/70 shadow-2xs">
              <span className="text-base font-extrabold text-emerald-700 block">{nutrition.protein}g</span>
              <span className="text-[10px] text-surface-400 block font-medium">Protein</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border border-surface-200/70 shadow-2xs">
              <span className="text-base font-extrabold text-amber-700 block">{nutrition.carbs}g</span>
              <span className="text-[10px] text-surface-400 block font-medium">Carbs</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border border-surface-200/70 shadow-2xs">
              <span className="text-base font-extrabold text-purple-700 block">{nutrition.fat}g</span>
              <span className="text-[10px] text-surface-400 block font-medium">Fat</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white border border-surface-200/70 shadow-2xs">
              <span className="text-base font-extrabold text-emerald-600 block">{nutrition.fiber || 0}g</span>
              <span className="text-[10px] text-surface-400 block font-medium">Fiber</span>
            </div>
          </div>
        </div>

        {/* Ingredients Checklist */}
        <div>
          <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ChefHat className="w-4 h-4 text-brand-primary" />
            <span>Required Ingredients ({recipe.ingredients?.length || 0})</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(recipe.ingredients || []).map((ing, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-surface-200/80 shadow-2xs text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-surface-800">{ing.foodName}</span>
                </div>
                <Badge variant="slate" size="sm">
                  {ing.quantity} {ing.unit}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Cooking Instructions */}
        <div>
          <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brand-primary" />
            <span>Step-by-Step Cooking Instructions</span>
          </h4>

          <div className="space-y-3">
            {(recipe.instructions || []).map((step, idx) => {
              const stepNum = step.step || idx + 1;
              const stepTitle = step.title;
              const stepText = step.text || step;

              return (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-50/80 border border-surface-200/70"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {stepNum}
                  </div>
                  <div className="space-y-1 min-w-0">
                    {stepTitle && (
                      <h5 className="text-xs font-bold text-surface-900 tracking-tight">
                        {stepTitle}
                      </h5>
                    )}
                    <p className="text-xs text-surface-600 leading-relaxed">
                      {stepText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add to Diary Configurator */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-bold text-emerald-950">
                Log to Diary for {formatDateDisplay(selectedDate)}
              </span>
            </div>
            <span className="text-xs font-bold text-brand-primary">
              {scaledCalories} kcal ({scaledProtein}g P)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-surface-600 block mb-1">
                Target Meal
              </label>
              <select
                value={targetMeal}
                onChange={(e) => setTargetMeal(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-white border border-surface-200 rounded-xl focus:outline-none"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Afternoon Snack</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-surface-600 block mb-1">
                Servings to Log
              </label>
              <div className="flex items-center justify-between bg-white p-1 rounded-xl border border-surface-200">
                <button
                  type="button"
                  onClick={() => setServingsToLog((prev) => Math.max(0.5, prev - 0.5))}
                  className="p-1 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-surface-900">{servingsToLog} serving{servingsToLog === 1 ? '' : 's'}</span>
                <button
                  type="button"
                  onClick={() => setServingsToLog((prev) => prev + 0.5)}
                  className="p-1 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
