import { notFound } from 'next/navigation';

import { removeQuestionAction, toggleQuestionPublishedAction } from '../../practice/actions';
import { loadSkillProblems } from '@/lib/coding-admin';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ skillId: string }>; searchParams: Promise<{ level?: string }> };

export default async function SkillProblemsPage({ params, searchParams }: Props) {
  const { skillId } = await params;
  const { level } = await searchParams;
  const data = await loadSkillProblems(skillId, level);
  if (!data) notFound();
  const { skill, questions, levels, stats } = data;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/skills">
        ← Skills
      </a>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">{skill.name} problems</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Add and manage problems for this skill. Disabled problems stay hidden on Practice.
          </p>
        </div>
        <a
          className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm text-white"
          href={`/admin/skills/${skill.id}/questions/new`}
        >
          Add problem
        </a>
      </div>

      <form className="flex flex-wrap items-end gap-3" method="get">
        <label className="grid gap-1 text-sm">
          <span>Filter by level</span>
          <select name="level" defaultValue={level ?? ''} className="rounded-xl border px-3 py-2">
            <option value="">All levels</option>
            {levels.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </select>
        </label>
        <button className="rounded-xl border px-4 py-2 text-sm" type="submit">
          Apply
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Published</th>
              <th className="px-4 py-3 text-left">Solved</th>
              <th className="px-4 py-3 text-left">Attempted</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-[var(--color-text-muted)]" colSpan={6}>
                  No problems in this skill yet.
                </td>
              </tr>
            ) : (
              questions.map((q) => {
                const solve = stats.get(q.id);
                return (
                  <tr key={q.id} className="border-t">
                    <td className="px-4 py-3">
                      <a className="text-[var(--color-primary)]" href={`/admin/skills/${skill.id}/questions/${q.id}`}>
                        {q.title}
                      </a>
                    </td>
                    <td className="px-4 py-3">{levels.find((l) => l.id === q.levelId)?.name ?? q.difficulty}</td>
                    <td className="px-4 py-3">{q.published ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">{solve?.solvedCount ?? 0}</td>
                    <td className="px-4 py-3">{solve?.attemptedCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-3">
                        <a href={`/admin/skills/${skill.id}/questions/${q.id}`}>View / edit</a>
                        <form action={toggleQuestionPublishedAction}>
                          <input type="hidden" name="questionId" value={q.id} />
                          <input type="hidden" name="published" value={q.published ? '0' : '1'} />
                          <button type="submit">{q.published ? 'Disable' : 'Enable'}</button>
                        </form>
                        <form action={removeQuestionAction}>
                          <input type="hidden" name="skillId" value={skill.id} />
                          <input type="hidden" name="setId" value={q.practiceSetId} />
                          <input type="hidden" name="questionId" value={q.id} />
                          <button className="text-[var(--color-danger)]" type="submit">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
