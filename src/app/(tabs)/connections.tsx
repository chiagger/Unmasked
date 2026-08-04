import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, Screen, colors, radii, spacing } from '@/design-system';

export default function ConnectionsScreen() {
  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.header}>
        <AppText variant="display">Connections</AppText>
        <AppText color={colors.textMuted}>
          Conversations with clear expectations and room to reply in your own time.
        </AppText>
      </View>

      <Card style={styles.emptyCard}>
        <View style={styles.icon}>
          <Ionicons color={colors.primary} name="chatbubbles-outline" size={28} />
        </View>
        <AppText variant="heading">No conversations yet</AppText>
        <AppText color={colors.textMuted} style={styles.centered}>
          When you both choose to connect, your conversation will appear here. Silence is
          never treated as rejection.
        </AppText>
        <AppButton label="Browse people" onPress={() => {}} variant="secondary" />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  header: { gap: spacing.sm },
  emptyCard: { alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: { textAlign: 'center' },
});
