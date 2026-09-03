import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { fetchSubmissions } from '@/coding/api/submissionApi';
import {
  buildNotificationFeed,
  loadSeenNotificationIds,
  saveSeenNotificationIds,
} from '@/lib/notifications';
import { spaNavigate } from '@/lib/spa-nav';
import { useAuth } from '@/providers/auth-provider';
import { useQuery } from '@tanstack/react-query';

const MENU = [
  { label: 'Profile', href: '/profile' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Setting', href: '/settings' },
  { label: 'All Submissions list', href: '/submissions' },
  { label: 'Contests', href: '/contests' },
] as const;

export { MENU };

export function HeaderAccount({
  signingOut,
  onSignOut,
}: {
  signingOut: boolean;
  onSignOut: () => void;
}) {
  const { user, session, loading } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(() => loadSeenNotificationIds());
  const wrapRef = useRef<{ contains: (node: Node) => boolean } | null>(null);

  const subs = useQuery({
    queryKey: ['submissions'],
    queryFn: fetchSubmissions,
    enabled: Boolean(session) && !loading,
  });

  const notifications = useMemo(
    () => buildNotificationFeed(subs.data?.submissions ?? []),
    [subs.data?.submissions],
  );
  const preview = notifications.slice(0, 5);
  const unread = notifications.filter((n) => !seen.has(n.id)).length;
  const initial = (user?.email?.[0] ?? 'U').toUpperCase();

  function markBellRead() {
    const next = new Set(seen);
    notifications.forEach((n) => next.add(n.id));
    setSeen(next);
    saveSeenNotificationIds(next);
  }

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    function onDoc(ev: MouseEvent) {
      if (!wrapRef.current?.contains(ev.target as Node)) {
        setProfileOpen(false);
        setBellOpen(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  if (Platform.OS === 'web') {
    return (
      <div className="cp-account cp-account-desktop" ref={(el) => { wrapRef.current = el; }}>
        <style>{accountCss}</style>
        <div
          className="cp-bell-wrap"
          onMouseEnter={() => setBellOpen(true)}
          onMouseLeave={() => setBellOpen(false)}
        >
          <button
            type="button"
            className="cp-icon-btn"
            aria-label={unread ? `${unread} new notifications` : 'Notifications'}
            onClick={() => {
              markBellRead();
              setBellOpen(true);
            }}
          >
            <span className="cp-bell-glyph" aria-hidden>
              ⌂
            </span>
            {unread > 0 ? <span className="cp-badge">{unread > 9 ? '9+' : unread}</span> : null}
          </button>
          {bellOpen ? (
            <div className="cp-panel cp-panel-bell">
              {preview.length === 0 ? <p className="cp-empty">No notifications yet.</p> : null}
              {preview.map((n) => (
                <a
                  key={n.id}
                  href={n.href ?? '/notifications'}
                  className={seen.has(n.id) ? 'cp-item' : 'cp-item cp-item-new'}
                  onClick={(e) => spaNavigate(n.href ?? '/notifications', e)}
                >
                  <strong>{n.title}</strong>
                  <span>{n.body}</span>
                </a>
              ))}
              <a
                href="/notifications"
                className="cp-item cp-item-all"
                onClick={(e) => spaNavigate('/notifications', e)}
              >
                View all notifications
              </a>
            </div>
          ) : null}
        </div>

        <div className="cp-profile-wrap">
          <button
            type="button"
            className="cp-avatar"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-label="Account menu"
            onClick={() => {
              setProfileOpen((o) => !o);
              setBellOpen(false);
            }}
          >
            {initial}
          </button>
          {profileOpen ? (
            <div className="cp-panel" role="menu">
              {MENU.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className="cp-item"
                  onClick={(e) => {
                    setProfileOpen(false);
                    spaNavigate(item.href, e);
                  }}
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                className="cp-item cp-item-danger"
                disabled={signingOut}
                onClick={() => {
                  setProfileOpen(false);
                  onSignOut();
                }}
              >
                {signingOut ? 'Logging out…' : 'Logout'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        onPress={() => {
          markBellRead();
          setBellOpen((o) => !o);
          setProfileOpen(false);
        }}
        style={styles.iconBtn}
      >
        <Text style={styles.iconText}>🔔</Text>
        {unread > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
          </View>
        ) : null}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Account menu"
        onPress={() => {
          setProfileOpen((o) => !o);
          setBellOpen(false);
        }}
        style={styles.avatar}
      >
        <Text style={styles.avatarText}>{initial}</Text>
      </Pressable>
      {bellOpen ? (
        <View style={[styles.menu, styles.bellMenu]}>
          {preview.map((n) => (
            <Pressable
              key={n.id}
              onPress={() => {
                setBellOpen(false);
                router.push((n.href ?? '/notifications') as never);
              }}
            >
              <Text style={styles.menuTitle}>{n.title}</Text>
              <Text style={styles.menuBody}>{n.body}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => {
              setBellOpen(false);
              router.push('/notifications');
            }}
          >
            <Text style={styles.link}>View all notifications</Text>
          </Pressable>
        </View>
      ) : null}
      {profileOpen ? (
        <View style={styles.menu}>
          {MENU.map((item) => (
            <Pressable
              key={item.href}
              onPress={() => {
                setProfileOpen(false);
                router.push(item.href as never);
              }}
            >
              <Text style={styles.menuLabel}>{item.label}</Text>
            </Pressable>
          ))}
          <Pressable disabled={signingOut} onPress={onSignOut}>
            <Text style={styles.danger}>{signingOut ? 'Logging out…' : 'Logout'}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const accountCss = `
.cp-account { display:flex; align-items:center; gap:.45rem; position:relative; }
.cp-account-desktop { display:flex; }
.cp-bell-wrap, .cp-profile-wrap { position:relative; }
.cp-icon-btn, .cp-avatar {
  width:36px; height:36px; border-radius:999px; border:1px solid #e5e7eb; background:#f9fafb;
  display:inline-flex; align-items:center; justify-content:center; cursor:pointer; position:relative;
  color:#374151; font-weight:800; transition: border-color .15s, background .15s;
}
.cp-icon-btn:hover { border-color:#c7d2fe; background:#eef2ff; color:#6366f1; }
.cp-avatar { background:#6366f1 !important; border-color:#6366f1 !important; color:#ffffff !important; font-size:.875rem; }
.cp-avatar:hover { background:#4f46e5 !important; border-color:#4f46e5 !important; }
.cp-bell-glyph { font-size:0; width:15px; height:15px; display:block;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm8-6V11a8 8 0 1 0-16 0v5l-2 2v1h20v-1l-2-2Z'/%3E%3C/svg%3E") center / contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm8-6V11a8 8 0 1 0-16 0v5l-2 2v1h20v-1l-2-2Z'/%3E%3C/svg%3E") center / contain no-repeat;
}
.cp-badge {
  position:absolute; top:-4px; right:-4px; min-width:18px; height:18px; padding:0 4px;
  border-radius:999px; background:#ef4444; color:#fff; font-size:10px; font-weight:800;
  display:flex; align-items:center; justify-content:center;
}
.cp-panel {
  position:absolute; right:0; top:calc(100% + 8px); width:220px; background:#ffffff;
  border:1px solid #e5e7eb; border-radius:.75rem; box-shadow:0 10px 15px -3px rgb(0 0 0/.1), 0 4px 6px -4px rgb(0 0 0/.1);
  padding:.35rem; z-index:120;
}
.cp-panel-bell { width:320px; }
.cp-item {
  display:block; width:100%; text-align:left; border:0; background:transparent; cursor:pointer;
  padding:.65rem .7rem; border-radius:.5rem; text-decoration:none; color:#111827; font-size:.875rem; font-weight:600;
  transition: background .12s;
}
.cp-item:hover { background:#f5f5f5; }
.cp-item strong { display:block; font-size:.82rem; }
.cp-item span { display:block; font-size:.75rem; color:#6b7280; font-weight:500; margin-top:.15rem; }
.cp-item-new { background:#eef2ff; }
.cp-item-new:hover { background:#e0e7ff; }
.cp-item-all { color:#111827; border-top:1px solid #e5e7eb; margin-top:.2rem; border-radius:0 0 .5rem .5rem; }
.cp-item-danger { color:#b91c1c; }
.cp-item-danger:hover { background:#fee2e2; }
.cp-empty { margin:0; padding:.75rem; color:#6b7280; font-size:.85rem; }
`;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, position: 'relative' },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconText: { fontSize: 11, fontWeight: '800', color: colors.primaryText },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: colors.surface, fontSize: 9, fontWeight: '800' },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.navy, fontWeight: '800' },
  menu: {
    position: 'absolute',
    top: 46,
    right: 0,
    width: 220,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: space.xs,
    zIndex: 20,
    gap: space.xs,
  },
  bellMenu: { width: 280, right: 44 },
  menuLabel: { color: colors.text, fontWeight: '600', padding: space.sm },
  menuTitle: { color: colors.text, fontWeight: '700', paddingHorizontal: space.sm, paddingTop: space.sm },
  menuBody: { color: colors.textMuted, fontSize: type.small, paddingHorizontal: space.sm, paddingBottom: space.sm },
  link: { color: colors.primary, fontWeight: '700', padding: space.sm },
  danger: { color: colors.danger, fontWeight: '700', padding: space.sm },
});
