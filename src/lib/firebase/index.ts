import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { env, isFirebaseConfigured } from '@/config/env';

export const firebaseApp = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(env.firebase)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
