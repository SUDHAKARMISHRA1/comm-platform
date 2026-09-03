import { LANGUAGES } from '../languages';
import type {
  CodingDataStore,
  FeedPostRecord,
  LevelRecord,
  PracticeSetRecord,
  QuestionRecord,
  SkillRecord,
  TestCaseRecord,
  TopicRecord,
} from '../schema';
import { MOCK_QUESTIONS } from '../mocks/data';

const SET_ID = 'ps-fundamentals';

function tc(id: string, input: string, output: string, hidden: boolean, sequence: number): TestCaseRecord {
  return { id, input, expectedOutput: output, hidden, sequence };
}

export function defaultCatalog(now = new Date().toISOString()) {
  const skills: SkillRecord[] = [
    { id: 'skill-java', name: 'Java', slug: 'java', languageKey: 'java', sequence: 1, createdAt: now, updatedAt: now },
    { id: 'skill-c', name: 'C', slug: 'c', languageKey: 'c', sequence: 2, createdAt: now, updatedAt: now },
    { id: 'skill-cpp', name: 'C++', slug: 'cpp', languageKey: 'cpp', sequence: 3, createdAt: now, updatedAt: now },
  ];
  const levels: LevelRecord[] = [
    { id: 'level-easy', name: 'Easy', slug: 'easy', band: 'EASY', sequence: 1, createdAt: now, updatedAt: now },
    { id: 'level-medium', name: 'Medium', slug: 'medium', band: 'MEDIUM', sequence: 2, createdAt: now, updatedAt: now },
    { id: 'level-hard', name: 'Hard', slug: 'hard', band: 'HARD', sequence: 3, createdAt: now, updatedAt: now },
  ];
  const topicNames = ['Array', 'String', 'Searching', 'Dynamic Programming', 'Math', 'HashMap'];
  const topics: TopicRecord[] = topicNames.map((name, i) => ({
    id: `topic-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    sequence: i + 1,
    createdAt: now,
    updatedAt: now,
  }));
  return { skills, levels, topics };
}

export function defaultFeedPosts(now = new Date().toISOString()): FeedPostRecord[] {
  const day = 24 * 60 * 60 * 1000;
  const at = (daysAgo: number) => new Date(Date.now() - daysAgo * day).toISOString();
  return [
    {
      id: 'feed-welcome-article',
      kind: 'article',
      title: 'How we coach for intern and new-grad loops',
      body: 'Most candidates freeze on the first clarifying question. We started publishing the same prompts our mentors use in mock loops: constraints first, then brute force, then the cut that actually ships.\n\nThis week we are highlighting array + hashmap patterns that showed up in recent intern interviews. Work them in Java if that is your interview language. Comment with the company loop you are preparing for and we will queue a follow-up post.',
      mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
      linkUrl: '',
      authorName: 'Comm Platform',
      published: true,
      createdAt: at(1),
      updatedAt: now,
    },
    {
      id: 'feed-office-hours-post',
      kind: 'post',
      title: 'Office hours Thursday',
      body: 'Drop a question you missed in a recent screen. We will pick three and walk the solution live — no slides, just a shared editor.\n\nBring the prompt, the language you used, and where you got stuck. That last part is the useful one.',
      mediaUrl: '',
      linkUrl: '',
      authorName: 'Comm Platform',
      published: true,
      createdAt: at(3),
      updatedAt: now,
    },
    {
      id: 'feed-binary-search-video',
      kind: 'video',
      title: 'Binary search: the interview version',
      body: 'A 12-minute walkthrough of the template we want you to write from memory: bounds, invariant, and the off-by-one that costs offers. Watch once, then implement Binary Search in Practice without looking back.',
      mediaUrl: 'https://www.youtube.com/watch?v=KeL6fCOFMkY',
      linkUrl: 'https://www.youtube.com/watch?v=KeL6fCOFMkY',
      authorName: 'Comm Platform',
      published: true,
      createdAt: at(5),
      updatedAt: now,
    },
    {
      id: 'feed-complexity-link',
      kind: 'link',
      title: 'A practical cheat sheet for time complexity',
      body: 'When a problem says 10^5, you already know the answer cannot be n². We keep a short reference on our desk during mocks — share it with your study group.',
      mediaUrl: '',
      linkUrl: 'https://www.bigocheatsheet.com/',
      authorName: 'Comm Platform',
      published: true,
      createdAt: at(8),
      updatedAt: now,
    },
    {
      id: 'feed-debug-article',
      kind: 'article',
      title: 'Read the failing test before you rewrite the solution',
      body: 'A surprising number of Wrong Answer submissions are off-by-one on the first hidden case. Print the invariant. Name the indices. Then change the code.\n\nWe will keep posting the failure patterns we see in office hours so you can pattern-match before contest night.',
      mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
      linkUrl: '',
      authorName: 'Comm Platform',
      published: true,
      createdAt: at(12),
      updatedAt: now,
    },
    {
      id: 'feed-java-collections-post',
      kind: 'post',
      title: 'Java collections you should be able to write cold',
      body: 'HashMap, ArrayDeque, and a min-heap. If you hesitate on the import or the comparator, drill those three this weekend. Everything else in intern loops is built on them.',
      mediaUrl: '',
      linkUrl: '',
      authorName: 'Comm Platform',
      published: true,
      createdAt: at(14),
      updatedAt: now,
    },
  ];
}

function buildQuestions(skills: SkillRecord[], levels: LevelRecord[]): QuestionRecord[] {
  const tests: Record<number, TestCaseRecord[]> = {
    1: [
      tc('t1-1', '4\n2 7 11 15\n9', '0 1', false, 1),
      tc('t1-2', '3\n3 2 4\n6', '1 2', true, 2),
    ],
    2: [tc('t2-1', 'hello', 'olleh', false, 1)],
    3: [
      tc('t3-1', '121', 'true', false, 1),
      tc('t3-2', '-121', 'false', true, 2),
    ],
    4: [tc('t4-1', '5\n-1 0 3 5 9\n3', '2', false, 1)],
    5: [tc('t5-1', '9\n-2 1 -3 4 -1 2 1 -5 4', '6', false, 1)],
    6: [tc('t6-1', '12\n0 1 0 2 1 0 1 3 2 1 2 1', '6', false, 1)],
  };

  const now = new Date().toISOString();
  const java = skills.find((s) => s.slug === 'java') ?? skills[0]!;
  return MOCK_QUESTIONS.map((q, i) => {
    const level = levels.find((l) => l.band === q.difficulty) ?? levels[0]!;
    return {
      id: q.id,
      practiceSetId: SET_ID,
      sequence: i + 1,
      title: q.title,
      slug: q.slug,
      difficulty: q.difficulty,
      skillId: java.id,
      levelId: level.id,
      description: q.description,
      inputFormat: q.inputFormat,
      outputFormat: q.outputFormat,
      constraints: q.constraints,
      examples: q.examples,
      topics: q.topics,
      supportedLanguages: q.supportedLanguages,
      codeTemplates: Object.fromEntries(q.supportedLanguages.map((lang) => [lang, LANGUAGES[lang].template])),
      testCases: tests[q.id] ?? [],
      published: true,
      createdAt: now,
      updatedAt: now,
    };
  });
}

export function createSeedStore(): CodingDataStore {
  const now = new Date().toISOString();
  const { skills, levels, topics } = defaultCatalog(now);
  const practiceSet: PracticeSetRecord = {
    id: SET_ID,
    title: 'Fundamentals',
    slug: 'fundamentals',
    description: 'Core DSA practice problems',
    topics: topics.map((t) => t.name),
    languages: ['java', 'c', 'cpp'],
    sequence: 1,
    published: true,
    createdAt: now,
    updatedAt: now,
  };
  return {
    practiceSets: [practiceSet],
    questions: buildQuestions(skills, levels),
    progress: [],
    interviewVotes: [],
    voteCounts: [],
    submissions: [],
    skills,
    levels,
    topics,
    cmsPages: [],
    feedPosts: defaultFeedPosts(now),
    feedLikes: [],
    feedShares: [],
    feedComments: [],
    feedCommentLikes: [],
    notifications: [],
    settings: {
      siteName: 'Comm Platform',
      supportEmail: 'support@example.com',
      maintenanceMessage: '',
    },
  };
}
