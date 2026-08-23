export const colors = {
  bg: '#f8fafc',
  surface: '#ffffff',
  surfaceMuted: '#f1f5f9',
  text: '#0f172a',
  textMuted: '#64748b',
  primary: '#0f766e',
  primaryText: '#ffffff',
  danger: '#dc2626',
  success: '#047857',
  border: '#e2e8f0',
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
