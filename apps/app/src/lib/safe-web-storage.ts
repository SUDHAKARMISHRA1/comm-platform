const memory = new Map<string, string>();

let storageAvailable: boolean | null = null;

/** Chrome can block localStorage (third-party cookies, iframe, privacy settings). */
export function isWebStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  if (storageAvailable !== null) return storageAvailable;
  try {
    const testKey = '__comm_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  return storageAvailable;
}

/** Prefer the browser localStorage object so Supabase can persist across hard refresh. */
export function getBrowserLocalStorage(): Storage | undefined {
  if (!isWebStorageAvailable()) return undefined;
  return window.localStorage;
}

export function getWebStorageItem(key: string): string | null {
  try {
    if (isWebStorageAvailable()) return window.localStorage.getItem(key);
  } catch {
    /* fall through to memory */
  }
  return memory.get(key) ?? null;
}

export function setWebStorageItem(key: string, value: string): void {
  try {
    if (isWebStorageAvailable()) {
      window.localStorage.setItem(key, value);
      return;
    }
  } catch {
    /* fall through to memory */
  }
  memory.set(key, value);
}

export function removeWebStorageItem(key: string): void {
  try {
    if (isWebStorageAvailable()) window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  memory.delete(key);
}

export function createSafeAuthStorage() {
  return {
    getItem: async (key: string) => getWebStorageItem(key),
    setItem: async (key: string, value: string) => {
      setWebStorageItem(key, value);
    },
    removeItem: async (key: string) => {
      removeWebStorageItem(key);
    },
  };
}
