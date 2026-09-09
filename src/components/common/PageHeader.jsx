import React from 'react';
import { cn } from '../../utils/cn';

export function PageHeader({
  title,
  emoji,
  badge,
  subtitle,
  alertBanner,
  actions,
  children,
  className,
}) {
  return (
    <header className={cn('flex flex-col gap-4 mb-6 sm:mb-8', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title & Badge */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 tracking-tight flex items-center gap-2">
              <span>{title}</span>
              {emoji && <span className="inline-block hover:scale-110 transition-transform select-none">{emoji}</span>}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-surface-500 mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Buttons Slot */}
        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Optional Alert or AI Coach Banner */}
      {alertBanner && (
        <div className="animate-fade-in">
          {alertBanner}
        </div>
      )}

      {/* Children / Sub-header elements */}
      {children}
    </header>
  );
}
