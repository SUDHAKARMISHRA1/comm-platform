import { LANGUAGES } from '@comm-platform/coding';
import type { LanguageKey, LevelRecord, QuestionRecord, SkillRecord, TopicRecord } from '@comm-platform/coding';

import { upsertQuestion } from '../practice/actions';

const LANG_OPTIONS: LanguageKey[] = ['java', 'c', 'cpp'];

type Props = {
  question?: QuestionRecord;
  skillId: string;
  skills: SkillRecord[];
  levels: LevelRecord[];
  topics: TopicRecord[];
  submitLabel: string;
};

export function ProblemForm({ question, skillId, skills, levels, topics, submitLabel }: Props) {
  const selectedTopics = new Set(question?.topics ?? []);
  const selectedLangs = new Set(question?.supportedLanguages?.length ? question.supportedLanguages : LANG_OPTIONS);
  const templates = question?.codeTemplates ?? Object.fromEntries(LANG_OPTIONS.map((l) => [l, LANGUAGES[l].template]));

  return (
    <form action={upsertQuestion} className="grid gap-4 rounded-2xl border bg-[var(--color-surface)] p-6">
      {question ? <input type="hidden" name="id" value={question.id} /> : null}
      <input type="hidden" name="practiceSetId" value={question?.practiceSetId ?? `ps-${skillId}`} />
      <input type="hidden" name="sequence" value={question?.sequence ?? 1} />

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Title</span>
        <span className="text-[var(--color-text-muted)]">Shown as the problem heading on the compiler screen.</span>
        <input name="title" defaultValue={question?.title} required className="rounded-xl border px-3 py-2" />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Slug (optional)</span>
        <input name="slug" defaultValue={question?.slug} className="rounded-xl border px-3 py-2" />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Skill / section</span>
          <select name="skillId" required defaultValue={question?.skillId ?? skillId} className="rounded-xl border px-3 py-2">
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-semibold">Level</span>
          <span className="text-[var(--color-text-muted)]">Maps to the Easy / Medium / Hard badge.</span>
          <select name="levelId" required defaultValue={question?.levelId ?? levels[0]?.id} className="rounded-xl border px-3 py-2">
            {levels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.band})
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Description</span>
        <span className="text-[var(--color-text-muted)]">Markdown body shown in the problem panel.</span>
        <textarea name="description" defaultValue={question?.description} className="min-h-32 rounded-xl border px-3 py-2" />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Input format</span>
        <textarea name="inputFormat" defaultValue={question?.inputFormat} className="rounded-xl border px-3 py-2" />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Output format</span>
        <textarea name="outputFormat" defaultValue={question?.outputFormat} className="rounded-xl border px-3 py-2" />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Constraints</span>
        <textarea name="constraints" defaultValue={question?.constraints} className="rounded-xl border px-3 py-2" />
      </label>

      <fieldset className="grid gap-2 text-sm">
        <legend className="font-semibold">Topics</legend>
        <p className="text-[var(--color-text-muted)]">Tags under the problem statement. Create topics from Topics list first.</p>
        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <label key={topic.id} className="flex items-center gap-2">
              <input type="checkbox" name="topicName" value={topic.name} defaultChecked={selectedTopics.has(topic.name)} />
              {topic.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2 text-sm">
        <legend className="font-semibold">Supported languages</legend>
        <p className="text-[var(--color-text-muted)]">Languages available in the compiler dropdown.</p>
        <div className="flex flex-wrap gap-3">
          {LANG_OPTIONS.map((lang) => (
            <label key={lang} className="flex items-center gap-2">
              <input type="checkbox" name="language" value={lang} defaultChecked={selectedLangs.has(lang)} />
              {lang}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Examples (JSON)</span>
        <span className="text-[var(--color-text-muted)]">Sample input / output / optional explanation shown on the problem page.</span>
        <textarea
          name="examples"
          defaultValue={JSON.stringify(question?.examples ?? [{ input: '', output: '', explanation: '' }], null, 2)}
          className="min-h-28 rounded-xl border px-3 py-2 font-mono text-xs"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Starter code templates (JSON)</span>
        <span className="text-[var(--color-text-muted)]">Initial editor code per language.</span>
        <textarea
          name="codeTemplates"
          defaultValue={JSON.stringify(templates, null, 2)}
          className="min-h-40 rounded-xl border px-3 py-2 font-mono text-xs"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span className="font-semibold">Test cases (JSON)</span>
        <span className="text-[var(--color-text-muted)]">Public cases run with Run Tests. Hidden cases run on Submit.</span>
        <textarea
          name="testCases"
          defaultValue={JSON.stringify(
            question?.testCases ?? [{ id: 't1', input: '', expectedOutput: '', hidden: false, sequence: 1 }],
            null,
            2,
          )}
          className="min-h-36 rounded-xl border px-3 py-2 font-mono text-xs"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input name="published" type="checkbox" defaultChecked={question?.published ?? true} />
        Published (visible on Practice). Uncheck to disable without deleting.
      </label>

      <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
