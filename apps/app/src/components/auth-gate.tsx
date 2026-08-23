import { Redirect, Stack, useRootNavigationState, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@comm-platform/ui';

import { useAuth } from '@/providers/auth-provider';

const PUBLIC_SEGMENTS = new Set(['login', 'signup', 'forgot-password', 'reset-password']);

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

  if (configured && session && onPublicScreen && first !== 'reset-password') {
    return <Redirect href="/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="setup" options={{ title: 'Setup required' }} />
      <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      <Stack.Screen name="signup" options={{ title: 'Create account' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Reset password' }} />
      <Stack.Screen name="reset-password" options={{ title: 'New password' }} />
      <Stack.Screen name="home" options={{ title: 'Home', headerBackVisible: false }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
