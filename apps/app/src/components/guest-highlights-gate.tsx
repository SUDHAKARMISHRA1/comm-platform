import { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors, radius, space, type } from '@comm-platform/ui';

import { GUEST_FEED_LIMIT, GuestFeedContext, useGuestFeedController } from '@/lib/guest-highlights';
import { loginHref, signupHref } from '@/lib/site-links';

export function GuestFeedProvider({
  signedIn,
  children,
}: {
  signedIn: boolean;
  children: ReactNode;
}) {
  const { gateOpen, setGateOpen, sticky, nextPath, contextValue } = useGuestFeedController(signedIn);

  return (
    <GuestFeedContext.Provider value={contextValue}>
      {children}
      {!signedIn && sticky && !gateOpen ? (
        <Pressable style={styles.banner} onPress={() => setGateOpen(true)}>
          <Text style={styles.bannerText}>Create a free account to unlock the rest of Highlights.</Text>
        </Pressable>
      ) : null}
      <Modal visible={!signedIn && gateOpen} transparent animationType="fade" onRequestClose={() => setGateOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.kicker}>Free preview</Text>
            <Text style={styles.title}>That’s the look. Sign in to keep reading.</Text>
            <Text style={styles.body}>
              Guests can sample {GUEST_FEED_LIMIT} published articles. After a couple of minutes — or once you reach the last preview — we ask for an account. We’ll bring you back to this piece after you sign in.
            </Text>
            <Pressable style={styles.primary} onPress={() => router.push(signupHref(nextPath) as never)}>
              <Text style={styles.primaryText}>Create a free account</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={() => router.push(loginHref(nextPath) as never)}>
              <Text style={styles.secondaryText}>Sign in</Text>
            </Pressable>
            <Pressable onPress={() => setGateOpen(false)}>
              <Text style={styles.ghost}>Keep reading this preview</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </GuestFeedContext.Provider>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginTop: space.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: space.md,
  },
  bannerText: { color: colors.primary, fontWeight: '700', fontSize: type.small, textAlign: 'center' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
    justifyContent: 'center',
    padding: space.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    gap: space.sm,
  },
  kicker: { color: colors.primary, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', fontSize: 11 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700' },
  body: { color: colors.textMuted, fontSize: type.body, lineHeight: 22 },
  primary: {
    marginTop: space.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryText: { color: colors.primaryText, fontWeight: '700' },
  secondary: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: { color: colors.text, fontWeight: '700' },
  ghost: { color: colors.textMuted, textAlign: 'center', fontWeight: '600', paddingVertical: 8 },
});
