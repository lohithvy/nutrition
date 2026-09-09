import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { User, Mail, Lock, UserPlus, Sparkles } from 'lucide-react';

export function SignupModal() {
  const { isSignupOpen, closeSignup, openLogin, signup } = useAuth();
  const { showToast } = useUI();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isSignupOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name', 'warning');
      return;
    }
    if (!email.trim()) {
      showToast('Please enter your email', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signup({ name, email, password });
      setIsLoading(false);
      showToast(`Account created for ${name}! Welcome to NutriFlow 🥗`);
    }, 400);
  };

  return (
    <Modal
      isOpen={isSignupOpen}
      onClose={closeSignup}
      title="Create Your NutriFlow Account"
      description="Start tailoring your metabolic pacing, macro targets, and nutrition."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mock note */}
        <div className="p-3 rounded-2xl bg-surface-50 border border-surface-200/80 flex items-center gap-2.5 text-xs text-surface-600">
          <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
          <span>Frontend Mock Signup: Stores your profile locally for this browser.</span>
        </div>

        <div>
          <label className="text-xs font-bold text-surface-700 block mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              required
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-surface-700 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-surface-700 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-surface-700 block mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={isLoading}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="text-center text-xs text-surface-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={openLogin}
              className="font-bold text-brand-primary hover:underline cursor-pointer ml-1"
            >
              Log In
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
