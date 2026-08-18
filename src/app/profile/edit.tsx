import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Screen, ScreenHeader, colors, radii, spacing } from '@/design-system';
import {
  requiredProfileFieldsComplete,
  type EditableProfile,
} from '@/features/profile/profileEditorModel';
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar';
import {
  getOpenedProfileChapters,
  markProfileChapterOpened,
  type ProfileChapterId,
} from '@/features/profile/profileProgressService';
import { useEditableProfile } from '@/features/profile/useEditableProfile';
import { useAuth } from '@/providers/AuthProvider';

type Chapter = {
  id: ProfileChapterId;
  number: string;
  title: string;
  description: string;
  completion: (profile: EditableProfile) => number;
};

function completion(values: unknown[]) {
  const completedFields = values.filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'boolean') return true;
    return value !== null && value !== undefined;
  }).length;

  return Math.round((completedFields / values.length) * 100);
}

const chapters: Chapter[] = [
  {
    id: 'personal', number: '01', title: 'My profile',
    description: 'How people get to know you',
    completion: profile => completion([
      profile.photoUrl,
      profile.displayName.trim(),
      profile.pronouns,
      profile.dateOfBirth,
      profile.city.trim(),
      profile.languages.trim(),
      profile.bio.trim(),
      profile.interests,
      profile.prompt && profile.promptAnswer.trim(),
      profile.identityNote.trim(),
    ]),
  },
  {
    id: 'connection', number: '02', title: 'How I connect',
    description: 'Friendship, interests and communication',
    completion: profile => completion([
      profile.connectionGoals,
      profile.connectionStyles,
      profile.communication.responseTime,
      profile.communication.preferredChannels,
      profile.planningStyle,
      profile.communication.toneIndicators ?? false,
    ]),
  },
  {
    id: 'comfort', number: '03', title: 'What feels comfortable',
    description: 'Sensory needs, meetups and boundaries',
    completion: profile => completion([
      profile.sensoryPreferences,
      profile.meetupPreferences,
      profile.advanceNotice,
      profile.physicalGreeting,
      profile.calls,
      profile.photos,
    ]),
  },
  {
    id: 'privacy', number: '04', title: 'Privacy and discovery',
    description: 'Choose how people can find you',
    completion: profile => completion([
      profile.visibility,
      profile.showDistance,
      profile.showEnergy,
    ]),
  },
];

export default function EditProfileScreen() {
  const { onboarding } = useLocalSearchParams<{ onboarding?: string }>();
  const { user } = useAuth();
  const { loading, profile } = useEditableProfile();
  const [openedChapters, setOpenedChapters] = useState<ProfileChapterId[]>([]);
  const completed = chapters.filter(chapter =>
    openedChapters.includes(chapter.id) && chapter.completion(profile) === 100,
  ).length;
  const requiredComplete = requiredProfileFieldsComplete(profile);
  const isOnboarding = onboarding === '1';

  useFocusEffect(useCallback(() => {
    if (!user) return;
    let active = true;
    getOpenedProfileChapters(user.uid).then(opened => {
      if (active) setOpenedChapters(opened);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [user]));

  const openChapter = (chapter: ProfileChapterId) => {
    if (user && !openedChapters.includes(chapter)) {
      setOpenedChapters(current => [...current, chapter]);
      markProfileChapterOpened(user.uid, chapter).catch(() => undefined);
    }
    router.push(`/profile/edit/${chapter}`);
  };

  return (
    <Screen
      contentStyle={styles.screen}
      header={
        <ScreenHeader
          actionLabel={isOnboarding && requiredComplete && !loading ? 'Continue' : undefined}
          backLabel="Back to my profile"
          onAction={isOnboarding && requiredComplete ? () => router.replace('/(tabs)/profile') : undefined}
          onBack={isOnboarding ? undefined : () => router.back()}
          title={isOnboarding ? 'Complete your profile' : 'Edit profile'}
        />
      }>
      <View style={styles.identity}>
        <ProfileAvatar
          name={profile.displayName || 'Your profile'}
          photoUrl={profile.photoUrl}
          size={72}
        />
        <View style={styles.identityCopy}>
          <AppText variant="title">{profile.displayName || 'Your profile'}</AppText>
          <AppText color={colors.textMuted}>{loading ? 'Loading your profile…' : completed ? `${completed} of 4 areas complete` : 'Ready to shape in your own time'}</AppText>
        </View>
      </View>

      <View style={styles.reassurance}>
        <Ionicons color={colors.primary} name="leaf-outline" size={20} />
        <AppText color={colors.textMuted} style={styles.reassuranceCopy} variant="caption">
          {isOnboarding
            ? 'Complete the required parts of My profile before entering the app. Optional details can wait.'
            : 'Add only what feels useful. You can change every detail whenever you like.'}
        </AppText>
      </View>

      <View style={styles.journey}>
        {chapters.map((chapter, index) => {
          const chapterCompletion = openedChapters.includes(chapter.id)
            ? chapter.completion(profile)
            : 0;
          const complete = chapterCompletion === 100;
          const started = chapterCompletion > 0;
          return (
            <View key={chapter.id} style={styles.chapterShell}>
              <View style={styles.markerColumn}>
                <View style={[styles.marker, started && styles.markerStarted, complete && styles.markerComplete]}>
                  <AppText color={complete ? colors.surfaceRaised : started ? colors.primary : colors.textMuted} variant="caption">{chapter.number}</AppText>
                </View>
                {index < chapters.length - 1 ? <View style={styles.journeyLine} /> : null}
              </View>
              <Pressable
                accessibilityHint={`Opens ${chapter.title}`}
                accessibilityRole="button"
                onPress={() => openChapter(chapter.id)}
                style={({ pressed }) => [styles.chapter, pressed && styles.chapterPressed]}>
                <View style={styles.chapterCopy}>
                  <AppText variant="heading">{chapter.title}</AppText>
                  <AppText color={colors.textMuted} variant="caption">{chapter.description}</AppText>
                  <AppText color={started ? colors.primary : colors.textMuted} variant="label">{chapterCompletion}% complete</AppText>
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
  identityCopy: { flex: 1, gap: spacing.xxs },
  reassurance: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', paddingVertical: spacing.sm },
  reassuranceCopy: { flex: 1 },
  journey: { gap: 0 },
  chapterShell: { flexDirection: 'row', alignItems: 'stretch' },
  markerColumn: { width: 40, alignItems: 'center' },
  marker: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.canvas },
  markerStarted: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  markerComplete: { backgroundColor: colors.primary },
  journeyLine: { width: 1, flex: 1, minHeight: 88, backgroundColor: colors.border },
  chapter: { flex: 1, minHeight: 120, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginLeft: spacing.sm, marginBottom: spacing.md, padding: spacing.md, borderRadius: radii.md },
  chapterPressed: { backgroundColor: colors.surface },
  chapterCopy: { flex: 1, gap: spacing.xxs },
});
