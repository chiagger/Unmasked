import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppText, Card, Screen, colors, spacing } from '@/design-system';
import { sendConnectionRequest } from '@/features/connections/connectionRequestService';
import { ConnectionRequestComposer } from '@/features/connections/components/ConnectionRequestComposer';
import {
  getDiscoveryProfiles,
  hasSeenHideExplanation,
  hideDiscoveryProfile,
  markHideExplanationSeen,
  type DiscoveryProfile,
} from '@/features/discovery/discoveryService';
import { DiscoveryEmptyState } from '@/features/discovery/DiscoveryEmptyState';
import { ProfileCarousel } from '@/features/discovery/ProfileCarousel';
import { useEditableProfile } from '@/features/profile/useEditableProfile';
import { useAuth } from '@/providers/AuthProvider';

export default function DiscoverScreen() {
  const { user } = useAuth();
  const { profile } = useEditableProfile();
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connectionTarget, setConnectionTarget] = useState<DiscoveryProfile>();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [hideExplanationSeen, setHideExplanationSeen] = useState(false);

  const loadDiscovery = useCallback(async (isActive: () => boolean = () => true) => {
    if (!user) return;
    setLoading(true);
    try {
      const [result, hasSeenExplanation] = await Promise.all([
        getDiscoveryProfiles(user.uid, profile.interests),
        hasSeenHideExplanation(user.uid).catch(() => false),
      ]);
      if (isActive()) {
        setProfiles(result);
        setCurrentIndex(0);
        setHideExplanationSeen(hasSeenExplanation);
      }
    } catch {
      if (isActive()) setProfiles([]);
    } finally {
      if (isActive()) {
        setHasLoaded(true);
        setLoading(false);
      }
    }
  }, [profile.interests, user]);

  useFocusEffect(useCallback(() => {
    let active = true;
    loadDiscovery(() => active);
    return () => { active = false; };
  }, [loadDiscovery]));

  const connect = async (message: string) => {
    const selected = connectionTarget;
    if (!user || !selected || selected.requestStatus) return;
    setSendingRequest(true);
    try {
      await sendConnectionRequest(user.uid, selected.id, message);
      setProfiles(current => current.filter(item => item.id !== selected.id));
      setCurrentIndex(index => Math.max(0, Math.min(index, profiles.length - 2)));
      setConnectionTarget(undefined);
    } catch {
      Alert.alert(
        'Could not send your request',
        'The request is unavailable right now. Please try again later.',
      );
    } finally {
      setSendingRequest(false);
    }
  };

  const hide = (selected: DiscoveryProfile) => {
    if (!user) return;

    const hideSelectedProfile = () => {
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
    };

    if (hideExplanationSeen) {
      hideSelectedProfile();
      return;
    }

    setHideExplanationSeen(true);
    markHideExplanationSeen(user.uid).catch(() => undefined);
    Alert.alert(
      `Hide ${selected.profile.displayName}?`,
      'You will no longer see this profile. Any request from them will be automatically declined.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Hide profile',
          style: 'destructive',
          onPress: hideSelectedProfile,
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

      {loading && !hasLoaded ? (
        <Card><AppText color={colors.textMuted}>Finding people for you…</AppText></Card>
      ) : profiles.length ? (
        <ProfileCarousel
          index={currentIndex}
          onConnect={setConnectionTarget}
          onHide={hide}
          onIndexChange={setCurrentIndex}
          profiles={profiles}
        />
      ) : (
        <DiscoveryEmptyState
          onRefresh={loadDiscovery}
          onViewConnections={() => router.push('/(tabs)/connections')}
          refreshing={loading}
        />
      )}

      {connectionTarget ? (
        <ConnectionRequestComposer
          displayName={connectionTarget.profile.displayName}
          onClose={() => setConnectionTarget(undefined)}
          onSend={connect}
          sending={sendingRequest}
          visible
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: spacing.lg, paddingBottom: spacing.xl },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.md },
  title: { flex: 1 },
});
