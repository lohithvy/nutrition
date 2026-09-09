import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TrendingUp, Plus } from 'lucide-react';

export function ProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Body Composition & Biomarkers"
        subtitle="Historical weight tracking, lean body mass, body fat percentage, and metabolic trends."
        badge={<Badge variant="emerald">68.4 kg (-1.8 kg)</Badge>}
        actions={
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Log Weight
          </Button>
        }
      />

      <EmptyState
        icon={<TrendingUp className="w-7 h-7 text-emerald-600" />}
        title="Progress & Trends View Connected"
        description="Layout and routing established for body composition charts and health biomarker timeline."
      />
    </div>
  );
}
