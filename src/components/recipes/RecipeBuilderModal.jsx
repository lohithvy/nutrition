import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNutrition } from '../../context/NutritionContext';
import { useUI } from '../../context/UIContext';
import {
  foodDatabase,
  calculateRecipeNutrition,
} from '../../data/foodDatabase';
import {
  Plus,
  Trash2,
  ChefHat,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Clock,
  Users,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

const presetImages = [
  { label: 'Chicken & Quinoa', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Grilled Salmon', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80' },
  { label: 'Yogurt Parfait', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },
  { label: 'Tofu Protein Bowl', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' },
  { label: 'Egg Omelet', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80' },
  { label: 'Beef & Broccoli', url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80' },
];

export function RecipeBuilderModal({ isOpen, onClose, initialRecipe = null }) {
  const { createRecipe, updateRecipe } = useNutrition();
  const { showToast } = useUI();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('High Protein');
  const [difficulty, setDifficulty] = useState('Easy');
  const [servings, setServings] = useState(2);
  const [prepTime, setPrepTime] = useState('10 min');
  const [cookTime, setCookTime] = useState('15 min');
  const [image, setImage] = useState(presetImages[0].url);

  // Ingredients State
  const [ingredients, setIngredients] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState(foodDatabase[0].id);
  const [ingredientQty, setIngredientQty] = useState(100);
  const [ingredientUnit, setIngredientUnit] = useState('g');
  const [foodSearch, setFoodSearch] = useState('');

  // Instructions State
  const [instructions, setInstructions] = useState([]);
  const [newStepText, setNewStepText] = useState('');

  // Load initial recipe if editing
  useEffect(() => {
    if (initialRecipe) {
      setName(initialRecipe.name || '');
      setDescription(initialRecipe.description || '');
      setCategory(initialRecipe.category || 'High Protein');
      setDifficulty(initialRecipe.difficulty || 'Easy');
      setServings(initialRecipe.servings || 1);
      setPrepTime(initialRecipe.prepTime || '10 min');
      setCookTime(initialRecipe.cookTime || '15 min');
      setImage(initialRecipe.image || presetImages[0].url);
      setIngredients(initialRecipe.ingredients || []);
      setInstructions(
        initialRecipe.instructions
          ? initialRecipe.instructions.map((s, idx) => (typeof s === 'string' ? { step: idx + 1, text: s } : s))
          : []
      );
    } else {
      setName('');
      setDescription('');
      setCategory('High Protein');
      setDifficulty('Easy');
      setServings(2);
      setPrepTime('10 min');
      setCookTime('15 min');
      setImage(presetImages[0].url);
      setIngredients([
        { foodId: 'food-chicken-breast', foodName: 'Grilled Chicken Breast', quantity: 200, unit: 'g' },
        { foodId: 'food-brown-rice', foodName: 'Brown Basmati Rice (Cooked)', quantity: 150, unit: 'g' },
      ]);
      setInstructions([
        { step: 1, title: 'Prep Ingredients', text: 'Wash and prepare all required ingredients.' },
        { step: 2, title: 'Cook & Combine', text: 'Cook protein thoroughly and combine with grains.' },
      ]);
    }
  }, [initialRecipe, isOpen]);

  if (!isOpen) return null;

  // Live Auto-computed nutrition
  const { total: totalNutrition, perServing: perServingNutrition } = calculateRecipeNutrition(
    ingredients,
    servings
  );

  // Filtered food catalog for ingredients selector
  const filteredFoods = foodDatabase.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
    f.category.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const handleAddIngredient = () => {
    const selectedFood = foodDatabase.find((f) => f.id === selectedFoodId);
    if (!selectedFood) return;

    const newIng = {
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      quantity: Number(ingredientQty) || 100,
      unit: ingredientUnit || selectedFood.baseUnit,
    };

    setIngredients((prev) => [...prev, newIng]);
    showToast(`Added ${newIng.quantity}${newIng.unit} ${newIng.foodName}`);
  };

  const handleRemoveIngredient = (idx) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateIngredientQty = (idx, newQty) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === idx ? { ...ing, quantity: Math.max(1, Number(newQty)) } : ing))
    );
  };

  const handleAddStep = (e) => {
    e?.preventDefault();
    if (!newStepText.trim()) return;

    setInstructions((prev) => [
      ...prev,
      { step: prev.length + 1, title: `Step ${prev.length + 1}`, text: newStepText.trim() },
    ]);
    setNewStepText('');
  };

  const handleRemoveStep = (idx) => {
    setInstructions((prev) =>
      prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1, title: `Step ${i + 1}` }))
    );
  };

  const handleMoveStep = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= instructions.length) return;

    const updated = [...instructions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setInstructions(updated.map((s, i) => ({ ...s, step: i + 1, title: `Step ${i + 1}` })));
  };

  const handleSaveRecipe = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a recipe name', 'warning');
      return;
    }
    if (ingredients.length === 0) {
      showToast('Please add at least one ingredient', 'warning');
      return;
    }

    const recipeData = {
      name: name.trim(),
      description: description.trim() || 'Custom healthy recipe formulation.',
      category,
      difficulty,
      servings: Number(servings) || 1,
      prepTime,
      cookTime,
      image,
      ingredients,
      instructions: instructions.length > 0 ? instructions : [{ step: 1, text: 'Prepare ingredients and enjoy.' }],
    };

    if (initialRecipe && initialRecipe.id) {
      updateRecipe(initialRecipe.id, recipeData);
      showToast(`Recipe "${recipeData.name}" updated! ✅`);
    } else {
      createRecipe(recipeData);
      showToast(`Recipe "${recipeData.name}" created and saved! ✨`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialRecipe ? 'Edit Recipe' : 'Create Custom Recipe'}
      description="Craft your custom meal with automatic macronutrient calculation from our food database."
      size="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-surface-500">
            <span>Calculated: </span>
            <span className="font-bold text-surface-900">{perServingNutrition.calories} kcal/serving</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveRecipe} leftIcon={<Check className="w-4 h-4" />}>
              {initialRecipe ? 'Save Changes' : 'Save Recipe'}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSaveRecipe} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
            1. Recipe Overview
          </h4>

          <div>
            <label className="text-xs font-bold text-surface-700 block mb-1">Recipe Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Garlic Herb Chicken Pasta"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-surface-700 block mb-1">Short Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the dish and flavor profile..."
              rows={2}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-surface-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
              >
                <option value="High Protein">High Protein</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="High Fiber">High Fiber</option>
                <option value="Low Calorie">Low Calorie</option>
                <option value="Quick & Easy">Quick & Easy</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-surface-700 block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-surface-700 block mb-1">Prep Time</label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="10 min"
                className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-surface-700 block mb-1">Cook Time</label>
              <input
                type="text"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="15 min"
                className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-surface-700 block mb-1">Number of Servings</label>
              <input
                type="number"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-surface-700 block mb-1">Cover Image Preset</label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {presetImages.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setImage(p.url)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      image === p.url
                        ? 'bg-brand-primary text-white font-bold'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Automatic Nutrition Computed Preview */}
        <div className="p-4 rounded-3xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span>Auto-Computed Nutrition (Per Serving — {servings} Servings Total)</span>
            </span>
            <Badge variant="emerald" size="sm">Live Engine</Badge>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center mt-3">
            <div className="p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-base font-extrabold text-surface-900 block">{perServingNutrition.calories}</span>
              <span className="text-[10px] text-surface-400 block font-medium">kcal/serving</span>
            </div>
            <div className="p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-base font-extrabold text-emerald-700 block">{perServingNutrition.protein}g</span>
              <span className="text-[10px] text-surface-400 block font-medium">Protein</span>
            </div>
            <div className="p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-base font-extrabold text-amber-700 block">{perServingNutrition.carbs}g</span>
              <span className="text-[10px] text-surface-400 block font-medium">Carbs</span>
            </div>
            <div className="p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-base font-extrabold text-purple-700 block">{perServingNutrition.fat}g</span>
              <span className="text-[10px] text-surface-400 block font-medium">Fat</span>
            </div>
            <div className="p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs">
              <span className="text-base font-extrabold text-emerald-600 block">{perServingNutrition.fiber}g</span>
              <span className="text-[10px] text-surface-400 block font-medium">Fiber</span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-800 mt-2 text-right">
            Total recipe: {totalNutrition.calories} kcal • {totalNutrition.protein}g Protein • {totalNutrition.carbs}g Carbs
          </div>
        </div>

        {/* Ingredients Builder Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider flex items-center justify-between">
            <span>2. Ingredients List ({ingredients.length})</span>
            <span className="text-[10px] text-surface-400 normal-case">Nutrition calculated automatically</span>
          </h4>

          {/* Add Ingredient Bar */}
          <div className="p-3 rounded-2xl bg-surface-50 border border-surface-200/80 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6">
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  className="w-full p-2 text-xs font-semibold bg-white border border-surface-200 rounded-xl"
                >
                  {foodDatabase.map((food) => (
                    <option key={food.id} value={food.id}>
                      {food.name} ({food.calories} kcal / {food.baseAmount}{food.baseUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3 flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  value={ingredientQty}
                  onChange={(e) => setIngredientQty(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-surface-200 rounded-xl"
                  placeholder="Amount"
                />
                <select
                  value={ingredientUnit}
                  onChange={(e) => setIngredientUnit(e.target.value)}
                  className="p-2 text-xs font-semibold bg-white border border-surface-200 rounded-xl"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="oz">oz</option>
                  <option value="cup">cup</option>
                  <option value="tbsp">tbsp</option>
                  <option value="tsp">tsp</option>
                  <option value="slice">slice</option>
                  <option value="item">item</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAddIngredient}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="w-full"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Added Ingredients Items */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {ingredients.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-surface-200 text-center text-xs text-surface-400">
                No ingredients added yet. Select a food from above to add.
              </div>
            ) : (
              ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-surface-150 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-semibold text-surface-900 truncate">{ing.foodName}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min="1"
                      value={ing.quantity}
                      onChange={(e) => handleUpdateIngredientQty(idx, e.target.value)}
                      className="w-16 px-2 py-1 text-xs bg-surface-50 border border-surface-200 rounded-lg text-right font-bold"
                    />
                    <span className="text-xs text-surface-500 min-w-[24px]">{ing.unit}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(idx)}
                      className="p-1 text-surface-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Step-by-Step Instructions Section */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-surface-900 uppercase tracking-wider">
            3. Cooking Instructions ({instructions.length} steps)
          </h4>

          {/* Add Step Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              placeholder={`Step ${instructions.length + 1}: Describe cooking step...`}
              className="flex-1 px-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStep}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              disabled={!newStepText.trim()}
            >
              Add Step
            </Button>
          </div>

          {/* Steps List */}
          <div className="space-y-2">
            {instructions.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50/80 border border-surface-200/70 text-xs gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-5 h-5 rounded-full bg-brand-primary text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={step.text}
                    onChange={(e) => {
                      const updated = [...instructions];
                      updated[idx].text = e.target.value;
                      setInstructions(updated);
                    }}
                    className="flex-1 bg-transparent border-none text-xs text-surface-800 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveStep(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 text-surface-400 hover:text-surface-700 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveStep(idx, 1)}
                    disabled={idx === instructions.length - 1}
                    className="p-1 text-surface-400 hover:text-surface-700 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1 text-surface-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}
