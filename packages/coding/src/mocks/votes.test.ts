import { describe, expect, it } from 'vitest';

import { hydrateMockVotes, mockVoteCount, mockVotedByMe, resetMockVotes, toggleMockVote } from './votes';

describe('interview votes', () => {
  it('toggles a single vote per user', () => {
    resetMockVotes();
    const first = toggleMockVote('user-a', 1);
    expect(first.votedByMe).toBe(true);
    expect(first.voteCount).toBe(1);
    const second = toggleMockVote('user-a', 1);
    expect(second.votedByMe).toBe(false);
    expect(second.voteCount).toBe(0);
  });

  it('counts distinct users', () => {
    resetMockVotes();
    toggleMockVote('user-a', 2);
    toggleMockVote('user-b', 2);
    expect(mockVoteCount(2)).toBe(2);
    expect(mockVotedByMe('user-a', 2)).toBe(true);
  });

  it('hydrates stored votes', () => {
    resetMockVotes();
    hydrateMockVotes([{ userId: 'user-a', questionId: 3 }]);
    expect(mockVotedByMe('user-a', 3)).toBe(true);
    expect(mockVoteCount(3)).toBe(1);
  });
});
