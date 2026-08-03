import type { Venue } from '@/types/domain';

export const mockVenues: Venue[] = [
  {
    id: 'willow-library',
    name: 'Willow Library Café',
    kind: 'Library café',
    distanceKm: 1.4,
    rating: 4.8,
    ratingCount: 42,
    sensory: {
      noise: 'quiet',
      lighting: 'natural',
      crowd: 'spacious',
      hasQuietSpace: true,
    },
  },
  {
    id: 'moss-garden',
    name: 'Moss Community Garden',
    kind: 'Outdoor space',
    distanceKm: 2.7,
    rating: 4.6,
    ratingCount: 28,
    sensory: {
      noise: 'ambient',
      lighting: 'natural',
      crowd: 'spacious',
      hasQuietSpace: true,
    },
  },
];
