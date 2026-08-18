import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppText, colors, layout, radii, spacing, typography } from '@/design-system';

export const CONNECTION_MESSAGE_MAX_LENGTH = 180;

interface ConnectionRequestComposerProps {
  displayName: string;
  onClose: () => void;
  onSend: (message: string) => void;
  sending?: boolean;
  visible: boolean;
}

export function ConnectionRequestComposer({
  displayName,
  onClose,
  onSend,
  sending = false,
  visible,
}: ConnectionRequestComposerProps) {
  const [message, setMessage] = useState('');

  const close = () => {
    if (!sending) onClose();
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={close}
      statusBarTranslucent
      transparent
      visible={visible}>
      <KeyboardAvoidingView
        behavior="padding"
        enabled={Platform.OS === 'ios'}
        style={styles.root}>
        <Pressable
          accessibilityLabel="Close connection request"
          disabled={sending}
          onPress={close}
          style={styles.backdrop}
        />
        <SafeAreaView edges={['bottom']} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.heading}>
            <View style={styles.headingCopy}>
              <AppText variant="title">Connect with {displayName}</AppText>
              <AppText color={colors.textMuted}>
                Add a short note, or send the request without one.
              </AppText>
            </View>
            <Pressable
              accessibilityLabel="Close"
              accessibilityRole="button"
              disabled={sending}
              onPress={close}
              style={styles.closeButton}>
              <Ionicons color={colors.textMuted} name="close" size={22} />
            </Pressable>
          </View>

          <View style={styles.messageField}>
            <TextInput
              accessibilityLabel="Optional connection message"
              editable={!sending}
              maxLength={CONNECTION_MESSAGE_MAX_LENGTH}
              multiline
              onChangeText={setMessage}
              placeholder="Say hi or mention something you have in common…"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              textAlignVertical="top"
              value={message}
            />
            <AppText color={colors.textMuted} style={styles.counter} variant="caption">
              {message.length}/{CONNECTION_MESSAGE_MAX_LENGTH}
            </AppText>
          </View>

          <View style={styles.actions}>
            <AppButton disabled={sending} label="Cancel" onPress={close} variant="quiet" />
            <View style={styles.sendAction}>
              <AppButton
                fullWidth
                label="Send request"
                loading={sending}
                onPress={() => onSend(message.trim())}
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlay,
  },
  sheet: {
    gap: spacing.lg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    alignSelf: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.border,
  },
  heading: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  headingCopy: { flex: 1, gap: spacing.xxs },
  closeButton: {
    width: layout.minimumTouchTarget,
    height: layout.minimumTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  messageField: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceRaised,
  },
  input: {
    minHeight: 120,
    ...typography.body,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  counter: { alignSelf: 'flex-end', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sendAction: { flex: 1 },
});
