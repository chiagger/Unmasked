import {
  AppleAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import { doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

import { env } from '@/config/env';
import { withFirebaseTimeout } from '@/features/auth/firebaseTimeout';
import { auth, db } from '@/lib/firebase';

export type SocialAuthProvider = 'apple' | 'google';

let isGoogleConfigured = false;

export function getSocialAuthProvider(): SocialAuthProvider | null {
  if (Platform.OS === 'android') return 'google';
  if (Platform.OS === 'ios') return 'apple';
  return null;
}

function configureGoogleSignIn() {
  if (isGoogleConfigured) return;
  if (!env.googleWebClientId) {
    throw new Error(
      'Google Sign-In needs EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID. See docs/authentication.md.',
    );
  }

  GoogleSignin.configure({
    webClientId: env.googleWebClientId,
    offlineAccess: true,
  });
  isGoogleConfigured = true;
}

async function saveAuthIdentity(user: FirebaseAuthTypes.User, displayName?: string | null) {
  await withFirebaseTimeout(
    setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: displayName ?? user.displayName ?? null,
        providers: user.providerData.map(({ providerId }) => providerId),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
  );
}

export async function registerWithEmail({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}) {
  let isNewAccount = true;
  let credential: FirebaseAuthTypes.UserCredential;

  try {
    credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error ? error.code : undefined;
    if (code !== 'auth/email-already-in-use') throw error;

    isNewAccount = false;
    credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  try {
    await updateProfile(credential.user, { displayName: displayName.trim() });
    await withFirebaseTimeout(
      setDoc(
        doc(db, 'users', credential.user.uid),
        {
          uid: credential.user.uid,
          email: credential.user.email,
          displayName: displayName.trim(),
          providers: ['password'],
          ...(isNewAccount ? { createdAt: serverTimestamp() } : {}),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ),
    );
  } catch (error) {
    if (isNewAccount) {
      await deleteUser(credential.user).catch(() => undefined);
    } else {
      await signOut(auth).catch(() => undefined);
    }
    throw error;
  }
  return credential;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  await saveAuthIdentity(credential.user);
  return credential;
}

async function loginWithGoogle() {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();

  if (response.type === 'cancelled') return null;
  if (!response.data.idToken) throw new Error('Google did not return a valid identity token.');

  const credential = await signInWithCredential(
    auth,
    GoogleAuthProvider.credential(response.data.idToken),
  );
  await saveAuthIdentity(credential.user, response.data.user.name);
  return credential;
}

async function loginWithApple() {
  if (!(await AppleAuthentication.isAvailableAsync())) {
    throw new Error('Apple ID is not available on this device.');
  }

  const response = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!response.identityToken) throw new Error('Apple did not return a valid identity token.');

  const credential = await signInWithCredential(
    auth,
    AppleAuthProvider.credential(response.identityToken),
  );
  const displayName = [response.fullName?.givenName, response.fullName?.familyName]
    .filter(Boolean)
    .join(' ');

  if (displayName && !credential.user.displayName) {
    await updateProfile(credential.user, { displayName });
  }
  await saveAuthIdentity(credential.user, displayName || null);
  return credential;
}

export async function loginWithSocialProvider() {
  const provider = getSocialAuthProvider();
  if (provider === 'google') return loginWithGoogle();
  if (provider === 'apple') return loginWithApple();
  throw new Error('Social sign-in is not available on this platform.');
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export async function logout() {
  if (getSocialAuthProvider() === 'google') {
    await GoogleSignin.signOut().catch(() => undefined);
  }
  await signOut(auth);
}
