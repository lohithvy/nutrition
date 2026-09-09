import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useUI } from '../context/UIContext';
import { CalendarDays, Sparkles, RefreshCw, Plus, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MealPlanPage() {
  const { openQuickLog, showToast } = useUI();
  const [activeDay, setActiveDay] = useState('Wed');
  const [isGenerating, setIsGenerating] = useState(false);

  const days = [
    { label: 'Mon', date: 'Oct 22' },
    { label: 'Tue', date: 'Oct 23' },
    { label: 'Wed', date: 'Oct 24', isToday: true },
    { label: 'Thu', date: 'Oct 25' },
    { label: 'Fri', date: 'Oct 26' },
    { label: 'Sat', date: 'Oct 27' },
    { label: 'Sun', date: 'Oct 28' },
  ];

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('AI synthesized 7-day personalized meal plan! 🥗');
    }, 1000);
  };

  const dayMeals = [
    { type: 'Breakfast', title: 'Spinach & Egg White Scramble + Avocado', kcal: 430, protein: '38g', time: '15m' },
    { type: 'Lunch', title: 'Mediterranean Herb Chicken & Quinoa', kcal: 580, protein: '52g', time: '20m' },
    { type: 'Afternoon Snack', title: 'Greek Yogurt 0% + Walnuts & Blueberries', kcal: 260, protein: '22g', time: '5m' },
    { type: 'Dinner', title: 'Wild Alaskan Salmon & Roasted Asparagus', kcal: 620, protein: '46g', time: '25m' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meal Planner"
        emoji="📅"
        subtitle="Weekly high-protein and nutrient dense meal schedule customized to your macros."
        badge={<Badge variant="amber" dot>Week 43 Active</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/grocery">
              <Button variant="outline" size="sm" leftIcon={<ShoppingCart className="w-4 h-4" />}>
                View Grocery List
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              isLoading={isGenerating}
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={handleGenerateAI}
            >
              Generate AI Plan
            </Button>
          </div>
        }
      />

      {/* Week Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-surface-200/80 shadow-2xs">
        {days.map((d) => {
          const isSelected = activeDay === d.label;
          return (
            <button
              key={d.label}
              onClick={() => setActiveDay(d.label)}
              className={`flex-1 min-w-[70px] p-2 rounded-xl text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-primary text-white shadow-xs font-bold'
                  : 'bg-surface-50 hover:bg-surface-100 text-surface-600'
              }`}
            >
              <span className="text-xs font-bold block">{d.label}</span>
              <span className={`text-[10px] block ${isSelected ? 'text-emerald-100' : 'text-surface-400'}`}>
                {d.date}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day's Planned Meals List */}
      <div className="space-y-3">
        {dayMeals.map((meal, idx) => (
          <Card key={idx} hover>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-brand-primary flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-100">
                  {meal.type[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-surface-400">
                      {meal.type}
                    </span>
                    <Badge variant="slate" size="sm">{meal.time}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-surface-900 mt-0.5">{meal.title}</h4>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-surface-100">
                <div className="text-right">
                  <span className="text-xs font-extrabold text-surface-900 block">{meal.kcal} kcal</span>
                  <span className="text-[10px] text-emerald-700 block font-semibold">{meal.protein} protein</span>
                </div>
                <Button variant="ghost" size="xs" onClick={openQuickLog} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Log Meal
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
