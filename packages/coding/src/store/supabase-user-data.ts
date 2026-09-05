/**
 * Progress, interview votes, and submissions in Postgres.
 * Enabled when `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.
 * If coding tables are not migrated yet, rows are read back from `audit_logs`.
 */
import type { ProgressRecord, SubmissionRecord } from '../schema';
import type { ExecutionStatus, LanguageKey } from '../types';
import { readStore } from './file-store';

type ProgressRow = {
  user_id: string;
  question_id: number;
  status: 'ATTEMPTED' | 'SOLVED';
  updated_at: string;
};

type SubmissionRow = {
  id: string;
  user_id: string;
  question_id: number;
  language: LanguageKey;
  source_code: string;
  status: ExecutionStatus;
  passed_test_cases: number;
  total_test_cases: number;
  execution_time: string;
  memory: string;
  test_case_results: SubmissionRecord['testCaseResults'];
  created_at: string;
};

type AuditRow = {
  id: string;
  actor_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

const ACTION_SUBMISSION = 'coding.submission';
const ACTION_PROGRESS = 'coding.progress';

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/** True when the web API can talk to Supabase with the service role (server-only). */
export function isSupabasePersistenceEnabled() {
  return config() !== null;
}

let tablesReady = false;
let backfillDone = false;

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const cfg = config();
  if (!cfg) throw new Error('Supabase is not configured');
  const res = await fetch(`${cfg.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Supabase request failed (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

function isMissingTable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes('PGRST205') || message.includes('schema cache');
}

async function useDedicatedTables() {
  if (!tablesReady) {
    try {
      await rest('code_submissions?select=id&limit=1');
      tablesReady = true;
    } catch (error) {
      if (isMissingTable(error)) return false;
      throw error;
    }
  }
  await backfillFromAuditLogs();
  return true;
}

function toSubmission(row: SubmissionRow): SubmissionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    language: row.language,
    sourceCode: row.source_code,
    status: row.status,
    passedTestCases: row.passed_test_cases,
    totalTestCases: row.total_test_cases,
    executionTime: row.execution_time,
    memory: row.memory,
    testCaseResults: row.test_case_results ?? [],
    createdAt: row.created_at,
  };
}

function submissionFromAudit(row: AuditRow): SubmissionRecord {
  const meta = row.metadata ?? {};
  return {
    id: String(meta.id ?? row.id),
    userId: String(meta.userId ?? row.actor_id ?? ''),
    questionId: Number(meta.questionId),
    language: meta.language as LanguageKey,
    sourceCode: String(meta.sourceCode ?? ''),
    status: meta.status as ExecutionStatus,
    passedTestCases: Number(meta.passedTestCases ?? 0),
    totalTestCases: Number(meta.totalTestCases ?? 0),
    executionTime: String(meta.executionTime ?? ''),
    memory: String(meta.memory ?? ''),
    testCaseResults: (meta.testCaseResults as SubmissionRecord['testCaseResults']) ?? [],
    createdAt: String(meta.createdAt ?? row.created_at),
  };
}

async function backfillFromAuditLogs() {
  if (backfillDone) return;
  try {
    const submissions = await rest<AuditRow[]>(
      `audit_logs?action=eq.${encodeURIComponent(ACTION_SUBMISSION)}&select=id,actor_id,action,metadata,created_at`,
    );
    for (const row of submissions ?? []) {
      const record = submissionFromAudit(row);
      if (!record.userId || !record.id) continue;
      await rest('code_submissions?on_conflict=id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({
          id: record.id,
          user_id: record.userId,
          question_id: record.questionId,
          language: record.language,
          source_code: record.sourceCode,
          status: record.status,
          passed_test_cases: record.passedTestCases,
          total_test_cases: record.totalTestCases,
          execution_time: record.executionTime,
          memory: record.memory,
          test_case_results: record.testCaseResults,
          created_at: record.createdAt,
        }),
      });
    }

    const progressRows = await rest<AuditRow[]>(
      `audit_logs?action=eq.${encodeURIComponent(ACTION_PROGRESS)}&select=id,actor_id,action,metadata,created_at`,
    );
    for (const row of progressRows ?? []) {
      const questionId = Number(row.metadata?.questionId);
      const userId = String(row.metadata?.userId ?? row.actor_id ?? '');
      if (!userId || !Number.isFinite(questionId)) continue;
      const status = row.metadata?.status === 'SOLVED' ? 'SOLVED' : 'ATTEMPTED';
      await rest('user_question_progress?on_conflict=user_id,question_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({
          user_id: userId,
          question_id: questionId,
          status,
          updated_at: String(row.metadata?.updatedAt ?? row.created_at),
        }),
      });
    }
    backfillDone = true;
  } catch {
    /* retry on the next request */
  }
}

export async function listProgressForUser(userId: string): Promise<ProgressRecord[]> {
  if (await useDedicatedTables()) {
    const rows = await rest<ProgressRow[]>(
      `user_question_progress?user_id=eq.${encodeURIComponent(userId)}&select=user_id,question_id,status,updated_at`,
    );
    return (rows ?? []).map((row) => ({
      userId: row.user_id,
      questionId: row.question_id,
      status: row.status,
      updatedAt: row.updated_at,
    }));
  }
  const rows = await rest<AuditRow[]>(
    `audit_logs?action=eq.${encodeURIComponent(ACTION_PROGRESS)}&actor_id=eq.${encodeURIComponent(userId)}&select=id,actor_id,action,metadata,created_at`,
  );
  const latest = new Map<number, ProgressRecord>();
  for (const row of rows ?? []) {
    const questionId = Number(row.metadata.questionId);
    if (!Number.isFinite(questionId)) continue;
    latest.set(questionId, {
      userId,
      questionId,
      status: row.metadata.status === 'SOLVED' ? 'SOLVED' : 'ATTEMPTED',
      updatedAt: String(row.metadata.updatedAt ?? row.created_at),
    });
  }
  return [...latest.values()];
}

export async function listAllProgressRecords(): Promise<ProgressRecord[]> {
  if (await useDedicatedTables()) {
    const rows = await rest<ProgressRow[]>(
      'user_question_progress?select=user_id,question_id,status,updated_at',
    );
    return (rows ?? []).map((row) => ({
      userId: row.user_id,
      questionId: row.question_id,
      status: row.status,
      updatedAt: row.updated_at,
    }));
  }
  const rows = await rest<AuditRow[]>(
    `audit_logs?action=eq.${encodeURIComponent(ACTION_PROGRESS)}&select=id,actor_id,action,metadata,created_at`,
  );
  const latest = new Map<string, ProgressRecord>();
  for (const row of rows ?? []) {
    const questionId = Number(row.metadata?.questionId);
    const userId = String(row.metadata?.userId ?? row.actor_id ?? '');
    if (!userId || !Number.isFinite(questionId)) continue;
    latest.set(`${userId}:${questionId}`, {
      userId,
      questionId,
      status: row.metadata?.status === 'SOLVED' ? 'SOLVED' : 'ATTEMPTED',
      updatedAt: String(row.metadata?.updatedAt ?? row.created_at),
    });
  }
  return [...latest.values()];
}

export async function listProfileNames(userIds: string[]) {
  const unique = [...new Set(userIds.filter(Boolean))];
  if (!unique.length) return new Map<string, { displayName: string; username: string }>();
  const filter = unique.map((id) => `"${id}"`).join(',');
  try {
    const rows = await rest<{ id: string; display_name: string | null; username: string }[]>(
      `profiles?id=in.(${filter})&select=id,display_name,username`,
    );
    return new Map(
      (rows ?? []).map((row) => [
        row.id,
        { displayName: row.display_name?.trim() || row.username, username: row.username },
      ]),
    );
  } catch {
    return new Map<string, { displayName: string; username: string }>();
  }
}

export async function upsertProgress(record: ProgressRecord): Promise<void> {
  if (await useDedicatedTables()) {
    const existing = await rest<ProgressRow[]>(
      `user_question_progress?user_id=eq.${encodeURIComponent(record.userId)}&question_id=eq.${record.questionId}&select=status`,
    );
    const current = existing[0]?.status;
    const nextStatus = current === 'SOLVED' ? 'SOLVED' : record.status;
    await rest(`user_question_progress?on_conflict=user_id,question_id`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        user_id: record.userId,
        question_id: record.questionId,
        status: nextStatus,
        updated_at: record.updatedAt,
      }),
    });
    return;
  }

  const existing = await rest<AuditRow[]>(
    `audit_logs?action=eq.${encodeURIComponent(ACTION_PROGRESS)}&actor_id=eq.${encodeURIComponent(record.userId)}&metadata->>questionId=eq.${record.questionId}&select=id,metadata&limit=1`,
  );
  const current = existing[0]?.metadata.status;
  const nextStatus = current === 'SOLVED' ? 'SOLVED' : record.status;
  const metadata = { questionId: record.questionId, status: nextStatus, updatedAt: record.updatedAt };
  if (existing[0]) {
    await rest(`audit_logs?id=eq.${existing[0].id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ metadata }),
    });
    return;
  }
  await rest('audit_logs', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      actor_id: record.userId,
      target_user_id: record.userId,
      action: ACTION_PROGRESS,
      metadata,
    }),
  });
}

