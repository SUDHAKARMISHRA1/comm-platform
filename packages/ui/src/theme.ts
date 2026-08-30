export const colors = {
  bg: '#ffffff',
  surface: '#ffffff',
  surfaceMuted: '#f4f6f9',
  text: '#0b1f3a',
  textMuted: '#5a6b82',
  primary: '#0b1f3a',
  primaryText: '#ffffff',
  navy: '#0b1f3a',
  navyMuted: '#1e4a7a',
  navySoft: '#e8eef6',
  danger: '#dc2626',
  success: '#15803d',
  warning: '#ca8a04',
  border: '#d5dde8',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;

export const type = {
  title: 28,
  body: 16,
  small: 13,
} as const;

export const theme = { colors, space, radius, type } as const;
export type Theme = typeof theme;
