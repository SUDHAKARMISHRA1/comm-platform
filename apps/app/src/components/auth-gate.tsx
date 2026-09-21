import { Redirect, Stack, useGlobalSearchParams, useRootNavigationState, useSegments } from 'expo-router';

import { colors } from '@comm-platform/ui';

import { SeoHead } from '@/components/seo-head';
import { PageLoader } from '@/components/page-loader';
import { loginHref, safeNextPath } from '@/lib/site-links';
import { seoForSegment } from '@/lib/seo';
import { useAuth } from '@/providers/auth-provider';

/** Marketing/auth screens anyone can open. */
const PUBLIC_SEGMENTS = new Set(['home', 'login', 'signup', 'forgot-password', 'reset-password', 'contact']);
/** Signed-in users are sent to /highlights instead of these. */
const AUTH_SEGMENTS = new Set(['login', 'signup', 'forgot-password']);

/**
 * Route guard for Expo Router:
 * - missing Supabase config → `/setup`
 * - signed out on a protected route → `/login` (keeps `next` for Practice / Highlights)
 * - signed in on login/signup → `next` or `/highlights`
 */
export function AuthGate() {
  const { configured, demoMode, loading, session } = useAuth();
  const segments = useSegments();
  const params = useGlobalSearchParams<{ next?: string; skill?: string }>();
  const navigation = useRootNavigationState();
  const first = segments[0];
  const onPublicScreen = !first || PUBLIC_SEGMENTS.has(String(first));
  const authReady = configured || demoMode;

  if (!navigation?.key || loading) {
    return <PageLoader fullScreen message="Getting your workspace ready…" />;
  }

  if (!authReady && !onPublicScreen && first !== 'setup') {
    return <Redirect href="/setup" />;
  }

  if (authReady && !session && String(first) === 'highlights') {
    return <Redirect href={loginHref('/highlights')} />;
  }

  if (authReady && !session && !onPublicScreen && first !== 'setup') {
    const path = `/${segments.filter(Boolean).join('/')}`;
    const skill = typeof params.skill === 'string' ? params.skill : '';
    const dest = skill && path.startsWith('/practice') ? `${path}?skill=${encodeURIComponent(skill)}` : path;
    return <Redirect href={loginHref(dest || '/highlights')} />;
  }

  if (authReady && session && AUTH_SEGMENTS.has(String(first))) {
    const next = safeNextPath(params.next);
    return <Redirect href={(next ?? '/highlights') as never} />;
  }

  if (authReady && session && String(first) === 'home') {
    return <Redirect href="/highlights" />;
  }

  return (
    <>
      <SeoHead {...seoForSegment(first ? String(first) : 'home')} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg, flex: 1, width: '100%' },
        }}
      />
    </>
  );
}
