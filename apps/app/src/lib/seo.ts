/** Public site copy used in document titles, meta tags, and the marketing home page. */
export const SITE_NAME = 'Comm Platform';
export const SITE_TAGLINE = 'Coding practice for Java, C, and C++';
export const SITE_DESCRIPTION =
  'Practice coding problems in Java, C, and C++. Work through easy, medium, and hard sets, run tests, and track your progress.';

export function siteOrigin() {
  const fromEnv = process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return 'http://localhost:8081';
}

export function pageTitle(title: string) {
  return title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
}

export type SeoConfig = {
  title: string;
  description: string;
  index: boolean;
  path: string;
};

const DEFAULT_PRIVATE: SeoConfig = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  index: false,
  path: '/',
};

const ROUTES: Record<string, SeoConfig> = {
  home: {
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    index: true,
    path: '/home',
  },
  login: {
    title: 'Sign in',
    description: 'Sign in to Comm Platform to practice coding problems in Java, C, and C++.',
    index: true,
    path: '/login',
  },
  signup: {
    title: 'Create an account',
    description: 'Create a Comm Platform account and start a structured coding practice path.',
    index: true,
    path: '/signup',
  },
  'forgot-password': {
    title: 'Reset password',
    description: 'Request a password reset email for your Comm Platform account.',
    index: false,
    path: '/forgot-password',
  },
  'reset-password': {
    title: 'Choose a new password',
    description: 'Set a new password for your Comm Platform account.',
    index: false,
    path: '/reset-password',
  },
  setup: {
    title: 'Connect Supabase',
    description: 'Local setup instructions for the Comm Platform product app.',
    index: false,
    path: '/setup',
  },
  highlights: { title: 'Highlights', description: SITE_DESCRIPTION, index: false, path: '/highlights' },
  dashboard: { title: 'Dashboard', description: SITE_DESCRIPTION, index: false, path: '/dashboard' },
  practice: { title: 'Practice problems', description: SITE_DESCRIPTION, index: false, path: '/practice' },
  submissions: { title: 'Submissions', description: SITE_DESCRIPTION, index: false, path: '/submissions' },
  profile: { title: 'Profile', description: SITE_DESCRIPTION, index: false, path: '/profile' },
  notifications: { title: 'Notifications', description: SITE_DESCRIPTION, index: false, path: '/notifications' },
  settings: { title: 'Settings', description: SITE_DESCRIPTION, index: false, path: '/settings' },
  contests: { title: 'Contests', description: SITE_DESCRIPTION, index: false, path: '/contests' },
  leaderboard: { title: 'Leaderboard', description: SITE_DESCRIPTION, index: false, path: '/leaderboard' },
};

export function seoForSegment(segment: string | undefined): SeoConfig {
  if (!segment) return ROUTES.home ?? DEFAULT_PRIVATE;
  return ROUTES[segment] ?? { ...DEFAULT_PRIVATE, title: SITE_NAME };
}
