import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Screen, colors, radii, spacing } from '@/design-system';

interface AuthScreenProps {
  children: React.ReactNode;
  eyebrow?: string;
  footer?: React.ReactNode;
  notice?: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthScreen({
  children,
  eyebrow,
  footer,
  notice,
  subtitle,
  title,
}: AuthScreenProps) {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.brandMark} accessibilityElementsHidden>
        <Ionicons color={colors.primary} name="leaf-outline" size={30} />
      </View>
      <View style={styles.heading}>
        {eyebrow ? (
          <AppText color={colors.primary} variant="label">
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="title">{title}</AppText>
        <AppText color={colors.textMuted}>{subtitle}</AppText>
      </View>
      {notice}
      <Card style={styles.card}>{children}</Card>
      {footer}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, paddingTop: spacing.lg },
  brandMark: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
  },
  heading: { gap: spacing.xxs, marginBottom: spacing.sm },
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    shadowOpacity: 0.025,
    elevation: 1,
  },
});
