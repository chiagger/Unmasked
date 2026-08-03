import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/design-system';
import { AccessibilityProvider } from '@/providers/AccessibilityProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AccessibilityProvider>
        <View style={styles.app}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </AccessibilityProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.canvas },
});
