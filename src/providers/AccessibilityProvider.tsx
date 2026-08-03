import {
  AccessibilityInfo,
  type AccessibilityChangeEventName,
} from 'react-native';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AccessibilityPreferences {
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityPreferences | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

    const eventName: AccessibilityChangeEventName = 'reduceMotionChanged';
    const subscription = AccessibilityInfo.addEventListener(
      eventName,
      setReduceMotion,
    );

    return () => subscription.remove();
  }, []);

  const value = useMemo(
    () => ({ reduceMotion, setReduceMotion }),
    [reduceMotion],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibilityPreferences() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'useAccessibilityPreferences must be used inside AccessibilityProvider',
    );
  }
  return context;
}
