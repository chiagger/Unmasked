import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppButton, AppText, colors, radii, spacing } from '@/design-system';
import type { DiscoveryProfile } from '@/features/discovery/discoveryService';
import { PublicConnectionProfile } from '@/features/profile/components/PublicConnectionProfile';

interface ProfileCarouselProps {
  index: number;
  onConnect: (profile: DiscoveryProfile) => void;
  onHide: (profile: DiscoveryProfile) => void;
  onIndexChange: (index: number) => void;
  profiles: DiscoveryProfile[];
}

export function ProfileCarousel({
  index,
  onConnect,
  onHide,
  onIndexChange,
  profiles,
}: ProfileCarouselProps) {
  const list = useRef<FlatList<DiscoveryProfile>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [size, setSize] = useState({ height: 360, width: 320 });
  const sideInset = spacing.md;
  const cardGap = spacing.sm;
  const cardWidth = Math.max(240, size.width - sideInset * 2);
  const snapInterval = cardWidth + cardGap;

  const measure = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    if (height > 0 && width > 0) {
      setSize({ height: Math.round(height), width: Math.round(width) });
    }
  };

  const finishSwipe = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / snapInterval);
    onIndexChange(Math.max(0, Math.min(profiles.length - 1, nextIndex)));
  };

  useEffect(() => {
    if (!profiles.length) return;
    list.current?.scrollToOffset({
      animated: false,
      offset: Math.min(index, profiles.length - 1) * snapInterval,
    });
  }, [index, profiles.length, snapInterval]);

  const listContentStyle = useMemo(() => ({
    paddingHorizontal: sideInset,
    paddingBottom: spacing.md,
  }), [sideInset]);

  return (
    <View onLayout={measure} style={styles.carousel}>
      <Animated.FlatList
        contentContainerStyle={listContentStyle}
        data={profiles}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          index,
          length: snapInterval,
          offset: snapInterval * index,
        })}
        horizontal
        ItemSeparatorComponent={CarouselGap}
        keyExtractor={profile => profile.id}
        nestedScrollEnabled
        onMomentumScrollEnd={finishSwipe}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        ref={list}
        removeClippedSubviews={false}
        snapToAlignment="start"
        snapToInterval={snapInterval}
        renderItem={({ index: itemIndex, item }) => (
          <Animated.View
            style={[
              styles.page,
              {
                width: cardWidth,
                opacity: scrollX.interpolate({
                  inputRange: [
                    (itemIndex - 1) * snapInterval,
                    itemIndex * snapInterval,
                    (itemIndex + 1) * snapInterval,
                  ],
                  outputRange: [0.72, 1, 0.72],
                  extrapolate: 'clamp',
                }),
                transform: [{
                  scale: scrollX.interpolate({
                    inputRange: [
                      (itemIndex - 1) * snapInterval,
                      itemIndex * snapInterval,
                      (itemIndex + 1) * snapInterval,
                    ],
                    outputRange: [0.96, 1, 0.96],
                    extrapolate: 'clamp',
                  }),
                }],
              },
            ]}>
            <PublicConnectionProfile
              footer={
                <View style={styles.footer}>
                  <Pressable
                    accessibilityHint="Removes this profile and automatically declines their requests"
                    accessibilityLabel={`Hide ${item.profile.displayName}`}
                    accessibilityRole="button"
                    onPress={() => onHide(item)}
                    style={({ pressed }) => [styles.hideButton, pressed && styles.pressed]}>
                    <Ionicons color={colors.warning} name="eye-off-outline" size={20} />
                    <AppText color={colors.warning} variant="label">Hide profile</AppText>
                  </Pressable>
                  <View style={styles.connectButton}>
                    {item.requestStatus ? (
                      <View style={styles.requestStatus}>
                        <Ionicons
                          color={item.requestStatus === 'accepted'
                            ? colors.success
                            : item.requestStatus === 'declined'
                              ? colors.warning
                              : colors.textMuted}
                          name={item.requestStatus === 'accepted'
                            ? 'checkmark-circle-outline'
                            : item.requestStatus === 'declined'
                              ? 'close-circle-outline'
                              : 'time-outline'}
                          size={20}
                        />
                        <AppText color={colors.textMuted} variant="label">
                          {item.requestStatus === 'accepted'
                            ? 'Connected'
                            : item.requestStatus === 'pending'
                              ? 'Request sent'
                              : 'Request declined'}
                        </AppText>
                      </View>
                    ) : (
                      <AppButton
                        fullWidth
                        label="Connect"
                        onPress={() => onConnect(item)}
                      />
                    )}
                  </View>
                </View>
              }
              height={Math.max(240, size.height - spacing.md)}
              profile={item.profile}
            />
          </Animated.View>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: { flex: 1, minHeight: 0, overflow: 'visible' },
  carouselGap: { width: spacing.sm },
  page: { overflow: 'visible' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
  },
  hideButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
  },
  connectButton: { flex: 1 },
  requestStatus: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  pressed: { backgroundColor: colors.warningSoft },
});

function CarouselGap() {
  return <View style={styles.carouselGap} />;
}
