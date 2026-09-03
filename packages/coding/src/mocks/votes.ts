import type { VoteToggleResponse } from '../types';

type VoteKey = `${string}:${number}`;

const votes = new Set<VoteKey>();

function key(userId: string, questionId: number): VoteKey {
  return `${userId}:${questionId}`;
}

export function resetMockVotes() {
  votes.clear();
}

export function hydrateMockVotes(entries: { userId: string; questionId: number }[]) {
  votes.clear();
  for (const entry of entries) votes.add(key(entry.userId, entry.questionId));
}

export function listMockVoteEntries() {
  return [...votes].map((item) => {
    const [userId, questionId] = item.split(':');
    return { userId, questionId: Number(questionId) };
  });
}

export function mockVoteCount(questionId: number) {
  let count = 0;
  for (const item of votes) {
    if (item.endsWith(`:${questionId}`)) count += 1;
  }
  return count;
}

export function mockVotedByMe(userId: string, questionId: number) {
  return votes.has(key(userId, questionId));
}

export function toggleMockVote(userId: string, questionId: number): VoteToggleResponse {
  const k = key(userId, questionId);
  if (votes.has(k)) votes.delete(k);
  else votes.add(k);
  return {
    questionId,
    voteCount: mockVoteCount(questionId),
    votedByMe: votes.has(k),
  };
}
