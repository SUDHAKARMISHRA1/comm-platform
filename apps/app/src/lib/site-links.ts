import { SITE_NAME } from '@/lib/seo';

export const PRACTICE_TRACKS = [
  { label: 'Java', skillId: 'skill-java' },
  { label: 'C++', skillId: 'skill-cpp' },
  { label: 'C', skillId: 'skill-c' },
] as const;

export const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: process.env.EXPO_PUBLIC_SOCIAL_INSTAGRAM ?? 'https://www.instagram.com/commplatform',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: process.env.EXPO_PUBLIC_SOCIAL_FACEBOOK ?? 'https://www.facebook.com/commplatform',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: process.env.EXPO_PUBLIC_SOCIAL_YOUTUBE ?? 'https://www.youtube.com/@commplatform',
  },
  {
    id: 'threads',
    label: 'Threads',
    href: process.env.EXPO_PUBLIC_SOCIAL_THREADS ?? 'https://www.threads.net/@commplatform',
  },
  {
    id: 'x',
    label: 'X',
    href: process.env.EXPO_PUBLIC_SOCIAL_X ?? 'https://x.com/commplatform',
  },
] as const;

/** Only in-app paths, so login `next` cannot bounce users off-site. */
export function safeNextPath(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('://')) return null;
  return decoded;
}

export function loginHref(nextPath: string) {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export function signupHref(nextPath?: string | null) {
  if (!nextPath) return '/signup';
  return `/signup?next=${encodeURIComponent(nextPath)}`;
}

export function continueHref(path: string, signedIn: boolean) {
  return signedIn ? path : loginHref(path);
}

export function practiceHref(skillId: string, signedIn: boolean) {
  return continueHref(`/practice?skill=${encodeURIComponent(skillId)}`, signedIn);
}

export function copyrightLine(year = new Date().getFullYear()) {
  return `© ${year} ${SITE_NAME}. All rights reserved.`;
}