export async function insertSubmission(record: SubmissionRecord): Promise<void> {
  if (await useDedicatedTables()) {
    await rest('code_submissions', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        id: record.id,
        user_id: record.userId,
        question_id: record.questionId,
        language: record.language,
        source_code: record.sourceCode,
        status: record.status,
        passed_test_cases: record.passedTestCases,
        total_test_cases: record.totalTestCases,
        execution_time: record.executionTime,
        memory: record.memory,
        test_case_results: record.testCaseResults,
        created_at: record.createdAt,
      }),
    });
    return;
  }
  await rest('audit_logs', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      actor_id: record.userId,
      target_user_id: record.userId,
      action: ACTION_SUBMISSION,
      metadata: {
        id: record.id,
        userId: record.userId,
        questionId: record.questionId,
        language: record.language,
        sourceCode: record.sourceCode,
        status: record.status,
        passedTestCases: record.passedTestCases,
        totalTestCases: record.totalTestCases,
        executionTime: record.executionTime,
        memory: record.memory,
        testCaseResults: record.testCaseResults,
        createdAt: record.createdAt,
      },
    }),
  });
}

export async function listSubmissionRecords(userId: string): Promise<SubmissionRecord[]> {
  if (await useDedicatedTables()) {
    const rows = await rest<SubmissionRow[]>(
      `code_submissions?user_id=eq.${encodeURIComponent(userId)}&select=id,user_id,question_id,language,source_code,status,passed_test_cases,total_test_cases,execution_time,memory,test_case_results,created_at&order=created_at.desc`,
    );
    return (rows ?? []).map(toSubmission);
  }
  const rows = await rest<AuditRow[]>(
    `audit_logs?action=eq.${encodeURIComponent(ACTION_SUBMISSION)}&actor_id=eq.${encodeURIComponent(userId)}&select=id,actor_id,action,metadata,created_at&order=created_at.desc`,
  );
  return (rows ?? []).map(submissionFromAudit);
}

