import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  Screen,
  colors,
  radii,
  spacing,
} from '@/design-system';
import { useAuth } from '@/providers/AuthProvider';

export default function WelcomeScreen() {
  const { logout, user } = useAuth();
  const [pendingDestination, setPendingDestination] = useState<'login' | 'register' | null>(
    null,
  );

  const openAuthForm = async (destination: 'login' | 'register') => {
    setPendingDestination(destination);
    try {
      if (user) await logout();
      router.replace(destination === 'register' ? '/register' : '/login');
    } finally {
      setPendingDestination(null);
    }
  };

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.brandMark} accessibilityElementsHidden>
        <Ionicons color={colors.primary} name="leaf-outline" size={32} />
      </View>

      <View style={styles.copy}>
        <AppText variant="display">Friendship without the pressure to perform.</AppText>
        <AppText color={colors.textMuted}>
          Meet neurodivergent people through shared interests, clear expectations,
          and sensory-friendly plans.
        </AppText>
      </View>

      <Card style={styles.promiseCard}>
        <PromiseRow
          accent
          description="Clear intentions from the beginning."
          icon="heart-outline"
          title="Platonic connections only"
        />
        <View style={styles.divider} />
        <PromiseRow
          description="Share expectations instead of decoding signals."
          icon="chatbubble-ellipses-outline"
          title="Direct communication"
        />
        <View style={styles.divider} />
        <PromiseRow
          description="Match around comfort and sensory needs."
          icon="volume-low-outline"
          title="Low-pressure plans"
        />
      </Card>

      <View style={styles.reassurance}>
        <Ionicons color={colors.secondary} name="shield-checkmark-outline" size={20} />
        <AppText color={colors.textMuted} style={styles.reassuranceText} variant="caption">
          No popularity scores. No read-receipt expectations. You choose your pace.
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton
          fullWidth
          label="Start finding your people"
          disabled={pendingDestination !== null}
          loading={pendingDestination === 'register'}
          onPress={() => openAuthForm('register')}
        />
        <AppText color={colors.textMuted} style={styles.timeHint} variant="caption">
          About 3 minutes · Your required profile comes first
        </AppText>
      </View>

      <Pressable
        accessibilityRole="link"
        accessibilityState={{ disabled: pendingDestination !== null }}
        disabled={pendingDestination !== null}
        onPress={() => openAuthForm('login')}
        style={styles.loginAction}>
        <AppText color={colors.textMuted} style={styles.loginPrompt}>
          Already have an account?
        </AppText>
        <AppText color={colors.primary} variant="bodyStrong">
          {pendingDestination === 'login' ? 'Opening sign in…' : 'Sign in'}
        </AppText>
      </Pressable>
    </Screen>
  );
}

interface PromiseRowProps {
  accent?: boolean;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
}

function PromiseRow({ accent = false, description, icon, title }: PromiseRowProps) {
  return (
    <View style={styles.promiseRow}>
      <View style={[styles.promiseIcon, accent && styles.promiseIconAccent]}>
        <Ionicons color={accent ? colors.secondary : colors.primary} name={icon} size={20} />
      </View>
      <View style={styles.promiseCopy}>
        <AppText variant="bodyStrong">{title}</AppText>
        <AppText color={colors.textMuted} variant="caption">
          {description}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.lg, paddingTop: spacing.xl },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { gap: spacing.sm },
  promiseCard: { gap: spacing.sm, padding: spacing.md, shadowOpacity: 0.025, elevation: 1 },
  promiseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  promiseCopy: { flex: 1, gap: spacing.xxs },
  promiseIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promiseIconAccent: { backgroundColor: colors.secondarySoft },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 48 },
  reassurance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    padding: spacing.sm,
  },
  reassuranceText: { flex: 1 },
  actions: { gap: spacing.xs },
  timeHint: { textAlign: 'center', paddingHorizontal: spacing.sm },
  loginAction: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  loginPrompt: { textAlign: 'center' },
});
