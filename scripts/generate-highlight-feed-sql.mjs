/**
 * NOT SQL. Do not paste this file into the Supabase SQL editor.
 * Rebuilds supabase/seeds/004_highlight_tech_articles.sql
 *
 * Rebuild: node scripts/generate-highlight-feed-sql.mjs
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ARTICLES, VIDEOS, youtubeWatchUrl } from './lib/highlight-tech-articles.mjs';

const DUMMY_IDS = [
  'feed-welcome-article',
  'feed-office-hours-post',
  'feed-binary-search-video',
  'feed-complexity-link',
  'feed-debug-article',
  'feed-java-collections-post',
];

function sqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function jsonSql(value) {
  return `${sqlLiteral(JSON.stringify(value))}::jsonb`;
}

function creditBlock(article, video) {
  const watch = youtubeWatchUrl(article.videoKey);
  return [
    `Sources: ${article.sources}`,
    `Video credit: "${video.title}" by ${video.channel} on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.`,
    `Watch on YouTube: ${watch}`,
    'Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
  ].join('\n\n');
}

function toPost(article, index) {
  const video = VIDEOS[article.videoKey];
  if (!video) throw new Error(`Unknown video key: ${article.videoKey}`);
  const watch = youtubeWatchUrl(article.videoKey);
  const body = [...article.paras, creditBlock(article, video)].join('\n\n');
  const n = String(index + 1).padStart(3, '0');
  const blocks = [
    { id: `blk-${n}-t1`, kind: 'text', text: article.paras[0] },
    { id: `blk-${n}-t2`, kind: 'text', text: article.paras[1] },
    {
      id: `blk-${n}-v1`,
      kind: 'video',
      url: watch,
      caption: `${video.channel}: ${video.title} (official public YouTube explainer, typically a few minutes).`,
    },
    { id: `blk-${n}-t3`, kind: 'text', text: creditBlock(article, video) },
  ];
  return {
    id: `feed-tech-${n}`,
    kind: index < 30 ? 'article' : 'article',
    title: article.title,
    body,
    mediaUrl: watch,
    linkUrl: article.link,
    authorName: 'Comm Platform',
    daysAgo: article.daysAgo,
    blocks,
  };
}

const posts = ARTICLES.slice(0, 150).map(toPost);
const catalog = posts.map((p, i) => `-- ${String(i + 1).padStart(3, '0')}. ${p.title}`).join('\n');

const dummyList = DUMMY_IDS.map(sqlLiteral).join(', ');
const values = posts
  .map((p) => {
    const created = `now() - interval '${p.daysAgo} days'`;
    return `(
    ${sqlLiteral(p.id)},
    ${sqlLiteral(p.kind)},
    ${sqlLiteral(p.title)},
    ${sqlLiteral(p.body)},
    ${sqlLiteral(p.mediaUrl)},
    ${sqlLiteral(p.linkUrl)},
    ${sqlLiteral(p.authorName)},
    true,
    ${jsonSql(p.blocks)},
    ${created},
    now()
  )`;
  })
  .join(',\n');

const sql = `-- Highlights tech briefing pack for Comm Platform
-- ${posts.length} original short articles with official public YouTube explainers.
-- Bodies are Comm Platform commentary (not copied news). Videos stay on YouTube; we only embed.
--
-- Run this entire file in the Supabase SQL editor as the postgres role.
-- Requires highlight_posts (supabase/migrations/0008_highlight_posts.sql).
-- Do not run scripts/*.mjs in SQL — those files generate this seed.
-- After it succeeds, signed-in learners see the posts on Highlights.
-- Dummy sample posts from the JSON store are unpublished so they no longer appear.
--
-- Catalog
${catalog}

begin;

update public.highlight_posts
set published = false, updated_at = now()
where id in (${dummyList});

insert into public.highlight_posts (
  id, kind, title, body, media_url, link_url, author_name, published, blocks, created_at, updated_at
) values
${values}
on conflict (id) do update
set kind = excluded.kind,
    title = excluded.title,
    body = excluded.body,
    media_url = excluded.media_url,
    link_url = excluded.link_url,
    author_name = excluded.author_name,
    published = excluded.published,
    blocks = excluded.blocks,
    created_at = excluded.created_at,
    updated_at = excluded.updated_at;

commit;
`;

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'supabase', 'seeds', '004_highlight_tech_articles.sql');
writeFileSync(out, sql);
console.log(`Wrote ${posts.length} posts to ${out}`);
