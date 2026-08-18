import {
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';

import { withFirebaseTimeout } from '@/features/auth/firebaseTimeout';
import {
  requiredProfileFieldsComplete,
  type EditableProfile,
} from '@/features/profile/profileEditorModel';
import { db } from '@/lib/firebase';

export function saveProfile(userId: string, profile: EditableProfile) {
  const { dateOfBirth, ...publicProfile } = profile;
  const age = calculateAge(dateOfBirth);
  return withFirebaseTimeout(
    Promise.all([
      setDoc(
        doc(db, 'profiles', userId),
        {
          ...publicProfile,
          age,
          ageRange: deleteField(),
          dateOfBirth: deleteField(),
          profileSetupComplete: requiredProfileFieldsComplete(profile),
          userId,
          profileVersion: 6,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ),
      setDoc(
        doc(db, 'users', userId),
        { uid: userId, dateOfBirth, updatedAt: serverTimestamp() },
        { merge: true },
      ),
    ]),
  );
}

export async function getProfile(userId: string) {
  const [profileSnapshot, accountSnapshot] = await withFirebaseTimeout(Promise.all([
    getDoc(doc(db, 'profiles', userId)),
    getDoc(doc(db, 'users', userId)),
  ]));
  if (!profileSnapshot.exists()) return null;
  return {
    ...profileSnapshot.data(),
    dateOfBirth: typeof accountSnapshot.data()?.dateOfBirth === 'string'
      ? accountSnapshot.data()?.dateOfBirth
      : '',
  } as EditableProfile;
}

export function calculateAge(dateOfBirth: string, today = new Date()) {
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  if (!year || !month || !day) return 0;
  let age = today.getFullYear() - year;
  const birthdayHasPassed = today.getMonth() + 1 > month
    || (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!birthdayHasPassed) age -= 1;
  return Math.max(0, age);
}
