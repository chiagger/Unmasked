import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radii, shadows, spacing } from '@/design-system/tokens';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
});
