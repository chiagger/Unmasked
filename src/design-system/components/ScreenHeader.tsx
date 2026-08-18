import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/design-system/components/AppText';
import { colors, layout, radii } from '@/design-system/tokens';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
}

export function ScreenHeader({
  title,
  onBack,
  backLabel = 'Back',
  actionLabel,
  onAction,
  actionDisabled = false,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          accessibilityLabel={backLabel}
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Ionicons color={colors.primary} name="arrow-back" size={22} />
        </Pressable>
      ) : <View style={styles.spacer} />}
      <AppText style={styles.title} variant="label">{title}</AppText>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: actionDisabled }}
          disabled={actionDisabled}
          onPress={onAction}
          style={styles.action}>
          <AppText color={actionDisabled ? colors.textMuted : colors.primary} variant="label">{actionLabel}</AppText>
        </Pressable>
      ) : <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: layout.minimumTouchTarget,
    height: layout.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  pressed: { backgroundColor: colors.primarySoft },
  title: { textAlign: 'center' },
  spacer: { width: layout.minimumTouchTarget },
  action: { minWidth: layout.minimumTouchTarget, minHeight: layout.minimumTouchTarget, alignItems: 'flex-end', justifyContent: 'center' },
});
