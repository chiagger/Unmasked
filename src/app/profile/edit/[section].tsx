import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Screen, ScreenHeader, colors, radii, spacing } from '@/design-system';
import {
  ChoiceGroup,
  FormField,
  MultiChoiceGroup,
  PronounPicker,
  ToggleRow,
} from '@/features/profile/components/ProfileFormControls';
import { profileOptions } from '@/features/profile/profileEditorModel';
import { useEditableProfile } from '@/features/profile/useEditableProfile';

const pairs = <T extends string>(items?: readonly T[]) =>
  (items ?? []).map(item => [item, item] as const);

const chapterCopy = {
  personal: ['My profile', 'The details that help people get to know you.'],
  connection: ['How I connect', 'What friendship and communication look like for you.'],
  comfort: ['What feels comfortable', 'Preferences that make time together feel easier.'],
  privacy: ['Privacy and discovery', 'You decide how visible your profile should be.'],
} as const;

export default function EditProfileChapterScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const chapter = section && section in chapterCopy ? section as keyof typeof chapterCopy : 'personal';
  const { loading, profile, save, saving, update } = useEditableProfile();
  const [interest, setInterest] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const essentialsIncomplete = chapter === 'personal'
    && (!profile.displayName.trim() || !profile.pronouns);

  const addInterest = () => {
    const next = interest.trim();
    if (!next || profile.interests.some(item => item.toLowerCase() === next.toLowerCase())) return;
    update('interests', [...profile.interests, next]);
    setInterest('');
  };
  const done = async () => {
    if (chapter === 'personal' && (!profile.displayName.trim() || !profile.pronouns)) {
      Alert.alert(
        'Complete the essentials',
        profile.displayName.trim()
          ? 'Choose the pronouns you want shown on your profile.'
          : 'Tell people what you would like to be called.',
      );
      return;
    }
    try {
      await save();
      router.back();
    } catch {
      Alert.alert('Could not save your profile', 'Please check your connection and try again.');
    }
  };

  return (
    <Screen
      contentStyle={styles.screen}
      header={<ScreenHeader onBack={() => router.back()} title="EDIT PROFILE" />}>
      <View style={styles.intro}>
        <AppText variant="display">{chapterCopy[chapter][0]}</AppText>
        <AppText color={colors.textMuted}>{chapterCopy[chapter][1]}</AppText>
      </View>

      {loading ? <AppText color={colors.textMuted}>Loading your profile…</AppText> : (
        <View style={styles.form}>
          {chapter === 'personal' ? <>
            <SectionLabel label="THE ESSENTIALS" />
            <FormField label="Display name" onChangeText={value => update('displayName', value)} placeholder="Your name or nickname" value={profile.displayName} />
            <PronounPicker onChange={value => update('pronouns', value)} value={profile.pronouns} />
            <ChoiceGroup label="Age range" onChange={value => update('ageRange', value)} options={pairs(profileOptions.ageRanges)} value={profile.ageRange} />
            <FormField label="City" onChangeText={value => update('city', value)} placeholder="For example, Manchester" value={profile.city} />
            <FormField label="A short introduction" maxLength={320} multiline onChangeText={value => update('bio', value)} placeholder="What spending time with you feels like…" value={profile.bio} />
            <SectionLabel label="WHAT LIGHTS YOU UP" />
            <FormField hint="Specific and unusual interests are welcome." label="Add an interest" onChangeText={setInterest} onSubmitEditing={addInterest} placeholder="Urban planning, cozy games…" returnKeyType="done" value={interest} />
            <AppButton disabled={!interest.trim()} label="Add interest" onPress={addInterest} variant="quiet" />
            <View style={styles.chips}>{profile.interests.map(item => <Pressable accessibilityLabel={`Remove ${item}`} key={item} onPress={() => update('interests', profile.interests.filter(value => value !== item))} style={styles.removeChip}><AppText variant="caption">{item}</AppText><Ionicons color={colors.textMuted} name="close" size={16} /></Pressable>)}</View>
            <MoreToggle open={moreOpen} onPress={() => setMoreOpen(value => !value)} />
            {moreOpen ? <View style={styles.moreFields}>
              <FormField hint="Separate multiple languages with commas." label="Languages" onChangeText={value => update('languages', value)} placeholder="English, Italian" value={profile.languages} />
              <ChoiceGroup label="Profile prompt" onChange={value => update('prompt', value)} options={pairs(profileOptions.prompts)} value={profile.prompt} />
              <FormField label="Your answer" maxLength={240} multiline onChangeText={value => update('promptAnswer', value)} placeholder="There is no perfect answer." value={profile.promptAnswer} />
              <FormField hint="Diagnosis is never required. Share only what feels useful." label="How I describe myself" maxLength={240} multiline onChangeText={value => update('identityNote', value)} placeholder="Optional" value={profile.identityNote} />
            </View> : null}
          </> : null}

          {chapter === 'connection' ? <>
            <SectionLabel label="WHAT I'M LOOKING FOR" />
            <MultiChoiceGroup hint="Choose as many as feel right." label="Connection goals" onChange={value => update('connectionGoals', value)} options={profileOptions.goals} values={profile.connectionGoals} />
            <MultiChoiceGroup label="Ways I like to connect" onChange={value => update('connectionStyles', value)} options={profileOptions.styles} values={profile.connectionStyles} />
            <SectionLabel label="COMMUNICATION" />
            <ChoiceGroup label="Language style" onChange={directness => update('communication', { ...profile.communication, directness })} options={[["direct", 'Direct'], ["gentle-direct", 'Gentle and direct']]} value={profile.communication.directness} />
            <ChoiceGroup label="Usual response time" onChange={responseTime => update('communication', { ...profile.communication, responseTime })} options={[["same-day", 'Same day'], ["one-to-three-days", '1–3 days'], ["when-energy-allows", 'When energy allows']]} value={profile.communication.responseTime} />
            <MoreToggle open={moreOpen} onPress={() => setMoreOpen(value => !value)} />
            {moreOpen ? <View style={styles.moreFields}>
              <MultiChoiceGroup label="Preferred channels" onChange={preferredChannels => update('communication', { ...profile.communication, preferredChannels })} options={profileOptions.channels} values={profile.communication.preferredChannels ?? []} />
              <ChoiceGroup label="Follow-up messages" onChange={followUpMessages => update('communication', { ...profile.communication, followUpMessages })} options={[["welcome", 'Welcome'], ["ask-first", 'Ask first'], ["not-for-me", 'Not for me']]} value={profile.communication.followUpMessages ?? 'welcome'} />
              <ChoiceGroup label="Planning style" onChange={value => update('planningStyle', value)} options={[["concrete", 'Concrete plans'], ["flexible", 'Flexible plans'], ["either", 'Either is okay']]} value={profile.planningStyle} />
              <ToggleRow description="Helpful labels such as [joke] and [literal]." label="I appreciate tone indicators" onChange={toneIndicators => update('communication', { ...profile.communication, toneIndicators })} value={profile.communication.toneIndicators} />
            </View> : null}
          </> : null}

          {chapter === 'comfort' ? <>
            <SectionLabel label="PLACES AND CONDITIONS" />
            <MultiChoiceGroup hint="Preferences, not medical declarations." label="I'm most comfortable with" onChange={value => update('sensoryPreferences', value)} options={pairs(profileOptions.sensory)} values={profile.sensoryPreferences} />
            <MultiChoiceGroup label="Helpful meetup conditions" onChange={value => update('meetupPreferences', value)} options={pairs(profileOptions.meetups)} values={profile.meetupPreferences} />
            <MoreToggle open={moreOpen} onPress={() => setMoreOpen(value => !value)} />
            {moreOpen ? <View style={styles.moreFields}>
              <ChoiceGroup label="Comfortable duration" onChange={value => update('meetupDuration', value)} options={[["30-minutes", 'About 30 min'], ["one-hour", 'About 1 hour'], ["flexible", 'Flexible']]} value={profile.meetupDuration} />
              <ChoiceGroup label="Advance notice" onChange={value => update('advanceNotice', value)} options={[["same-day", 'Same day'], ["few-days", 'A few days'], ["one-week", 'About a week']]} value={profile.advanceNotice} />
              <ChoiceGroup label="Physical greetings" onChange={value => update('physicalGreeting', value)} options={[["ask-first", 'Ask first'], ["wave", 'A wave is best'], ["hug-okay", 'Hugs are okay']]} value={profile.physicalGreeting} />
              <ChoiceGroup label="Calls" onChange={value => update('calls', value)} options={[["planned-only", 'Planned only'], ["spontaneous-welcome", 'Spontaneous welcome'], ["no-calls", 'No calls']]} value={profile.calls} />
              <ChoiceGroup label="Photos of me" onChange={value => update('photos', value)} options={[["ask-first", 'Ask first'], ["okay", 'Usually okay'], ["not-for-me", 'Not for me']]} value={profile.photos} />
            </View> : null}
          </> : null}

          {chapter === 'privacy' ? <>
            <SectionLabel label="DISCOVERY" />
            <ChoiceGroup label="Profile visibility" onChange={value => update('visibility', value)} options={[["discoverable", 'People in discovery'], ["connections", 'Connections only'], ["private", 'Paused']]} value={profile.visibility} />
            <View style={styles.note}><Ionicons color={colors.primary} name="shield-checkmark-outline" size={22} /><AppText color={colors.textMuted} style={styles.noteCopy} variant="caption">Only signed-in Unmasked members can see discovery profiles. Your exact location and account email are never shown.</AppText></View>
            <ToggleRow description="When off, people see your city without kilometres." label="Show approximate distance" onChange={value => update('showDistance', value)} value={profile.showDistance} />
            <ToggleRow description="You can still keep the rest of your profile visible." label="Show my energy status" onChange={value => update('showEnergy', value)} value={profile.showEnergy} />
          </> : null}

          <View style={styles.doneArea}>
            <AppButton disabled={loading || essentialsIncomplete} fullWidth label="Done" loading={saving} onPress={done} />
            <AppText color={colors.textMuted} style={styles.center} variant="caption">You can return and change this whenever you like.</AppText>
          </View>
        </View>
      )}
    </Screen>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <View style={styles.sectionLabel}><View style={styles.sectionDash} /><AppText color={colors.primary} variant="label">{label}</AppText></View>;
}

function MoreToggle({ open, onPress }: { open: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={onPress} style={styles.moreToggle}><AppText color={colors.primary} variant="bodyStrong">{open ? 'Fewer options' : 'More ways to personalize'}</AppText><Ionicons color={colors.primary} name={open ? 'chevron-up' : 'chevron-down'} size={20} /></Pressable>;
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  intro: { gap: spacing.sm }, form: { gap: spacing.lg },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm }, sectionDash: { width: 24, height: 2, backgroundColor: colors.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }, removeChip: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: spacing.xs, borderRadius: radii.pill, backgroundColor: colors.primarySoft, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  moreToggle: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: spacing.sm },
  moreFields: { gap: spacing.lg }, note: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, borderRadius: radii.md, backgroundColor: colors.primarySoft, padding: spacing.md }, noteCopy: { flex: 1 },
  doneArea: { gap: spacing.sm, marginTop: spacing.lg }, center: { textAlign: 'center' },
});
