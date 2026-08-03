import type { UserProfile } from '@/types/domain';

export const mockProfiles: UserProfile[] = [
  {
    id: 'alex-demo',
    displayName: 'Alex',
    age: 29,
    city: 'Manchester',
    distanceKm: 3.2,
    bio: 'Urban planning rabbit holes, slow museum afternoons, and quietly making tiny things from clay.',
    interests: ['Urban planning', 'Miniatures', 'Museums', 'Cozy games'],
    connectionStyles: ['parallel-play', 'infodump-exchange'],
    communication: {
      directness: 'direct',
      responseTime: 'one-to-three-days',
      toneIndicators: true,
    },
    energy: 'limited',
    sharedInterestCount: 4,
  },
  {
    id: 'sam-demo',
    displayName: 'Sam',
    age: 32,
    city: 'Manchester',
    distanceKm: 6.8,
    bio: 'Looking for nature walks, board games, and people who do not mind comfortable silence.',
    interests: ['Birdwatching', 'Board games', 'Folklore'],
    connectionStyles: ['activity-first', 'parallel-play'],
    communication: {
      directness: 'gentle-direct',
      responseTime: 'when-energy-allows',
      toneIndicators: false,
    },
    energy: 'open',
    sharedInterestCount: 3,
  },
];
