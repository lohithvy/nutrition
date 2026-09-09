import React from 'react';
import { cn } from '../../utils/cn';
import { Sparkles } from 'lucide-react';

export function EmptyState({
  icon,
  title = "No data yet",
  description = "Get started by adding your first item or exploring recommendations.",
  action,
  secondaryAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-surface-200/80 shadow-subtle',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-primary flex items-center justify-center mb-4 shadow-subtle border border-emerald-100/80">
        {icon || <Sparkles className="w-7 h-7 text-emerald-600" />}
      </div>
      <h3 className="text-lg font-bold text-surface-900 tracking-tight mb-1.5">{title}</h3>
      <p className="text-xs sm:text-sm text-surface-500 max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
