const memory = new Map<string, string>();

let storageAvailable: boolean | null = null;

/** Chrome can block localStorage (third-party cookies, iframe, privacy settings). */
export function isWebStorageAvailable(): boolean {
  if (storageAvailable !== null) return storageAvailable;
  try {
    if (typeof window === 'undefined') {
      storageAvailable = false;
      return false;
    }
    const testKey = '__comm_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  return storageAvailable;
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
    getItem: (key: string) => getWebStorageItem(key),
    setItem: (key: string, value: string) => setWebStorageItem(key, value),
    removeItem: (key: string) => removeWebStorageItem(key),
  };
}
