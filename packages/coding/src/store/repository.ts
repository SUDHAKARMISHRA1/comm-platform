import type {
  DashboardStats,
  Difficulty,
  ExecutionResult,
  LanguageKey,
  QuestionDetail,
  QuestionStatus,
  QuestionSummary,
  RunTestsResponse,
  SubmitCodeResponse,
  VoteToggleResponse,
} from '../types';
import {
  compareOutput,
  executeWithPiston,
  mockRunCode,
  submitToJudge0,
  validateLanguage,
} from '../execution';
import { executeLocally } from '../local-execute';
import { getJudge0LanguageId } from '../languages';
import type { PracticeSetRecord, QuestionRecord, SubmissionRecord } from '../schema';
import { mutateStore, readStore } from './file-store';
import {
  getSubmissionRecord,
  insertSubmission,
  isSupabasePersistenceEnabled,
  listProgressForUser,
  listSubmissionRecords,
  listAllSubmissionRecords,
  upsertProgress,
  listVoteCounts,
  listVotedQuestionIdsForUser,
  toggleInterviewVoteRecord,
} from './supabase-user-data';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function loadProgressMap(userId: string) {
  const map = new Map<number, QuestionStatus>();
  const rows = isSupabasePersistenceEnabled()
    ? await listProgressForUser(userId)
    : (await readStore()).progress.filter((r) => r.userId === userId);
  for (const p of rows) {
    map.set(p.questionId, p.status);
  }
  return map;
}

async function loadVoteState(userId: string) {
  if (isSupabasePersistenceEnabled()) {
    const [counts, mine] = await Promise.all([listVoteCounts(), listVotedQuestionIdsForUser(userId)]);
    return { counts, mine };
  }
  const data = await readStore();
  const counts = new Map<number, number>();
  if (data.voteCounts?.length) {
    for (const row of data.voteCounts) counts.set(row.questionId, row.voteCount);
  } else {
    for (const vote of data.interviewVotes ?? []) {
      counts.set(vote.questionId, (counts.get(vote.questionId) ?? 0) + 1);
    }
  }
  const mine = new Set(
    (data.interviewVotes ?? []).filter((vote) => vote.userId === userId).map((vote) => vote.questionId),
  );
  return { counts, mine };
}

function toSummary(
  q: QuestionRecord,
  status: QuestionStatus,
  skillName?: string,
  levelName?: string,
  voteCount = 0,
  votedByMe = false,
): QuestionSummary {
  return {
    id: q.id,
    title: q.title,
    slug: q.slug,
    difficulty: q.difficulty,
    skillId: q.skillId,
    skillName,
    levelId: q.levelId,
    levelName,
    topics: q.topics,
    status,
    voteCount,
    votedByMe,
  };
}

