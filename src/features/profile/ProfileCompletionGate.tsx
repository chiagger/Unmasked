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

export function ProfileCompletionGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [completion, setCompletion] = useState<CompletionState>('checking');
  const isProfileEditor = pathname.startsWith('/profile/edit');
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) {
      setCompletion('complete');
      return;
    }

    let active = true;
    setCompletion(current => current === 'complete' ? 'complete' : 'checking');
    getProfile(userId)
      .then(profile => {
        if (active) {
          setCompletion(requiredProfileFieldsComplete(profile) ? 'complete' : 'incomplete');
        }
      })
      .catch(() => {
        if (active) setCompletion('incomplete');
      });
    return () => { active = false; };
  }, [pathname, userId]);

  useEffect(() => {
    if (userId && completion === 'incomplete' && !isProfileEditor) {
      router.replace('/profile/edit?onboarding=1');
    }
  }, [completion, isProfileEditor, userId]);

  if (
    userId
    && !isProfileEditor
    && (completion === 'checking' || completion === 'incomplete')
  ) {
    return (
      <View accessibilityLabel="Checking your profile" style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.canvas,
  },
});
