import { LANGUAGES } from '../languages';
import type { CodingDataStore, PracticeSetRecord, QuestionRecord, TestCaseRecord } from '../schema';
import { MOCK_QUESTIONS } from '../mocks/data';

const SET_ID = 'ps-fundamentals';

function tc(id: string, input: string, output: string, hidden: boolean, sequence: number): TestCaseRecord {
  return { id, input, expectedOutput: output, hidden, sequence };
}

function buildQuestions(): QuestionRecord[] {
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
  };

  const now = new Date().toISOString();
  return MOCK_QUESTIONS.map((q, i) => ({
    id: q.id,
    practiceSetId: SET_ID,
    sequence: i + 1,
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
    codeTemplates: Object.fromEntries(
      q.supportedLanguages.map((lang) => [lang, LANGUAGES[lang].template]),
    ),
    testCases: tests[q.id] ?? [],
    published: true,
    createdAt: now,
    updatedAt: now,
  }));
}

export function createSeedStore(): CodingDataStore {
  const now = new Date().toISOString();
  const practiceSet: PracticeSetRecord = {
    id: SET_ID,
    title: 'Fundamentals',
    slug: 'fundamentals',
    description: 'Core DSA practice problems',
    topics: ['Array', 'String', 'Math', 'Searching', 'Dynamic Programming'],
    languages: ['java', 'c', 'cpp'],
    sequence: 1,
    published: true,
    createdAt: now,
    updatedAt: now,
  };
  return {
    practiceSets: [practiceSet],
    questions: buildQuestions(),
    progress: [],
    submissions: [],
  };
}
