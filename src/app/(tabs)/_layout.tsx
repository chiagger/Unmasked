import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radii, spacing, typography } from '@/design-system';

const tabIcons: Record<
  string,
  {
    active: React.ComponentProps<typeof Ionicons>['name'];
    inactive: React.ComponentProps<typeof Ionicons>['name'];
  }
> = {
  discover: { active: 'sparkles', inactive: 'sparkles-outline' },
  connections: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  places: { active: 'location', inactive: 'location-outline' },
  profile: { active: 'person-circle', inactive: 'person-circle-outline' },
};

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarItemStyle: styles.item,
        tabBarStyle: {
          backgroundColor: colors.surfaceRaised,
          borderTopColor: colors.border,
          height: 64 + insets.bottom,
          paddingTop: spacing.xs,
          paddingBottom: spacing.xs + insets.bottom,
        },
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.iconShell, focused && styles.iconShellActive]}>
            <Ionicons
              color={color}
              name={tabIcons[route.name][focused ? 'active' : 'inactive']}
              size={22}
            />
          </View>
        ),
      })}>
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="connections" options={{ title: 'Connections' }} />
      <Tabs.Screen name="places" options={{ title: 'Calm places' }} />
      <Tabs.Screen name="profile" options={{ title: 'My profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  item: { minHeight: 56 },
  label: {
    ...typography.caption,
    fontWeight: '600',
    marginTop: 0,
  },
  iconShell: {
    width: 40,
    height: 28,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShellActive: { backgroundColor: colors.primarySoft },
});
