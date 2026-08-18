import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';

import { db } from '@/lib/firebase';

export type ProfileChapterId = 'personal' | 'connection' | 'comfort' | 'privacy';

const chapterIds: ProfileChapterId[] = [
  'personal',
  'connection',
  'comfort',
  'privacy',
];

export async function getOpenedProfileChapters(userId: string) {
  const snapshot = await getDoc(doc(db, 'users', userId));
  const stored = snapshot.data()?.profileChaptersOpened;
  if (!Array.isArray(stored)) return [];
  return stored.filter((value): value is ProfileChapterId =>
    chapterIds.includes(value as ProfileChapterId),
  );
}

export function markProfileChapterOpened(userId: string, chapter: ProfileChapterId) {
  return setDoc(
    doc(db, 'users', userId),
    {
      uid: userId,
      profileChaptersOpened: arrayUnion(chapter),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
