import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from '@react-native-firebase/firestore';

import { db } from '@/lib/firebase';
import type { EditableProfile } from '@/features/profile/profileEditorModel';
import { publicProfileFromStoredData } from '@/features/profile/publicProfileMapper';

type QueryDocument = { id: string; data: () => Record<string, unknown> };

export type ConnectionRequestStatus = 'pending' | 'accepted' | 'declined';

export interface ConnectionRequest {
  id: string;
  message?: string;
  recipientId: string;
  senderId: string;
  status: ConnectionRequestStatus;
}

export interface IncomingConnectionRequest extends ConnectionRequest {
  senderCity: string;
  senderName: string;
}

export interface ConnectionPerson extends ConnectionRequest {
  otherUserCity: string;
  otherUserId: string;
  otherUserName: string;
  profile: EditableProfile;
}

export interface ConnectionsOverview {
  connected: ConnectionPerson[];
  incoming: ConnectionPerson[];
  sent: ConnectionPerson[];
}

export interface HiddenProfile {
  city: string;
  id: string;
  name: string;
  photoUrl?: string;
}

export function sendConnectionRequest(senderId: string, recipientId: string, message = '') {
  const requestId = `${senderId}_${recipientId}`;
  const trimmedMessage = message.trim();
  return setDoc(doc(db, 'connectionRequests', requestId), {
    senderId,
    recipientId,
    status: 'pending',
    ...(trimmedMessage ? { message: trimmedMessage } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getIncomingConnectionRequests(userId: string): Promise<IncomingConnectionRequest[]> {
  const snapshot = await getDocs(
    query(collection(db, 'connectionRequests'), where('recipientId', '==', userId)),
  );

  const requests = (snapshot.docs as QueryDocument[])
    .map(requestDocument => {
      const data = requestDocument.data();
      return {
        id: requestDocument.id,
        message: typeof data.message === 'string' ? data.message : undefined,
        recipientId: String(data.recipientId ?? ''),
        senderId: String(data.senderId ?? ''),
        status: data.status as ConnectionRequestStatus,
      };
    })
    .filter(request => request.status === 'pending');

  return Promise.all(requests.map(async request => {
    const sender = await getDoc(doc(db, 'profiles', request.senderId));
    const senderProfile = sender.data();
    return {
      ...request,
      senderName: typeof senderProfile?.displayName === 'string'
        ? senderProfile.displayName
        : 'Unmasked member',
      senderCity: typeof senderProfile?.city === 'string' ? senderProfile.city : '',
    };
  }));
}

export function respondToConnectionRequest(
  requestId: string,
  status: Exclude<ConnectionRequestStatus, 'pending'>,
) {
  return updateDoc(doc(db, 'connectionRequests', requestId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

function requestFromDocument(requestDocument: QueryDocument): ConnectionRequest {
  const data = requestDocument.data();
  return {
    id: requestDocument.id,
    message: typeof data.message === 'string' ? data.message : undefined,
    recipientId: String(data.recipientId ?? ''),
    senderId: String(data.senderId ?? ''),
    status: data.status as ConnectionRequestStatus,
  };
}

export async function getConnectionsOverview(userId: string): Promise<ConnectionsOverview> {
  const [incomingSnapshot, outgoingSnapshot] = await Promise.all([
    getDocs(query(collection(db, 'connectionRequests'), where('recipientId', '==', userId))),
    getDocs(query(collection(db, 'connectionRequests'), where('senderId', '==', userId))),
  ]);
  const requests = [
    ...(incomingSnapshot.docs as QueryDocument[]).map(requestFromDocument),
    ...(outgoingSnapshot.docs as QueryDocument[]).map(requestFromDocument),
  ];
  const profileIds = [...new Set(requests.map(request =>
    request.senderId === userId ? request.recipientId : request.senderId,
  ))];
  const profiles = new Map(await Promise.all(profileIds.map(async profileId => {
    const snapshot = await getDoc(doc(db, 'profiles', profileId));
    const profile = snapshot.data();
    const normalized = publicProfileFromStoredData(
      (profile ?? {}) as unknown as Partial<EditableProfile>,
    );
    return [profileId, {
      city: normalized.city,
      name: normalized.displayName,
      profile: normalized,
    }] as const;
  })));
  const enriched = requests.map(request => {
    const otherUserId = request.senderId === userId ? request.recipientId : request.senderId;
    const profile = profiles.get(otherUserId);
    return {
      ...request,
      otherUserCity: profile?.city ?? '',
      otherUserId,
      otherUserName: profile?.name ?? 'Unmasked member',
      profile: profile?.profile ?? publicProfileFromStoredData({}),
    };
  });

  return {
    connected: enriched.filter(request => request.status === 'accepted'),
    incoming: enriched.filter(request =>
      request.status === 'pending' && request.recipientId === userId,
    ),
    sent: enriched.filter(request =>
      request.status === 'pending' && request.senderId === userId,
    ),
  };
}

export async function getHiddenProfiles(userId: string): Promise<HiddenProfile[]> {
  const account = await getDoc(doc(db, 'users', userId));
  const ids = Array.isArray(account.data()?.hiddenProfileIds)
    ? account.data()?.hiddenProfileIds as string[]
    : [];
  return Promise.all(ids.map(async id => {
    const snapshot = await getDoc(doc(db, 'profiles', id));
    const profile = snapshot.data();
    return {
      id,
      name: typeof profile?.displayName === 'string' ? profile.displayName : 'Unmasked member',
      city: typeof profile?.city === 'string' ? profile.city : '',
      photoUrl: typeof profile?.photoUrl === 'string' ? profile.photoUrl : undefined,
    };
  }));
}

export function unhideProfile(userId: string, profileId: string) {
  const batch = writeBatch(db);
  batch.update(doc(db, 'users', userId), {
    hiddenProfileIds: arrayRemove(profileId),
    updatedAt: serverTimestamp(),
  });
  batch.delete(doc(db, 'hiddenUsers', userId, 'profiles', profileId));
  batch.delete(doc(db, 'hiddenUsers', profileId, 'profiles', userId));
  return batch.commit();
}
