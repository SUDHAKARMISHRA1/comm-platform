export const colors = {
  bg: '#0f172a',
  surface: '#1e293b',
  surfaceMuted: '#334155',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  primary: '#38bdf8',
  primaryText: '#0f172a',
  danger: '#fb7185',
  success: '#34d399',
  border: '#475569',
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
