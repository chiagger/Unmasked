import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, colors, layout, radii, spacing } from '@/design-system';
import { ProfileAvatar } from '@/features/profile/components/ProfileAvatar';

export function ChatHeader({
  name,
  onBack,
  photoUrl,
  presenceLabel,
}: {
  name: string;
  onBack: () => void;
  photoUrl?: string;
  presenceLabel: string;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityLabel="Back to connections"
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <Ionicons color={colors.primary} name="arrow-back" size={22} />
      </Pressable>
      <ProfileAvatar expandable name={name} photoUrl={photoUrl} size={44} />
      <View style={styles.identity}>
        <AppText numberOfLines={1} variant="heading">{name}</AppText>
        <AppText color={colors.textMuted} numberOfLines={1} variant="caption">
          {presenceLabel}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.canvas,
  },
  back: {
    width: layout.minimumTouchTarget,
    height: layout.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  identity: { flex: 1, gap: spacing.xxs },
  pressed: { backgroundColor: colors.primarySoft },
});
