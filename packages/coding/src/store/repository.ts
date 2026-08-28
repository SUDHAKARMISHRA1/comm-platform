import type {
  DashboardStats,
  Difficulty,
  ExecutionResult,
  LanguageKey,
  QuestionDetail,
  QuestionStatus,
  QuestionSummary,
  SubmitCodeResponse,
} from '../types';
import {
  compareOutput,
  mockRunCode,
  submitToJudge0,
  validateLanguage,
} from '../execution';
import { getJudge0LanguageId } from '../languages';
import type { PracticeSetRecord, QuestionRecord, SubmissionRecord } from '../schema';
import { mutateStore, readStore } from './file-store';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function progressMap(userId: string, data: Awaited<ReturnType<typeof readStore>>) {
  const map = new Map<number, QuestionStatus>();
  for (const p of data.progress.filter((r) => r.userId === userId)) {
    map.set(p.questionId, p.status);
  }
  return map;
}

function toSummary(q: QuestionRecord, status: QuestionStatus): QuestionSummary {
  return {
    id: q.id,
    title: q.title,
    slug: q.slug,
    difficulty: q.difficulty,
    topics: q.topics,
    status,
  };
}

function toDetail(q: QuestionRecord, status: QuestionStatus): QuestionDetail {
  return {
    id: q.id,
    title: q.title,
    slug: q.slug,
    difficulty: q.difficulty,
    description: q.description,
    inputFormat: q.inputFormat,
    outputFormat: q.outputFormat,
    constraints: q.constraints,
    examples: q.examples,
    topics: q.topics,
    supportedLanguages: q.supportedLanguages,
    status,
  };
}

export async function listPracticeSets() {
  const data = await readStore();
  return [...data.practiceSets].sort((a, b) => a.sequence - b.sequence);
}

export async function getPracticeSet(id: string) {
  const data = await readStore();
  return data.practiceSets.find((s) => s.id === id) ?? null;
}

export async function savePracticeSet(input: Omit<PracticeSetRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
  return mutateStore((data) => {
    const now = new Date().toISOString();
    if (input.id) {
      const idx = data.practiceSets.findIndex((s) => s.id === input.id);
      if (idx === -1) throw new Error('Practice set not found');
      data.practiceSets[idx] = { ...data.practiceSets[idx]!, ...input, id: input.id, updatedAt: now };
      return data.practiceSets[idx]!;
    }
    const id = `ps-${slugify(input.title)}-${Date.now()}`;
    const row: PracticeSetRecord = {
      ...input,
      id,
      slug: input.slug || slugify(input.title),
      createdAt: now,
      updatedAt: now,
    };
    data.practiceSets.push(row);
    return row;
  });
}

export async function deletePracticeSet(id: string) {
  return mutateStore((data) => {
    data.practiceSets = data.practiceSets.filter((s) => s.id !== id);
    data.questions = data.questions.filter((q) => q.practiceSetId !== id);
    return true;
  });
}

export async function reorderPracticeSets(ids: string[]) {
  return mutateStore((data) => {
    ids.forEach((id, i) => {
      const row = data.practiceSets.find((s) => s.id === id);
      if (row) row.sequence = i + 1;
    });
    return true;
  });
}

export async function listQuestionsAdmin(practiceSetId?: string) {
  const data = await readStore();
  let items = data.questions;
  if (practiceSetId) items = items.filter((q) => q.practiceSetId === practiceSetId);
  return [...items].sort((a, b) => a.sequence - b.sequence);
}

export async function getQuestionRecord(id: number) {
  const data = await readStore();
  return data.questions.find((q) => q.id === id) ?? null;
}

export async function saveQuestion(
  input: Omit<QuestionRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: number },
) {
  return mutateStore((data) => {
    const now = new Date().toISOString();
    if (input.id) {
      const idx = data.questions.findIndex((q) => q.id === input.id);
      if (idx === -1) throw new Error('Question not found');
      data.questions[idx] = { ...data.questions[idx]!, ...input, id: input.id, updatedAt: now };
      return data.questions[idx]!;
    }
    const nextId = data.questions.reduce((max, q) => Math.max(max, q.id), 0) + 1;
    const row: QuestionRecord = {
      ...input,
      id: nextId,
      slug: input.slug || slugify(input.title),
      createdAt: now,
      updatedAt: now,
    };
    data.questions.push(row);
    return row;
  });
}

