import { getSettings } from '@comm-platform/coding/server';

import { saveSettingsAction } from '../catalog-actions';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <main className="mx-auto max-w-xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold">Setting</h1>
      <form action={saveSettingsAction} className="grid gap-3 rounded-2xl border p-6">
        <label className="text-sm">
          Site name
          <input name="siteName" defaultValue={settings.siteName} className="mt-1 w-full rounded-xl border px-3 py-2" />
        </label>
        <label className="text-sm">
          Support email
          <input
            name="supportEmail"
            defaultValue={settings.supportEmail}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Maintenance message
          <textarea
            name="maintenanceMessage"
            defaultValue={settings.maintenanceMessage}
            className="mt-1 min-h-24 w-full rounded-xl border px-3 py-2"
          />
        </label>
        <button className="w-fit rounded-xl bg-[var(--color-primary)] px-4 py-2 text-white" type="submit">
          Save settings
        </button>
      </form>
    </main>
  );
}
