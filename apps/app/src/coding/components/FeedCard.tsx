import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, radius, space, type } from '@comm-platform/ui';
import type { FeedCommentNode, FeedPostCard } from '@comm-platform/coding';

import {
  addFeedCommentApi,
  fetchFeedComments,
  likeFeedComment,
  likeFeedPost,
  shareFeedPostApi,
} from '@/coding/api/feedApi';
import { formatCount, initials, timeAgo } from '@/coding/feedFormat';

const PREVIEW = 180;

export function FeedCard({ post }: { post: FeedPostCard }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [draft, setDraft] = useState('');

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
      await Share.share({ message: `${post.title}\n\n${post.body.slice(0, 180)}`, title: post.title });
      return shareFeedPostApi(post.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['highlights-feed'] }),
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
    mutationFn: (id: string) => likeFeedComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed-comments', post.id] }),
  });

  const long = post.body.length > PREVIEW;
  const body = !expanded && long ? `${post.body.slice(0, PREVIEW).trim()}…` : post.body;
  const image = post.mediaUrl && !post.mediaUrl.includes('youtube') && !post.mediaUrl.includes('youtu.be') ? post.mediaUrl : '';

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(post.authorName)}</Text>
        </View>
        <View>
          <Text style={styles.author}>{post.authorName}</Text>
          <Text style={styles.muted}>
            {post.kind} · {timeAgo(post.createdAt)}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{body}</Text>
      {long ? (
        <Pressable onPress={() => setExpanded((value) => !value)}>
          <Text style={styles.link}>{expanded ? 'Show less' : 'see more'}</Text>
        </Pressable>
      ) : null}
      {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
      {post.linkUrl ? (
        <Pressable onPress={() => void Linking.openURL(post.linkUrl)}>
          <Text style={styles.link}>{post.linkUrl}</Text>
        </Pressable>
      ) : null}
      <Text style={styles.stats}>
        {formatCount(post.likeCount)} likes · {formatCount(post.commentCount)} comments · {formatCount(post.shareCount)} shares
      </Text>
      <View style={styles.actions}>
        <Pressable onPress={() => likePost.mutate()}>
          <Text style={[styles.action, post.likedByMe && styles.on]}>{post.likedByMe ? 'Liked' : 'Like'}</Text>
        </Pressable>
        <Pressable onPress={() => setShowComments(true)}>
          <Text style={styles.action}>Comment</Text>
        </Pressable>
        <Pressable onPress={() => sharePost.mutate()}>
          <Text style={styles.action}>Share</Text>
        </Pressable>
      </View>
      {showComments ? (
        <View style={styles.thread}>
          {(commentsQuery.data ?? []).map((comment) => (
            <NativeComment
              key={comment.id}
              comment={comment}
              onLike={(id) => likeComment.mutate(id)}
              onReply={(id, name) => setReplyTo({ id, name })}
            />
          ))}
          {replyTo ? <Text style={styles.muted}>Replying to {replyTo.name}</Text> : null}
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={replyTo ? 'Write a reply…' : 'Add a comment…'}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <Pressable
            style={styles.postBtn}
            onPress={() => {
              if (draft.trim()) addComment.mutate();
            }}
          >
            <Text style={styles.postBtnText}>Post</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function NativeComment({
  comment,
  onLike,
  onReply,
}: {
  comment: FeedCommentNode;
  onLike: (id: string) => void;
  onReply: (id: string, name: string) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <View style={styles.comment}>
        <Text style={styles.author}>{comment.authorName}</Text>
        <Text style={styles.body}>{comment.body}</Text>
        <View style={styles.actions}>
          <Pressable onPress={() => onLike(comment.id)}>
            <Text style={[styles.action, comment.likedByMe && styles.on]}>Like{comment.likeCount ? ` · ${comment.likeCount}` : ''}</Text>
          </Pressable>
          <Pressable onPress={() => onReply(comment.id, comment.authorName)}>
            <Text style={styles.action}>Reply</Text>
          </Pressable>
        </View>
      </View>
      {comment.replies.map((reply) => (
        <View key={reply.id} style={[styles.comment, { marginLeft: 16 }]}>
          <Text style={styles.author}>{reply.authorName}</Text>
          <Text style={styles.body}>{reply.body}</Text>
          <View style={styles.actions}>
            <Pressable onPress={() => onLike(reply.id)}>
              <Text style={[styles.action, reply.likedByMe && styles.on]}>Like{reply.likeCount ? ` · ${reply.likeCount}` : ''}</Text>
            </Pressable>
            <Pressable onPress={() => onReply(comment.id, reply.authorName)}>
              <Text style={styles.action}>Reply</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: space.md, gap: 8 },
  head: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#4f46e5', fontWeight: '800' },
  author: { color: colors.text, fontWeight: '700' },
  muted: { color: colors.textMuted, fontSize: type.small },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  body: { color: '#374151', lineHeight: 22 },
  link: { color: '#4f46e5', fontWeight: '700' },
  image: { width: '100%', height: 180, borderRadius: radius.md, backgroundColor: '#f3f4f6' },
  stats: { color: colors.textMuted, fontSize: type.small },
  actions: { flexDirection: 'row', gap: 16, paddingTop: 4 },
  action: { color: '#4b5563', fontWeight: '700' },
  on: { color: '#4f46e5' },
  thread: { gap: 10, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 },
  comment: { backgroundColor: '#f3f4f6', borderRadius: radius.md, padding: space.sm, gap: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, color: colors.text },
  postBtn: { alignSelf: 'flex-end', backgroundColor: '#6366f1', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  postBtnText: { color: '#fff', fontWeight: '700' },
});
