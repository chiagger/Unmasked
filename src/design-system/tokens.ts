import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  canvas: '#F7F2EC',
  surface: '#EEEAE4',
  surfaceRaised: '#FBF8F4',
  surfaceMuted: '#E5E1DA',
  text: '#292B29',
  textMuted: '#666B66',
  primary: '#64745D',
  primaryPressed: '#52604D',
  primarySoft: '#DCE4D8',
  secondary: '#687A86',
  secondarySoft: '#DDE5E9',
  warning: '#A97878',
  warningSoft: '#F1DEDC',
  success: '#607B67',
  border: '#D7D2CA',
  focus: '#43566A',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 34,
    lineHeight: 43,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    lineHeight: 33,
    fontWeight: '700',
  },
  heading: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  caption: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  },
} satisfies Record<string, TextStyle>;

export const shadows = {
  soft: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#292B29',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
    },
    android: { elevation: 2 },
    default: {},
  }),
} as const;

export const layout = {
  contentMaxWidth: 680,
  minimumTouchTarget: 48,
} as const;
