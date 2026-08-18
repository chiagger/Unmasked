import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';

import { db } from '@/lib/firebase';

export interface UserPresence {
  lastSeen?: number;
  online: boolean;
}

export function updatePresence(userId: string, online: boolean) {
  return setDoc(
    doc(db, 'presence', userId),
    { online, lastSeen: serverTimestamp() },
    { merge: true },
  );
}

export function subscribeToPresence(
  userId: string,
  onChange: (presence?: UserPresence) => void,
) {
  return onSnapshot(
    doc(db, 'presence', userId),
    snapshot => {
      const data = snapshot.data();
      const timestamp = data?.lastSeen as { toMillis?: () => number } | undefined;
      onChange(data ? {
        lastSeen: timestamp?.toMillis?.(),
        online: data.online === true,
      } : undefined);
    },
    () => onChange(undefined),
  );
}
