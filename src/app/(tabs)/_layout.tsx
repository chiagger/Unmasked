import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors, spacing, typography } from '@/design-system';

const tabIcons: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  discover: 'sparkles-outline',
  connections: 'chatbubbles-outline',
  places: 'location-outline',
  profile: 'person-circle-outline',
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surfaceRaised,
          borderTopColor: colors.border,
          height: 72,
          paddingTop: spacing.xs,
        },
        tabBarLabelStyle: typography.caption,
        tabBarIcon: ({ color, size }) => (
          <Ionicons color={color} name={tabIcons[route.name]} size={size} />
        ),
      })}>
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="connections" options={{ title: 'Connections' }} />
      <Tabs.Screen name="places" options={{ title: 'Calm places' }} />
      <Tabs.Screen name="profile" options={{ title: 'My profile' }} />
    </Tabs>
  );
}
