import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';

import { db } from '@/lib/firebase';

type QueryDocument = { id: string; data: () => Record<string, unknown> };

export type ConnectionRequestStatus = 'pending' | 'accepted' | 'declined';

export interface ConnectionRequest {
  id: string;
  recipientId: string;
  senderId: string;
  status: ConnectionRequestStatus;
}

export interface IncomingConnectionRequest extends ConnectionRequest {
  senderCity: string;
  senderName: string;
}

export function sendConnectionRequest(senderId: string, recipientId: string) {
  const requestId = `${senderId}_${recipientId}`;
  return setDoc(doc(db, 'connectionRequests', requestId), {
    senderId,
    recipientId,
    status: 'pending',
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
