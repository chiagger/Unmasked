import { StyleSheet, Switch, View } from 'react-native';

import { AppButton, AppText, Card, Pill, Screen, colors, spacing } from '@/design-system';
import { useAccessibilityPreferences } from '@/providers/AccessibilityProvider';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfileScreen() {
  const { reduceMotion, setReduceMotion } = useAccessibilityPreferences();
  const { logout, user } = useAuth();

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Your space</AppText>
        <AppText color={colors.textMuted}>
          Make your needs visible without having to explain them every time.
        </AppText>
      </View>

      <Card style={styles.profileCard}>
        <View style={styles.profileHeading}>
          <AppText variant="heading">{user?.displayName || 'Your profile'}</AppText>
          <Pill label="Setup 40% complete" tone="sage" />
        </View>
        <AppText color={colors.textMuted}>
          {user?.email ?? 'Add interests, communication preferences, and boundaries.'}
        </AppText>
      </Card>

      <View style={styles.section}>
        <AppText variant="heading">Comfort settings</AppText>
        <Card style={styles.settingRow}>
          <View style={styles.settingCopy}>
            <AppText variant="bodyStrong">Reduce motion</AppText>
            <AppText color={colors.textMuted} variant="caption">
              Removes non-essential transitions and movement.
            </AppText>
          </View>
          <Switch
            accessibilityLabel="Reduce motion"
            onValueChange={setReduceMotion}
            trackColor={{ false: colors.surfaceMuted, true: colors.primarySoft }}
            thumbColor={reduceMotion ? colors.primary : colors.textMuted}
            value={reduceMotion}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <AppText variant="heading">Account</AppText>
        <AppButton fullWidth label="Sign out" onPress={logout} variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginBottom: spacing.xl },
  profileCard: { gap: spacing.md },
  profileHeading: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  section: { gap: spacing.sm, marginTop: spacing.xl },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  settingCopy: { flex: 1, gap: spacing.xxs },
});
