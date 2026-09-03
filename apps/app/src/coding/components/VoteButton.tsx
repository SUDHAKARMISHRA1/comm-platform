import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, space } from '@comm-platform/ui';

import { toggleQuestionVote } from '@/coding/api/questionApi';

export const VOTE_HELP =
  'Saw this in a recent interview? Vote to flag it for everyone. Interview picks are ranked by these votes so the community can practice what companies are actually asking. One vote per person — tap again to remove yours.';

export function VoteButton({
  questionId,
  voteCount,
  votedByMe,
}: {
  questionId: number;
  voteCount: number;
  votedByMe: boolean;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => toggleQuestionVote(questionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['questions'] });
      void queryClient.invalidateQueries({ queryKey: ['question'] });
      void queryClient.invalidateQueries({ queryKey: ['voted-questions'] });
    },
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={votedByMe ? 'Remove interview vote' : 'Vote that this appeared in an interview'}
      accessibilityHint={VOTE_HELP}
      disabled={mutation.isPending}
      onPress={(e) => {
        e.stopPropagation?.();
        mutation.mutate();
      }}
      style={[styles.btn, votedByMe && styles.btnOn]}
    >
      <Text style={[styles.icon, votedByMe && styles.iconOn]}>▲</Text>
      <Text style={[styles.count, votedByMe && styles.iconOn]}>{voteCount}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    minHeight: 32,
  },
  btnOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  icon: { fontSize: 11, color: colors.textMuted, fontWeight: '800' },
  iconOn: { color: colors.primary },
  count: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
});
