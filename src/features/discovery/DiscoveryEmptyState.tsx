import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import {
  AppButton,
  AppText,
  colors,
  radii,
  shadows,
  spacing,
} from "@/design-system";

interface DiscoveryEmptyStateProps {
  onRefresh: () => void;
  onViewConnections: () => void;
  refreshing?: boolean;
}

export function DiscoveryEmptyState({
  onRefresh,
  onViewConnections,
  refreshing = false,
}: DiscoveryEmptyStateProps) {
  const wobble = useSharedValue(0);
  const illustrationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wobble.value}deg` }],
  }));

  useEffect(() => {
    if (refreshing) {
      wobble.set(
        withSequence(
          withTiming(-4, { duration: 90 }),
          withTiming(4, { duration: 110 }),
          withTiming(-2, { duration: 90 }),
          withTiming(0, { duration: 100 }),
        ),
      );
    }
  }, [refreshing, wobble]);

  return (
    <View style={styles.root}>
      <Animated.View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.illustration, illustrationStyle]}
      >
        <View style={[styles.miniCard, styles.backCard]} />
        <View style={[styles.miniCard, styles.middleCard]} />
        <View style={[styles.miniCard, styles.frontCard]}>
          <View style={styles.sparkles}>
            <Ionicons color={colors.primary} name="happy-outline" size={30} />
            <AppText
              color={colors.secondary}
              style={styles.zzz}
              variant="caption"
            >
              zzz
            </AppText>
          </View>
          <View style={styles.cardLines}>
            <View style={styles.longLine} />
            <View style={styles.shortLine} />
          </View>
        </View>
      </Animated.View>

      <View style={styles.copy}>
        <AppText color={colors.primary} variant="label">
          DECK TEMPORARILY EMPTY
        </AppText>
        <AppText style={styles.centered} variant="title">
          You’ve reached the end of the people pile
        </AppText>
        <AppText color={colors.textMuted} style={styles.centered}>
          No new humans are hiding in here right now. We’ll shuffle them in as
          the community grows.
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton
          fullWidth
          icon={
            <Ionicons color={colors.surfaceRaised} name="refresh" size={19} />
          }
          label="Shuffle again"
          loading={refreshing}
          onPress={onRefresh}
        />
        <Pressable
          accessibilityRole="button"
          onPress={onViewConnections}
          style={({ pressed }) => [
            styles.secondaryAction,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            color={colors.primary}
            name="chatbubbles-outline"
            size={19}
          />
          <AppText color={colors.primary} variant="label">
            Visit my connections
          </AppText>
        </Pressable>
      </View>

      <AppText color={colors.textMuted} style={styles.note} variant="caption">
        Hidden profiles and people you’ve contacted are sitting this round out.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  illustration: { width: 156, height: 116 },
  miniCard: {
    position: "absolute",
    width: 112,
    height: 88,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
  },
  backCard: {
    top: 5,
    left: 6,
    transform: [{ rotate: "-8deg" }],
    opacity: 0.55,
  },
  middleCard: {
    top: 5,
    right: 6,
    transform: [{ rotate: "8deg" }],
    opacity: 0.75,
  },
  frontCard: {
    top: 14,
    left: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderTopWidth: 3,
    borderTopColor: colors.primary,
    padding: spacing.md,
    ...shadows.soft,
  },
  sparkles: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  zzz: { position: "absolute", top: -10, right: -12, fontWeight: "700" },
  cardLines: { flex: 1, gap: spacing.xs },
  longLine: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  shortLine: {
    width: "68%",
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
  },
  copy: { maxWidth: 290, alignItems: "center", gap: spacing.sm },
  centered: { textAlign: "center" },
  actions: { width: "100%", maxWidth: 280, gap: spacing.xs },
  secondaryAction: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radii.md,
  },
  pressed: { backgroundColor: colors.primarySoft },
  note: { maxWidth: 280, textAlign: "center" },
});
