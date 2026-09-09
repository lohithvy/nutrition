import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useNutrition } from '../../context/NutritionContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { getTodayKey, formatDateDisplay, shiftDateKey } from '../../utils/storage';

export function DatePickerModal() {
  const { isDatePickerOpen, closeDatePicker, showToast } = useUI();
  const { selectedDate, setSelectedDate } = useNutrition();

  // Parse current selected date to determine view month & year
  const initialYear = selectedDate ? parseInt(selectedDate.split('-')[0]) : new Date().getFullYear();
  const initialMonth = selectedDate ? parseInt(selectedDate.split('-')[1]) - 1 : new Date().getMonth();

  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);

  if (!isDatePickerOpen) return null;

  const todayKey = getTodayKey();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDateKey = (dateKey) => {
    setSelectedDate(dateKey);
    closeDatePicker();
    showToast(`Switched to ${formatDateDisplay(dateKey)}`);
  };

  const handleSelectPreset = (presetKey) => {
    let targetKey = todayKey;
    if (presetKey === 'yesterday') targetKey = shiftDateKey(todayKey, -1);
    if (presetKey === 'tomorrow') targetKey = shiftDateKey(todayKey, 1);

    const [y, m] = targetKey.split('-').map(Number);
    setViewYear(y);
    setViewMonth(m - 1);
    handleSelectDateKey(targetKey);
  };

  // Build calendar matrix
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysArray = [];
  // Empty padding for first row
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedD = String(d).padStart(2, '0');
    const formattedM = String(viewMonth + 1).padStart(2, '0');
    const dateKey = `${viewYear}-${formattedM}-${formattedD}`;
    daysArray.push({ dayNumber: d, dateKey });
  }

  return (
    <Modal
      isOpen={isDatePickerOpen}
      onClose={closeDatePicker}
      title="Select Date"
      description="View and log nutrition for any past, present, or future day."
      size="sm"
    >
      <div className="space-y-4">
        {/* Quick Presets */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-100 rounded-xl">
          <button
            onClick={() => handleSelectPreset('yesterday')}
            className="py-1.5 text-xs font-semibold rounded-lg text-surface-700 hover:bg-white transition-all cursor-pointer"
          >
            Yesterday
          </button>
          <button
            onClick={() => handleSelectPreset('today')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedDate === todayKey ? 'bg-brand-primary text-white shadow-2xs font-bold' : 'text-surface-700 hover:bg-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleSelectPreset('tomorrow')}
            className="py-1.5 text-xs font-semibold rounded-lg text-surface-700 hover:bg-white transition-all cursor-pointer"
          >
            Tomorrow
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-surface-900">
            {monthNames[viewMonth]} {viewYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-surface-50 p-2.5 rounded-2xl border border-surface-200/80">
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {dayLabels.map((lbl) => (
              <span key={lbl} className="text-[10px] font-bold text-surface-400 uppercase">
                {lbl}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysArray.map((item, idx) => {
              if (!item) {
                return <div key={`empty-${idx}`} className="h-8 w-8" />;
              }

              const isSelected = item.dateKey === selectedDate;
              const isToday = item.dateKey === todayKey;

              return (
                <button
                  key={item.dateKey}
                  onClick={() => handleSelectDateKey(item.dateKey)}
                  className={`h-8 w-8 mx-auto rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all relative cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary text-white shadow-xs font-bold scale-105'
                      : isToday
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold hover:bg-emerald-100'
                      : 'text-surface-700 hover:bg-white hover:shadow-2xs'
                  }`}
                >
                  <span>{item.dayNumber}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-500 absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Selection Summary */}
        <div className="flex items-center justify-between text-xs text-surface-500 px-1 pt-1 border-t border-surface-100">
          <span>Active Date:</span>
          <span className="font-bold text-surface-900">{formatDateDisplay(selectedDate)}</span>
        </div>
      </div>
    </Modal>
  );
}
