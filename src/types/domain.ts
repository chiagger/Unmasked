export type EnergyLevel = 'open' | 'limited' | 'quiet';

export type ConnectionStyle =
  | 'parallel-play'
  | 'infodump-exchange'
  | 'activity-first';

export interface CommunicationPreferences {
  directness: 'direct' | 'gentle-direct';
  responseTime: 'same-day' | 'one-to-three-days' | 'when-energy-allows';
  toneIndicators: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  age: number;
  city: string;
  distanceKm: number;
  bio: string;
  interests: string[];
  connectionStyles: ConnectionStyle[];
  communication: CommunicationPreferences;
  energy: EnergyLevel;
  sharedInterestCount: number;
}

export interface SensoryProfile {
  noise: 'quiet' | 'ambient' | 'loud';
  lighting: 'natural' | 'warm' | 'fluorescent' | 'dim';
  crowd: 'spacious' | 'moderate' | 'busy';
  hasQuietSpace: boolean;
}

export interface Venue {
  id: string;
  name: string;
  kind: string;
  distanceKm: number;
  sensory: SensoryProfile;
  rating: number;
  ratingCount: number;
}
