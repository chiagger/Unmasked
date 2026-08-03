import { StyleSheet, View } from 'react-native';

import { AppText } from '@/design-system/components/AppText';
import { colors, radii, spacing } from '@/design-system/tokens';

interface PillProps {
  label: string;
  tone?: 'sage' | 'slate' | 'neutral' | 'rose';
}

const toneColors = {
  sage: colors.primarySoft,
  slate: colors.secondarySoft,
  neutral: colors.surfaceMuted,
  rose: colors.warningSoft,
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
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
