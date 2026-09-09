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
import { Badge } from '../../components/ui/Badge';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { login, loginWithDemo } = useAuth();
  const { showToast } = useUI();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        showToast('Welcome back to NutriFlow! 🥑', 'success');
      } else {
        showToast(res.error || 'Invalid credentials. Please try again.', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Invalid credentials. Try Demo Account.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithDemo();
      showToast('Logged in as Elena Vance (Demo Profile)! ✨', 'success');
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
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🥑</Text>
          </View>
          <Text style={styles.brandTitle}>NutriFlow</Text>
          <Text style={styles.brandTagline}>Metabolic Health & Macro Intelligence</Text>
        </View>

        {/* Login Card */}
        <Card style={styles.authCard}>
          <Text style={styles.cardHeading}>Sign In to Your Account</Text>
          <Text style={styles.cardSub}>
            Access your personalized daily macro budgets and glucose insights.
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

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              leftIcon={<Lock size={16} color={colors.surface[400]} />}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              variant="primary"
              size="md"
              isLoading={isLoading}
              leftIcon={<ArrowRight size={16} color={colors.white} />}
              onPress={handleLogin}
              style={styles.submitBtn}
            >
              Sign In
            </Button>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR QUICK DEMO</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Quick 1-Tap Demo Login Button */}
          <Button
            variant="outline"
            size="md"
            leftIcon={<Zap size={16} color={colors.brand.primary} />}
            onPress={handleDemoLogin}
            style={styles.demoBtn}
          >
            Explore as Elena Vance (Demo)
          </Button>
        </Card>

        {/* Footer Link to Signup */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account yet?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}> Create Account</Text>
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
  scrollContent: {
    padding: spacing[5],
    justifyContent: 'center',
    minHeight: '100%',
    gap: spacing[4],
  },
  brandHeader: {
    alignItems: 'center',
    gap: spacing[2],
    marginVertical: spacing[4],
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: radii['2xl'],
    backgroundColor: colors.emerald[50],
    borderWidth: 1,
    borderColor: colors.emerald[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  logoEmoji: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: typography.fontSize['2xl'],
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
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    color: colors.brand.primary,
  },
  submitBtn: {
    width: '100%',
    marginTop: spacing[1],
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginVertical: spacing[2],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surface[200],
  },
  dividerText: {
    fontSize: typography.fontSize['2xs'],
    fontFamily: typography.fontFamily.bold,
    color: colors.surface[400],
    letterSpacing: 0.5,
  },
  demoBtn: {
    width: '100%',
    borderColor: colors.brand.primary,
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
