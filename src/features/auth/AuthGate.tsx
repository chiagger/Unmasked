import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSegments } from 'expo-router';

import { colors } from '@/design-system';
import { useAuth } from '@/providers/AuthProvider';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthLoading, user } = useAuth();
  const segments = useSegments();
  const isRedirectPending = !user && segments[0] === '(tabs)';

  if (isAuthLoading || isRedirectPending) {
    return (
      <View accessibilityLabel="Restoring your session" style={styles.loading}>
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
