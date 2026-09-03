import { LANGUAGES } from '../languages';
import type {
  CodingDataStore,
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
    notifications: [],
    settings: {
      siteName: 'Comm Platform',
      supportEmail: 'support@example.com',
      maintenanceMessage: '',
    },
  };
}
