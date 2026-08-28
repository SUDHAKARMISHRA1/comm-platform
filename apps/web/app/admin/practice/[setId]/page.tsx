import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { LanguageKey } from '@comm-platform/coding';
import { LANGUAGES } from '@comm-platform/coding';

import { moveQuestionDown, moveQuestionUp, removeQuestionAction, upsertQuestion } from '../actions';
import { adminLogout } from '../../login/actions';
import { loadPracticeSetWithQuestions } from '@/lib/coding-admin';
import { requireAdmin } from '@/lib/require-admin';

type Props = { params: Promise<{ setId: string }> };

export default async function AdminPracticeSetPage({ params }: Props) {
  await requireAdmin();
  const { setId } = await params;
  const data = await loadPracticeSetWithQuestions(setId);
  if (!data) notFound();
  const { set, questions } = data;
  const nextSeq = questions.length + 1;
  const defaultTemplates = JSON.stringify(
    Object.fromEntries(set.languages.map((l) => [l, LANGUAGES[l].template])),
    null,
    2,
  );

  return (
    <div>
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
        <div className="flex items-center gap-4">
          <Link className="text-sm text-[var(--color-primary)]" href="/admin/practice">← Practice sets</Link>
        </div>
        <form action={adminLogout}><button className="text-sm text-[var(--color-primary)]" type="submit">Sign out</button></form>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <h1 className="text-3xl font-semibold">{set.title}</h1>
        <p className="text-[var(--color-text-muted)]">{set.description}</p>

        <form action={upsertQuestion} className="grid gap-3 rounded-2xl border p-6 bg-[var(--color-surface)]">
          <h2 className="font-semibold">Add question</h2>
          <input type="hidden" name="practiceSetId" value={setId} />
          <input name="title" placeholder="Title" required className="rounded-xl border px-3 py-2" />
          <select name="difficulty" className="rounded-xl border px-3 py-2" defaultValue="EASY">
            <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
          </select>
          <textarea name="description" placeholder="Description (markdown)" className="rounded-xl border px-3 py-2 min-h-24" />
          <textarea name="inputFormat" placeholder="Input format" className="rounded-xl border px-3 py-2" />
          <textarea name="outputFormat" placeholder="Output format" className="rounded-xl border px-3 py-2" />
          <textarea name="constraints" placeholder="Constraints" className="rounded-xl border px-3 py-2" />
          <input name="topics" placeholder="Topics (comma-separated)" className="rounded-xl border px-3 py-2" />
          <input name="supportedLanguages" defaultValue={set.languages.join(',')} className="rounded-xl border px-3 py-2" />
          <input name="sequence" type="number" defaultValue={nextSeq} className="rounded-xl border px-3 py-2" />
          <textarea name="examples" defaultValue='[{"input":"","output":""}]' className="rounded-xl border px-3 py-2 font-mono text-xs min-h-20" />
          <textarea name="codeTemplates" defaultValue={defaultTemplates} className="rounded-xl border px-3 py-2 font-mono text-xs min-h-32" />
          <textarea name="testCases" defaultValue='[{"id":"t1","input":"","expectedOutput":"","hidden":false,"sequence":1}]' className="rounded-xl border px-3 py-2 font-mono text-xs min-h-24" />
          <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" defaultChecked /> Published</label>
          <button className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white w-fit" type="submit">Add question</button>
        </form>

        <div className="overflow-x-auto rounded-2xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--color-surface-muted)]">
              <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Difficulty</th><th className="px-4 py-3">Tests</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id} className="border-t">
                  <td className="px-4 py-3">{q.sequence}</td>
                  <td className="px-4 py-3">
                    <Link className="text-[var(--color-primary)]" href={`/admin/practice/${setId}/questions/${q.id}`}>{q.title}</Link>
                  </td>
                  <td className="px-4 py-3">{q.difficulty}</td>
                  <td className="px-4 py-3">{q.testCases.length}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <form action={moveQuestionUp}><input type="hidden" name="setId" value={setId} /><input type="hidden" name="questionId" value={q.id} /><button type="submit">↑</button></form>
                    <form action={moveQuestionDown}><input type="hidden" name="setId" value={setId} /><input type="hidden" name="questionId" value={q.id} /><button type="submit">↓</button></form>
                    <form action={removeQuestionAction}><input type="hidden" name="setId" value={setId} /><input type="hidden" name="questionId" value={q.id} /><button type="submit" className="text-red-600">Delete</button></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
