export const colors = {
  // Backgrounds
  bg: '#fafafa',
  surface: '#ffffff',
  surfaceMuted: '#f5f5f5',
  surfaceRaised: '#f9fafb',

  // Text
  text: '#111827',
  textMuted: '#6b7280',
  textSubtle: '#9ca3af',

  // Primary / Accent (Indigo)
  primary: '#6366f1',
  primaryHover: '#4f46e5',
  primaryText: '#ffffff',
  primarySoft: '#eef2ff',
  primaryMuted: '#818cf8',

  // Legacy navy aliases (kept for backward compat)
  navy: '#1e293b',
  navyMuted: '#334155',
  navySoft: '#f1f5f9',

  // Semantic
  danger: '#ef4444',
  dangerSoft: '#fee2e2',
  dangerText: '#b91c1c',
  success: '#22c55e',
  successSoft: '#dcfce7',
  successText: '#15803d',
  warning: '#f59e0b',
  warningSoft: '#fef3c7',
  warningText: '#b45309',

  // Borders
  border: '#e5e7eb',
  borderMuted: '#f3f4f6',
  borderStrong: '#d1d5db',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const type = {
  title: 28,
  body: 16,
  small: 13,
} as const;

/**
 * Font families:
 * - Web: Inter (loaded via next/font or Google Fonts CDN)
 * - iOS: SF Pro (system default, excellent for UI)
 * - Android: Roboto (system default, excellent for UI)
 * The fallback chain ensures the best available font on every platform.
 */
export const fonts = {
  sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace',
} as const;

export const theme = { colors, space, radius, type, fonts } as const;
export type Theme = typeof theme;
