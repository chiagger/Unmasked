import { doc, getDoc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';

import { withFirebaseTimeout } from '@/features/auth/firebaseTimeout';
import type { EditableProfile } from '@/features/profile/profileEditorModel';
import { db } from '@/lib/firebase';

export function saveProfile(userId: string, profile: EditableProfile) {
  return withFirebaseTimeout(
    setDoc(
      doc(db, 'profiles', userId),
      { ...profile, userId, profileVersion: 1, updatedAt: serverTimestamp() },
      { merge: true },
    ),
  );
}

export async function getProfile(userId: string) {
  const snapshot = await withFirebaseTimeout(getDoc(doc(db, 'profiles', userId)));
  return snapshot.exists() ? snapshot.data() as EditableProfile : null;
}
