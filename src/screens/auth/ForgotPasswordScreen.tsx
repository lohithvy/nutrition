import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUI } from '../../context/UIContext';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Mail,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react-native';

import { authService } from '../../services/auth/authService';

export function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { showToast } = useUI();

  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authService.resetPasswordForEmail(email.trim());
      if (error) {
        showToast(error.message || 'Failed to send reset link', 'error');
      } else {
        setIsSent(true);
        showToast('Password reset link sent to your inbox! 📧', 'success');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to send reset link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={22} color={colors.surface[700]} />
        </TouchableOpacity>

        <Card style={styles.card}>
          {isSent ? (
            <View style={styles.sentContainer}>
              <View style={styles.checkCircle}>
                <CheckCircle2 size={32} color={colors.brand.primary} />
              </View>
              <Text style={styles.cardHeading}>Check Your Inbox</Text>
              <Text style={styles.cardSub}>
                We've sent a secure reset link to <Text style={styles.boldEmail}>{email}</Text>. Follow the link to choose a new password.
              </Text>
              <Button
                variant="primary"
                size="md"
                onPress={() => navigation.goBack()}
                style={{ width: '100%', marginTop: spacing[3] }}
              >
                Back to Sign In
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.cardHeading}>Reset Password</Text>
              <Text style={styles.cardSub}>
                Enter the email address associated with your NutriFlow account to receive recovery instructions.
              </Text>

              <View style={styles.form}>
                <Input
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={<Mail size={16} color={colors.surface[400]} />}
                />

                <Button
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  leftIcon={<ArrowRight size={16} color={colors.white} />}
                  onPress={handleReset}
                  style={styles.submitBtn}
                >
                  Send Reset Link
                </Button>
              </View>
            </>
          )}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[50],
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: spacing[2],
  },
  scrollContent: {
    padding: spacing[5],
    justifyContent: 'center',
    minHeight: '100%',
    gap: spacing[4],
  },
  card: {
    padding: spacing[5],
    backgroundColor: colors.white,
    gap: spacing[3],
  },
  cardHeading: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  cardSub: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.normal,
    color: colors.surface[500],
    lineHeight: 18,
  },
  form: {
    gap: spacing[3.5],
    marginTop: spacing[2],
  },
  submitBtn: {
    width: '100%',
    marginTop: spacing[2],
  },
  sentContainer: {
    alignItems: 'center',
    gap: spacing[2.5],
    paddingVertical: spacing[3],
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.emerald[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldEmail: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
});
