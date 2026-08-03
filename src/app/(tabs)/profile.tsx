import { StyleSheet, Switch, View } from 'react-native';

import { AppText, Card, Pill, Screen, colors, spacing } from '@/design-system';
import { isFirebaseConfigured } from '@/config/env';
import { useAccessibilityPreferences } from '@/providers/AccessibilityProvider';

export default function ProfileScreen() {
  const { reduceMotion, setReduceMotion } = useAccessibilityPreferences();

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
          <AppText variant="heading">Demo profile</AppText>
          <Pill label="Setup 40% complete" tone="sage" />
        </View>
        <AppText color={colors.textMuted}>
          Add interests, communication preferences, boundaries, and your current social
          energy.
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
        <AppText variant="heading">Backend status</AppText>
        <Card style={styles.settingRow}>
          <View style={styles.settingCopy}>
            <AppText variant="bodyStrong">Firebase</AppText>
            <AppText color={colors.textMuted} variant="caption">
              {isFirebaseConfigured
                ? 'Configured and ready to connect.'
                : 'Add the EXPO_PUBLIC_FIREBASE_* values to your .env file.'}
            </AppText>
          </View>
          <Pill
            label={isFirebaseConfigured ? 'Ready' : 'Needs config'}
            tone={isFirebaseConfigured ? 'sage' : 'rose'}
          />
        </Card>
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
