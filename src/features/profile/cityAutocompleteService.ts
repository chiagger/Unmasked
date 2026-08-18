import { Platform } from 'react-native';

import { env } from '@/config/env';

const applicationId = 'com.unmasked.unmasked';

export interface CityPrediction {
  id: string;
  city: string;
  context: string;
  fullText: string;
  displayText: string;
}

function getGoogleHeaders(): Record<string, string> | null {
  if (Platform.OS === 'android') {
    if (!env.googlePlacesAndroidKey || !env.googlePlacesAndroidCert) return null;
    return {
      'X-Goog-Api-Key': env.googlePlacesAndroidKey,
      'X-Android-Package': applicationId,
      'X-Android-Cert': env.googlePlacesAndroidCert,
    };
  }
  if (Platform.OS === 'ios') {
    if (!env.googlePlacesIosKey) return null;
    return {
      'X-Goog-Api-Key': env.googlePlacesIosKey,
      'X-Ios-Bundle-Identifier': applicationId,
    };
  }
  return null;
}

export function cityAutocompleteIsConfigured() {
  return getGoogleHeaders() !== null;
}

export async function searchCities(input: string, sessionToken: string, signal: AbortSignal) {
  const platformHeaders = getGoogleHeaders();
  if (!platformHeaders) return [];

  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    signal,
    headers: {
      ...platformHeaders,
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': [
        'suggestions.placePrediction.placeId',
        'suggestions.placePrediction.text.text',
        'suggestions.placePrediction.structuredFormat.mainText.text',
        'suggestions.placePrediction.structuredFormat.secondaryText.text',
      ].join(','),
    },
    body: JSON.stringify({
      input,
      includedPrimaryTypes: ['(cities)'],
      languageCode: 'en',
      sessionToken,
    }),
  });
  if (!response.ok) throw new Error(`Places autocomplete failed with ${response.status}`);

  const payload = await response.json() as {
    suggestions?: { placePrediction?: {
      placeId?: string;
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
    } }[];
  };

  return (payload.suggestions ?? []).flatMap(({ placePrediction }) => {
    const id = placePrediction?.placeId;
    const city = placePrediction?.structuredFormat?.mainText?.text;
    const fullText = placePrediction?.text?.text;
    if (!id || !city || !fullText) return [];
    const context = placePrediction.structuredFormat?.secondaryText?.text ?? '';
    const country = context.split(',').at(-1)?.trim() ?? '';
    return [{
      id,
      city,
      context,
      fullText,
      displayText: country ? `${city}, ${country}` : city,
    } satisfies CityPrediction];
  });
}
