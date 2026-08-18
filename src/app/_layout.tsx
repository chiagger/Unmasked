import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/design-system';
import { AuthGate } from '@/features/auth/AuthGate';
import { AuthRedirect } from '@/features/auth/AuthRedirect';
import { ProfileCompletionGate } from '@/features/profile/ProfileCompletionGate';
import { AccessibilityProvider } from '@/providers/AccessibilityProvider';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.app}>
      <SafeAreaProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <View style={styles.app}>
              <StatusBar style="dark" />
              <AuthRedirect />
              <AuthGate>
                <ProfileCompletionGate>
                  <Stack screenOptions={{ headerShown: false }} />
                </ProfileCompletionGate>
              </AuthGate>
            </View>
          </AuthProvider>
        </AccessibilityProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.canvas },
});
