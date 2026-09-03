import { notFound } from 'next/navigation';

import { LANGUAGES } from '@comm-platform/coding';

import { moveQuestionDown, moveQuestionUp, removeQuestionAction, upsertQuestion } from '../actions';
import { loadPracticeSetWithQuestions } from '@/lib/coding-admin';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ setId: string }> };

export default async function AdminPracticeSetPage({ params }: Props) {
  const { setId } = await params;
  const data = await loadPracticeSetWithQuestions(setId);
  if (!data) notFound();
  const { set, questions, skills, levels, topics } = data;
  const nextSeq = questions.length + 1;
  const defaultTemplates = JSON.stringify(
    Object.fromEntries(set.languages.map((l) => [l, LANGUAGES[l].template])),
    null,
    2,
  );
  const canCreateProblem = skills.length > 0 && levels.length > 0;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/practice">
        ← Practice sets
      </a>
      <h1 className="text-3xl font-semibold">{set.title}</h1>
      <p className="text-[var(--color-text-muted)]">{set.description}</p>

      {!canCreateProblem ? (
        <p className="rounded-xl border border-[var(--color-warning, #ca8a04)] p-4 text-sm">
          Create at least one{' '}
          <a className="text-[var(--color-primary)]" href="/admin/skills/new">
            skill
          </a>{' '}
          and one{' '}
          <a className="text-[var(--color-primary)]" href="/admin/levels/new">
            level
          </a>{' '}
          before adding a problem. Skills and levels can be created independently.
        </p>
      ) : (
        <form action={upsertQuestion} className="grid gap-3 rounded-2xl border bg-[var(--color-surface)] p-6">
          <h2 className="font-semibold">Add question</h2>
          <input type="hidden" name="practiceSetId" value={setId} />
          <input name="title" placeholder="Title" required className="rounded-xl border px-3 py-2" />
          <select name="skillId" required className="rounded-xl border px-3 py-2" defaultValue={skills[0]?.id}>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select name="levelId" required className="rounded-xl border px-3 py-2" defaultValue={levels[0]?.id}>
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.band})
              </option>
            ))}
          </select>
          <textarea name="description" placeholder="Description (markdown)" className="min-h-24 rounded-xl border px-3 py-2" />
          <textarea name="inputFormat" placeholder="Input format" className="rounded-xl border px-3 py-2" />
          <textarea name="outputFormat" placeholder="Output format" className="rounded-xl border px-3 py-2" />
          <textarea name="constraints" placeholder="Constraints" className="rounded-xl border px-3 py-2" />
          <input
            name="topics"
            placeholder="Topics (comma-separated)"
            defaultValue={topics.map((t) => t.name).join(', ')}
            className="rounded-xl border px-3 py-2"
          />
          <input name="supportedLanguages" defaultValue={set.languages.join(',')} className="rounded-xl border px-3 py-2" />
          <input name="sequence" type="number" defaultValue={nextSeq} className="rounded-xl border px-3 py-2" />
          <textarea
            name="examples"
            defaultValue='[{"input":"","output":""}]'
            className="min-h-20 rounded-xl border px-3 py-2 font-mono text-xs"
          />
          <textarea
            name="codeTemplates"
            defaultValue={defaultTemplates}
            className="min-h-32 rounded-xl border px-3 py-2 font-mono text-xs"
          />
          <textarea
            name="testCases"
            defaultValue='[{"id":"t1","input":"","expectedOutput":"","hidden":false,"sequence":1}]'
            className="min-h-24 rounded-xl border px-3 py-2 font-mono text-xs"
          />
          <label className="flex items-center gap-2 text-sm">
            <input name="published" type="checkbox" defaultChecked /> Published
          </label>
          <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
            Add question
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Tests</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-t">
                <td className="px-4 py-3">{q.sequence}</td>
                <td className="px-4 py-3">
                  <a className="text-[var(--color-primary)]" href={`/admin/practice/${setId}/questions/${q.id}`}>
                    {q.title}
                  </a>
                </td>
                <td className="px-4 py-3">{skills.find((s) => s.id === q.skillId)?.name ?? '—'}</td>
                <td className="px-4 py-3">{levels.find((l) => l.id === q.levelId)?.name ?? q.difficulty}</td>
                <td className="px-4 py-3">{q.testCases.length}</td>
                <td className="flex gap-2 px-4 py-3">
                  <form action={moveQuestionUp}>
                    <input type="hidden" name="setId" value={setId} />
                    <input type="hidden" name="questionId" value={q.id} />
                    <button type="submit">↑</button>
                  </form>
                  <form action={moveQuestionDown}>
                    <input type="hidden" name="setId" value={setId} />
                    <input type="hidden" name="questionId" value={q.id} />
                    <button type="submit">↓</button>
                  </form>
                  <form action={removeQuestionAction}>
                    <input type="hidden" name="setId" value={setId} />
                    <input type="hidden" name="questionId" value={q.id} />
                    <button type="submit" className="text-[var(--color-danger)]">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
