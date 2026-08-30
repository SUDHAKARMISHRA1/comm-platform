import { listLevels } from '@comm-platform/coding/server';

import { removeLevelAction, upsertLevelAction } from '../catalog-actions';

export const dynamic = 'force-dynamic';

export default async function LevelsListPage() {
  const levels = await listLevels();
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Levels</h1>
        <a className="text-sm text-[var(--color-primary)]" href="/admin/levels/new">
          Add level
        </a>
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">
        Every problem must have a level. The level band (Easy / Medium / Hard) is copied onto the problem.
      </p>
      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <tr key={level.id} className="border-t">
                <td className="px-4 py-3">
                  <form action={upsertLevelAction} className="flex flex-wrap gap-2">
                    <input type="hidden" name="id" value={level.id} />
                    <input name="name" defaultValue={level.name} required className="rounded-lg border px-2 py-1" />
                    <select name="band" defaultValue={level.band} className="rounded-lg border px-2 py-1">
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                    <button className="text-[var(--color-primary)]" type="submit">
                      Update
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={removeLevelAction}>
                    <input type="hidden" name="id" value={level.id} />
                    <button className="text-red-600" type="submit">
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
