import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, colors, radii, spacing } from '@/design-system';
import type { EnergyLevel } from '@/types/domain';
import { useEditableProfile } from '@/features/profile/useEditableProfile';

const options: { value: EnergyLevel; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { value: 'open', label: 'Open to chat', icon: 'chatbubble-ellipses-outline' },
  { value: 'limited', label: 'Low energy', icon: 'battery-half-outline' },
  { value: 'quiet', label: 'Quiet mode', icon: 'moon-outline' },
];

export function EnergyQuickStatus() {
  const { loading, profile, save, saving, setProfile } = useEditableProfile();

  const select = async (energy: EnergyLevel) => {
    const next = { ...profile, energy };
    setProfile(next);
    try {
      await save(next);
    } catch {
      setProfile(profile);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <AppText variant="heading">How social are you feeling?</AppText>
          <AppText color={colors.textMuted} variant="caption">A temporary signal, not a commitment.</AppText>
        </View>
        {saving ? <AppText color={colors.textMuted} variant="caption">Saving…</AppText> : null}
      </View>
      <View style={styles.options}>
        {options.map(option => {
          const selected = profile.energy === option.value;
          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled: loading || saving }}
              disabled={loading || saving}
              key={option.value}
              onPress={() => select(option.value)}
              style={[styles.option, selected && styles.optionSelected]}>
              <Ionicons color={selected ? colors.primary : colors.textMuted} name={option.icon} size={21} />
              <AppText color={selected ? colors.primary : colors.textMuted} style={styles.optionLabel} variant="caption">{option.label}</AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, paddingVertical: spacing.lg },
  heading: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, headingCopy: { flex: 1, gap: spacing.xxs },
  options: { flexDirection: 'row', gap: spacing.xs },
  option: { flex: 1, minHeight: 80, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderRadius: radii.md, backgroundColor: colors.surface, padding: spacing.xs },
  optionSelected: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primary }, optionLabel: { textAlign: 'center' },
});
