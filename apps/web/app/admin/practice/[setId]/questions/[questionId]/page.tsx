import Link from 'next/link';
import { notFound } from 'next/navigation';

import { upsertQuestion } from '../../../actions';
import { loadQuestionForAdmin } from '@/lib/coding-admin';
import { requireAdmin } from '@/lib/require-admin';

type Props = { params: Promise<{ setId: string; questionId: string }> };

export default async function AdminQuestionEditPage({ params }: Props) {
  await requireAdmin();
  const { setId, questionId } = await params;
  const q = await loadQuestionForAdmin(setId, Number(questionId));
  if (!q) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <Link className="text-[var(--color-primary)]" href={`/admin/practice/${setId}`}>← Back to set</Link>
      <h1 className="text-2xl font-semibold">Edit: {q.title}</h1>
      <form action={upsertQuestion} className="grid gap-3 rounded-2xl border p-6">
        <input type="hidden" name="id" value={q.id} />
        <input type="hidden" name="practiceSetId" value={setId} />
        <input name="title" defaultValue={q.title} required className="rounded-xl border px-3 py-2" />
        <input name="slug" defaultValue={q.slug} className="rounded-xl border px-3 py-2" />
        <select name="difficulty" defaultValue={q.difficulty} className="rounded-xl border px-3 py-2">
          <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
        </select>
        <textarea name="description" defaultValue={q.description} className="rounded-xl border px-3 py-2 min-h-32" />
        <textarea name="inputFormat" defaultValue={q.inputFormat} className="rounded-xl border px-3 py-2" />
        <textarea name="outputFormat" defaultValue={q.outputFormat} className="rounded-xl border px-3 py-2" />
        <textarea name="constraints" defaultValue={q.constraints} className="rounded-xl border px-3 py-2" />
        <input name="topics" defaultValue={q.topics.join(', ')} className="rounded-xl border px-3 py-2" />
        <input name="supportedLanguages" defaultValue={q.supportedLanguages.join(',')} className="rounded-xl border px-3 py-2" />
        <input name="sequence" type="number" defaultValue={q.sequence} className="rounded-xl border px-3 py-2" />
        <textarea name="examples" defaultValue={JSON.stringify(q.examples, null, 2)} className="rounded-xl border px-3 py-2 font-mono text-xs min-h-24" />
        <textarea name="codeTemplates" defaultValue={JSON.stringify(q.codeTemplates, null, 2)} className="rounded-xl border px-3 py-2 font-mono text-xs min-h-32" />
        <textarea name="testCases" defaultValue={JSON.stringify(q.testCases, null, 2)} className="rounded-xl border px-3 py-2 font-mono text-xs min-h-32" />
        <label className="flex items-center gap-2 text-sm"><input name="published" type="checkbox" defaultChecked={q.published} /> Published</label>
        <button className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white w-fit" type="submit">Save question</button>
      </form>
    </main>
  );
}
