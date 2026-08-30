import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, space, type } from '@comm-platform/ui';

import { HeaderAccount } from '@/components/header-account';
import { persistSessionBackup } from '@/lib/session-backup';
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
      persistSessionBackup(null);
      await getSupabase().auth.signOut();
    }
    router.replace('/home');
  }

  const nav = session ? (
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
      <HeaderAccount signingOut={signingOut} onSignOut={signOut} />
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
  );

  const header = (
    <View style={styles.header}>
      <Pressable accessibilityRole="link" onPress={() => router.replace(session ? '/highlights' : '/home')} style={styles.brand}>
        <View style={styles.brandMark}><View style={styles.brandDot} /></View>
        <Text style={styles.brandName}>Comm Platform</Text>
      </Pressable>
      <View style={styles.navigation}>{nav}</View>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Comm Platform</Text>
      <Text style={styles.footerText}>Connection, made considered.</Text>
    </View>
  );

  if (Platform.OS === 'web') {
    return (
      <div className="cp-shell">
        <style>{webCss}</style>
        {header}
        <div className="cp-shell-main">{children}</div>
        {footer}
      </div>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {header}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} nestedScrollEnabled>
        {children}
      </ScrollView>
      {footer}
    </SafeAreaView>
  );
}

const webCss = `
html, body, #root {
  width: 100% !important;
  height: 100% !important;
  margin: 0;
  overflow: hidden !important;
  background: #ffffff;
}
.cp-shell {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  align-self: stretch;
}
.cp-shell-main {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: auto;
  scrollbar-color: #94a3b8 #e2e8f0;
}
.cp-shell-main::-webkit-scrollbar { width: 12px; }
.cp-shell-main::-webkit-scrollbar-track { background: #e2e8f0; }
.cp-shell-main::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 8px; border: 2px solid #e2e8f0; }
.cp-shell-main::-webkit-scrollbar-thumb:hover { background: #64748b; }
.cp-shell-main > * { width: 100%; box-sizing: border-box; }
.cp-shell-main [class*="r-overflow-1dqxon3"] {
  overflow: visible !important;
  height: auto !important;
  flex: none !important;
}
.cp-shell-main .db-table-wrap {
  overflow: auto !important;
  max-height: 18rem !important;
}
`;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { width: '100%', alignSelf: 'stretch', minHeight: 72, paddingHorizontal: space.lg, borderBottomWidth: 1, borderColor: colors.navy, backgroundColor: colors.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm, overflow: 'visible', zIndex: 40 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 1 },
  brandMark: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.navy },
  brandName: { color: colors.primaryText, fontSize: type.body, fontWeight: '700', flexShrink: 1 },
  navigation: { flexDirection: 'row', alignItems: 'center', gap: space.xs, flexShrink: 0, overflow: 'visible', zIndex: 40 },
  navButton: { minHeight: 40, justifyContent: 'center', paddingHorizontal: space.sm },
  navText: { color: colors.primaryText, fontSize: type.small, fontWeight: '600' },
  primaryButton: { minHeight: 38, justifyContent: 'center', paddingHorizontal: space.sm + 4, borderRadius: radius.sm, backgroundColor: colors.navyMuted, borderWidth: 1, borderColor: colors.surface },
  primaryButtonText: { color: colors.primaryText, fontSize: type.small, fontWeight: '700' },
  content: { flex: 1 },
  contentInner: { flexGrow: 1 },
  footer: { width: '100%', alignSelf: 'stretch', borderTopWidth: 1, borderColor: colors.navy, backgroundColor: colors.navy, paddingHorizontal: space.lg, paddingVertical: space.md, flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
  footerText: { color: colors.primaryText, fontSize: 12, opacity: 0.85 },
});
