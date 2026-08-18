import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader, colors, radii, spacing } from '@/design-system';
import { PublicConnectionProfile } from '@/features/profile/components/PublicConnectionProfile';
import type { EditableProfile } from '@/features/profile/profileEditorModel';

interface ConnectionProfilePreviewProps {
  footer?: React.ReactNode;
  onClose: () => void;
  profile?: EditableProfile;
}

export function ConnectionProfilePreview({
  footer,
  onClose,
  profile,
}: ConnectionProfilePreviewProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={Boolean(profile)}>
      <View style={styles.root}>
        <Pressable accessibilityLabel="Close profile preview" onPress={onClose} style={styles.backdrop} />
        <SafeAreaView
          accessibilityViewIsModal
          edges={['top', 'bottom']}
          style={styles.modal}>
          <View style={styles.header}>
            <ScreenHeader backLabel="Close profile" onBack={onClose} title="Connection profile" />
          </View>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            {profile ? <PublicConnectionProfile profile={profile} /> : null}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.overlay },
  modal: {
    width: '100%',
    maxHeight: '94%',
    overflow: 'hidden',
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    backgroundColor: colors.canvas,
  },
  header: { paddingHorizontal: spacing.lg },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
});
