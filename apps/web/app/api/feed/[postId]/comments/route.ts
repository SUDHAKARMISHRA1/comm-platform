import { NextResponse, type NextRequest } from 'next/server';

import { addFeedComment, listPostComments } from '@comm-platform/coding/server';

import { apiDisplayName, requireApiUser } from '@/lib/api-auth';

type Params = { params: Promise<{ postId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  const { postId } = await params;
  try {
    return NextResponse.json({ comments: await listPostComments(auth.user.id, postId) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not load comments';
    return NextResponse.json({ error: message }, { status: message === 'Post not found' ? 404 : 400 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  const { postId } = await params;
  const body = (await request.json().catch(() => null)) as { body?: string; parentId?: string | null } | null;
  try {
    const comments = await addFeedComment(
      auth.user.id,
      postId,
      String(body?.body ?? ''),
      apiDisplayName(auth.user),
      body?.parentId,
    );
    return NextResponse.json({ comments });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not add comment';
    const status = message === 'Post not found' || message === 'Comment not found' ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
