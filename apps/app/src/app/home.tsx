import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';

import { AppShell } from '@/components/app-shell';

const highlights = [
  {
    title: 'Conversations that stay organised',
    description: 'Bring people together in focused spaces, with a clear place for every update and decision.',
  },
  {
    title: 'Made for every screen',
    description: 'Start in your browser and continue seamlessly on mobile when the app launches on Android and iOS.',
  },
  {
    title: 'A calm, private workspace',
    description: 'Simple controls and thoughtful defaults help teams communicate with clarity and confidence.',
  },
];

const activity = [
  { initial: 'M', name: 'Maya Chen', detail: 'Shared an update in Product design', time: 'Just now' },
  { initial: 'R', name: 'Rohan Patel', detail: 'Started a team discussion', time: '18 min ago' },
  { initial: 'A', name: 'Amelia Ross', detail: 'Joined the Launch workspace', time: '1 hr ago' },
];

export default function HomeScreen() {
  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.badge}>Connect with clarity</Text>
          <Text style={styles.title}>A better home for the conversations that move work forward.</Text>
          <Text style={styles.body}>
            Comm Platform brings updates, people, and shared momentum into one simple, dependable place.
          </Text>
          <View style={styles.actions}>
            <Link href="/signup" asChild>
              <Pressable style={styles.primaryAction}>
                <Text style={styles.primaryActionText}>Create your account</Text>
              </Pressable>
            </Link>
            <Link href="/login" asChild>
              <Pressable style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>Sign in</Text>
              </Pressable>
            </Link>
          </View>
          <Text style={styles.muted}>A simple start today. More collaborative tools on the way.</Text>
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewKicker}>Your workspace</Text>
          <Text style={styles.previewTitle}>Good morning</Text>
          <View style={styles.workspaceCard}>
            <View style={styles.workspaceRow}>
              <View>
                <Text style={styles.workspaceName}>Launch workspace</Text>
                <Text style={styles.muted}>8 members · Active now</Text>
              </View>
              <Text style={styles.live}>Live</Text>
            </View>
          </View>
          {activity.map((item) => (
            <View key={item.name} style={styles.activityRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.initial}</Text>
              </View>
              <View style={styles.activityCopy}>
                <Text style={styles.activityName}>{item.name}</Text>
                <Text style={styles.muted}>{item.detail}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionKicker}>What&apos;s happening</Text>
        <Text style={styles.sectionTitle}>A place built around progress.</Text>
        <View style={styles.cards}>
          {highlights.map((item, index) => (
            <View key={item.title} style={styles.card}>
              <Text style={styles.cardIndex}>0{index + 1}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.body}>{item.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.lg, paddingBottom: space.xl },
  hero: { gap: space.md, maxWidth: 720 },
  badge: { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 12 },
  title: { color: colors.text, fontSize: type.title, fontWeight: '700', lineHeight: 36 },
  body: { color: colors.textMuted, fontSize: type.body, lineHeight: 24 },
  muted: { color: colors.textMuted, fontSize: type.small },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  primaryAction: { backgroundColor: colors.text, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm + 4 },
  primaryActionText: { color: colors.surface, fontWeight: '700' },
  secondaryAction: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm + 4 },
  secondaryActionText: { color: colors.text, fontWeight: '700' },
  preview: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: space.md, gap: space.sm },
  previewKicker: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  previewTitle: { color: colors.text, fontSize: type.body, fontWeight: '700' },
  workspaceCard: { backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: space.md },
  workspaceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  workspaceName: { color: colors.text, fontWeight: '700' },
  live: { color: colors.success, fontWeight: '700', fontSize: type.small },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700', color: colors.text, fontSize: type.small },
  activityCopy: { flex: 1 },
  activityName: { color: colors.text, fontWeight: '600' },
  time: { color: colors.textMuted, fontSize: 11 },
  sectionKicker: { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: '700' },
  cards: { gap: space.md },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.md, gap: space.sm },
  cardIndex: { color: colors.primary, fontWeight: '700' },
  cardTitle: { color: colors.text, fontSize: type.body, fontWeight: '700' },
});
