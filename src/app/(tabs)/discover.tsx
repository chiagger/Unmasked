import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText, Card, Screen, colors, spacing } from '@/design-system';
import { sendConnectionRequest } from '@/features/connections/connectionRequestService';
import {
  getDiscoveryProfiles,
  hideDiscoveryProfile,
  type DiscoveryProfile,
} from '@/features/discovery/discoveryService';
import { ProfileCarousel } from '@/features/discovery/ProfileCarousel';
import { useEditableProfile } from '@/features/profile/useEditableProfile';
import { useAuth } from '@/providers/AuthProvider';

export default function DiscoverScreen() {
  const { user } = useAuth();
  const { profile } = useEditableProfile();
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    getDiscoveryProfiles(user.uid, profile.interests)
      .then(result => {
        if (active) {
          setProfiles(result);
          setCurrentIndex(0);
        }
      })
      .catch(() => {
        if (active) setProfiles([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [profile.interests, user]));

  const connect = (selected: DiscoveryProfile) => {
    if (!user || selected.requestStatus) return;
    setProfiles(current => current.map(item =>
      item.id === selected.id ? { ...item, requestStatus: 'pending' } : item,
    ));
    sendConnectionRequest(user.uid, selected.id).catch(() => {
      setProfiles(current => current.map(item =>
        item.id === selected.id ? { ...item, requestStatus: undefined } : item,
      ));
      Alert.alert(
        'Could not send your request',
        'The request is unavailable right now. Please try again later.',
      );
    });
  };

  const hide = (selected: DiscoveryProfile) => {
    if (!user) return;
    Alert.alert(
      `Hide ${selected.profile.displayName}?`,
      'You will no longer see this profile. Any request from them will be automatically declined.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Hide profile',
          style: 'destructive',
          onPress: () => {
            hideDiscoveryProfile(user.uid, selected.id)
              .then(() => {
                setProfiles(current => current.filter(item => item.id !== selected.id));
                setCurrentIndex(index =>
                  Math.max(0, Math.min(index, profiles.length - 2)),
                );
              })
              .catch(() => {
                Alert.alert(
                  'Could not hide this profile',
                  'Please check your connection and try again.',
                );
              });
          },
        },
      ],
    );
  };

  return (
    <Screen contentStyle={styles.screen} scroll={false}>
      <View style={styles.header}>
        <AppText style={styles.title} variant="display">People on your wavelength</AppText>
        {profiles.length ? (
          <AppText color={colors.primary} variant="label">
            {currentIndex + 1} of {profiles.length}
          </AppText>
        ) : null}
      </View>

      {loading ? (
        <Card><AppText color={colors.textMuted}>Finding people for you…</AppText></Card>
      ) : profiles.length ? (
        <ProfileCarousel
          index={currentIndex}
          onConnect={connect}
          onHide={hide}
          onIndexChange={setCurrentIndex}
          profiles={profiles}
        />
      ) : (
        <Card style={styles.empty}>
          <AppText variant="heading">No profiles to show</AppText>
          <AppText color={colors.textMuted} style={styles.centered}>
            New profiles—or profiles you leave for later—will appear here.
          </AppText>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.lg, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  title: { flex: 1 },
  empty: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  centered: { textAlign: 'center' },
});
