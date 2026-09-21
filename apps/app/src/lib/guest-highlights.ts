import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { GUEST_FEED_LIMIT } from '@comm-platform/coding';

export { GUEST_FEED_LIMIT };

/** Visible time on Highlights before a guest is asked to sign in. */
export const GUEST_HIGHLIGHTS_MS = 2 * 60 * 1000;

const STORAGE_KEY = 'cp-guest-hl';

export type GuestHlState = {
  visibleMs: number;
  lastPostId: string | null;
  gated: boolean;
};

const emptyState = (): GuestHlState => ({ visibleMs: 0, lastPostId: null, gated: false });

let memory = emptyState();

export type GuestFeedCtx = {
  signedIn: boolean;
  requestAuth: (postId?: string) => void;
  noteVisiblePost: (postId: string, index: number, scrolled?: boolean) => void;
};

export const GuestFeedContext = createContext<GuestFeedCtx>({
  signedIn: true,
  requestAuth: () => {},
  noteVisiblePost: () => {},
});

export function useGuestFeed() {
  return useContext(GuestFeedContext);
}

export function highlightsPath(postId?: string | null) {
  if (!postId) return '/highlights';
  return `/highlights?post=${encodeURIComponent(postId)}`;
}

export function safePostId(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return null;
  const id = value.replace(/^#?post-/, '');
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) return null;
  return id;
}

export function readGuestHlState(): GuestHlState {
  if (typeof sessionStorage === 'undefined') return memory;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return memory;
    const parsed = JSON.parse(raw) as Partial<GuestHlState>;
    memory = {
      visibleMs: typeof parsed.visibleMs === 'number' ? parsed.visibleMs : 0,
      lastPostId: typeof parsed.lastPostId === 'string' ? parsed.lastPostId : null,
      gated: Boolean(parsed.gated),
    };
    return memory;
  } catch {
    return memory;
  }
}

export function writeGuestHlState(next: GuestHlState) {
  memory = next;
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function rememberGuestPost(postId: string) {
  const current = readGuestHlState();
  writeGuestHlState({ ...current, lastPostId: postId });
}

export function useGuestFeedController(signedIn: boolean) {
  const [lastPostId, setLastPostId] = useState(readGuestHlState().lastPostId);
  const [gateOpen, setGateOpen] = useState(() => !signedIn && readGuestHlState().gated);
  const [sticky, setSticky] = useState(() => !signedIn && readGuestHlState().gated);
  const lastPostIdRef = useRef(lastPostId);
  lastPostIdRef.current = lastPostId;

  const requestAuth = useCallback(
    (postId?: string) => {
      if (signedIn) return;
      const nextId = postId ?? lastPostIdRef.current;
      if (nextId) {
        setLastPostId(nextId);
        rememberGuestPost(nextId);
      }
      writeGuestHlState({ ...readGuestHlState(), gated: true, lastPostId: nextId ?? null });
      setGateOpen(true);
      setSticky(true);
    },
    [signedIn],
  );
  const requestAuthRef = useRef(requestAuth);
  requestAuthRef.current = requestAuth;

  const noteVisiblePost = useCallback(
    (postId: string, index: number, scrolled = false) => {
      if (signedIn) return;
      setLastPostId(postId);
      rememberGuestPost(postId);
      if (scrolled && index >= GUEST_FEED_LIMIT - 1) requestAuth(postId);
    },
    [requestAuth, signedIn],
  );

  useEffect(() => {
    if (signedIn) {
      setGateOpen(false);
      setSticky(false);
      return;
    }
    let acc = readGuestHlState().visibleMs;
    const tick = setInterval(() => {
      if (AppState.currentState !== 'active') return;
      if (readGuestHlState().gated) return;
      acc += 1000;
      writeGuestHlState({ ...readGuestHlState(), visibleMs: acc, lastPostId: lastPostIdRef.current });
      if (acc >= GUEST_HIGHLIGHTS_MS) requestAuthRef.current(lastPostIdRef.current ?? undefined);
    }, 1000);
    return () => clearInterval(tick);
  }, [signedIn]);

  const contextValue = useMemo(
    () => ({ signedIn, requestAuth, noteVisiblePost }),
    [noteVisiblePost, requestAuth, signedIn],
  );

  return {
    lastPostId,
    gateOpen,
    setGateOpen,
    sticky,
    nextPath: highlightsPath(lastPostId),
    contextValue,
  };
}
