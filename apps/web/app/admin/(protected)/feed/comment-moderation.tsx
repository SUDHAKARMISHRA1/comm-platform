'use client';

import { hideFeedCommentAction } from '../catalog-actions';

type AdminComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  likeCount: number;
  hidden?: boolean;
  replies: AdminComment[];
};

export function FeedCommentModeration({ postId, comments }: { postId: string; comments: AdminComment[] }) {
  if (!comments.length) {
    return <p className="text-sm text-[var(--color-text-muted)]">No comments yet.</p>;
  }
  return (
    <div className="grid gap-3">
      {comments.map((comment) => (
        <CommentRow key={comment.id} postId={postId} comment={comment} />
      ))}
    </div>
  );
}

function CommentRow({ postId, comment, nested = false }: { postId: string; comment: AdminComment; nested?: boolean }) {
  return (
    <article className={`rounded-xl border p-4 ${comment.hidden ? 'opacity-60' : ''} ${nested ? 'ml-6' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            {comment.authorName}
            {nested ? <span className="ml-2 text-xs font-medium text-[var(--color-text-muted)]">reply</span> : null}
            {comment.hidden ? <span className="ml-2 text-xs font-medium text-[var(--color-danger)]">hidden</span> : null}
          </p>
          <p className="mt-1 text-sm">{comment.body}</p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {comment.likeCount} like{comment.likeCount === 1 ? '' : 's'} · {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>
        <form action={hideFeedCommentAction}>
          <input type="hidden" name="postId" value={postId} />
          <input type="hidden" name="commentId" value={comment.id} />
          <input type="hidden" name="hidden" value={comment.hidden ? '0' : '1'} />
          <button className="rounded-lg border px-3 py-1 text-sm" type="submit">
            {comment.hidden ? 'Show on Highlights' : 'Hide from Highlights'}
          </button>
        </form>
      </div>
      {comment.replies.map((reply) => (
        <div key={reply.id} className="mt-3">
          <CommentRow postId={postId} comment={reply} nested />
        </div>
      ))}
    </article>
  );
}
