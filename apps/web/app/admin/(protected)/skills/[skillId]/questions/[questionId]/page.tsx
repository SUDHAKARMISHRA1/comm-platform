import { notFound } from 'next/navigation';

import { getQuestionSolveStats } from '@comm-platform/coding/server';

import { loadQuestionForAdmin } from '@/lib/coding-admin';
import { ProblemForm } from '../../../problem-form';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ skillId: string; questionId: string }> };

export default async function SkillQuestionEditPage({ params }: Props) {
  const { skillId, questionId } = await params;
  const data = await loadQuestionForAdmin(skillId, Number(questionId));
  if (!data) notFound();
  const { question: q, skills, levels, topics } = data;
  const stats = (await getQuestionSolveStats([q.id])).get(q.id);
  const solvers = (stats?.solvers ?? []).filter((row) => row.status === 'SOLVED');

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <a className="text-[var(--color-primary)]" href={`/admin/skills/${skillId}`}>
        ← Back to {skills.find((s) => s.id === skillId)?.name ?? 'skill'}
      </a>
      <h1 className="text-2xl font-semibold">Edit: {q.title}</h1>

      <section className="rounded-2xl border p-6">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {stats?.solvedCount ?? 0} solved · {stats?.attemptedCount ?? 0} attempted
        </p>
        {solvers.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">Nobody has solved this problem yet.</p>
        ) : (
          <table className="mt-4 min-w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-text-muted)]">
                <th className="py-2 pr-4">Solver</th>
                <th className="py-2">Solved at</th>
              </tr>
            </thead>
            <tbody>
              {solvers.map((row) => (
                <tr key={row.userId} className="border-t">
                  <td className="py-2 pr-4">
                    {row.displayName}
                    {row.username ? <span className="text-[var(--color-text-muted)]"> · @{row.username}</span> : null}
                  </td>
                  <td className="py-2">{new Date(row.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <ProblemForm
        question={q}
        skillId={skillId}
        skills={skills}
        levels={levels}
        topics={topics}
        submitLabel="Save problem"
      />
    </main>
  );
}