export async function listAllSubmissionRecords(): Promise<SubmissionRecord[]> {
  if (await useDedicatedTables()) {
    const rows = await rest<SubmissionRow[]>(
      'code_submissions?select=id,user_id,question_id,language,source_code,status,passed_test_cases,total_test_cases,execution_time,memory,test_case_results,created_at&order=created_at.desc',
    );
    return (rows ?? []).map(toSubmission);
  }
  const rows = await rest<AuditRow[]>(
    `audit_logs?action=eq.${encodeURIComponent(ACTION_SUBMISSION)}&select=id,actor_id,action,metadata,created_at&order=created_at.desc`,
  );
  return (rows ?? []).map(submissionFromAudit);
}

export async function getSubmissionRecord(userId: string, id: string): Promise<SubmissionRecord | null> {
  if (await useDedicatedTables()) {
    const rows = await rest<SubmissionRow[]>(
      `code_submissions?user_id=eq.${encodeURIComponent(userId)}&id=eq.${encodeURIComponent(id)}&select=id,user_id,question_id,language,source_code,status,passed_test_cases,total_test_cases,execution_time,memory,test_case_results,created_at`,
    );
    return rows[0] ? toSubmission(rows[0]) : null;
  }
  const rows = await rest<AuditRow[]>(
    `audit_logs?action=eq.${encodeURIComponent(ACTION_SUBMISSION)}&actor_id=eq.${encodeURIComponent(userId)}&metadata->>id=eq.${encodeURIComponent(id)}&select=id,actor_id,action,metadata,created_at`,
  );
    return rows[0] ? submissionFromAudit(rows[0]) : null;
}

