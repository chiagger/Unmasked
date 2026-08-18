import {
  arrayUnion,
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

import type { ConnectionRequestStatus } from '@/features/connections/connectionRequestService';
import { migrateLegacyHiddenProfiles } from '@/features/connections/hiddenProfileMigration';
import type { EditableProfile } from '@/features/profile/profileEditorModel';
import { publicProfileFromStoredData } from '@/features/profile/publicProfileMapper';
import { db } from '@/lib/firebase';

type QueryDocument = { id: string; data: () => Record<string, unknown> };

export interface DiscoveryProfile {
  id: string;
  profile: EditableProfile;
  requestStatus?: ConnectionRequestStatus;
  sharedInterestCount: number;
}

export async function getDiscoveryProfiles(
  userId: string,
  currentInterests: string[],
): Promise<DiscoveryProfile[]> {
  const profilesSnapshot = await getDocs(collection(db, 'profiles'));
  const outgoingSnapshot = await getDocs(
    query(collection(db, 'connectionRequests'), where('senderId', '==', userId)),
  ).catch(() => null);
  const directlyHiddenIds = new Set(
    await migrateLegacyHiddenProfiles(userId).catch(() => []),
  );
  const hiddenProfilesSnapshot = await getDocs(
    collection(db, 'hiddenUsers', userId, 'profiles'),
  );
  const hiddenProfileIds = new Set(directlyHiddenIds);
  (hiddenProfilesSnapshot.docs as QueryDocument[]).forEach(hiddenDocument => {
    hiddenProfileIds.add(hiddenDocument.id);
  });
  const outgoingRequests = new Set(
    ((outgoingSnapshot?.docs ?? []) as QueryDocument[]).map(requestDocument => {
      const request = requestDocument.data();
      return String(request.recipientId);
    }),
  );
  const interests = new Set(currentInterests.map(value => value.toLocaleLowerCase()));

  return (profilesSnapshot.docs as QueryDocument[]).flatMap(profileDocument => {
    if (
      profileDocument.id === userId
      || hiddenProfileIds.has(profileDocument.id)
      || outgoingRequests.has(profileDocument.id)
    ) return [];
    const profile = profileDocument.data() as unknown as Partial<EditableProfile> & {
      profileSetupComplete?: boolean;
    };
    if (profile.visibility !== 'discoverable' || profile.profileSetupComplete !== true) return [];
    const normalizedProfile = publicProfileFromStoredData(profile);
    const profileInterests = normalizedProfile.interests;

    return [{
      id: profileDocument.id,
      profile: normalizedProfile,
      sharedInterestCount: profileInterests.filter(value =>
        interests.has(value.toLocaleLowerCase()),
      ).length,
    }];
  }).sort((first, second) => second.sharedInterestCount - first.sharedInterestCount);
}

export async function hideDiscoveryProfile(userId: string, profileId: string) {
  const batch = writeBatch(db);
  batch.set(doc(db, 'users', userId), {
    uid: userId,
    hiddenProfileIds: arrayUnion(profileId),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  const hiddenRecord = {
    hiderId: userId,
    hiddenId: profileId,
    updatedAt: serverTimestamp(),
  };
  batch.set(doc(db, 'hiddenUsers', userId, 'profiles', profileId), hiddenRecord);
  batch.set(doc(db, 'hiddenUsers', profileId, 'profiles', userId), hiddenRecord);
  await batch.commit();

  const incomingSnapshot = await getDocs(
    query(collection(db, 'connectionRequests'), where('recipientId', '==', userId)),
  ).catch(() => null);
  const matchingRequests = ((incomingSnapshot?.docs ?? []) as QueryDocument[]).filter(
    requestDocument => {
      const request = requestDocument.data();
      return request.senderId === profileId && request.status === 'pending';
    },
  );

  await Promise.all(matchingRequests.map(requestDocument =>
    updateDoc(doc(db, 'connectionRequests', requestDocument.id), {
      status: 'declined',
      updatedAt: serverTimestamp(),
    }),
  ));
}

export async function hasSeenHideExplanation(userId: string) {
  const snapshot = await getDoc(doc(db, 'users', userId));
  return snapshot.data()?.hasSeenHideExplanation === true;
}

export function markHideExplanationSeen(userId: string) {
  return setDoc(
    doc(db, 'users', userId),
    {
      uid: userId,
      hasSeenHideExplanation: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
