import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import {
  AppButton,
  AppText,
  Card,
  Screen,
  colors,
  radii,
  spacing,
} from "@/design-system";
import {
  subscribeToLatestChatMessage,
  type ChatMessage,
} from "@/features/connections/chatService";
import { ConnectionProfilePreview } from "@/features/connections/components/ConnectionProfilePreview";
import {
  getConnectionsOverview,
  respondToConnectionRequest,
  type ConnectionPerson,
  type ConnectionsOverview,
} from "@/features/connections/connectionRequestService";
import { ProfileAvatar } from "@/features/profile/components/ProfileAvatar";
import { useAuth } from "@/providers/AuthProvider";

type ConnectionsTab = "connected" | "requests";
const emptyOverview: ConnectionsOverview = {
  connected: [],
  incoming: [],
  sent: [],
};

export default function ConnectionsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ConnectionsTab>("connected");
  const [overview, setOverview] = useState(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [profilePreview, setProfilePreview] = useState<ConnectionPerson>();
  const [respondingTo, setRespondingTo] = useState<string>();

  const load = useCallback(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    getConnectionsOverview(user.uid)
      .then((result) => {
        if (active) setOverview(result);
      })
      .catch(() => {
        if (active) setOverview(emptyOverview);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  useFocusEffect(load);

  const respond = async (
    request: ConnectionPerson,
    status: "accepted" | "declined",
  ) => {
    setRespondingTo(request.id);
    try {
      await respondToConnectionRequest(request.id, status);
      setOverview((current) => ({
        ...current,
        connected:
          status === "accepted"
            ? [{ ...request, status: "accepted" }, ...current.connected]
            : current.connected,
        incoming: current.incoming.filter((item) => item.id !== request.id),
      }));
      if (status === "accepted") setActiveTab("connected");
      setProfilePreview(undefined);
    } catch {
      Alert.alert(
        "Could not update the request",
        "Please check your connection and try again.",
      );
    } finally {
      setRespondingTo(undefined);
    }
  };

  const openChat = (connection: ConnectionPerson) => {
    router.push({
      pathname: "/connections/chat/[connectionId]",
      params: {
        connectionId: connection.id,
        name: connection.otherUserName,
        otherUserId: connection.otherUserId,
        photoUrl: connection.profile.photoUrl ?? '',
      },
    });
  };
  const actionablePreview =
    profilePreview?.recipientId === user?.uid ? profilePreview : undefined;

  return (
    <Screen contentStyle={styles.screen}>
      <View style={styles.headerRow}>
        <AppText style={styles.title} variant="display">
          Connections
        </AppText>
        <Pressable
          accessibilityHint="Review and unhide profiles"
          accessibilityLabel="Hidden profiles"
          accessibilityRole="button"
          onPress={() => router.push("/connections/hidden")}
          style={({ pressed }) => [
            styles.headerAction,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons color={colors.textMuted} name="eye-off-outline" size={22} />
        </Pressable>
      </View>

      <View style={styles.tabContent}>
        <View accessibilityRole="tablist" style={styles.tabs}>
          <TabButton
            label="Connected"
            onPress={() => setActiveTab("connected")}
            selected={activeTab === "connected"}
          />
          <TabButton
            badge={overview.incoming.length}
            label="Requests"
            onPress={() => setActiveTab("requests")}
            selected={activeTab === "requests"}
          />
        </View>

        {activeTab === "requests" ? (
          <AppText color={colors.textMuted}>
            Invitations are always your choice—there is no mutual matching step.
          </AppText>
        ) : null}

        {loading ? (
          <Card>
            <AppText color={colors.textMuted}>Checking your connections…</AppText>
          </Card>
        ) : activeTab === "connected" ? (
          <ConnectedList connections={overview.connected} onOpenChat={openChat} />
        ) : (
          <RequestsList
            incoming={overview.incoming}
            onViewProfile={setProfilePreview}
            sent={overview.sent}
          />
        )}
      </View>

      <ConnectionProfilePreview
        footer={
          actionablePreview ? (
            <RequestActions
              onAccept={() => respond(actionablePreview, "accepted")}
              onDecline={() => confirmDecline(actionablePreview, respond)}
              responding={respondingTo === actionablePreview.id}
            />
          ) : undefined
        }
        onClose={() => setProfilePreview(undefined)}
        profile={profilePreview?.profile}
      />
    </Screen>
  );
}

function TabButton({
  badge = 0,
  label,
  onPress,
  selected,
}: {
  badge?: number;
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.tab, selected && styles.selectedTab]}
    >
      <AppText
        color={selected ? colors.primary : colors.textMuted}
        variant="label"
      >
        {label}
      </AppText>
      {badge ? (
        <View style={styles.badge}>
          <AppText color={colors.surfaceRaised} variant="caption">
            {badge}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

function ConnectedList({
  connections,
  onOpenChat,
}: {
  connections: ConnectionPerson[];
  onOpenChat: (connection: ConnectionPerson) => void;
}) {
  if (!connections.length) {
    return (
      <EmptyState
        body="Accepted connections will appear here, ready when you want to talk."
        button="Browse people"
        icon="chatbubbles-outline"
        onPress={() => router.push("/(tabs)/discover")}
        title="Your circle is still warming up"
      />
    );
  }
  return (
    <Card style={styles.conversationList}>
      {connections.map((connection, index) => (
        <ConnectedConversation
          connection={connection}
          currentUserId={
            connection.recipientId === connection.otherUserId
              ? connection.senderId
              : connection.recipientId
          }
          divider={index < connections.length - 1}
          key={connection.id}
          onPress={() => onOpenChat(connection)}
        />
      ))}
    </Card>
  );
}

function ConnectedConversation({
  connection,
  currentUserId,
  divider,
  onPress,
}: {
  connection: ConnectionPerson;
  currentUserId: string;
  divider: boolean;
  onPress: () => void;
}) {
  const [latest, setLatest] = useState<ChatMessage>();

  useEffect(
    () => subscribeToLatestChatMessage(connection.id, setLatest),
    [connection.id],
  );

  return (
    <Pressable
      accessibilityHint="Opens your conversation"
      accessibilityLabel={`Chat with ${connection.otherUserName}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.conversation,
        divider && styles.conversationDivider,
        pressed && styles.conversationPressed,
      ]}
    >
      <ProfileAvatar
        name={connection.otherUserName}
        photoUrl={connection.profile.photoUrl}
        size={50}
      />
      <View style={styles.conversationCopy}>
        <View style={styles.conversationHeading}>
          <AppText
            numberOfLines={1}
            style={styles.conversationName}
            variant="heading"
          >
            {connection.otherUserName}
          </AppText>
          {latest?.createdAt ? (
            <AppText color={colors.textMuted} variant="caption">
              {formatMessageTime(latest.createdAt)}
            </AppText>
          ) : null}
        </View>
        <AppText
          color={latest ? colors.textMuted : colors.primary}
          numberOfLines={1}
        >
          {latest
            ? `${latest.senderId === currentUserId ? "You: " : ""}${latest.text}`
            : "Start a conversation"}
        </AppText>
      </View>
      <Ionicons color={colors.textMuted} name="chevron-forward" size={19} />
    </Pressable>
  );
}

function formatMessageTime(timestamp: number) {
  const date = new Date(timestamp);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

function RequestsList({
  incoming,
  onViewProfile,
  sent,
}: {
  incoming: ConnectionPerson[];
  onViewProfile: (request: ConnectionPerson) => void;
  sent: ConnectionPerson[];
}) {
  if (!incoming.length && !sent.length) {
    return (
      <EmptyState
        body="Incoming invitations and requests you send will wait here."
        button="Browse people"
        icon="person-add-outline"
        onPress={() => router.push("/(tabs)/discover")}
        title="No requests in flight"
      />
    );
  }
  return (
    <View style={styles.requestSections}>
      {incoming.length ? (
        <View style={styles.list}>
          <AppText variant="heading">
            {incoming.length === 1
              ? "1 person wants to connect"
              : `${incoming.length} people want to connect`}
          </AppText>
          {incoming.map((request) => (
            <Card key={request.id} style={styles.personCard}>
              <PersonIdentity
                onPress={() => onViewProfile(request)}
                person={request}
              />
              {request.message ? (
                <RequestMessage
                  message={request.message}
                  name={request.otherUserName}
                />
              ) : null}
            </Card>
          ))}
        </View>
      ) : null}
      {sent.length ? (
        <View style={styles.list}>
          <AppText variant="heading">Waiting for them</AppText>
          {sent.map((request) => (
            <Card key={request.id} style={styles.personCard}>
              <PersonIdentity
                onPress={() => onViewProfile(request)}
                person={request}
              />
              {request.message ? (
                <RequestMessage message={request.message} name="You" />
              ) : null}
              <View style={styles.waitingRow}>
                <Ionicons
                  color={colors.textMuted}
                  name="time-outline"
                  size={18}
                />
                <AppText color={colors.textMuted} variant="caption">
                  Request pending
                </AppText>
              </View>
            </Card>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function PersonIdentity({
  onPress,
  person,
}: {
  onPress?: () => void;
  person: ConnectionPerson;
}) {
  const identity = (
    <>
      <ProfileAvatar
        name={person.otherUserName}
        photoUrl={person.profile.photoUrl}
        size={46}
      />
      <View style={styles.identityCopy}>
        <AppText variant="heading">
          {[person.otherUserName, person.profile.age || null]
            .filter(Boolean)
            .join(", ")}
        </AppText>
        {person.profile.pronouns ? (
          <AppText color={colors.textMuted} variant="caption">
            {person.profile.pronouns}
          </AppText>
        ) : null}
        {person.otherUserCity ? (
          <View style={styles.metadataRow}>
            <Ionicons
              color={colors.textMuted}
              name="location-outline"
              size={15}
            />
            <AppText color={colors.textMuted} variant="caption">
              {person.otherUserCity}
            </AppText>
          </View>
        ) : null}
      </View>
      {onPress ? (
        <Ionicons color={colors.primary} name="chevron-forward" size={20} />
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityHint="Opens their complete public profile"
        accessibilityLabel={`View ${person.otherUserName}'s full profile`}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.identity,
          styles.tappableIdentity,
          pressed && styles.pressed,
        ]}
      >
        {identity}
      </Pressable>
    );
  }
  return <View style={styles.identity}>{identity}</View>;
}

function RequestMessage({ message, name }: { message: string; name: string }) {
  return (
    <View style={styles.requestMessage}>
      <AppText color={colors.textMuted} variant="caption">
        {name} wrote
      </AppText>
      <AppText>“{message}”</AppText>
    </View>
  );
}

function RequestActions({
  onAccept,
  onDecline,
  responding,
}: {
  onAccept: () => void;
  onDecline: () => void;
  responding: boolean;
}) {
  return (
    <View style={styles.requestActions}>
      <Pressable
        accessibilityHint="Declines this connection request after confirmation"
        accessibilityLabel="Not now"
        accessibilityRole="button"
        disabled={responding}
        onPress={onDecline}
        style={({ pressed }) => [
          styles.declineButton,
          pressed && styles.actionPressed,
          responding && styles.disabled,
        ]}
      >
        <Ionicons color={colors.textMuted} name="close" size={25} />
      </Pressable>
      <Pressable
        accessibilityHint="Accepts this connection request"
        accessibilityLabel="Accept connection"
        accessibilityRole="button"
        disabled={responding}
        onPress={onAccept}
        style={({ pressed }) => [
          styles.acceptButton,
          pressed && styles.actionPressed,
          responding && styles.disabled,
        ]}
      >
        {responding ? (
          <ActivityIndicator color={colors.surfaceRaised} />
        ) : (
          <Ionicons color={colors.surfaceRaised} name="checkmark" size={29} />
        )}
      </Pressable>
    </View>
  );
}

function confirmDecline(
  request: ConnectionPerson,
  onRespond: (
    request: ConnectionPerson,
    status: "accepted" | "declined",
  ) => void,
) {
  Alert.alert(
    `Not ready to connect with ${request.otherUserName}?`,
    "This will decline the invitation.",
    [
      { text: "Keep request", style: "cancel" },
      {
        text: "Decline",
        style: "destructive",
        onPress: () => onRespond(request, "declined"),
      },
    ],
  );
}

function EmptyState({
  body,
  button,
  icon,
  onPress,
  title,
}: {
  body: string;
  button: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  title: string;
}) {
  return (
    <Card style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Ionicons color={colors.primary} name={icon} size={28} />
      </View>
      <AppText style={styles.centered} variant="heading">
        {title}
      </AppText>
      <AppText color={colors.textMuted} style={styles.centered}>
        {body}
      </AppText>
      <AppButton label={button} onPress={onPress} />
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.lg },
  tabContent: { gap: spacing.md },
  headerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { flex: 1 },
  headerAction: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  tabs: {
    flexDirection: "row",
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    padding: spacing.xxs,
  },
  tab: {
    minHeight: 44,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radii.sm,
  },
  selectedTab: { backgroundColor: colors.surfaceRaised },
  badge: {
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxs,
  },
  list: { gap: spacing.md },
  conversationList: { padding: 0, overflow: "hidden" },
  conversation: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  conversationDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  conversationPressed: { backgroundColor: colors.surface },
  conversationCopy: { flex: 1, gap: spacing.xxs },
  conversationHeading: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.sm,
  },
  conversationName: { flex: 1 },
  requestSections: { gap: spacing.xl },
  personCard: { gap: spacing.sm, paddingVertical: spacing.md },
  identity: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  tappableIdentity: {
    minHeight: 56,
    margin: -spacing.xxs,
    padding: spacing.xxs,
    borderRadius: radii.md,
  },
  identityCopy: { flex: 1, gap: spacing.xxs },
  metadataRow: { flexDirection: "row", alignItems: "center", gap: spacing.xxs },
  requestMessage: {
    gap: spacing.xxs,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  requestActions: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.md,
  },
  declineButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  acceptButton: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  actionPressed: { transform: [{ scale: 0.94 }], opacity: 0.82 },
  disabled: { opacity: 0.55 },
  waitingRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  grow: { flex: 1 },
  emptyCard: { alignItems: "center", gap: spacing.md, marginTop: spacing.md },
  emptyIcon: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
  },
  centered: { textAlign: "center" },
  pressed: { opacity: 0.72 },
});
