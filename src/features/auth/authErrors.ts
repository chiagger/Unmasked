const invalidCredentialMessage =
  'We could not sign you in. Check your email and password, or reset your password.';

const authErrorMessages: Record<string, string> = {
  'auth/email-already-in-use': 'An account already exists with this email.',
  'auth/invalid-credential': invalidCredentialMessage,
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/network-request-failed': 'You seem to be offline. Check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Take a short break and try again.',
  'auth/user-disabled': 'This account is currently unavailable.',
  'auth/user-not-found': invalidCredentialMessage,
  'auth/weak-password': 'Use at least 8 characters for your password.',
  'auth/wrong-password': invalidCredentialMessage,
};

function getAuthErrorCode(error: unknown) {
  if (!error || typeof error !== 'object' || !('code' in error)) return null;
  return typeof error.code === 'string' ? error.code : null;
}

export function getAuthErrorMessage(error: unknown) {
  const code = getAuthErrorCode(error);

  if (code === 'ERR_REQUEST_CANCELED') return null;
  if (code && authErrorMessages[code]) return authErrorMessages[code];
  if (error instanceof Error && error.message.includes('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID')) {
    return error.message;
  }
  if (error instanceof Error && error.message.includes('Cloud Firestore')) {
    return error.message;
  }
  return 'Something went wrong. Please try again when you feel ready.';
}
