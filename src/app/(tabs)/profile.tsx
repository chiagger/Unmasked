import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import {
  AppButton,
  AppText,
  Card,
  Pill,
  Screen,
  colors,
  layout,
  radii,
  spacing,
} from "@/design-system";
import { EnergyQuickStatus } from "@/features/profile/components/EnergyQuickStatus";
import { PublicConnectionProfile } from "@/features/profile/components/PublicConnectionProfile";
import { useEditableProfile } from "@/features/profile/useEditableProfile";
import { useAuth } from "@/providers/AuthProvider";
import type { EnergyLevel } from "@/types/domain";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const { loading, profile, save, saving, setProfile } = useEditableProfile();
  const [batteryOpen, setBatteryOpen] = useState(false);

  const changeEnergy = async (energy: EnergyLevel) => {
    const previousProfile = profile;
    const nextProfile = { ...profile, energy };
    setProfile(nextProfile);

    try {
      await save(nextProfile);
    } catch {
      setProfile(previousProfile);
    }
  };

  return (
    <Screen
      header={
        <View style={styles.headerTitle}>
          <View style={styles.headerCopy}>
            <AppText variant="display">Your profile</AppText>
          </View>
          <AppButton
            label="Edit"
            onPress={() => router.push("/profile/edit")}
            variant="quiet"
          />
          <Pressable
            accessibilityLabel="Sign out"
            accessibilityRole="button"
            onPress={logout}
            style={({ pressed }) => [
              styles.signOutButton,
              pressed && styles.signOutPressed,
            ]}
          >
            <Ionicons
              color={colors.warning}
              name="log-out-outline"
              size={22}
            />
          </Pressable>
        </View>
      }>

      <View style={styles.previewLabel}>
        <Pill label="Public preview" tone="primary" />
        <AppText color={colors.textMuted} variant="caption">
          {profile.visibility === "private"
            ? "Discovery is paused"
            : "This is what other people see."}
        </AppText>
      </View>

      {loading ? (
        <Card>
          <AppText color={colors.textMuted}>Loading your profile…</AppText>
        </Card>
      ) : (
        <View style={styles.publicProfile}>
          <PublicConnectionProfile
            onEnergyPress={() => setBatteryOpen(true)}
            profile={{
              ...profile,
              displayName: profile.displayName || user?.displayName || "",
            }}
          />
        </View>
      )}

      <EnergyQuickStatus
        energy={profile.energy}
        loading={loading}
        onClose={() => setBatteryOpen(false)}
        onChange={changeEnergy}
        saving={saving}
        visible={batteryOpen}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerCopy: { flex: 1, gap: spacing.xs },
  signOutButton: {
    width: layout.minimumTouchTarget,
    height: layout.minimumTouchTarget,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
  },
  signOutPressed: { backgroundColor: colors.surface },
  previewLabel: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  publicProfile: { marginBottom: spacing.xl },
});
