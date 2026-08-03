import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  Screen,
  colors,
  radii,
  spacing,
} from '@/design-system';

export default function WelcomeScreen() {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.brandMark} accessibilityElementsHidden>
        <Ionicons color={colors.primary} name="leaf-outline" size={40} />
      </View>

      <View style={styles.copy}>
        <AppText variant="display">Friendship, without the performance.</AppText>
        <AppText color={colors.textMuted}>
          Meet neurodivergent people through shared interests, clear expectations,
          and sensory-friendly plans.
        </AppText>
      </View>

      <Card style={styles.promiseCard}>
        <PromiseRow icon="heart-outline" text="Platonic connections only" />
        <PromiseRow icon="chatbubble-ellipses-outline" text="Direct communication" />
        <PromiseRow icon="volume-low-outline" text="Low-pressure places" />
      </Card>

      <View style={styles.actions}>
        <AppButton
          fullWidth
          label="Find your people"
          onPress={() => router.replace('/(tabs)/discover')}
        />
        <AppButton
          fullWidth
          label="I already have an account"
          onPress={() => router.replace('/(tabs)/discover')}
          variant="quiet"
        />
      </View>

      <AppText color={colors.textMuted} style={styles.footnote} variant="caption">
        No swiping pressure. No read-receipt expectations. You choose your pace.
      </AppText>
    </Screen>
  );
}

function PromiseRow({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }) {
  return (
    <View style={styles.promiseRow}>
      <View style={styles.promiseIcon}>
        <Ionicons color={colors.primary} name={icon} size={20} />
      </View>
      <AppText variant="bodyStrong">{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: spacing.xl },
  brandMark: {
    width: 72,
    height: 72,
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { gap: spacing.md },
  promiseCard: { gap: spacing.md },
  promiseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  promiseIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { gap: spacing.sm },
  footnote: { textAlign: 'center', paddingHorizontal: spacing.md },
});
