import { router, useRootNavigationState, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/providers/AuthProvider';

export function AuthRedirect() {
  const { isAuthLoading, user } = useAuth();
  const navigationState = useRootNavigationState();
  const segments = useSegments();

  useEffect(() => {
    if (!navigationState?.key || isAuthLoading) return;

    const routeGroup = segments[0] as string | undefined;
    const isProtectedRoute = routeGroup === '(tabs)';

    if (!user && isProtectedRoute) router.replace('/login');
  }, [isAuthLoading, navigationState?.key, segments, user]);

  return null;
}
