/** Practice questions, catalog, dashboard, and interview votes. */
import {
  getAdjacentQuestionIds,
  getMockCatalog,
  getMockDashboard,
  getMockQuestion,
  hydrateMockVotes,
  listMockQuestions,
  listMockVoteEntries,
  listMockVotedQuestions,
  toggleMockVote,
  type CatalogPayload,
  type DashboardStats,
  type LanguageKey,
  type QuestionDetail,
  type QuestionsResponse,
  type VoteToggleResponse,
} from '@comm-platform/coding';

import { getWebStorageItem, setWebStorageItem } from '@/lib/safe-web-storage';

import { USE_MOCK_API, apiFetch, currentApiUserId } from './client';

export type QuestionDetailResponse = QuestionDetail & {
  navigation: { prev: number | null; next: number | null };
  codeTemplates?: Partial<Record<LanguageKey, string>>;
};

const MOCK_VOTE_KEY = 'comm-platform:interview-votes';
let mockVotesLoaded = false;

function restoreMockVotes() {
  if (mockVotesLoaded) return;
  mockVotesLoaded = true;
  try {
    const raw = getWebStorageItem(MOCK_VOTE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { userId: string; questionId: number }[];
    if (Array.isArray(parsed)) hydrateMockVotes(parsed);
  } catch {
    /* ignore corrupt storage */
  }
}

function persistMockVotes() {
  setWebStorageItem(MOCK_VOTE_KEY, JSON.stringify(listMockVoteEntries()));
}

export async function fetchQuestions(params: Record<string, string | number | undefined>): Promise<QuestionsResponse> {
  if (USE_MOCK_API) {
    restoreMockVotes();
    return listMockQuestions({
      q: params.q as string | undefined,
      difficulty: params.difficulty as string | undefined,
      topic: params.topic as string | undefined,
      status: params.status as string | undefined,
      skill: params.skill as string | undefined,
      level: params.level as string | undefined,
      page: Number(params.page ?? 1),
      pageSize: Number(params.pageSize ?? 20),
      userId: currentApiUserId(),
    });
  }
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  return apiFetch(`/questions?${qs}`);
}

export async function fetchVotedQuestions(params: {
  skill?: string;
  page?: number;
  pageSize?: number;
}): Promise<QuestionsResponse> {
  if (USE_MOCK_API) {
    restoreMockVotes();
    return listMockVotedQuestions(currentApiUserId(), {
      skill: params.skill,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 10,
    });
  }
  const qs = new URLSearchParams();
  if (params.skill) qs.set('skill', params.skill);
  qs.set('page', String(params.page ?? 1));
  qs.set('pageSize', String(params.pageSize ?? 10));
  return apiFetch(`/questions/voted?${qs}`);
}

export async function toggleQuestionVote(questionId: number): Promise<VoteToggleResponse> {
  if (USE_MOCK_API) {
    restoreMockVotes();
    const result = toggleMockVote(currentApiUserId(), questionId);
    persistMockVotes();
    return result;
  }
  return apiFetch(`/questions/${questionId}/vote`, { method: 'POST' });
}

export async function fetchQuestion(id: number): Promise<QuestionDetailResponse> {
  if (USE_MOCK_API) {
    restoreMockVotes();
    const question = getMockQuestion(id, currentApiUserId());
    if (!question) throw new Error('Question not found');
    return { ...question, navigation: getAdjacentQuestionIds(id) };
  }
  return apiFetch(`/questions/${id}`);
}

export async function fetchCatalog(): Promise<CatalogPayload> {
  if (USE_MOCK_API) return getMockCatalog();
  return apiFetch('/catalog');
}

export async function fetchDashboard(): Promise<DashboardStats> {
  if (USE_MOCK_API) return getMockDashboard();
  return apiFetch('/dashboard');
}
