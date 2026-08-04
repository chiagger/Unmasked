import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText, colors, layout, radii, spacing, typography } from '@/design-system';

interface AuthFieldProps extends TextInputProps {
  label: string;
  error?: string;
  password?: boolean;
  valid?: boolean;
}

export const AuthField = forwardRef<TextInput, AuthFieldProps>(function AuthField(
  {
    error,
    label,
    onBlur,
    onFocus,
    password = false,
    style,
    valid = false,
    ...props
  },
  ref,
) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [wasBlurred, setWasBlurred] = useState(false);

  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <View
        style={[
          styles.inputShell,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}>
        <TextInput
          {...props}
          ref={ref}
          maxFontSizeMultiplier={2}
          onBlur={(event) => {
            setIsFocused(false);
            setWasBlurred(true);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={password && !isPasswordVisible}
          style={[styles.input, style]}
        />
        {!password && valid && wasBlurred ? (
          <View accessibilityLabel="Email format valid" style={styles.validIcon}>
            <Ionicons color={colors.success} name="checkmark-circle" size={22} />
          </View>
        ) : null}
        {password ? (
          <Pressable
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setIsPasswordVisible((visible) => !visible)}
            style={styles.passwordToggle}>
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
  inputFocused: { borderColor: colors.focus, borderWidth: 2 },
  validIcon: {
    width: layout.minimumTouchTarget,
    height: layout.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
  passwordToggle: {
    width: layout.minimumTouchTarget,
    height: layout.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
});
