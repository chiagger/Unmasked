import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, colors, layout, radii, spacing } from '@/design-system';
import type { EnergyLevel } from '@/types/domain';

const levels: EnergyLevel[] = [1, 2, 3, 4, 5];

const levelLabels: Record<EnergyLevel, string> = {
  1: 'Running on empty',
  2: 'Keeping it quiet',
  3: 'Half charged',
  4: 'Feeling social',
  5: 'Fully charged',
};

interface EnergyQuickStatusProps {
  energy: EnergyLevel;
  loading?: boolean;
  onClose: () => void;
  saving?: boolean;
  onChange: (energy: EnergyLevel) => void;
  visible: boolean;
}

export function EnergyQuickStatus({
  energy,
  loading = false,
  onClose,
  onChange,
  saving = false,
  visible,
}: EnergyQuickStatusProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}>
      <View style={styles.sheetRoot}>
        <Pressable
          accessibilityLabel="Close social battery rating"
          onPress={onClose}
          style={styles.backdrop}
        />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.heading}>
            <View style={styles.headingCopy}>
              <AppText variant="heading">Rate your social battery</AppText>
              <AppText color={colors.textMuted} variant="caption">
                Tap how charged you feel right now.
              </AppText>
            </View>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              onPress={onClose}
              style={styles.closeButton}>
              <Ionicons color={colors.textMuted} name="close" size={22} />
            </Pressable>
          </View>
          <View accessibilityRole="radiogroup" style={styles.batteryRow}>
            <View style={styles.battery}>
              {levels.map(level => {
                const selected = energy === level;
                const charged = level <= energy;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityLabel={`${level} out of 5, ${levelLabels[level]}`}
                    accessibilityState={{ checked: selected, disabled: loading || saving }}
                    disabled={loading || saving}
                    key={level}
                    onPress={() => onChange(level)}
                    style={[
                      styles.cell,
                      charged && styles.cellCharged,
                      selected && styles.cellSelected,
                    ]}>
                    <AppText
                      color={charged ? colors.primary : colors.textMuted}
                      variant="bodyStrong">
                      {level}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.batteryTip} />
          </View>
          <View style={styles.readout}>
            <AppText color={colors.primary} variant="bodyStrong">{energy}/5</AppText>
            <AppText color={colors.textMuted}>{levelLabels[energy]}</AppText>
            {saving ? <AppText color={colors.textMuted} style={styles.saving} variant="caption">Saving…</AppText> : null}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.overlay },
  sheet: {
    gap: spacing.lg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: { width: 40, height: 4, alignSelf: 'center', borderRadius: radii.pill, backgroundColor: colors.border },
  heading: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }, headingCopy: { flex: 1, gap: spacing.xxs },
  closeButton: { width: layout.minimumTouchTarget, height: layout.minimumTouchTarget, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.surface },
  batteryRow: { flexDirection: 'row', alignItems: 'center' },
  battery: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xxs,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.xxs,
  },
  batteryTip: { width: 7, height: 24, borderTopRightRadius: radii.sm, borderBottomRightRadius: radii.sm, backgroundColor: colors.border },
  cell: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, backgroundColor: colors.surface },
  cellCharged: { backgroundColor: colors.primarySoft },
  cellSelected: { borderWidth: 2, borderColor: colors.primary },
  readout: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  saving: { marginLeft: 'auto' },
});
