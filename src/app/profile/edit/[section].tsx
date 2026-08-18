import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import {
  AppText,
  Screen,
  ScreenHeader,
  colors,
  radii,
  spacing,
} from "@/design-system";
import { CityAutocomplete } from "@/features/profile/components/CityAutocomplete";
import { DateOfBirthPicker } from "@/features/profile/components/DateOfBirthPicker";
import { ProfilePhotoPicker } from "@/features/profile/components/ProfilePhotoPicker";
import {
  ChoiceGroup,
  FormField,
  InlineAddField,
  LanguagePicker,
  MultiChoiceGroup,
  PronounPicker,
  ToggleRow,
} from "@/features/profile/components/ProfileFormControls";
import {
  profileOptions,
  requiredProfileFieldsComplete,
} from "@/features/profile/profileEditorModel";
import { useEditableProfile } from "@/features/profile/useEditableProfile";
import { useAuth } from "@/providers/AuthProvider";

const pairs = <T extends string>(items?: readonly T[]) =>
  (items ?? []).map((item) => [item, item] as const);

const chapterCopy = {
  personal: ["My profile", "The details that help people get to know you."],
  connection: [
    "How I connect",
    "What friendship and communication look like for you.",
  ],
  comfort: [
    "What feels comfortable",
    "Preferences that make time together feel easier.",
  ],
  privacy: [
    "Privacy and discovery",
    "You decide how visible your profile should be.",
  ],
} as const;

