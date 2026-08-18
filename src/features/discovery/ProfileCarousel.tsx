import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppText, colors, radii, shadows, spacing } from '@/design-system';
import type { DiscoveryProfile } from '@/features/discovery/discoveryService';
import { PublicConnectionProfile } from '@/features/profile/components/PublicConnectionProfile';

interface ProfileCarouselProps {
  index: number;
  onConnect: (profile: DiscoveryProfile) => void;
  onHide: (profile: DiscoveryProfile) => void;
  onIndexChange: (index: number) => void;
  profiles: DiscoveryProfile[];
}

const VISIBLE_CARD_COUNT = 3;
const SIDE_PEEK = spacing.lg;
const ACTION_DOCK_HEIGHT = 92;

export function ProfileCarousel({
  index,
  onConnect,
  onHide,
  onIndexChange,
  profiles,
}: ProfileCarouselProps) {
  const [size, setSize] = useState({ height: 360, width: 320 });
  const [isHandoff, setIsHandoff] = useState(false);
  const translateX = useSharedValue(0);
  const profileCount = profiles.length;
  const safeIndex = profileCount ? index % profileCount : 0;
  const cardWidth = Math.max(240, size.width - spacing.md * 2);
  const cardHeight = Math.max(240, size.height - ACTION_DOCK_HEIGHT);
  const sideOffset = size.width - spacing.md - SIDE_PEEK;

  const measure = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    if (height > 0 && width > 0) {
      setSize({ height: Math.round(height), width: Math.round(width) });
    }
  };

  const moveThroughDeck = (direction: number) => {
    if (profileCount < 2) return;
    setIsHandoff(true);
    onIndexChange((safeIndex + direction + profileCount) % profileCount);
    requestAnimationFrame(() => {
      translateX.value = 0;
      requestAnimationFrame(() => setIsHandoff(false));
    });
  };

  const swipe = Gesture.Pan()
    .enabled(!isHandoff)
    .activeOffsetX([-18, 18])
    .failOffsetY([-14, 14])
    .onUpdate(event => {
      translateX.value = event.translationX;
    })
    .onEnd(event => {
      const shouldAdvance = profileCount > 1
        && (Math.abs(translateX.value) > cardWidth * 0.28 || Math.abs(event.velocityX) > 700);

      if (shouldAdvance) {
        const direction = translateX.value < 0 ? 1 : -1;
        const destination = translateX.value < 0
          ? -(size.width + spacing.xxl)
          : size.width + spacing.xxl;
        translateX.value = withTiming(
          destination,
          { duration: 260 },
          finished => {
            if (finished) runOnJS(moveThroughDeck)(direction);
          },
        );
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 190 });
      }
    });

  const visibleOffsets = profileCount > 1 ? [-1, 1, 0] : [0];
  const visibleProfiles = visibleOffsets.map(offset => ({
    offset,
    profile: profiles[(safeIndex + offset + profileCount) % profileCount],
  }));

  return (
    <View onLayout={measure} style={styles.carousel}>
      <View style={[styles.deck, { height: cardHeight, width: size.width }]}>
        {visibleProfiles.map(({ offset, profile }) => (
          <DeckCard
            cardHeight={cardHeight}
            cardLeft={(size.width - cardWidth) / 2}
            cardWidth={cardWidth}
            key={`${profile.id}:${offset}`}
            offset={offset}
            profileId={profile.id}
            isHandoff={isHandoff}
            sideOffset={sideOffset}
            translateX={translateX}>
            {offset === 0 ? (
              <GestureDetector gesture={swipe}>
                <View style={styles.interactiveCard}>
                  <ProfileCard
                    height={cardHeight}
                    profile={profile}
                    showScrollIndicator
                  />
                </View>
              </GestureDetector>
            ) : (
              <View pointerEvents="none">
                <ProfileCard
                  height={cardHeight}
                  profile={profile}
                  showScrollIndicator={false}
                />
              </View>
            )}
          </DeckCard>
        ))}
      </View>
      <ActionDock
        onConnect={onConnect}
        onHide={onHide}
        profile={profiles[safeIndex]}
      />
    </View>
  );
}

