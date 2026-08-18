import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/design-system';
import type { EnergyLevel } from '@/types/domain';

const levels: EnergyLevel[] = [1, 2, 3, 4, 5];

interface SocialBatteryIndicatorProps {
  level: EnergyLevel;
  onPress?: () => void;
}

export function SocialBatteryIndicator({ level, onPress }: SocialBatteryIndicatorProps) {
  const indicator = (
    <View
      accessible={!onPress}
      accessibilityLabel={`Social battery ${level} out of 5`}
      accessibilityRole={onPress ? undefined : 'text'}
      style={styles.badge}>
      <Ionicons color={colors.primary} name="battery-full-outline" size={20} />
      <View style={styles.bolts}>
        {levels.slice(0, level).map(bolt => (
          <Ionicons color={colors.secondary} key={bolt} name="flash" size={10} />
        ))}
      </View>
    </View>
  );

  if (!onPress) return indicator;

  return (
    <Pressable
      accessibilityHint="Opens the social battery rating"
      accessibilityLabel={`Social battery ${level} out of 5`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      {indicator}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 48,
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.xs,
  },
  bolts: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  pressed: { opacity: 0.7 },
});
