/**
 * In-app notification list derived from submissions (localStorage "seen" ids).
 * Not push delivery — admin email/push campaigns are stored separately in the coding store.
 */
import type { SubmissionSummary } from '@comm-platform/coding';

import { getWebStorageItem, setWebStorageItem } from '@/lib/safe-web-storage';

const SEEN_KEY = 'comm-platform:notif-seen';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  href?: string;
};

export function notificationsFromSubmissions(submissions: SubmissionSummary[]): AppNotification[] {
  return submissions.map((s) => {
    const accepted = s.status === 'ACCEPTED';
    return {
      id: `sub:${s.id}`,
      title: accepted ? 'Submission accepted' : 'Submission result',
      body: `${s.questionTitle} · ${s.status.replace(/_/g, ' ')}`,
      createdAt: s.createdAt,
      href: `/submissions/${s.id}`,
    };
  });
}

export function buildNotificationFeed(submissions: SubmissionSummary[]): AppNotification[] {
  const fromSubs = notificationsFromSubmissions(submissions);
  const welcome: AppNotification = {
    id: 'welcome',
    title: 'Welcome to Comm Platform',
    body: 'Track practice, submissions, and contest updates from this bell.',
    createdAt: '2020-01-01T00:00:00.000Z',
  };
  return [...fromSubs, welcome].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function loadSeenNotificationIds(): Set<string> {
  try {
    const raw = getWebStorageItem(SEEN_KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(Array.isArray(ids) ? ids : []);
  } catch {
    return new Set();
  }
}

export function saveSeenNotificationIds(ids: Set<string>) {
  setWebStorageItem(SEEN_KEY, JSON.stringify([...ids]));
}

export function submitToastCopy(status: string, passed: number, total: number, errorMessage?: string) {
  const label = status.replace(/_/g, ' ');
  if (errorMessage) {
    return { title: 'Submission failed', body: errorMessage, ok: false };
  }
  if (status === 'ACCEPTED') {
    return {
      title: 'Submission accepted',
      body: `Your code passed ${passed} of ${total} test cases.`,
      ok: true,
    };
  }
  const reason: Record<string, string> = {
    WRONG_ANSWER: 'Output did not match the expected answer.',
    COMPILATION_ERROR: 'The compiler rejected this source.',
    RUNTIME_ERROR: 'The program crashed while running tests.',
    TIME_LIMIT_EXCEEDED: 'A test exceeded the time limit.',
    MEMORY_LIMIT_EXCEEDED: 'A test exceeded the memory limit.',
    INTERNAL_ERROR: 'The judge could not finish this run.',
  };
  return {
    title: `Submission: ${label}`,
    body: `${reason[status] ?? label} ${passed}/${total} test cases passed.`,
    ok: false,
  };
}
