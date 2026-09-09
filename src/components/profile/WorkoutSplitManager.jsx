import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Dumbbell,
  Plus,
  Trash2,
  Check,
  Sparkles,
  RotateCcw,
  Moon,
  Flame,
  Zap,
} from 'lucide-react';

const SPLIT_PRESETS = {
  'Push / Pull / Legs': [
    { id: 'mon', day: 'Monday', focus: 'Push (Chest, Shoulders, Triceps)', type: 'Strength', isRest: false },
    { id: 'tue', day: 'Tuesday', focus: 'Pull (Back, Rear Delts, Biceps)', type: 'Strength', isRest: false },
    { id: 'wed', day: 'Wednesday', focus: 'Legs & Calves (Quad Dominant)', type: 'Hypertrophy', isRest: false },
    { id: 'thu', day: 'Thursday', focus: 'Active Recovery & Mobility', type: 'Rest', isRest: true },
    { id: 'fri', day: 'Friday', focus: 'Push & Pull Hypertrophy', type: 'Hypertrophy', isRest: false },
    { id: 'sat', day: 'Saturday', focus: 'Legs & Posterior Chain', type: 'Strength', isRest: false },
    { id: 'sun', day: 'Sunday', focus: 'Complete Rest & Recovery', type: 'Rest', isRest: true },
  ],
  'Upper / Lower': [
    { id: 'mon', day: 'Monday', focus: 'Upper Body (Heavy Compound)', type: 'Strength', isRest: false },
    { id: 'tue', day: 'Tuesday', focus: 'Lower Body (Squat / Quad Focus)', type: 'Strength', isRest: false },
    { id: 'wed', day: 'Wednesday', focus: 'Rest & Zone 2 Walk', type: 'Rest', isRest: true },
    { id: 'thu', day: 'Thursday', focus: 'Upper Body (Hypertrophy / Volume)', type: 'Hypertrophy', isRest: false },
    { id: 'fri', day: 'Friday', focus: 'Lower Body (Hinge / Hamstring)', type: 'Hypertrophy', isRest: false },
    { id: 'sat', day: 'Saturday', focus: 'Cardio & Conditioning', type: 'Cardio', isRest: false },
    { id: 'sun', day: 'Sunday', focus: 'Rest Day', type: 'Rest', isRest: true },
  ],
  'Full Body': [
    { id: 'mon', day: 'Monday', focus: 'Full Body A (Squat, Bench, Row)', type: 'Strength', isRest: false },
    { id: 'tue', day: 'Tuesday', focus: 'Rest & Mobility', type: 'Rest', isRest: true },
    { id: 'wed', day: 'Wednesday', focus: 'Full Body B (Deadlift, OHP, Chins)', type: 'Strength', isRest: false },
    { id: 'thu', day: 'Thursday', focus: 'Rest Day', type: 'Rest', isRest: true },
    { id: 'fri', day: 'Friday', focus: 'Full Body C (Hypertrophy & Core)', type: 'Hypertrophy', isRest: false },
    { id: 'sat', day: 'Saturday', focus: 'Zone 2 Cardio & Stretch', type: 'Cardio', isRest: false },
    { id: 'sun', day: 'Sunday', focus: 'Rest & Sleep Optimization', type: 'Rest', isRest: true },
  ],
  'Bro Split': [
    { id: 'mon', day: 'Monday', focus: 'Chest Day (Pecs & Abs)', type: 'Strength', isRest: false },
    { id: 'tue', day: 'Tuesday', focus: 'Back Day (Lats & Traps)', type: 'Strength', isRest: false },
    { id: 'wed', day: 'Wednesday', focus: 'Shoulders & Calves', type: 'Hypertrophy', isRest: false },
    { id: 'thu', day: 'Thursday', focus: 'Leg Day (Quads & Hamstrings)', type: 'Strength', isRest: false },
    { id: 'fri', day: 'Friday', focus: 'Arms (Biceps & Triceps Super-sets)', type: 'Hypertrophy', isRest: false },
    { id: 'sat', day: 'Saturday', focus: 'Cardio & Core', type: 'Cardio', isRest: false },
    { id: 'sun', day: 'Sunday', focus: 'Rest Day', type: 'Rest', isRest: true },
  ],
  'Push / Pull': [
    { id: 'mon', day: 'Monday', focus: 'Push (Chest, Shoulders, Quads)', type: 'Strength', isRest: false },
    { id: 'tue', day: 'Tuesday', focus: 'Pull (Back, Hamstrings, Biceps)', type: 'Strength', isRest: false },
    { id: 'wed', day: 'Wednesday', focus: 'Rest & Recovery', type: 'Rest', isRest: true },
    { id: 'thu', day: 'Thursday', focus: 'Push Volume', type: 'Hypertrophy', isRest: false },
    { id: 'fri', day: 'Friday', focus: 'Pull Volume', type: 'Hypertrophy', isRest: false },
    { id: 'sat', day: 'Saturday', focus: 'Rest / Light Cardio', type: 'Cardio', isRest: false },
    { id: 'sun', day: 'Sunday', focus: 'Rest Day', type: 'Rest', isRest: true },
  ],
  'Custom': [
    { id: 'mon', day: 'Monday', focus: 'Chest + Triceps', type: 'Strength', isRest: false },
    { id: 'tue', day: 'Tuesday', focus: 'Back + Biceps', type: 'Strength', isRest: false },
    { id: 'wed', day: 'Wednesday', focus: 'Rest', type: 'Rest', isRest: true },
    { id: 'thu', day: 'Thursday', focus: 'Legs', type: 'Strength', isRest: false },
    { id: 'fri', day: 'Friday', focus: 'Shoulders + Arms', type: 'Hypertrophy', isRest: false },
    { id: 'sat', day: 'Saturday', focus: 'Cardio', type: 'Cardio', isRest: false },
    { id: 'sun', day: 'Sunday', focus: 'Rest', type: 'Rest', isRest: true },
  ],
};

