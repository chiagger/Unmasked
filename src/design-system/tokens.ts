import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const colors = {
  canvas: '#F5F6F3',
  surface: '#EFF2EF',
  surfaceRaised: '#FFFEFC',
  surfaceMuted: '#E7ECE9',
  text: '#24302E',
  textMuted: '#5F6B68',
  primary: '#267A74',
  primaryPressed: '#1F625E',
  primarySoft: '#D8EAE7',
  secondary: '#C96F5B',
  secondarySoft: '#F4DED7',
  warning: '#A94F55',
  warningSoft: '#F8E0E1',
  success: '#39745C',
  successSoft: '#DCECE3',
  border: '#D7DEDA',
  focus: '#365FA0',
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
      shadowColor: colors.text,
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
