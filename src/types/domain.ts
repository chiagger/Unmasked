export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export type ConnectionStyle =
  | 'parallel-play'
  | 'infodump-exchange'
  | 'activity-first'
  | 'comfortable-silence'
  | 'text-first'
  | 'body-doubling';

export type ConnectionGoal =
  | 'close-friendship'
  | 'casual-friendship'
  | 'activity-partner'
  | 'online-friendship'
  | 'local-friendship'
  | 'interest-sharing'
  | 'small-groups';

export type ProfileVisibility = 'discoverable' | 'connections' | 'private';

export interface CommunicationPreferences {
  responseTime: '' | 'same-day' | 'one-to-three-days' | 'when-energy-allows';
  toneIndicators: boolean | null;
  preferredChannels?: ('text' | 'voice-notes' | 'calls' | 'in-person')[];
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
