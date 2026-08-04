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
  const [loading, setLoading] = useState<'email' | 'social' | null>(null);

  const register = async () => {
    const normalizedEmail = email.trim();
    if (!displayName.trim()) return setError('Tell us what you would like to be called.');
    if (!emailPattern.test(normalizedEmail)) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Use at least 8 characters for your password.');
    if (password !== confirmPassword) return setError('The passwords do not match.');

    setError(null);
    setLoading('email');
    try {
      await registerWithEmail({ displayName, email: normalizedEmail, password });
      router.replace('/(tabs)/discover');
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
      if (credential) router.replace('/(tabs)/discover');
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setLoading(null);
    }
  };

  return (
    <AuthScreen title="Create your space" subtitle="A quiet profile you can shape over time.">
      <View style={styles.form}>
        <AuthField
          autoComplete="name"
          label="What should we call you?"
          onChangeText={(value) => {
            setDisplayName(value);
            setError(null);
          }}
          onSubmitEditing={() => emailRef.current?.focus()}
          placeholder="Your name or nickname"
          returnKeyType="next"
          value={displayName}
        />
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
          ref={emailRef}
          returnKeyType="next"
          value={email}
        />
        <AuthField
          autoCapitalize="none"
          autoComplete="new-password"
          label="Password"
          onChangeText={(value) => {
            setPassword(value);
            setError(null);
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
          label="Confirm password"
          onChangeText={(value) => {
            setConfirmPassword(value);
            setError(null);
          }}
          onSubmitEditing={register}
          password
          placeholder="Repeat your password"
          ref={confirmPasswordRef}
          returnKeyType="go"
          value={confirmPassword}
        />
        {error ? <AppText color={colors.warning} variant="caption">{error}</AppText> : null}
        <AppButton
          disabled={loading !== null}
          fullWidth
          label="Create account"
          loading={loading === 'email'}
          onPress={register}
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
        onPress={registerSocially}
      />
      <Pressable
        accessibilityRole="link"
        onPress={() => router.replace('/login')}
        style={styles.footerAction}>
        <AppText color={colors.textMuted}>Already have an account? </AppText>
        <AppText color={colors.secondary} variant="bodyStrong">Sign in</AppText>
      </Pressable>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  line: { height: 1, flex: 1, backgroundColor: colors.border },
  footerAction: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: spacing.xs,
  },
});
