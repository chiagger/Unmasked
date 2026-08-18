import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from '@react-native-firebase/firestore';

import { db } from '@/lib/firebase';

type QueryDocument = { id: string; data: () => Record<string, unknown> };

export interface ChatMessage {
  createdAt?: number;
  id: string;
  senderId: string;
  text: string;
}

function chatMessageFromDocument(messageDocument: QueryDocument): ChatMessage {
  const message = messageDocument.data();
  const timestamp = message.createdAt as { toMillis?: () => number } | undefined;
  return {
    createdAt: timestamp?.toMillis?.(),
    id: messageDocument.id,
    senderId: String(message.senderId ?? ''),
    text: String(message.text ?? ''),
  };
}

async function getRequestOpeningMessage(connectionId: string): Promise<ChatMessage | undefined> {
  const request = await getDoc(doc(db, 'connectionRequests', connectionId));
  const data = request.data();
  const text = typeof data?.message === 'string' ? data.message.trim() : '';
  if (!text) return undefined;
  const timestamp = data?.createdAt as { toMillis?: () => number } | undefined;
  return {
    createdAt: timestamp?.toMillis?.(),
    id: 'connection-request-message',
    senderId: String(data?.senderId ?? ''),
    text,
  };
}

export function subscribeToChat(
  connectionId: string,
  onChange: (messages: ChatMessage[]) => void,
  onError: () => void,
) {
  let active = true;
  let openingLoaded = false;
  let opening: ChatMessage | undefined;
  let chatLoaded = false;
  let chatMessages: ChatMessage[] = [];
  const emit = () => {
    if (active && openingLoaded && chatLoaded) {
      onChange(opening ? [opening, ...chatMessages] : chatMessages);
    }
  };

  getRequestOpeningMessage(connectionId)
    .then(message => { opening = message; })
    .catch(() => { opening = undefined; })
    .finally(() => { openingLoaded = true; emit(); });

  const unsubscribe = onSnapshot(
    query(
      collection(db, 'connectionChats', connectionId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100),
    ),
    snapshot => {
      chatMessages = (snapshot.docs as QueryDocument[]).map(chatMessageFromDocument);
      chatLoaded = true;
      emit();
    },
    onError,
  );
  return () => {
    active = false;
    unsubscribe();
  };
}

export function subscribeToLatestChatMessage(
  connectionId: string,
  onChange: (message?: ChatMessage) => void,
) {
  let active = true;
  let openingLoaded = false;
  let opening: ChatMessage | undefined;
  let chatLoaded = false;
  let latest: ChatMessage | undefined;
  const emit = () => {
    if (active && openingLoaded && chatLoaded) onChange(latest ?? opening);
  };

  getRequestOpeningMessage(connectionId)
    .then(message => { opening = message; })
    .catch(() => { opening = undefined; })
    .finally(() => { openingLoaded = true; emit(); });

  const unsubscribe = onSnapshot(
    query(
      collection(db, 'connectionChats', connectionId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(1),
    ),
    snapshot => {
      const messageDocument = (snapshot.docs as QueryDocument[])[0];
      latest = messageDocument ? chatMessageFromDocument(messageDocument) : undefined;
      chatLoaded = true;
      emit();
    },
    () => {
      chatLoaded = true;
      latest = undefined;
      emit();
    },
  );
  return () => {
    active = false;
    unsubscribe();
  };
}

export function sendChatMessage(connectionId: string, senderId: string, text: string) {
  return addDoc(collection(db, 'connectionChats', connectionId, 'messages'), {
    senderId,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
}
