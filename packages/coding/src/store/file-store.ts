import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { CodingDataStore } from '../schema';
import { createSeedStore, defaultCatalog } from './seed';

const DEFAULT_DIR = path.join(process.cwd(), '../../data/coding');

function dataPath() {
  return process.env.CODING_DATA_DIR ?? DEFAULT_DIR;
}

function storeFile() {
  return path.join(dataPath(), 'store.json');
}

let cache: CodingDataStore | null = null;

export function ensureCatalog(data: CodingDataStore): boolean {
  const now = new Date().toISOString();
  let changed = false;
  const fallback = defaultCatalog(now);

  if (!Array.isArray(data.skills) || data.skills.length === 0) {
    data.skills = fallback.skills;
    changed = true;
  }
  if (!Array.isArray(data.levels) || data.levels.length === 0) {
    data.levels = fallback.levels;
    changed = true;
  }
  if (!Array.isArray(data.topics) || data.topics.length === 0) {
    data.topics = fallback.topics;
    changed = true;
  }
  if (!Array.isArray(data.cmsPages)) {
    data.cmsPages = [];
    changed = true;
  }
  if (!Array.isArray(data.notifications)) {
    data.notifications = [];
    changed = true;
  }
  if (!data.settings) {
    data.settings = {
      siteName: 'Comm Platform',
      supportEmail: 'support@example.com',
      maintenanceMessage: '',
    };
    changed = true;
  }

  const defaultSkill = data.skills[0]!;
  for (const q of data.questions) {
    if (!q.skillId) {
      q.skillId = defaultSkill.id;
      changed = true;
    }
    if (!q.levelId) {
      const level = data.levels.find((l) => l.band === q.difficulty) ?? data.levels[0]!;
      q.levelId = level.id;
      q.difficulty = level.band;
      changed = true;
    }
  }
  return changed;
}

export async function readStore(): Promise<CodingDataStore> {
  if (cache) return structuredClone(cache);
  const file = storeFile();
  try {
    const raw = await readFile(file, 'utf8');
    const parsed = JSON.parse(raw) as CodingDataStore;
    if (ensureCatalog(parsed)) {
      await writeStore(parsed);
      return structuredClone(parsed);
    }
    cache = parsed;
    return structuredClone(cache);
  } catch {
    const seed = createSeedStore();
    await writeStore(seed);
    return structuredClone(seed);
  }
}

export async function writeStore(data: CodingDataStore): Promise<void> {
  const dir = dataPath();
  await mkdir(dir, { recursive: true });
  const file = storeFile();
  const tmp = `${file}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await rename(tmp, file);
  cache = structuredClone(data);
}

export async function mutateStore<T>(fn: (data: CodingDataStore) => T): Promise<T> {
  const data = await readStore();
  const result = fn(data);
  await writeStore(data);
  return result;
}
