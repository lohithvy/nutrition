import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-surface-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-white rounded-3xl shadow-modal border border-surface-200/90 z-10 animate-slide-up overflow-hidden',
          modalSizes[size] || modalSizes.md,
          className
        )}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-surface-100">
            <div>
              {title && <h2 className="text-lg font-bold text-surface-900 tracking-tight">{title}</h2>}
              {description && <p className="text-xs text-surface-500 mt-1">{description}</p>}
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label="Close dialog"
                className="text-surface-400 hover:text-surface-700 -mr-2 -mt-2"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 max-h-[calc(85vh-160px)] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 border-t border-surface-100 bg-surface-50/50 rounded-b-3xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
