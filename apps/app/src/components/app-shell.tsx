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

  if (Platform.OS === 'web') {
    const webNav = session ? (
      <>
        <a href="/highlights" className="cp-nav-link">Highlights</a>
        <a href="/dashboard" className="cp-nav-link">Dashboard</a>
        <a href="/practice" className="cp-nav-link">Practice</a>
        <HeaderAccount signingOut={signingOut} onSignOut={signOut} />
      </>
    ) : (
      <>
        <a href="/home" className="cp-nav-link">Home</a>
        <a href="/login" className="cp-nav-link">Sign in</a>
        <a href="/signup" className="cp-nav-btn">Sign up</a>
      </>
    );

    return (
      <div className="cp-shell">
        <style>{webCss}</style>
        <header className="cp-header">
          <a href={session ? '/highlights' : '/home'} className="cp-brand">
            <span className="cp-brand-mark"><span className="cp-brand-dot" /></span>
            <span className="cp-brand-name">Comm Platform</span>
          </a>
          <nav className="cp-nav">{webNav}</nav>
        </header>
        <div className="cp-shell-main">{children}</div>
        <footer className="cp-footer">
          <span className="cp-footer-text">Comm Platform</span>
          <span className="cp-footer-text">Connection, made considered.</span>
        </footer>
      </div>
    );
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; }
html, body, #root {
  width: 100% !important;
  height: 100% !important;
  margin: 0;
  overflow: hidden !important;
  background: #fafafa;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-feature-settings: 'cv02','cv03','cv04','cv11';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Shell layout ── */
.cp-shell {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

/* ── Header ── */
.cp-header {
  flex-shrink: 0;
  width: 100%;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04);
  z-index: 40;
  gap: 1rem;
}
.cp-brand {
  display: flex;
  align-items: center;
  gap: .625rem;
  text-decoration: none;
  flex-shrink: 0;
}
.cp-brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cp-brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #6366f1;
}
.cp-brand-name {
  font-size: .9375rem;
  font-weight: 700;
  color: #111827;
  letter-spacing: -.01em;
}
.cp-nav {
  display: flex;
  align-items: center;
  gap: .25rem;
  flex-shrink: 0;
}
.cp-nav-link {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 .75rem;
  border-radius: .375rem;
  font-size: .875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  transition: background .12s, color .12s;
}
.cp-nav-link:hover {
  background: #f3f4f6;
  color: #111827;
}
.cp-nav-btn {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 .875rem;
  border-radius: .375rem;
  font-size: .875rem;
  font-weight: 600;
  color: #ffffff;
  background: #6366f1;
  text-decoration: none;
  transition: background .12s;
}
.cp-nav-btn:hover { background: #4f46e5; }

/* ── Footer ── */
.cp-footer {
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .75rem 1.5rem;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}
.cp-footer-text {
  font-size: .75rem;
  color: #9ca3af;
}

/* ── Main scroll area ── */
.cp-shell-main {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}
.cp-shell-main::-webkit-scrollbar { width: 6px; }
.cp-shell-main::-webkit-scrollbar-track { background: #f3f4f6; }
.cp-shell-main::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 999px; }
.cp-shell-main::-webkit-scrollbar-thumb:hover { background: #6b7280; }
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
  brandMark: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primaryText },
  brandName: { color: colors.primaryText, fontSize: type.body, fontWeight: '700', flexShrink: 1 },
  navigation: { flexDirection: 'row', alignItems: 'center', gap: space.xs, flexShrink: 0, overflow: 'visible', zIndex: 40 },
  navButton: { minHeight: 40, justifyContent: 'center', paddingHorizontal: space.sm },
  navText: { color: colors.primaryText, fontSize: type.small, fontWeight: '600' },
  primaryButton: { minHeight: 38, justifyContent: 'center', paddingHorizontal: space.sm + 4, borderRadius: radius.sm, backgroundColor: colors.primary, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  primaryButtonText: { color: colors.primaryText, fontSize: type.small, fontWeight: '700' },
  content: { flex: 1 },
  contentInner: { flexGrow: 1 },
  footer: { width: '100%', alignSelf: 'stretch', borderTopWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: space.lg, paddingVertical: space.md, flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
  footerText: { color: colors.textMuted, fontSize: 12 },
});
