import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import type { FeedCommentNode, FeedContentBlock, FeedPostCard } from '@comm-platform/coding';

import {
  addFeedCommentApi,
  fetchFeedComments,
  likeFeedComment,
  likeFeedPost,
  shareFeedPostApi,
} from '@/coding/api/feedApi';
import { formatCount, initials, timeAgo, youtubeId } from '@/coding/feedFormat';
import { useAuth } from '@/providers/auth-provider';

const PREVIEW = 220;

function ThumbIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3Zm0 0 4.2-7.2A1.8 1.8 0 0 1 14.7 5v4H20a2 2 0 0 1 1.9 2.5l-1.4 6A2 2 0 0 1 18.6 20H7"
      />
    </svg>
  );
}

export function FeedCard({ post }: { post: FeedPostCard }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const myName = user?.email?.split('@')[0] ?? 'You';
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [draft, setDraft] = useState('');
  const [shareNote, setShareNote] = useState('');

  const commentsQuery = useQuery({
    queryKey: ['feed-comments', post.id],
    queryFn: () => fetchFeedComments(post.id),
    enabled: showComments,
  });

  const likePost = useMutation({
    mutationFn: () => likeFeedPost(post.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['highlights-feed'] }),
  });

  const sharePost = useMutation({
    mutationFn: async () => {
      const url = `${window.location.origin}/highlights#post-${post.id}`;
      try {
        if (navigator.share) await navigator.share({ title: post.title, url });
        else await navigator.clipboard.writeText(url);
      } catch {
        await navigator.clipboard.writeText(url);
      }
      return shareFeedPostApi(post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights-feed'] });
      setShareNote('Link copied');
      window.setTimeout(() => setShareNote(''), 2000);
    },
  });

  const addComment = useMutation({
    mutationFn: () => addFeedCommentApi(post.id, draft, replyTo?.id),
    onSuccess: (comments) => {
      setDraft('');
      setReplyTo(null);
      queryClient.setQueryData(['feed-comments', post.id], comments);
      queryClient.invalidateQueries({ queryKey: ['highlights-feed'] });
    },
  });

  const likeComment = useMutation({
    mutationFn: (commentId: string) => likeFeedComment(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed-comments', post.id] }),
  });

  const blocks = post.blocks?.length ? post.blocks : [];

  return (
    <article className="lf-card" id={`post-${post.id}`}>
      <header className="lf-head">
        <span className="lf-avatar" aria-hidden>
          {initials(post.authorName)}
        </span>
        <div className="lf-meta">
          <strong>{post.authorName}</strong>
          <span>Interview prep team</span>
          <span>
            {timeAgo(post.createdAt)} · {post.kind}
          </span>
        </div>
      </header>
      <h3>{post.title}</h3>
      <FeedBody blocks={blocks} fallback={post.body} expanded={expanded} onToggle={() => setExpanded((value) => !value)} />
      {post.linkUrl && !youtubeId(post.linkUrl) ? (
        <a className="lf-link" href={post.linkUrl} target="_blank" rel="noreferrer">
          <span>Open resource</span>
          <em>{post.linkUrl.replace(/^https?:\/\//, '')}</em>
        </a>
      ) : null}
      <p className="lf-stats">
        <span>{post.likeCount > 0 ? `👍 ${formatCount(post.likeCount)}` : 'Be the first to like'}</span>
        <button type="button" onClick={() => setShowComments(true)}>
          {formatCount(post.commentCount)} comments
        </button>
        <span>{formatCount(post.shareCount)} shares</span>
      </p>
      <div className="lf-actions">
        <button type="button" className={post.likedByMe ? 'on' : ''} onClick={() => likePost.mutate()} disabled={likePost.isPending}>
          <ThumbIcon filled={post.likedByMe} />
          {post.likedByMe ? 'Liked' : 'Like'}
        </button>
        <button type="button" onClick={() => setShowComments(true)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-5 4v-4H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
            />
          </svg>
          Comment
        </button>
        <button type="button" onClick={() => sharePost.mutate()} disabled={sharePost.isPending}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path fill="none" stroke="currentColor" strokeWidth="1.8" d="M15 8h4v12H5V8h4M12 16V3m0 0 3.5 3.5M12 3 8.5 6.5" />
          </svg>
          {shareNote || 'Share'}
        </button>
      </div>
      {showComments ? (
        <div className="lf-thread">
          {commentsQuery.isLoading ? <p className="lf-empty">Loading comments…</p> : null}
          {(commentsQuery.data ?? []).map((comment) => (
            <CommentBlock
              key={comment.id}
              comment={comment}
              onLike={(id) => likeComment.mutate(id)}
              onReply={(id, name) => {
                setReplyTo({ id, name });
                setShowComments(true);
              }}
            />
          ))}
          {(commentsQuery.data ?? []).length === 0 && !commentsQuery.isLoading ? (
            <p className="lf-empty">Be the first to comment.</p>
          ) : null}
          <form
            className="lf-composer"
            onSubmit={(event) => {
              event.preventDefault();
              if (draft.trim()) addComment.mutate();
            }}
          >
            {replyTo ? (
              <p className="lf-replying">
                Replying to {replyTo.name}
                <button type="button" onClick={() => setReplyTo(null)}>
                  Cancel
                </button>
              </p>
            ) : null}
            <div className="lf-composer-row">
              <span className="lf-avatar sm" aria-hidden>
                {initials(myName)}
              </span>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={replyTo ? 'Write a reply…' : 'Add a comment…'}
              />
              <button type="submit" disabled={addComment.isPending || !draft.trim()}>
                Post
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </article>
  );
}

function FeedBody({
  blocks,
  fallback,
  expanded,
  onToggle,
}: {
  blocks: FeedContentBlock[];
  fallback: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const items = blocks.length
    ? blocks
    : fallback
      ? [{ id: 'text', kind: 'text' as const, text: fallback }]
      : [];
  return (
    <>
      {items.map((block) => {
        if (block.kind === 'text') {
          const source = block.text ?? '';
          const clip = !expanded && source.length > PREVIEW;
          const text = clip ? `${source.slice(0, PREVIEW).trim()}…` : source;
          if (!text.trim()) return null;
          const showToggle = source.length > PREVIEW;
          return (
            <p className="lf-body" key={block.id}>
              {text}
              {showToggle ? (
                <button type="button" className="lf-more" onClick={onToggle}>
                  {expanded ? 'Show less' : 'see more'}
                </button>
              ) : null}
            </p>
          );
        }
        if (block.kind === 'image' && block.url) {
          return (
            <figure className="lf-media" key={block.id}>
              <img src={block.url} alt={block.caption || ''} />
              {block.caption ? <figcaption className="lf-caption">{block.caption}</figcaption> : null}
            </figure>
          );
        }
        if (block.kind === 'video' && block.url) {
          const video = youtubeId(block.url);
          return (
            <div className="lf-media" key={block.id}>
              {video ? (
                <iframe
                  title={block.caption || 'Video'}
                  src={`https://www.youtube.com/embed/${video}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={block.url} controls />
              )}
            </div>
          );
        }
        if (block.kind === 'slideshow') {
          const urls = (block.urls ?? []).map((url) => url.trim()).filter(Boolean);
          if (!urls.length && block.url) urls.push(block.url);
          if (!urls.length) return null;
          return <Slideshow key={block.id} urls={urls} caption={block.caption} />;
        }
        return null;
      })}
    </>
  );
}

function Slideshow({ urls, caption }: { urls: string[]; caption?: string }) {
  const [index, setIndex] = useState(0);
  const current = urls[index] ?? urls[0];
  return (
    <figure className="lf-media lf-slides">
      <img src={current} alt={caption || ''} />
      {urls.length > 1 ? (
        <div className="lf-slide-nav">
          <button type="button" onClick={() => setIndex((value) => (value === 0 ? urls.length - 1 : value - 1))}>
            Prev
          </button>
          <span>
            {index + 1}/{urls.length}
          </span>
          <button type="button" onClick={() => setIndex((value) => (value === urls.length - 1 ? 0 : value + 1))}>
            Next
          </button>
        </div>
      ) : null}
      {caption ? <figcaption className="lf-caption">{caption}</figcaption> : null}
    </figure>
  );
}

function CommentBlock({
  comment,
  onLike,
  onReply,
}: {
  comment: FeedCommentNode;
  onLike: (id: string) => void;
  onReply: (id: string, name: string) => void;
}) {
  return (
    <div className="lf-comment">
      <span className="lf-avatar sm" aria-hidden>
        {initials(comment.authorName)}
      </span>
      <div className="lf-bubble">
        <strong>{comment.authorName}</strong>
        <span className="lf-time">{timeAgo(comment.createdAt)}</span>
        <p>{comment.body}</p>
        <div className="lf-comment-actions">
          <button type="button" className={comment.likedByMe ? 'on' : ''} onClick={() => onLike(comment.id)}>
            Like{comment.likeCount ? ` · ${comment.likeCount}` : ''}
          </button>
          <button type="button" onClick={() => onReply(comment.id, comment.authorName)}>
            Reply
          </button>
        </div>
        {comment.replies.map((reply) => (
          <div className="lf-comment nested" key={reply.id}>
            <span className="lf-avatar sm" aria-hidden>
              {initials(reply.authorName)}
            </span>
            <div className="lf-bubble">
              <strong>{reply.authorName}</strong>
              <span className="lf-time">{timeAgo(reply.createdAt)}</span>
              <p>{reply.body}</p>
              <div className="lf-comment-actions">
                <button type="button" className={reply.likedByMe ? 'on' : ''} onClick={() => onLike(reply.id)}>
                  Like{reply.likeCount ? ` · ${reply.likeCount}` : ''}
                </button>
                <button type="button" onClick={() => onReply(comment.id, reply.authorName)}>
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
