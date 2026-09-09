import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useUI } from '../context/UIContext';
import { useNutrition } from '../context/NutritionContext';
import { RecipeDetailModal } from '../components/recipes/RecipeDetailModal';
import { RecipeBuilderModal } from '../components/recipes/RecipeBuilderModal';
import {
  ChefHat,
  Clock,
  Flame,
  Plus,
  Sparkles,
  Search,
  BookOpen,
  Edit2,
  Trash2,
  Check,
  Filter,
  Users,
} from 'lucide-react';
import { formatDateDisplay } from '../utils/storage';

const CATEGORIES = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'High Protein',
  'High Fiber',
  'Low Calorie',
  'Vegetarian',
  'Quick & Easy',
];

export function RecipesPage() {
  const { showToast } = useUI();
  const {
    customRecipes,
    prebuiltRecipes,
    deleteRecipe,
    addFood,
    selectedDate,
  } = useNutrition();

  // Active Source Tab: 'prebuilt' | 'custom'
  const [activeSourceTab, setActiveSourceTab] = useState('prebuilt');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [activeRecipeDetail, setActiveRecipeDetail] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Card Quick-log feedback tracking: { [recipeId]: true }
  const [loggedRecipes, setLoggedRecipes] = useState({});

  // Active catalog based on source tab
  const activeCatalog = activeSourceTab === 'prebuilt' ? prebuiltRecipes : customRecipes;

  // Filtered recipes
  const filteredRecipes = activeCatalog.filter((recipe) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      recipe.category === selectedCategory ||
      (recipe.tags && recipe.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()));

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName = recipe.name?.toLowerCase().includes(query);
    const matchesDesc = recipe.description?.toLowerCase().includes(query);
    const matchesIngredients = recipe.ingredients?.some((ing) =>
      ing.foodName?.toLowerCase().includes(query)
    );
    const matchesTags = recipe.tags?.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && (matchesName || matchesDesc || matchesIngredients || matchesTags);
  });

  const handleQuickLog = (recipe, e) => {
    if (e) e.stopPropagation();
    const nut = recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    addFood(
      {
        name: recipe.name,
        portion: `1 serving (${recipe.name})`,
        calories: nut.calories || 0,
        protein: nut.protein || 0,
        carbs: nut.carbs || 0,
        fat: nut.fat || 0,
        fiber: nut.fiber || 0,
        category: recipe.category || 'Recipes',
      },
      'dinner',
      1,
      selectedDate
    );

    setLoggedRecipes((prev) => ({ ...prev, [recipe.id]: true }));
    showToast(`Logged "${recipe.name}" (1 serving) to Dinner for ${formatDateDisplay(selectedDate)}! 🥗`);

    setTimeout(() => {
      setLoggedRecipes((prev) => ({ ...prev, [recipe.id]: false }));
    }, 1600);
  };

  const handleOpenEdit = (recipe, e) => {
    if (e) e.stopPropagation();
    setEditingRecipe(recipe);
    setIsBuilderOpen(true);
  };

  const handleDeleteCustomRecipe = (recipe, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      deleteRecipe(recipe.id);
      showToast(`Deleted "${recipe.name}" from your custom recipes`, 'info');
    }
  };

  const handleOpenCreateNew = () => {
    setEditingRecipe(null);
    setIsBuilderOpen(true);
  };

  const difficultyColors = {
    Easy: 'emerald',
    Medium: 'amber',
    Hard: 'rose',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Nutrient-Dense Recipes"
        emoji="🥗"
        subtitle={`Explore chef-crafted nutrition formulations or engineer your own custom recipes with live macro tracking for ${formatDateDisplay(selectedDate)}.`}
        badge={<Badge variant="emerald" dot>Live Macro Computation Engine</Badge>}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreateNew}
          >
            Create Recipe
          </Button>
        }
      />

      {/* Top Controls: Source Tabs + Category Pills + Search */}
      <div className="space-y-3 bg-white p-4 rounded-3xl border border-surface-200/80 shadow-2xs">
        {/* Source Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-surface-150">
          {/* Source Tabs */}
          <div className="flex items-center gap-2 p-1 bg-surface-100/80 rounded-2xl border border-surface-200/60">
            <button
              type="button"
              onClick={() => {
                setActiveSourceTab('prebuilt');
                setSelectedCategory('All');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSourceTab === 'prebuilt'
                  ? 'bg-white text-surface-900 shadow-xs'
                  : 'text-surface-500 hover:text-surface-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>NutriFlow Catalog</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-200 text-surface-700 font-semibold">
                {prebuiltRecipes.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveSourceTab('custom');
                setSelectedCategory('All');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSourceTab === 'custom'
                  ? 'bg-white text-surface-900 shadow-xs'
                  : 'text-surface-500 hover:text-surface-800'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5 text-purple-600" />
              <span>My Recipes</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                customRecipes.length > 0 ? 'bg-purple-100 text-purple-700 font-bold' : 'bg-surface-200 text-surface-700'
              }`}>
                {customRecipes.length}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients, tags..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-50 border border-surface-200 rounded-xl text-surface-800 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white shadow-xs font-bold'
                  : 'bg-surface-50 hover:bg-surface-100 text-surface-600 border border-surface-200/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recipe Content Area */}
      {filteredRecipes.length === 0 ? (
        activeSourceTab === 'custom' && customRecipes.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-surface-200/80 shadow-2xs text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto text-purple-600 shadow-xs">
              <ChefHat className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-surface-900">
                No Custom Recipes Yet
              </h3>
              <p className="text-xs sm:text-sm text-surface-500 leading-relaxed">
                Build your own signature meals! Add ingredients from our verified food catalog and NutriFlow will calculate precise calories and macros automatically.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreateNew}
              className="mx-auto"
            >
              Create Your First Recipe
            </Button>
          </div>
        ) : (
          <EmptyState
            icon={Filter}
            title="No Recipes Found"
            description={`No recipes match your filter "${selectedCategory}" ${searchQuery ? `or query "${searchQuery}"` : ''}.`}
            actionLabel="Reset Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecipes.map((recipe) => {
            const isLogged = !!loggedRecipes[recipe.id];
            const nut = recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

            return (
              <Card
                key={recipe.id}
                hover
                onClick={() => setActiveRecipeDetail(recipe)}
                className="cursor-pointer group flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Hero Image */}
                  <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-surface-100">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <Badge
                        variant={difficultyColors[recipe.difficulty] || 'emerald'}
                        size="sm"
                        className="shadow-2xs font-bold"
                      >
                        {recipe.difficulty}
                      </Badge>
                      <Badge variant="dark" size="sm" className="bg-surface-900/80 backdrop-blur-xs">
                        {recipe.category}
                      </Badge>
                      {recipe.isCustom && (
                        <Badge variant="purple" size="sm" className="font-bold shadow-2xs">
                          My Recipe
                        </Badge>
                      )}
                    </div>

                    {/* Time Badge */}
                    <div className="absolute bottom-3 right-3">
                      <Badge
                        variant="slate"
                        size="sm"
                        className="bg-white/95 backdrop-blur-xs font-bold text-surface-800 shadow-2xs"
                      >
                        <Clock className="w-3 h-3 mr-1 text-brand-primary" />
                        {recipe.totalTime || recipe.prepTime}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-surface-900 group-hover:text-brand-primary transition-colors tracking-tight line-clamp-1">
                          {recipe.name}
                        </h3>
                      </div>
                      <p className="text-xs text-surface-500 mt-1 leading-relaxed line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>

                    {/* Nutrition 4-Macro Grid */}
                    <div className="grid grid-cols-4 gap-1.5 p-2 rounded-2xl bg-surface-50 border border-surface-150 text-center">
                      <div className="p-1 rounded-xl bg-white border border-surface-150/60 shadow-2xs">
                        <span className="text-xs font-extrabold text-surface-900 block leading-tight">
                          {nut.calories}
                        </span>
                        <span className="text-[9px] text-surface-400 block font-medium">kcal</span>
                      </div>
                      <div className="p-1 rounded-xl bg-white border border-surface-150/60 shadow-2xs">
                        <span className="text-xs font-extrabold text-emerald-700 block leading-tight">
                          {nut.protein}g
                        </span>
                        <span className="text-[9px] text-surface-400 block font-medium">Protein</span>
                      </div>
                      <div className="p-1 rounded-xl bg-white border border-surface-150/60 shadow-2xs">
                        <span className="text-xs font-extrabold text-amber-700 block leading-tight">
                          {nut.carbs}g
                        </span>
                        <span className="text-[9px] text-surface-400 block font-medium">Carbs</span>
                      </div>
                      <div className="p-1 rounded-xl bg-white border border-surface-150/60 shadow-2xs">
                        <span className="text-xs font-extrabold text-purple-700 block leading-tight">
                          {nut.fat}g
                        </span>
                        <span className="text-[9px] text-surface-400 block font-medium">Fat</span>
                      </div>
                    </div>

                    {/* Ingredients Preview */}
                    <div className="flex items-center gap-1.5 text-[11px] text-surface-500">
                      <ChefHat className="w-3.5 h-3.5 text-surface-400" />
                      <span>
                        {recipe.ingredients?.length || 0} ingredients • {recipe.servings} serving{recipe.servings === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isLogged ? 'primary' : 'outline'}
                      size="sm"
                      onClick={(e) => handleQuickLog(recipe, e)}
                      leftIcon={isLogged ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      className="flex-1 text-xs"
                    >
                      {isLogged ? 'Logged!' : 'Log to Diary'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRecipeDetail(recipe);
                      }}
                      className="px-2.5 text-xs text-surface-600 hover:text-surface-900"
                    >
                      View
                    </Button>
                  </div>

                  {/* Edit / Delete Controls for Custom Recipes */}
                  {recipe.isCustom && (
                    <div className="flex items-center justify-end gap-1 pt-2 border-t border-surface-150/70">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(recipe, e)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-surface-600 hover:text-brand-primary rounded-lg hover:bg-surface-100 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCustomRecipe(recipe, e)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-surface-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recipe Detail Full View Modal */}
      <RecipeDetailModal
        recipe={activeRecipeDetail}
        isOpen={!!activeRecipeDetail}
        onClose={() => setActiveRecipeDetail(null)}
      />

      {/* Custom Recipe Builder / Editor Modal */}
      <RecipeBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => {
          setIsBuilderOpen(false);
          setEditingRecipe(null);
        }}
        initialRecipe={editingRecipe}
      />
    </div>
  );
}
