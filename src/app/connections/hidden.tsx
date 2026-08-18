import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, Screen, ScreenHeader, colors, radii, spacing } from '@/design-system';
import {
  getHiddenProfiles,
  type HiddenProfile,
  unhideProfile,
} from '@/features/connections/connectionRequestService';
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar';
import { useAuth } from '@/providers/AuthProvider';

export default function HiddenProfilesScreen() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<HiddenProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string>();

  useFocusEffect(useCallback(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    getHiddenProfiles(user.uid)
      .then(result => { if (active) setProfiles(result); })
      .catch(() => { if (active) setProfiles([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user]));

  const unhide = async (profile: HiddenProfile) => {
    if (!user) return;
    setUpdating(profile.id);
    try {
      await unhideProfile(user.uid, profile.id);
      setProfiles(current => current.filter(item => item.id !== profile.id));
    } catch {
      Alert.alert('Could not unhide this profile', 'Please check your connection and try again.');
    } finally {
      setUpdating(undefined);
    }
  };

  return (
    <Screen header={<ScreenHeader onBack={() => router.back()} title="Hidden profiles" />}>
      <View style={styles.intro}>
        <AppText variant="display">Out of sight, still in your control</AppText>
        <AppText color={colors.textMuted}>
          Hidden people do not appear in Discovery, and their requests are automatically declined.
        </AppText>
      </View>

      {loading ? (
        <Card><AppText color={colors.textMuted}>Checking hidden profiles…</AppText></Card>
      ) : profiles.length ? (
        <View style={styles.list}>
          {profiles.map(profile => (
            <Card key={profile.id} style={styles.profileCard}>
              <View style={styles.identity}>
                <ProfileAvatar name={profile.name} photoUrl={profile.photoUrl} size={52} />
                <View style={styles.copy}>
                  <AppText variant="heading">{profile.name}</AppText>
                  {profile.city ? <AppText color={colors.textMuted} variant="caption">{profile.city}</AppText> : null}
                </View>
              </View>
              <AppButton
                fullWidth
                label="Unhide profile"
                loading={updating === profile.id}
                onPress={() => unhide(profile)}
                variant="quiet"
              />
            </Card>
          ))}
        </View>
      ) : (
        <Card style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons color={colors.primary} name="eye-outline" size={28} />
          </View>
          <AppText variant="heading">No hidden profiles</AppText>
          <AppText color={colors.textMuted} style={styles.centered}>
            Anyone you hide in Discovery will appear here.
          </AppText>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  list: { gap: spacing.md, marginTop: spacing.xl },
  profileCard: { gap: spacing.md },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  copy: { flex: 1, gap: spacing.xxs },
  empty: { alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  emptyIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.primarySoft },
  centered: { textAlign: 'center' },
});
