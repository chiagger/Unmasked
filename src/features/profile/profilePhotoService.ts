import {
  deleteObject,
  getDownloadURL,
  putFile,
  ref,
} from '@react-native-firebase/storage';
import { deleteField, doc, setDoc } from '@react-native-firebase/firestore';

import { auth, db, storage } from '@/lib/firebase';

function avatarReference(userId: string) {
  return ref(storage, `profilePhotos/${userId}/avatar`);
}

export async function uploadProfilePhoto({
  contentType,
  localUri,
  userId,
}: {
  contentType?: string;
  localUri: string;
  userId: string;
}) {
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== userId) {
    throw new Error('profile-photo-auth-mismatch');
  }
  await currentUser.getIdToken(true);
  const avatar = avatarReference(userId);
  await putFile(avatar, localUri, { contentType: contentType || 'image/jpeg' });
  const photoUrl = await getDownloadURL(avatar);
  await setDoc(doc(db, 'profiles', userId), { photoUrl }, { merge: true });
  return photoUrl;
}

export async function removeProfilePhoto(userId: string) {
  await deleteObject(avatarReference(userId)).catch(error => {
    const code = error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : '';
    if (!code.includes('object-not-found')) throw error;
  });
  await setDoc(
    doc(db, 'profiles', userId),
    { photoUrl: deleteField() },
    { merge: true },
  );
}
