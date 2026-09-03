import { notFound } from 'next/navigation';

import { upsertQuestion } from '../../../actions';
import { loadQuestionForAdmin } from '@/lib/coding-admin';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ setId: string; questionId: string }> };

export default async function AdminQuestionEditPage({ params }: Props) {
  const { setId, questionId } = await params;
  const data = await loadQuestionForAdmin(setId, Number(questionId));
  if (!data) notFound();
  const { question: q, skills, levels, topics } = data;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <a className="text-[var(--color-primary)]" href={`/admin/practice/${setId}`}>
        ← Back to set
      </a>
      <h1 className="text-2xl font-semibold">Edit: {q.title}</h1>
      {skills.length === 0 || levels.length === 0 ? (
        <p className="text-sm text-[var(--color-danger)]">Restore at least one skill and one level before saving this problem.</p>
      ) : null}
      <form action={upsertQuestion} className="grid gap-3 rounded-2xl border p-6">
        <input type="hidden" name="id" value={q.id} />
        <input type="hidden" name="practiceSetId" value={setId} />
        <input name="title" defaultValue={q.title} required className="rounded-xl border px-3 py-2" />
        <input name="slug" defaultValue={q.slug} className="rounded-xl border px-3 py-2" />
        <select name="skillId" required defaultValue={q.skillId} className="rounded-xl border px-3 py-2">
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select name="levelId" required defaultValue={q.levelId} className="rounded-xl border px-3 py-2">
          {levels.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.band})
            </option>
          ))}
        </select>
        <textarea name="description" defaultValue={q.description} className="min-h-32 rounded-xl border px-3 py-2" />
        <textarea name="inputFormat" defaultValue={q.inputFormat} className="rounded-xl border px-3 py-2" />
        <textarea name="outputFormat" defaultValue={q.outputFormat} className="rounded-xl border px-3 py-2" />
        <textarea name="constraints" defaultValue={q.constraints} className="rounded-xl border px-3 py-2" />
        <input
          name="topics"
          defaultValue={q.topics.join(', ') || topics.map((t) => t.name).join(', ')}
          className="rounded-xl border px-3 py-2"
        />
        <input name="supportedLanguages" defaultValue={q.supportedLanguages.join(',')} className="rounded-xl border px-3 py-2" />
        <input name="sequence" type="number" defaultValue={q.sequence} className="rounded-xl border px-3 py-2" />
        <textarea
          name="examples"
          defaultValue={JSON.stringify(q.examples, null, 2)}
          className="min-h-24 rounded-xl border px-3 py-2 font-mono text-xs"
        />
        <textarea
          name="codeTemplates"
          defaultValue={JSON.stringify(q.codeTemplates, null, 2)}
          className="min-h-32 rounded-xl border px-3 py-2 font-mono text-xs"
        />
        <textarea
          name="testCases"
          defaultValue={JSON.stringify(q.testCases, null, 2)}
          className="min-h-32 rounded-xl border px-3 py-2 font-mono text-xs"
        />
        <label className="flex items-center gap-2 text-sm">
          <input name="published" type="checkbox" defaultChecked={q.published} /> Published
        </label>
        <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Save question
        </button>
      </form>
    </main>
  );
}
