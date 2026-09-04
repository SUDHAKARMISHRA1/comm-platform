import { upsertSkillAction } from '../../catalog-actions';

export default function AddSkillPage() {
  return (
    <main className="mx-auto max-w-xl space-y-6 px-6 py-10">
      <a className="text-sm text-[var(--color-primary)]" href="/admin/skills">
        ← Skills list
      </a>
      <h1 className="text-3xl font-semibold">Add new skill</h1>
      <form action={upsertSkillAction} className="grid gap-3 rounded-2xl border bg-[var(--color-surface)] p-6">
        <input name="name" placeholder="Skill name (e.g. Java)" required className="rounded-xl border px-3 py-2" />
        <select name="languageKey" className="rounded-xl border px-3 py-2">
          <option value="">No default language</option>
          <option value="java">java</option>
          <option value="c">c</option>
          <option value="cpp">cpp</option>
        </select>
        <select name="enabled" className="rounded-xl border px-3 py-2" defaultValue="1">
          <option value="1">Enabled on Practice</option>
          <option value="0">Disabled</option>
        </select>
        <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Create skill
        </button>
      </form>
    </main>
  );
}
