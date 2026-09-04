import { notFound } from 'next/navigation';

import { loadCatalog } from '@/lib/coding-admin';
import { listSkills } from '@comm-platform/coding/server';

import { ProblemForm } from '../../../problem-form';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ skillId: string }> };

export default async function NewSkillProblemPage({ params }: Props) {
  const { skillId } = await params;
  const skills = await listSkills();
  const skill = skills.find((row) => row.id === skillId);
  if (!skill) notFound();
  const catalog = await loadCatalog();

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <a className="text-[var(--color-primary)]" href={`/admin/skills/${skillId}`}>
        ← {skill.name} problems
      </a>
      <h1 className="text-2xl font-semibold">Add problem · {skill.name}</h1>
      <ProblemForm
        skillId={skillId}
        skills={catalog.skills}
        levels={catalog.levels}
        topics={catalog.topics}
        submitLabel="Create problem"
      />
    </main>
  );
}
