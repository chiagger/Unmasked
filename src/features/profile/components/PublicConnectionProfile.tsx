import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Card, Pill, colors, radii, spacing } from '@/design-system';
import { profileOptions, type EditableProfile } from '@/features/profile/profileEditorModel';
import { SocialBatteryIndicator } from '@/features/profile/components/SocialBatteryIndicator';

const responseLabels = {
  'same-day': 'Usually replies the same day',
  'one-to-three-days': 'Usually replies in 1–3 days',
  'when-energy-allows': 'Replies when energy allows',
} as const;

function optionLabels<T extends string>(values: readonly T[], options: readonly (readonly [T, string])[]) {
  return values.map(value => options.find(([option]) => option === value)?.[1] ?? value);
}

function humanize(value: string) {
  return value.replaceAll('-', ' ').replace(/^./, letter => letter.toUpperCase());
}

export function PublicConnectionProfile({
  footer,
  height,
  onEnergyPress,
  profile,
}: {
  footer?: React.ReactNode;
  height?: number;
  onEnergyPress?: () => void;
  profile: EditableProfile;
}) {
  const goals = optionLabels(profile.connectionGoals, profileOptions.goals);
  const styles = optionLabels(profile.connectionStyles, profileOptions.styles);
  const channels = optionLabels(
    profile.communication.preferredChannels ?? [],
    profileOptions.channels,
  );
  const communicationDetails = [
    ...(profile.communication.responseTime
      ? [responseLabels[profile.communication.responseTime]]
      : []),
    ...channels,
    ...(profile.communication.toneIndicators ? ['Tone indicators welcome'] : []),
  ];
  const meetupDetails = [
    ...profile.sensoryPreferences,
    ...profile.meetupPreferences,
  ];
  const boundaries = [
    ...(profile.physicalGreeting
      ? [`${humanize(profile.physicalGreeting)} for greetings`]
      : []),
    ...(profile.calls ? [humanize(profile.calls)] : []),
    ...(profile.photos ? [`${humanize(profile.photos)} for photos`] : []),
  ];

  const content = (
    <>
      <View style={stylesSheet.hero}>
        <View style={stylesSheet.avatar}>
          <AppText color={colors.secondary} variant="title">
            {(profile.displayName || '?')[0].toUpperCase()}
          </AppText>
        </View>
        <View style={stylesSheet.identity}>
          <AppText variant="title">{profile.displayName || 'Unnamed profile'}</AppText>
          <AppText color={colors.textMuted}>
            {[profile.pronouns, profile.age || null].filter(Boolean).join(' · ')}
          </AppText>
          {profile.city ? (
            <View style={stylesSheet.location}>
              <Ionicons color={colors.textMuted} name="location-outline" size={17} />
              <AppText color={colors.textMuted} variant="caption">{profile.city}</AppText>
            </View>
          ) : null}
          {profile.languages ? (
            <View style={stylesSheet.location}>
              <Ionicons color={colors.textMuted} name="language-outline" size={17} />
              <AppText color={colors.textMuted} variant="caption">{profile.languages}</AppText>
            </View>
          ) : null}
        </View>
        {profile.showEnergy ? <SocialBatteryIndicator level={profile.energy} onPress={onEnergyPress} /> : null}
      </View>

      {profile.bio ? (
        <ProfileSection title="Things we could do together">
          <AppText style={stylesSheet.bio}>{profile.bio}</AppText>
        </ProfileSection>
      ) : null}

      {profile.prompt && profile.promptAnswer ? (
        <View style={stylesSheet.prompt}>
          <AppText color={colors.primary} variant="label">{profile.prompt}</AppText>
          <AppText>{profile.promptAnswer}</AppText>
        </View>
      ) : null}

      {profile.interests.length ? (
        <ProfileSection title="Interests">
          <PillList labels={profile.interests} primary />
        </ProfileSection>
      ) : null}

      {goals.length || styles.length ? (
        <ProfileSection title="How I connect">
          {goals.length ? <LabeledPills label="Looking for" labels={goals} primary /> : null}
          {styles.length ? <LabeledPills label="Ways I like to connect" labels={styles} /> : null}
        </ProfileSection>
      ) : null}

      {communicationDetails.length ? (
        <ProfileSection title="Communication">
          <PillList labels={communicationDetails} />
        </ProfileSection>
      ) : null}

      {meetupDetails.length ? (
        <ProfileSection title="What feels comfortable">
          <PillList labels={meetupDetails} />
        </ProfileSection>
      ) : null}

      {boundaries.length ? (
        <ProfileSection title="Good to know">
          <PillList labels={boundaries} />
        </ProfileSection>
      ) : null}

      {profile.identityNote ? (
        <ProfileSection title="In my own words">
          <AppText>{profile.identityNote}</AppText>
        </ProfileSection>
      ) : null}

      {footer ? <View style={stylesSheet.footer}>{footer}</View> : null}
    </>
  );

  return (
    <Card style={[stylesSheet.profile, height ? { height, padding: 0 } : null]}>
      {height ? (
        <ScrollView
          contentContainerStyle={stylesSheet.scrollContent}
          nestedScrollEnabled
          showsVerticalScrollIndicator>
          {content}
        </ScrollView>
      ) : content}
    </Card>
  );
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={stylesSheet.section}><AppText variant="heading">{title}</AppText>{children}</View>;
}

function LabeledPills({ label, labels, primary = false }: { label: string; labels: string[]; primary?: boolean }) {
  return <View style={stylesSheet.labeled}><AppText color={colors.textMuted} variant="caption">{label}</AppText><PillList labels={labels} primary={primary} /></View>;
}

function PillList({ labels, primary = false }: { labels: string[]; primary?: boolean }) {
  return <View style={stylesSheet.pills}>{labels.map(label => <Pill key={label} label={label} tone={primary ? 'primary' : 'neutral'} />)}</View>;
}

const stylesSheet = StyleSheet.create({
  profile: {
    gap: spacing.xl,
    overflow: 'hidden',
    borderTopWidth: 4,
    borderTopColor: colors.primary,
  },
  scrollContent: { flexGrow: 1, gap: spacing.xl, padding: spacing.lg },
  footer: { marginTop: 'auto' },
  hero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  avatar: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.secondarySoft },
  identity: { flex: 1, gap: spacing.xxs },
  location: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  bio: { fontSize: 17 },
  prompt: {
    gap: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  section: { gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.lg },
  labeled: { gap: spacing.xs },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
