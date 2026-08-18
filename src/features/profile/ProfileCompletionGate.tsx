import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/design-system';
import {
  requiredProfileFieldsComplete,
} from '@/features/profile/profileEditorModel';
import { getProfile } from '@/features/profile/profileService';
import { useAuth } from '@/providers/AuthProvider';

type CompletionState = 'checking' | 'complete' | 'incomplete';
type CompletionResult = { status: Exclude<CompletionState, 'checking'>; userId: string } | null;

export function ProfileCompletionGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [result, setResult] = useState<CompletionResult>(null);
  const isProfileEditor = pathname.startsWith('/profile/edit');
  const userId = user?.uid;
  const completion: CompletionState = !userId
    ? 'complete'
    : result?.userId === userId
      ? result.status
      : 'checking';

  useEffect(() => {
    if (!userId) return;

    let active = true;
    getProfile(userId)
      .then(profile => {
        if (active) {
          setResult({
            status: requiredProfileFieldsComplete(profile) ? 'complete' : 'incomplete',
            userId,
          });
        }
      })
      .catch(() => {
        if (active) setResult({ status: 'incomplete', userId });
      });
    return () => { active = false; };
  }, [pathname, userId]);

  useEffect(() => {
    if (userId && completion === 'incomplete' && !isProfileEditor) {
      router.replace('/profile/edit?onboarding=1');
    }
  }, [completion, isProfileEditor, userId]);

  const isBlocking = Boolean(
    userId
    && !isProfileEditor
    && (completion === 'checking' || completion === 'incomplete')
  );

  return (
    <View style={styles.container}>
      {children}
      {isBlocking ? (
        <View accessibilityLabel="Checking your profile" style={styles.loading}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
  },
});
