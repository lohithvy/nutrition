/**
 * NutriFlow Native BottomSheet / Slide-Up Panel Component
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors, radii, spacing, typography, shadows } from '../../constants/theme';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxHeightPercent?: number;
  heightPercent?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  hideHeader?: boolean;
  headerRight?: React.ReactNode;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeightPercent = 90,
  heightPercent,
  style,
  contentStyle,
  scrollable = true,
  hideHeader = false,
  headerRight,
}: BottomSheetProps) {
  if (!isOpen) return null;

  const cardHeightStyle: any = Platform.OS === 'web'
    ? {
        height: heightPercent ? `${heightPercent}vh` : undefined,
        maxHeight: `${heightPercent || maxHeightPercent}vh`,
      }
    : {
        height: heightPercent ? `${heightPercent}%` : undefined,
        maxHeight: `${maxHeightPercent}%`,
      };


  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.sheetWrapper}
            >
              <View style={[styles.sheetCard, cardHeightStyle, style]}>
                {/* Drag Handle indicator */}
                <View style={styles.handleContainer}>
                  <View style={styles.handleBar} />
                </View>

                {/* Header */}
                {!hideHeader && (title || subtitle) && (
                  <View style={styles.header}>
                    <View style={styles.headerTitles}>
                      {title && <Text style={styles.title}>{title}</Text>}
                      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                    <View style={styles.headerRightBox}>
                      {headerRight}
                      <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <X size={18} color={colors.surface[500]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Body */}
                {scrollable ? (
                  <ScrollView
                    style={styles.bodyScroll}
                    contentContainerStyle={[styles.bodyContent, contentStyle]}
                    keyboardShouldPersistTaps="handled"
                  >
                    {children}
                  </ScrollView>
                ) : (
                  <View style={[styles.bodyNonScroll, contentStyle]}>
                    {children}
                  </View>
                )}

                {/* Footer */}
                {footer && <View style={styles.footer}>{footer}</View>}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  sheetWrapper: {
    width: '100%',
    maxWidth: 680,
    height: '100%',
    maxHeight: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  sheetCard: {
    width: '100%',
    backgroundColor: colors.surface.white,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    overflow: 'hidden',
    borderTopWidth: 1,
    borderColor: colors.surface[200],
    display: 'flex',
    flexDirection: 'column',
    ...shadows.modal,
  },

  handleContainer: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    flexShrink: 0,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.surface[300],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
    flexShrink: 0,
  },
  headerTitles: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: radii.full,
    backgroundColor: colors.surface[100],
  },
  headerRightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bodyScroll: {
    flex: 1,
    minHeight: 0,
  },
  bodyContent: {
    padding: spacing.xl,
  },
  bodyNonScroll: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    flexShrink: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surface[100],
    backgroundColor: colors.surface[50],
  },
});

