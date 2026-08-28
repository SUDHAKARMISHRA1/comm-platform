import { describe, expect, it } from 'vitest';

import { listMockQuestions, mockRunCode, mockSubmitCode } from '../index';

describe('mock questions', () => {
  it('loads questions', () => {
    const { questions, pagination } = listMockQuestions({});
    expect(questions.length).toBeGreaterThan(0);
    expect(pagination.total).toBe(5);
  });

  it('filters by search', () => {
    const { questions } = listMockQuestions({ q: 'two sum' });
    expect(questions).toHaveLength(1);
    expect(questions[0]?.title).toBe('Two Sum');
  });

  it('filters by difficulty', () => {
    const { questions } = listMockQuestions({ difficulty: 'MEDIUM' });
    expect(questions.every((q) => q.difficulty === 'MEDIUM')).toBe(true);
  });

  it('filters by status', () => {
    const { questions } = listMockQuestions({ status: 'SOLVED' });
    expect(questions.every((q) => q.status === 'SOLVED')).toBe(true);
  });

  it('paginates', () => {
    const page1 = listMockQuestions({ page: 1, pageSize: 2 });
    expect(page1.questions).toHaveLength(2);
    expect(page1.pagination.total).toBe(5);
  });
});

describe('mock execution', () => {
  it('runs code', () => {
    const result = mockRunCode('code', '5\n1 2 3 4 5');
    expect(result.status).toBe('ACCEPTED');
    expect(result.stdout).toBe('15');
  });

  it('shows compilation error marker', () => {
    const result = mockRunCode('COMPILE_ERROR', '');
    expect(result.status).toBe('COMPILATION_ERROR');
  });

  it('submits code', () => {
    const result = mockSubmitCode(1, 'public class Main { void x() {} }');
    expect(result.totalTestCases).toBeGreaterThan(0);
  });
});
