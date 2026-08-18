import {
  initialProfile,
  type EditableProfile,
} from '@/features/profile/profileEditorModel';
import type { EnergyLevel } from '@/types/domain';

function energyLevel(value: unknown): EnergyLevel {
  if (typeof value === 'number' && value >= 1 && value <= 5) {
    return Math.round(value) as EnergyLevel;
  }
  if (value === 'open') return 5;
  if (value === 'limited') return 2;
  if (value === 'quiet') return 1;
  return 3;
}

export function publicProfileFromStoredData(
  stored: Partial<EditableProfile>,
): EditableProfile {
  const defaults = initialProfile(stored.displayName ?? '');
  return {
    ...defaults,
    ...stored,
    dateOfBirth: '',
    displayName: stored.displayName?.trim() || 'Unnamed profile',
    energy: energyLevel(stored.energy),
    interests: stored.interests ?? [],
    connectionGoals: stored.connectionGoals ?? [],
    connectionStyles: stored.connectionStyles ?? [],
    sensoryPreferences: stored.sensoryPreferences ?? [],
    meetupPreferences: stored.meetupPreferences ?? [],
    communication: {
      ...defaults.communication,
      ...stored.communication,
    },
  };
}
