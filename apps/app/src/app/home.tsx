import { useQuery } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, colors, radius, space, type } from '@comm-platform/ui';

import { fetchOwnProfile } from '@/lib/auth-actions';
import { getSupabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

export default function HomeScreen() {
  const { user } = useAuth();
  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchOwnProfile(getSupabase(), user!.id),
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.kicker}>Home</Text>
        <Text style={styles.title}>Welcome back</Text>
        {profileQuery.isLoading ? <ActivityIndicator color={colors.primary} /> : null}
        {profileQuery.isError ? (
          <Text style={styles.error}>Could not load your profile. Pull back later or open Profile to retry.</Text>
        ) : null}
        {profileQuery.data ? (
          <>
            <Text style={styles.body}>
              Signed in as {profileQuery.data.displayName ?? profileQuery.data.username ?? user?.email}
            </Text>
            <Text style={styles.muted}>@{profileQuery.data.username}</Text>
          </>
        ) : null}
        {!profileQuery.isLoading && !profileQuery.data && !profileQuery.isError ? (
          <Text style={styles.muted}>No profile row yet. It is created automatically at signup; try refreshing.</Text>
        ) : null}
        <Link href="/profile" asChild>
          <Pressable>
            <Text style={styles.link}>Edit profile</Text>
          </Pressable>
        </Link>
        <Button
          label="Sign out"
          variant="secondary"
          onPress={async () => {
            await getSupabase().auth.signOut();
            router.replace('/login');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, padding: space.lg, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.lg,
    gap: space.md,
  },
  kicker: { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: type.small },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700' },
  body: { color: colors.text, fontSize: type.body },
  muted: { color: colors.textMuted, fontSize: type.body },
  error: { color: colors.danger, fontSize: type.body },
  link: { color: colors.primary, fontWeight: '600', fontSize: type.body },
});
