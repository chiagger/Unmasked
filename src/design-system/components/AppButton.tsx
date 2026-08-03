import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/design-system/components/AppText';
import { colors, layout, radii, spacing } from '@/design-system/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'quiet';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  accessibilityHint?: string;
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  accessibilityHint,
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? colors.surfaceRaised : colors.text}
          />
        ) : (
          icon
        )}
        <AppText
          variant="label"
          color={variant === 'primary' ? colors.surfaceRaised : colors.text}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.minimumTouchTarget,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.secondarySoft,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  quiet: { backgroundColor: colors.surface },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  fullWidth: { alignSelf: 'stretch' },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
});
