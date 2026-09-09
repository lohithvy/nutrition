import React from 'react';
import { cn } from '../../utils/cn';

const badgeVariants = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
  blue: 'bg-sky-50 text-sky-700 border-sky-200/60',
  purple: 'bg-violet-50 text-violet-700 border-violet-200/60',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
  slate: 'bg-surface-100 text-surface-600 border-surface-200',
  dark: 'bg-surface-900 text-white border-surface-900',
  primary: 'bg-brand-primary text-white border-brand-primary',
};

const badgeDotColors = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  blue: 'bg-sky-500',
  purple: 'bg-violet-500',
  rose: 'bg-rose-500',
  slate: 'bg-surface-400',
  dark: 'bg-emerald-400',
  primary: 'bg-emerald-200',
};

const badgeSizes = {
  sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
  md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
  lg: 'text-sm px-3 py-1.2 gap-1.5 font-semibold',
};

export function Badge({
  children,
  variant = 'emerald',
  size = 'md',
  dot = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors select-none shrink-0',
        badgeVariants[variant] || badgeVariants.emerald,
        badgeSizes[size] || badgeSizes.md,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            badgeDotColors[variant] || 'bg-current'
          )}
        />
      )}
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </span>
  );
}
