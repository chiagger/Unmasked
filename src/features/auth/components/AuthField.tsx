import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText, colors, layout, radii, spacing, typography } from '@/design-system';

interface AuthFieldProps extends TextInputProps {
  label: string;
  error?: string;
  password?: boolean;
}

export const AuthField = forwardRef<TextInput, AuthFieldProps>(function AuthField(
  { error, label, password = false, style, ...props },
  ref,
) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <View style={[styles.inputShell, error && styles.inputError]}>
        <TextInput
          {...props}
          ref={ref}
          maxFontSizeMultiplier={2}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={password && !isPasswordVisible}
          style={[styles.input, style]}
        />
        {password ? (
          <Pressable
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setIsPasswordVisible((visible) => !visible)}>
            <Ionicons
              color={colors.textMuted}
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText color={colors.warning} variant="caption">
          {error}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: { gap: spacing.xs },
  inputShell: {
    minHeight: layout.minimumTouchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: spacing.md,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: layout.minimumTouchTarget,
    color: colors.text,
  },
  inputError: { borderColor: colors.warning },
});
