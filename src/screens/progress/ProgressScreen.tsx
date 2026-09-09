/**
 * NutriFlow ProgressScreen
 * Body composition trends, weight curve visualization, metabolic biomarker insights
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TrendingUp,
  Plus,
  Zap,
  Shield,
  Download,
  Flame,
  Activity,
  Check,
} from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

export function ProgressScreen() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useUI();

  const [timeframe, setTimeframe] = useState<'7 Days' | '30 Days' | '90 Days'>('7 Days');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [newWeight, setNewWeight] = useState(String(user.body?.currentWeight || 68.4));
  const [newBodyFat, setNewBodyFat] = useState(String(user.body?.bodyFatPercentage || 18.5));

  const handleSaveWeight = () => {
    updateProfile({
      body: {
        ...user.body,
        currentWeight: Number(newWeight) || user.body.currentWeight,
        bodyFatPercentage: Number(newBodyFat) || user.body.bodyFatPercentage,
      },
    });
    setIsLogModalOpen(false);
    showToast(`Logged weight: ${newWeight} kg! 📊`);
  };

  const timeframes: ('7 Days' | '30 Days' | '90 Days')[] = ['7 Days', '30 Days', '90 Days'];

  // 7-day data points for clean native bar/point visualization
  const weightDataPoints = [
    { day: 'Mon', weight: 69.2 },
    { day: 'Tue', weight: 69.0 },
    { day: 'Wed', weight: 68.8 },
    { day: 'Thu', weight: 68.7 },
    { day: 'Fri', weight: 68.5 },
    { day: 'Sat', weight: 68.6 },
    { day: 'Sun', weight: Number(newWeight) || 68.4 },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Progress & Biomarkers"
          emoji="📈"
          subtitle="Body composition, lean mass tracking, and weekly metabolic insights."
          badge={<Badge variant="emerald">{user.body.currentWeight} kg (-1.8 kg)</Badge>}
          actions={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} color="#FFF" />}
              onPress={() => setIsLogModalOpen(true)}
            >
              Log Weight
            </Button>
          }
        />

        {/* Timeframe switcher */}
        <View style={styles.timeframeBar}>
          {timeframes.map((tf) => {
            const isSelected = timeframe === tf;
            return (
              <TouchableOpacity
                key={tf}
                onPress={() => setTimeframe(tf)}
                style={[styles.tfButton, isSelected && styles.tfButtonActive]}
              >
                <Text style={[styles.tfText, isSelected && styles.tfTextActive]}>{tf}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Weight Trajectory Chart Card */}
        <Card>
          <CardHeader
            title="Weight Trajectory"
            subtitle={`Showing trend for ${timeframe}`}
            badge={<Badge variant="emerald">-1.8 kg this month</Badge>}
          />
          <CardContent>
            {/* Visual Bar Chart for native reliability */}
            <View style={styles.chartContainer}>
              <View style={styles.barsRow}>
                {weightDataPoints.map((item, idx) => {
                  const minW = 68.0;
                  const maxW = 69.5;
                  const heightPercent = Math.max(15, Math.min(100, ((item.weight - minW) / (maxW - minW)) * 100));
                  const isLast = idx === weightDataPoints.length - 1;

                  return (
                    <View key={item.day} style={styles.barColumn}>
                      <Text style={styles.barWeightText}>{item.weight}</Text>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            { height: `${heightPercent}%` as any },
                            isLast && styles.barFillActive,
                          ]}
                        />
                      </View>
                      <Text style={[styles.barDayText, isLast && styles.barDayTextActive]}>
                        {item.day}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </CardContent>
          <CardFooter>
            <Text style={styles.footerSubText}>Goal: {user.body.goalWeight} kg ({user.goals.targetTimeframe})</Text>
            <Button variant="ghost" size="xs" onPress={() => setIsExportModalOpen(true)}>
              Export Report
            </Button>
          </CardFooter>
        </Card>

        {/* Biomarker Metric Cards */}
        <Card>
          <CardHeader
            title="Metabolic Energy Alignment"
            subtitle="Basal rate vs total intake"
            icon={<Zap size={18} color={colors.brand.primary} />}
            badge={<Badge variant="emerald">+4.2%</Badge>}
          />
          <CardContent>
            <Text style={styles.metricBigText}>94% Optimal</Text>
            <Text style={styles.metricDesc}>
              Carbohydrate and lipid oxidation pacing matches your training intensity perfectly.
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Glycemic Index Stability"
            subtitle="Post-prandial balance"
            icon={<TrendingUp size={18} color={colors.nutri.carbs} />}
            badge={<Badge variant="amber">Steady</Badge>}
          />
          <CardContent>
            <Text style={styles.metricBigText}>91/100 Score</Text>
            <Text style={styles.metricDesc}>
              Fiber intake moderated glucose excursions across daily logged meals.
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Micronutrient Completeness"
            subtitle="Essential minerals & vitamins"
            icon={<Shield size={18} color={colors.status.purple} />}
            badge={<Badge variant="purple">96% Met</Badge>}
          />
          <CardContent>
            <Text style={styles.metricBigText}>22 of 24 Reached</Text>
            <Text style={styles.metricDesc}>
              Magnesium, Vitamin D3, and Zinc goals met with zero deficiencies noted.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>

      {/* Log Weight Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Weight & Composition"
        description="Update your current weight and body composition readings."
        footer={
          <View style={styles.modalFooterRow}>
            <Button variant="outline" size="sm" onPress={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={handleSaveWeight}
              leftIcon={<Check size={14} color="#FFF" />}
            >
              Save Reading
            </Button>
          </View>
        }
      >
        <View style={styles.modalForm}>
          <Input
            label="Current Weight (kg)"
            value={newWeight}
            onChangeText={setNewWeight}
            keyboardType="numeric"
          />
          <Input
            label="Body Fat Percentage (%)"
            value={newBodyFat}
            onChangeText={setNewBodyFat}
            keyboardType="numeric"
          />
        </View>
      </Modal>

      {/* Export Report Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Wellness Report"
        description="Generate a high-resolution summary of your weekly macros and biomarker index."
        footer={
          <Button
            variant="primary"
            size="sm"
            onPress={() => {
              setIsExportModalOpen(false);
              showToast('Weekly Report exported as PDF! 📊');
            }}
            leftIcon={<Download size={14} color="#FFF" />}
          >
            Download PDF
          </Button>
        }
      >
        <Text style={styles.modalBodyText}>
          Your report will include 7-day average macro distributions, adherence score, and body composition trajectory.
        </Text>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 32,
  },
  timeframeBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface.white,
    borderRadius: radii.lg,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.surface[200],
    marginBottom: spacing.md,
  },
  tfButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  tfButtonActive: {
    backgroundColor: colors.brand.primary,
  },
  tfText: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.surface[600],
  },
  tfTextActive: {
    color: colors.surface.white,
    fontWeight: typography.weight.bold,
  },
  chartContainer: {
    paddingVertical: spacing.sm,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingHorizontal: 4,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barWeightText: {
    fontSize: typography.size['2xs'],
    color: colors.surface[400],
    marginBottom: 4,
  },
  barTrack: {
    width: 24,
    height: 90,
    backgroundColor: colors.surface[100],
    borderRadius: radii.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: colors.brand[300],
    borderRadius: radii.sm,
  },
  barFillActive: {
    backgroundColor: colors.brand.primary,
  },
  barDayText: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
    marginTop: 6,
    fontWeight: typography.weight.medium,
  },
  barDayTextActive: {
    color: colors.brand.primary,
    fontWeight: typography.weight.bold,
  },
  footerSubText: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
  },
  metricBigText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
  },
  metricDesc: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    marginTop: 4,
    lineHeight: 16,
  },
  modalFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  modalForm: {
    gap: spacing.sm,
  },
  modalBodyText: {
    fontSize: typography.size.xs,
    color: colors.surface[600],
    lineHeight: 18,
  },
});
