/**
 * NutriFlow Native Modal Dialog Component
 */

import React from 'react';
import {
  Modal as RNModal,
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
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: StyleProp<ViewStyle>;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  style,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.dialogContainer}
            >
              <View style={[styles.dialogCard, style]}>
                {/* Header */}
                {(title || description) && (
                  <View style={styles.header}>
                    <View style={styles.headerTitles}>
                      {title && <Text style={styles.title}>{title}</Text>}
                      {description && <Text style={styles.description}>{description}</Text>}
                    </View>
                    <TouchableOpacity
                      onPress={onClose}
                      style={styles.closeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <X size={20} color={colors.surface[500]} />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Content */}
                <ScrollView
                  style={styles.contentScroll}
                  contentContainerStyle={styles.contentBody}
                  keyboardShouldPersistTaps="handled"
                >
                  {children}
                </ScrollView>

                {/* Footer */}
                {footer && <View style={styles.footer}>{footer}</View>}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialogContainer: {
    width: '100%',
    maxWidth: 440,
  },
  dialogCard: {
    backgroundColor: colors.surface.white,
    borderRadius: radii['2xl'],
    maxHeight: '85%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface[200],
    ...shadows.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface[100],
  },
  headerTitles: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.surface[900],
  },
  description: {
    fontSize: typography.size.xs,
    color: colors.surface[500],
    marginTop: 3,
    lineHeight: 16,
  },
  closeButton: {
    padding: 4,
    borderRadius: radii.md,
    backgroundColor: colors.surface[100],
  },
  contentScroll: {
    maxHeight: 480,
  },
  contentBody: {
    padding: spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surface[100],
    backgroundColor: colors.surface[50],
  },
});
