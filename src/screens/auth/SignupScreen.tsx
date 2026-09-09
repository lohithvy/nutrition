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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { colors, spacing, radii, typography, shadows } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export function SignupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signup } = useAuth();
  const { showToast } = useUI();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      showToast('Please fill out all fields', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signup(email.trim(), password, name.trim());
      if (res.success) {
        if (res.error === 'CONFIRM_EMAIL_REQUIRED') {
          showToast('Account created! Please check your email to verify before signing in 📧', 'info');
          setTimeout(() => {
            navigation.navigate('Login');
          }, 1500);
        } else {
          showToast('Account created! Let us personalize your targets 🥑', 'success');
        }
      } else {
        showToast(res.error || 'Signup error. Please try again.', 'error');
      }
    } catch (e: any) {
      showToast(e?.message || 'Signup error. Please try again.', 'error');
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

        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🥑</Text>
          </View>
          <Text style={styles.brandTitle}>Join NutriFlow</Text>
          <Text style={styles.brandTagline}>Your personal metabolic nutritionist</Text>
        </View>

        {/* Signup Card */}
        <Card style={styles.authCard}>
          <Text style={styles.cardHeading}>Create Your Account</Text>
          <Text style={styles.cardSub}>
            Start calculating precise metabolic expenditure and macro pacing.
          </Text>

          <View style={styles.form}>
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Elena Vance"
              autoCapitalize="words"
              leftIcon={<User size={16} color={colors.surface[400]} />}
            />

            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="elena@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={16} color={colors.surface[400]} />}
            />

            <Input
              label="Password (min 6 characters)"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              leftIcon={<Lock size={16} color={colors.surface[400]} />}
            />

            <Button
              variant="primary"
              size="md"
              isLoading={isLoading}
              leftIcon={<ArrowRight size={16} color={colors.white} />}
              onPress={handleSignup}
              style={styles.submitBtn}
            >
              Continue to Onboarding
            </Button>
          </View>
        </Card>

        {/* Footer Link to Login */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signupLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
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
  brandHeader: {
    alignItems: 'center',
    gap: spacing[2],
    marginVertical: spacing[2],
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: radii['2xl'],
    backgroundColor: colors.emerald[50],
    borderWidth: 1,
    borderColor: colors.emerald[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  logoEmoji: {
    fontSize: 28,
  },
  brandTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.surface[900],
  },
  brandTagline: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  authCard: {
    padding: spacing[5],
    backgroundColor: colors.white,
    gap: spacing[3],
  },
  cardHeading: {
    fontSize: typography.fontSize.base,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.surface[500],
  },
  signupLink: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
    fontWeight: typography.fontWeight.bold,
    color: colors.brand.primary,
  },
});
