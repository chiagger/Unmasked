import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';

import { db } from '@/lib/firebase';

export async function migrateLegacyHiddenProfiles(userId: string) {
  const account = await getDoc(doc(db, 'users', userId));
  const hiddenIds = Array.isArray(account.data()?.hiddenProfileIds)
    ? account.data()?.hiddenProfileIds as string[]
    : [];

  await Promise.all(hiddenIds.flatMap(hiddenId => [
    setDoc(
      doc(db, 'hiddenUsers', userId, 'profiles', hiddenId),
      { hiddenId, hiderId: userId, updatedAt: serverTimestamp() },
      { merge: true },
    ),
    setDoc(
      doc(db, 'hiddenUsers', hiddenId, 'profiles', userId),
      { hiddenId, hiderId: userId, updatedAt: serverTimestamp() },
      { merge: true },
    ),
  ]));
  return hiddenIds;
}
