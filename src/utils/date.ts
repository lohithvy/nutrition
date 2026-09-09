/**
 * Date Utility Functions for NutriFlow
 */

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateKey: string): string {
  if (!dateKey) return '';
  const [year, month, day] = dateKey.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  const todayKey = getTodayKey();
  const isToday = dateKey === todayKey;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  const isYesterday = dateKey === yKey;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tKey = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  const isTomorrow = dateKey === tKey;

  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
  
  if (isToday) return `Today, ${weekday} ${monthName} ${day}`;
  if (isYesterday) return `Yesterday, ${weekday} ${monthName} ${day}`;
  if (isTomorrow) return `Tomorrow, ${weekday} ${monthName} ${day}`;

  return `${weekday}, ${monthName} ${day}`;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  dateObj.setDate(dateObj.getDate() + deltaDays);
  const nextYear = dateObj.getFullYear();
  const nextMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
  const nextDay = String(dateObj.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}
