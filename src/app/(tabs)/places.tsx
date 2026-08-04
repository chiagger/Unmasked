import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Pill, Screen, colors, spacing } from '@/design-system';
import { mockVenues } from '@/features/venues/mockVenues';

export default function PlacesScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="display">Calm places nearby</AppText>
        <AppText color={colors.textMuted}>
          Community-rated spaces for lower-pressure first meetups.
        </AppText>
      </View>

      <View style={styles.list}>
        {mockVenues.map(venue => (
          <Card key={venue.id} style={styles.venue}>
            <View style={styles.venueTitleRow}>
              <View style={styles.venueTitle}>
                <AppText variant="heading">{venue.name}</AppText>
                <AppText color={colors.textMuted} variant="caption">
                  {venue.kind} · {venue.distanceKm} km
                </AppText>
              </View>
              <View style={styles.rating}>
                <Ionicons color={colors.secondary} name="star" size={16} />
                <AppText variant="label">{venue.rating}</AppText>
              </View>
            </View>
            <View style={styles.pills}>
              <Pill label={venue.sensory.noise} tone="primary" />
              <Pill label={`${venue.sensory.lighting} light`} />
              <Pill label={venue.sensory.crowd} />
              {venue.sensory.hasQuietSpace && <Pill label="Quiet space" tone="primary" />}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginBottom: spacing.xl },
  list: { gap: spacing.md },
  venue: { gap: spacing.md },
  venueTitleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  venueTitle: { flex: 1, gap: spacing.xxs },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
});
