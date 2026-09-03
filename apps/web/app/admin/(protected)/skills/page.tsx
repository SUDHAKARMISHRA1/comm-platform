import { listSkills } from '@comm-platform/coding/server';

import { removeSkillAction, upsertSkillAction } from '../catalog-actions';

export const dynamic = 'force-dynamic';

export default async function SkillsListPage() {
  const skills = await listSkills();
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Skills</h1>
        <a className="text-sm text-[var(--color-primary)]" href="/admin/skills/new">
          Add new skill
        </a>
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">
        Skills appear as tabs on the practice screen (Java, C, C++). Every problem must bind to one skill.
      </p>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Language</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id} className="border-t">
                <td className="px-4 py-3">
                  <form action={upsertSkillAction} className="flex gap-2">
                    <input type="hidden" name="id" value={skill.id} />
                    <input name="name" defaultValue={skill.name} required className="rounded-lg border px-2 py-1" />
                    <select name="languageKey" defaultValue={skill.languageKey ?? ''} className="rounded-lg border px-2 py-1">
                      <option value="">None</option>
                      <option value="java">java</option>
                      <option value="c">c</option>
                      <option value="cpp">cpp</option>
                    </select>
                    <button className="text-[var(--color-primary)]" type="submit">
                      Update
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">{skill.languageKey ?? '—'}</td>
                <td className="px-4 py-3">
                  <form action={removeSkillAction}>
                    <input type="hidden" name="id" value={skill.id} />
                    <button className="text-[var(--color-danger)]" type="submit">
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
