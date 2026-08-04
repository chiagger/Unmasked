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
  const [loading, setLoading] = useState<'email' | 'social' | null>(null);
  const normalizedEmail = email.trim();

  const login = async () => {
    if (!emailPattern.test(normalizedEmail) || !password) {
      setError('Enter your email and password.');
      return;
    }

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
    if (!emailPattern.test(normalizedEmail)) {
      setError('Enter your email first, then choose “Forgot password?”.');
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
    <AuthScreen title="Welcome back" subtitle="Sign in at your own pace. Nothing here is urgent.">
      <View style={styles.form}>
        <AuthField
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={(value) => {
            setEmail(value);
            setError(null);
          }}
          onSubmitEditing={() => passwordRef.current?.focus()}
          placeholder="you@example.com"
          returnKeyType="next"
          value={email}
        />
        <AuthField
          autoCapitalize="none"
          autoComplete="current-password"
          label="Password"
          onChangeText={(value) => {
            setPassword(value);
            setError(null);
          }}
          onSubmitEditing={login}
          password
          placeholder="Your password"
          ref={passwordRef}
          returnKeyType="go"
          value={password}
        />
        <Pressable accessibilityRole="button" onPress={requestReset} style={styles.textAction}>
          <AppText color={colors.secondary} variant="label">Forgot password?</AppText>
        </Pressable>
        {error ? <AppText color={colors.warning} variant="caption">{error}</AppText> : null}
        <AppButton
          disabled={loading !== null}
          fullWidth
          label="Sign in"
          loading={loading === 'email'}
          onPress={login}
        />
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <AppText color={colors.textMuted} variant="caption">or</AppText>
        <View style={styles.line} />
      </View>

      <SocialAuthButton
        disabled={loading !== null}
        loading={loading === 'social'}
        onPress={loginSocially}
      />
      <Pressable
        accessibilityRole="link"
        onPress={() => router.push('/register')}
        style={styles.footerAction}>
        <AppText color={colors.textMuted}>New here? </AppText>
        <AppText color={colors.secondary} variant="bodyStrong">Create an account</AppText>
      </Pressable>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  textAction: { alignSelf: 'flex-end', paddingVertical: spacing.xxs },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  line: { height: 1, flex: 1, backgroundColor: colors.border },
  footerAction: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: spacing.xs,
  },
});
