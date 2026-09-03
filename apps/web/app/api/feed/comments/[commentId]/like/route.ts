import { NextResponse, type NextRequest } from 'next/server';

import { toggleFeedCommentLike } from '@comm-platform/coding/server';

import { requireApiUser } from '@/lib/api-auth';

type Params = { params: Promise<{ commentId: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireApiUser(request);
  if ('error' in auth) return auth.error;
  const { commentId } = await params;
  try {
    return NextResponse.json(await toggleFeedCommentLike(auth.user.id, commentId));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not update like';
    return NextResponse.json({ error: message }, { status: message === 'Comment not found' ? 404 : 400 });
  }
}
