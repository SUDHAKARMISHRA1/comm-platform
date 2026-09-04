import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import type { Difficulty } from '@comm-platform/coding';

import { fetchCatalog, fetchQuestions } from '@/coding/api/questionApi';
import { useAuth } from '@/providers/auth-provider';

export const PRACTICE_STATUSES = ['ALL', 'SOLVED', 'ATTEMPTED', 'NOT_ATTEMPTED'] as const;
export const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

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
  });

  const skills = catalogQuery.data?.skills ?? [];
  const levels = catalogQuery.data?.levels ?? [];
  const topics = catalogQuery.data?.topics ?? [];

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

  const countsQuery = useQuery({
    queryKey: ['questions', 'practice-counts'],
    queryFn: () => fetchQuestions({ page: 1, pageSize: 200, status: 'ALL' }),
    enabled,
  });

  const sectionQuery = useQuery({
    queryKey: ['questions', 'practice-section', skill],
    queryFn: () => fetchQuestions({ skill, page: 1, pageSize: 200, status: 'ALL' }),
    enabled: enabled && Boolean(skill),
  });

  const boardQuery = useQuery({
    queryKey: ['questions', 'practice-board', { skill, search, level, topic, status }],
    queryFn: () =>
      fetchQuestions({
        skill,
        q: search || undefined,
        level: level || undefined,
        topic: topic || undefined,
        status,
        page: 1,
        pageSize: 200,
      }),
    enabled: enabled && Boolean(skill),
  });

  const skillCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const q of countsQuery.data?.questions ?? []) {
      const key = q.skillId ?? '';
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [countsQuery.data]);

  const picks = useMemo(() => {
    return [...(sectionQuery.data?.questions ?? [])]
      .filter((q) => q.voteCount > 0)
      .sort((a, b) => b.voteCount - a.voteCount || a.id - b.id)
      .slice(0, 5);
  }, [sectionQuery.data]);

  const grouped = useMemo(() => {
    const questions = boardQuery.data?.questions ?? [];
    return {
      EASY: questions.filter((q) => q.difficulty === 'EASY'),
      MEDIUM: questions.filter((q) => q.difficulty === 'MEDIUM'),
      HARD: questions.filter((q) => q.difficulty === 'HARD'),
    };
  }, [boardQuery.data]);

  const stats = useMemo(() => {
    const all = sectionQuery.data?.questions ?? [];
    return {
      total: all.length,
      solved: all.filter((q) => q.status === 'SOLVED').length,
      attempted: all.filter((q) => q.status === 'ATTEMPTED').length,
    };
  }, [sectionQuery.data]);

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

  return {
    authLoading,
    enabled,
    catalogQuery,
    sectionQuery,
    boardQuery,
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
