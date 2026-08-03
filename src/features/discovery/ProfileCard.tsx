import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppText,
  Card,
  Pill,
  colors,
  radii,
  spacing,
} from '@/design-system';
import type { ConnectionStyle, EnergyLevel, UserProfile } from '@/types/domain';

const connectionLabels: Record<ConnectionStyle, string> = {
  'parallel-play': 'Parallel play',
  'infodump-exchange': 'Infodump exchange',
  'activity-first': 'Activity first',
};

const energyLabels: Record<EnergyLevel, string> = {
  open: 'Open to chat',
  limited: 'Low energy',
  quiet: 'Quiet mode',
};

export function ProfileCard({ profile }: { profile: UserProfile }) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <AppText variant="title">{profile.displayName.slice(0, 1)}</AppText>
        </View>
        <View style={styles.identity}>
          <AppText variant="heading">
            {profile.displayName}, {profile.age}
          </AppText>
          <View style={styles.inlineInfo}>
            <Ionicons color={colors.textMuted} name="location-outline" size={16} />
            <AppText color={colors.textMuted} variant="caption">
              {profile.distanceKm} km away
            </AppText>
          </View>
        </View>
        <Pill
          label={energyLabels[profile.energy]}
          tone={profile.energy === 'open' ? 'sage' : 'neutral'}
        />
      </View>

      <AppText>{profile.bio}</AppText>

      <View style={styles.section}>
        <AppText color={colors.textMuted} variant="label">
          {profile.sharedInterestCount} shared interests
        </AppText>
        <View style={styles.pills}>
          {profile.interests.map(interest => (
            <Pill key={interest} label={interest} tone="sage" />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText color={colors.textMuted} variant="label">
          Comfortable with
        </AppText>
        <View style={styles.pills}>
          {profile.connectionStyles.map(style => (
            <Pill key={style} label={connectionLabels[style]} tone="slate" />
          ))}
        </View>
      </View>

      <AppButton label="View connection profile" onPress={() => {}} variant="secondary" />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: { flex: 1, gap: spacing.xxs },
  inlineInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  section: { gap: spacing.sm },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
