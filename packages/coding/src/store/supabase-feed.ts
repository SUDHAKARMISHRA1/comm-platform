import { isSupabasePersistenceEnabled } from './supabase-user-data';

type LikeRow = { user_id: string; post_id: string; created_at: string };
type ShareRow = { user_id: string; post_id: string; created_at: string };
type CommentRow = {
  id: string;
  post_id: string;
  parent_id: string | null;
  user_id: string;
  author_name: string;
  body: string;
  created_at: string;
};
type CommentLikeRow = { user_id: string; comment_id: string; created_at: string };

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

export async function feedTablesReady() {
  if (!isSupabasePersistenceEnabled()) return false;
  try {
    await rest('highlight_post_likes?select=post_id&limit=1');
    return true;
  } catch (error) {
    if (isMissingTable(error)) return false;
    throw error;
  }
}

export async function listFeedLikes() {
  const rows = await rest<LikeRow[]>('highlight_post_likes?select=user_id,post_id,created_at');
  return (rows ?? []).map((row) => ({ userId: row.user_id, postId: row.post_id, createdAt: row.created_at }));
}

export async function listFeedShares() {
  const rows = await rest<ShareRow[]>('highlight_post_shares?select=user_id,post_id,created_at');
  return (rows ?? []).map((row) => ({ userId: row.user_id, postId: row.post_id, createdAt: row.created_at }));
}

export async function listFeedComments() {
  const rows = await rest<CommentRow[]>(
    'highlight_comments?select=id,post_id,parent_id,user_id,author_name,body,created_at&order=created_at.asc',
  );
  return (rows ?? []).map((row) => ({
    id: row.id,
    postId: row.post_id,
    parentId: row.parent_id,
    userId: row.user_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
  }));
}

export async function listFeedCommentLikes() {
  const rows = await rest<CommentLikeRow[]>('highlight_comment_likes?select=user_id,comment_id,created_at');
  return (rows ?? []).map((row) => ({
    userId: row.user_id,
    commentId: row.comment_id,
    createdAt: row.created_at,
  }));
}

export async function insertFeedLike(userId: string, postId: string, createdAt: string) {
  await rest('highlight_post_likes', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ user_id: userId, post_id: postId, created_at: createdAt }),
  });
}

export async function deleteFeedLike(userId: string, postId: string) {
  await rest(
    `highlight_post_likes?user_id=eq.${encodeURIComponent(userId)}&post_id=eq.${encodeURIComponent(postId)}`,
    { method: 'DELETE', headers: { Prefer: 'return=minimal' } },
  );
}

export async function insertFeedShare(userId: string, postId: string, createdAt: string) {
  await rest('highlight_post_shares?on_conflict=user_id,post_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: userId, post_id: postId, created_at: createdAt }),
  });
}

export async function insertFeedComment(row: {
  id: string;
  postId: string;
  parentId: string | null;
  userId: string;
  authorName: string;
  body: string;
  createdAt: string;
}) {
  await rest('highlight_comments', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      id: row.id,
      post_id: row.postId,
      parent_id: row.parentId,
      user_id: row.userId,
      author_name: row.authorName,
      body: row.body,
      created_at: row.createdAt,
    }),
  });
}

export async function insertFeedCommentLike(userId: string, commentId: string, createdAt: string) {
  await rest('highlight_comment_likes', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ user_id: userId, comment_id: commentId, created_at: createdAt }),
  });
}

export async function deleteFeedCommentLike(userId: string, commentId: string) {
  await rest(
    `highlight_comment_likes?user_id=eq.${encodeURIComponent(userId)}&comment_id=eq.${encodeURIComponent(commentId)}`,
    { method: 'DELETE', headers: { Prefer: 'return=minimal' } },
  );
}