const WORKOUT_TYPES = ['Strength', 'Hypertrophy', 'Cardio', 'Mobility', 'Rest'];

export function WorkoutSplitManager({ splitType = 'Push / Pull / Legs', days = [], onChange }) {
  const [currentSplitType, setCurrentSplitType] = useState(splitType);
  const [scheduleDays, setScheduleDays] = useState(days && days.length > 0 ? days : SPLIT_PRESETS['Push / Pull / Legs']);

  const handleSelectSplitType = (type) => {
    setCurrentSplitType(type);
    const newDays = SPLIT_PRESETS[type] || SPLIT_PRESETS['Custom'];
    setScheduleDays(newDays);
    if (onChange) {
      onChange({ splitType: type, days: newDays });
    }
  };

  const handleUpdateDay = (index, field, value) => {
    const updated = scheduleDays.map((day, i) => {
      if (i !== index) return day;
      const updatedDay = { ...day, [field]: value };
      if (field === 'isRest' && value === true) {
        updatedDay.type = 'Rest';
        if (!updatedDay.focus || updatedDay.focus === 'Workout') updatedDay.focus = 'Rest & Recovery';
      }
      return updatedDay;
    });

    setScheduleDays(updated);
    if (onChange) {
      onChange({ splitType: currentSplitType, days: updated });
    }
  };

  const handleAddDay = () => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const nextDayName = dayNames[scheduleDays.length % 7] || `Day ${scheduleDays.length + 1}`;
    
    const newDay = {
      id: 'day-' + Date.now(),
      day: nextDayName,
      focus: 'Custom Training Focus',
      type: 'Strength',
      isRest: false,
    };

    const updated = [...scheduleDays, newDay];
    setScheduleDays(updated);
    if (onChange) {
      onChange({ splitType: 'Custom', days: updated });
    }
  };

  const handleRemoveDay = (index) => {
    const updated = scheduleDays.filter((_, i) => i !== index);
    setScheduleDays(updated);
    if (onChange) {
      onChange({ splitType: currentSplitType, days: updated });
    }
  };

  const typeBadges = {
    Strength: 'emerald',
    Hypertrophy: 'purple',
    Cardio: 'amber',
    Mobility: 'sky',
    Rest: 'slate',
  };

  return (
    <div className="space-y-4">
      {/* Split Selector Pills */}
      <div>
        <label className="text-xs font-bold text-surface-700 block mb-1.5">
          Select Training Split Template
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {Object.keys(SPLIT_PRESETS).map((preset) => {
            const isSelected = currentSplitType === preset;
            return (
              <button
                type="button"
                key={preset}
                onClick={() => handleSelectSplitType(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-primary text-white shadow-xs font-bold'
                    : 'bg-surface-50 hover:bg-surface-100 text-surface-700 border border-surface-200/60'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Days Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-surface-900 uppercase tracking-wider">
            Weekly Schedule Breakdown ({scheduleDays.length} Days)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddDay}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Day
          </Button>
        </div>

        <div className="space-y-2">
          {scheduleDays.map((dayItem, idx) => (
            <div
              key={dayItem.id || idx}
              className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                dayItem.isRest
                  ? 'bg-surface-50/70 border-surface-200/60 opacity-90'
                  : 'bg-white border-surface-200/90 shadow-2xs'
              }`}
            >
              {/* Day & Rest Toggle */}
              <div className="flex items-center gap-2.5 min-w-[140px]">
                <button
                  type="button"
                  onClick={() => handleUpdateDay(idx, 'isRest', !dayItem.isRest)}
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    dayItem.isRest
                      ? 'bg-surface-200 text-surface-600'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                  title={dayItem.isRest ? 'Mark as Workout Day' : 'Mark as Rest Day'}
                >
                  {dayItem.isRest ? <Moon className="w-3.5 h-3.5" /> : <Dumbbell className="w-3.5 h-3.5" />}
                </button>
                <div>
                  <input
                    type="text"
                    value={dayItem.day}
                    onChange={(e) => handleUpdateDay(idx, 'day', e.target.value)}
                    className="font-bold text-xs text-surface-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-24"
                  />
                  <span className="text-[10px] text-surface-400 block">
                    {dayItem.isRest ? 'Rest Day' : 'Training Day'}
                  </span>
                </div>
              </div>

              {/* Workout Focus Description */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={dayItem.focus}
                  onChange={(e) => handleUpdateDay(idx, 'focus', e.target.value)}
                  placeholder="e.g. Chest + Triceps"
                  className="w-full px-2.5 py-1.5 text-xs bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
                />
              </div>

              {/* Workout Type & Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={dayItem.type}
                  onChange={(e) => handleUpdateDay(idx, 'type', e.target.value)}
                  className="p-1.5 text-xs font-semibold bg-surface-50 border border-surface-200 rounded-xl focus:outline-none"
                  disabled={dayItem.isRest}
                >
                  {WORKOUT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleRemoveDay(idx)}
                  className="p-1.5 text-surface-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove Day"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
