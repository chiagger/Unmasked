import { onAuthStateChanged, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { auth } from '@/lib/firebase';
import { logout as signOut } from '@/features/auth/authService';
import { updatePresence } from '@/features/connections/presenceService';
import { migrateLegacyHiddenProfiles } from '@/features/connections/hiddenProfileMigration';

interface AuthContextValue {
  user: FirebaseAuthTypes.User | null;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setIsAuthLoading(false);
      }),
    [],
  );

  useEffect(() => {
    if (!user) return;
    migrateLegacyHiddenProfiles(user.uid).catch(() => undefined);
    let active = AppState.currentState === 'active';
    const publish = (online: boolean) => updatePresence(user.uid, online).catch(() => undefined);
    publish(active);
    const heartbeat = setInterval(() => {
      if (active) publish(true);
    }, 60_000);
    const subscription = AppState.addEventListener('change', state => {
      active = state === 'active';
      publish(active);
    });
    return () => {
      clearInterval(heartbeat);
      subscription.remove();
      publish(false);
    };
  }, [user]);

  const logout = useCallback(async () => {
    if (user) await updatePresence(user.uid, false).catch(() => undefined);
    await signOut();
  }, [user]);

  const value = useMemo(
    () => ({ user, isAuthLoading, logout }),
    [isAuthLoading, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider.');
  return value;
}
