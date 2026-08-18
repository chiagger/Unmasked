import type {
  CommunicationPreferences,
  ConnectionGoal,
  ConnectionStyle,
  EnergyLevel,
  ProfileVisibility,
} from '@/types/domain';

export interface EditableProfile {
  displayName: string;
  pronouns: string;
  dateOfBirth: string;
  age: number;
  city: string;
  languages: string;
  bio: string;
  prompt: string;
  promptAnswer: string;
  interests: string[];
  connectionGoals: ConnectionGoal[];
  connectionStyles: ConnectionStyle[];
  communication: CommunicationPreferences;
  planningStyle: '' | 'concrete' | 'flexible' | 'either';
  energy: EnergyLevel;
  energyNote: string;
  energyExpires: 'today' | 'tomorrow' | 'this-week';
  sensoryPreferences: string[];
  meetupPreferences: string[];
  advanceNotice: '' | 'same-day' | 'few-days' | 'one-week';
  physicalGreeting: '' | 'ask-first' | 'wave' | 'hug-okay';
  calls: '' | 'planned-only' | 'spontaneous-welcome' | 'no-calls';
  photos: '' | 'ask-first' | 'okay' | 'not-for-me';
  identityNote: string;
  visibility: ProfileVisibility;
  showEnergy: boolean;
  showDistance: boolean;
}

export function requiredProfileFieldsComplete(profile: Partial<EditableProfile> | null) {
  return Boolean(
    profile?.displayName?.trim()
      && profile.pronouns?.trim()
      && profile.dateOfBirth?.trim()
      && profile.city?.trim()
      && profile.languages?.trim()
      && profile.bio?.trim()
      && profile.interests?.length,
  );
}

export const initialProfile = (displayName = ''): EditableProfile => ({
  displayName,
  pronouns: '',
  dateOfBirth: '',
  age: 0,
  city: '',
  languages: '',
  bio: '',
  prompt: '',
  promptAnswer: '',
  interests: [],
  connectionGoals: [],
  connectionStyles: [],
  communication: {
    responseTime: '',
    toneIndicators: null,
    preferredChannels: [],
  },
  planningStyle: '',
  energy: 3,
  energyNote: '',
  energyExpires: 'today',
  sensoryPreferences: [],
  meetupPreferences: [],
  advanceNotice: '',
  physicalGreeting: '',
  calls: '',
  photos: '',
  identityNote: '',
  visibility: 'discoverable',
  showEnergy: true,
  showDistance: true,
});

export const profileOptions = {
  prompts: [
    'I can talk for hours about…',
    'A good afternoon for me looks like…',
    "We'll probably get along if…",
  ],
  goals: [
    ['close-friendship', 'Close friendship'],
    ['casual-friendship', 'Casual friendship'],
    ['activity-partner', 'Activity partner'],
    ['online-friendship', 'Online friendship'],
    ['local-friendship', 'Local friendship'],
    ['interest-sharing', 'Share an interest'],
    ['small-groups', 'Small groups'],
  ] as [ConnectionGoal, string][],
  styles: [
    ['parallel-play', 'Parallel play'],
    ['infodump-exchange', 'Infodump exchange'],
    ['activity-first', 'Activity first'],
    ['comfortable-silence', 'Comfortable silence'],
    ['text-first', 'Text first'],
    ['body-doubling', 'Body doubling'],
  ] as [ConnectionStyle, string][],
  channels: [
    ['text', 'Text'],
    ['voice-notes', 'Voice notes'],
    ['calls', 'Calls'],
    ['in-person', 'In person'],
  ] as const,
  sensory: [
    'Quiet or ambient noise',
    'Natural or warm light',
    'Low crowd density',
    'Outdoor spaces',
    'Familiar locations',
    'Quiet space available',
    'Alcohol-free venues',
    'Fragrance-aware spaces',
  ],
  meetups: [
    'Daytime meetups',
    'Planned end time',
    'Easy cancellation',
    'Familiar venue first',
    'One-to-one',
    'Small groups',
    'Support person welcome',
    'Seated activities',
  ],
} as const;
