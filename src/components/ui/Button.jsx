import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = {
  primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-xs active:scale-[0.98]',
  secondary: 'bg-surface-100 hover:bg-surface-200 text-surface-700 active:scale-[0.98]',
  outline: 'border border-surface-200 bg-white hover:bg-surface-50 text-surface-700 shadow-2xs active:scale-[0.98]',
  ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100/80 active:scale-[0.98]',
  accent: 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs active:scale-[0.98]',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-[0.98]',
  dark: 'bg-surface-900 hover:bg-surface-800 text-white active:scale-[0.98]',
  subtle: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100/80 active:scale-[0.98]',
};

const buttonSizes = {
  xs: 'text-xs px-2.5 py-1 rounded-lg gap-1 font-medium',
  sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5 font-medium',
  md: 'text-sm px-4 py-2 rounded-xl gap-2 font-medium',
  lg: 'text-base px-5 py-2.5 rounded-2xl gap-2.5 font-semibold',
  'icon-xs': 'p-1 rounded-lg',
  'icon-sm': 'p-1.5 rounded-xl',
  'icon-md': 'p-2 rounded-xl',
  'icon-lg': 'p-2.5 rounded-2xl',
};

export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-1',
        buttonVariants[variant] || buttonVariants.primary,
        buttonSizes[size] || buttonSizes.md,
        isDisabled && 'opacity-60 cursor-not-allowed active:scale-100 hover:bg-inherit pointer-events-none',
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
