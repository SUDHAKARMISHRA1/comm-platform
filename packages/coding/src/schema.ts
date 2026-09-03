import type { Difficulty, ExecutionStatus, LanguageKey, QuestionExample } from './types';

/** Mirrors future Postgres tables — see supabase/migrations/0002_coding.sql */
export type TestCaseRecord = {
  id: string;
  input: string;
  expectedOutput: string;
  hidden: boolean;
  sequence: number;
};

export type PracticeSetRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  topics: string[];
  languages: LanguageKey[];
  sequence: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type QuestionRecord = {
  id: number;
  practiceSetId: string;
  sequence: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: QuestionExample[];
  skillId: string;
  levelId: string;
  topics: string[];
  supportedLanguages: LanguageKey[];
  codeTemplates: Partial<Record<LanguageKey, string>>;
  testCases: TestCaseRecord[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SkillRecord = {
  id: string;
  name: string;
  slug: string;
  languageKey: LanguageKey | null;
  sequence: number;
  createdAt: string;
  updatedAt: string;
};

export type LevelRecord = {
  id: string;
  name: string;
  slug: string;
  band: Difficulty;
  sequence: number;
  createdAt: string;
  updatedAt: string;
};

export type TopicRecord = {
  id: string;
  name: string;
  slug: string;
  sequence: number;
  createdAt: string;
  updatedAt: string;
};

export type CmsPageRecord = {
  id: string;
  title: string;
  slug: string;
  body: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationChannel = 'email' | 'push';
export type NotificationAudience = 'all' | 'active' | 'inactive';

export type NotificationCampaignRecord = {
  id: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  audience: NotificationAudience;
  status: 'draft' | 'published';
  createdAt: string;
  publishedAt: string | null;
};

export type AdminSettingsRecord = {
  siteName: string;
  supportEmail: string;
  maintenanceMessage: string;
};

export type InterviewVoteRecord = {
  userId: string;
  questionId: number;
  createdAt: string;
};

export type VoteCountRecord = {
  questionId: number;
  voteCount: number;
  updatedAt: string;
};

export type ProgressRecord = {
  userId: string;
  questionId: number;
  status: 'SOLVED' | 'ATTEMPTED';
  updatedAt: string;
};

export type SubmissionRecord = {
  id: string;
  userId: string;
  questionId: number;
  language: LanguageKey;
  sourceCode: string;
  status: ExecutionStatus;
  passedTestCases: number;
  totalTestCases: number;
  executionTime: string;
  memory: string;
  testCaseResults: { index: number; passed: boolean; hidden: boolean }[];
  createdAt: string;
};

export type CodingDataStore = {
  practiceSets: PracticeSetRecord[];
  questions: QuestionRecord[];
  progress: ProgressRecord[];
  interviewVotes: InterviewVoteRecord[];
  voteCounts: VoteCountRecord[];
  submissions: SubmissionRecord[];
  skills: SkillRecord[];
  levels: LevelRecord[];
  topics: TopicRecord[];
  cmsPages: CmsPageRecord[];
  notifications: NotificationCampaignRecord[];
  settings: AdminSettingsRecord;
};
