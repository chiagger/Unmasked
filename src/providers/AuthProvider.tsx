import { onAuthStateChanged, type FirebaseAuthTypes } from '@react-native-firebase/auth';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { auth } from '@/lib/firebase';
import { logout } from '@/features/auth/authService';

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

  const value = useMemo(
    () => ({ user, isAuthLoading, logout }),
    [isAuthLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider.');
  return value;
}
