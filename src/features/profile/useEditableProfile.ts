import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { initialProfile, type EditableProfile } from '@/features/profile/profileEditorModel';
import { getProfile, saveProfile } from '@/features/profile/profileService';
import { useAuth } from '@/providers/AuthProvider';
import type { EnergyLevel } from '@/types/domain';

function normalizeEnergy(value: unknown): EnergyLevel {
  if (typeof value === 'number' && value >= 1 && value <= 5) {
    return Math.round(value) as EnergyLevel;
  }

  if (value === 'open') return 5;
  if (value === 'limited') return 2;
  if (value === 'quiet') return 1;
  return 3;
}

export function useEditableProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => initialProfile(user?.displayName ?? ''));
  const [loading, setLoading] = useState(Boolean(user));
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    getProfile(user.uid)
      .then(stored => {
        if (!active || !stored) return;
        const defaults = initialProfile(user.displayName ?? '');
        const storedVersion = (stored as EditableProfile & { profileVersion?: number })
          .profileVersion ?? 0;
        const resetLegacyOptionalCommunication = storedVersion < 5;
        const resetLegacyOptionalComfort = storedVersion < 6;
        setProfile({
          ...defaults,
          ...stored,
          energy: normalizeEnergy(stored.energy),
          interests: stored.interests ?? defaults.interests,
          connectionGoals: stored.connectionGoals ?? defaults.connectionGoals,
          connectionStyles: stored.connectionStyles ?? defaults.connectionStyles,
          sensoryPreferences: stored.sensoryPreferences ?? defaults.sensoryPreferences,
          meetupPreferences: stored.meetupPreferences ?? defaults.meetupPreferences,
          planningStyle: resetLegacyOptionalCommunication ? '' : stored.planningStyle,
          communication: {
            ...defaults.communication,
            ...stored.communication,
            ...(resetLegacyOptionalCommunication
              ? { preferredChannels: [], responseTime: '', toneIndicators: null }
              : {}),
          },
          ...(resetLegacyOptionalComfort
            ? { advanceNotice: '', physicalGreeting: '', calls: '', photos: '' }
            : {}),
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user]));

  const update = <K extends keyof EditableProfile>(key: K, value: EditableProfile[K]) => {
    setProfile(current => ({ ...current, [key]: value }));
  };

  const save = async (nextProfile = profile) => {
    if (!user) return;
    setSaving(true);
    try {
      await saveProfile(user.uid, nextProfile);
    } finally {
      setSaving(false);
    }
  };

  return { loading, profile, save, saving, setProfile, update };
}