export default function EditProfileChapterScreen() {
  const { section } = useLocalSearchParams<{ section: string }>();
  const chapter =
    section && section in chapterCopy
      ? (section as keyof typeof chapterCopy)
      : "personal";
  const { loading, profile, save, saving, update } = useEditableProfile();
  const { user } = useAuth();
  const [interest, setInterest] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const requiredFieldsIncomplete =
    chapter === "personal" && !requiredProfileFieldsComplete(profile);

  const addInterest = () => {
    const next = interest.trim();
    if (
      !next ||
      profile.interests.some(
        (item) => item.toLowerCase() === next.toLowerCase(),
      )
    )
      return;
    update("interests", [...profile.interests, next]);
    setInterest("");
  };
  const done = async () => {
    if (
      chapter === "personal" &&
      !requiredProfileFieldsComplete(profile)
    ) {
      Alert.alert(
        "Complete the required fields",
        "Add your display name, date of birth, pronouns, city, languages, an activity introduction, and at least one interest.",
      );
      return;
    }
    try {
      await save();
      router.back();
    } catch {
      Alert.alert(
        "Could not save your profile",
        "Please check your connection and try again.",
      );
    }
  };

  return (
    <Screen
      contentStyle={styles.screen}
      header={
        <ScreenHeader
          actionDisabled={loading || saving || requiredFieldsIncomplete}
          actionLabel={saving ? "Saving…" : "Done"}
          onAction={done}
          onBack={() => router.back()}
          title={chapterCopy[chapter][0]}
        />
      }
    >
      <View style={styles.intro}>
        <AppText color={colors.textMuted}>{chapterCopy[chapter][1]}</AppText>
      </View>

      {loading ? (
        <AppText color={colors.textMuted}>Loading your profile…</AppText>
      ) : (
        <View style={styles.form}>
          {chapter === "personal" ? (
            <>
              <SectionLabel
                description="The details people will see first."
                label="About you"
              />
              {user ? (
                <ProfilePhotoPicker
                  name={profile.displayName}
                  onChange={(value) => update("photoUrl", value)}
                  photoUrl={profile.photoUrl}
                  userId={user.uid}
                />
              ) : null}
              <FormField
                label="Display name"
                onChangeText={(value) => update("displayName", value)}
                placeholder="Your name or nickname"
                value={profile.displayName}
              />
              <PronounPicker
                onChange={(value) => update("pronouns", value)}
                value={profile.pronouns}
              />
              <DateOfBirthPicker
                onChange={(value) => update("dateOfBirth", value)}
                value={profile.dateOfBirth}
              />
              <CityAutocomplete
                onChange={(value) => update("city", value)}
                value={profile.city}
              />
              <LanguagePicker
                onChange={(value) => update("languages", value)}
                value={profile.languages}
              />
              <FormField
                label="What would you enjoy doing together?"
                maxLength={320}
                multiline
                onChangeText={(value) => update("bio", value)}
                placeholder="Quiet walks, museum visits, playing games side by side…"
                value={profile.bio}
              />
              <View style={styles.interestsGroup}>
                <SectionLabel
                  description="Specific and unusual interests are welcome."
                  label="Interests"
                />
                <InlineAddField
                  onAdd={addInterest}
                  onChangeText={setInterest}
                  placeholder="Urban planning, cozy games…"
                  value={interest}
                />
                {profile.interests.length ? (
                  <View style={styles.chips}>
                    {profile.interests.map((item) => (
                      <Pressable
                        accessibilityLabel={`Remove ${item}`}
                        key={item}
                        onPress={() =>
                          update(
                            "interests",
                            profile.interests.filter((value) => value !== item),
                          )
                        }
                        style={styles.removeChip}
                      >
                        <AppText variant="caption">{item}</AppText>
                        <Ionicons
                          color={colors.textMuted}
                          name="close"
                          size={16}
                        />
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
              <MoreToggle
                closedLabel="Add more about me"
                open={moreOpen}
                onPress={() => setMoreOpen((value) => !value)}
              />
              {moreOpen ? (
                <View style={styles.moreFields}>
                  <ChoiceGroup
                    allowDeselect
                    hint="Optional"
                    label="Profile prompt"
                    onChange={(value) => {
                      update("prompt", value);
                      if (!value) update("promptAnswer", "");
                    }}
                    options={pairs(profileOptions.prompts)}
                    value={profile.prompt}
                  />
                  {profile.prompt ? (
                    <FormField
                      label="Your answer"
                      maxLength={240}
                      multiline
                      onChangeText={(value) => update("promptAnswer", value)}
                      placeholder="There is no perfect answer."
                      value={profile.promptAnswer}
                    />
                  ) : null}
                  <FormField
                    hint="Diagnosis is never required. Share only what feels useful."
                    label="How I describe myself"
                    maxLength={240}
                    multiline
                    onChangeText={(value) => update("identityNote", value)}
                    placeholder="Optional"
                    value={profile.identityNote}
                  />
                </View>
              ) : null}
            </>
          ) : null}

          {chapter === "connection" ? (
            <>
              <SectionLabel label="What I'm looking for" />
              <MultiChoiceGroup
                hint="Choose as many as feel right."
                label="Connection goals"
                onChange={(value) => update("connectionGoals", value)}
                options={profileOptions.goals}
                values={profile.connectionGoals}
              />
              <MultiChoiceGroup
                label="Ways I like to connect"
                onChange={(value) => update("connectionStyles", value)}
                options={profileOptions.styles}
                values={profile.connectionStyles}
              />
              <SectionLabel label="Communication" />
              <ChoiceGroup
                label="Usual response time"
                onChange={(responseTime) =>
                  update("communication", {
                    ...profile.communication,
                    responseTime,
                  })
                }
                options={[
                  ["same-day", "Same day"],
                  ["one-to-three-days", "1–3 days"],
                  ["when-energy-allows", "When energy allows"],
                ]}
                value={profile.communication.responseTime}
              />
              <MoreToggle
                open={moreOpen}
                onPress={() => setMoreOpen((value) => !value)}
              />
              {moreOpen ? (
                <View style={styles.moreFields}>
                  <MultiChoiceGroup
                    label="Preferred channels"
                    onChange={(preferredChannels) =>
                      update("communication", {
                        ...profile.communication,
                        preferredChannels,
                      })
                    }
                    options={profileOptions.channels}
                    values={profile.communication.preferredChannels ?? []}
                  />
                  <ChoiceGroup
                    label="Planning style"
                    onChange={(value) => update("planningStyle", value)}
                    options={[
                      ["concrete", "Concrete plans"],
                      ["flexible", "Flexible plans"],
                      ["either", "Either is okay"],
                    ]}
                    value={profile.planningStyle}
                  />
                  <ToggleRow
                    description="Helpful labels such as [joke] and [literal]."
                    label="I appreciate tone indicators"
                    onChange={(toneIndicators) =>
                      update("communication", {
                        ...profile.communication,
                        toneIndicators,
                      })
                    }
                    value={profile.communication.toneIndicators ?? false}
                  />
                </View>
              ) : null}
            </>
          ) : null}

          {chapter === "comfort" ? (
            <>
              <SectionLabel label="Places and conditions" />
              <MultiChoiceGroup
                hint="Preferences, not medical declarations."
                label="I'm most comfortable with"
                onChange={(value) => update("sensoryPreferences", value)}
                options={pairs(profileOptions.sensory)}
                values={profile.sensoryPreferences}
              />
              <MultiChoiceGroup
                label="Helpful meetup conditions"
                onChange={(value) => update("meetupPreferences", value)}
                options={pairs(profileOptions.meetups)}
                values={profile.meetupPreferences}
              />
              <MoreToggle
                open={moreOpen}
                onPress={() => setMoreOpen((value) => !value)}
              />
              {moreOpen ? (
                <View style={styles.moreFields}>
                  <ChoiceGroup
                    label="Advance notice"
                    onChange={(value) => update("advanceNotice", value)}
                    options={[
                      ["same-day", "Same day"],
                      ["few-days", "A few days"],
                      ["one-week", "About a week"],
                    ]}
                    value={profile.advanceNotice}
                  />
                  <ChoiceGroup
                    label="Physical greetings"
                    onChange={(value) => update("physicalGreeting", value)}
                    options={[
                      ["ask-first", "Ask first"],
                      ["wave", "A wave is best"],
                      ["hug-okay", "Hugs are okay"],
                    ]}
                    value={profile.physicalGreeting}
                  />
                  <ChoiceGroup
                    label="Calls"
                    onChange={(value) => update("calls", value)}
                    options={[
                      ["planned-only", "Planned only"],
                      ["spontaneous-welcome", "Spontaneous welcome"],
                      ["no-calls", "No calls"],
                    ]}
                    value={profile.calls}
                  />
                  <ChoiceGroup
                    label="Photos of me"
                    onChange={(value) => update("photos", value)}
                    options={[
                      ["ask-first", "Ask first"],
                      ["okay", "Usually okay"],
                      ["not-for-me", "Not for me"],
                    ]}
                    value={profile.photos}
                  />
                </View>
              ) : null}
            </>
          ) : null}

          {chapter === "privacy" ? (
            <>
              <SectionLabel label="Discovery" />
              <ChoiceGroup
                label="Profile visibility"
                onChange={(value) => update("visibility", value)}
                options={[
                  ["discoverable", "People in discovery"],
                  ["connections", "Connections only"],
                  ["private", "Paused"],
                ]}
                value={profile.visibility}
              />
              <ToggleRow
                description="When off, people see your city without kilometres."
                label="Show approximate distance"
                onChange={(value) => update("showDistance", value)}
                value={profile.showDistance}
              />
              <View style={styles.note}>
                <Ionicons
                  color={colors.primary}
                  name="shield-checkmark-outline"
                  size={22}
                />
                <AppText
                  color={colors.textMuted}
                  style={styles.noteCopy}
                  variant="caption"
                >
                  Your exact location and account email are never shown.
                </AppText>
              </View>
              <ToggleRow
                description="You can still keep the rest of your profile visible."
                label="Show my energy status"
                onChange={(value) => update("showEnergy", value)}
                value={profile.showEnergy}
              />
            </>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

function SectionLabel({
  label,
  description,
}: {
  label: string;
  description?: string;
}) {
  return (
    <View style={styles.sectionLabel}>
      <AppText variant="heading">{label}</AppText>
      {description ? (
        <AppText color={colors.textMuted} variant="caption">
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

function MoreToggle({
  open,
  onPress,
  closedLabel = "More ways to personalize",
}: {
  open: boolean;
  onPress: () => void;
  closedLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      style={styles.moreToggle}
    >
      <Ionicons
        color={colors.primary}
        name={open ? "remove" : "add"}
        size={20}
      />
      <AppText color={colors.primary} variant="bodyStrong">
        {open ? "Show fewer options" : closedLabel}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.md, paddingTop: spacing.md },
  intro: { gap: spacing.sm },
  form: { gap: spacing.lg },
  sectionLabel: { gap: spacing.xxs, marginTop: spacing.sm },
  interestsGroup: { gap: spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  removeChip: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  moreToggle: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
  },
  moreFields: { gap: spacing.lg },
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.primarySoft,
    padding: spacing.md,
  },
  noteCopy: { flex: 1 },
});
