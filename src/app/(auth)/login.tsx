import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppButton, AppText, colors, spacing } from '@/design-system';
import { getAuthErrorMessage } from '@/features/auth/authErrors';
import {
  loginWithEmail,
  loginWithSocialProvider,
  resetPassword,
} from '@/features/auth/authService';
import { AuthField } from '@/features/auth/components/AuthField';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { SocialAuthButton } from '@/features/auth/components/SocialAuthButton';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState<'email' | 'social' | null>(null);
  const normalizedEmail = email.trim();
  const emailIsValid = emailPattern.test(normalizedEmail);
  const canSubmit = emailIsValid && password.length > 0;

  const login = async () => {
    if (!canSubmit) {
      setFieldErrors({
        email: emailIsValid ? undefined : 'Enter a valid email address.',
        password: password ? undefined : 'Enter your password.',
      });
      return;
    }

    setFieldErrors({});
    setError(null);
    setLoading('email');
    try {
      await loginWithEmail(normalizedEmail, password);
      router.replace('/(tabs)/discover');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setLoading(null);
    }
  };

  const loginSocially = async () => {
    setError(null);
    setLoading('social');
    try {
      const credential = await loginWithSocialProvider();
      if (credential) router.replace('/(tabs)/discover');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setLoading(null);
    }
  };

  const requestReset = async () => {
    if (!emailIsValid) {
      setFieldErrors({ email: 'Enter your email before resetting your password.' });
      return;
    }

    try {
      await resetPassword(normalizedEmail);
      Alert.alert('Email sent', 'Check your inbox when you are ready.');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    }
  };

  return (
    <AuthScreen
      eyebrow="Welcome back"
      footer={
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push('/register')}
          style={styles.footerAction}>
          <AppText color={colors.textMuted} style={styles.footerLabel}>
            New to Unmasked?
          </AppText>
          <AppText color={colors.primary} variant="bodyStrong">
            Create an account
          </AppText>
        </Pressable>
      }
      notice={
        error ? (
          <View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={styles.errorBanner}>
            <Ionicons color={colors.warning} name="alert-circle-outline" size={20} />
            <AppText color={colors.warning} style={styles.errorText} variant="caption">
              {error}
            </AppText>
          </View>
        ) : null
      }
      title="Sign in"
      subtitle="Take your time. Nothing here is urgent.">
      <View style={styles.form}>
        <AuthField
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={(value) => {
            setEmail(value);
            setError(null);
            setFieldErrors((current) => ({ ...current, email: undefined }));
          }}
          onBlur={() => {
            if (!emailIsValid) {
              setFieldErrors((current) => ({
                ...current,
                email: 'Enter a valid email address.',
              }));
            }
          }}
          onSubmitEditing={() => passwordRef.current?.focus()}
          placeholder="you@example.com"
          returnKeyType="next"
          error={fieldErrors.email}
          valid={emailIsValid}
          value={email}
        />
        <AuthField
          autoCapitalize="none"
          autoComplete="current-password"
          label="Password"
          onChangeText={(value) => {
            setPassword(value);
            setError(null);
            setFieldErrors((current) => ({ ...current, password: undefined }));
          }}
          onBlur={() => {
            if (!password) {
              setFieldErrors((current) => ({ ...current, password: 'Enter your password.' }));
            }
          }}
          onSubmitEditing={login}
          password
          placeholder="Your password"
          ref={passwordRef}
          returnKeyType="go"
          error={fieldErrors.password}
          value={password}
        />
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={requestReset}
          style={styles.textAction}>
          <AppText color={colors.primary} variant="caption">Reset password</AppText>
        </Pressable>
        <AppButton
          disabled={loading !== null || !canSubmit}
          fullWidth
          label="Sign in"
          loading={loading === 'email'}
          onPress={login}
        />
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <AppText color={colors.textMuted} variant="caption">Or continue with</AppText>
        <View style={styles.line} />
      </View>

      <SocialAuthButton
        disabled={loading !== null}
        loading={loading === 'social'}
        onPress={loginSocially}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: colors.warningSoft,
  },
  errorText: { flex: 1 },
  form: { gap: spacing.sm },
  textAction: {
    alignSelf: 'flex-end',
    minHeight: 32,
    justifyContent: 'center',
    marginTop: -spacing.xs,
  },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  line: { height: 1, flex: 1, backgroundColor: colors.border },
  footerAction: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xxs,
    minHeight: 48,
    alignItems: 'center',
  },
  footerLabel: { width: '100%', textAlign: 'center' },
});
