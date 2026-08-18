import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppButton, AppText, Card, Screen, colors, radii, spacing } from '@/design-system';
import {
  getIncomingConnectionRequests,
  respondToConnectionRequest,
  type IncomingConnectionRequest,
} from '@/features/connections/connectionRequestService';
import { useAuth } from '@/providers/AuthProvider';

export default function ConnectionsScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<IncomingConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string>();

  const loadRequests = useCallback(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    getIncomingConnectionRequests(user.uid)
      .then(result => {
        if (active) setRequests(result);
      })
      .catch(() => {
        if (active) setRequests([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user]);

  useFocusEffect(loadRequests);

  const respond = async (
    request: IncomingConnectionRequest,
    status: 'accepted' | 'declined',
  ) => {
    setRespondingTo(request.id);
    try {
      await respondToConnectionRequest(request.id, status);
      setRequests(current => current.filter(item => item.id !== request.id));
      if (status === 'accepted') {
        Alert.alert('Connection accepted', `You and ${request.senderName} are now connected.`);
      }
    } catch {
      Alert.alert('Could not update the request', 'Please check your connection and try again.');
    } finally {
      setRespondingTo(undefined);
    }
  };

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.header}>
        <AppText variant="display">Connections</AppText>
        <AppText color={colors.textMuted}>
          Requests are invitations, not matches. You always choose who joins your space.
        </AppText>
      </View>

      {loading ? (
        <Card><AppText color={colors.textMuted}>Checking your requests…</AppText></Card>
      ) : requests.length ? (
        <View style={styles.requests}>
          <AppText variant="heading">Connection requests</AppText>
          {requests.map(request => (
            <Card key={request.id} style={styles.requestCard}>
              <View style={styles.requestIdentity}>
                <View style={styles.avatar}>
                  <AppText color={colors.secondary} variant="heading">
                    {request.senderName[0]?.toUpperCase()}
                  </AppText>
                </View>
                <View style={styles.requestCopy}>
                  <AppText variant="heading">{request.senderName}</AppText>
                  {request.senderCity ? (
                    <AppText color={colors.textMuted} variant="caption">{request.senderCity}</AppText>
                  ) : null}
                  <AppText color={colors.textMuted} variant="caption">
                    Would like to connect with you
                  </AppText>
                </View>
              </View>
              <View style={styles.actions}>
                <AppButton
                  disabled={respondingTo === request.id}
                  label="Decline"
                  onPress={() => respond(request, 'declined')}
                  variant="quiet"
                />
                <View style={styles.acceptAction}>
                  <AppButton
                    disabled={respondingTo === request.id}
                    fullWidth
                    label={respondingTo === request.id ? 'Updating…' : 'Accept'}
                    onPress={() => respond(request, 'accepted')}
                  />
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Card style={styles.emptyCard}>
          <View style={styles.icon}>
            <Ionicons color={colors.primary} name="person-add-outline" size={28} />
          </View>
          <AppText variant="heading">No requests waiting</AppText>
          <AppText color={colors.textMuted} style={styles.centered}>
            When someone asks to connect, you can accept or decline here.
          </AppText>
          <AppButton label="Browse people" onPress={() => router.push('/(tabs)/discover')} />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl },
  header: { gap: spacing.sm },
  requests: { gap: spacing.md },
  requestCard: { gap: spacing.lg },
  requestIdentity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.secondarySoft },
  requestCopy: { flex: 1, gap: spacing.xxs },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.sm },
  acceptAction: { flex: 1 },
  emptyCard: { alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  icon: { width: 56, height: 56, borderRadius: radii.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  centered: { textAlign: 'center' },
});
