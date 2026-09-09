import React from 'react';
import { cn } from '../../utils/cn';

export function Card({
  children,
  variant = 'default',
  hover = false,
  className,
  ...props
}) {
  const variants = {
    default: 'bg-white border border-surface-200/80 shadow-card',
    flat: 'bg-white border border-surface-200',
    subtle: 'bg-surface-50/80 border border-surface-200/90 shadow-subtle',
    emerald: 'bg-emerald-50/40 border border-emerald-100/90 shadow-subtle',
    glass: 'bg-white/80 backdrop-blur-md border border-white/60 shadow-card',
  };

  return (
    <div
      className={cn(
        'rounded-2xl text-surface-900 transition-all duration-200 relative overflow-hidden',
        variants[variant] || variants.default,
        hover && 'hover:shadow-card-hover hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  title,
  subtitle,
  action,
  badge,
  icon,
  ...props
}) {
  return (
    <div
      className={cn('flex items-center justify-between p-5 pb-3 gap-3', className)}
      {...props}
    >
      {title || subtitle || icon ? (
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100/60">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {title && <h3 className="text-base font-bold text-surface-900 truncate tracking-tight">{title}</h3>}
              {badge}
            </div>
            {subtitle && <p className="text-xs text-surface-500 truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>
      ) : null}
      {children}
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn('text-base font-bold text-surface-900 tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p
      className={cn('text-xs text-surface-500 mt-0.5', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('p-5 pt-2', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-between p-5 pt-3 border-t border-surface-100 bg-surface-50/40 text-xs text-surface-500 rounded-b-2xl', className)}
      {...props}
    >
      {children}
    </div>
  );
}