type VoteRow = { user_id: string; question_id: number; created_at: string };
type VoteCountRow = { question_id: number; vote_count: number; updated_at: string };

let voteBackfillDone = false;

async function ensureVoteTables() {
  if (!config()) return false;
  try {
    await rest('question_interview_votes?select=question_id&limit=1');
    return true;
  } catch (error) {
    if (isMissingTable(error)) return false;
    throw error;
  }
}

async function backfillVotesFromFileStore() {
  if (voteBackfillDone) return;
  const data = await readStore();
  const votes = data.interviewVotes ?? [];
  const questionIds = new Set<number>();
  for (const vote of votes) {
    if (!vote.userId || !Number.isFinite(vote.questionId)) continue;
    questionIds.add(vote.questionId);
    await rest('question_interview_votes?on_conflict=user_id,question_id', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({
        user_id: vote.userId,
        question_id: vote.questionId,
        created_at: vote.createdAt,
      }),
    });
  }
  for (const questionId of questionIds) {
    await syncVoteCount(questionId);
  }
  voteBackfillDone = true;
}

export async function listVoteCounts(): Promise<Map<number, number>> {
  const map = new Map<number, number>();
  if (!(await ensureVoteTables())) return map;
  await backfillVotesFromFileStore();
  const rows = await rest<VoteCountRow[]>('question_vote_counts?select=question_id,vote_count');
  for (const row of rows ?? []) map.set(row.question_id, row.vote_count);
  return map;
}

export async function listVotedQuestionIdsForUser(userId: string): Promise<Set<number>> {
  const mine = new Set<number>();
  if (!(await ensureVoteTables())) return mine;
  await backfillVotesFromFileStore();
  const rows = await rest<VoteRow[]>(
    `question_interview_votes?user_id=eq.${encodeURIComponent(userId)}&select=question_id`,
  );
  for (const row of rows ?? []) mine.add(row.question_id);
  return mine;
}

async function syncVoteCount(questionId: number) {
  const rows = await rest<VoteRow[]>(
    `question_interview_votes?question_id=eq.${questionId}&select=user_id`,
  );
  const voteCount = rows?.length ?? 0;
  const now = new Date().toISOString();
  await rest('question_vote_counts?on_conflict=question_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      question_id: questionId,
      vote_count: voteCount,
      updated_at: now,
    }),
  });
  return voteCount;
}

export async function toggleInterviewVoteRecord(userId: string, questionId: number) {
  if (!(await ensureVoteTables())) return null;
  await backfillVotesFromFileStore();
  const existing = await rest<VoteRow[]>(
    `question_interview_votes?user_id=eq.${encodeURIComponent(userId)}&question_id=eq.${questionId}&select=user_id`,
  );
  const hasVote = Boolean(existing[0]);
  if (hasVote) {
    await rest(
      `question_interview_votes?user_id=eq.${encodeURIComponent(userId)}&question_id=eq.${questionId}`,
      { method: 'DELETE', headers: { Prefer: 'return=minimal' } },
    );
  } else {
    await rest('question_interview_votes', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        user_id: userId,
        question_id: questionId,
        created_at: new Date().toISOString(),
      }),
    });
  }
  const voteCount = await syncVoteCount(questionId);
  return { questionId, voteCount, votedByMe: !hasVote };
}

export async function isVotePersistenceEnabled() {
  return ensureVoteTables();
}
