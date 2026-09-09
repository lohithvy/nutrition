import React from 'react';
import { Crown, Check, Sparkles, Zap, Shield, HeartPulse } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function ProPlanModal() {
  const { isProModalOpen, closeProModal, showToast } = useUI();

  const handleUpgrade = () => {
    closeProModal();
    showToast('Pro membership confirmed & active! 👑');
  };

  const proFeatures = [
    { title: 'NutriPure AI 2.4 Assistant', desc: 'Real-time metabolic rate pacing and instant meal formulation' },
    { title: 'Biomarker & Micronutrient Tracking', desc: 'Detailed tracking for vitamins, magnesium, zinc, and electrolytes' },
    { title: 'Smart Barcode & Food Camera Scanner', desc: 'Instant AI computer vision food recognition and auto macro estimation' },
    { title: 'Automated Smart Grocery Sync', desc: 'Consolidated one-click shopping lists exported from weekly plans' },
  ];

  return (
    <Modal
      isOpen={isProModalOpen}
      onClose={closeProModal}
      title="NutriFlow Pro Experience"
      description="Unlock precision metabolic nutrition, AI coaching, and deep biomarker tracking."
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-lg font-extrabold text-surface-900">$12.99</span>
            <span className="text-xs text-surface-500"> / month</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={closeProModal}>
              Maybe Later
            </Button>
            <Button variant="primary" size="sm" onClick={handleUpgrade} leftIcon={<Crown className="w-4 h-4" />}>
              Activate Pro Plan
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tier Highlight Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Crown className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-950">NutriFlow Pro Plus</span>
                <Badge variant="amber" size="sm">Current Plan</Badge>
              </div>
              <p className="text-xs text-amber-800/80">Unlimited AI queries, camera scan, and macro auto-tuning</p>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5">
          {proFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-50 border border-surface-200/70">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <span className="text-xs font-bold text-surface-900 block">{feat.title}</span>
                <span className="text-[11px] text-surface-500 block leading-tight">{feat.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