function toDetail(
  q: QuestionRecord,
  status: QuestionStatus,
  skillName?: string,
  levelName?: string,
  voteCount = 0,
  votedByMe = false,
): QuestionDetail {
  return {
    id: q.id,
    title: q.title,
    slug: q.slug,
    difficulty: q.difficulty,
    skillId: q.skillId,
    skillName,
    levelId: q.levelId,
    levelName,
    description: q.description,
    inputFormat: q.inputFormat,
    outputFormat: q.outputFormat,
    constraints: q.constraints,
    examples: q.examples,
    topics: q.topics,
    supportedLanguages: q.supportedLanguages,
    status,
    voteCount,
    votedByMe,
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
    if (!data.skills.length) throw new Error('Create at least one skill before adding a problem.');
    if (!data.levels.length) throw new Error('Create at least one level before adding a problem.');
    if (!input.skillId) throw new Error('Every problem must be bound to one skill.');
    if (!input.levelId) throw new Error('Every problem must have a level.');
    const skill = data.skills.find((s) => s.id === input.skillId);
    const level = data.levels.find((l) => l.id === input.levelId);
    if (!skill) throw new Error('Selected skill was not found.');
    if (!level) throw new Error('Selected level was not found.');
    const now = new Date().toISOString();
    const payload = { ...input, difficulty: level.band };
    if (input.id) {
      const idx = data.questions.findIndex((q) => q.id === input.id);
      if (idx === -1) throw new Error('Question not found');
      data.questions[idx] = { ...data.questions[idx]!, ...payload, id: input.id, updatedAt: now };
      return data.questions[idx]!;
    }
    const nextId = data.questions.reduce((max, q) => Math.max(max, q.id), 0) + 1;
    const row: QuestionRecord = {
      ...payload,
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
    data.interviewVotes = (data.interviewVotes ?? []).filter((v) => v.questionId !== id);
    data.voteCounts = (data.voteCounts ?? []).filter((v) => v.questionId !== id);
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
  filters: {
    q?: string;
    difficulty?: string;
    topic?: string;
    status?: string;
    skill?: string;
    level?: string;
    page?: number;
    pageSize?: number;
  },
) {
  const data = await readStore();
  const pmap = await loadProgressMap(userId);
  const votes = await loadVoteState(userId);
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
  if (filters.skill) items = items.filter((q) => q.skillId === filters.skill || q.skillId === data.skills.find((s) => s.slug === filters.skill)?.id);
  if (filters.level) items = items.filter((q) => q.levelId === filters.level || q.difficulty === filters.level);
  if (filters.topic) items = items.filter((q) => q.topics.some((t) => t.toLowerCase() === filters.topic!.toLowerCase()));
  if (filters.status && filters.status !== 'ALL') {
    items = items.filter((q) => (pmap.get(q.id) ?? 'NOT_ATTEMPTED') === filters.status);
  }

  const pageSize = filters.pageSize ?? 20;
  const page = filters.page ?? 1;
  const total = items.length;
  const slice = items.slice((page - 1) * pageSize, page * pageSize);

  return {
    questions: slice.map((q) =>
      toSummary(
        q,
        pmap.get(q.id) ?? 'NOT_ATTEMPTED',
        data.skills.find((s) => s.id === q.skillId)?.name,
        data.levels.find((l) => l.id === q.levelId)?.name,
        votes.counts.get(q.id) ?? 0,
        votes.mine.has(q.id),
      ),
    ),
    pagination: { page, pageSize, total },
  };
}

export async function toggleInterviewVote(userId: string, questionId: number): Promise<VoteToggleResponse> {
  const data = await readStore();
  if (!data.questions.some((q) => q.id === questionId && q.published)) {
    throw new Error('Question not found');
  }

  if (isSupabasePersistenceEnabled()) {
    const fromDb = await toggleInterviewVoteRecord(userId, questionId);
    if (!fromDb) {
      throw new Error(
        'Interview vote tables were not found in Supabase. Confirm question_interview_votes exists, then restart the web server.',
      );
    }
    return fromDb;
  }

  return mutateStore((store) => {
    store.interviewVotes ??= [];
    store.voteCounts ??= [];
    const idx = store.interviewVotes.findIndex((v) => v.userId === userId && v.questionId === questionId);
    const now = new Date().toISOString();
    if (idx >= 0) store.interviewVotes.splice(idx, 1);
    else store.interviewVotes.push({ userId, questionId, createdAt: now });
    const voteCount = store.interviewVotes.filter((v) => v.questionId === questionId).length;
    const row = store.voteCounts.find((c) => c.questionId === questionId);
    if (row) {
      row.voteCount = voteCount;
      row.updatedAt = now;
    } else {
      store.voteCounts.push({ questionId, voteCount, updatedAt: now });
    }
    return { questionId, voteCount, votedByMe: idx < 0 };
  });
}

export async function listVotedQuestionsForUser(
  userId: string,
  filters: { skill?: string; page?: number; pageSize?: number },
) {
  const data = await readStore();
  const pmap = await loadProgressMap(userId);
  const votes = await loadVoteState(userId);
  let items = data.questions.filter((q) => q.published && (votes.counts.get(q.id) ?? 0) > 0);
  if (filters.skill) {
    items = items.filter(
      (q) => q.skillId === filters.skill || q.skillId === data.skills.find((s) => s.slug === filters.skill)?.id,
    );
  }
  items.sort((a, b) => (votes.counts.get(b.id) ?? 0) - (votes.counts.get(a.id) ?? 0) || a.id - b.id);
  const pageSize = filters.pageSize ?? 10;
  const page = Math.max(1, filters.page ?? 1);
  const total = items.length;
  const slice = items.slice((page - 1) * pageSize, page * pageSize);
  return {
    questions: slice.map((q) =>
      toSummary(
        q,
        pmap.get(q.id) ?? 'NOT_ATTEMPTED',
        data.skills.find((s) => s.id === q.skillId)?.name,
        data.levels.find((l) => l.id === q.levelId)?.name,
        votes.counts.get(q.id) ?? 0,
        votes.mine.has(q.id),
      ),
    ),
    pagination: { page, pageSize, total },
  };
}

export async function getQuestionForUser(userId: string, id: number) {
  const data = await readStore();
  const q = data.questions.find((item) => item.id === id && item.published);
  if (!q) return null;
  const pmap = await loadProgressMap(userId);
  const votes = await loadVoteState(userId);
  const ids = data.questions.filter((x) => x.published).sort((a, b) => a.sequence - b.sequence).map((x) => x.id);
  const idx = ids.indexOf(id);
  return {
    ...toDetail(
      q,
      pmap.get(id) ?? 'NOT_ATTEMPTED',
      data.skills.find((s) => s.id === q.skillId)?.name,
      data.levels.find((l) => l.id === q.levelId)?.name,
      votes.counts.get(id) ?? 0,
      votes.mine.has(id),
    ),
    navigation: { prev: idx > 0 ? (ids[idx - 1] ?? null) : null, next: idx < ids.length - 1 ? (ids[idx + 1] ?? null) : null },
    codeTemplates: q.codeTemplates,
  };
}

export async function getDashboardForUser(userId: string): Promise<DashboardStats> {
  const data = await readStore();
  const published = data.questions.filter((q) => q.published);
  const pmap = await loadProgressMap(userId);
  const votes = await loadVoteState(userId);
  const summaries = published.map((q) =>
    toSummary(
      q,
      pmap.get(q.id) ?? 'NOT_ATTEMPTED',
      data.skills.find((s) => s.id === q.skillId)?.name,
      data.levels.find((l) => l.id === q.levelId)?.name,
      votes.counts.get(q.id) ?? 0,
      votes.mine.has(q.id),
    ),
  );
  const solved = summaries.filter((q) => q.status === 'SOLVED').length;
  const attempted = summaries.filter((q) => q.status === 'ATTEMPTED').length;

  const byDiff = (d: Difficulty) => {
    const all = summaries.filter((q) => q.difficulty === d);
    const done = all.filter((q) => q.status === 'SOLVED').length;
    return { difficulty: d, solved: done, total: all.length, percent: all.length ? Math.round((done / all.length) * 100) : 0 };
  };

  const stored = isSupabasePersistenceEnabled()
    ? await listSubmissionRecords(userId)
    : data.submissions.filter((s) => s.userId === userId);
  const subs = stored
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
  const stored = isSupabasePersistenceEnabled()
    ? await listSubmissionRecords(userId)
    : data.submissions.filter((s) => s.userId === userId);
  return stored
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

export async function listAdminSubmissions() {
  const data = await readStore();
  const stored = isSupabasePersistenceEnabled() ? await listAllSubmissionRecords() : data.submissions;
  return stored
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((s) => {
      const q = data.questions.find((x) => x.id === s.questionId);
      const score = s.totalTestCases ? Math.round((s.passedTestCases / s.totalTestCases) * 100) : 0;
      return {
        id: s.id,
        userId: s.userId,
        questionId: s.questionId,
        questionTitle: q?.title ?? `Question ${s.questionId}`,
        language: s.language,
        status: s.status,
        passedTestCases: s.passedTestCases,
        totalTestCases: s.totalTestCases,
        score,
        createdAt: s.createdAt,
      };
    });
}

export async function getSubmissionForUser(userId: string, id: string) {
  const data = await readStore();
  const s = isSupabasePersistenceEnabled()
    ? await getSubmissionRecord(userId, id)
    : data.submissions.find((x) => x.id === id && x.userId === userId) ?? null;
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
  try {
    return await executeLocally(language, sourceCode, stdin);
  } catch (err) {
    const pistonUrl = process.env.PISTON_BASE_URL;
    if (pistonUrl) {
      return executeWithPiston(language, sourceCode, stdin, pistonUrl);
    }
    const message = err instanceof Error ? err.message : 'Compiler unavailable';
    if (language !== 'java') {
      return {
        status: 'INTERNAL_ERROR',
        stdout: '',
        stderr: `${message}. Install gcc/g++, or configure JUDGE0_BASE_URL.`,
        compileOutput: '',
        executionTime: 0,
        memory: 0,
      };
    }
    return mockRunCode(sourceCode, stdin);
  }
}

async function markAttempted(userId: string, questionId: number) {
  const now = new Date().toISOString();
  if (isSupabasePersistenceEnabled()) {
    await upsertProgress({ userId, questionId, status: 'ATTEMPTED', updatedAt: now });
    return;
  }
  await mutateStore((data) => {
    const prog = data.progress.find((p) => p.userId === userId && p.questionId === questionId);
    if (prog) {
      if (prog.status !== 'SOLVED') prog.status = 'ATTEMPTED';
      prog.updatedAt = now;
    } else {
      data.progress.push({ userId, questionId, status: 'ATTEMPTED', updatedAt: now });
    }
    return true;
  });
}

export async function runUserCode(
  language: string,
  sourceCode: string,
  stdin: string,
  userId?: string,
  questionId?: number,
): Promise<ExecutionResult> {
  if (!validateLanguage(language)) throw new Error('Invalid language');
  const result = await executeCode(language, sourceCode, stdin);
  if (userId && questionId && result.status === 'ACCEPTED') {
    await markAttempted(userId, questionId);
  }
  return result;
}

export async function runSampleTests(
  userId: string,
  questionId: number,
  language: string,
  sourceCode: string,
): Promise<RunTestsResponse> {
  if (!validateLanguage(language)) throw new Error('Invalid language');
  const q = await getQuestionRecord(questionId);
  if (!q?.published) throw new Error('Question not found');

  const tests = [...q.testCases].filter((t) => !t.hidden).sort((a, b) => a.sequence - b.sequence);
  const sample = tests.length
    ? tests
    : q.examples.map((ex, i) => ({
        input: ex.input,
        expectedOutput: ex.output,
        hidden: false,
        sequence: i + 1,
        id: `ex-${i}`,
      }));

  const results: RunTestsResponse['testCaseResults'] = [];
  let passed = 0;
  let totalTime = 0;
  let maxMemory = 0;
  let lastStdout = '';
  let lastStderr = '';
  let lastCompile = '';
  let fatalStatus: ExecutionResult['status'] | null = null;

  for (let i = 0; i < sample.length; i++) {
    const test = sample[i]!;
    const result = await executeCode(language, sourceCode, test.input);
    totalTime += result.executionTime;
    maxMemory = Math.max(maxMemory, result.memory);
    lastStdout = result.stdout;
    lastStderr = result.stderr;
    lastCompile = result.compileOutput;
    if (result.status === 'COMPILATION_ERROR' || result.status === 'INTERNAL_ERROR') {
      fatalStatus = result.status;
      results.push({
        index: i + 1,
        passed: false,
        hidden: false,
        stdout: result.stdout,
        stderr: result.stderr || result.compileOutput,
      });
      break;
    }
    const ok = result.status === 'ACCEPTED' && compareOutput(result.stdout, test.expectedOutput);
    if (ok) passed++;
    results.push({ index: i + 1, passed: ok, hidden: false, stdout: result.stdout, stderr: result.stderr });
  }

  const status =
    fatalStatus ??
    (sample.length === 0 ? 'INTERNAL_ERROR' : passed === sample.length ? 'ACCEPTED' : 'WRONG_ANSWER');

  if (status === 'ACCEPTED') await markAttempted(userId, questionId);

  return {
    status,
    passedTestCases: passed,
    totalTestCases: sample.length,
    executionTime: `${totalTime.toFixed(2)}s`,
    memory: `${Math.max(1, Math.round(maxMemory / 1024))} MB`,
    stdout: lastStdout,
    stderr: lastStderr,
    compileOutput: lastCompile,
    testCaseResults: results,
  };
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
  const results: { index: number; passed: boolean; hidden: boolean; stdout?: string; stderr?: string }[] = [];
  let passed = 0;
  let totalTime = 0;
  let maxMemory = 0;
  let fatalStatus: ExecutionResult['status'] | null = null;

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]!;
    const result = await executeCode(language, sourceCode, test.input);
    totalTime += result.executionTime;
    maxMemory = Math.max(maxMemory, result.memory);
    if (result.status === 'COMPILATION_ERROR' || result.status === 'INTERNAL_ERROR') {
      fatalStatus = result.status;
      results.push({
        index: i + 1,
        passed: false,
        hidden: test.hidden,
        stdout: result.stdout,
        stderr: result.stderr || result.compileOutput,
      });
      break;
    }
    const ok = result.status === 'ACCEPTED' && compareOutput(result.stdout, test.expectedOutput);
    if (ok) passed++;
    results.push({ index: i + 1, passed: ok, hidden: test.hidden, stdout: test.hidden ? undefined : result.stdout, stderr: result.stderr });
  }

  const status =
    fatalStatus ??
    (passed === tests.length && tests.length > 0 ? 'ACCEPTED' : tests.length ? 'WRONG_ANSWER' : 'INTERNAL_ERROR');
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
    memory: `${Math.max(0, Math.round(maxMemory / 1024))} MB`,
    testCaseResults: results,
    createdAt: new Date().toISOString(),
  };

  if (status === 'ACCEPTED') {
    if (isSupabasePersistenceEnabled()) {
      await insertSubmission(record);
      await upsertProgress({
        userId,
        questionId,
        status: 'SOLVED',
        updatedAt: record.createdAt,
      });
    } else {
      await mutateStore((data) => {
        data.submissions.unshift(record);
        const prog = data.progress.find((p) => p.userId === userId && p.questionId === questionId);
        if (prog) {
          prog.status = 'SOLVED';
          prog.updatedAt = record.createdAt;
        } else {
          data.progress.push({ userId, questionId, status: 'SOLVED', updatedAt: record.createdAt });
        }
        return record;
      });
    }
  }

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
