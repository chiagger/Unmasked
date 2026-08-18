import { router, useRootNavigationState, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/providers/AuthProvider';

export function AuthRedirect() {
  const { isAuthLoading, user } = useAuth();
  const navigationState = useRootNavigationState();
  const segments = useSegments();
  const routeGroup = segments[0] as string | undefined;
  const userId = user?.uid;

  useEffect(() => {
    if (!navigationState?.key || isAuthLoading) return;

    const isProtectedRoute = routeGroup === '(tabs)' || routeGroup === 'profile';

    if (!userId && isProtectedRoute) router.replace('/login');
  }, [isAuthLoading, navigationState?.key, routeGroup, userId]);

  return null;
}
