import type {
  FeedCommentLikeRecord,
  FeedCommentRecord,
  FeedLikeRecord,
  FeedPostRecord,
  FeedShareRecord,
} from './schema';
import type { FeedCommentNode, FeedPostCard } from './types';

export function toFeedCard(
  post: FeedPostRecord,
  userId: string,
  likes: FeedLikeRecord[],
  shares: FeedShareRecord[],
  comments: FeedCommentRecord[],
): FeedPostCard {
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
    commentCount: comments.filter((row) => row.postId === post.id).length,
    shareCount: shares.filter((row) => row.postId === post.id).length,
    sharedByMe: shares.some((row) => row.postId === post.id && row.userId === userId),
  };
}

export function nestComments(
  postId: string,
  userId: string,
  comments: FeedCommentRecord[],
  likes: FeedCommentLikeRecord[],
): FeedCommentNode[] {
  const forPost = comments.filter((row) => row.postId === postId);
  const toNode = (row: FeedCommentRecord, replies: FeedCommentNode[]): FeedCommentNode => ({
    id: row.id,
    postId: row.postId,
    parentId: row.parentId,
    authorName: row.authorName,
    body: row.body,
    createdAt: row.createdAt,
    likeCount: likes.filter((like) => like.commentId === row.id).length,
    likedByMe: likes.some((like) => like.commentId === row.id && like.userId === userId),
    replies,
  });
  return forPost
    .filter((row) => !row.parentId)
    .map((root) =>
      toNode(
        root,
        forPost.filter((row) => row.parentId === root.id).map((row) => toNode(row, [])),
      ),
    );
}
