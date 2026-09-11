/** Shared SQL writer for language practice packs. Not for the Supabase SQL editor. */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TOPICS, problemsForPack } from './practice-pack-problems.mjs';

function sqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function jsonSql(value) {
  return `${sqlLiteral(JSON.stringify(value))}::jsonb`;
}

function topicsForLanguage(topics, language) {
  if (language !== 'c') return topics;
  return topics.map((t) => (t === 'HashMap' ? 'Hashing' : t));
}

function questionValues(p, pack) {
  const topics = topicsForLanguage(p.topics, pack.language);
  const now = 'now()';
  return `(
    ${p.id},
    ${sqlLiteral(pack.practiceSetId)},
    ${p.sequence},
    ${sqlLiteral(p.title)},
    ${sqlLiteral(p.slug)},
    ${sqlLiteral(p.difficulty)},
    ${sqlLiteral(p.description)},
    ${sqlLiteral(p.inputFormat)},
    ${sqlLiteral(p.outputFormat)},
    ${sqlLiteral(p.constraints)},
    ${jsonSql(p.examples)},
    ${sqlLiteral(pack.skillId)},
    ${sqlLiteral(p.levelId)},
    ${jsonSql(topics)},
    ${jsonSql([pack.language])},
    ${jsonSql({ [pack.language]: pack.template })},
    ${jsonSql(p.testCases)},
    true,
    ${now},
    ${now}
  )`;
}

export function writePracticePackSql(pack) {
  const problems = problemsForPack(pack.idBase);
  const listLines = problems
    .map((p) => `-- ${String(p.sequence).padStart(2, '0')}. [${p.difficulty.padEnd(6)}] ${p.title}  (${p.slug})`)
    .join('\n');
  const easy = problems.filter((p) => p.difficulty === 'EASY').length;
  const medium = problems.filter((p) => p.difficulty === 'MEDIUM').length;
  const hard = problems.filter((p) => p.difficulty === 'HARD').length;
  const firstId = pack.idBase + 1;
  const lastId = pack.idBase + problems.length;

  const extraTopics =
    pack.language === 'c' ? [...TOPICS, ['topic-hashing', 'Hashing', 'hashing', 17]] : TOPICS;

  const sql = `-- ${pack.label} practice pack for Comm Platform
-- ${problems.length} original problems (${easy} easy, ${medium} medium, ${hard} hard).
-- IDs ${firstId}-${lastId} avoid clashing with seed questions (ids 1-6) and other language packs.
--
-- Run this entire file in the Supabase SQL editor as the postgres role.
-- Do not run scripts/*.mjs — those are JavaScript generators, not SQL.
-- After it succeeds, open Admin → Skills → ${pack.label} to review/edit.
-- Student app lists published problems for ${pack.skillId}.
--
-- Catalog
${listLines}

begin;

insert into public.practice_skills (id, name, slug, language_key, sequence, enabled)
values (${sqlLiteral(pack.skillId)}, ${sqlLiteral(pack.label)}, ${sqlLiteral(pack.skillSlug)}, ${sqlLiteral(pack.language)}, ${pack.skillSequence}, true)
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    language_key = excluded.language_key,
    sequence = excluded.sequence,
    enabled = excluded.enabled,
    updated_at = now();

insert into public.practice_levels (id, name, slug, band, sequence, enabled)
values
  ('level-easy', 'Easy', 'easy', 'EASY', 1, true),
  ('level-medium', 'Medium', 'medium', 'MEDIUM', 2, true),
  ('level-hard', 'Hard', 'hard', 'HARD', 3, true)
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    band = excluded.band,
    sequence = excluded.sequence,
    enabled = excluded.enabled,
    updated_at = now();

insert into public.practice_topics (id, name, slug, sequence, enabled)
values
${extraTopics.map(([id, name, slug, seq]) => `  (${sqlLiteral(id)}, ${sqlLiteral(name)}, ${sqlLiteral(slug)}, ${seq}, true)`).join(',\n')}
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    sequence = excluded.sequence,
    enabled = excluded.enabled,
    updated_at = now();

insert into public.practice_questions (
  id, practice_set_id, sequence, title, slug, difficulty,
  description, input_format, output_format, constraints, examples,
  skill_id, level_id, topics, supported_languages, code_templates, test_cases,
  published, created_at, updated_at
)
values
${problems.map((p) => questionValues(p, pack)).join(',\n')}
on conflict (id) do update
set practice_set_id = excluded.practice_set_id,
    sequence = excluded.sequence,
    title = excluded.title,
    slug = excluded.slug,
    difficulty = excluded.difficulty,
    description = excluded.description,
    input_format = excluded.input_format,
    output_format = excluded.output_format,
    constraints = excluded.constraints,
    examples = excluded.examples,
    skill_id = excluded.skill_id,
    level_id = excluded.level_id,
    topics = excluded.topics,
    supported_languages = excluded.supported_languages,
    code_templates = excluded.code_templates,
    test_cases = excluded.test_cases,
    published = excluded.published,
    updated_at = now();

commit;
`;

  const out = join(dirname(fileURLToPath(import.meta.url)), '../../supabase/seeds', pack.sqlFile);
  writeFileSync(out, sql);
  console.log(`Wrote ${problems.length} ${pack.label} problems to ${out}`);
}
