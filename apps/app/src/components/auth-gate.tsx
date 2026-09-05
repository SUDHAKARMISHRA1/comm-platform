import { Redirect, Stack, useRootNavigationState, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@comm-platform/ui';

import { useAuth } from '@/providers/auth-provider';

/** Marketing/auth screens anyone can open. */
const PUBLIC_SEGMENTS = new Set(['home', 'login', 'signup', 'forgot-password', 'reset-password']);
/** Signed-in users are sent to /highlights instead of these. */
const AUTH_SEGMENTS = new Set(['login', 'signup', 'forgot-password']);

/**
 * Route guard for Expo Router:
 * - missing Supabase config → `/setup`
 * - signed out on a protected route → `/login` (or `/home` from highlights)
 * - signed in on login/home → `/highlights`
 */
export function AuthGate() {
  const { configured, demoMode, loading, session } = useAuth();
  const segments = useSegments();
  const navigation = useRootNavigationState();
  const first = segments[0];
  const onPublicScreen = !first || PUBLIC_SEGMENTS.has(String(first));
  const authReady = configured || demoMode;

  if (!navigation?.key || loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!authReady && !onPublicScreen && first !== 'setup') {
    return <Redirect href="/setup" />;
  }

  if (authReady && !session && String(first) === 'highlights') {
    return <Redirect href="/home" />;
  }

  if (authReady && !session && !onPublicScreen && first !== 'setup') {
    return <Redirect href="/login" />;
  }

  if (authReady && session && (AUTH_SEGMENTS.has(String(first)) || String(first) === 'home')) {
    return <Redirect href="/highlights" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg, flex: 1, width: '100%' },
      }}
    />
  );
}
