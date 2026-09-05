import { describe, expect, it } from 'vitest';

import { listMockQuestions, mockRunCode, mockSubmitCode } from '../index';

describe('mock questions', () => {
  it('loads questions', () => {
    const { questions, pagination } = listMockQuestions({});
    expect(questions.length).toBeGreaterThan(0);
    expect(pagination.total).toBe(6);
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
    expect(page1.pagination.total).toBe(6);
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

describe('piston mapping', () => {
  it('maps compile errors', async () => {
    const { mapPistonResult } = await import('../execution');
    const result = mapPistonResult({
      compile: { code: 1, stderr: 'error: expected ;' },
    });
    expect(result.status).toBe('COMPILATION_ERROR');
    expect(result.compileOutput).toContain('expected');
  });

  it('maps successful run', async () => {
    const { mapPistonResult } = await import('../execution');
    const result = mapPistonResult({
      compile: { code: 0, stdout: '' },
      run: { code: 0, stdout: '15\n', stderr: '' },
    });
    expect(result.status).toBe('ACCEPTED');
    expect(result.stdout).toContain('15');
  });
});

describe('local java execution', () => {
  it('compiles and runs java', async () => {
    const { executeLocally } = await import('../local-execute');
    const result = await executeLocally(
      'java',
      'public class Main { public static void main(String[] args) { System.out.println(15); } }',
      '',
    );
    expect(result.status).toBe('ACCEPTED');
    expect(result.stdout.trim()).toBe('15');
  }, 15_000);

  it('reports compile errors', async () => {
    const { executeLocally } = await import('../local-execute');
    const result = await executeLocally('java', 'public class Main {', '');
    expect(result.status).toBe('COMPILATION_ERROR');
    expect(result.compileOutput.length).toBeGreaterThan(0);
  }, 15_000);

  it('uses custom stdin', async () => {
    const { executeLocally } = await import('../local-execute');
    const src = `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.hasNextLine() ? sc.nextLine() : "";
        System.out.println(new StringBuilder(s).reverse());
    }
}`;
    const result = await executeLocally('java', src, 'hello');
    expect(result.status).toBe('ACCEPTED');
    expect(result.stdout.trim()).toBe('olleh');
  }, 15_000);
});
