import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import type { Difficulty, QuestionSummary } from '@comm-platform/coding';

import { fetchCatalog, fetchQuestions } from '@/coding/api/questionApi';
import { CATALOG_STALE_MS, LIST_STALE_MS } from '@/lib/prefetch-signed-in';
import { useAuth } from '@/providers/auth-provider';

export const PRACTICE_STATUSES = ['ALL', 'SOLVED', 'ATTEMPTED', 'NOT_ATTEMPTED'] as const;
export const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

function matchesFilters(
  q: QuestionSummary,
  skill: string,
  search: string,
  level: string,
  topic: string,
  status: (typeof PRACTICE_STATUSES)[number],
) {
  if (skill && q.skillId !== skill) return false;
  if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
  if (level && q.levelId !== level) return false;
  if (topic && !q.topics.includes(topic)) return false;
  if (status !== 'ALL' && q.status !== status) return false;
  return true;
}

export function usePracticeBoard() {
  const { session, loading: authLoading } = useAuth();
  const enabled = Boolean(session) && !authLoading;
  const params = useLocalSearchParams<{ skill?: string }>();

  const [skill, setSkill] = useState('');
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<(typeof PRACTICE_STATUSES)[number]>('ALL');
  const [expanded, setExpanded] = useState<Difficulty | null>(null);

  const catalogQuery = useQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
    enabled,
    staleTime: CATALOG_STALE_MS,
  });

  const allQuery = useQuery({
    queryKey: ['questions', 'practice-all'],
    queryFn: () => fetchQuestions({ page: 1, pageSize: 200, status: 'ALL' }),
    enabled,
    staleTime: LIST_STALE_MS,
  });

  const skills = catalogQuery.data?.skills ?? [];
  const levels = catalogQuery.data?.levels ?? [];
  const topics = catalogQuery.data?.topics ?? [];
  const allQuestions = allQuery.data?.questions ?? [];

  useEffect(() => {
    if (skills.length === 0) return;
    const requested = typeof params.skill === 'string' ? params.skill : '';
    if (requested) {
      const match = skills.find((s) => s.id === requested || s.slug === requested);
      if (match && skill !== match.id) setSkill(match.id);
      return;
    }
    if (skill) return;
    const java = skills.find((s) => s.slug === 'java' || s.languageKey === 'java');
    setSkill(java?.id ?? skills[0]!.id);
  }, [skills, skill, params.skill]);

  const selectedSkill = skills.find((s) => s.id === skill) ?? null;

  const skillCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of allQuestions) {
      const key = q.skillId ?? '';
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [allQuestions]);

  const sectionQuestions = useMemo(
    () => allQuestions.filter((q) => !skill || q.skillId === skill),
    [allQuestions, skill],
  );

  const boardQuestions = useMemo(
    () => allQuestions.filter((q) => matchesFilters(q, skill, search, level, topic, status)),
    [allQuestions, skill, search, level, topic, status],
  );

  const picks = useMemo(() => {
    return [...sectionQuestions]
      .filter((q) => q.voteCount > 0)
      .sort((a, b) => b.voteCount - a.voteCount || a.id - b.id)
      .slice(0, 5);
  }, [sectionQuestions]);

  const grouped = useMemo(() => {
    return {
      EASY: boardQuestions.filter((q) => q.difficulty === 'EASY'),
      MEDIUM: boardQuestions.filter((q) => q.difficulty === 'MEDIUM'),
      HARD: boardQuestions.filter((q) => q.difficulty === 'HARD'),
    };
  }, [boardQuestions]);

  const stats = useMemo(() => {
    return {
      total: sectionQuestions.length,
      solved: sectionQuestions.filter((q) => q.status === 'SOLVED').length,
      attempted: sectionQuestions.filter((q) => q.status === 'ATTEMPTED').length,
    };
  }, [sectionQuestions]);

  function selectSkill(id: string) {
    setSkill(id);
    setLevel('');
    setTopic('');
    setStatus('ALL');
    setExpanded(null);
  }

  function resetFilters() {
    setSearch('');
    setLevel('');
    setTopic('');
    setStatus('ALL');
    setExpanded(null);
  }

  function viewAll(difficulty: Difficulty) {
    setExpanded((prev) => (prev === difficulty ? null : difficulty));
  }

  const filtersActive = Boolean(search || level || topic || status !== 'ALL');
  const initialLoading =
    authLoading ||
    (enabled && catalogQuery.isLoading && !catalogQuery.data) ||
    (enabled && allQuery.isLoading && !allQuery.data);

  return {
    authLoading,
    enabled,
    initialLoading,
    catalogQuery,
    allQuery,
    skills,
    featuredSkills: skills.slice(0, 3),
    hasMoreSkills: skills.length > 3,
    levels,
    topics,
    skill,
    selectedSkill,
    search,
    setSearch,
    level,
    setLevel,
    topic,
    setTopic,
    status,
    setStatus,
    expanded,
    setExpanded,
    skillCounts,
    picks,
    grouped,
    stats,
    selectSkill,
    resetFilters,
    viewAll,
    filtersActive,
    maintenanceMessage: catalogQuery.data?.settings.maintenanceMessage ?? '',
  };
}
