import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, Screen, colors, radii, spacing } from '@/design-system';

interface AuthScreenProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthScreen({ children, subtitle, title }: AuthScreenProps) {
  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.brandMark} accessibilityElementsHidden>
        <Ionicons color={colors.primary} name="leaf-outline" size={30} />
      </View>
      <View style={styles.heading}>
        <AppText variant="title">{title}</AppText>
        <AppText color={colors.textMuted}>{subtitle}</AppText>
      </View>
      <Card style={styles.card}>{children}</Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: spacing.lg },
  brandMark: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    backgroundColor: colors.primarySoft,
  },
  heading: { gap: spacing.xs },
  card: { gap: spacing.md },
});
