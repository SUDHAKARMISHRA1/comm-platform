export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionStatus = 'SOLVED' | 'ATTEMPTED' | 'NOT_ATTEMPTED';
export type LanguageKey = 'java' | 'c' | 'cpp';

export type ExecutionStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'COMPILATION_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR';

export type QuestionSummary = {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topics: string[];
  status: QuestionStatus;
};

export type QuestionExample = {
  input: string;
  output: string;
  explanation?: string;
};

export type QuestionDetail = {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: QuestionExample[];
  topics: string[];
  supportedLanguages: LanguageKey[];
  status: QuestionStatus;
};

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

export type QuestionsResponse = {
  questions: QuestionSummary[];
  pagination: Pagination;
};

export type DashboardStats = {
  total: number;
  solved: number;
  attempted: number;
  remaining: number;
  difficultyProgress: { difficulty: Difficulty; solved: number; total: number; percent: number }[];
  recentPractice: { questionId: number; title: string; status: QuestionStatus }[];
  recommended: QuestionSummary[];
  recentSubmissions: SubmissionSummary[];
};

export type SubmissionSummary = {
  id: string;
  questionId: number;
  questionTitle: string;
  language: LanguageKey;
  status: ExecutionStatus;
  executionTime: string;
  memory: string;
  createdAt: string;
};

export type SubmissionDetail = SubmissionSummary & {
  sourceCode: string;
  passedTestCases: number;
  totalTestCases: number;
  testCaseResults?: { index: number; passed: boolean; hidden: boolean }[];
};

export type RunCodeRequest = {
  language: LanguageKey;
  sourceCode: string;
  stdin: string;
};

export type ExecutionResult = {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  executionTime: number;
  memory: number;
};

export type RunCodeResponse = ExecutionResult;

export type SubmitCodeRequest = {
  questionId: number;
  language: LanguageKey;
  sourceCode: string;
};

export type TestCaseResult = {
  index: number;
  passed: boolean;
  hidden: boolean;
  stdout?: string;
  stderr?: string;
};

export type SubmitCodeResponse = {
  submissionId: string;
  status: ExecutionStatus;
  passedTestCases: number;
  totalTestCases: number;
  executionTime: string;
  memory: string;
  testCaseResults: TestCaseResult[];
};

export type RunTestsResponse = {
  status: ExecutionStatus;
  passedTestCases: number;
  totalTestCases: number;
  executionTime: string;
  memory: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  testCaseResults: TestCaseResult[];
};

export type SubmissionPollResponse = {
  submissionId: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED';
  result?: ExecutionResult;
};