export async function deleteQuestion(id: number) {
  return mutateStore((data) => {
    data.questions = data.questions.filter((q) => q.id !== id);
    data.progress = data.progress.filter((p) => p.questionId !== id);
    return true;
  });
}

export async function reorderQuestions(practiceSetId: string, ids: number[]) {
  return mutateStore((data) => {
    ids.forEach((id, i) => {
      const row = data.questions.find((q) => q.id === id && q.practiceSetId === practiceSetId);
      if (row) row.sequence = i + 1;
    });
    return true;
  });
}

export async function listQuestionsForUser(
  userId: string,
  filters: { q?: string; difficulty?: string; topic?: string; status?: string; page?: number; pageSize?: number },
) {
  const data = await readStore();
  const pmap = progressMap(userId, data);
  let items = data.questions.filter((q) => q.published);

  if (filters.q) {
    const term = filters.q.toLowerCase();
    items = items.filter(
      (q) =>
        q.title.toLowerCase().includes(term) ||
        String(q.id).includes(term) ||
        q.topics.some((t) => t.toLowerCase().includes(term)),
    );
  }
  if (filters.difficulty) items = items.filter((q) => q.difficulty === filters.difficulty);
  if (filters.topic) items = items.filter((q) => q.topics.some((t) => t.toLowerCase() === filters.topic!.toLowerCase()));
  if (filters.status && filters.status !== 'ALL') {
    items = items.filter((q) => (pmap.get(q.id) ?? 'NOT_ATTEMPTED') === filters.status);
  }

  const pageSize = filters.pageSize ?? 20;
  const page = filters.page ?? 1;
  const total = items.length;
  const slice = items.slice((page - 1) * pageSize, page * pageSize);

  return {
    questions: slice.map((q) => toSummary(q, pmap.get(q.id) ?? 'NOT_ATTEMPTED')),
    pagination: { page, pageSize, total },
  };
}

export async function getQuestionForUser(userId: string, id: number) {
  const data = await readStore();
  const q = data.questions.find((item) => item.id === id && item.published);
  if (!q) return null;
  const pmap = progressMap(userId, data);
  const ids = data.questions.filter((x) => x.published).sort((a, b) => a.sequence - b.sequence).map((x) => x.id);
  const idx = ids.indexOf(id);
  return {
    ...toDetail(q, pmap.get(id) ?? 'NOT_ATTEMPTED'),
    navigation: { prev: idx > 0 ? (ids[idx - 1] ?? null) : null, next: idx < ids.length - 1 ? (ids[idx + 1] ?? null) : null },
    codeTemplates: q.codeTemplates,
  };
}

