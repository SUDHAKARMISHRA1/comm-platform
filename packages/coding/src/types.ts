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
  skillId?: string;
  skillName?: string;
  levelId?: string;
  levelName?: string;
  topics: string[];
  status: QuestionStatus;
  voteCount: number;
  votedByMe: boolean;
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
  skillId?: string;
  skillName?: string;
  levelId?: string;
  levelName?: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: QuestionExample[];
  topics: string[];
  supportedLanguages: LanguageKey[];
  status: QuestionStatus;
  voteCount: number;
  votedByMe: boolean;
};

export type VoteToggleResponse = {
  questionId: number;
  voteCount: number;
  votedByMe: boolean;
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

export type WeeklyActivityDay = {
  day: string;
  dateKey: string;
  count: number;
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
  weeklyActivity: WeeklyActivityDay[];
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

export type FeedPostKind = 'article' | 'post' | 'video' | 'link';

export type FeedContentBlock = {
  id: string;
  kind: 'text' | 'image' | 'video' | 'slideshow';
  text?: string;
  url?: string;
  urls?: string[];
  caption?: string;
};

export type FeedPostCard = {
  id: string;
  kind: FeedPostKind;
  title: string;
  body: string;
  mediaUrl: string;
  linkUrl: string;
  authorName: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  commentCount: number;
  shareCount: number;
  sharedByMe: boolean;
  blocks: FeedContentBlock[];
};

export type FeedPostAdminRow = {
  id: string;
  kind: FeedPostKind;
  title: string;
  authorName: string;
  published: boolean;
  createdAt: string;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  replyCount: number;
};

export type FeedCommentNode = {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string;
  body: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  hidden?: boolean;
  replies: FeedCommentNode[];
};

export type FeedListResponse = {
  posts: FeedPostCard[];
  pagination: Pagination;
};

export type FeedLikeResponse = {
  postId: string;
  likeCount: number;
  likedByMe: boolean;
};

export type FeedShareResponse = {
  postId: string;
  shareCount: number;
  sharedByMe: boolean;
};

export type FeedCommentLikeResponse = {
  commentId: string;
  likeCount: number;
  likedByMe: boolean;
};

export type CatalogPayload = {
  skills: { id: string; name: string; slug: string; languageKey: LanguageKey | null }[];
  levels: { id: string; name: string; slug: string; band: Difficulty }[];
  topics: { id: string; name: string; slug: string }[];
  pages: { id: string; title: string; slug: string; body: string }[];
  notifications: {
    id: string;
    channel: 'email' | 'push';
    title: string;
    body: string;
    audience: 'all' | 'active' | 'inactive';
    publishedAt: string | null;
  }[];
  settings: { siteName: string; supportEmail: string; maintenanceMessage: string };
};

