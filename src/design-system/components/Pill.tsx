import { StyleSheet, View } from 'react-native';

import { AppText } from '@/design-system/components/AppText';
import { colors, radii, spacing } from '@/design-system/tokens';

interface PillProps {
  label: string;
  tone?: 'primary' | 'neutral' | 'warning';
}

const toneColors = {
  primary: colors.primarySoft,
  neutral: colors.surfaceMuted,
  warning: colors.warningSoft,
};

export function Pill({ label, tone = 'neutral' }: PillProps) {
  return (
    <View style={[styles.pill, { backgroundColor: toneColors[tone] }]}>
      <AppText variant="caption">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radii.lg,
    overflow: 'hidden',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
