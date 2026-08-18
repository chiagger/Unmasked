import { useEffect, useState } from 'react';

import { initialProfile, type EditableProfile } from '@/features/profile/profileEditorModel';
import { getProfile, saveProfile } from '@/features/profile/profileService';
import { useAuth } from '@/providers/AuthProvider';

export function useEditableProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => initialProfile(user?.displayName ?? ''));
  const [loading, setLoading] = useState(Boolean(user));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    getProfile(user.uid)
      .then(stored => {
        if (!active || !stored) return;
        const defaults = initialProfile(user.displayName ?? '');
        setProfile({
          ...defaults,
          ...stored,
          interests: stored.interests ?? defaults.interests,
          connectionGoals: stored.connectionGoals ?? defaults.connectionGoals,
          connectionStyles: stored.connectionStyles ?? defaults.connectionStyles,
          sensoryPreferences: stored.sensoryPreferences ?? defaults.sensoryPreferences,
          meetupPreferences: stored.meetupPreferences ?? defaults.meetupPreferences,
          communication: { ...defaults.communication, ...stored.communication },
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user]);

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
