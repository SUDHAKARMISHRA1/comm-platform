import { Redirect, Stack, useRootNavigationState, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@comm-platform/ui';

import { useAuth } from '@/providers/auth-provider';

const PUBLIC_SEGMENTS = new Set(['home', 'login', 'signup', 'forgot-password', 'reset-password']);
const AUTH_SEGMENTS = new Set(['login', 'signup', 'forgot-password']);

export function AuthGate() {
  const { configured, loading, session } = useAuth();
  const segments = useSegments();
  const navigation = useRootNavigationState();
  const first = segments[0];
  const onPublicScreen = !first || PUBLIC_SEGMENTS.has(String(first));

  if (!navigation?.key || loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!configured && !onPublicScreen && first !== 'setup') {
    return <Redirect href="/setup" />;
  }

  if (configured && !session && !onPublicScreen && first !== 'setup') {
    return <Redirect href="/login" />;
  }

  if (configured && session && AUTH_SEGMENTS.has(String(first))) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="setup" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="home" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
