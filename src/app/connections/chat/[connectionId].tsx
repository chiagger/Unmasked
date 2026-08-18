import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { AppText, Screen, colors, radii, spacing, typography } from '@/design-system';
import { ChatHeader } from '@/features/connections/components/ChatHeader';
import {
  sendChatMessage,
  subscribeToChat,
  type ChatMessage,
} from '@/features/connections/chatService';
import {
  subscribeToPresence,
  type UserPresence,
} from '@/features/connections/presenceService';
import { useAuth } from '@/providers/AuthProvider';

export default function ConnectionChatScreen() {
  const { connectionId, name, otherUserId, photoUrl } = useLocalSearchParams<{
    connectionId: string;
    name?: string;
    otherUserId?: string;
    photoUrl?: string;
  }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [presence, setPresence] = useState<UserPresence>();
  const [presenceClock, setPresenceClock] = useState(0);

  useEffect(() => {
    if (!connectionId) return;
    return subscribeToChat(connectionId, setMessages, () => setMessages([]));
  }, [connectionId]);

  useEffect(() => {
    if (!otherUserId) return;
    return subscribeToPresence(otherUserId, setPresence);
  }, [otherUserId]);

  useEffect(() => {
    const initialTimer = setTimeout(() => setPresenceClock(Date.now()), 0);
    const timer = setInterval(() => setPresenceClock(Date.now()), 60_000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  const send = async () => {
    const message = text.trim();
    if (!connectionId || !user || !message || sending) return;
    setSending(true);
    try {
      await sendChatMessage(connectionId, user.uid, message);
      setText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === 'ios'}
      style={styles.root}>
      <Screen
        contentStyle={styles.screen}
        header={(
          <ChatHeader
            name={name || 'Chat'}
            onBack={() => router.back()}
            photoUrl={photoUrl}
            presenceLabel={formatPresence(presence, presenceClock)}
          />
        )}
        scroll={false}>
        <FlatList
          contentContainerStyle={[styles.messages, !messages.length && styles.emptyMessages]}
          data={messages}
          keyExtractor={message => message.id}
          ListEmptyComponent={(
            <View style={styles.empty}>
              <Ionicons color={colors.primary} name="chatbubble-ellipses-outline" size={30} />
              <AppText variant="heading">Start with something small</AppText>
              <AppText color={colors.textMuted} style={styles.centered}>
                A hello, a shared interest, or a delightfully specific question all work.
              </AppText>
            </View>
          )}
          renderItem={({ item }) => {
            const mine = item.senderId === user?.uid;
            return (
              <View style={[styles.message, mine ? styles.mine : styles.theirs]}>
                <AppText color={mine ? colors.surfaceRaised : colors.text}>{item.text}</AppText>
                {item.createdAt ? (
                  <AppText
                    color={mine ? colors.surfaceRaised : colors.textMuted}
                    style={styles.messageTime}
                    variant="caption">
                    {formatSentTime(item.createdAt)}
                  </AppText>
                ) : null}
              </View>
            );
          }}
        />
        <View style={styles.composer}>
          <TextInput
            accessibilityLabel="Message"
            maxLength={1000}
            multiline
            onChangeText={setText}
            placeholder="Write a message…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={text}
          />
          <Pressable
            accessibilityLabel="Send message"
            accessibilityRole="button"
            accessibilityState={{ disabled: !text.trim() || sending }}
            disabled={!text.trim() || sending}
            onPress={send}
            style={[styles.send, (!text.trim() || sending) && styles.sendDisabled]}>
            <Ionicons color={colors.surfaceRaised} name="arrow-up" size={22} />
          </Pressable>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

function formatSentTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPresence(presence: UserPresence | undefined, now: number) {
  if (!presence?.lastSeen) return 'Offline';
  if (!now) return presence.online ? 'Online' : 'Offline';
  if (presence.online && now - presence.lastSeen < 120_000) return 'Online';

  const date = new Date(presence.lastSeen);
  const today = new Date(now);
  if (date.toDateString() === today.toDateString()) {
    return `Last seen today at ${formatSentTime(presence.lastSeen)}`;
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Last seen yesterday at ${formatSentTime(presence.lastSeen)}`;
  }
  return `Last seen ${date.toLocaleDateString([], { day: 'numeric', month: 'short' })}`;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1, paddingBottom: spacing.md },
  messages: { flexGrow: 1, gap: spacing.sm, paddingVertical: spacing.md },
  emptyMessages: { justifyContent: 'center' },
  empty: { alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
  centered: { textAlign: 'center' },
  message: { maxWidth: '82%', gap: spacing.xxs, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  messageTime: { alignSelf: 'flex-end', opacity: 0.72 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: spacing.xxs },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.surfaceRaised, borderBottomLeftRadius: spacing.xxs },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  input: { flex: 1, maxHeight: 112, minHeight: 48, ...typography.body, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.surfaceRaised, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  send: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.primary },
  sendDisabled: { backgroundColor: colors.textMuted },
});