function DeckCard({
  cardHeight,
  cardLeft,
  cardWidth,
  children,
  isHandoff,
  offset,
  profileId,
  sideOffset,
  translateX,
}: {
  cardHeight: number;
  cardLeft: number;
  cardWidth: number;
  children: React.ReactNode;
  isHandoff: boolean;
  offset: number;
  profileId: string;
  sideOffset: number;
  translateX: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const topProgress = interpolate(
      Math.abs(translateX.value),
      [0, cardWidth * 0.65],
      [0, 1],
      Extrapolation.CLAMP,
    );

    if (offset === 0) {
      if (isHandoff) {
        return {
          opacity: 1,
          transform: [{ translateX: 0 }, { rotate: '0deg' }],
        };
      }

      return {
        opacity: interpolate(topProgress, [0, 0.75, 1], [1, 1, 0.88]),
        transform: [
          { translateX: translateX.value },
          {
            rotate: `${interpolate(
              translateX.value,
              [-cardWidth, 0, cardWidth],
              [-6, 0, 6],
              Extrapolation.CLAMP,
            )}deg`,
          },
        ],
      };
    }

    const movementTowardCard = offset === 1 ? -translateX.value : translateX.value;
    const revealProgress = interpolate(
      movementTowardCard,
      [0, cardWidth * 0.65],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: interpolate(revealProgress, [0, 1], [0.78, 1]),
      transform: [
        { translateX: interpolate(revealProgress, [0, 1], [offset * sideOffset, 0]) },
        { translateY: interpolate(revealProgress, [0, 1], [spacing.sm, 0]) },
        { scale: interpolate(revealProgress, [0, 1], [0.96, 1]) },
      ],
    };
  }, [cardWidth, isHandoff, offset, sideOffset]);

  return (
    <Animated.View
      accessibilityElementsHidden={offset !== 0}
      importantForAccessibility={offset === 0 ? 'auto' : 'no-hide-descendants'}
      style={[
        styles.deckCard,
        {
          height: cardHeight,
          left: cardLeft,
          width: cardWidth,
          zIndex: offset === 0 ? VISIBLE_CARD_COUNT : 1,
        },
        animatedStyle,
      ]}
      testID={`discovery-card-${profileId}`}>
      {children}
    </Animated.View>
  );
}

function ProfileCard({
  height,
  profile,
  showScrollIndicator,
}: {
  height: number;
  profile: DiscoveryProfile;
  showScrollIndicator: boolean;
}) {
  return (
    <PublicConnectionProfile
      height={height}
      profile={profile.profile}
      showScrollIndicator={showScrollIndicator}
    />
  );
}

function ActionDock({
  onConnect,
  onHide,
  profile,
}: {
  onConnect: (profile: DiscoveryProfile) => void;
  onHide: (profile: DiscoveryProfile) => void;
  profile: DiscoveryProfile;
}) {
  const status = profile.requestStatus;
  const statusLabel = status === 'accepted'
    ? 'Connected'
    : status === 'pending'
      ? 'Sent'
      : 'Declined';
  const statusColor = status === 'accepted'
    ? colors.success
    : status === 'declined'
      ? colors.warning
      : colors.textMuted;

  return (
    <View style={styles.actionDock}>
      <View style={styles.actionItem}>
        <Pressable
          accessibilityHint="Removes this profile and automatically declines their requests"
          accessibilityLabel={`Hide ${profile.profile.displayName}`}
          accessibilityRole="button"
          onPress={() => onHide(profile)}
          style={({ pressed }) => [
            styles.actionButton,
            styles.hideButton,
            pressed && styles.actionPressed,
          ]}>
          <Ionicons color={colors.warning} name="eye-off-outline" size={26} />
        </Pressable>
        <AppText color={colors.warning} variant="label">Hide</AppText>
      </View>

      <View style={styles.actionItem}>
        {status ? (
          <View
            accessibilityLabel={statusLabel}
            accessibilityRole="text"
            style={[styles.actionButton, styles.statusButton]}>
            <Ionicons
              color={statusColor}
              name={status === 'accepted'
                ? 'checkmark-outline'
                : status === 'declined'
                  ? 'close-outline'
                  : 'time-outline'}
              size={28}
            />
          </View>
        ) : (
          <Pressable
            accessibilityHint={`Sends ${profile.profile.displayName} a connection request`}
            accessibilityLabel={`Connect with ${profile.profile.displayName}`}
            accessibilityRole="button"
            onPress={() => onConnect(profile)}
            style={({ pressed }) => [
              styles.actionButton,
              styles.connectButton,
              pressed && styles.actionPressed,
            ]}>
            <Ionicons color={colors.surfaceRaised} name="person-add-outline" size={26} />
          </Pressable>
        )}
        <AppText color={status ? statusColor : colors.primary} variant="label">
          {status ? statusLabel : 'Connect'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  deck: { position: 'relative' },
  deckCard: { position: 'absolute', top: 0, left: 0 },
  interactiveCard: { flex: 1 },
  actionDock: {
    height: ACTION_DOCK_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: spacing.xxl,
    paddingTop: spacing.md,
  },
  actionItem: {
    minWidth: 80,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  actionButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    ...shadows.soft,
  },
  hideButton: {
    borderWidth: 1.5,
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
  },
  connectButton: { backgroundColor: colors.primary },
  statusButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionPressed: { opacity: 0.72, transform: [{ scale: 0.94 }] },
});
