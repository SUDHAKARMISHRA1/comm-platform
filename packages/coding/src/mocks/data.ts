/** Built-in practice catalog used when `EXPO_PUBLIC_USE_MOCK_API=true` (no Next.js API required). */
import type { CatalogPayload, QuestionDetail, QuestionSummary, SubmissionDetail, SubmissionSummary } from '../types';
import { buildWeeklyActivity } from '../weekly-activity';
import { mockVoteCount, mockVotedByMe } from './votes';

type MockQuestion = Omit<QuestionDetail, 'voteCount' | 'votedByMe'>;

export const MOCK_QUESTIONS: MockQuestion[] = [
  {
    id: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'EASY',
    status: 'SOLVED',
    topics: ['Array', 'HashMap'],
    supportedLanguages: ['java', 'c', 'cpp'],
    description:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.',
    inputFormat: 'First line: n (array length)\nSecond line: n space-separated integers\nThird line: target',
    outputFormat: 'Two space-separated indices (0-based).',
    constraints: '2 <= n <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    examples: [
      { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: '3\n3 2 4\n6', output: '1 2' },
    ],
  },
  {
    id: 2,
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'EASY',
    status: 'ATTEMPTED',
    topics: ['String'],
    supportedLanguages: ['java', 'c', 'cpp'],
    description: 'Given a string `s`, reverse the string in-place and print the result.',
    inputFormat: 'A single line containing the string s.',
    outputFormat: 'The reversed string.',
    constraints: '1 <= s.length <= 10^5\ns consists of printable ASCII characters.',
    examples: [{ input: 'hello', output: 'olleh' }],
  },
  {
    id: 3,
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    difficulty: 'EASY',
    status: 'NOT_ATTEMPTED',
    topics: ['Math'],
    supportedLanguages: ['java', 'c', 'cpp'],
    description: 'Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.',
    inputFormat: 'A single integer x.',
    outputFormat: 'Print `true` or `false`.',
    constraints: '-2^31 <= x <= 2^31 - 1',
    examples: [
      { input: '121', output: 'true' },
      { input: '-121', output: 'false' },
    ],
  },
  {
    id: 4,
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'MEDIUM',
    status: 'NOT_ATTEMPTED',
    topics: ['Searching', 'Array'],
    supportedLanguages: ['java', 'c', 'cpp'],
    description:
      'Given a sorted array of integers and a target value, return the index if the target is found. If not, return -1.',
    inputFormat: 'First line: n\nSecond line: n sorted integers\nThird line: target',
    outputFormat: 'Index of target or -1.',
    constraints: '1 <= n <= 10^4\n-10^4 <= nums[i], target <= 10^4',
    examples: [{ input: '5\n-1 0 3 5 9\n3', output: '2' }],
  },
  {
    id: 5,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'MEDIUM',
    status: 'NOT_ATTEMPTED',
    topics: ['Array', 'Dynamic Programming'],
    supportedLanguages: ['java', 'c', 'cpp'],
    description:
      "Given an integer array `nums`, find the contiguous subarray with the largest sum, and return its sum.",
    inputFormat: 'First line: n\nSecond line: n integers',
    outputFormat: 'Maximum subarray sum.',
    constraints: '1 <= n <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [{ input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6' }],
  },
  {
    id: 6,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'HARD',
    status: 'NOT_ATTEMPTED',
    topics: ['Array', 'Dynamic Programming'],
    supportedLanguages: ['java', 'c', 'cpp'],
    description:
      'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
    inputFormat: 'First line: n\nSecond line: n integers',
    outputFormat: 'Total units of trapped water.',
    constraints: '1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5',
    examples: [{ input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6' }],
  },
];

export const MOCK_SUBMISSIONS: SubmissionDetail[] = [
  {
    id: 'sub-001',
    questionId: 1,
    questionTitle: 'Two Sum',
    language: 'java',
    status: 'ACCEPTED',
    executionTime: '0.18s',
    memory: '14 MB',
    createdAt: new Date().toISOString(),
    sourceCode: 'public class Main { /* accepted solution */ }',
    passedTestCases: 10,
    totalTestCases: 10,
    testCaseResults: Array.from({ length: 10 }, (_, i) => ({ index: i + 1, passed: true, hidden: i >= 3 })),
  },
  {
    id: 'sub-002',
    questionId: 4,
    questionTitle: 'Binary Search',
    language: 'cpp',
    status: 'WRONG_ANSWER',
    executionTime: '0.25s',
    memory: '15 MB',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    sourceCode: 'int main() { return 0; }',
    passedTestCases: 7,
    totalTestCases: 10,
    testCaseResults: [
      ...Array.from({ length: 7 }, (_, i) => ({ index: i + 1, passed: true, hidden: false })),
      { index: 8, passed: false, hidden: true },
      { index: 9, passed: false, hidden: true },
      { index: 10, passed: false, hidden: true },
    ],
  },
];

const HIDDEN_TESTS: Record<number, { input: string; output: string }[]> = {
  1: [
    { input: '4\n2 7 11 15\n9', output: '0 1' },
    { input: '3\n3 2 4\n6', output: '1 2' },
    { input: '2\n3 3\n6', output: '0 1' },
  ],
  2: [{ input: 'hello', output: 'olleh' }],
  3: [
    { input: '121', output: 'true' },
    { input: '-121', output: 'false' },
  ],
  4: [{ input: '5\n-1 0 3 5 9\n3', output: '2' }],
  5: [{ input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6' }],
};

export function getHiddenTests(questionId: number) {
  return HIDDEN_TESTS[questionId] ?? [];
}

export function toSummary(q: MockQuestion, userId?: string): QuestionSummary {
  return {
    id: q.id,
    title: q.title,
    slug: q.slug,
    difficulty: q.difficulty,
    skillId: q.skillId ?? 'skill-java',
    topics: q.topics,
    status: q.status,
    voteCount: mockVoteCount(q.id),
    votedByMe: userId ? mockVotedByMe(userId, q.id) : false,
  };
}

export function listMockQuestions(filters: {
  q?: string;
  difficulty?: string;
  topic?: string;
  status?: string;
  skill?: string;
  level?: string;
  page?: number;
  pageSize?: number;
  userId?: string;
}): { questions: QuestionSummary[]; pagination: { page: number; pageSize: number; total: number } } {
  const pageSize = filters.pageSize ?? 20;
  const page = filters.page ?? 1;
  let items = MOCK_QUESTIONS.map((q) => toSummary(q, filters.userId));

  if (filters.q) {
    const term = filters.q.toLowerCase();
    items = items.filter(
      (q) =>
        q.title.toLowerCase().includes(term) ||
        String(q.id).includes(term) ||
        q.topics.some((t) => t.toLowerCase().includes(term)),
    );
  }
  if (filters.difficulty) {
    items = items.filter((q) => q.difficulty === filters.difficulty);
  }
  if (filters.skill) {
    const skillTerm = filters.skill.toLowerCase();
    items = items.filter((q) => q.skillId === filters.skill || q.skillName?.toLowerCase() === skillTerm);
  }
  if (filters.level) {
    items = items.filter((q) => q.levelId === filters.level || q.difficulty === filters.level);
  }
  if (filters.topic) {
    items = items.filter((q) => q.topics.some((t) => t.toLowerCase() === filters.topic!.toLowerCase()));
  }
  if (filters.status && filters.status !== 'ALL') {
    items = items.filter((q) => q.status === filters.status);
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    questions: items.slice(start, start + pageSize),
    pagination: { page, pageSize, total },
  };
}

export function getMockQuestion(id: number, userId?: string): QuestionDetail | undefined {
  const q = MOCK_QUESTIONS.find((item) => item.id === id);
  if (!q) return undefined;
  return {
    ...q,
    voteCount: mockVoteCount(q.id),
    votedByMe: userId ? mockVotedByMe(userId, q.id) : false,
  };
}

export function listMockVotedQuestions(
  userId: string,
  filters: { skill?: string; page?: number; pageSize?: number },
) {
  const pageSize = filters.pageSize ?? 10;
  const page = filters.page ?? 1;
  let items = MOCK_QUESTIONS.map((q) => toSummary(q, userId)).filter((q) => q.voteCount > 0);
  if (filters.skill) {
    items = items.filter((q) => q.skillId === filters.skill);
  }
  items.sort((a, b) => b.voteCount - a.voteCount || a.id - b.id);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return {
    questions: items.slice(start, start + pageSize),
    pagination: { page, pageSize, total },
  };
}

export function getAdjacentQuestionIds(id: number): { prev: number | null; next: number | null } {
  const ids = MOCK_QUESTIONS.map((q) => q.id);
  const idx = ids.indexOf(id);
  return {
    prev: idx > 0 ? (ids[idx - 1] ?? null) : null,
    next: idx >= 0 && idx < ids.length - 1 ? (ids[idx + 1] ?? null) : null,
  };
}

export function listMockSubmissions(): SubmissionSummary[] {
  return MOCK_SUBMISSIONS.map(({ sourceCode: _s, passedTestCases: _p, totalTestCases: _t, testCaseResults: _r, ...rest }) => rest);
}

export function getMockSubmission(id: string): SubmissionDetail | undefined {
  return MOCK_SUBMISSIONS.find((s) => s.id === id);
}

export function getMockDashboard() {
  const summaries = MOCK_QUESTIONS.map((q) => toSummary(q));
  const solved = summaries.filter((q) => q.status === 'SOLVED').length;
  const attempted = summaries.filter((q) => q.status === 'ATTEMPTED').length;
  const total = summaries.length;

  const byDiff = (d: string) => {
    const all = summaries.filter((q) => q.difficulty === d);
    const done = all.filter((q) => q.status === 'SOLVED').length;
    return { difficulty: d as 'EASY' | 'MEDIUM' | 'HARD', solved: done, total: all.length, percent: all.length ? Math.round((done / all.length) * 100) : 0 };
  };

  return {
    total,
    solved,
    attempted,
    remaining: total - solved,
    difficultyProgress: [byDiff('EASY'), byDiff('MEDIUM'), byDiff('HARD')],
    recentPractice: summaries.slice(0, 4).map((q) => ({ questionId: q.id, title: q.title, status: q.status })),
    recommended: summaries.filter((q) => q.status !== 'SOLVED').slice(0, 3),
    recentSubmissions: listMockSubmissions().slice(0, 5),
    weeklyActivity: buildWeeklyActivity(listMockSubmissions()),
  };
}

export function getMockCatalog(): CatalogPayload {
  return {
    skills: [
      { id: 'skill-java', name: 'Java', slug: 'java', languageKey: 'java' },
      { id: 'skill-c', name: 'C', slug: 'c', languageKey: 'c' },
      { id: 'skill-cpp', name: 'C++', slug: 'cpp', languageKey: 'cpp' },
    ],
    levels: [
      { id: 'level-easy', name: 'Easy', slug: 'easy', band: 'EASY' },
      { id: 'level-medium', name: 'Medium', slug: 'medium', band: 'MEDIUM' },
      { id: 'level-hard', name: 'Hard', slug: 'hard', band: 'HARD' },
    ],
    topics: ['Array', 'String', 'Searching', 'Dynamic Programming', 'Math', 'HashMap'].map((name) => ({
      id: `topic-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
    })),
    pages: [],
    notifications: [],
    settings: { siteName: 'Comm Platform', supportEmail: 'support@example.com', maintenanceMessage: '' },
  };
}
