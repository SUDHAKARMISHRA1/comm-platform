import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, space, type } from '@comm-platform/ui';

import { HeaderAccount, MENU as ACCOUNT_MENU } from '@/components/header-account';
import { persistSessionBackup } from '@/lib/session-backup';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';

type NavItem = { label: string; href: string; primary?: boolean };

function primaryNav(session: boolean): NavItem[] {
  if (session) {
    return [
      { label: 'Highlights', href: '/highlights' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Practice', href: '/practice' },
    ];
  }
  return [
    { label: 'Home', href: '/home' },
    { label: 'Sign in', href: '/login' },
    { label: 'Sign up', href: '/signup', primary: true },
  ];
}

export function AppShell({ children }: { children: ReactNode }) {
  const { session, demoMode, signOutDemo } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function signOut() {
    setSigningOut(true);
    setMenuOpen(false);
    if (demoMode && !isSupabaseConfigured()) {
      signOutDemo();
    } else {
      persistSessionBackup(null);
      await getSupabase().auth.signOut();
    }
    router.replace('/home');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function go(href: string) {
    closeMenu();
    router.push(href as never);
  }

  useEffect(() => {
    if (Platform.OS !== 'web' || !menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  if (Platform.OS === 'web') {
    const navItems = primaryNav(Boolean(session));
    const homeHref = session ? '/highlights' : '/home';

    return (
      <div className="cp-shell">
        <style>{webCss}</style>
        <a href="#main-content" className="cp-skip">
          Skip to content
        </a>
        <header className="cp-header">
          <a href={homeHref} className="cp-brand">
            <span className="cp-brand-mark"><span className="cp-brand-dot" /></span>
            <span className="cp-brand-name">Comm Platform</span>
          </a>

          <nav className="cp-nav cp-nav-desktop" aria-label="Main">
            {navItems.map((item) =>
              item.primary ? (
                <a key={item.href} href={item.href} className="cp-nav-btn">
                  {item.label}
                </a>
              ) : (
                <a key={item.href} href={item.href} className="cp-nav-link">
                  {item.label}
                </a>
              ),
            )}
            {session ? <HeaderAccount signingOut={signingOut} onSignOut={signOut} /> : null}
          </nav>

          <button
            type="button"
            className="cp-menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`cp-menu-icon ${menuOpen ? 'cp-menu-icon-open' : ''}`} aria-hidden />
          </button>
        </header>

        {menuOpen ? (
          <>
            <button
              type="button"
              className="cp-menu-backdrop"
              aria-label="Close menu"
              onClick={closeMenu}
            />
            <aside className="cp-mobile-menu" aria-label="Mobile navigation">
              <div className="cp-mobile-menu-head">
                <p className="cp-mobile-menu-title">Menu</p>
                <button type="button" className="cp-mobile-close" aria-label="Close menu" onClick={closeMenu}>
                  ×
                </button>
              </div>
              <div className="cp-mobile-menu-body">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={item.primary ? 'cp-mobile-link cp-mobile-link-primary' : 'cp-mobile-link'}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                ))}
                {session ? (
                  <>
                    <div className="cp-mobile-divider" />
                    <a href="/notifications" className="cp-mobile-link" onClick={closeMenu}>
                      Notifications
                    </a>
                    {ACCOUNT_MENU.map((item) => (
                      <a key={item.href} href={item.href} className="cp-mobile-link" onClick={closeMenu}>
                        {item.label}
                      </a>
                    ))}
                    <button
                      type="button"
                      className="cp-mobile-link cp-mobile-link-danger"
                      disabled={signingOut}
                      onClick={() => void signOut()}
                    >
                      {signingOut ? 'Logging out…' : 'Logout'}
                    </button>
                  </>
                ) : null}
              </div>
            </aside>
          </>
        ) : null}

        <main id="main-content" className="cp-shell-main">
          {children}
        </main>
        <footer className="cp-footer">
          <span className="cp-footer-text">Comm Platform</span>
          <span className="cp-footer-text">Practice Java, C, and C++ problems.</span>
        </footer>
      </div>
    );
  }

  const navItems = primaryNav(Boolean(session));

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="link"
          onPress={() => router.replace(session ? '/highlights' : '/home')}
          style={styles.brand}
        >
          <View style={styles.brandMark}>
            <View style={styles.brandDot} />
          </View>
          <Text style={styles.brandName} numberOfLines={1}>
            Comm Platform
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
          onPress={() => setMenuOpen(true)}
          style={styles.menuBtn}
        >
          <View style={styles.menuBar} />
          <View style={styles.menuBar} />
          <View style={styles.menuBar} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} nestedScrollEnabled>
        {children}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Comm Platform</Text>
        <Text style={styles.footerText}>Practice Java, C, and C++ problems.</Text>
      </View>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={closeMenu}>
        <Pressable style={styles.menuBackdrop} onPress={closeMenu}>
          <Pressable style={styles.menuSheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.menuSheetHead}>
              <Text style={styles.menuSheetTitle}>Menu</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={closeMenu}>
                <Text style={styles.menuClose}>×</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.menuSheetBody}>
              {navItems.map((item) => (
                <Pressable
                  key={item.href}
                  onPress={() => go(item.href)}
                  style={[styles.menuLink, item.primary ? styles.menuLinkPrimary : null]}
                >
                  <Text style={[styles.menuLinkText, item.primary ? styles.menuLinkTextPrimary : null]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
              {session ? (
                <>
                  <View style={styles.menuDivider} />
                  <Pressable onPress={() => go('/notifications')} style={styles.menuLink}>
                    <Text style={styles.menuLinkText}>Notifications</Text>
                  </Pressable>
                  {ACCOUNT_MENU.map((item) => (
                    <Pressable key={item.href} onPress={() => go(item.href)} style={styles.menuLink}>
                      <Text style={styles.menuLinkText}>{item.label}</Text>
                    </Pressable>
                  ))}
                  <Pressable disabled={signingOut} onPress={() => void signOut()} style={styles.menuLink}>
                    <Text style={styles.menuLinkDanger}>{signingOut ? 'Logging out…' : 'Logout'}</Text>
                  </Pressable>
                </>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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

.cp-skip {
  position: absolute;
  left: -999px;
  top: .75rem;
  z-index: 200;
  padding: .6rem .9rem;
  border-radius: .5rem;
  background: #111827;
  color: #fff;
  font-size: .875rem;
  font-weight: 700;
  text-decoration: none;
}
.cp-skip:focus {
  left: 1rem;
}
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
  padding: 0 1rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04);
  z-index: 50;
  gap: .75rem;
}
@media (min-width: 768px) {
  .cp-header { padding: 0 1.5rem; }
}
.cp-brand {
  display: flex;
  align-items: center;
  gap: .625rem;
  text-decoration: none;
  flex: 1;
  min-width: 0;
}
.cp-brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Desktop nav */
.cp-nav-desktop {
  display: none;
  align-items: center;
  gap: .25rem;
  flex-shrink: 0;
}
@media (min-width: 768px) {
  .cp-nav-desktop { display: flex; }
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
  white-space: nowrap;
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
  white-space: nowrap;
}
.cp-nav-btn:hover { background: #4f46e5; }

/* Mobile menu button */
.cp-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  background: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color .12s, background .12s;
}
.cp-menu-btn:hover {
  border-color: #c7d2fe;
  background: #eef2ff;
}
@media (min-width: 768px) {
  .cp-menu-btn { display: none; }
}
.cp-menu-icon {
  position: relative;
  width: 18px;
  height: 2px;
  background: #374151;
  border-radius: 999px;
  transition: background .15s;
}
.cp-menu-icon::before,
.cp-menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 18px;
  height: 2px;
  background: #374151;
  border-radius: 999px;
  transition: transform .15s, top .15s, bottom .15s;
}
.cp-menu-icon::before { top: -6px; }
.cp-menu-icon::after { bottom: -6px; }
.cp-menu-icon-open { background: transparent; }
.cp-menu-icon-open::before {
  top: 0;
  transform: rotate(45deg);
}
.cp-menu-icon-open::after {
  bottom: 0;
  transform: rotate(-45deg);
}

/* Hide desktop account controls on mobile */
@media (max-width: 767px) {
  .cp-account-desktop { display: none !important; }
}

/* Mobile drawer */
.cp-menu-backdrop {
  position: fixed;
  inset: 0;
  border: 0;
  background: rgb(17 24 39 / 0.45);
  z-index: 60;
  cursor: pointer;
}
.cp-mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: min(88vw, 320px);
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e5e7eb;
  box-shadow: -8px 0 24px rgb(0 0 0 / 0.12);
  z-index: 70;
  display: flex;
  flex-direction: column;
}
.cp-mobile-menu-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem .75rem;
  border-bottom: 1px solid #e5e7eb;
}
.cp-mobile-menu-title {
  margin: 0;
  font-size: .875rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #6366f1;
}
.cp-mobile-close {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: .5rem;
  background: #fff;
  color: #374151;
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
}
.cp-mobile-menu-body {
  padding: .75rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: .25rem;
}
.cp-mobile-link {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: .75rem .85rem;
  border-radius: .5rem;
  text-decoration: none;
  color: #111827;
  font-size: .9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .12s;
}
.cp-mobile-link:hover { background: #f3f4f6; }
.cp-mobile-link-primary {
  background: #6366f1;
  color: #ffffff;
  text-align: center;
  margin-top: .25rem;
}
.cp-mobile-link-primary:hover { background: #4f46e5; }
.cp-mobile-link-danger { color: #b91c1c; }
.cp-mobile-link-danger:hover { background: #fee2e2; }
.cp-mobile-divider {
  height: 1px;
  background: #e5e7eb;
  margin: .5rem 0;
}

/* ── Footer ── */
.cp-footer {
  flex-shrink: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: .75rem;
  padding: .75rem 1rem;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}
@media (max-width: 640px) {
  .cp-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
@media (min-width: 768px) {
  .cp-footer { padding: .75rem 1.5rem; }
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
  header: {
    width: '100%',
    alignSelf: 'stretch',
    minHeight: 64,
    paddingHorizontal: space.md,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    zIndex: 40,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flex: 1, minWidth: 0 },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  brandName: { color: colors.text, fontSize: type.body, fontWeight: '700', flexShrink: 1 },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  menuBar: { width: 16, height: 2, borderRadius: 1, backgroundColor: colors.text },
  content: { flex: 1 },
  contentInner: { flexGrow: 1 },
  footer: {
    width: '100%',
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.md,
  },
  footerText: { color: colors.textMuted, fontSize: 12 },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: space.lg,
  },
  menuSheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  menuSheetTitle: {
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: type.small,
  },
  menuClose: { color: colors.textMuted, fontSize: 28, lineHeight: 28, paddingHorizontal: space.xs },
  menuSheetBody: { padding: space.md, gap: space.xs },
  menuLink: {
    borderRadius: radius.sm,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.md,
  },
  menuLinkPrimary: { backgroundColor: colors.primary, marginTop: space.xs },
  menuLinkText: { color: colors.text, fontWeight: '600', fontSize: type.body },
  menuLinkTextPrimary: { color: colors.primaryText, textAlign: 'center' },
  menuLinkDanger: { color: colors.danger, fontWeight: '700', fontSize: type.body, paddingHorizontal: space.md },
  menuDivider: { height: 1, backgroundColor: colors.border, marginVertical: space.sm },
});
