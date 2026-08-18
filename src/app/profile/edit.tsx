import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Screen, ScreenHeader, colors, radii, spacing } from '@/design-system';
import type { EditableProfile } from '@/features/profile/profileEditorModel';
import { useEditableProfile } from '@/features/profile/useEditableProfile';

type Chapter = {
  id: 'personal' | 'connection' | 'comfort' | 'privacy';
  number: string;
  title: string;
  description: string;
  status: (profile: EditableProfile) => string;
};

const chapters: Chapter[] = [
  {
    id: 'personal', number: '01', title: 'My profile',
    description: 'How people get to know you',
    status: profile => profile.displayName && profile.pronouns && profile.city ? 'Added' : 'Start here',
  },
  {
    id: 'connection', number: '02', title: 'How I connect',
    description: 'Friendship, interests and communication',
    status: profile => profile.connectionGoals.length && profile.connectionStyles.length ? 'Added' : 'Not added yet',
  },
  {
    id: 'comfort', number: '03', title: 'What feels comfortable',
    description: 'Sensory needs, meetups and boundaries',
    status: profile => profile.sensoryPreferences.length || profile.meetupPreferences.length ? 'Added' : 'Optional',
  },
  {
    id: 'privacy', number: '04', title: 'Privacy and discovery',
    description: 'Choose how people can find you',
    status: profile => profile.visibility === 'private' ? 'Discovery paused' : 'Discoverable',
  },
];

export default function EditProfileScreen() {
  const { loading, profile } = useEditableProfile();
  const started = chapters.filter(chapter => chapter.status(profile) === 'Added').length;

  return (
    <Screen
      contentStyle={styles.screen}
      header={<ScreenHeader backLabel="Back to my profile" onBack={() => router.back()} title="Edit profile" />}>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <AppText color={colors.secondary} variant="title">{(profile.displayName || '?')[0].toUpperCase()}</AppText>
        </View>
        <View style={styles.identityCopy}>
          <AppText variant="title">{profile.displayName || 'Your profile'}</AppText>
          <AppText color={colors.textMuted}>{loading ? 'Loading your profile…' : started ? `${started} of 4 areas started` : 'Ready to shape in your own time'}</AppText>
        </View>
      </View>

      <View style={styles.reassurance}>
        <Ionicons color={colors.primary} name="leaf-outline" size={20} />
        <AppText color={colors.textMuted} style={styles.reassuranceCopy} variant="caption">
          Add only what feels useful. Your profile is ready to use without completing every area.
        </AppText>
      </View>

      <View style={styles.journey}>
        {chapters.map((chapter, index) => {
          const status = chapter.status(profile);
          const active = status === 'Added' || status === 'Discoverable';
          return (
            <View key={chapter.id} style={styles.chapterShell}>
              <View style={styles.markerColumn}>
                <View style={[styles.marker, active && styles.markerActive]}>
                  {active ? <Ionicons color={colors.surfaceRaised} name="checkmark" size={16} /> : <AppText color={colors.textMuted} variant="caption">{chapter.number}</AppText>}
                </View>
                {index < chapters.length - 1 ? <View style={styles.journeyLine} /> : null}
              </View>
              <Pressable
                accessibilityHint={`Opens ${chapter.title}`}
                accessibilityRole="button"
                onPress={() => router.push(`/profile/edit/${chapter.id}`)}
                style={({ pressed }) => [styles.chapter, pressed && styles.chapterPressed]}>
                <View style={styles.chapterCopy}>
                  <AppText variant="heading">{chapter.title}</AppText>
                  <AppText color={colors.textMuted} variant="caption">{chapter.description}</AppText>
                  <AppText color={active ? colors.primary : colors.textMuted} variant="label">{status}</AppText>
                </View>
                <Ionicons color={colors.primary} name="chevron-forward" size={22} />
              </Pressable>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', borderRadius: radii.lg, backgroundColor: colors.secondarySoft },
  identityCopy: { flex: 1, gap: spacing.xxs },
  reassurance: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', paddingVertical: spacing.sm },
  reassuranceCopy: { flex: 1 },
  journey: { gap: 0 },
  chapterShell: { flexDirection: 'row', alignItems: 'stretch' },
  markerColumn: { width: 40, alignItems: 'center' },
  marker: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.canvas },
  markerActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  journeyLine: { width: 1, flex: 1, minHeight: 88, backgroundColor: colors.border },
  chapter: { flex: 1, minHeight: 120, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginLeft: spacing.sm, marginBottom: spacing.md, padding: spacing.md, borderRadius: radii.md },
  chapterPressed: { backgroundColor: colors.surface },
  chapterCopy: { flex: 1, gap: spacing.xxs },
});
