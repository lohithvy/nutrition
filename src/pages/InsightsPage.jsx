import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useUI } from '../context/UIContext';
import { Sparkles, Download, TrendingUp, Zap, Shield, FileText, Check } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function InsightsPage() {
  const { showToast } = useUI();
  const [timeframe, setTimeframe] = useState('7 Days');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const chartData = [
    { day: 'Mon', weight: 69.2, calories: 2150, score: 80 },
    { day: 'Tue', weight: 69.0, calories: 2080, score: 82 },
    { day: 'Wed', weight: 68.8, calories: 2120, score: 84 },
    { day: 'Thu', weight: 68.7, calories: 1980, score: 83 },
    { day: 'Fri', weight: 68.5, calories: 2240, score: 86 },
    { day: 'Sat', weight: 68.6, calories: 2100, score: 85 },
    { day: 'Sun', weight: 68.4, calories: 1420, score: 88 },
  ];

  const handleExport = () => {
    setIsExportModalOpen(false);
    showToast(`Weekly Nutrition Report exported as .${exportFormat.toUpperCase()}! 📊`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weekly Nutrition & Wellness Insights"
        emoji="📈"
        subtitle="Comprehensive breakdown based on your active metabolic rate, real-time nutrient balance, and recovery targets."
        badge={<Badge variant="purple" dot>AI Analysis Active</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() => setIsExportModalOpen(true)}
            >
              Export Report
            </Button>
            <div className="flex items-center rounded-xl bg-surface-100 p-0.5 border border-surface-200">
              {['7 Days', '30 Days', '90 Days'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-brand-primary text-white shadow-2xs'
                      : 'text-surface-600 hover:text-surface-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* 3 Metric Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card hover>
          <CardHeader
            title="Metabolic Energy Alignment"
            subtitle="Basal rate vs total intake"
            icon={<Zap className="w-4 h-4 text-emerald-600" />}
            badge={<Badge variant="emerald">+4.2%</Badge>}
          />
          <CardContent>
            <span className="text-2xl font-extrabold text-surface-900">94% Optimal</span>
            <p className="text-xs text-surface-500 mt-1 leading-relaxed">
              Carbohydrate and lipid oxidation pacing matches your training intensity perfectly.
            </p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader
            title="Glycemic Index Stability"
            subtitle="Post-prandial balance"
            icon={<TrendingUp className="w-4 h-4 text-amber-600" />}
            badge={<Badge variant="amber">Steady</Badge>}
          />
          <CardContent>
            <span className="text-2xl font-extrabold text-surface-900">91/100 Score</span>
            <p className="text-xs text-surface-500 mt-1 leading-relaxed">
              Fiber intake moderated glucose excursions across all 4 daily meals.
            </p>
          </CardContent>
        </Card>

        <Card hover>
          <CardHeader
            title="Micronutrient Completeness"
            subtitle="Essential minerals & vitamins"
            icon={<Shield className="w-4 h-4 text-purple-600" />}
            badge={<Badge variant="purple">96% Met</Badge>}
          />
          <CardContent>
            <span className="text-2xl font-extrabold text-surface-900">22 of 24 Reached</span>
            <p className="text-xs text-surface-500 mt-1 leading-relaxed">
              Magnesium, Vitamin D3, and Zinc goals met with zero deficiencies noted.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Trend Chart Card */}
      <Card hover>
        <CardHeader
          title="Body Composition & Weight Trajectory"
          subtitle={`Showing data for ${timeframe}`}
          badge={<Badge variant="emerald">-1.8 kg this month</Badge>}
        />
        <CardContent>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[67, 70]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#weightGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Export Report Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Wellness & Nutrition Report"
        description="Generate a high-resolution report summarizing your daily macros and biomarker index."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleExport} leftIcon={<Download className="w-4 h-4" />}>
              Download Report
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="text-xs font-bold text-surface-700 block">Select Format</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setExportFormat('pdf')}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                exportFormat === 'pdf'
                  ? 'bg-emerald-50 border-brand-primary text-brand-primary font-bold'
                  : 'bg-surface-50 border-surface-200 text-surface-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-xs">PDF Document (.pdf)</span>
            </button>
            <button
              onClick={() => setExportFormat('csv')}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                exportFormat === 'csv'
                  ? 'bg-emerald-50 border-brand-primary text-brand-primary font-bold'
                  : 'bg-surface-50 border-surface-200 text-surface-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-xs">Raw CSV Data (.csv)</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
