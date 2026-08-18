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
} from '@react-native-firebase/firestore';

import type { ConnectionRequestStatus } from '@/features/connections/connectionRequestService';
import {
  initialProfile,
  type EditableProfile,
} from '@/features/profile/profileEditorModel';
import { db } from '@/lib/firebase';
import type { EnergyLevel } from '@/types/domain';

type QueryDocument = { id: string; data: () => Record<string, unknown> };

export interface DiscoveryProfile {
  id: string;
  profile: EditableProfile;
  requestStatus?: ConnectionRequestStatus;
  sharedInterestCount: number;
}

function energyLevel(value: unknown): EnergyLevel {
  if (typeof value === 'number' && value >= 1 && value <= 5) {
    return Math.round(value) as EnergyLevel;
  }
  if (value === 'open') return 5;
  if (value === 'limited') return 2;
  if (value === 'quiet') return 1;
  return 3;
}

export async function getDiscoveryProfiles(
  userId: string,
  currentInterests: string[],
): Promise<DiscoveryProfile[]> {
  const profilesSnapshot = await getDocs(collection(db, 'profiles'));
  const outgoingSnapshot = await getDocs(
    query(collection(db, 'connectionRequests'), where('senderId', '==', userId)),
  ).catch(() => null);
  const accountSnapshot = await getDoc(doc(db, 'users', userId)).catch(() => null);
  const hiddenProfileIds = new Set(
    Array.isArray(accountSnapshot?.data()?.hiddenProfileIds)
      ? accountSnapshot.data()?.hiddenProfileIds as string[]
      : [],
  );
  const outgoingRequests = new Map(
    ((outgoingSnapshot?.docs ?? []) as QueryDocument[]).map(requestDocument => {
      const request = requestDocument.data();
      return [
        String(request.recipientId),
        request.status as ConnectionRequestStatus,
      ];
    }),
  );
  const interests = new Set(currentInterests.map(value => value.toLocaleLowerCase()));

  return (profilesSnapshot.docs as QueryDocument[]).flatMap(profileDocument => {
    if (profileDocument.id === userId || hiddenProfileIds.has(profileDocument.id)) return [];
    const profile = profileDocument.data() as unknown as Partial<EditableProfile> & {
      profileSetupComplete?: boolean;
    };
    if (profile.visibility !== 'discoverable' || profile.profileSetupComplete !== true) return [];
    const profileInterests = profile.interests ?? [];
    const defaults = initialProfile(profile.displayName ?? '');

    return [{
      id: profileDocument.id,
      requestStatus: outgoingRequests.get(profileDocument.id),
      profile: {
        ...defaults,
        ...profile,
        dateOfBirth: '',
        displayName: profile.displayName?.trim() || 'Unnamed profile',
        energy: energyLevel(profile.energy),
        interests: profileInterests,
        connectionGoals: profile.connectionGoals ?? [],
        connectionStyles: profile.connectionStyles ?? [],
        sensoryPreferences: profile.sensoryPreferences ?? [],
        meetupPreferences: profile.meetupPreferences ?? [],
        communication: {
          ...defaults.communication,
          ...profile.communication,
        },
      },
      sharedInterestCount: profileInterests.filter(value =>
        interests.has(value.toLocaleLowerCase()),
      ).length,
    }];
  }).sort((first, second) => second.sharedInterestCount - first.sharedInterestCount);
}

export async function hideDiscoveryProfile(userId: string, profileId: string) {
  await setDoc(
    doc(db, 'users', userId),
    {
      uid: userId,
      hiddenProfileIds: arrayUnion(profileId),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

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
