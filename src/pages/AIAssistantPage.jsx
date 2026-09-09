import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useUI } from '../context/UIContext';
import { useNutrition } from '../context/NutritionContext';
import { Bot, Send, Sparkles, Plus, Check, User } from 'lucide-react';
import { formatDateDisplay } from '../../src/utils/storage';

export function AIAssistantPage() {
  const { user, showToast } = useUI();
  const { selectedDate, targets, totals, addFood } = useNutrition();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${user.firstName}! For ${formatDateDisplay(selectedDate)}, you currently have ${totals.remainingCalories} kcal remaining out of your ${targets.calories} kcal budget, with ${Math.max(0, Math.round((targets.protein - totals.protein) * 10) / 10)}g of protein needed. What would you like me to formulate or analyze?`,
      time: 'Just now',
      recommendation: {
        title: 'Pan-Seared Alaskan Salmon with Asparagus',
        calories: 380,
        protein: 36,
        carbs: 6,
        fat: 18,
        fiber: 4,
      },
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestionPrompts = [
    `What should I eat for dinner? (under ${Math.min(600, totals.remainingCalories || 500)} kcal)`,
    'Am I on track for protein today?',
    'Suggest high-fiber snacks with low glycemic index',
    'How is my hydration pacing today?',
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = `Based on your glucose stability index and ${totals.remainingCalories} kcal remaining budget for ${formatDateDisplay(selectedDate)}, I recommend prioritizing lean protein and complex micronutrients.`;
      let rec = null;

      if (text.toLowerCase().includes('dinner')) {
        aiResponseText = `Here is a chef-formulated dinner that fits your remaining ${totals.remainingCalories} kcal and provides 42g of clean protein:`;
        rec = {
          title: 'Lemon Herb Chicken & Quinoa Bowl',
          calories: Math.min(460, totals.remainingCalories || 460),
          protein: 42,
          carbs: 38,
          fat: 12,
          fiber: 6,
        };
      } else if (text.toLowerCase().includes('snack')) {
        aiResponseText = `Here is a high-protein, zero-added-sugar snack to stabilize your afternoon energy:`;
        rec = {
          title: 'Organic Greek Yogurt with Chia & Blueberries',
          calories: 160,
          protein: 18,
          carbs: 14,
          fat: 2,
          fiber: 4,
        };
      } else if (text.toLowerCase().includes('protein')) {
        aiResponseText = `You've logged ${totals.protein}g of protein out of your ${targets.protein}g target (${Math.round((totals.protein / targets.protein) * 100)}%). Adding a 25-30g protein source at your next meal will hit your metabolic pacing goal.`;
      } else if (text.toLowerCase().includes('hydration') || text.toLowerCase().includes('water')) {
        aiResponseText = `You have consumed ${totals.water}L out of your ${targets.water}L target (${totals.waterPercent}%). Drinking a glass with electrolytes will ensure cellular recovery.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiResponseText,
          time: 'Just now',
          recommendation: rec,
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleLogRecommendation = (rec) => {
    addFood(
      {
        name: rec.title,
        calories: rec.calories,
        protein: rec.protein,
        carbs: rec.carbs,
        fat: rec.fat,
        fiber: rec.fiber || 0,
        portion: '1 serving',
      },
      'dinner',
      1,
      selectedDate
    );
    showToast(`Logged "${rec.title}" to Dinner! 🥑`);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      <PageHeader
        title="Nutri AI Assistant"
        emoji="🤖"
        subtitle={`24/7 personalized metabolic nutritionist for ${formatDateDisplay(selectedDate)}.`}
        badge={<Badge variant="purple" dot>NutriPure AI v2.4 Active</Badge>}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([
                {
                  id: Date.now(),
                  sender: 'ai',
                  text: `New session started! You have ${totals.remainingCalories} kcal remaining for ${formatDateDisplay(selectedDate)}. How can I assist?`,
                  time: 'Just now',
                },
              ]);
              showToast('Conversation reset', 'info');
            }}
          >
            Reset Chat
          </Button>
        }
      />

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {suggestionPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-emerald-50 hover:text-brand-primary border border-surface-200 hover:border-emerald-200 transition-all whitespace-nowrap shadow-2xs cursor-pointer"
          >
            ✨ {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <Card className="flex-1 flex flex-col justify-between overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-surface-900 text-white'
                    : 'bg-brand-primary text-white shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-xl rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-surface-900 text-white rounded-tr-none'
                    : 'bg-surface-50 border border-surface-200/80 text-surface-900 rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>

                {msg.recommendation && (
                  <div className="mt-3 p-3 rounded-2xl bg-white border border-surface-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-surface-900">
                        {msg.recommendation.title}
                      </span>
                      <Badge variant="emerald" size="sm">
                        {msg.recommendation.calories} kcal
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-surface-500 mt-1">
                      <span>P: {msg.recommendation.protein}g</span>
                      <span>C: {msg.recommendation.carbs}g</span>
                      <span>F: {msg.recommendation.fat}g</span>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-surface-100 flex justify-end">
                      <Button
                        variant="primary"
                        size="xs"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        onClick={() => handleLogRecommendation(msg.recommendation)}
                      >
                        Log to Diary
                      </Button>
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-surface-400 block mt-1 text-right">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-surface-400 italic">
              <Bot className="w-4 h-4 text-brand-primary animate-pulse" />
              NutriPure AI is formulating response...
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 border-t border-surface-100 bg-surface-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything about your meal plan, biomarkers, or recipes..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-surface-200 rounded-2xl text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Send className="w-4 h-4" />}
              disabled={!inputVal.trim()}
            >
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
