import { describe, expect, it } from 'vitest';

import { nestComments, toFeedCard } from '../feed-helpers';
import type { FeedCommentRecord, FeedPostRecord } from '../schema';

const post: FeedPostRecord = {
  id: 'feed-1',
  kind: 'article',
  title: 'Hello',
  body: 'Body',
  mediaUrl: '',
  linkUrl: '',
  authorName: 'Admin',
  published: true,
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
};

describe('highlight feed helpers', () => {
  it('counts likes and comments on a card', () => {
    const card = toFeedCard(
      post,
      'u1',
      [
        { userId: 'u1', postId: 'feed-1', createdAt: post.createdAt },
        { userId: 'u2', postId: 'feed-1', createdAt: post.createdAt },
      ],
      [{ userId: 'u2', postId: 'feed-1', createdAt: post.createdAt }],
      [{ id: 'c1', postId: 'feed-1', parentId: null, userId: 'u2', authorName: 'Ada', body: 'Nice', createdAt: post.createdAt }],
    );
    expect(card.likeCount).toBe(2);
    expect(card.likedByMe).toBe(true);
    expect(card.commentCount).toBe(1);
    expect(card.shareCount).toBe(1);
  });

  it('nests replies under the root comment', () => {
    const comments: FeedCommentRecord[] = [
      { id: 'c1', postId: 'feed-1', parentId: null, userId: 'u1', authorName: 'Ada', body: 'Root', createdAt: post.createdAt },
      { id: 'c2', postId: 'feed-1', parentId: 'c1', userId: 'u2', authorName: 'Lin', body: 'Reply', createdAt: post.createdAt },
    ];
    const tree = nestComments('feed-1', 'u2', comments, [
      { userId: 'u2', commentId: 'c1', createdAt: post.createdAt },
    ]);
    expect(tree).toHaveLength(1);
    expect(tree[0]?.replies).toHaveLength(1);
    expect(tree[0]?.likedByMe).toBe(true);
    expect(tree[0]?.replies[0]?.body).toBe('Reply');
  });
});
