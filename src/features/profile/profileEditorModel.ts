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
  ageRange: string;
  city: string;
  languages: string;
  bio: string;
  prompt: string;
  promptAnswer: string;
  interests: string[];
  connectionGoals: ConnectionGoal[];
  connectionStyles: ConnectionStyle[];
  communication: CommunicationPreferences;
  planningStyle: 'concrete' | 'flexible' | 'either';
  energy: EnergyLevel;
  energyNote: string;
  energyExpires: 'today' | 'tomorrow' | 'this-week';
  sensoryPreferences: string[];
  meetupPreferences: string[];
  meetupDuration: '30-minutes' | 'one-hour' | 'flexible';
  advanceNotice: 'same-day' | 'few-days' | 'one-week';
  physicalGreeting: 'ask-first' | 'wave' | 'hug-okay';
  calls: 'planned-only' | 'spontaneous-welcome' | 'no-calls';
  photos: 'ask-first' | 'okay' | 'not-for-me';
  identityNote: string;
  visibility: ProfileVisibility;
  showEnergy: boolean;
  showDistance: boolean;
}

export const initialProfile = (displayName = ''): EditableProfile => ({
  displayName,
  pronouns: '',
  ageRange: '25–34',
  city: '',
  languages: '',
  bio: '',
  prompt: 'I can talk for hours about…',
  promptAnswer: '',
  interests: [],
  connectionGoals: [],
  connectionStyles: [],
  communication: {
    directness: 'direct',
    responseTime: 'one-to-three-days',
    toneIndicators: true,
    followUpMessages: 'welcome',
    preferredChannels: ['text'],
  },
  planningStyle: 'concrete',
  energy: 'open',
  energyNote: '',
  energyExpires: 'today',
  sensoryPreferences: [],
  meetupPreferences: [],
  meetupDuration: 'one-hour',
  advanceNotice: 'few-days',
  physicalGreeting: 'ask-first',
  calls: 'planned-only',
  photos: 'ask-first',
  identityNote: '',
  visibility: 'discoverable',
  showEnergy: true,
  showDistance: true,
});

export const profileOptions = {
  ageRanges: ['18–24', '25–34', '35–44', '45–54', '55+'],
  prompts: [
    'I can talk for hours about…',
    'A good afternoon for me looks like…',
    "We'll probably get along if…",
    "Something I'd like to try with someone…",
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
