import { StyleSheet, View } from 'react-native';

import { AppText, Pill, Screen, colors, spacing } from '@/design-system';
import { ProfileCard } from '@/features/discovery/ProfileCard';
import { mockProfiles } from '@/features/discovery/mockProfiles';

export default function DiscoverScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Pill label="Quiet discovery" tone="primary" />
        <AppText variant="display">People on your wavelength</AppText>
        <AppText color={colors.textMuted}>
          Ordered by shared interests and connection preferences — never by popularity.
        </AppText>
      </View>

      <View style={styles.list}>
        {mockProfiles.map(profile => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginBottom: spacing.xl },
  list: { gap: spacing.lg },
});
