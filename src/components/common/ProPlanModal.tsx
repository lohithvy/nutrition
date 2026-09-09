/**
 * NutriFlow ProPlanModal Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown, Check } from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

import { useUI } from '../../context/UIContext';

interface ProPlanModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onUpgrade?: () => void;
}

const proFeatures = [
  { title: 'NutriPure AI Assistant', desc: 'Real-time metabolic rate pacing and instant meal formulation' },
  { title: 'Biomarker & Micronutrient Tracking', desc: 'Detailed tracking for vitamins, magnesium, zinc, and electrolytes' },
  { title: 'Smart Barcode & Food Camera Scanner', desc: 'Instant AI computer vision food recognition and auto macro estimation' },
  { title: 'Automated Smart Grocery Sync', desc: 'Consolidated one-click shopping lists exported from weekly plans' },
];

export function ProPlanModal(props: ProPlanModalProps) {
  const ui = useUI();
  const isOpen = props.isOpen !== undefined ? props.isOpen : ui.isProModalOpen;
  const onClose = props.onClose || ui.closeProModal;
  const onUpgrade = props.onUpgrade || (() => { ui.showToast('Upgraded to NutriFlow Pro! 👑', 'success'); ui.closeProModal(); });
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="NutriFlow Pro"
      description="Unlock precision metabolic nutrition, AI coaching, and deep biomarker tracking."
      footer={
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceText}>$12.99<Text style={styles.priceSub}> / mo</Text></Text>
          </View>
          <View style={styles.actionBtns}>
            <Button variant="outline" size="sm" onPress={onClose}>
              Later
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={() => {
                onUpgrade();
                onClose();
              }}
              leftIcon={<Crown size={14} color="#FFF" />}
            >
              Activate Pro
            </Button>
          </View>
        </View>
      }
    >
      <View style={styles.container}>
        {/* Tier Card */}
        <View style={styles.tierCard}>
          <View style={styles.crownWrapper}>
            <Crown size={20} color="#FFF" />
          </View>
          <View style={styles.tierInfo}>
            <View style={styles.tierRow}>
              <Text style={styles.tierTitle}>NutriFlow Pro Plus</Text>
              <Badge variant="amber" size="sm">
                Active Tier
              </Badge>
            </View>
            <Text style={styles.tierDesc}>
              Unlimited AI queries, camera scan, and macro auto-tuning
            </Text>
          </View>
        </View>

        {/* Features list */}
        <View style={styles.featuresList}>
          {proFeatures.map((feat, idx) => (
            <View key={idx} style={styles.featureItem}>
              <View style={styles.checkWrapper}>
                <Check size={12} color={colors.brand.primary} />
              </View>
              <View style={styles.featTextCol}>
                <Text style={styles.featTitle}>{feat.title}</Text>
                <Text style={styles.featDesc}>{feat.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.xl,
    backgroundColor: colors.status.warningBg,
    borderWidth: 1,
    borderColor: colors.status.warningBorder,
  },
  crownWrapper: {
    width: 38,
    height: 38,
    borderRadius: radii.lg,
    backgroundColor: colors.nutri.carbs,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tierInfo: {
    flex: 1,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierTitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  tierDesc: {
    fontSize: typography.size['2xs'],
    color: colors.surface[600],
    marginTop: 2,
  },
  featuresList: {
    gap: spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: colors.surface[50],
    borderWidth: 1,
    borderColor: colors.surface[150],
  },
  checkWrapper: {
    width: 20,
    height: 20,
    borderRadius: radii.full,
    backgroundColor: colors.brand.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  featTextCol: {
    flex: 1,
  },
  featTitle: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  featDesc: {
    fontSize: typography.size['2xs'],
    color: colors.surface[500],
    marginTop: 1,
    lineHeight: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  priceText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.extrabold,
    color: colors.surface[900],
  },
  priceSub: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    fontWeight: typography.weight.regular,
  },
  actionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
