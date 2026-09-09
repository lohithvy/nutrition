import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { Mail, Lock, LogIn, Sparkles, Check } from 'lucide-react';

export function LoginModal() {
  const { isLoginOpen, closeLogin, openSignup, login } = useAuth();
  const { showToast } = useUI();

  const [email, setEmail] = useState('elena.vance@example.com');
  const [password, setPassword] = useState('••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, password, rememberMe);
      setIsLoading(false);
      showToast(`Welcome back, ${email.split('@')[0]}! ✨`);
    }, 400);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast(`Password reset link sent to ${email || 'your email'} (Mock) 📧`, 'info');
  };

  return (
    <Modal
      isOpen={isLoginOpen}
      onClose={closeLogin}
      title="Welcome Back to NutriFlow"
      description="Sign in to sync your active metabolic pacing, meals, and targets."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mock auth note */}
        <div className="p-3 rounded-2xl bg-surface-50 border border-surface-200/80 flex items-center gap-2.5 text-xs text-surface-600">
          <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
          <span>Frontend Mock Auth: Use any sample email or password to test.</span>
        </div>

        <div>
          <label className="text-xs font-bold text-surface-700 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-surface-700">Password</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[11px] font-semibold text-brand-primary hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-50 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-surface-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-brand-primary"
            />
            <span>Remember me</span>
          </label>
        </div>

        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={isLoading}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            {isLoading ? 'Signing In...' : 'Sign In to NutriFlow'}
          </Button>

          <div className="text-center text-xs text-surface-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={openSignup}
              className="font-bold text-brand-primary hover:underline cursor-pointer ml-1"
            >
              Create Account
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