export async function getDashboardForUser(userId: string): Promise<DashboardStats> {
  const data = await readStore();
  const published = data.questions.filter((q) => q.published);
  const pmap = progressMap(userId, data);
  const summaries = published.map((q) => toSummary(q, pmap.get(q.id) ?? 'NOT_ATTEMPTED'));
  const solved = summaries.filter((q) => q.status === 'SOLVED').length;
  const attempted = summaries.filter((q) => q.status === 'ATTEMPTED').length;

  const byDiff = (d: Difficulty) => {
    const all = summaries.filter((q) => q.difficulty === d);
    const done = all.filter((q) => q.status === 'SOLVED').length;
    return { difficulty: d, solved: done, total: all.length, percent: all.length ? Math.round((done / all.length) * 100) : 0 };
  };

  const subs = data.submissions
    .filter((s) => s.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((s) => {
      const q = data.questions.find((x) => x.id === s.questionId);
      return {
        id: s.id,
        questionId: s.questionId,
        questionTitle: q?.title ?? 'Unknown',
        language: s.language,
        status: s.status,
        executionTime: s.executionTime,
        memory: s.memory,
        createdAt: s.createdAt,
      };
    });

  return {
    total: summaries.length,
    solved,
    attempted,
    remaining: summaries.length - solved,
    difficultyProgress: [byDiff('EASY'), byDiff('MEDIUM'), byDiff('HARD')],
    recentPractice: summaries.slice(0, 4).map((q) => ({ questionId: q.id, title: q.title, status: q.status })),
    recommended: summaries.filter((q) => q.status !== 'SOLVED').slice(0, 3),
    recentSubmissions: subs,
  };
}

export async function listSubmissionsForUser(userId: string) {
  const data = await readStore();
  return data.submissions
    .filter((s) => s.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((s) => {
      const q = data.questions.find((x) => x.id === s.questionId);
      return {
        id: s.id,
        questionId: s.questionId,
        questionTitle: q?.title ?? 'Unknown',
        language: s.language,
        status: s.status,
        executionTime: s.executionTime,
        memory: s.memory,
        createdAt: s.createdAt,
      };
    });
}

export async function getSubmissionForUser(userId: string, id: string) {
  const data = await readStore();
  const s = data.submissions.find((x) => x.id === id && x.userId === userId);
  if (!s) return null;
  const q = data.questions.find((x) => x.id === s.questionId);
  return {
    ...s,
    questionTitle: q?.title ?? 'Unknown',
    sourceCode: s.sourceCode,
    passedTestCases: s.passedTestCases,
    totalTestCases: s.totalTestCases,
    testCaseResults: s.testCaseResults,
  };
}

async function executeCode(language: LanguageKey, sourceCode: string, stdin: string): Promise<ExecutionResult> {
  const judge0Url = process.env.JUDGE0_BASE_URL;
  if (judge0Url) {
    return submitToJudge0(judge0Url, getJudge0LanguageId(language), sourceCode, stdin, process.env.JUDGE0_API_KEY);
  }
  return mockRunCode(sourceCode, stdin);
}

export async function runUserCode(language: string, sourceCode: string, stdin: string): Promise<ExecutionResult> {
  if (!validateLanguage(language)) throw new Error('Invalid language');
  return executeCode(language, sourceCode, stdin);
}

export async function submitUserCode(
  userId: string,
  questionId: number,
  language: string,
  sourceCode: string,
): Promise<SubmitCodeResponse> {
  if (!validateLanguage(language)) throw new Error('Invalid language');
  const q = await getQuestionRecord(questionId);
  if (!q?.published) throw new Error('Question not found');

  const tests = [...q.testCases].sort((a, b) => a.sequence - b.sequence);
  const results: { index: number; passed: boolean; hidden: boolean }[] = [];
  let passed = 0;
  let totalTime = 0;
  let maxMemory = 0;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]!;
    const result = await executeCode(language, sourceCode, test.input);
    totalTime += result.executionTime;
    maxMemory = Math.max(maxMemory, result.memory);
    const ok = result.status === 'ACCEPTED' && compareOutput(result.stdout, test.expectedOutput);
    if (ok) passed++;
    results.push({ index: i + 1, passed: ok, hidden: test.hidden });
  }

  const status = passed === tests.length && tests.length > 0 ? 'ACCEPTED' : tests.length ? 'WRONG_ANSWER' : 'INTERNAL_ERROR';
  const submissionId = `sub-${Date.now()}`;

  const record: SubmissionRecord = {
    id: submissionId,
    userId,
    questionId,
    language,
    sourceCode,
    status,
    passedTestCases: passed,
    totalTestCases: tests.length,
    executionTime: `${totalTime.toFixed(2)}s`,
    memory: `${Math.round(maxMemory / 1024)} MB`,
    testCaseResults: results,
    createdAt: new Date().toISOString(),
  };

  await mutateStore((data) => {
    data.submissions.unshift(record);
    const prog = data.progress.find((p) => p.userId === userId && p.questionId === questionId);
    const nextStatus = status === 'ACCEPTED' ? 'SOLVED' : 'ATTEMPTED';
    if (prog) {
      if (prog.status !== 'SOLVED') prog.status = nextStatus;
      prog.updatedAt = record.createdAt;
    } else {
      data.progress.push({ userId, questionId, status: nextStatus, updatedAt: record.createdAt });
    }
    return record;
  });

  return {
    submissionId,
    status,
    passedTestCases: passed,
    totalTestCases: tests.length,
    executionTime: record.executionTime,
    memory: record.memory,
    testCaseResults: results,
  };
}
