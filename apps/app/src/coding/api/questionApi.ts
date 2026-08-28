import {
  getMockDashboard,
  getMockQuestion,
  getAdjacentQuestionIds,
  listMockQuestions,
  type DashboardStats,
  type LanguageKey,
  type QuestionDetail,
  type QuestionsResponse,
} from '@comm-platform/coding';

import { USE_MOCK_API, apiFetch } from './client';

export type QuestionDetailResponse = QuestionDetail & {
  navigation: { prev: number | null; next: number | null };
  codeTemplates?: Partial<Record<LanguageKey, string>>;
};

export async function fetchQuestions(params: Record<string, string | number | undefined>): Promise<QuestionsResponse> {
  if (USE_MOCK_API) {
    return listMockQuestions({
      q: params.q as string | undefined,
      difficulty: params.difficulty as string | undefined,
      topic: params.topic as string | undefined,
      status: params.status as string | undefined,
      page: Number(params.page ?? 1),
      pageSize: Number(params.pageSize ?? 20),
    });
  }
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  return apiFetch(`/questions?${qs}`);
}

export async function fetchQuestion(id: number): Promise<QuestionDetailResponse> {
  if (USE_MOCK_API) {
    const question = getMockQuestion(id);
    if (!question) throw new Error('Question not found');
    return { ...question, navigation: getAdjacentQuestionIds(id) };
  }
  return apiFetch(`/questions/${id}`);
}

export async function fetchDashboard(): Promise<DashboardStats> {
  if (USE_MOCK_API) return getMockDashboard();
  return apiFetch('/dashboard');
}
