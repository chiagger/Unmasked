import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppButton, AppText, colors, spacing } from '@/design-system';
import { getAuthErrorMessage } from '@/features/auth/authErrors';
import { loginWithSocialProvider, registerWithEmail } from '@/features/auth/authService';
import { AuthField } from '@/features/auth/components/AuthField';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { SocialAuthButton } from '@/features/auth/components/SocialAuthButton';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState<'email' | 'social' | null>(null);
  const normalizedEmail = email.trim();
  const emailIsValid = emailPattern.test(normalizedEmail);
  const canSubmit =
    displayName.trim().length > 0 &&
    emailIsValid &&
    password.length >= 8 &&
    password === confirmPassword;

  const register = async () => {
    if (!canSubmit) {
      setFieldErrors({
        displayName: displayName.trim() ? undefined : 'Tell us what you would like to be called.',
        email: emailIsValid ? undefined : 'Enter a valid email address.',
        password:
          password.length >= 8 ? undefined : 'Use at least 8 characters for your password.',
        confirmPassword:
          password === confirmPassword && confirmPassword
            ? undefined
            : 'Make sure both passwords match.',
      });
      return;
    }

    setFieldErrors({});
    setError(null);
    setLoading('email');
    try {
      await registerWithEmail({ displayName, email: normalizedEmail, password });
      router.replace('/profile/edit?onboarding=1');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setLoading(null);
    }
  };

  const registerSocially = async () => {
    setError(null);
    setLoading('social');
    try {
      const credential = await loginWithSocialProvider();
      if (credential) router.replace('/profile/edit?onboarding=1');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setLoading(null);
    }
  };

  return (
    <AuthScreen
      footer={
        <Pressable
          accessibilityRole="link"
          onPress={() => router.replace('/login')}
          style={styles.footerAction}>
          <AppText color={colors.textMuted} style={styles.footerLabel}>
            Already have an account?
          </AppText>
          <AppText color={colors.primary} variant="bodyStrong">Sign in</AppText>
        </Pressable>
      }
      eyebrow="New here"
      title="Create your space"
      subtitle="Create your account, then complete the profile people will see.">
      <View style={styles.form}>
        <AuthField
          autoCapitalize="words"
          autoComplete="name"
          error={fieldErrors.displayName}
          label="What should we call you?"
          onChangeText={(value) => {
            setDisplayName(value);
            setError(null);
            setFieldErrors((current) => ({ ...current, displayName: undefined }));
          }}
          onBlur={() => {
            if (!displayName.trim()) {
              setFieldErrors((current) => ({
                ...current,
                displayName: 'Tell us what you would like to be called.',
              }));
            }
          }}
          onSubmitEditing={() => emailRef.current?.focus()}
          placeholder="Your name or nickname"
          returnKeyType="next"
          value={displayName}
        />
        <AuthField
          autoCapitalize="none"
          autoComplete="email"
          error={fieldErrors.email}
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
          ref={emailRef}
          returnKeyType="next"
          valid={emailIsValid}
          value={email}
        />
        <AuthField
          autoCapitalize="none"
          autoComplete="new-password"
          error={fieldErrors.password}
          label="Password"
          onChangeText={(value) => {
            setPassword(value);
            setError(null);
            setFieldErrors((current) => ({
              ...current,
              password: undefined,
              confirmPassword: undefined,
            }));
          }}
          onBlur={() => {
            if (password.length < 8) {
              setFieldErrors((current) => ({
                ...current,
                password: 'Use at least 8 characters for your password.',
              }));
            }
          }}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          password
          placeholder="At least 8 characters"
          ref={passwordRef}
          returnKeyType="next"
          value={password}
        />
        <AuthField
          autoCapitalize="none"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          label="Confirm password"
          onChangeText={(value) => {
            setConfirmPassword(value);
            setError(null);
            setFieldErrors((current) => ({ ...current, confirmPassword: undefined }));
          }}
          onBlur={() => {
            if (!confirmPassword || password !== confirmPassword) {
              setFieldErrors((current) => ({
                ...current,
                confirmPassword: 'Make sure both passwords match.',
              }));
            }
          }}
          onSubmitEditing={register}
          password
          placeholder="Repeat your password"
          ref={confirmPasswordRef}
          returnKeyType="go"
          value={confirmPassword}
        />
        <AppButton
          disabled={loading !== null || !canSubmit}
          fullWidth
          label="Create account"
          loading={loading === 'email'}
          onPress={register}
        />
        {error ? (
          <View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={styles.errorBanner}>
            <Ionicons color={colors.warning} name="alert-circle-outline" size={20} />
            <AppText color={colors.warning} style={styles.errorText} variant="caption">
              {error}
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <AppText color={colors.textMuted} variant="caption">Or continue with</AppText>
        <View style={styles.line} />
      </View>
      <SocialAuthButton
        disabled={loading !== null}
        loading={loading === 'social'}
        onPress={registerSocially}
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
