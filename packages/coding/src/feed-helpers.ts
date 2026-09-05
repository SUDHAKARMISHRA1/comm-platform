/** Map feed records to student cards / nested comment trees. */
import type {
  FeedCommentLikeRecord,
  FeedCommentRecord,
  FeedLikeRecord,
  FeedPostRecord,
  FeedShareRecord,
} from './schema';
import type { FeedCommentNode, FeedPostAdminRow, FeedPostCard } from './types';
import { blocksFromPost } from './feed-content';

export function visibleComments(comments: FeedCommentRecord[]) {
  return comments.filter((row) => !row.hidden);
}

export function toFeedCard(
  post: FeedPostRecord,
  userId: string,
  likes: FeedLikeRecord[],
  shares: FeedShareRecord[],
  comments: FeedCommentRecord[],
): FeedPostCard {
  const visible = visibleComments(comments);
  return {
    id: post.id,
    kind: post.kind,
    title: post.title,
    body: post.body,
    mediaUrl: post.mediaUrl,
    linkUrl: post.linkUrl,
    authorName: post.authorName,
    createdAt: post.createdAt,
    likeCount: likes.filter((row) => row.postId === post.id).length,
    likedByMe: likes.some((row) => row.postId === post.id && row.userId === userId),
    commentCount: visible.filter((row) => row.postId === post.id).length,
    shareCount: shares.filter((row) => row.postId === post.id).length,
    sharedByMe: shares.some((row) => row.postId === post.id && row.userId === userId),
    blocks: blocksFromPost(post),
  };
}

export function toFeedAdminRow(
  post: FeedPostRecord,
  likes: FeedLikeRecord[],
  shares: FeedShareRecord[],
  comments: FeedCommentRecord[],
): FeedPostAdminRow {
  const forPost = comments.filter((row) => row.postId === post.id);
  const visible = forPost.filter((row) => !row.hidden);
  return {
    id: post.id,
    kind: post.kind,
    title: post.title,
    authorName: post.authorName,
    published: post.published,
    createdAt: post.createdAt,
    likeCount: likes.filter((row) => row.postId === post.id).length,
    shareCount: shares.filter((row) => row.postId === post.id).length,
    commentCount: visible.filter((row) => !row.parentId).length,
    replyCount: visible.filter((row) => Boolean(row.parentId)).length,
  };
}

export function nestComments(
  postId: string,
  userId: string,
  comments: FeedCommentRecord[],
  likes: FeedCommentLikeRecord[],
  options?: { includeHidden?: boolean },
): FeedCommentNode[] {
  const forPost = comments.filter((row) => row.postId === postId);
  const rows = options?.includeHidden ? forPost : forPost.filter((row) => !row.hidden);
  const toNode = (row: FeedCommentRecord, replies: FeedCommentNode[]): FeedCommentNode => ({
    id: row.id,
    postId: row.postId,
    parentId: row.parentId,
    authorName: row.authorName,
    body: row.body,
    createdAt: row.createdAt,
    likeCount: likes.filter((like) => like.commentId === row.id).length,
    likedByMe: likes.some((like) => like.commentId === row.id && like.userId === userId),
    hidden: Boolean(row.hidden),
    replies,
  });
  return rows
    .filter((row) => !row.parentId)
    .map((root) =>
      toNode(
        root,
        rows.filter((row) => row.parentId === root.id).map((row) => toNode(row, [])),
      ),
    );
}
