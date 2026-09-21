import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors, radius, space, type } from '@comm-platform/ui';

import { useAuth } from '@/providers/auth-provider';
import { SITE_NAME } from '@/lib/seo';
import {
  PRACTICE_TRACKS,
  SOCIAL_LINKS,
  copyrightLine,
  practiceHref,
} from '@/lib/site-links';

export function SiteFooter() {
  const { session } = useAuth();
  const signedIn = Boolean(session);
  const yearLine = copyrightLine();
  const homeHref = signedIn ? '/dashboard' : '/home';
  const highlightsHref = '/highlights';

  return (
    <View style={styles.footer}>
      <View style={styles.col}>
        <Text style={styles.kicker}>Come hang with us</Text>
        <Text style={styles.hint}>Problems, walkthroughs, and office hours — we post where you already scroll.</Text>
        <Text style={styles.connect}>Connect with us on</Text>
        <View style={styles.socialRow}>
          {SOCIAL_LINKS.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="link"
              accessibilityLabel={item.label}
              onPress={() => void Linking.openURL(item.href)}
              style={styles.socialBtn}
            >
              <Text style={styles.socialBtnText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.navRow}>
        <View style={styles.navCol}>
          <Text style={styles.heading}>Practice</Text>
          {PRACTICE_TRACKS.map((track) => (
            <Pressable key={track.skillId} onPress={() => router.push(practiceHref(track.skillId, signedIn) as never)}>
              <Text style={styles.link}>{track.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.navCol}>
          <Text style={styles.heading}>About us</Text>
          <Pressable onPress={() => router.push(homeHref as never)}>
            <Text style={styles.link}>Home</Text>
          </Pressable>
          <Pressable onPress={() => router.push(highlightsHref as never)}>
            <Text style={styles.link}>Highlights</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/contact' as never)}>
            <Text style={styles.link}>Contact Us</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.brandCol}>
        <View style={styles.brand}>
          <View style={styles.brandMark}>
            <View style={styles.brandDot} />
          </View>
          <Text style={styles.brandName}>{SITE_NAME}</Text>
        </View>
        <Text style={styles.copy}>{yearLine}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: space.lg,
    paddingTop: space.xl * 1.35,
    paddingBottom: space.xl,
    gap: space.lg,
  },
  col: { gap: space.sm },
  kicker: {
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  hint: { color: colors.textMuted, fontSize: type.small, lineHeight: 18, maxWidth: 280 },
  connect: { color: colors.text, fontSize: type.small, fontWeight: '700', marginTop: space.xs },
  socialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  socialBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    backgroundColor: colors.surfaceMuted,
  },
  socialBtnText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  navRow: { flexDirection: 'row', gap: space.xl },
  navCol: { gap: 8, minWidth: 120 },
  heading: { color: colors.text, fontWeight: '800', fontSize: type.small, letterSpacing: 0.4 },
  link: { color: colors.textMuted, fontSize: type.small, fontWeight: '600' },
  brandCol: { gap: space.sm, alignItems: 'flex-start' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  brandName: { color: colors.text, fontWeight: '700', fontSize: type.body },
  copy: { color: colors.textSubtle, fontSize: 12, lineHeight: 18 },
});
