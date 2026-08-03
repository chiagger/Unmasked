import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typography } from '@/design-system/tokens';

type TextVariant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
}

export function AppText({
  variant = 'body',
  color = colors.text,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      maxFontSizeMultiplier={2}
      style={[typography[variant] as TextStyle, { color }, style]}
      {...props}
    />
  );
}
