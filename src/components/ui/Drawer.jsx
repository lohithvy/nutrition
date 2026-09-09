import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

const drawerWidths = {
  sm: 'max-w-xs',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  position = 'right',
  width = 'md',
  className,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionClasses = {
    right: 'inset-y-0 right-0 animate-slide-in-right',
    left: 'inset-y-0 left-0 animate-slide-in-left',
    bottom: 'inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl animate-slide-up',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed bg-white shadow-2xl z-10 flex flex-col w-full h-full border-l border-surface-200/90',
          positionClasses[position] || positionClasses.right,
          position !== 'bottom' && (drawerWidths[width] || drawerWidths.md),
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-100 shrink-0">
          <div className="min-w-0 pr-4">
            {title && <h2 className="text-base font-bold text-surface-900 tracking-tight truncate">{title}</h2>}
            {subtitle && <p className="text-xs text-surface-500 truncate mt-0.5">{subtitle}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close panel"
            className="text-surface-400 hover:text-surface-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 border-t border-surface-100 bg-surface-50/60 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
