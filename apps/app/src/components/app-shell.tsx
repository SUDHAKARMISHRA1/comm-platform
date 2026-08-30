import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, space, type } from '@comm-platform/ui';

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

export function AppShell({ children }: { children: ReactNode }) {
  const { session, demoMode, signOutDemo } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    if (demoMode && !isSupabaseConfigured()) {
      signOutDemo();
    } else {
      await getSupabase().auth.signOut();
    }
    router.replace('/home');
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Pressable accessibilityRole="link" onPress={() => router.replace(session ? '/highlights' : '/home')} style={styles.brand}>
          <View style={styles.brandMark}><View style={styles.brandDot} /></View>
          <Text style={styles.brandName}>Comm Platform</Text>
        </Pressable>
        <View style={styles.navigation}>
          {session ? (
            <>
              <Pressable accessibilityRole="link" onPress={() => router.replace('/highlights')} style={styles.navButton}>
                <Text style={styles.navText}>Highlights</Text>
              </Pressable>
              <Pressable accessibilityRole="link" onPress={() => router.push('/dashboard')} style={styles.navButton}>
                <Text style={styles.navText}>Dashboard</Text>
              </Pressable>
              <Pressable accessibilityRole="link" onPress={() => router.push('/practice')} style={styles.navButton}>
                <Text style={styles.navText}>Practice</Text>
              </Pressable>
              <Pressable accessibilityRole="link" onPress={() => router.push('/submissions')} style={styles.navButton}>
                <Text style={styles.navText}>Submissions</Text>
              </Pressable>
              <Pressable accessibilityRole="link" onPress={() => router.push('/profile')} style={styles.navButton}>
                <Text style={styles.navText}>Profile</Text>
              </Pressable>
              <Pressable accessibilityRole="button" disabled={signingOut} onPress={signOut} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>{signingOut ? 'Logging out…' : 'Log out'}</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable accessibilityRole="link" onPress={() => router.replace('/home')} style={styles.navButton}>
                <Text style={styles.navText}>Home</Text>
              </Pressable>
              <Pressable accessibilityRole="link" onPress={() => router.push('/login')} style={styles.navButton}>
                <Text style={styles.navText}>Sign in</Text>
              </Pressable>
              <Pressable accessibilityRole="link" onPress={() => router.push('/signup')} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Sign up</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Comm Platform</Text>
        <Text style={styles.footerText}>Connection, made considered.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { minHeight: 72, paddingHorizontal: space.lg, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 1 },
  brandMark: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#67e8f9' },
  brandName: { color: colors.text, fontSize: type.body, fontWeight: '700', flexShrink: 1 },
  navigation: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  navButton: { minHeight: 40, justifyContent: 'center', paddingHorizontal: space.sm },
  navText: { color: colors.textMuted, fontSize: type.small, fontWeight: '600' },
  primaryButton: { minHeight: 38, justifyContent: 'center', paddingHorizontal: space.sm + 4, borderRadius: radius.sm, backgroundColor: colors.text },
  primaryButtonText: { color: colors.surface, fontSize: type.small, fontWeight: '700' },
  content: { flex: 1 },
  footer: { borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: space.lg, paddingVertical: space.md, flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
  footerText: { color: colors.textMuted, fontSize: 12 },
});
