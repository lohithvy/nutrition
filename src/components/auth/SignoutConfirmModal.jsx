import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { LogOut, AlertCircle } from 'lucide-react';

export function SignoutConfirmModal() {
  const { isSignoutOpen, closeSignout, logout, user } = useAuth();
  const { showToast } = useUI();

  if (!isSignoutOpen) return null;

  const handleConfirmSignout = () => {
    logout();
    showToast('Signed out successfully (Mock Auth) 👋', 'info');
  };

  return (
    <Modal
      isOpen={isSignoutOpen}
      onClose={closeSignout}
      title="Sign Out of NutriFlow"
      description={`Are you sure you want to sign out of ${user.name}?`}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={closeSignout}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirmSignout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-rose-800">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Mock Authentication Session</span>
          <p className="text-rose-700/90 leading-relaxed">
            Signing out switches the application to the mock logged-out state. Your custom data remains securely in local storage.
          </p>
        </div>
      </div>
    </Modal>
  );
}
