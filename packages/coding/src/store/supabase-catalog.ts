import type { Difficulty, LanguageKey } from '../types';
import type { LevelRecord, QuestionRecord, SkillRecord, TestCaseRecord, TopicRecord } from '../schema';
import { isSupabasePersistenceEnabled } from './supabase-user-data';

type SkillRow = {
  id: string;
  name: string;
  slug: string;
  language_key: string | null;
  sequence: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

type TopicRow = {
  id: string;
  name: string;
  slug: string;
  sequence: number;
  enabled: boolean | null;
  created_at: string;
  updated_at: string;
};

type LevelRow = {
  id: string;
  name: string;
  slug: string;
  band: string;
  sequence: number;
  enabled: boolean | null;
  created_at: string;
  updated_at: string;
};

type QuestionRow = {
  id: number;
  practice_set_id: string;
  sequence: number;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  examples: unknown;
  skill_id: string;
  level_id: string;
  topics: unknown;
  supported_languages: unknown;
  code_templates: unknown;
  test_cases: unknown;
  published: boolean;
  created_at: string;
  updated_at: string;
};

const LANGS: LanguageKey[] = ['java', 'c', 'cpp'];
const BANDS: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

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

function asLanguage(value: string | null): LanguageKey | null {
  return LANGS.includes(value as LanguageKey) ? (value as LanguageKey) : null;
}

function asBand(value: string): Difficulty {
  return BANDS.includes(value as Difficulty) ? (value as Difficulty) : 'EASY';
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function asLanguages(value: unknown): LanguageKey[] {
  return asStringArray(value).filter((item): item is LanguageKey => LANGS.includes(item as LanguageKey));
}

function asExamples(value: unknown): QuestionRecord['examples'] {
  if (!Array.isArray(value)) return [];
  const out: QuestionRecord['examples'] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    if (typeof row.input !== 'string' || typeof row.output !== 'string') continue;
    out.push({
      input: row.input,
      output: row.output,
      ...(typeof row.explanation === 'string' ? { explanation: row.explanation } : {}),
    });
  }
  return out;
}

function asTemplates(value: unknown): QuestionRecord['codeTemplates'] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const row = value as Record<string, unknown>;
  const out: QuestionRecord['codeTemplates'] = {};
  for (const key of LANGS) {
    if (typeof row[key] === 'string') out[key] = row[key];
  }
  return out;
}

function asTests(value: unknown): TestCaseRecord[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      return {
        id: typeof row.id === 'string' ? row.id : `t${index + 1}`,
        input: typeof row.input === 'string' ? row.input : '',
        expectedOutput: typeof row.expectedOutput === 'string' ? row.expectedOutput : '',
        hidden: Boolean(row.hidden),
        sequence: typeof row.sequence === 'number' ? row.sequence : index + 1,
      };
    })
    .filter((item): item is TestCaseRecord => item !== null);
}

function mapSkill(row: SkillRow): SkillRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    languageKey: asLanguage(row.language_key),
    sequence: row.sequence,
    enabled: row.enabled !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTopic(row: TopicRow): TopicRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sequence: row.sequence,
    enabled: row.enabled !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLevel(row: LevelRow): LevelRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    band: asBand(row.band),
    sequence: row.sequence,
    enabled: row.enabled !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapQuestion(row: QuestionRow): QuestionRecord {
  return {
    id: Number(row.id),
    practiceSetId: row.practice_set_id ?? '',
    sequence: row.sequence,
    title: row.title,
    slug: row.slug ?? '',
    difficulty: asBand(row.difficulty),
    description: row.description ?? '',
    inputFormat: row.input_format ?? '',
    outputFormat: row.output_format ?? '',
    constraints: row.constraints ?? '',
    examples: asExamples(row.examples),
    skillId: row.skill_id,
    levelId: row.level_id,
    topics: asStringArray(row.topics),
    supportedLanguages: asLanguages(row.supported_languages),
    codeTemplates: asTemplates(row.code_templates),
    testCases: asTests(row.test_cases),
    published: Boolean(row.published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function skillPayload(row: SkillRecord) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    language_key: row.languageKey,
    sequence: row.sequence,
    enabled: row.enabled !== false,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

function topicPayload(row: TopicRecord) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sequence: row.sequence,
    enabled: row.enabled !== false,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

function levelPayload(row: LevelRecord) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    band: row.band,
    sequence: row.sequence,
    enabled: row.enabled !== false,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

function questionPayload(row: QuestionRecord) {
  return {
    id: row.id,
    practice_set_id: row.practiceSetId,
    sequence: row.sequence,
    title: row.title,
    slug: row.slug,
    difficulty: row.difficulty,
    description: row.description,
    input_format: row.inputFormat,
    output_format: row.outputFormat,
    constraints: row.constraints,
    examples: row.examples,
    skill_id: row.skillId,
    level_id: row.levelId,
    topics: row.topics,
    supported_languages: row.supportedLanguages,
    code_templates: row.codeTemplates,
    test_cases: row.testCases,
    published: row.published,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

async function upsert(table: string, body: unknown) {
  await rest(`${table}?on_conflict=id`, {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(body),
  });
}

let tablesReady: boolean | null = null;

export async function catalogTablesReady() {
  if (!isSupabasePersistenceEnabled()) return false;
  if (tablesReady != null) return tablesReady;
  try {
    await rest('practice_skills?select=id&limit=1');
    tablesReady = true;
  } catch (error) {
    if (isMissingTable(error)) {
      tablesReady = false;
      return false;
    }
    throw error;
  }
  return tablesReady;
}

export function resetCatalogReadyCache() {
  tablesReady = null;
}

export async function listSkillsDb() {
  const rows = await rest<SkillRow[]>('practice_skills?select=*&order=sequence.asc');
  return (rows ?? []).map(mapSkill);
}

export async function listTopicsDb() {
  const rows = await rest<TopicRow[]>('practice_topics?select=*&order=sequence.asc');
  return (rows ?? []).map(mapTopic);
}

export async function listLevelsDb() {
  const rows = await rest<LevelRow[]>('practice_levels?select=*&order=sequence.asc');
  return (rows ?? []).map(mapLevel);
}

export async function listQuestionsDb() {
  const rows = await rest<QuestionRow[]>('practice_questions?select=*&order=sequence.asc');
  return (rows ?? []).map(mapQuestion);
}

export async function upsertSkillDb(row: SkillRecord) {
  await upsert('practice_skills', skillPayload(row));
  return row;
}

export async function upsertTopicDb(row: TopicRecord) {
  await upsert('practice_topics', topicPayload(row));
  return row;
}

export async function upsertLevelDb(row: LevelRecord) {
  await upsert('practice_levels', levelPayload(row));
  return row;
}

export async function upsertQuestionDb(row: QuestionRecord) {
  await upsert('practice_questions', questionPayload(row));
  return row;
}

export async function deleteSkillDb(id: string) {
  await rest(`practice_skills?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function deleteTopicDb(id: string) {
  await rest(`practice_topics?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function deleteLevelDb(id: string) {
  await rest(`practice_levels?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function deleteQuestionDb(id: number) {
  await rest(`practice_questions?id=eq.${id}`, { method: 'DELETE' });
}
