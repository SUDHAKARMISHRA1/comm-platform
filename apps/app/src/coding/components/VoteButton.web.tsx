import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toggleQuestionVote } from '@/coding/api/questionApi';

export const VOTE_HELP =
  'Saw this in a recent interview? Vote to flag it for everyone. Interview picks are ranked by these votes so the community can practice what companies are actually asking. One vote per person — click again to remove yours.';

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
    <button
      type="button"
      className={`cp-vote ${votedByMe ? 'cp-vote-on' : ''}`}
      aria-pressed={votedByMe}
      aria-label={votedByMe ? 'Remove interview vote' : 'Vote that this appeared in an interview'}
      disabled={mutation.isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutation.mutate();
      }}
    >
      <style>{voteCss}</style>
      <span className="cp-vote-icon" aria-hidden>
        ▲
      </span>
      <span className="cp-vote-count">{voteCount}</span>
      <span className="cp-vote-tip" role="tooltip">
        {VOTE_HELP}
      </span>
    </button>
  );
}

const voteCss = `
.cp-vote {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: .28rem;
  height: 32px;
  padding: 0 .55rem;
  border: 1px solid #e5e7eb;
  border-radius: .45rem;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  flex-shrink: 0;
  font: inherit;
  transition: border-color .12s, background .12s, color .12s;
}
.cp-vote:hover { border-color: #c7d2fe; background: #eef2ff; color: #4f46e5; }
.cp-vote-on { border-color: #6366f1; background: #eef2ff; color: #4f46e5; }
.cp-vote-icon { font-size: .7rem; font-weight: 800; line-height: 1; }
.cp-vote-count { font-size: .78rem; font-weight: 700; }
.cp-vote-tip {
  display: none;
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  width: min(280px, 70vw);
  padding: .65rem .75rem;
  background: #1e293b;
  color: #f8fafc;
  font-size: .75rem;
  font-weight: 500;
  line-height: 1.45;
  border-radius: .5rem;
  box-shadow: 0 10px 20px rgb(0 0 0 / .18);
  z-index: 40;
  text-align: left;
  pointer-events: none;
}
.cp-vote:hover .cp-vote-tip,
.cp-vote:focus-visible .cp-vote-tip { display: block; }
.cp-vote:disabled { opacity: .6; cursor: wait; }
`;
