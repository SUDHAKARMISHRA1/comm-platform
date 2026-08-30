import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { SubmissionSummary } from '@comm-platform/coding';

import {
  formatDayLabel,
  groupSubmissionsByDay,
  intensity,
  monthCells,
  periodStats,
} from '@/coding/activity';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FILL = ['#ffffff', '#bbf7d0', '#4ade80', '#16a34a', '#166534'];
const INK = ['#0b1f3a', '#14532d', '#14532d', '#ffffff', '#ffffff'];

export function SubmissionCalendar({ submissions }: { submissions: SubmissionSummary[] }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState<string | null>(localToday());
  const byDay = useMemo(() => groupSubmissionsByDay(submissions), [submissions]);
  const stats = useMemo(() => periodStats(submissions, now), [submissions]);
  const cells = monthCells(cursor.year, cursor.month);
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const insight = selected ? byDay.get(selected) : undefined;

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Submission activity</Text>
      <Text style={styles.title}>Daily, monthly, and yearly commits</Text>
      <View style={styles.kpis}>
        <Kpi label="Today" value={String(stats.today)} hint={`${stats.todayAccepted} accepted`} />
        <Kpi label="This month" value={String(stats.monthCount)} hint={`${stats.monthAccepted} accepted`} />
        <Kpi label="This year" value={String(stats.yearCount)} hint={`${stats.activeDaysThisYear} active days`} />
      </View>
      <View style={styles.nav}>
        <Pressable onPress={() => shift(-1)} style={styles.navBtn}><Text style={styles.navTxt}>‹</Text></Pressable>
        <Text style={styles.month}>{monthLabel}</Text>
        <Pressable onPress={() => shift(1)} style={styles.navBtn}><Text style={styles.navTxt}>›</Text></Pressable>
      </View>
      <View style={styles.week}>
        {WEEKDAYS.map((d) => <Text key={d} style={styles.wd}>{d}</Text>)}
      </View>
      <View style={styles.grid}>
        {cells.map((cell, i) => {
          const count = cell.dateKey ? byDay.get(cell.dateKey)?.count ?? 0 : 0;
          const level = intensity(count);
          return (
            <Pressable
              key={`${cell.dateKey ?? 'e'}-${i}`}
              disabled={!cell.day}
              onPress={() => cell.dateKey && setSelected(cell.dateKey)}
              style={[
                styles.day,
                !cell.day && styles.empty,
                cell.day ? { backgroundColor: FILL[level] } : null,
                selected === cell.dateKey && styles.selected,
              ]}
            >
              {cell.day ? <Text style={[styles.dayNum, { color: INK[level] }]}>{cell.day}</Text> : null}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.tip}>
        {insight ? (
          <>
            <Text style={styles.tipTitle}>{formatDayLabel(insight.dateKey)}</Text>
            <Text style={styles.tipBody}>{insight.count} submission{insight.count === 1 ? '' : 's'} · {insight.accepted} accepted</Text>
            <Text style={styles.tipBody}>Problems: {insight.uniqueProblems.join(', ')}</Text>
            <Text style={styles.tipBody}>Languages: {insight.languages.join(', ')}</Text>
          </>
        ) : selected ? (
          <>
            <Text style={styles.tipTitle}>{formatDayLabel(selected)}</Text>
            <Text style={styles.tipBody}>No submissions on this day.</Text>
          </>
        ) : (
          <Text style={styles.tipBody}>Tap a calendar day for that day’s insight.</Text>
        )}
      </View>
    </View>
  );

  function shift(delta: number) {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }
}

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiHint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space.lg, gap: space.sm },
  kicker: { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.1, fontSize: 11 },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  kpis: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  kpi: { flex: 1, minWidth: 90, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: space.sm },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  kpiValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  kpiHint: { fontSize: 11, color: colors.textMuted },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: colors.surfaceMuted },
  navTxt: { fontSize: 20, color: colors.text },
  month: { fontWeight: '700', color: colors.text },
  week: { flexDirection: 'row' },
  wd: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700', color: colors.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  day: { width: '14.28%', height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 6, borderWidth: 1, borderColor: colors.border, marginBottom: 4 },
  empty: { borderWidth: 0, backgroundColor: 'transparent' },
  selected: { borderColor: colors.text, borderWidth: 2 },
  dayNum: { fontWeight: '700', fontSize: 13 },
  tip: { backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: space.md, gap: 4 },
  tipTitle: { fontWeight: '700', color: colors.text },
  tipBody: { color: colors.textMuted, fontSize: type.small },
});
