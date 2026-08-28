import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { CodingDataStore } from '../schema';
import { createSeedStore } from './seed';

const DEFAULT_DIR = path.join(process.cwd(), '../../data/coding');

function dataPath() {
  return process.env.CODING_DATA_DIR ?? DEFAULT_DIR;
}

function storeFile() {
  return path.join(dataPath(), 'store.json');
}

let cache: CodingDataStore | null = null;

export async function readStore(): Promise<CodingDataStore> {
  if (cache) return structuredClone(cache);
  const file = storeFile();
  try {
    const raw = await readFile(file, 'utf8');
    cache = JSON.parse(raw) as CodingDataStore;
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
