-- Highlights tech briefing pack for Comm Platform
-- 150 original short articles with official public YouTube explainers.
-- Bodies are Comm Platform commentary (not copied news). Videos stay on YouTube; we only embed.
--
-- Run this entire file in the Supabase SQL editor as the postgres role.
-- Requires highlight_posts (supabase/migrations/0008_highlight_posts.sql).
-- Do not run scripts/*.mjs in SQL — those files generate this seed.
-- After it succeeds, signed-in learners see the posts on Highlights.
-- Dummy sample posts from the JSON store are unpublished so they no longer appear.
--
-- Catalog
-- 001. Read September's layoff wave like an engineer
-- 002. Uber's 3,300: layers, not a robot takeover
-- 003. PayPal India: a smaller cut that still matters
-- 004. Oracle named AI inside a restructuring filing
-- 005. When "AI" is the label, not the cause
-- 006. How to read Layoffs.fyi without spiraling
-- 007. Capex is up. That is not the same as hiring you.
-- 008. Intern season in a cut cycle
-- 009. Agents at work: useful, not magical
-- 010. Coding assistants raised the floor, not the ceiling
-- 011. The jobs next to the model still hire
-- 012. India IT and the AI talking point
-- 013. GPUs, power, and why data centers made the news
-- 014. Open weights vs hosted APIs this fall
-- 015. Never paste secrets into a chatbot
-- 016. How to mention a layoff in a screen
-- 017. Skills that still get callbacks
-- 018. Product freeze, platform bet
-- 019. Confirm the number before you repeat it
-- 020. QA and support in the age of deflection bots
-- 021. Security work did not get automated away
-- 022. A junior engineer's 90-day plan for 2026
-- 023. If AI writes the first draft, you own the tests
-- 024. News is noisy. Your offer is a contract.
-- 025. What "operational efficiency" means in a memo
-- 026. Year-to-date Big Tech cuts, without a scoreboard
-- 027. Hardware-adjacent cuts still hit software people
-- 028. Use Highlights as a briefing, not a doomscroll
-- 029. Evals, data, and reliability: the quiet reqs
-- 030. A reorg rumor is not a filing
-- 031. Foundation models in plain language
-- 032. What an LLM actually predicts
-- 033. Generative AI is not all of AI
-- 034. Transformers, without the mystique
-- 035. Attention is a weighting trick you can explain
-- 036. Prompting is specification, not a spell
-- 037. Hallucinations are a product bug
-- 038. Responsible AI is a lifecycle, not a slogan
-- 039. Fine-tuning vs RAG: pick the cheaper experiment
-- 040. Embeddings are useful vectors, not vibes
-- 041. Agents need tools, traces, and a stop button
-- 042. Multimodal does not mean "smarter at your job"
-- 043. Tokens, context windows, and the paste that failed
-- 044. Eval sets beat vibes every time
-- 045. Latency and quality will fight in production
-- 046. Cost per call will humble your weekend demo
-- 047. On-device vs cloud models
-- 048. Synthetic data is not a free lunch
-- 049. Human review is still the product
-- 050. AI literacy you can use in a coding interview
-- 051. REST is still how most apps talk
-- 052. OpenAPI is the contract, not the decoration
-- 053. HTTP status codes you should know cold
-- 054. JSON is a format, not a database
-- 055. SQL indexes: the interview that actually ships
-- 056. Transactions: all of it or none of it
-- 057. Caching is a lie you tell on purpose
-- 058. Queues: when now is the wrong time
-- 059. Idempotency is how retries stay safe
-- 060. Git: the history you will be asked to explain
-- 061. CI is a bot that refuses your bad day
-- 062. Containers package the messy parts
-- 063. Kubernetes orchestrates. Docker is not the rival.
-- 064. Orchestration is desired state, not a dashboard
-- 065. DevOps is a feedback loop
-- 066. Observability: logs, metrics, traces
-- 067. Linux is still the interview OS
-- 068. TLS is why the lock icon exists
-- 069. OAuth is delegation, not a password manager
-- 070. Cookies vs bearer tokens, without a flame war
-- 071. CORS is a browser rule, not a firewall
-- 072. SQL injection is still undefeated
-- 073. XSS is just your page running their script
-- 074. Least privilege is a kindness to future you
-- 075. Java collections you should be able to draw
-- 076. Equals and hashCode are a pair
-- 077. Checked exceptions are a design choice, not a prank
-- 078. C pointers: the address is the point
-- 079. Stack vs heap, without the mysticism
-- 080. Undefined behavior is not a personality
-- 081. C++ RAII: the destructor is the cleanup
-- 082. References are not nullable pointers with manners
-- 083. Big-O is a budget, not a brag
-- 084. Binary search is an invariant, not a vibe
-- 085. Hash maps: average case is a promise with a tail
-- 086. Two pointers are just a moving window
-- 087. Sliding window: grow, shrink, record
-- 088. Graphs: BFS for closest, DFS for exploring
-- 089. Dynamic programming is "remember the subproblem"
-- 090. Recursion needs a base case you could bet on
-- 091. Time vs space is a negotiation
-- 092. Test the empty input first
-- 093. Property tests catch the bug you did not imagine
-- 094. Read the failing test before you rewrite
-- 095. Naming is a design document
-- 096. Comments should explain why, not narrate the syntax
-- 097. APIs are promises; versions are how you keep them
-- 098. Pagination is an API design problem
-- 099. Feature flags beat long-lived branches
-- 100. Featured: accessibility is not a phase
-- 101. Semantic HTML still matters in a SPA
-- 102. CSS is layout, not a screenshot
-- 103. TypeScript is a documentation compiler
-- 104. React state is for UI, not for your database
-- 105. Next.js: know where the code runs
-- 106. Expo is how we ship one product to web now, phones later
-- 107. Postgres is a product, not a folder of JSON
-- 108. Row Level Security is the database saying no
-- 109. Migrations are history, not a suggestion
-- 110. Seeds are data. Generators are not SQL.
-- 111. Environment variables are not a personality
-- 112. Rate limits are a product feature
-- 113. Timeouts are kindness
-- 114. Featured: logs should be searchable, not poetic
-- 115. On-call is a design constraint
-- 116. Rollbacks are a feature you should rehearse
-- 117. Documentation is a user interface
-- 118. Code review is a conversation, not a gate of shame
-- 119. Side projects: ship something tiny and real
-- 120. Licenses are how you stay out of trouble
-- 121. Fair use is not a strategy for a startup
-- 122. Open source is a gift with rules
-- 123. Supply chain: pin, scan, update
-- 124. Secrets in git are a ritual humiliation
-- 125. Accessibility of motion: not everyone wants the animation
-- 126. Writing is an engineering tool
-- 127. Estimates are ranges, not personality tests
-- 128. Meetings are for decisions, tickets are for work
-- 129. Mentorship is a multiplier in a thin org
-- 130. Burnout is not a badge
-- 131. Public speaking for engineers: one idea per slide
-- 132. Side income vs moonlighting policies
-- 133. Remote work is a protocol
-- 134. Interns: ask for the real repo
-- 135. New grads: depth beats a zoo of frameworks
-- 136. Staff+ work is deleting the wrong work
-- 137. Managers in a flatter org
-- 138. Customer empathy is a debugging tool
-- 139. Privacy is a feature you can name
-- 140. Energy: your laptop is not the bill, the cluster is
-- 141. Localization is not a translate button
-- 142. Timezones will ruin a perfectly good demo
-- 143. Unicode is not "weird characters"
-- 144. Floating point is a treaty, not a number line
-- 145. Randomness needs a seed in tests
-- 146. Concurrency: if it is shared, it needs a rule
-- 147. Deadlocks are polite forever
-- 148. N+1 queries are a loop you did not see
-- 149. Pagination plus a join is where EXPLAIN earns rent
-- 150. Backups are a restore test, not a file

begin;

update public.highlight_posts
set published = false, updated_at = now()
where id in ('feed-welcome-article', 'feed-office-hours-post', 'feed-binary-search-video', 'feed-complexity-link', 'feed-debug-article', 'feed-java-collections-post');

insert into public.highlight_posts (
  id, kind, title, body, media_url, link_url, author_name, published, blocks, created_at, updated_at
) values
(
    'feed-tech-001',
    'article',
    'Read September''s layoff wave like an engineer',
    'The first ten days of September 2026 were loud: public layoff trackers listed more than six thousand tech roles cut in that window, on top of a large year-to-date tally. Those dashboards are useful. They are not a census, and they are not a verdict on your next interview.

If you are practicing here, keep two lists: companies that published a number, and rumors that did not. Then keep shipping problems. Headlines move faster than hiring committees.

Sources: Public tracker Layoffs.fyi, as summarized in September 2026 reporting. Treat totals as estimates, not official labor statistics.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-001-t1","kind":"text","text":"The first ten days of September 2026 were loud: public layoff trackers listed more than six thousand tech roles cut in that window, on top of a large year-to-date tally. Those dashboards are useful. They are not a census, and they are not a verdict on your next interview."},{"id":"blk-001-t2","kind":"text","text":"If you are practicing here, keep two lists: companies that published a number, and rumors that did not. Then keep shipping problems. Headlines move faster than hiring committees."},{"id":"blk-001-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-001-t3","kind":"text","text":"Sources: Public tracker Layoffs.fyi, as summarized in September 2026 reporting. Treat totals as estimates, not official labor statistics.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '1 days',
    now()
  ),
(
    'feed-tech-002',
    'article',
    'Uber''s 3,300: layers, not a robot takeover',
    'Uber said it would reduce about 3,300 corporate roles — on the order of a tenth of the company — and described the goal as fewer management layers and fewer tiny teams. That is a reorg story. It is not proof that a model replaced those people overnight.

When a company cites structure, believe the structure first. AI may still be in the toolkit. Your takeaway as a candidate is simpler: show you can own a problem end to end, not only a title on a slide.

Sources: Uber public remarks in September 2026; contemporaneous reporting. Uber is the source for its own headcount action.

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-002-t1","kind":"text","text":"Uber said it would reduce about 3,300 corporate roles — on the order of a tenth of the company — and described the goal as fewer management layers and fewer tiny teams. That is a reorg story. It is not proof that a model replaced those people overnight."},{"id":"blk-002-t2","kind":"text","text":"When a company cites structure, believe the structure first. AI may still be in the toolkit. Your takeaway as a candidate is simpler: show you can own a problem end to end, not only a title on a slide."},{"id":"blk-002-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-002-t3","kind":"text","text":"Sources: Uber public remarks in September 2026; contemporaneous reporting. Uber is the source for its own headcount action.\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '2 days',
    now()
  ),
(
    'feed-tech-003',
    'article',
    'PayPal India: a smaller cut that still matters',
    'Reports in September also described PayPal trimming a few percent of its India staff — on the order of a couple of hundred people across engineering, operations, and finance sites. A smaller number is still a real person''s Friday.

If you interview there, do not open with tracker trivia. Open with how you test payments, handle failure, and keep customer money boring. That is the work that survives a trim.

Sources: September 2026 reporting on PayPal India reductions. Confirm any site-level figure from the employer.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-003-t1","kind":"text","text":"Reports in September also described PayPal trimming a few percent of its India staff — on the order of a couple of hundred people across engineering, operations, and finance sites. A smaller number is still a real person''s Friday."},{"id":"blk-003-t2","kind":"text","text":"If you interview there, do not open with tracker trivia. Open with how you test payments, handle failure, and keep customer money boring. That is the work that survives a trim."},{"id":"blk-003-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-003-t3","kind":"text","text":"Sources: September 2026 reporting on PayPal India reductions. Confirm any site-level figure from the employer.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '2 days',
    now()
  ),
(
    'feed-tech-004',
    'article',
    'Oracle named AI inside a restructuring filing',
    'Oracle has been reducing headcount across 2026. In September, reporting around its filings noted extra restructuring charges and, importantly, language that tied some of the plan to adopting AI in certain functions. That is unusual: many companies cut first and name AI later.

A filing is not a product demo. It tells you where money is being reserved. If you want to work around that shift, learn how to measure an AI feature: evals, cost, and a rollback path.

Sources: Oracle public filings in 2026 (including discussion of restructuring charges). Filings are the primary source; press is secondary.

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://www.sec.gov/',
    'Comm Platform',
    true,
    '[{"id":"blk-004-t1","kind":"text","text":"Oracle has been reducing headcount across 2026. In September, reporting around its filings noted extra restructuring charges and, importantly, language that tied some of the plan to adopting AI in certain functions. That is unusual: many companies cut first and name AI later."},{"id":"blk-004-t2","kind":"text","text":"A filing is not a product demo. It tells you where money is being reserved. If you want to work around that shift, learn how to measure an AI feature: evals, cost, and a rollback path."},{"id":"blk-004-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-004-t3","kind":"text","text":"Sources: Oracle public filings in 2026 (including discussion of restructuring charges). Filings are the primary source; press is secondary.\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '3 days',
    now()
  ),
(
    'feed-tech-005',
    'article',
    'When "AI" is the label, not the cause',
    'Some 2026 layoff write-ups try to split genuine automation from "AI washing" — blaming a model for a cut that was really over-hiring, a slow product, or investor pressure. You cannot see that split from a headline.

Ask a better question in interviews: what work got deleted, and what work got funded? If the answer is "we bought GPUs and paused a product line," you already know more than the tracker.

Sources: Analyst commentary in September 2026 on AI-attributed cuts; company memos vary. This is commentary, not a legal conclusion.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-005-t1","kind":"text","text":"Some 2026 layoff write-ups try to split genuine automation from \"AI washing\" — blaming a model for a cut that was really over-hiring, a slow product, or investor pressure. You cannot see that split from a headline."},{"id":"blk-005-t2","kind":"text","text":"Ask a better question in interviews: what work got deleted, and what work got funded? If the answer is \"we bought GPUs and paused a product line,\" you already know more than the tracker."},{"id":"blk-005-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-005-t3","kind":"text","text":"Sources: Analyst commentary in September 2026 on AI-attributed cuts; company memos vary. This is commentary, not a legal conclusion.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '3 days',
    now()
  ),
(
    'feed-tech-006',
    'article',
    'How to read Layoffs.fyi without spiraling',
    'Trackers compile announcements, leaks, and filings into running totals. By early September 2026 they were already showing well over a hundred thousand tech roles for the year across hundreds of companies. Useful signal. Messy methodology.

Use the site as a weather map: which firms are noisy, which roles keep opening anyway. Do not use it as a personality test. Your practice log on this app is a better leading indicator of your next loop.

Sources: Layoffs.fyi is a public volunteer tracker. Cross-check company blogs and filings before repeating a figure.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-006-t1","kind":"text","text":"Trackers compile announcements, leaks, and filings into running totals. By early September 2026 they were already showing well over a hundred thousand tech roles for the year across hundreds of companies. Useful signal. Messy methodology."},{"id":"blk-006-t2","kind":"text","text":"Use the site as a weather map: which firms are noisy, which roles keep opening anyway. Do not use it as a personality test. Your practice log on this app is a better leading indicator of your next loop."},{"id":"blk-006-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-006-t3","kind":"text","text":"Sources: Layoffs.fyi is a public volunteer tracker. Cross-check company blogs and filings before repeating a figure.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '4 days',
    now()
  ),
(
    'feed-tech-007',
    'article',
    'Capex is up. That is not the same as hiring you.',
    'The same month as the cuts, reporting pointed at huge 2026 capital-expenditure plans among the largest platforms — a jump aimed largely at AI infrastructure. Factories of GPUs do not automatically become intern slots.

If you want to ride that spend, aim at the unglamorous jobs next to it: data pipelines, eval harnesses, cost controls, on-call. Those teams still need people who can read a stack trace.

Sources: September 2026 industry reporting on large-capex plans at major cloud and consumer internet firms. Treat dollar figures as reported estimates.

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://cloud.google.com/',
    'Comm Platform',
    true,
    '[{"id":"blk-007-t1","kind":"text","text":"The same month as the cuts, reporting pointed at huge 2026 capital-expenditure plans among the largest platforms — a jump aimed largely at AI infrastructure. Factories of GPUs do not automatically become intern slots."},{"id":"blk-007-t2","kind":"text","text":"If you want to ride that spend, aim at the unglamorous jobs next to it: data pipelines, eval harnesses, cost controls, on-call. Those teams still need people who can read a stack trace."},{"id":"blk-007-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-007-t3","kind":"text","text":"Sources: September 2026 industry reporting on large-capex plans at major cloud and consumer internet firms. Treat dollar figures as reported estimates.\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '4 days',
    now()
  ),
(
    'feed-tech-008',
    'article',
    'Intern season in a cut cycle',
    'When full-time headcount shrinks, intern classes get pickier, not always smaller. Committees look for people who can ship a small thing without a babysitter: tests, a design note, a demo that does not crash.

Practice on this platform like the intern project is already on fire. Name your constraints. Handle the ugly input. Leave a README. That package beats a viral take about layoffs.

Sources: General hiring-cycle observation alongside public 2026 layoff trackers. Not a prediction of any one company''s intern class.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-008-t1","kind":"text","text":"When full-time headcount shrinks, intern classes get pickier, not always smaller. Committees look for people who can ship a small thing without a babysitter: tests, a design note, a demo that does not crash."},{"id":"blk-008-t2","kind":"text","text":"Practice on this platform like the intern project is already on fire. Name your constraints. Handle the ugly input. Leave a README. That package beats a viral take about layoffs."},{"id":"blk-008-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-008-t3","kind":"text","text":"Sources: General hiring-cycle observation alongside public 2026 layoff trackers. Not a prediction of any one company''s intern class.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '5 days',
    now()
  ),
(
    'feed-tech-009',
    'article',
    'Agents at work: useful, not magical',
    'Enterprise "agents" in 2026 are mostly tools with a loop: retrieve, act, check, stop. They fail when the tool is wrong, the stop condition is missing, or nobody logs the trace.

If a recruiter asks "have you used agents," talk about permissions, evals, and what you do when the agent is confidently wrong. Watch the short official explainer, then write down one task you would never let an agent do unsupervised.

Sources: Vendor documentation on AI agents (Google Cloud and others). Product names change; the architecture pattern is older than the hype.

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://cloud.google.com/use-cases/ai-agents',
    'Comm Platform',
    true,
    '[{"id":"blk-009-t1","kind":"text","text":"Enterprise \"agents\" in 2026 are mostly tools with a loop: retrieve, act, check, stop. They fail when the tool is wrong, the stop condition is missing, or nobody logs the trace."},{"id":"blk-009-t2","kind":"text","text":"If a recruiter asks \"have you used agents,\" talk about permissions, evals, and what you do when the agent is confidently wrong. Watch the short official explainer, then write down one task you would never let an agent do unsupervised."},{"id":"blk-009-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-009-t3","kind":"text","text":"Sources: Vendor documentation on AI agents (Google Cloud and others). Product names change; the architecture pattern is older than the hype.\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '5 days',
    now()
  ),
(
    'feed-tech-010',
    'article',
    'Coding assistants raised the floor, not the ceiling',
    'Assistants now draft boilerplate in seconds. Interviewers noticed. They will still fail you for an off-by-one, a race, or a story that does not match the code.

Use the assistant to generate a first pass, then delete half of it. The skill is judgment: which test is missing, which name is lying, which complexity will explode at 10^5.

Sources: Public ML explainers from Google. This is career commentary, not a product review.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://developers.google.com/machine-learning/crash-course',
    'Comm Platform',
    true,
    '[{"id":"blk-010-t1","kind":"text","text":"Assistants now draft boilerplate in seconds. Interviewers noticed. They will still fail you for an off-by-one, a race, or a story that does not match the code."},{"id":"blk-010-t2","kind":"text","text":"Use the assistant to generate a first pass, then delete half of it. The skill is judgment: which test is missing, which name is lying, which complexity will explode at 10^5."},{"id":"blk-010-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-010-t3","kind":"text","text":"Sources: Public ML explainers from Google. This is career commentary, not a product review.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '6 days',
    now()
  ),
(
    'feed-tech-011',
    'article',
    'The jobs next to the model still hire',
    'While generic ticket queues shrink, teams still need people who can ship an eval set, a fallback, and a budget alert. Those are software jobs with extra metrics.

If you are choosing what to practice this month, pair algorithms with one production habit: logging, timeouts, or a golden-test file. That combination reads as 2026, not 2019.

Sources: Public cloud ML platform docs (Google Cloud Vertex AI). Hiring comments are ours, not a job guarantee.

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://cloud.google.com/vertex-ai',
    'Comm Platform',
    true,
    '[{"id":"blk-011-t1","kind":"text","text":"While generic ticket queues shrink, teams still need people who can ship an eval set, a fallback, and a budget alert. Those are software jobs with extra metrics."},{"id":"blk-011-t2","kind":"text","text":"If you are choosing what to practice this month, pair algorithms with one production habit: logging, timeouts, or a golden-test file. That combination reads as 2026, not 2019."},{"id":"blk-011-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-011-t3","kind":"text","text":"Sources: Public cloud ML platform docs (Google Cloud Vertex AI). Hiring comments are ours, not a job guarantee.\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '6 days',
    now()
  ),
(
    'feed-tech-012',
    'article',
    'India IT and the AI talking point',
    'India remains a large delivery base for global IT. When Western firms restructure, the story often arrives as "AI efficiency" even when the spreadsheet is utilization, a delayed deal, or a pyramid that got too wide.

If you work in services, your differentiator is still the same: you can debug a production issue, explain a tradeoff to a client, and write the test the generator skipped.

Sources: September 2026 reporting on India-based reductions. Figures vary by outlet; verify with the employer.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-012-t1","kind":"text","text":"India remains a large delivery base for global IT. When Western firms restructure, the story often arrives as \"AI efficiency\" even when the spreadsheet is utilization, a delayed deal, or a pyramid that got too wide."},{"id":"blk-012-t2","kind":"text","text":"If you work in services, your differentiator is still the same: you can debug a production issue, explain a tradeoff to a client, and write the test the generator skipped."},{"id":"blk-012-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-012-t3","kind":"text","text":"Sources: September 2026 reporting on India-based reductions. Figures vary by outlet; verify with the employer.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '7 days',
    now()
  ),
(
    'feed-tech-013',
    'article',
    'GPUs, power, and why data centers made the news',
    'AI news is not only chat windows. It is buildings, power contracts, and chips that sit idle if the storage layer is slow. That is why infrastructure posts keep showing up next to layoff posts.

You do not need to become an energy trader. You do need to know that "the model is slow" is often a systems problem: batching, caching, or an API you called in a loop.

Sources: Public cloud and industry commentary on AI infrastructure. Not financial advice.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://cloud.google.com/blog',
    'Comm Platform',
    true,
    '[{"id":"blk-013-t1","kind":"text","text":"AI news is not only chat windows. It is buildings, power contracts, and chips that sit idle if the storage layer is slow. That is why infrastructure posts keep showing up next to layoff posts."},{"id":"blk-013-t2","kind":"text","text":"You do not need to become an energy trader. You do need to know that \"the model is slow\" is often a systems problem: batching, caching, or an API you called in a loop."},{"id":"blk-013-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-013-t3","kind":"text","text":"Sources: Public cloud and industry commentary on AI infrastructure. Not financial advice.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '7 days',
    now()
  ),
(
    'feed-tech-014',
    'article',
    'Open weights vs hosted APIs this fall',
    'Teams are still splitting traffic: a hosted API for quality, a smaller local or self-hosted model for bulk and privacy. Neither choice is moral. Both have bills and failure modes.

In an interview, compare them like any vendor: latency, eval score, data handling, and what happens when the endpoint 429s. That answer sounds adult.

Sources: Google ML Crash Course (public). Product landscape changes quickly; this is a framing piece.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://developers.google.com/machine-learning/crash-course/llm/transformers',
    'Comm Platform',
    true,
    '[{"id":"blk-014-t1","kind":"text","text":"Teams are still splitting traffic: a hosted API for quality, a smaller local or self-hosted model for bulk and privacy. Neither choice is moral. Both have bills and failure modes."},{"id":"blk-014-t2","kind":"text","text":"In an interview, compare them like any vendor: latency, eval score, data handling, and what happens when the endpoint 429s. That answer sounds adult."},{"id":"blk-014-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-014-t3","kind":"text","text":"Sources: Google ML Crash Course (public). Product landscape changes quickly; this is a framing piece.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '8 days',
    now()
  ),
(
    'feed-tech-015',
    'article',
    'Never paste secrets into a chatbot',
    'The fastest way to turn an AI tool into an incident is a pasted API key, a customer dump, or an unreleased design. Tools are not your company''s counsel, and they are not a vault.

Make a personal rule: redacted snippets only, no credentials, no production data. If the task needs the real payload, it needs a private environment your employer already approved.

Sources: Standard security guidance. Official Google Cloud responsible-AI explainer is embedded as a related video.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://cloud.google.com/security',
    'Comm Platform',
    true,
    '[{"id":"blk-015-t1","kind":"text","text":"The fastest way to turn an AI tool into an incident is a pasted API key, a customer dump, or an unreleased design. Tools are not your company''s counsel, and they are not a vault."},{"id":"blk-015-t2","kind":"text","text":"Make a personal rule: redacted snippets only, no credentials, no production data. If the task needs the real payload, it needs a private environment your employer already approved."},{"id":"blk-015-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-015-t3","kind":"text","text":"Sources: Standard security guidance. Official Google Cloud responsible-AI explainer is embedded as a related video.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '8 days',
    now()
  ),
(
    'feed-tech-016',
    'article',
    'How to mention a layoff in a screen',
    'If your team was reduced, you can say so in one clean sentence: what you owned, that the role was eliminated, and what you want to do next. You do not owe a TED talk about AI.

Then steer to evidence: a system you kept up, a bug you caught, a number you moved. Interviewers remember composure more than your theory of the labor market.

Sources: Career commentary. Not legal advice. Company-specific facts should come from the employer.

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-016-t1","kind":"text","text":"If your team was reduced, you can say so in one clean sentence: what you owned, that the role was eliminated, and what you want to do next. You do not owe a TED talk about AI."},{"id":"blk-016-t2","kind":"text","text":"Then steer to evidence: a system you kept up, a bug you caught, a number you moved. Interviewers remember composure more than your theory of the labor market."},{"id":"blk-016-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-016-t3","kind":"text","text":"Sources: Career commentary. Not legal advice. Company-specific facts should come from the employer.\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '9 days',
    now()
  ),
(
    'feed-tech-017',
    'article',
    'Skills that still get callbacks',
    'When headcount is tight, callbacks skew toward people who can debug across a boundary: HTTP, SQL, a race, a flaky test. Flashy frameworks are optional. Clear interfaces are not.

That is why this feed mixes industry notes with REST, Git, and complexity. The market is noisy. The skills are boring on purpose.

Sources: MDN HTTP docs (CC-BY-SA). Career framing is ours.

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
    'Comm Platform',
    true,
    '[{"id":"blk-017-t1","kind":"text","text":"When headcount is tight, callbacks skew toward people who can debug across a boundary: HTTP, SQL, a race, a flaky test. Flashy frameworks are optional. Clear interfaces are not."},{"id":"blk-017-t2","kind":"text","text":"That is why this feed mixes industry notes with REST, Git, and complexity. The market is noisy. The skills are boring on purpose."},{"id":"blk-017-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-017-t3","kind":"text","text":"Sources: MDN HTTP docs (CC-BY-SA). Career framing is ours.\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '9 days',
    now()
  ),
(
    'feed-tech-018',
    'article',
    'Product freeze, platform bet',
    'A common 2026 pattern: pause a consumer feature factory, keep funding the platform that trains or serves models. From the outside it looks like "the company stopped innovating." From the inside it looks like a budget.

If you are job hunting, ask which roadmap still has owners and dates. A funded platform team will still need APIs, IAM, and on-call — the same crafts this app drills.

Sources: IBM public DevOps explainers. Company strategy comments are general, not about a named employer''s secret roadmap.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.ibm.com/think/topics/devops',
    'Comm Platform',
    true,
    '[{"id":"blk-018-t1","kind":"text","text":"A common 2026 pattern: pause a consumer feature factory, keep funding the platform that trains or serves models. From the outside it looks like \"the company stopped innovating.\" From the inside it looks like a budget."},{"id":"blk-018-t2","kind":"text","text":"If you are job hunting, ask which roadmap still has owners and dates. A funded platform team will still need APIs, IAM, and on-call — the same crafts this app drills."},{"id":"blk-018-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-018-t3","kind":"text","text":"Sources: IBM public DevOps explainers. Company strategy comments are general, not about a named employer''s secret roadmap.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '10 days',
    now()
  ),
(
    'feed-tech-019',
    'article',
    'Confirm the number before you repeat it',
    'Roundup articles sometimes stack confirmed actions next to "said to have" lines. Repeating the stack makes you the amplifier. Engineers should hate that.

Primary sources: the company blog, a filing, or a named executive note. Everything else is a rumor with formatting. Practice that habit here — it is the same as not trusting a flaky test.

Sources: Media-literacy note. Some September 2026 roundups mixed confirmed cuts with unconfirmed lists.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-019-t1","kind":"text","text":"Roundup articles sometimes stack confirmed actions next to \"said to have\" lines. Repeating the stack makes you the amplifier. Engineers should hate that."},{"id":"blk-019-t2","kind":"text","text":"Primary sources: the company blog, a filing, or a named executive note. Everything else is a rumor with formatting. Practice that habit here — it is the same as not trusting a flaky test."},{"id":"blk-019-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-019-t3","kind":"text","text":"Sources: Media-literacy note. Some September 2026 roundups mixed confirmed cuts with unconfirmed lists.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '10 days',
    now()
  ),
(
    'feed-tech-020',
    'article',
    'QA and support in the age of deflection bots',
    'Deflection bots can close easy tickets. They also hide the hard ones until a customer is furious. Good QA people become designers of the cases the bot must not miss.

If you are a tester, write the adversarial list: empty input, unicode, refund twice, timezone edges. That list is now a product asset, not leftover work.

Sources: Public vendor material on assistants and agents. Not a claim that any named firm replaced QA with a bot.

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://cloud.google.com/use-cases/ai-agents',
    'Comm Platform',
    true,
    '[{"id":"blk-020-t1","kind":"text","text":"Deflection bots can close easy tickets. They also hide the hard ones until a customer is furious. Good QA people become designers of the cases the bot must not miss."},{"id":"blk-020-t2","kind":"text","text":"If you are a tester, write the adversarial list: empty input, unicode, refund twice, timezone edges. That list is now a product asset, not leftover work."},{"id":"blk-020-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-020-t3","kind":"text","text":"Sources: Public vendor material on assistants and agents. Not a claim that any named firm replaced QA with a bot.\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '11 days',
    now()
  ),
(
    'feed-tech-021',
    'article',
    'Security work did not get automated away',
    'Auth bugs, dependency risk, and prompt injection are still human problems with software patches. A model can draft a policy. It cannot own the incident.

Learn one concrete control this week: parameterized queries, secret scanning, or least-privilege tokens. Then you have a story that is not "I use AI."

Sources: OWASP Top Ten (open). Video is Google''s public responsible-AI course clip.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://owasp.org/www-project-top-ten/',
    'Comm Platform',
    true,
    '[{"id":"blk-021-t1","kind":"text","text":"Auth bugs, dependency risk, and prompt injection are still human problems with software patches. A model can draft a policy. It cannot own the incident."},{"id":"blk-021-t2","kind":"text","text":"Learn one concrete control this week: parameterized queries, secret scanning, or least-privilege tokens. Then you have a story that is not \"I use AI.\""},{"id":"blk-021-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-021-t3","kind":"text","text":"Sources: OWASP Top Ten (open). Video is Google''s public responsible-AI course clip.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '11 days',
    now()
  ),
(
    'feed-tech-022',
    'article',
    'A junior engineer''s 90-day plan for 2026',
    'Days 1–30: one language, one Git workflow, ten problems you can explain out loud. Days 31–60: tests and a small API. Days 61–90: one AI tool used safely, plus a writeup of what it got wrong.

That plan ignores the news cycle on purpose. Committees hire evidence. This app is where you manufacture evidence.

Sources: Google ML Crash Course (public). Plan is ours, not an employer program.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://developers.google.com/machine-learning/crash-course',
    'Comm Platform',
    true,
    '[{"id":"blk-022-t1","kind":"text","text":"Days 1–30: one language, one Git workflow, ten problems you can explain out loud. Days 31–60: tests and a small API. Days 61–90: one AI tool used safely, plus a writeup of what it got wrong."},{"id":"blk-022-t2","kind":"text","text":"That plan ignores the news cycle on purpose. Committees hire evidence. This app is where you manufacture evidence."},{"id":"blk-022-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-022-t3","kind":"text","text":"Sources: Google ML Crash Course (public). Plan is ours, not an employer program.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '12 days',
    now()
  ),
(
    'feed-tech-023',
    'article',
    'If AI writes the first draft, you own the tests',
    'Generated code fails in the same ways junior code fails: silent catches, magic numbers, and tests that assert the mock. Ownership means you can explain every branch.

Before you submit on this platform, predict the hidden case. If you cannot, you are not done — regardless of who typed the function.

Sources: Testing is a general engineering practice. JUnit docs are a public reference for Java learners on this platform.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://junit.org/junit5/',
    'Comm Platform',
    true,
    '[{"id":"blk-023-t1","kind":"text","text":"Generated code fails in the same ways junior code fails: silent catches, magic numbers, and tests that assert the mock. Ownership means you can explain every branch."},{"id":"blk-023-t2","kind":"text","text":"Before you submit on this platform, predict the hidden case. If you cannot, you are not done — regardless of who typed the function."},{"id":"blk-023-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-023-t3","kind":"text","text":"Sources: Testing is a general engineering practice. JUnit docs are a public reference for Java learners on this platform.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '12 days',
    now()
  ),
(
    'feed-tech-024',
    'article',
    'News is noisy. Your offer is a contract.',
    'A viral chart cannot void a signed offer, and a calm chart cannot create one. Separate information diet from negotiation.

Read one primary source a week. Practice daily. Sleep. That is a more adult strategy than refreshing tracker pages between coding problems.

Sources: Career commentary. Not legal, tax, or immigration advice.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-024-t1","kind":"text","text":"A viral chart cannot void a signed offer, and a calm chart cannot create one. Separate information diet from negotiation."},{"id":"blk-024-t2","kind":"text","text":"Read one primary source a week. Practice daily. Sleep. That is a more adult strategy than refreshing tracker pages between coding problems."},{"id":"blk-024-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-024-t3","kind":"text","text":"Sources: Career commentary. Not legal, tax, or immigration advice.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '13 days',
    now()
  ),
(
    'feed-tech-025',
    'article',
    'What "operational efficiency" means in a memo',
    'In a headcount memo, "efficiency" usually means fewer people per unit of output, or the same output with a cheaper mix of tools. Sometimes that is automation. Sometimes it is unpaid load on whoever stayed.

When you hear the phrase in an interview, ask what metric moved. If they cannot name one, you learned something about the culture.

Sources: IBM public DevOps explainer. Phrase is common in corporate notes; interpretation is ours.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.ibm.com/think/topics/devops',
    'Comm Platform',
    true,
    '[{"id":"blk-025-t1","kind":"text","text":"In a headcount memo, \"efficiency\" usually means fewer people per unit of output, or the same output with a cheaper mix of tools. Sometimes that is automation. Sometimes it is unpaid load on whoever stayed."},{"id":"blk-025-t2","kind":"text","text":"When you hear the phrase in an interview, ask what metric moved. If they cannot name one, you learned something about the culture."},{"id":"blk-025-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-025-t3","kind":"text","text":"Sources: IBM public DevOps explainer. Phrase is common in corporate notes; interpretation is ours.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '13 days',
    now()
  ),
(
    'feed-tech-026',
    'article',
    'Year-to-date Big Tech cuts, without a scoreboard',
    'Trackers in September listed very large year-to-date reductions at several of the biggest platforms — Oracle, Amazon, Dell, Meta, Microsoft, PayPal among names that kept appearing. Rankings are not a morality league.

Your job search should be weighted toward teams that are hiring for a named problem, not toward companies that "won" a layoff chart. Open reqs beat vibes.

Sources: Layoffs.fyi 2026 running totals as cited in September reporting. Rankings shift; do not treat as audited.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://layoffs.fyi/',
    'Comm Platform',
    true,
    '[{"id":"blk-026-t1","kind":"text","text":"Trackers in September listed very large year-to-date reductions at several of the biggest platforms — Oracle, Amazon, Dell, Meta, Microsoft, PayPal among names that kept appearing. Rankings are not a morality league."},{"id":"blk-026-t2","kind":"text","text":"Your job search should be weighted toward teams that are hiring for a named problem, not toward companies that \"won\" a layoff chart. Open reqs beat vibes."},{"id":"blk-026-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-026-t3","kind":"text","text":"Sources: Layoffs.fyi 2026 running totals as cited in September reporting. Rankings shift; do not treat as audited.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '14 days',
    now()
  ),
(
    'feed-tech-027',
    'article',
    'Hardware-adjacent cuts still hit software people',
    'When a hardware or PC-adjacent giant restructures, software, firmware, and cloud-adjacent teams still feel it. The product is a box; the org chart is still people who write code.

If that is your industry, keep a portable skill: Linux, CI, and a systems language. Those travel if the brand on the chassis changes.

Sources: IBM public container-orchestration explainer. Hardware-company figures should be checked against those firms'' notices.

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://www.ibm.com/think/topics/container-orchestration',
    'Comm Platform',
    true,
    '[{"id":"blk-027-t1","kind":"text","text":"When a hardware or PC-adjacent giant restructures, software, firmware, and cloud-adjacent teams still feel it. The product is a box; the org chart is still people who write code."},{"id":"blk-027-t2","kind":"text","text":"If that is your industry, keep a portable skill: Linux, CI, and a systems language. Those travel if the brand on the chassis changes."},{"id":"blk-027-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-027-t3","kind":"text","text":"Sources: IBM public container-orchestration explainer. Hardware-company figures should be checked against those firms'' notices.\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '14 days',
    now()
  ),
(
    'feed-tech-028',
    'article',
    'Use Highlights as a briefing, not a doomscroll',
    'This feed exists so you can spend two minutes on context, two minutes on a video, then get back to a problem. It is not a replacement for primary sources and it is not entertainment outrage.

If a post cites a tracker or a filing, tap the source link. If a video is from Google Cloud or IBM, that channel owns the footage — we only embed it.

Sources: Editorial note from Comm Platform. Videos in this feed are official public YouTube explainers credited in each post.

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://developers.google.com/machine-learning/crash-course',
    'Comm Platform',
    true,
    '[{"id":"blk-028-t1","kind":"text","text":"This feed exists so you can spend two minutes on context, two minutes on a video, then get back to a problem. It is not a replacement for primary sources and it is not entertainment outrage."},{"id":"blk-028-t2","kind":"text","text":"If a post cites a tracker or a filing, tap the source link. If a video is from Google Cloud or IBM, that channel owns the footage — we only embed it."},{"id":"blk-028-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-028-t3","kind":"text","text":"Sources: Editorial note from Comm Platform. Videos in this feed are official public YouTube explainers credited in each post.\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '15 days',
    now()
  ),
(
    'feed-tech-029',
    'article',
    'Evals, data, and reliability: the quiet reqs',
    'Lots of 2026 postings hide under boring titles: data quality, evaluation, site reliability, "AI platform." They all need people who can write a failing test and a dashboard.

Pair one algorithm drill with one reliability habit this week: retries with jitter, or a timeout you can explain. That is how you sound like you have been on-call even if you have not.

Sources: Google Cloud Vertex AI public docs. Hiring comments are ours.

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://cloud.google.com/vertex-ai',
    'Comm Platform',
    true,
    '[{"id":"blk-029-t1","kind":"text","text":"Lots of 2026 postings hide under boring titles: data quality, evaluation, site reliability, \"AI platform.\" They all need people who can write a failing test and a dashboard."},{"id":"blk-029-t2","kind":"text","text":"Pair one algorithm drill with one reliability habit this week: retries with jitter, or a timeout you can explain. That is how you sound like you have been on-call even if you have not."},{"id":"blk-029-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-029-t3","kind":"text","text":"Sources: Google Cloud Vertex AI public docs. Hiring comments are ours.\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '15 days',
    now()
  ),
(
    'feed-tech-030',
    'article',
    'A reorg rumor is not a filing',
    'Social posts will always "hear" a round of cuts before anyone signs a letter. Your standard of evidence should be higher than a screenshot.

If you need the number for a decision — accepting an offer, relocating — wait for the company or a filing. Meanwhile, keep your practice streak. Rumors do not compile.

Sources: SEC EDGAR is the public filing desk for US registrants. Not every employer files there.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://www.sec.gov/',
    'Comm Platform',
    true,
    '[{"id":"blk-030-t1","kind":"text","text":"Social posts will always \"hear\" a round of cuts before anyone signs a letter. Your standard of evidence should be higher than a screenshot."},{"id":"blk-030-t2","kind":"text","text":"If you need the number for a decision — accepting an offer, relocating — wait for the company or a filing. Meanwhile, keep your practice streak. Rumors do not compile."},{"id":"blk-030-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-030-t3","kind":"text","text":"Sources: SEC EDGAR is the public filing desk for US registrants. Not every employer files there.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '16 days',
    now()
  ),
(
    'feed-tech-031',
    'article',
    'Foundation models in plain language',
    'A foundation model is a large model trained on a wide mix of data, then adapted to many tasks instead of one. That is why one API can summarize, translate, and draft code — with uneven quality.

You do not need to recite parameter counts. You do need to know that "general" still fails on your domain until you add data, tests, and a human loop. Watch Google''s two-minute official clip, then come back and write a failing test.

Sources: Google public explainer embedded below. Article text is original Comm Platform wording.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://cloud.google.com/ai/llms',
    'Comm Platform',
    true,
    '[{"id":"blk-031-t1","kind":"text","text":"A foundation model is a large model trained on a wide mix of data, then adapted to many tasks instead of one. That is why one API can summarize, translate, and draft code — with uneven quality."},{"id":"blk-031-t2","kind":"text","text":"You do not need to recite parameter counts. You do need to know that \"general\" still fails on your domain until you add data, tests, and a human loop. Watch Google''s two-minute official clip, then come back and write a failing test."},{"id":"blk-031-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-031-t3","kind":"text","text":"Sources: Google public explainer embedded below. Article text is original Comm Platform wording.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '16 days',
    now()
  ),
(
    'feed-tech-032',
    'article',
    'What an LLM actually predicts',
    'A large language model predicts the next token, over and over. Fluency is a side effect. Truth is not guaranteed. That single sentence saves you from most demo magic.

When the output looks like an API design, treat it as a draft from a fast intern who has never seen your production constraints. You are still the engineer of record.

Sources: Google ML Crash Course and Google Cloud LLM intro video.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://developers.google.com/machine-learning/crash-course/llm/transformers',
    'Comm Platform',
    true,
    '[{"id":"blk-032-t1","kind":"text","text":"A large language model predicts the next token, over and over. Fluency is a side effect. Truth is not guaranteed. That single sentence saves you from most demo magic."},{"id":"blk-032-t2","kind":"text","text":"When the output looks like an API design, treat it as a draft from a fast intern who has never seen your production constraints. You are still the engineer of record."},{"id":"blk-032-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-032-t3","kind":"text","text":"Sources: Google ML Crash Course and Google Cloud LLM intro video.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '17 days',
    now()
  ),
(
    'feed-tech-033',
    'article',
    'Generative AI is not all of AI',
    'Ranking ads, detecting fraud, and recommending a video were AI long before chat boxes. Generative models are the loud cousin. They generate; they do not automatically understand your business rules.

In interviews, separate discriminative work (classify, detect) from generative work (draft, synthesize). Mixing the terms is how people sound like they learned AI from thumbnails.

Sources: Google Cloud "Introduction to Generative AI" (official video).

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://cloud.google.com/use-cases/generative-ai',
    'Comm Platform',
    true,
    '[{"id":"blk-033-t1","kind":"text","text":"Ranking ads, detecting fraud, and recommending a video were AI long before chat boxes. Generative models are the loud cousin. They generate; they do not automatically understand your business rules."},{"id":"blk-033-t2","kind":"text","text":"In interviews, separate discriminative work (classify, detect) from generative work (draft, synthesize). Mixing the terms is how people sound like they learned AI from thumbnails."},{"id":"blk-033-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-033-t3","kind":"text","text":"Sources: Google Cloud \"Introduction to Generative AI\" (official video).\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '17 days',
    now()
  ),
(
    'feed-tech-034',
    'article',
    'Transformers, without the mystique',
    'Transformers made it practical to train huge language models by looking at many tokens in parallel and weighting which ones matter. That idea is attention. The rest is engineering at brutal scale.

You will not derive the paper on a whiteboard in twenty minutes. You can say: parallel sequence model, attention weights, pretrain then adapt. Then talk about a product failure mode.

Sources: Google Cloud explainer on transformers. Original 2017 research is public ("Attention Is All You Need").

Video credit: "Transformers, explained" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=SZorAJ4I-sA',
    'https://developers.google.com/machine-learning/crash-course/llm/transformers',
    'Comm Platform',
    true,
    '[{"id":"blk-034-t1","kind":"text","text":"Transformers made it practical to train huge language models by looking at many tokens in parallel and weighting which ones matter. That idea is attention. The rest is engineering at brutal scale."},{"id":"blk-034-t2","kind":"text","text":"You will not derive the paper on a whiteboard in twenty minutes. You can say: parallel sequence model, attention weights, pretrain then adapt. Then talk about a product failure mode."},{"id":"blk-034-v1","kind":"video","url":"https://www.youtube.com/watch?v=SZorAJ4I-sA","caption":"Google Cloud: Transformers, explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-034-t3","kind":"text","text":"Sources: Google Cloud explainer on transformers. Original 2017 research is public (\"Attention Is All You Need\").\n\nVideo credit: \"Transformers, explained\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '18 days',
    now()
  ),
(
    'feed-tech-035',
    'article',
    'Attention is a weighting trick you can explain',
    'Attention lets a model spend more compute on the tokens that matter for the next prediction. It is not consciousness. It is a soft index into the input.

If you remember one picture, remember a weighted sum. Then you can follow the official Google overview video without drowning in slogans.

Sources: Google public lecture clip on attention. Article is original.

Video credit: "Attention mechanism: Overview" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=fjJOgb-E41w

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=fjJOgb-E41w',
    'https://developers.google.com/machine-learning/crash-course',
    'Comm Platform',
    true,
    '[{"id":"blk-035-t1","kind":"text","text":"Attention lets a model spend more compute on the tokens that matter for the next prediction. It is not consciousness. It is a soft index into the input."},{"id":"blk-035-t2","kind":"text","text":"If you remember one picture, remember a weighted sum. Then you can follow the official Google overview video without drowning in slogans."},{"id":"blk-035-v1","kind":"video","url":"https://www.youtube.com/watch?v=fjJOgb-E41w","caption":"Google: Attention mechanism: Overview (official public YouTube explainer, typically a few minutes)."},{"id":"blk-035-t3","kind":"text","text":"Sources: Google public lecture clip on attention. Article is original.\n\nVideo credit: \"Attention mechanism: Overview\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=fjJOgb-E41w\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '18 days',
    now()
  ),
(
    'feed-tech-036',
    'article',
    'Prompting is specification, not a spell',
    'A prompt is a spec: role, constraints, format, and examples. Vague specs get vague software. Models are not exempt.

Practice writing the output schema first. If you cannot name the fields, you are not ready to call the API — in this app or in production.

Sources: Google prompting resources (public).

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://developers.google.com/machine-learning/resources/prompt-eng',
    'Comm Platform',
    true,
    '[{"id":"blk-036-t1","kind":"text","text":"A prompt is a spec: role, constraints, format, and examples. Vague specs get vague software. Models are not exempt."},{"id":"blk-036-t2","kind":"text","text":"Practice writing the output schema first. If you cannot name the fields, you are not ready to call the API — in this app or in production."},{"id":"blk-036-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-036-t3","kind":"text","text":"Sources: Google prompting resources (public).\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '19 days',
    now()
  ),
(
    'feed-tech-037',
    'article',
    'Hallucinations are a product bug',
    'When a model invents a citation or an API that does not exist, that is not a personality quirk. It is an incorrect output that can ship if nobody checks.

Mitigations are boring and real: retrieval with sources, constrained decoding, tests, and a human for high-stakes actions. Put that list in your interview pocket.

Sources: Google Cloud generative-AI intro discusses hallucinations. Wording here is ours.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://developers.google.com/machine-learning/crash-course',
    'Comm Platform',
    true,
    '[{"id":"blk-037-t1","kind":"text","text":"When a model invents a citation or an API that does not exist, that is not a personality quirk. It is an incorrect output that can ship if nobody checks."},{"id":"blk-037-t2","kind":"text","text":"Mitigations are boring and real: retrieval with sources, constrained decoding, tests, and a human for high-stakes actions. Put that list in your interview pocket."},{"id":"blk-037-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-037-t3","kind":"text","text":"Sources: Google Cloud generative-AI intro discusses hallucinations. Wording here is ours.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '19 days',
    now()
  ),
(
    'feed-tech-038',
    'article',
    'Responsible AI is a lifecycle, not a slogan',
    'Responsible AI means you thought about who is harmed if the model is wrong, whose data trained it, and how you will monitor it after launch. Principles documents are starting points, not shields.

You can practice this without a research lab: refuse unsafe prompts in a toy app, log failures, and write a one-page "what this tool must never do."

Sources: Google AI Principles (public). Video is Google Cloud''s Introduction to Responsible AI.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://ai.google/responsibility/principles/',
    'Comm Platform',
    true,
    '[{"id":"blk-038-t1","kind":"text","text":"Responsible AI means you thought about who is harmed if the model is wrong, whose data trained it, and how you will monitor it after launch. Principles documents are starting points, not shields."},{"id":"blk-038-t2","kind":"text","text":"You can practice this without a research lab: refuse unsafe prompts in a toy app, log failures, and write a one-page \"what this tool must never do.\""},{"id":"blk-038-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-038-t3","kind":"text","text":"Sources: Google AI Principles (public). Video is Google Cloud''s Introduction to Responsible AI.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '20 days',
    now()
  ),
(
    'feed-tech-039',
    'article',
    'Fine-tuning vs RAG: pick the cheaper experiment',
    'Fine-tuning changes weights. RAG leaves the model alone and fetches your documents at ask-time. Most product teams should try retrieval first because it is easier to update and easier to cite.

If someone asks which one you "believe in," answer with a constraint: how often the facts change, whether you must cite, and what a wrong answer costs.

Sources: Google Cloud Vertex AI documentation (public).

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://cloud.google.com/vertex-ai/docs',
    'Comm Platform',
    true,
    '[{"id":"blk-039-t1","kind":"text","text":"Fine-tuning changes weights. RAG leaves the model alone and fetches your documents at ask-time. Most product teams should try retrieval first because it is easier to update and easier to cite."},{"id":"blk-039-t2","kind":"text","text":"If someone asks which one you \"believe in,\" answer with a constraint: how often the facts change, whether you must cite, and what a wrong answer costs."},{"id":"blk-039-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-039-t3","kind":"text","text":"Sources: Google Cloud Vertex AI documentation (public).\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '20 days',
    now()
  ),
(
    'feed-tech-040',
    'article',
    'Embeddings are useful vectors, not vibes',
    'An embedding puts a chunk of text into a numeric space so similar meanings sit nearby. Search, clustering, and RAG all ride that idea.

The failure mode is garbage in: bad chunking, stale indexes, or comparing vectors from two different models. Treat the index like a database you actually maintain.

Sources: Google Cloud embeddings docs (public).

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings/get-text-embeddings',
    'Comm Platform',
    true,
    '[{"id":"blk-040-t1","kind":"text","text":"An embedding puts a chunk of text into a numeric space so similar meanings sit nearby. Search, clustering, and RAG all ride that idea."},{"id":"blk-040-t2","kind":"text","text":"The failure mode is garbage in: bad chunking, stale indexes, or comparing vectors from two different models. Treat the index like a database you actually maintain."},{"id":"blk-040-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-040-t3","kind":"text","text":"Sources: Google Cloud embeddings docs (public).\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '21 days',
    now()
  ),
(
    'feed-tech-041',
    'article',
    'Agents need tools, traces, and a stop button',
    'An agent is a model allowed to call tools in a loop. The intelligence is often in the tools: search, tickets, refunds. The risk is the loop that never stops or the tool that does too much.

Design the allow-list first. Then the trace. Then the demo. Reverse that order and you will ship a party trick.

Sources: Google Cloud AI agents overview (public).

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://cloud.google.com/use-cases/ai-agents',
    'Comm Platform',
    true,
    '[{"id":"blk-041-t1","kind":"text","text":"An agent is a model allowed to call tools in a loop. The intelligence is often in the tools: search, tickets, refunds. The risk is the loop that never stops or the tool that does too much."},{"id":"blk-041-t2","kind":"text","text":"Design the allow-list first. Then the trace. Then the demo. Reverse that order and you will ship a party trick."},{"id":"blk-041-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-041-t3","kind":"text","text":"Sources: Google Cloud AI agents overview (public).\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '21 days',
    now()
  ),
(
    'feed-tech-042',
    'article',
    'Multimodal does not mean "smarter at your job"',
    'Multimodal models accept more than text — images, audio, video. That is a sensory upgrade, not a guarantee of better judgment on your payroll file.

If you use image input in a product, write tests for blurry photos, screenshots of secrets, and adversarial stickers. New input types create new incidents.

Sources: Google public LLM overview. Article is original.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://cloud.google.com/ai/llms',
    'Comm Platform',
    true,
    '[{"id":"blk-042-t1","kind":"text","text":"Multimodal models accept more than text — images, audio, video. That is a sensory upgrade, not a guarantee of better judgment on your payroll file."},{"id":"blk-042-t2","kind":"text","text":"If you use image input in a product, write tests for blurry photos, screenshots of secrets, and adversarial stickers. New input types create new incidents."},{"id":"blk-042-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-042-t3","kind":"text","text":"Sources: Google public LLM overview. Article is original.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '22 days',
    now()
  ),
(
    'feed-tech-043',
    'article',
    'Tokens, context windows, and the paste that failed',
    'Models do not read "files." They read tokens, and there is a budget. Overflow, and the beginning of your prompt falls off the table.

That is why dumping an entire repo into a chat is a bad architecture. Chunk, retrieve, and keep the prompt small enough to inspect.

Sources: Google ML Crash Course (public).

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://developers.google.com/machine-learning/crash-course/llm/transformers',
    'Comm Platform',
    true,
    '[{"id":"blk-043-t1","kind":"text","text":"Models do not read \"files.\" They read tokens, and there is a budget. Overflow, and the beginning of your prompt falls off the table."},{"id":"blk-043-t2","kind":"text","text":"That is why dumping an entire repo into a chat is a bad architecture. Chunk, retrieve, and keep the prompt small enough to inspect."},{"id":"blk-043-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-043-t3","kind":"text","text":"Sources: Google ML Crash Course (public).\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '22 days',
    now()
  ),
(
    'feed-tech-044',
    'article',
    'Eval sets beat vibes every time',
    'If you cannot score a change, you are decorating a demo. An eval set is a list of inputs and acceptable outputs you re-run when the prompt or the model version moves.

Start tiny: twenty cases, including the ones that embarrassed you last week. That file is more valuable than another screenshot of a clever answer.

Sources: Google Cloud Vertex AI (public docs + explainer video).

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://cloud.google.com/vertex-ai',
    'Comm Platform',
    true,
    '[{"id":"blk-044-t1","kind":"text","text":"If you cannot score a change, you are decorating a demo. An eval set is a list of inputs and acceptable outputs you re-run when the prompt or the model version moves."},{"id":"blk-044-t2","kind":"text","text":"Start tiny: twenty cases, including the ones that embarrassed you last week. That file is more valuable than another screenshot of a clever answer."},{"id":"blk-044-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-044-t3","kind":"text","text":"Sources: Google Cloud Vertex AI (public docs + explainer video).\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '23 days',
    now()
  ),
(
    'feed-tech-045',
    'article',
    'Latency and quality will fight in production',
    'Bigger models are slower and more expensive. Product people will ask for both "smarter" and "instant." Your job is to show the curve, not to promise both.

Learn to say: here is the p95, here is the eval drop if we switch to the fast model, here is caching. That sentence gets budget approved.

Sources: General systems advice plus Google Cloud ML platform explainer.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://cloud.google.com/vertex-ai',
    'Comm Platform',
    true,
    '[{"id":"blk-045-t1","kind":"text","text":"Bigger models are slower and more expensive. Product people will ask for both \"smarter\" and \"instant.\" Your job is to show the curve, not to promise both."},{"id":"blk-045-t2","kind":"text","text":"Learn to say: here is the p95, here is the eval drop if we switch to the fast model, here is caching. That sentence gets budget approved."},{"id":"blk-045-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-045-t3","kind":"text","text":"Sources: General systems advice plus Google Cloud ML platform explainer.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '23 days',
    now()
  ),
(
    'feed-tech-046',
    'article',
    'Cost per call will humble your weekend demo',
    'A prototype that calls a flagship model on every keystroke will look brilliant until finance sees the bill. Batch, cache, and reserve the expensive model for the hard 10%.

Write the cost assumption next to the architecture diagram. Interviewers love that more than another logo collage.

Sources: Cloud pricing is public and changes; check the vendor calculator. Video is an official ML platform intro.

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://cloud.google.com/products/calculator',
    'Comm Platform',
    true,
    '[{"id":"blk-046-t1","kind":"text","text":"A prototype that calls a flagship model on every keystroke will look brilliant until finance sees the bill. Batch, cache, and reserve the expensive model for the hard 10%."},{"id":"blk-046-t2","kind":"text","text":"Write the cost assumption next to the architecture diagram. Interviewers love that more than another logo collage."},{"id":"blk-046-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-046-t3","kind":"text","text":"Sources: Cloud pricing is public and changes; check the vendor calculator. Video is an official ML platform intro.\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '24 days',
    now()
  ),
(
    'feed-tech-047',
    'article',
    'On-device vs cloud models',
    'Small models on a phone protect privacy and work offline. They will not match a data-center model on hard reasoning. Pick based on the data you refuse to upload.

A good design uses on-device for drafts and detection, and cloud for the rare heavy lift — with a user-visible switch.

Sources: Google AI developer site (public). Device capabilities change by hardware generation.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://ai.google.dev/',
    'Comm Platform',
    true,
    '[{"id":"blk-047-t1","kind":"text","text":"Small models on a phone protect privacy and work offline. They will not match a data-center model on hard reasoning. Pick based on the data you refuse to upload."},{"id":"blk-047-t2","kind":"text","text":"A good design uses on-device for drafts and detection, and cloud for the rare heavy lift — with a user-visible switch."},{"id":"blk-047-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-047-t3","kind":"text","text":"Sources: Google AI developer site (public). Device capabilities change by hardware generation.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '24 days',
    now()
  ),
(
    'feed-tech-048',
    'article',
    'Synthetic data is not a free lunch',
    'Generating extra training rows can help. It can also clone the same bias and hallucinate structure that never existed in the real world.

If you use synthetic data, hold out a real-world test set you never generate from. Otherwise you are grading your own homework.

Sources: Google AI Principles. Article is original commentary.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://ai.google/responsibility/principles/',
    'Comm Platform',
    true,
    '[{"id":"blk-048-t1","kind":"text","text":"Generating extra training rows can help. It can also clone the same bias and hallucinate structure that never existed in the real world."},{"id":"blk-048-t2","kind":"text","text":"If you use synthetic data, hold out a real-world test set you never generate from. Otherwise you are grading your own homework."},{"id":"blk-048-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-048-t3","kind":"text","text":"Sources: Google AI Principles. Article is original commentary.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '25 days',
    now()
  ),
(
    'feed-tech-049',
    'article',
    'Human review is still the product',
    'High-stakes actions — money, medical, employment, identity — need a human who can say no. Putting a model in front of that human does not remove the duty.

Design the queue: what the model is allowed to auto-send, and what must wait. Then measure the miss rate. That is product work.

Sources: Google responsible-AI explainer (official video).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://ai.google/responsibility/principles/',
    'Comm Platform',
    true,
    '[{"id":"blk-049-t1","kind":"text","text":"High-stakes actions — money, medical, employment, identity — need a human who can say no. Putting a model in front of that human does not remove the duty."},{"id":"blk-049-t2","kind":"text","text":"Design the queue: what the model is allowed to auto-send, and what must wait. Then measure the miss rate. That is product work."},{"id":"blk-049-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-049-t3","kind":"text","text":"Sources: Google responsible-AI explainer (official video).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '25 days',
    now()
  ),
(
    'feed-tech-050',
    'article',
    'AI literacy you can use in a coding interview',
    'You will get a five-minute "what is a transformer" even in a Java loop. Answer in one breath, then return to arrays. Committees are checking that you are not bluffing, not that you train models.

Pair that answer with an engineering one: how you would test a summarizer that must not leak PII. That combination feels like 2026.

Sources: Google ML Crash Course (public).

Video credit: "Transformers, explained" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=SZorAJ4I-sA',
    'https://developers.google.com/machine-learning/crash-course',
    'Comm Platform',
    true,
    '[{"id":"blk-050-t1","kind":"text","text":"You will get a five-minute \"what is a transformer\" even in a Java loop. Answer in one breath, then return to arrays. Committees are checking that you are not bluffing, not that you train models."},{"id":"blk-050-t2","kind":"text","text":"Pair that answer with an engineering one: how you would test a summarizer that must not leak PII. That combination feels like 2026."},{"id":"blk-050-v1","kind":"video","url":"https://www.youtube.com/watch?v=SZorAJ4I-sA","caption":"Google Cloud: Transformers, explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-050-t3","kind":"text","text":"Sources: Google ML Crash Course (public).\n\nVideo credit: \"Transformers, explained\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '26 days',
    now()
  ),
(
    'feed-tech-051',
    'article',
    'REST is still how most apps talk',
    'REST is a way to treat server data as resources over HTTP: GET reads, POST creates, PUT/PATCH updates, DELETE removes. Stateless means each request carries what it needs.

You will use this on every team represented in this month''s layoff news, because the surviving products still have APIs. Watch IBM''s official explainer, then implement one endpoint with tests.

Sources: MDN REST glossary (CC-BY-SA). Video: IBM Technology, What is a REST API?

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Glossary/REST',
    'Comm Platform',
    true,
    '[{"id":"blk-051-t1","kind":"text","text":"REST is a way to treat server data as resources over HTTP: GET reads, POST creates, PUT/PATCH updates, DELETE removes. Stateless means each request carries what it needs."},{"id":"blk-051-t2","kind":"text","text":"You will use this on every team represented in this month''s layoff news, because the surviving products still have APIs. Watch IBM''s official explainer, then implement one endpoint with tests."},{"id":"blk-051-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-051-t3","kind":"text","text":"Sources: MDN REST glossary (CC-BY-SA). Video: IBM Technology, What is a REST API?\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '26 days',
    now()
  ),
(
    'feed-tech-052',
    'article',
    'OpenAPI is the contract, not the decoration',
    'An OpenAPI file describes paths, methods, and schemas so humans and tools agree. Generate clients if you want; do not let the generated client become the only documentation you understand.

When an AI assistant drafts an endpoint, the spec is how you catch the lie. If the YAML and the code disagree, the code is what production will do — unless you have tests.

Sources: OpenAPI Specification (open). Video: IBM Technology on REST and OpenAPI.

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://www.openapis.org/',
    'Comm Platform',
    true,
    '[{"id":"blk-052-t1","kind":"text","text":"An OpenAPI file describes paths, methods, and schemas so humans and tools agree. Generate clients if you want; do not let the generated client become the only documentation you understand."},{"id":"blk-052-t2","kind":"text","text":"When an AI assistant drafts an endpoint, the spec is how you catch the lie. If the YAML and the code disagree, the code is what production will do — unless you have tests."},{"id":"blk-052-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-052-t3","kind":"text","text":"Sources: OpenAPI Specification (open). Video: IBM Technology on REST and OpenAPI.\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '27 days',
    now()
  ),
(
    'feed-tech-053',
    'article',
    'HTTP status codes you should know cold',
    '401 is who are you, 403 is I know you and still no, 404 is missing, 429 is slow down, 5xx is our mess. Mixing them up makes debugging a social problem.

Practice reading a failing fetch the way you read a failing test: status first, body second, retry last.

Sources: MDN HTTP status codes (CC-BY-SA).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
    'Comm Platform',
    true,
    '[{"id":"blk-053-t1","kind":"text","text":"401 is who are you, 403 is I know you and still no, 404 is missing, 429 is slow down, 5xx is our mess. Mixing them up makes debugging a social problem."},{"id":"blk-053-t2","kind":"text","text":"Practice reading a failing fetch the way you read a failing test: status first, body second, retry last."},{"id":"blk-053-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-053-t3","kind":"text","text":"Sources: MDN HTTP status codes (CC-BY-SA).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '27 days',
    now()
  ),
(
    'feed-tech-054',
    'article',
    'JSON is a format, not a database',
    'JSON is wonderful on the wire and painful as your source of truth. It has no schema unless you add one, and it will happily store three spellings of the same field.

If you persist JSON, version it and validate it. The Highlights blocks on this app are JSON — that is a deliberate, bounded use, not a substitute for Postgres.

Sources: json.org (public). Video is IBM REST explainer as related API context.

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://www.json.org/json-en.html',
    'Comm Platform',
    true,
    '[{"id":"blk-054-t1","kind":"text","text":"JSON is wonderful on the wire and painful as your source of truth. It has no schema unless you add one, and it will happily store three spellings of the same field."},{"id":"blk-054-t2","kind":"text","text":"If you persist JSON, version it and validate it. The Highlights blocks on this app are JSON — that is a deliberate, bounded use, not a substitute for Postgres."},{"id":"blk-054-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-054-t3","kind":"text","text":"Sources: json.org (public). Video is IBM REST explainer as related API context.\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '28 days',
    now()
  ),
(
    'feed-tech-055',
    'article',
    'SQL indexes: the interview that actually ships',
    'An index is a side structure that makes some lookups fast and writes a bit slower. The wrong index is worse than none: extra storage, extra maintenance, same sequential scan.

Learn to read EXPLAIN at a basic level. "I would index the foreign key we filter on" is a senior-sounding sentence you can earn this week.

Sources: PostgreSQL official docs (open).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://www.postgresql.org/docs/current/indexes.html',
    'Comm Platform',
    true,
    '[{"id":"blk-055-t1","kind":"text","text":"An index is a side structure that makes some lookups fast and writes a bit slower. The wrong index is worse than none: extra storage, extra maintenance, same sequential scan."},{"id":"blk-055-t2","kind":"text","text":"Learn to read EXPLAIN at a basic level. \"I would index the foreign key we filter on\" is a senior-sounding sentence you can earn this week."},{"id":"blk-055-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-055-t3","kind":"text","text":"Sources: PostgreSQL official docs (open).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '28 days',
    now()
  ),
(
    'feed-tech-056',
    'article',
    'Transactions: all of it or none of it',
    'A transaction groups statements so you do not credit one account and fail to debit the other. Isolation levels decide what concurrent readers see. You do not need to memorize every anomaly on day one.

You do need a story: begin, work, commit, or rollback. Payments, bookings, and "did the email send" all live here.

Sources: PostgreSQL transactions tutorial (official).

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://www.postgresql.org/docs/current/tutorial-transactions.html',
    'Comm Platform',
    true,
    '[{"id":"blk-056-t1","kind":"text","text":"A transaction groups statements so you do not credit one account and fail to debit the other. Isolation levels decide what concurrent readers see. You do not need to memorize every anomaly on day one."},{"id":"blk-056-t2","kind":"text","text":"You do need a story: begin, work, commit, or rollback. Payments, bookings, and \"did the email send\" all live here."},{"id":"blk-056-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-056-t3","kind":"text","text":"Sources: PostgreSQL transactions tutorial (official).\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '29 days',
    now()
  ),
(
    'feed-tech-057',
    'article',
    'Caching is a lie you tell on purpose',
    'A cache stores a previous answer to skip expensive work. The hard part is invalidation: knowing the answer is stale. That is why "just cache it" is not a design.

Name the key, the TTL, and the miss path. If you cannot, you do not have a cache. You have a bug with a logo.

Sources: MDN HTTP caching (CC-BY-SA).

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching',
    'Comm Platform',
    true,
    '[{"id":"blk-057-t1","kind":"text","text":"A cache stores a previous answer to skip expensive work. The hard part is invalidation: knowing the answer is stale. That is why \"just cache it\" is not a design."},{"id":"blk-057-t2","kind":"text","text":"Name the key, the TTL, and the miss path. If you cannot, you do not have a cache. You have a bug with a logo."},{"id":"blk-057-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-057-t3","kind":"text","text":"Sources: MDN HTTP caching (CC-BY-SA).\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '29 days',
    now()
  ),
(
    'feed-tech-058',
    'article',
    'Queues: when now is the wrong time',
    'A queue lets you accept work quickly and do it later: emails, thumbnails, webhooks. You trade latency of the side work for reliability of the request path.

Know at-least-once vs exactly-once as a conversation, not a religion. Most systems retry, so your consumer must be idempotent.

Sources: IBM public message-queue overview. Article is original.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.ibm.com/think/topics/message-queues',
    'Comm Platform',
    true,
    '[{"id":"blk-058-t1","kind":"text","text":"A queue lets you accept work quickly and do it later: emails, thumbnails, webhooks. You trade latency of the side work for reliability of the request path."},{"id":"blk-058-t2","kind":"text","text":"Know at-least-once vs exactly-once as a conversation, not a religion. Most systems retry, so your consumer must be idempotent."},{"id":"blk-058-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-058-t3","kind":"text","text":"Sources: IBM public message-queue overview. Article is original.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '30 days',
    now()
  ),
(
    'feed-tech-059',
    'article',
    'Idempotency is how retries stay safe',
    'An idempotent operation can happen twice without creating two charges. Networks retry. Users double-click. Assistants replay tool calls.

Design a key: one payment intent, one upload id. Store what you already did. This topic will outlive every AI brand name on this feed.

Sources: MDN glossary (CC-BY-SA).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent',
    'Comm Platform',
    true,
    '[{"id":"blk-059-t1","kind":"text","text":"An idempotent operation can happen twice without creating two charges. Networks retry. Users double-click. Assistants replay tool calls."},{"id":"blk-059-t2","kind":"text","text":"Design a key: one payment intent, one upload id. Store what you already did. This topic will outlive every AI brand name on this feed."},{"id":"blk-059-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-059-t3","kind":"text","text":"Sources: MDN glossary (CC-BY-SA).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '30 days',
    now()
  ),
(
    'feed-tech-060',
    'article',
    'Git: the history you will be asked to explain',
    'Git snapshots trees of files and lets you branch, merge, and bisect. You do not need every incantation. You do need commit, branch, rebase-vs-merge at a conceptual level, and how to undo a local mess.

Write messages that a stranger can use in a year. Future you is that stranger, especially after a reorg deletes the Slack thread.

Sources: Official Git documentation. Video: IBM cloud-native DevOps explainer (includes source control in the pipeline).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://git-scm.com/doc',
    'Comm Platform',
    true,
    '[{"id":"blk-060-t1","kind":"text","text":"Git snapshots trees of files and lets you branch, merge, and bisect. You do not need every incantation. You do need commit, branch, rebase-vs-merge at a conceptual level, and how to undo a local mess."},{"id":"blk-060-t2","kind":"text","text":"Write messages that a stranger can use in a year. Future you is that stranger, especially after a reorg deletes the Slack thread."},{"id":"blk-060-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-060-t3","kind":"text","text":"Sources: Official Git documentation. Video: IBM cloud-native DevOps explainer (includes source control in the pipeline).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '31 days',
    now()
  ),
(
    'feed-tech-061',
    'article',
    'CI is a bot that refuses your bad day',
    'Continuous integration runs tests on every change so broken main is rare. If your CI is optional, it is decoration.

Start with unit tests and a linter. Add a smoke test that boots the app. That pipeline is a portfolio piece even if the company logo changes.

Sources: IBM public CI topic page + DevOps video.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.ibm.com/think/topics/continuous-integration',
    'Comm Platform',
    true,
    '[{"id":"blk-061-t1","kind":"text","text":"Continuous integration runs tests on every change so broken main is rare. If your CI is optional, it is decoration."},{"id":"blk-061-t2","kind":"text","text":"Start with unit tests and a linter. Add a smoke test that boots the app. That pipeline is a portfolio piece even if the company logo changes."},{"id":"blk-061-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-061-t3","kind":"text","text":"Sources: IBM public CI topic page + DevOps video.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '31 days',
    now()
  ),
(
    'feed-tech-062',
    'article',
    'Containers package the messy parts',
    'A container image is a recipe: OS bits, libraries, your app. A container is a running instance. "It works on my machine" becomes "it works in this image," which is progress, not magic.

Learn a tiny Dockerfile and why you should not run as root. That skill travels between clouds when org charts do not.

Sources: IBM public container topics. Video: IBM Kubernetes vs Docker.

Video credit: "Kubernetes vs. Docker: It''s Not an Either/Or Question" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=2vMEQ5zs1ko',
    'https://www.ibm.com/think/topics/containers',
    'Comm Platform',
    true,
    '[{"id":"blk-062-t1","kind":"text","text":"A container image is a recipe: OS bits, libraries, your app. A container is a running instance. \"It works on my machine\" becomes \"it works in this image,\" which is progress, not magic."},{"id":"blk-062-t2","kind":"text","text":"Learn a tiny Dockerfile and why you should not run as root. That skill travels between clouds when org charts do not."},{"id":"blk-062-v1","kind":"video","url":"https://www.youtube.com/watch?v=2vMEQ5zs1ko","caption":"IBM Technology: Kubernetes vs. Docker: It''s Not an Either/Or Question (official public YouTube explainer, typically a few minutes)."},{"id":"blk-062-t3","kind":"text","text":"Sources: IBM public container topics. Video: IBM Kubernetes vs Docker.\n\nVideo credit: \"Kubernetes vs. Docker: It''s Not an Either/Or Question\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '32 days',
    now()
  ),
(
    'feed-tech-063',
    'article',
    'Kubernetes orchestrates. Docker is not the rival.',
    'Docker (or another runtime) runs a container. Kubernetes schedules many of them, restarts the dead ones, and gives them names on a network. The "vs" debate is a category error.

You do not need to pass CKA to talk about pods and desired state. You do need to respect that YAML is production code.

Sources: Kubernetes official docs. Video: IBM Technology, Kubernetes vs Docker.

Video credit: "Kubernetes vs. Docker: It''s Not an Either/Or Question" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=2vMEQ5zs1ko',
    'https://kubernetes.io/docs/concepts/overview/',
    'Comm Platform',
    true,
    '[{"id":"blk-063-t1","kind":"text","text":"Docker (or another runtime) runs a container. Kubernetes schedules many of them, restarts the dead ones, and gives them names on a network. The \"vs\" debate is a category error."},{"id":"blk-063-t2","kind":"text","text":"You do not need to pass CKA to talk about pods and desired state. You do need to respect that YAML is production code."},{"id":"blk-063-v1","kind":"video","url":"https://www.youtube.com/watch?v=2vMEQ5zs1ko","caption":"IBM Technology: Kubernetes vs. Docker: It''s Not an Either/Or Question (official public YouTube explainer, typically a few minutes)."},{"id":"blk-063-t3","kind":"text","text":"Sources: Kubernetes official docs. Video: IBM Technology, Kubernetes vs Docker.\n\nVideo credit: \"Kubernetes vs. Docker: It''s Not an Either/Or Question\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '32 days',
    now()
  ),
(
    'feed-tech-064',
    'article',
    'Orchestration is desired state, not a dashboard',
    'Orchestrators keep asking "does the world match the spec?" and reconciling. That loop is why you declare replicas instead of SSH-ing forever.

When something loops CrashLoopBackOff, read the spec and the logs before you scale it to 20. Scaling a broken spec is a louder bug.

Sources: Kubernetes official "What is Kubernetes". Video: IBM container orchestration explainer.

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/',
    'Comm Platform',
    true,
    '[{"id":"blk-064-t1","kind":"text","text":"Orchestrators keep asking \"does the world match the spec?\" and reconciling. That loop is why you declare replicas instead of SSH-ing forever."},{"id":"blk-064-t2","kind":"text","text":"When something loops CrashLoopBackOff, read the spec and the logs before you scale it to 20. Scaling a broken spec is a louder bug."},{"id":"blk-064-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-064-t3","kind":"text","text":"Sources: Kubernetes official \"What is Kubernetes\". Video: IBM container orchestration explainer.\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '33 days',
    now()
  ),
(
    'feed-tech-065',
    'article',
    'DevOps is a feedback loop',
    'DevOps is not a job title you sprinkle on a resume. It is making build, test, release, and observe cheap enough that you can do them daily.

If your "DevOps" is a ticket to another team for every deploy, you have a queue, not a loop. Shrink the queue.

Sources: IBM DevOps explainer (docs + video).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.ibm.com/think/topics/devops',
    'Comm Platform',
    true,
    '[{"id":"blk-065-t1","kind":"text","text":"DevOps is not a job title you sprinkle on a resume. It is making build, test, release, and observe cheap enough that you can do them daily."},{"id":"blk-065-t2","kind":"text","text":"If your \"DevOps\" is a ticket to another team for every deploy, you have a queue, not a loop. Shrink the queue."},{"id":"blk-065-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-065-t3","kind":"text","text":"Sources: IBM DevOps explainer (docs + video).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '33 days',
    now()
  ),
(
    'feed-tech-066',
    'article',
    'Observability: logs, metrics, traces',
    'Logs tell a story, metrics tell a trend, traces tell a path across services. You want all three when the AI feature is "randomly slow."

Add one structured log line to your next project: request id, user id hash, duration. Future incident-you will send a thank-you.

Sources: OpenTelemetry observability primer (open).

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://opentelemetry.io/docs/concepts/observability-primer/',
    'Comm Platform',
    true,
    '[{"id":"blk-066-t1","kind":"text","text":"Logs tell a story, metrics tell a trend, traces tell a path across services. You want all three when the AI feature is \"randomly slow.\""},{"id":"blk-066-t2","kind":"text","text":"Add one structured log line to your next project: request id, user id hash, duration. Future incident-you will send a thank-you."},{"id":"blk-066-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-066-t3","kind":"text","text":"Sources: OpenTelemetry observability primer (open).\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '34 days',
    now()
  ),
(
    'feed-tech-067',
    'article',
    'Linux is still the interview OS',
    'ls, grep, pipes, permissions, and "what is listening on this port" will show up after the leetcode. Cloud VMs are Linux with a bill.

Spend one evening on processes and files. It pays rent in every stack, including the ones that wrap a model.

Sources: linuxcommand.org is a long-running public teaching site. Video is IBM DevOps (pipelines run on Linux).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://linuxcommand.org/',
    'Comm Platform',
    true,
    '[{"id":"blk-067-t1","kind":"text","text":"ls, grep, pipes, permissions, and \"what is listening on this port\" will show up after the leetcode. Cloud VMs are Linux with a bill."},{"id":"blk-067-t2","kind":"text","text":"Spend one evening on processes and files. It pays rent in every stack, including the ones that wrap a model."},{"id":"blk-067-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-067-t3","kind":"text","text":"Sources: linuxcommand.org is a long-running public teaching site. Video is IBM DevOps (pipelines run on Linux).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '34 days',
    now()
  ),
(
    'feed-tech-068',
    'article',
    'TLS is why the lock icon exists',
    'TLS encrypts the pipe so a cafe Wi-Fi operator does not read your session. Certificates bind a key to a name. Expiry is an outage with extra shame.

You do not need to implement the handshake. You do need to know not to disable verification "just for now" in production.

Sources: MDN TLS (CC-BY-SA).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security',
    'Comm Platform',
    true,
    '[{"id":"blk-068-t1","kind":"text","text":"TLS encrypts the pipe so a cafe Wi-Fi operator does not read your session. Certificates bind a key to a name. Expiry is an outage with extra shame."},{"id":"blk-068-t2","kind":"text","text":"You do not need to implement the handshake. You do need to know not to disable verification \"just for now\" in production."},{"id":"blk-068-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-068-t3","kind":"text","text":"Sources: MDN TLS (CC-BY-SA).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '35 days',
    now()
  ),
(
    'feed-tech-069',
    'article',
    'OAuth is delegation, not a password manager',
    'OAuth lets a user grant a client limited access without sharing their password with that client. Scopes are the promise. Tokens are the proof.

If you build a login, prefer a maintained library and a redirect you actually allow-list. Home-grown OAuth is a CVE with extra steps.

Sources: oauth.net (community, public). Video: IBM REST explainer as the HTTP context.

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://oauth.net/2/',
    'Comm Platform',
    true,
    '[{"id":"blk-069-t1","kind":"text","text":"OAuth lets a user grant a client limited access without sharing their password with that client. Scopes are the promise. Tokens are the proof."},{"id":"blk-069-t2","kind":"text","text":"If you build a login, prefer a maintained library and a redirect you actually allow-list. Home-grown OAuth is a CVE with extra steps."},{"id":"blk-069-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-069-t3","kind":"text","text":"Sources: oauth.net (community, public). Video: IBM REST explainer as the HTTP context.\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '35 days',
    now()
  ),
(
    'feed-tech-070',
    'article',
    'Cookies vs bearer tokens, without a flame war',
    'Browsers send cookies automatically; that is convenient and is why CSRF exists. Bearer tokens in Authorization headers are explicit and are why you must store them carefully on mobile.

Name the threat you are solving, then pick. "We always use JWT" is not a threat model.

Sources: MDN cookies (CC-BY-SA). This app uses both patterns on purpose: cookies for admin, bearer for the product API.

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies',
    'Comm Platform',
    true,
    '[{"id":"blk-070-t1","kind":"text","text":"Browsers send cookies automatically; that is convenient and is why CSRF exists. Bearer tokens in Authorization headers are explicit and are why you must store them carefully on mobile."},{"id":"blk-070-t2","kind":"text","text":"Name the threat you are solving, then pick. \"We always use JWT\" is not a threat model."},{"id":"blk-070-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-070-t3","kind":"text","text":"Sources: MDN cookies (CC-BY-SA). This app uses both patterns on purpose: cookies for admin, bearer for the product API.\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '36 days',
    now()
  ),
(
    'feed-tech-071',
    'article',
    'CORS is a browser rule, not a firewall',
    'CORS tells a browser whether a page from origin A may read a response from origin B. curl does not care. Attackers with curl do not need your Access-Control header.

If you "fix CORS" by reflecting * with credentials, you have not fixed security. You have disabled a seatbelt.

Sources: MDN CORS (CC-BY-SA).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
    'Comm Platform',
    true,
    '[{"id":"blk-071-t1","kind":"text","text":"CORS tells a browser whether a page from origin A may read a response from origin B. curl does not care. Attackers with curl do not need your Access-Control header."},{"id":"blk-071-t2","kind":"text","text":"If you \"fix CORS\" by reflecting * with credentials, you have not fixed security. You have disabled a seatbelt."},{"id":"blk-071-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-071-t3","kind":"text","text":"Sources: MDN CORS (CC-BY-SA).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '36 days',
    now()
  ),
(
    'feed-tech-072',
    'article',
    'SQL injection is still undefeated',
    'String-concatenating user input into SQL remains a classic own-goal. Parameterized queries are the fix. ORMs help until someone interpolates anyway.

AI assistants will happily generate the vulnerable version if you ask for "quick." Review the query like it will be on the internet — because it will.

Sources: OWASP SQL Injection (open).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://owasp.org/www-community/attacks/SQL_Injection',
    'Comm Platform',
    true,
    '[{"id":"blk-072-t1","kind":"text","text":"String-concatenating user input into SQL remains a classic own-goal. Parameterized queries are the fix. ORMs help until someone interpolates anyway."},{"id":"blk-072-t2","kind":"text","text":"AI assistants will happily generate the vulnerable version if you ask for \"quick.\" Review the query like it will be on the internet — because it will."},{"id":"blk-072-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-072-t3","kind":"text","text":"Sources: OWASP SQL Injection (open).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '37 days',
    now()
  ),
(
    'feed-tech-073',
    'article',
    'XSS is just your page running their script',
    'Cross-site scripting means untrusted text became HTML or JS in someone else''s browser. Encode on the way out. Use a framework''s defaults. Do not innerHTML your way to a demo.

Markdown and "rich" AI output are XSS magnets. Sanitize. Then sanitize again in review.

Sources: OWASP XSS (open).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://owasp.org/www-community/attacks/xss/',
    'Comm Platform',
    true,
    '[{"id":"blk-073-t1","kind":"text","text":"Cross-site scripting means untrusted text became HTML or JS in someone else''s browser. Encode on the way out. Use a framework''s defaults. Do not innerHTML your way to a demo."},{"id":"blk-073-t2","kind":"text","text":"Markdown and \"rich\" AI output are XSS magnets. Sanitize. Then sanitize again in review."},{"id":"blk-073-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-073-t3","kind":"text","text":"Sources: OWASP XSS (open).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '37 days',
    now()
  ),
(
    'feed-tech-074',
    'article',
    'Least privilege is a kindness to future you',
    'A token that can do everything will eventually do everything, including the disaster. Scope keys to one bucket, one queue, one table.

This matters more as assistants gain tools. An agent with admin credentials is an incident with a chat UI.

Sources: OWASP least privilege (open).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://owasp.org/www-community/Least_Privilege',
    'Comm Platform',
    true,
    '[{"id":"blk-074-t1","kind":"text","text":"A token that can do everything will eventually do everything, including the disaster. Scope keys to one bucket, one queue, one table."},{"id":"blk-074-t2","kind":"text","text":"This matters more as assistants gain tools. An agent with admin credentials is an incident with a chat UI."},{"id":"blk-074-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-074-t3","kind":"text","text":"Sources: OWASP least privilege (open).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '38 days',
    now()
  ),
(
    'feed-tech-075',
    'article',
    'Java collections you should be able to draw',
    'ArrayList, HashMap, ArrayDeque, PriorityQueue: if you hesitate on amortized costs, drill them. Intern loops still live here, AI or not.

Write them from memory once a week. Then solve a problem that needs two of them at once. That is the actual interview.

Sources: Oracle Java API docs (public). Video is IBM REST as a reminder that collections show up in APIs too.

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/package-summary.html',
    'Comm Platform',
    true,
    '[{"id":"blk-075-t1","kind":"text","text":"ArrayList, HashMap, ArrayDeque, PriorityQueue: if you hesitate on amortized costs, drill them. Intern loops still live here, AI or not."},{"id":"blk-075-t2","kind":"text","text":"Write them from memory once a week. Then solve a problem that needs two of them at once. That is the actual interview."},{"id":"blk-075-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-075-t3","kind":"text","text":"Sources: Oracle Java API docs (public). Video is IBM REST as a reminder that collections show up in APIs too.\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '38 days',
    now()
  ),
(
    'feed-tech-076',
    'article',
    'Equals and hashCode are a pair',
    'If two objects are equal, they must hash the same. Break that and your HashMap becomes modern art.

When an AI drafts a record class, check those two methods before you celebrate. This bug is still collecting bounties in code review.

Sources: Oracle Java Object docs (public).

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html',
    'Comm Platform',
    true,
    '[{"id":"blk-076-t1","kind":"text","text":"If two objects are equal, they must hash the same. Break that and your HashMap becomes modern art."},{"id":"blk-076-t2","kind":"text","text":"When an AI drafts a record class, check those two methods before you celebrate. This bug is still collecting bounties in code review."},{"id":"blk-076-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-076-t3","kind":"text","text":"Sources: Oracle Java Object docs (public).\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '39 days',
    now()
  ),
(
    'feed-tech-077',
    'article',
    'Checked exceptions are a design choice, not a prank',
    'Java will make you acknowledge some failures at compile time. That is annoying and also honest. Swallowing them with empty catch blocks is how production becomes folklore.

Catch the tightest type you can, log the context, and fail the request if you cannot recover. Assistants love empty catches. You should not.

Sources: Oracle Java Tutorials (public).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://docs.oracle.com/javase/tutorial/essential/exceptions/',
    'Comm Platform',
    true,
    '[{"id":"blk-077-t1","kind":"text","text":"Java will make you acknowledge some failures at compile time. That is annoying and also honest. Swallowing them with empty catch blocks is how production becomes folklore."},{"id":"blk-077-t2","kind":"text","text":"Catch the tightest type you can, log the context, and fail the request if you cannot recover. Assistants love empty catches. You should not."},{"id":"blk-077-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-077-t3","kind":"text","text":"Sources: Oracle Java Tutorials (public).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '39 days',
    now()
  ),
(
    'feed-tech-078',
    'article',
    'C pointers: the address is the point',
    'A pointer is an address. Dereferencing a bad one is undefined behavior, which is C for "the debugger will lie later."

Draw the boxes. Name the lifetime. If you cannot say who frees the memory, you are not done — and neither is the generated snippet.

Sources: cppreference (community reference). Video is IBM orchestration as a "what is actually running" companion.

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://en.cppreference.com/w/c/language/pointer',
    'Comm Platform',
    true,
    '[{"id":"blk-078-t1","kind":"text","text":"A pointer is an address. Dereferencing a bad one is undefined behavior, which is C for \"the debugger will lie later.\""},{"id":"blk-078-t2","kind":"text","text":"Draw the boxes. Name the lifetime. If you cannot say who frees the memory, you are not done — and neither is the generated snippet."},{"id":"blk-078-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-078-t3","kind":"text","text":"Sources: cppreference (community reference). Video is IBM orchestration as a \"what is actually running\" companion.\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '40 days',
    now()
  ),
(
    'feed-tech-079',
    'article',
    'Stack vs heap, without the mysticism',
    'Automatic storage goes away when the function returns. Allocated storage lives until you free it. Mixing them is use-after-free.

This is still the difference between a clean C solution and a "works on sample" that explodes on hidden tests in this app.

Sources: cppreference storage duration (public reference).

Video credit: "Kubernetes vs. Docker: It''s Not an Either/Or Question" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=2vMEQ5zs1ko',
    'https://en.cppreference.com/w/c/language/storage_duration',
    'Comm Platform',
    true,
    '[{"id":"blk-079-t1","kind":"text","text":"Automatic storage goes away when the function returns. Allocated storage lives until you free it. Mixing them is use-after-free."},{"id":"blk-079-t2","kind":"text","text":"This is still the difference between a clean C solution and a \"works on sample\" that explodes on hidden tests in this app."},{"id":"blk-079-v1","kind":"video","url":"https://www.youtube.com/watch?v=2vMEQ5zs1ko","caption":"IBM Technology: Kubernetes vs. Docker: It''s Not an Either/Or Question (official public YouTube explainer, typically a few minutes)."},{"id":"blk-079-t3","kind":"text","text":"Sources: cppreference storage duration (public reference).\n\nVideo credit: \"Kubernetes vs. Docker: It''s Not an Either/Or Question\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '40 days',
    now()
  ),
(
    'feed-tech-080',
    'article',
    'Undefined behavior is not a personality',
    'C and C++ will not always crash when you are wrong. They may appear to work until a compiler flag, a new CPU, or a larger input.

Stay in defined operations. Initialize. Bound your indexes. Treat warnings as errors. Models will still emit UB. Your job is to refuse it.

Sources: cppreference on undefined behavior.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://en.cppreference.com/w/c/language/behavior',
    'Comm Platform',
    true,
    '[{"id":"blk-080-t1","kind":"text","text":"C and C++ will not always crash when you are wrong. They may appear to work until a compiler flag, a new CPU, or a larger input."},{"id":"blk-080-t2","kind":"text","text":"Stay in defined operations. Initialize. Bound your indexes. Treat warnings as errors. Models will still emit UB. Your job is to refuse it."},{"id":"blk-080-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-080-t3","kind":"text","text":"Sources: cppreference on undefined behavior.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '41 days',
    now()
  ),
(
    'feed-tech-081',
    'article',
    'C++ RAII: the destructor is the cleanup',
    'RAII ties a resource to an object lifetime so the destructor releases it. That is why unique_ptr exists. Manual new/delete in modern C++ is a smell unless you can defend it.

If an assistant writes a raw owning pointer, rewrite it. Interviewers notice who still ships leaks.

Sources: cppreference RAII (public).

Video credit: "Kubernetes vs. Docker: It''s Not an Either/Or Question" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=2vMEQ5zs1ko',
    'https://en.cppreference.com/w/cpp/language/raii',
    'Comm Platform',
    true,
    '[{"id":"blk-081-t1","kind":"text","text":"RAII ties a resource to an object lifetime so the destructor releases it. That is why unique_ptr exists. Manual new/delete in modern C++ is a smell unless you can defend it."},{"id":"blk-081-t2","kind":"text","text":"If an assistant writes a raw owning pointer, rewrite it. Interviewers notice who still ships leaks."},{"id":"blk-081-v1","kind":"video","url":"https://www.youtube.com/watch?v=2vMEQ5zs1ko","caption":"IBM Technology: Kubernetes vs. Docker: It''s Not an Either/Or Question (official public YouTube explainer, typically a few minutes)."},{"id":"blk-081-t3","kind":"text","text":"Sources: cppreference RAII (public).\n\nVideo credit: \"Kubernetes vs. Docker: It''s Not an Either/Or Question\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '41 days',
    now()
  ),
(
    'feed-tech-082',
    'article',
    'References are not nullable pointers with manners',
    'A C++ reference must bind to an object. A pointer may be null. Using them interchangeably is how lifetime bugs sneak into "clean" code.

Say the lifetime out loud: who owns this, and who is just looking? That sentence is a senior habit.

Sources: cppreference references.

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://en.cppreference.com/w/cpp/language/reference',
    'Comm Platform',
    true,
    '[{"id":"blk-082-t1","kind":"text","text":"A C++ reference must bind to an object. A pointer may be null. Using them interchangeably is how lifetime bugs sneak into \"clean\" code."},{"id":"blk-082-t2","kind":"text","text":"Say the lifetime out loud: who owns this, and who is just looking? That sentence is a senior habit."},{"id":"blk-082-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-082-t3","kind":"text","text":"Sources: cppreference references.\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '42 days',
    now()
  ),
(
    'feed-tech-083',
    'article',
    'Big-O is a budget, not a brag',
    'When n is 10^5, n² is a timeout. When n is 20, n² might be fine. Complexity talk without constraints is theater.

On this platform, read the constraints first. Then pick the structure. Then write the tests. The video is a transformer explainer because "scale" is the same instinct in ML and in loops.

Sources: bigocheatsheet.com is a popular public cheat sheet. We link it; we did not copy its tables into this article.

Video credit: "Transformers, explained" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=SZorAJ4I-sA',
    'https://www.bigocheatsheet.com/',
    'Comm Platform',
    true,
    '[{"id":"blk-083-t1","kind":"text","text":"When n is 10^5, n² is a timeout. When n is 20, n² might be fine. Complexity talk without constraints is theater."},{"id":"blk-083-t2","kind":"text","text":"On this platform, read the constraints first. Then pick the structure. Then write the tests. The video is a transformer explainer because \"scale\" is the same instinct in ML and in loops."},{"id":"blk-083-v1","kind":"video","url":"https://www.youtube.com/watch?v=SZorAJ4I-sA","caption":"Google Cloud: Transformers, explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-083-t3","kind":"text","text":"Sources: bigocheatsheet.com is a popular public cheat sheet. We link it; we did not copy its tables into this article.\n\nVideo credit: \"Transformers, explained\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '42 days',
    now()
  ),
(
    'feed-tech-084',
    'article',
    'Binary search is an invariant, not a vibe',
    'Binary search only works if the search space shrinks and the answer never leaves the remaining range. Off-by-one is the entire sport.

Write the invariant in a comment: what is true of lo and hi. If you cannot, you will flail on the last hidden case.

Sources: Wikipedia binary search (CC BY-SA). We summarize in original words and link; we do not paste the article.

Video credit: "Attention mechanism: Overview" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=fjJOgb-E41w

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=fjJOgb-E41w',
    'https://en.wikipedia.org/wiki/Binary_search_algorithm',
    'Comm Platform',
    true,
    '[{"id":"blk-084-t1","kind":"text","text":"Binary search only works if the search space shrinks and the answer never leaves the remaining range. Off-by-one is the entire sport."},{"id":"blk-084-t2","kind":"text","text":"Write the invariant in a comment: what is true of lo and hi. If you cannot, you will flail on the last hidden case."},{"id":"blk-084-v1","kind":"video","url":"https://www.youtube.com/watch?v=fjJOgb-E41w","caption":"Google: Attention mechanism: Overview (official public YouTube explainer, typically a few minutes)."},{"id":"blk-084-t3","kind":"text","text":"Sources: Wikipedia binary search (CC BY-SA). We summarize in original words and link; we do not paste the article.\n\nVideo credit: \"Attention mechanism: Overview\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=fjJOgb-E41w\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '43 days',
    now()
  ),
(
    'feed-tech-085',
    'article',
    'Hash maps: average case is a promise with a tail',
    'Hash maps give expected constant lookups and a bad day if everything collides or you forget that iteration order is not a spec.

Know how to use them. Know when a sort plus two pointers is simpler. Interviews still live in that fork.

Sources: Wikipedia hash table (CC BY-SA), linked not copied.

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://en.wikipedia.org/wiki/Hash_table',
    'Comm Platform',
    true,
    '[{"id":"blk-085-t1","kind":"text","text":"Hash maps give expected constant lookups and a bad day if everything collides or you forget that iteration order is not a spec."},{"id":"blk-085-t2","kind":"text","text":"Know how to use them. Know when a sort plus two pointers is simpler. Interviews still live in that fork."},{"id":"blk-085-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-085-t3","kind":"text","text":"Sources: Wikipedia hash table (CC BY-SA), linked not copied.\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '43 days',
    now()
  ),
(
    'feed-tech-086',
    'article',
    'Two pointers are just a moving window',
    'Two indices that only move forward turn many n² scans into n. The trick is proving you never need to move backward.

If the array is unsorted, sort first or pick another tool. Do not two-pointer a hash problem out of superstition.

Sources: Common algorithm pattern; Wikipedia page linked for the name, original wording here.

Video credit: "Attention mechanism: Overview" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=fjJOgb-E41w

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=fjJOgb-E41w',
    'https://en.wikipedia.org/wiki/Two_pointers_technique',
    'Comm Platform',
    true,
    '[{"id":"blk-086-t1","kind":"text","text":"Two indices that only move forward turn many n² scans into n. The trick is proving you never need to move backward."},{"id":"blk-086-t2","kind":"text","text":"If the array is unsorted, sort first or pick another tool. Do not two-pointer a hash problem out of superstition."},{"id":"blk-086-v1","kind":"video","url":"https://www.youtube.com/watch?v=fjJOgb-E41w","caption":"Google: Attention mechanism: Overview (official public YouTube explainer, typically a few minutes)."},{"id":"blk-086-t3","kind":"text","text":"Sources: Common algorithm pattern; Wikipedia page linked for the name, original wording here.\n\nVideo credit: \"Attention mechanism: Overview\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=fjJOgb-E41w\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '44 days',
    now()
  ),
(
    'feed-tech-087',
    'article',
    'Sliding window: grow, shrink, record',
    'A window covers a candidate substring or subarray. You expand until invalid, shrink until valid, and keep a best score.

State the invalid condition in one line. If you need four nested ifs, the window is lying to you.

Sources: The networking protocol and the array pattern share a name. Article is about the array pattern in interviews.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://en.wikipedia.org/wiki/Sliding_window_protocol',
    'Comm Platform',
    true,
    '[{"id":"blk-087-t1","kind":"text","text":"A window covers a candidate substring or subarray. You expand until invalid, shrink until valid, and keep a best score."},{"id":"blk-087-t2","kind":"text","text":"State the invalid condition in one line. If you need four nested ifs, the window is lying to you."},{"id":"blk-087-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-087-t3","kind":"text","text":"Sources: The networking protocol and the array pattern share a name. Article is about the array pattern in interviews.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '44 days',
    now()
  ),
(
    'feed-tech-088',
    'article',
    'Graphs: BFS for closest, DFS for exploring',
    'Breadth-first search finds shortest unweighted paths. Depth-first search explores. Pick based on the question, not on which one you memorized last night.

Always ask: directed? weighted? can I visit twice? The model will skip those questions. You should not.

Sources: Wikipedia graph theory (CC BY-SA), linked. Video is orchestration because distributed systems are graphs too.

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://en.wikipedia.org/wiki/Graph_theory',
    'Comm Platform',
    true,
    '[{"id":"blk-088-t1","kind":"text","text":"Breadth-first search finds shortest unweighted paths. Depth-first search explores. Pick based on the question, not on which one you memorized last night."},{"id":"blk-088-t2","kind":"text","text":"Always ask: directed? weighted? can I visit twice? The model will skip those questions. You should not."},{"id":"blk-088-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-088-t3","kind":"text","text":"Sources: Wikipedia graph theory (CC BY-SA), linked. Video is orchestration because distributed systems are graphs too.\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '45 days',
    now()
  ),
(
    'feed-tech-089',
    'article',
    'Dynamic programming is "remember the subproblem"',
    'If a recursion repeats the same arguments, store the answer. That is DP. The table is just the memory laid out in space.

Name the state before you code. If the state has four dimensions and n is 10^5, you are designing a timeout.

Sources: Wikipedia DP (CC BY-SA), linked not copied.

Video credit: "Transformers, explained" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=SZorAJ4I-sA',
    'https://en.wikipedia.org/wiki/Dynamic_programming',
    'Comm Platform',
    true,
    '[{"id":"blk-089-t1","kind":"text","text":"If a recursion repeats the same arguments, store the answer. That is DP. The table is just the memory laid out in space."},{"id":"blk-089-t2","kind":"text","text":"Name the state before you code. If the state has four dimensions and n is 10^5, you are designing a timeout."},{"id":"blk-089-v1","kind":"video","url":"https://www.youtube.com/watch?v=SZorAJ4I-sA","caption":"Google Cloud: Transformers, explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-089-t3","kind":"text","text":"Sources: Wikipedia DP (CC BY-SA), linked not copied.\n\nVideo credit: \"Transformers, explained\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '45 days',
    now()
  ),
(
    'feed-tech-090',
    'article',
    'Recursion needs a base case you could bet on',
    'Every recursive function must get smaller and must stop. Stack overflows are the compiler telling you the story never ended.

Prefer an explicit stack if the depth is input-sized. Interviewers like people who notice that before the crash.

Sources: Wikipedia recursion (CC BY-SA), linked.

Video credit: "Attention mechanism: Overview" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=fjJOgb-E41w

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=fjJOgb-E41w',
    'https://en.wikipedia.org/wiki/Recursion_(computer_science)',
    'Comm Platform',
    true,
    '[{"id":"blk-090-t1","kind":"text","text":"Every recursive function must get smaller and must stop. Stack overflows are the compiler telling you the story never ended."},{"id":"blk-090-t2","kind":"text","text":"Prefer an explicit stack if the depth is input-sized. Interviewers like people who notice that before the crash."},{"id":"blk-090-v1","kind":"video","url":"https://www.youtube.com/watch?v=fjJOgb-E41w","caption":"Google: Attention mechanism: Overview (official public YouTube explainer, typically a few minutes)."},{"id":"blk-090-t3","kind":"text","text":"Sources: Wikipedia recursion (CC BY-SA), linked.\n\nVideo credit: \"Attention mechanism: Overview\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=fjJOgb-E41w\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '46 days',
    now()
  ),
(
    'feed-tech-091',
    'article',
    'Time vs space is a negotiation',
    'You can often save time by spending memory: a hashmap, a prefix array, a DP table. The constraints tell you which side is allowed to lose.

Say the trade out loud in the interview. Silence reads as luck. A trade reads as engineering.

Sources: bigocheatsheet.com (public cheat sheet, linked).

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://www.bigocheatsheet.com/',
    'Comm Platform',
    true,
    '[{"id":"blk-091-t1","kind":"text","text":"You can often save time by spending memory: a hashmap, a prefix array, a DP table. The constraints tell you which side is allowed to lose."},{"id":"blk-091-t2","kind":"text","text":"Say the trade out loud in the interview. Silence reads as luck. A trade reads as engineering."},{"id":"blk-091-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-091-t3","kind":"text","text":"Sources: bigocheatsheet.com (public cheat sheet, linked).\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '46 days',
    now()
  ),
(
    'feed-tech-092',
    'article',
    'Test the empty input first',
    'Empty arrays, empty strings, nulls if your language has them — these are not edge cases. They are Tuesday. Hidden tests love them.

Write the empty case before the clever case. Assistants skip it. Graders do not.

Sources: JUnit user guide (public).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://junit.org/junit5/docs/current/user-guide/',
    'Comm Platform',
    true,
    '[{"id":"blk-092-t1","kind":"text","text":"Empty arrays, empty strings, nulls if your language has them — these are not edge cases. They are Tuesday. Hidden tests love them."},{"id":"blk-092-t2","kind":"text","text":"Write the empty case before the clever case. Assistants skip it. Graders do not."},{"id":"blk-092-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-092-t3","kind":"text","text":"Sources: JUnit user guide (public).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '47 days',
    now()
  ),
(
    'feed-tech-093',
    'article',
    'Property tests catch the bug you did not imagine',
    'Example tests show one story. Property tests say "for all shuffled arrays, sort is ordered." You will still want a few examples for documentation.

You do not need a fancy library to start: generate ten random inputs and check an invariant. That is already more than most submissions.

Sources: Hypothesis docs are a public property-testing reference (Python). Idea transfers to Java.

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://hypothesis.readthedocs.io/',
    'Comm Platform',
    true,
    '[{"id":"blk-093-t1","kind":"text","text":"Example tests show one story. Property tests say \"for all shuffled arrays, sort is ordered.\" You will still want a few examples for documentation."},{"id":"blk-093-t2","kind":"text","text":"You do not need a fancy library to start: generate ten random inputs and check an invariant. That is already more than most submissions."},{"id":"blk-093-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-093-t3","kind":"text","text":"Sources: Hypothesis docs are a public property-testing reference (Python). Idea transfers to Java.\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '47 days',
    now()
  ),
(
    'feed-tech-094',
    'article',
    'Read the failing test before you rewrite',
    'A surprising number of Wrong Answers are off-by-one on the first hidden case. Print the invariant. Name the indices. Then change the code.

Generated patches love to rewrite the whole function. That is how you lose the cases that already passed.

Sources: Testing practice. JUnit as a public Java reference.

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://junit.org/junit5/',
    'Comm Platform',
    true,
    '[{"id":"blk-094-t1","kind":"text","text":"A surprising number of Wrong Answers are off-by-one on the first hidden case. Print the invariant. Name the indices. Then change the code."},{"id":"blk-094-t2","kind":"text","text":"Generated patches love to rewrite the whole function. That is how you lose the cases that already passed."},{"id":"blk-094-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-094-t3","kind":"text","text":"Sources: Testing practice. JUnit as a public Java reference.\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '48 days',
    now()
  ),
(
    'feed-tech-095',
    'article',
    'Naming is a design document',
    'i, tmp, and data are how bugs hide. A name should tell you the unit and the lifetime. Interviewers read names when they are tired.

If an assistant names three things "result," you are not done. Rename until a stranger could grep the story.

Sources: Google Java Style Guide (public). We are not copying the guide; we point to it.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://google.github.io/styleguide/javaguide.html',
    'Comm Platform',
    true,
    '[{"id":"blk-095-t1","kind":"text","text":"i, tmp, and data are how bugs hide. A name should tell you the unit and the lifetime. Interviewers read names when they are tired."},{"id":"blk-095-t2","kind":"text","text":"If an assistant names three things \"result,\" you are not done. Rename until a stranger could grep the story."},{"id":"blk-095-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-095-t3","kind":"text","text":"Sources: Google Java Style Guide (public). We are not copying the guide; we point to it.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '48 days',
    now()
  ),
(
    'feed-tech-096',
    'article',
    'Comments should explain why, not narrate the syntax',
    '// increment i does not help. // skip the header row because the API is 1-indexed does.

Delete comments that duplicate the code. Keep the ones that prevent a "helpful" rewrite from breaking a protocol.

Sources: Google Java Style Guide, comments section (public).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://google.github.io/styleguide/javaguide.html#s7-javadoc',
    'Comm Platform',
    true,
    '[{"id":"blk-096-t1","kind":"text","text":"// increment i does not help. // skip the header row because the API is 1-indexed does."},{"id":"blk-096-t2","kind":"text","text":"Delete comments that duplicate the code. Keep the ones that prevent a \"helpful\" rewrite from breaking a protocol."},{"id":"blk-096-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-096-t3","kind":"text","text":"Sources: Google Java Style Guide, comments section (public).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '49 days',
    now()
  ),
(
    'feed-tech-097',
    'article',
    'APIs are promises; versions are how you keep them',
    'Once clients depend on a field, removing it is an incident. Add, deprecate, then remove on a schedule people can survive.

AI-generated clients will pin to whatever you shipped on Tuesday. Think before you rename userId to user_id in production.

Sources: OpenAPI (open). IBM OpenAPI video.

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://www.openapis.org/',
    'Comm Platform',
    true,
    '[{"id":"blk-097-t1","kind":"text","text":"Once clients depend on a field, removing it is an incident. Add, deprecate, then remove on a schedule people can survive."},{"id":"blk-097-t2","kind":"text","text":"AI-generated clients will pin to whatever you shipped on Tuesday. Think before you rename userId to user_id in production."},{"id":"blk-097-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-097-t3","kind":"text","text":"Sources: OpenAPI (open). IBM OpenAPI video.\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '49 days',
    now()
  ),
(
    'feed-tech-098',
    'article',
    'Pagination is an API design problem',
    'Offset pagination is simple and breaks when rows shift. Cursor pagination is kinder to large, live lists. Pick based on whether the feed moves.

If you return "page 3 of unknown," clients will hammer you. Return a next token or an honest empty list.

Sources: MDN Link header (CC-BY-SA). This app paginates Highlights on purpose.

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_header',
    'Comm Platform',
    true,
    '[{"id":"blk-098-t1","kind":"text","text":"Offset pagination is simple and breaks when rows shift. Cursor pagination is kinder to large, live lists. Pick based on whether the feed moves."},{"id":"blk-098-t2","kind":"text","text":"If you return \"page 3 of unknown,\" clients will hammer you. Return a next token or an honest empty list."},{"id":"blk-098-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-098-t3","kind":"text","text":"Sources: MDN Link header (CC-BY-SA). This app paginates Highlights on purpose.\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '50 days',
    now()
  ),
(
    'feed-tech-099',
    'article',
    'Feature flags beat long-lived branches',
    'A flag lets you ship dark and turn the light on later. That is safer than a week-old branch that cannot merge.

Flags need owners and expiry dates. A forgotten flag is just another undocumented environment variable.

Sources: Martin Fowler''s feature-toggles essay (public). We link; we do not reproduce it.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://martinfowler.com/articles/feature-toggles.html',
    'Comm Platform',
    true,
    '[{"id":"blk-099-t1","kind":"text","text":"A flag lets you ship dark and turn the light on later. That is safer than a week-old branch that cannot merge."},{"id":"blk-099-t2","kind":"text","text":"Flags need owners and expiry dates. A forgotten flag is just another undocumented environment variable."},{"id":"blk-099-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-099-t3","kind":"text","text":"Sources: Martin Fowler''s feature-toggles essay (public). We link; we do not reproduce it.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '50 days',
    now()
  ),
(
    'feed-tech-100',
    'article',
    'Featured: accessibility is not a phase',
    'Keyboard access, labels, and contrast are how more people use the product — including you, someday, with a broken mouse. AI-generated UI will skip labels unless you demand them.

Add a label to every control you touch this month. It is the cheapest senior-engineer signal in frontend work.

Sources: W3C WAI introduction (public).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://www.w3.org/WAI/fundamentals/accessibility-intro/',
    'Comm Platform',
    true,
    '[{"id":"blk-100-t1","kind":"text","text":"Keyboard access, labels, and contrast are how more people use the product — including you, someday, with a broken mouse. AI-generated UI will skip labels unless you demand them."},{"id":"blk-100-t2","kind":"text","text":"Add a label to every control you touch this month. It is the cheapest senior-engineer signal in frontend work."},{"id":"blk-100-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-100-t3","kind":"text","text":"Sources: W3C WAI introduction (public).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '51 days',
    now()
  ),
(
    'feed-tech-101',
    'article',
    'Semantic HTML still matters in a SPA',
    'Buttons should be buttons. Landmarks should exist. A div with an onClick is a trap for assistive tech and for you when you need to submit a form.

This app''s public pages use real headings and a main landmark on purpose. Copy that habit into your next take-home.

Sources: MDN accessibility HTML (CC-BY-SA).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML',
    'Comm Platform',
    true,
    '[{"id":"blk-101-t1","kind":"text","text":"Buttons should be buttons. Landmarks should exist. A div with an onClick is a trap for assistive tech and for you when you need to submit a form."},{"id":"blk-101-t2","kind":"text","text":"This app''s public pages use real headings and a main landmark on purpose. Copy that habit into your next take-home."},{"id":"blk-101-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-101-t3","kind":"text","text":"Sources: MDN accessibility HTML (CC-BY-SA).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '51 days',
    now()
  ),
(
    'feed-tech-102',
    'article',
    'CSS is layout, not a screenshot',
    'Flex and grid will take you further than another UI kit. Learn the box model once. Then the rest is composition.

Generated CSS is verbose. Delete half of it and see if the page still holds. That is a real skill.

Sources: MDN CSS first steps (CC-BY-SA).

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps',
    'Comm Platform',
    true,
    '[{"id":"blk-102-t1","kind":"text","text":"Flex and grid will take you further than another UI kit. Learn the box model once. Then the rest is composition."},{"id":"blk-102-t2","kind":"text","text":"Generated CSS is verbose. Delete half of it and see if the page still holds. That is a real skill."},{"id":"blk-102-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-102-t3","kind":"text","text":"Sources: MDN CSS first steps (CC-BY-SA).\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '52 days',
    now()
  ),
(
    'feed-tech-103',
    'article',
    'TypeScript is a documentation compiler',
    'Types are constraints you do not have to enforce in prose. They will not catch every bug. They will catch the "undefined is not a function" you ship on Fridays.

If an assistant infers any, make it stop. any is how the documentation lies.

Sources: TypeScript official docs.

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://www.typescriptlang.org/docs/',
    'Comm Platform',
    true,
    '[{"id":"blk-103-t1","kind":"text","text":"Types are constraints you do not have to enforce in prose. They will not catch every bug. They will catch the \"undefined is not a function\" you ship on Fridays."},{"id":"blk-103-t2","kind":"text","text":"If an assistant infers any, make it stop. any is how the documentation lies."},{"id":"blk-103-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-103-t3","kind":"text","text":"Sources: TypeScript official docs.\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '52 days',
    now()
  ),
(
    'feed-tech-104',
    'article',
    'React state is for UI, not for your database',
    'Put server state in a query layer. Put ephemeral UI in useState. Mixing them is how you fight yourself with stale caches.

When a model dumps five useEffects, you are looking at a bug farm. Rewrite with a single source of truth.

Sources: React official docs (public).

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://react.dev/learn',
    'Comm Platform',
    true,
    '[{"id":"blk-104-t1","kind":"text","text":"Put server state in a query layer. Put ephemeral UI in useState. Mixing them is how you fight yourself with stale caches."},{"id":"blk-104-t2","kind":"text","text":"When a model dumps five useEffects, you are looking at a bug farm. Rewrite with a single source of truth."},{"id":"blk-104-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-104-t3","kind":"text","text":"Sources: React official docs (public).\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '53 days',
    now()
  ),
(
    'feed-tech-105',
    'article',
    'Next.js: know where the code runs',
    'Server components, route handlers, and the browser are three different trust zones. Secrets belong on the server. Tokens on the client should be the public kind.

If you cannot say whether a file runs on the server, do not put a key in it. That rule survives every framework rename.

Sources: Next.js official docs. This admin app is Next.js; the product app is Expo.

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://nextjs.org/docs',
    'Comm Platform',
    true,
    '[{"id":"blk-105-t1","kind":"text","text":"Server components, route handlers, and the browser are three different trust zones. Secrets belong on the server. Tokens on the client should be the public kind."},{"id":"blk-105-t2","kind":"text","text":"If you cannot say whether a file runs on the server, do not put a key in it. That rule survives every framework rename."},{"id":"blk-105-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-105-t3","kind":"text","text":"Sources: Next.js official docs. This admin app is Next.js; the product app is Expo.\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '53 days',
    now()
  ),
(
    'feed-tech-106',
    'article',
    'Expo is how we ship one product to web now, phones later',
    'This product app is Expo Router: one codebase, web first. Native will reuse the same routes. That is why we care about Platform.OS and why web HTML landmarks still matter.

If you are learning here, you are learning a real stack, not a toy. Treat it that way in interviews.

Sources: Expo official docs. Description of this repo, not a paid placement.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://docs.expo.dev/',
    'Comm Platform',
    true,
    '[{"id":"blk-106-t1","kind":"text","text":"This product app is Expo Router: one codebase, web first. Native will reuse the same routes. That is why we care about Platform.OS and why web HTML landmarks still matter."},{"id":"blk-106-t2","kind":"text","text":"If you are learning here, you are learning a real stack, not a toy. Treat it that way in interviews."},{"id":"blk-106-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-106-t3","kind":"text","text":"Sources: Expo official docs. Description of this repo, not a paid placement.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '54 days',
    now()
  ),
(
    'feed-tech-107',
    'article',
    'Postgres is a product, not a folder of JSON',
    'Constraints, indexes, and transactions are why serious apps leave the JSON file. This platform already hybridizes file-store and Postgres so the app keeps running while you migrate.

Learn INSERT ... ON CONFLICT. You will use it for idempotent seeds — including this Highlights pack.

Sources: PostgreSQL official tutorial.

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://www.postgresql.org/docs/current/tutorial.html',
    'Comm Platform',
    true,
    '[{"id":"blk-107-t1","kind":"text","text":"Constraints, indexes, and transactions are why serious apps leave the JSON file. This platform already hybridizes file-store and Postgres so the app keeps running while you migrate."},{"id":"blk-107-t2","kind":"text","text":"Learn INSERT ... ON CONFLICT. You will use it for idempotent seeds — including this Highlights pack."},{"id":"blk-107-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-107-t3","kind":"text","text":"Sources: PostgreSQL official tutorial.\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '54 days',
    now()
  ),
(
    'feed-tech-108',
    'article',
    'Row Level Security is the database saying no',
    'RLS policies decide which rows a role can see even if the query is SELECT *. That is how learners can read published Highlights but not draft ones.

Never disable RLS "to test" on a shared project. You will forget to turn it back on. Use a local role instead.

Sources: PostgreSQL RLS docs (official).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://www.postgresql.org/docs/current/ddl-rowsecurity.html',
    'Comm Platform',
    true,
    '[{"id":"blk-108-t1","kind":"text","text":"RLS policies decide which rows a role can see even if the query is SELECT *. That is how learners can read published Highlights but not draft ones."},{"id":"blk-108-t2","kind":"text","text":"Never disable RLS \"to test\" on a shared project. You will forget to turn it back on. Use a local role instead."},{"id":"blk-108-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-108-t3","kind":"text","text":"Sources: PostgreSQL RLS docs (official).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '55 days',
    now()
  ),
(
    'feed-tech-109',
    'article',
    'Migrations are history, not a suggestion',
    'A migration should be runnable twice or clearly one-shot with IF NOT EXISTS. Chat-generated schema dumps that drop tables are how you lose Friday.

Keep them in git. Keep them boring. Your future incident will thank you.

Sources: PostgreSQL DDL docs. This repo numbers SQL files on purpose.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.postgresql.org/docs/current/ddl.html',
    'Comm Platform',
    true,
    '[{"id":"blk-109-t1","kind":"text","text":"A migration should be runnable twice or clearly one-shot with IF NOT EXISTS. Chat-generated schema dumps that drop tables are how you lose Friday."},{"id":"blk-109-t2","kind":"text","text":"Keep them in git. Keep them boring. Your future incident will thank you."},{"id":"blk-109-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-109-t3","kind":"text","text":"Sources: PostgreSQL DDL docs. This repo numbers SQL files on purpose.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '55 days',
    now()
  ),
(
    'feed-tech-110',
    'article',
    'Seeds are data. Generators are not SQL.',
    'If a file ends in .mjs, it is JavaScript. Pasting it into the Supabase SQL editor will fail in a confusing way. Run the generated .sql instead.

This Highlights pack follows that rule: the article source is JS, the thing you execute is SQL.

Sources: PostgreSQL populate docs. A reminder from this repo''s own foot-guns.

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://www.postgresql.org/docs/current/populate.html',
    'Comm Platform',
    true,
    '[{"id":"blk-110-t1","kind":"text","text":"If a file ends in .mjs, it is JavaScript. Pasting it into the Supabase SQL editor will fail in a confusing way. Run the generated .sql instead."},{"id":"blk-110-t2","kind":"text","text":"This Highlights pack follows that rule: the article source is JS, the thing you execute is SQL."},{"id":"blk-110-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-110-t3","kind":"text","text":"Sources: PostgreSQL populate docs. A reminder from this repo''s own foot-guns.\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '56 days',
    now()
  ),
(
    'feed-tech-111',
    'article',
    'Environment variables are not a personality',
    'Public keys can ship to the client. Service-role keys cannot. Mixing them is the fastest way to become a case study.

If a tutorial says put the secret in NEXT_PUBLIC_ or EXPO_PUBLIC_, close the tab. Then rotate the secret.

Sources: The Twelve-Factor App (public).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://12factor.net/config',
    'Comm Platform',
    true,
    '[{"id":"blk-111-t1","kind":"text","text":"Public keys can ship to the client. Service-role keys cannot. Mixing them is the fastest way to become a case study."},{"id":"blk-111-t2","kind":"text","text":"If a tutorial says put the secret in NEXT_PUBLIC_ or EXPO_PUBLIC_, close the tab. Then rotate the secret."},{"id":"blk-111-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-111-t3","kind":"text","text":"Sources: The Twelve-Factor App (public).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '56 days',
    now()
  ),
(
    'feed-tech-112',
    'article',
    'Rate limits are a product feature',
    '429 means slow down. Back off. Jitter. Do not retry in a tight loop — that is how you turn a blip into an outage, especially against an LLM API.

In interviews, mention what you retry (GET, idempotent PUT) and what you never blindly retry (charges).

Sources: MDN 429 (CC-BY-SA).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429',
    'Comm Platform',
    true,
    '[{"id":"blk-112-t1","kind":"text","text":"429 means slow down. Back off. Jitter. Do not retry in a tight loop — that is how you turn a blip into an outage, especially against an LLM API."},{"id":"blk-112-t2","kind":"text","text":"In interviews, mention what you retry (GET, idempotent PUT) and what you never blindly retry (charges)."},{"id":"blk-112-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-112-t3","kind":"text","text":"Sources: MDN 429 (CC-BY-SA).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '57 days',
    now()
  ),
(
    'feed-tech-113',
    'article',
    'Timeouts are kindness',
    'A request that waits forever holds a thread, a connection, and a user. Time out, fail, and show a message. Infinite spinners are not calm design.

Set a timeout on outbound calls, including model calls. Then test what the UI does when it fires.

Sources: MDN AbortController (CC-BY-SA).

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
    'Comm Platform',
    true,
    '[{"id":"blk-113-t1","kind":"text","text":"A request that waits forever holds a thread, a connection, and a user. Time out, fail, and show a message. Infinite spinners are not calm design."},{"id":"blk-113-t2","kind":"text","text":"Set a timeout on outbound calls, including model calls. Then test what the UI does when it fires."},{"id":"blk-113-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-113-t3","kind":"text","text":"Sources: MDN AbortController (CC-BY-SA).\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '57 days',
    now()
  ),
(
    'feed-tech-114',
    'article',
    'Featured: logs should be searchable, not poetic',
    'A log line is a query waiting to happen. Use keys. Use request ids. Do not log secrets. Do not log entire prompts if they contain user data.

AI features make this urgent: you will need to know which model version said the wrong thing at 4pm.

Sources: IBM observability topics (public).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.ibm.com/think/topics/observability',
    'Comm Platform',
    true,
    '[{"id":"blk-114-t1","kind":"text","text":"A log line is a query waiting to happen. Use keys. Use request ids. Do not log secrets. Do not log entire prompts if they contain user data."},{"id":"blk-114-t2","kind":"text","text":"AI features make this urgent: you will need to know which model version said the wrong thing at 4pm."},{"id":"blk-114-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-114-t3","kind":"text","text":"Sources: IBM observability topics (public).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '58 days',
    now()
  ),
(
    'feed-tech-115',
    'article',
    'On-call is a design constraint',
    'If nobody can be woken up, the system will still break. Design for the 3am version of you: clear dashboards, a runbook, a rollback.

You can practice without a pager: write a one-page "if the API is down" note for a project. That document is an interview story.

Sources: Google SRE Book (public). We link the book; we do not copy chapters.

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://sre.google/sre-book/introduction/',
    'Comm Platform',
    true,
    '[{"id":"blk-115-t1","kind":"text","text":"If nobody can be woken up, the system will still break. Design for the 3am version of you: clear dashboards, a runbook, a rollback."},{"id":"blk-115-t2","kind":"text","text":"You can practice without a pager: write a one-page \"if the API is down\" note for a project. That document is an interview story."},{"id":"blk-115-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-115-t3","kind":"text","text":"Sources: Google SRE Book (public). We link the book; we do not copy chapters.\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '58 days',
    now()
  ),
(
    'feed-tech-116',
    'article',
    'Rollbacks are a feature you should rehearse',
    'Forward-only migrations and un-revertable flags turn every release into a cliff. Prefer expand/contract schema changes and a version you can still boot.

Ask in interviews: "how do you undo this?" If the room goes quiet, you learned something.

Sources: Kubernetes Deployment docs (official).

Video credit: "Kubernetes vs. Docker: It''s Not an Either/Or Question" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=2vMEQ5zs1ko',
    'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/',
    'Comm Platform',
    true,
    '[{"id":"blk-116-t1","kind":"text","text":"Forward-only migrations and un-revertable flags turn every release into a cliff. Prefer expand/contract schema changes and a version you can still boot."},{"id":"blk-116-t2","kind":"text","text":"Ask in interviews: \"how do you undo this?\" If the room goes quiet, you learned something."},{"id":"blk-116-v1","kind":"video","url":"https://www.youtube.com/watch?v=2vMEQ5zs1ko","caption":"IBM Technology: Kubernetes vs. Docker: It''s Not an Either/Or Question (official public YouTube explainer, typically a few minutes)."},{"id":"blk-116-t3","kind":"text","text":"Sources: Kubernetes Deployment docs (official).\n\nVideo credit: \"Kubernetes vs. Docker: It''s Not an Either/Or Question\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '59 days',
    now()
  ),
(
    'feed-tech-117',
    'article',
    'Documentation is a user interface',
    'A README that only says "run npm start" is a trap. Include what the system is, how to configure it, and how to test it.

Generated READMEs always claim to be production-ready. Yours should admit the sharp edges.

Sources: Write the Docs beginner guide (public).

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://www.writethedocs.org/guide/writing/beginners-guide-to-docs/',
    'Comm Platform',
    true,
    '[{"id":"blk-117-t1","kind":"text","text":"A README that only says \"run npm start\" is a trap. Include what the system is, how to configure it, and how to test it."},{"id":"blk-117-t2","kind":"text","text":"Generated READMEs always claim to be production-ready. Yours should admit the sharp edges."},{"id":"blk-117-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-117-t3","kind":"text","text":"Sources: Write the Docs beginner guide (public).\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '59 days',
    now()
  ),
(
    'feed-tech-118',
    'article',
    'Code review is a conversation, not a gate of shame',
    'Ask for the invariant. Offer a smaller patch. Assume competence. AI-assisted PRs need more review, not less, because the author may not have read every line.

If you cannot explain a hunk, you cannot approve it. That rule is how you avoid becoming the incident''s footnote.

Sources: Google engineering practices — code review (public).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://google.github.io/eng-practices/review/',
    'Comm Platform',
    true,
    '[{"id":"blk-118-t1","kind":"text","text":"Ask for the invariant. Offer a smaller patch. Assume competence. AI-assisted PRs need more review, not less, because the author may not have read every line."},{"id":"blk-118-t2","kind":"text","text":"If you cannot explain a hunk, you cannot approve it. That rule is how you avoid becoming the incident''s footnote."},{"id":"blk-118-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-118-t3","kind":"text","text":"Sources: Google engineering practices — code review (public).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '60 days',
    now()
  ),
(
    'feed-tech-119',
    'article',
    'Side projects: ship something tiny and real',
    'A finished command-line tool beats an unfinished "AI platform." Hiring managers can smell scope that never landed.

Put tests and a license on it. Then you have a link that survives a messy news week.

Sources: GitHub getting started (public).

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://docs.github.com/en/get-started',
    'Comm Platform',
    true,
    '[{"id":"blk-119-t1","kind":"text","text":"A finished command-line tool beats an unfinished \"AI platform.\" Hiring managers can smell scope that never landed."},{"id":"blk-119-t2","kind":"text","text":"Put tests and a license on it. Then you have a link that survives a messy news week."},{"id":"blk-119-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-119-t3","kind":"text","text":"Sources: GitHub getting started (public).\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '60 days',
    now()
  ),
(
    'feed-tech-120',
    'article',
    'Licenses are how you stay out of trouble',
    'Code without a license is not "public domain." It is legally awkward. Pick MIT or Apache-2.0 if you want people to use the work. Do not paste random GitHub files into a product.

This feed embeds YouTube videos under YouTube''s terms and links sources instead of copying articles. That is the same instinct as picking a license: be explicit.

Sources: choosealicense.com (public, GitHub).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://choosealicense.com/',
    'Comm Platform',
    true,
    '[{"id":"blk-120-t1","kind":"text","text":"Code without a license is not \"public domain.\" It is legally awkward. Pick MIT or Apache-2.0 if you want people to use the work. Do not paste random GitHub files into a product."},{"id":"blk-120-t2","kind":"text","text":"This feed embeds YouTube videos under YouTube''s terms and links sources instead of copying articles. That is the same instinct as picking a license: be explicit."},{"id":"blk-120-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-120-t3","kind":"text","text":"Sources: choosealicense.com (public, GitHub).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '61 days',
    now()
  ),
(
    'feed-tech-121',
    'article',
    'Fair use is not a strategy for a startup',
    'Copying a news feature into your app because "we credited them" is still often just copying. Write your own words. Link out. Embed official videos instead of re-uploading them.

If you need the original, send the reader there. That is how this Highlights pack is built.

Sources: U.S. Copyright Office fair-use index (public). This is not legal advice.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://www.copyright.gov/fair-use/',
    'Comm Platform',
    true,
    '[{"id":"blk-121-t1","kind":"text","text":"Copying a news feature into your app because \"we credited them\" is still often just copying. Write your own words. Link out. Embed official videos instead of re-uploading them."},{"id":"blk-121-t2","kind":"text","text":"If you need the original, send the reader there. That is how this Highlights pack is built."},{"id":"blk-121-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-121-t3","kind":"text","text":"Sources: U.S. Copyright Office fair-use index (public). This is not legal advice.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '61 days',
    now()
  ),
(
    'feed-tech-122',
    'article',
    'Open source is a gift with rules',
    'Using a library means following its license, including notices. Generated code that vendors a GPL file into a proprietary app is a mess you cannot autocomplete away.

Keep a NOTICE file. Know what you ship. That is professional, not academic.

Sources: Open Source Definition (public).

Video credit: "REST API and OpenAPI" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    'https://opensource.org/osd',
    'Comm Platform',
    true,
    '[{"id":"blk-122-t1","kind":"text","text":"Using a library means following its license, including notices. Generated code that vendors a GPL file into a proprietary app is a mess you cannot autocomplete away."},{"id":"blk-122-t2","kind":"text","text":"Keep a NOTICE file. Know what you ship. That is professional, not academic."},{"id":"blk-122-v1","kind":"video","url":"https://www.youtube.com/watch?v=pRS9LRBgjYg","caption":"IBM Technology: REST API and OpenAPI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-122-t3","kind":"text","text":"Sources: Open Source Definition (public).\n\nVideo credit: \"REST API and OpenAPI\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=pRS9LRBgjYg\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '62 days',
    now()
  ),
(
    'feed-tech-123',
    'article',
    'Supply chain: pin, scan, update',
    'Your app is everyone else''s code. Pin versions, scan for known issues, and read changelogs before you jump majors. Blind npm update is courage without a helmet.

AI will happily add a package you did not need. Every dependency is a new pager.

Sources: OWASP Top Ten (open), plus general dependency hygiene.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://owasp.org/www-project-top-ten/',
    'Comm Platform',
    true,
    '[{"id":"blk-123-t1","kind":"text","text":"Your app is everyone else''s code. Pin versions, scan for known issues, and read changelogs before you jump majors. Blind npm update is courage without a helmet."},{"id":"blk-123-t2","kind":"text","text":"AI will happily add a package you did not need. Every dependency is a new pager."},{"id":"blk-123-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-123-t3","kind":"text","text":"Sources: OWASP Top Ten (open), plus general dependency hygiene.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '62 days',
    now()
  ),
(
    'feed-tech-124',
    'article',
    'Secrets in git are a ritual humiliation',
    'If you committed a key, rotate it. History rewrite is optional; rotation is not. Assume it was scraped.

Pre-commit hooks and secret scanning are cheaper than the all-hands. Assistants will paste keys into examples. Delete them before you push.

Sources: GitHub docs on removing sensitive data (public).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository',
    'Comm Platform',
    true,
    '[{"id":"blk-124-t1","kind":"text","text":"If you committed a key, rotate it. History rewrite is optional; rotation is not. Assume it was scraped."},{"id":"blk-124-t2","kind":"text","text":"Pre-commit hooks and secret scanning are cheaper than the all-hands. Assistants will paste keys into examples. Delete them before you push."},{"id":"blk-124-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-124-t3","kind":"text","text":"Sources: GitHub docs on removing sensitive data (public).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '63 days',
    now()
  ),
(
    'feed-tech-125',
    'article',
    'Accessibility of motion: not everyone wants the animation',
    'Short videos in this feed are optional: they sit under the text. If you add autoplay animations in your own UI, respect reduced-motion settings.

A 90-second explainer is a courtesy. A looping video with sound is an attack.

Sources: MDN prefers-reduced-motion (CC-BY-SA).

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion',
    'Comm Platform',
    true,
    '[{"id":"blk-125-t1","kind":"text","text":"Short videos in this feed are optional: they sit under the text. If you add autoplay animations in your own UI, respect reduced-motion settings."},{"id":"blk-125-t2","kind":"text","text":"A 90-second explainer is a courtesy. A looping video with sound is an attack."},{"id":"blk-125-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-125-t3","kind":"text","text":"Sources: MDN prefers-reduced-motion (CC-BY-SA).\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '63 days',
    now()
  ),
(
    'feed-tech-126',
    'article',
    'Writing is an engineering tool',
    'A design doc that names the user, the constraint, and the rollback will beat a clever function. Models can draft. You still choose the argument.

Practice by explaining one problem you solved here in five sentences. That is interview prep hiding in a blog habit.

Sources: Google Technical Writing courses (public).

Video credit: "Introduction to large language models" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=zizonToFXDs',
    'https://developers.google.com/tech-writing',
    'Comm Platform',
    true,
    '[{"id":"blk-126-t1","kind":"text","text":"A design doc that names the user, the constraint, and the rollback will beat a clever function. Models can draft. You still choose the argument."},{"id":"blk-126-t2","kind":"text","text":"Practice by explaining one problem you solved here in five sentences. That is interview prep hiding in a blog habit."},{"id":"blk-126-v1","kind":"video","url":"https://www.youtube.com/watch?v=zizonToFXDs","caption":"Google Cloud: Introduction to large language models (official public YouTube explainer, typically a few minutes)."},{"id":"blk-126-t3","kind":"text","text":"Sources: Google Technical Writing courses (public).\n\nVideo credit: \"Introduction to large language models\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=zizonToFXDs\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '64 days',
    now()
  ),
(
    'feed-tech-127',
    'article',
    'Estimates are ranges, not personality tests',
    'If you have never done the work, your estimate is a guess with extra meetings. Give a range and the biggest risk. Then measure.

AI does not make estimates honest. It makes them overconfident. Keep the range.

Sources: IBM agile topic (public).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.ibm.com/think/topics/agile-software-development',
    'Comm Platform',
    true,
    '[{"id":"blk-127-t1","kind":"text","text":"If you have never done the work, your estimate is a guess with extra meetings. Give a range and the biggest risk. Then measure."},{"id":"blk-127-t2","kind":"text","text":"AI does not make estimates honest. It makes them overconfident. Keep the range."},{"id":"blk-127-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-127-t3","kind":"text","text":"Sources: IBM agile topic (public).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '64 days',
    now()
  ),
(
    'feed-tech-128',
    'article',
    'Meetings are for decisions, tickets are for work',
    'If a meeting has no decision and no owner, it was a podcast. Write the decision down. The next reorg will delete the attendees, not the doc — if the doc exists.

This is how teams stay fast when headcount drops: fewer status rituals, more written state.

Sources: IBM agile topic (public). Career commentary is ours.

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://www.ibm.com/think/topics/agile-software-development',
    'Comm Platform',
    true,
    '[{"id":"blk-128-t1","kind":"text","text":"If a meeting has no decision and no owner, it was a podcast. Write the decision down. The next reorg will delete the attendees, not the doc — if the doc exists."},{"id":"blk-128-t2","kind":"text","text":"This is how teams stay fast when headcount drops: fewer status rituals, more written state."},{"id":"blk-128-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-128-t3","kind":"text","text":"Sources: IBM agile topic (public). Career commentary is ours.\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '65 days',
    now()
  ),
(
    'feed-tech-129',
    'article',
    'Mentorship is a multiplier in a thin org',
    'When layers get cut, knowledge has to move sideways. A thirty-minute pairing session can replace a missing manager if you write down what you learned.

Ask for one concrete review a week. Offer one. That network is more durable than a title.

Sources: Google Technical Writing (public). Mentorship notes are ours.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://developers.google.com/tech-writing',
    'Comm Platform',
    true,
    '[{"id":"blk-129-t1","kind":"text","text":"When layers get cut, knowledge has to move sideways. A thirty-minute pairing session can replace a missing manager if you write down what you learned."},{"id":"blk-129-t2","kind":"text","text":"Ask for one concrete review a week. Offer one. That network is more durable than a title."},{"id":"blk-129-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-129-t3","kind":"text","text":"Sources: Google Technical Writing (public). Mentorship notes are ours.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '65 days',
    now()
  ),
(
    'feed-tech-130',
    'article',
    'Burnout is not a badge',
    'A layoff wave plus an always-on news feed is a lot of nervous system. Practice is good. Sleep is also good. You cannot grep your way out of exhaustion.

Protect a shutdown time. The tracker will still be there in the morning. So will the problems on this site.

Sources: WHO note on burnout as an occupational phenomenon (public). Not medical advice. If you are in crisis, seek local professional help.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases',
    'Comm Platform',
    true,
    '[{"id":"blk-130-t1","kind":"text","text":"A layoff wave plus an always-on news feed is a lot of nervous system. Practice is good. Sleep is also good. You cannot grep your way out of exhaustion."},{"id":"blk-130-t2","kind":"text","text":"Protect a shutdown time. The tracker will still be there in the morning. So will the problems on this site."},{"id":"blk-130-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-130-t3","kind":"text","text":"Sources: WHO note on burnout as an occupational phenomenon (public). Not medical advice. If you are in crisis, seek local professional help.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '66 days',
    now()
  ),
(
    'feed-tech-131',
    'article',
    'Public speaking for engineers: one idea per slide',
    'If you demo an AI feature, show the failure too. Credibility is the product. A smooth path that never errors teaches the room the wrong lesson.

Rehearse the sentence: here is what it does, here is what it must not do, here is how we measure. Then sit down.

Sources: Google Technical Writing (public).

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://developers.google.com/tech-writing',
    'Comm Platform',
    true,
    '[{"id":"blk-131-t1","kind":"text","text":"If you demo an AI feature, show the failure too. Credibility is the product. A smooth path that never errors teaches the room the wrong lesson."},{"id":"blk-131-t2","kind":"text","text":"Rehearse the sentence: here is what it does, here is what it must not do, here is how we measure. Then sit down."},{"id":"blk-131-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-131-t3","kind":"text","text":"Sources: Google Technical Writing (public).\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '66 days',
    now()
  ),
(
    'feed-tech-132',
    'article',
    'Side income vs moonlighting policies',
    'Many employers own what you build on their time or with their tools. A weekend app can still collide with a contract. Read the paper you signed.

When in doubt, ask. Surprise IP claims are a worse surprise than a rejected PR.

Sources: Not legal advice. Read your employment agreement. choosealicense.com linked as a reminder that IP is a real thing.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://choosealicense.com/',
    'Comm Platform',
    true,
    '[{"id":"blk-132-t1","kind":"text","text":"Many employers own what you build on their time or with their tools. A weekend app can still collide with a contract. Read the paper you signed."},{"id":"blk-132-t2","kind":"text","text":"When in doubt, ask. Surprise IP claims are a worse surprise than a rejected PR."},{"id":"blk-132-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-132-t3","kind":"text","text":"Sources: Not legal advice. Read your employment agreement. choosealicense.com linked as a reminder that IP is a real thing.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '67 days',
    now()
  ),
(
    'feed-tech-133',
    'article',
    'Remote work is a protocol',
    'Remote teams die without written decisions, overlapping hours, and dashboards. Emoji is not a protocol.

If your team went thinner after cuts, over-communicate in the doc, not in a 20-person huddle.

Sources: Twelve-Factor (public) as a metaphor for explicit config and logs.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://12factor.net/',
    'Comm Platform',
    true,
    '[{"id":"blk-133-t1","kind":"text","text":"Remote teams die without written decisions, overlapping hours, and dashboards. Emoji is not a protocol."},{"id":"blk-133-t2","kind":"text","text":"If your team went thinner after cuts, over-communicate in the doc, not in a 20-person huddle."},{"id":"blk-133-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-133-t3","kind":"text","text":"Sources: Twelve-Factor (public) as a metaphor for explicit config and logs.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '67 days',
    now()
  ),
(
    'feed-tech-134',
    'article',
    'Interns: ask for the real repo',
    'A toy intern project that never ships teaches you toy habits. Ask what production means here: tests, review, on-call shadowing.

Companies that still hire interns after a cut cycle usually want leverage. Give them a person who can land a small change safely.

Sources: GitHub getting started (public).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://docs.github.com/en/get-started',
    'Comm Platform',
    true,
    '[{"id":"blk-134-t1","kind":"text","text":"A toy intern project that never ships teaches you toy habits. Ask what production means here: tests, review, on-call shadowing."},{"id":"blk-134-t2","kind":"text","text":"Companies that still hire interns after a cut cycle usually want leverage. Give them a person who can land a small change safely."},{"id":"blk-134-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-134-t3","kind":"text","text":"Sources: GitHub getting started (public).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '68 days',
    now()
  ),
(
    'feed-tech-135',
    'article',
    'New grads: depth beats a zoo of frameworks',
    'One language, one SQL, one HTTP mental model will beat six unfinished Next.js clones. Committees can tell.

Use this site to go deep on Java, C, or C++. Use the feed to stay literate in AI without becoming a news addict.

Sources: MDN Learn (CC-BY-SA).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Learn',
    'Comm Platform',
    true,
    '[{"id":"blk-135-t1","kind":"text","text":"One language, one SQL, one HTTP mental model will beat six unfinished Next.js clones. Committees can tell."},{"id":"blk-135-t2","kind":"text","text":"Use this site to go deep on Java, C, or C++. Use the feed to stay literate in AI without becoming a news addict."},{"id":"blk-135-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-135-t3","kind":"text","text":"Sources: MDN Learn (CC-BY-SA).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '68 days',
    now()
  ),
(
    'feed-tech-136',
    'article',
    'Staff+ work is deleting the wrong work',
    'Seniority is often subtractive: fewer handoffs, fewer flags, fewer pages. AI that creates more dashboards nobody reads is not leverage.

If you want that level, practice saying no with data. That skill is scarce in a hype cycle.

Sources: Google SRE Book, toil chapter (public), linked not copied.

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://sre.google/sre-book/eliminating-toil/',
    'Comm Platform',
    true,
    '[{"id":"blk-136-t1","kind":"text","text":"Seniority is often subtractive: fewer handoffs, fewer flags, fewer pages. AI that creates more dashboards nobody reads is not leverage."},{"id":"blk-136-t2","kind":"text","text":"If you want that level, practice saying no with data. That skill is scarce in a hype cycle."},{"id":"blk-136-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-136-t3","kind":"text","text":"Sources: Google SRE Book, toil chapter (public), linked not copied.\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '69 days',
    now()
  ),
(
    'feed-tech-137',
    'article',
    'Managers in a flatter org',
    'When layers go, remaining managers have wider trees. They need people who do not need daily unblocking. That is you, if you write things down.

Make your status boring: what shipped, what is stuck, what you need. Boring is a gift.

Sources: IBM DevOps explainer. Management comments are general.

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.ibm.com/think/topics/devops',
    'Comm Platform',
    true,
    '[{"id":"blk-137-t1","kind":"text","text":"When layers go, remaining managers have wider trees. They need people who do not need daily unblocking. That is you, if you write things down."},{"id":"blk-137-t2","kind":"text","text":"Make your status boring: what shipped, what is stuck, what you need. Boring is a gift."},{"id":"blk-137-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-137-t3","kind":"text","text":"Sources: IBM DevOps explainer. Management comments are general.\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '69 days',
    now()
  ),
(
    'feed-tech-138',
    'article',
    'Customer empathy is a debugging tool',
    'A "stupid user" story is usually an interface bug. AI that mocks the user will train you to ship contempt. Do not.

Read one support ticket a week if you can. Then write the test that would have prevented it.

Sources: W3C WAI (public). Empathy notes are ours.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://www.w3.org/WAI/fundamentals/accessibility-intro/',
    'Comm Platform',
    true,
    '[{"id":"blk-138-t1","kind":"text","text":"A \"stupid user\" story is usually an interface bug. AI that mocks the user will train you to ship contempt. Do not."},{"id":"blk-138-t2","kind":"text","text":"Read one support ticket a week if you can. Then write the test that would have prevented it."},{"id":"blk-138-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-138-t3","kind":"text","text":"Sources: W3C WAI (public). Empathy notes are ours.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '70 days',
    now()
  ),
(
    'feed-tech-139',
    'article',
    'Privacy is a feature you can name',
    'Collect less. Keep it shorter. Say why. Those three sentences beat a 40-page policy nobody reads.

If your AI feature needs the whole mailbox, you probably designed the wrong feature.

Sources: W3C privacy hub (public). Not legal advice.

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://www.w3.org/Privacy/',
    'Comm Platform',
    true,
    '[{"id":"blk-139-t1","kind":"text","text":"Collect less. Keep it shorter. Say why. Those three sentences beat a 40-page policy nobody reads."},{"id":"blk-139-t2","kind":"text","text":"If your AI feature needs the whole mailbox, you probably designed the wrong feature."},{"id":"blk-139-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-139-t3","kind":"text","text":"Sources: W3C privacy hub (public). Not legal advice.\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '70 days',
    now()
  ),
(
    'feed-tech-140',
    'article',
    'Energy: your laptop is not the bill, the cluster is',
    'Training and serving large models uses real electricity. That does not make your for-loop unethical. It does mean "just train it again" is a cost and an environmental choice.

Prefer reuse, smaller models, and fewer wasted eval runs. Efficiency is an engineering aesthetic with side benefits.

Sources: Google Cloud sustainability pages (public). Not a scientific paper.

Video credit: "What is a foundation model? (2-minute AI with Google)" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=CyqDIkV6DLY',
    'https://cloud.google.com/sustainability',
    'Comm Platform',
    true,
    '[{"id":"blk-140-t1","kind":"text","text":"Training and serving large models uses real electricity. That does not make your for-loop unethical. It does mean \"just train it again\" is a cost and an environmental choice."},{"id":"blk-140-t2","kind":"text","text":"Prefer reuse, smaller models, and fewer wasted eval runs. Efficiency is an engineering aesthetic with side benefits."},{"id":"blk-140-v1","kind":"video","url":"https://www.youtube.com/watch?v=CyqDIkV6DLY","caption":"Google: What is a foundation model? (2-minute AI with Google) (official public YouTube explainer, typically a few minutes)."},{"id":"blk-140-t3","kind":"text","text":"Sources: Google Cloud sustainability pages (public). Not a scientific paper.\n\nVideo credit: \"What is a foundation model? (2-minute AI with Google)\" by Google on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=CyqDIkV6DLY\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '71 days',
    now()
  ),
(
    'feed-tech-141',
    'article',
    'Localization is not a translate button',
    'Languages wrap, expand, and flip. Dates are political. Currency is lossy. A model that "translates the UI" will break layout and meaning.

Externalize strings. Use real locale libraries. Then let a human review the languages you actually ship.

Sources: MDN i18n (CC-BY-SA).

Video credit: "Introduction to Generative AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=G2fqAlgmoPo',
    'https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization',
    'Comm Platform',
    true,
    '[{"id":"blk-141-t1","kind":"text","text":"Languages wrap, expand, and flip. Dates are political. Currency is lossy. A model that \"translates the UI\" will break layout and meaning."},{"id":"blk-141-t2","kind":"text","text":"Externalize strings. Use real locale libraries. Then let a human review the languages you actually ship."},{"id":"blk-141-v1","kind":"video","url":"https://www.youtube.com/watch?v=G2fqAlgmoPo","caption":"Google Cloud: Introduction to Generative AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-141-t3","kind":"text","text":"Sources: MDN i18n (CC-BY-SA).\n\nVideo credit: \"Introduction to Generative AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=G2fqAlgmoPo\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '71 days',
    now()
  ),
(
    'feed-tech-142',
    'article',
    'Timezones will ruin a perfectly good demo',
    'Store instants in UTC. Convert at the edge. Naive local timestamps are why "it passed in my city" is a famous last sentence.

Hidden tests on this platform that involve dates will punish you if you improvise. Be boring.

Sources: MDN Date (CC-BY-SA). Store UTC, display local — still the rule.

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
    'Comm Platform',
    true,
    '[{"id":"blk-142-t1","kind":"text","text":"Store instants in UTC. Convert at the edge. Naive local timestamps are why \"it passed in my city\" is a famous last sentence."},{"id":"blk-142-t2","kind":"text","text":"Hidden tests on this platform that involve dates will punish you if you improvise. Be boring."},{"id":"blk-142-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-142-t3","kind":"text","text":"Sources: MDN Date (CC-BY-SA). Store UTC, display local — still the rule.\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '72 days',
    now()
  ),
(
    'feed-tech-143',
    'article',
    'Unicode is not "weird characters"',
    'People''s names, emoji, and right-to-left text will enter your forms. Length in characters is not length in bytes. Truncation can split a grapheme and create nonsense.

Test with a name that is not ASCII. If your app explodes, you found a real bug before a customer did.

Sources: Unicode Consortium (public).

Video credit: "Introduction to Responsible AI" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=w_3L1Bf2P_g',
    'https://unicode.org/standard/WhatIsUnicode.html',
    'Comm Platform',
    true,
    '[{"id":"blk-143-t1","kind":"text","text":"People''s names, emoji, and right-to-left text will enter your forms. Length in characters is not length in bytes. Truncation can split a grapheme and create nonsense."},{"id":"blk-143-t2","kind":"text","text":"Test with a name that is not ASCII. If your app explodes, you found a real bug before a customer did."},{"id":"blk-143-v1","kind":"video","url":"https://www.youtube.com/watch?v=w_3L1Bf2P_g","caption":"Google Cloud: Introduction to Responsible AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-143-t3","kind":"text","text":"Sources: Unicode Consortium (public).\n\nVideo credit: \"Introduction to Responsible AI\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=w_3L1Bf2P_g\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '72 days',
    now()
  ),
(
    'feed-tech-144',
    'article',
    'Floating point is a treaty, not a number line',
    '0.1 + 0.2 is a meme because binary fractions cannot hold most decimals. Money should be integers of the minor unit, or a decimal type.

Do not let a model put a double on a ledger. That bug is older than the web and still ships.

Sources: IEEE 754 via Wikipedia (CC BY-SA), linked.

Video credit: "Transformers, explained" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=SZorAJ4I-sA',
    'https://en.wikipedia.org/wiki/IEEE_754',
    'Comm Platform',
    true,
    '[{"id":"blk-144-t1","kind":"text","text":"0.1 + 0.2 is a meme because binary fractions cannot hold most decimals. Money should be integers of the minor unit, or a decimal type."},{"id":"blk-144-t2","kind":"text","text":"Do not let a model put a double on a ledger. That bug is older than the web and still ships."},{"id":"blk-144-v1","kind":"video","url":"https://www.youtube.com/watch?v=SZorAJ4I-sA","caption":"Google Cloud: Transformers, explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-144-t3","kind":"text","text":"Sources: IEEE 754 via Wikipedia (CC BY-SA), linked.\n\nVideo credit: \"Transformers, explained\" by Google Cloud on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=SZorAJ4I-sA\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '73 days',
    now()
  ),
(
    'feed-tech-145',
    'article',
    'Randomness needs a seed in tests',
    'Flaky tests that "sometimes shuffle wrong" are unseeded randomness. Pass a seed in CI. Save exploration for production features that actually need entropy.

ML evals have the same issue: if you cannot replay the sample, you cannot debug the regression.

Sources: Wikipedia PRNG (CC BY-SA), linked.

Video credit: "Introduction to Machine Learning on Vertex AI" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=-3Olw-C4FN4',
    'https://en.wikipedia.org/wiki/Pseudorandom_number_generator',
    'Comm Platform',
    true,
    '[{"id":"blk-145-t1","kind":"text","text":"Flaky tests that \"sometimes shuffle wrong\" are unseeded randomness. Pass a seed in CI. Save exploration for production features that actually need entropy."},{"id":"blk-145-t2","kind":"text","text":"ML evals have the same issue: if you cannot replay the sample, you cannot debug the regression."},{"id":"blk-145-v1","kind":"video","url":"https://www.youtube.com/watch?v=-3Olw-C4FN4","caption":"Google Cloud Tech: Introduction to Machine Learning on Vertex AI (official public YouTube explainer, typically a few minutes)."},{"id":"blk-145-t3","kind":"text","text":"Sources: Wikipedia PRNG (CC BY-SA), linked.\n\nVideo credit: \"Introduction to Machine Learning on Vertex AI\" by Google Cloud Tech on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=-3Olw-C4FN4\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '73 days',
    now()
  ),
(
    'feed-tech-146',
    'article',
    'Concurrency: if it is shared, it needs a rule',
    'Two threads, one mutable object, no lock or immutability story — that is a bug you will only see in production. Happens-before is the adult word for "who saw what when."

Prefer isolation: don''t share. Then messages. Then locks. Models love a synchronized on everything. That is not a design.

Sources: Oracle Java concurrency tutorial (public).

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://docs.oracle.com/javase/tutorial/essential/concurrency/',
    'Comm Platform',
    true,
    '[{"id":"blk-146-t1","kind":"text","text":"Two threads, one mutable object, no lock or immutability story — that is a bug you will only see in production. Happens-before is the adult word for \"who saw what when.\""},{"id":"blk-146-t2","kind":"text","text":"Prefer isolation: don''t share. Then messages. Then locks. Models love a synchronized on everything. That is not a design."},{"id":"blk-146-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-146-t3","kind":"text","text":"Sources: Oracle Java concurrency tutorial (public).\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '74 days',
    now()
  ),
(
    'feed-tech-147',
    'article',
    'Deadlocks are polite forever',
    'Lock A then B in one thread, B then A in another, and you can wait until the process is killed. Timeouts and a lock order are the usual exits.

Distributed locks have the same shape with extra network. If you think you need one, write the failure case first.

Sources: Oracle deadlock tutorial (public).

Video credit: "Kubernetes vs. Docker: It''s Not an Either/Or Question" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=2vMEQ5zs1ko',
    'https://docs.oracle.com/javase/tutorial/essential/concurrency/deadlock.html',
    'Comm Platform',
    true,
    '[{"id":"blk-147-t1","kind":"text","text":"Lock A then B in one thread, B then A in another, and you can wait until the process is killed. Timeouts and a lock order are the usual exits."},{"id":"blk-147-t2","kind":"text","text":"Distributed locks have the same shape with extra network. If you think you need one, write the failure case first."},{"id":"blk-147-v1","kind":"video","url":"https://www.youtube.com/watch?v=2vMEQ5zs1ko","caption":"IBM Technology: Kubernetes vs. Docker: It''s Not an Either/Or Question (official public YouTube explainer, typically a few minutes)."},{"id":"blk-147-t3","kind":"text","text":"Sources: Oracle deadlock tutorial (public).\n\nVideo credit: \"Kubernetes vs. Docker: It''s Not an Either/Or Question\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=2vMEQ5zs1ko\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '74 days',
    now()
  ),
(
    'feed-tech-148',
    'article',
    'N+1 queries are a loop you did not see',
    'Fetching a list, then querying per row, is how a page dies at 200 records. Join, or batch, or cache the set.

ORMs hide this. Logs will not. Print the query count in development like you mean it.

Sources: PostgreSQL joins tutorial (official).

Video credit: "What is a REST API?" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=lsMQRaeKNDk',
    'https://www.postgresql.org/docs/current/tutorial-join.html',
    'Comm Platform',
    true,
    '[{"id":"blk-148-t1","kind":"text","text":"Fetching a list, then querying per row, is how a page dies at 200 records. Join, or batch, or cache the set."},{"id":"blk-148-t2","kind":"text","text":"ORMs hide this. Logs will not. Print the query count in development like you mean it."},{"id":"blk-148-v1","kind":"video","url":"https://www.youtube.com/watch?v=lsMQRaeKNDk","caption":"IBM Technology: What is a REST API? (official public YouTube explainer, typically a few minutes)."},{"id":"blk-148-t3","kind":"text","text":"Sources: PostgreSQL joins tutorial (official).\n\nVideo credit: \"What is a REST API?\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=lsMQRaeKNDk\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '75 days',
    now()
  ),
(
    'feed-tech-149',
    'article',
    'Pagination plus a join is where EXPLAIN earns rent',
    'A pretty query that sorts a million rows to show 20 is not pretty. Limit early. Index the filter. Measure.

If an assistant writes SELECT *, assume it is wrong until EXPLAIN says otherwise.

Sources: PostgreSQL EXPLAIN docs (official).

Video credit: "Container Orchestration Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=kBF6Bvth0zw',
    'https://www.postgresql.org/docs/current/using-explain.html',
    'Comm Platform',
    true,
    '[{"id":"blk-149-t1","kind":"text","text":"A pretty query that sorts a million rows to show 20 is not pretty. Limit early. Index the filter. Measure."},{"id":"blk-149-t2","kind":"text","text":"If an assistant writes SELECT *, assume it is wrong until EXPLAIN says otherwise."},{"id":"blk-149-v1","kind":"video","url":"https://www.youtube.com/watch?v=kBF6Bvth0zw","caption":"IBM Technology: Container Orchestration Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-149-t3","kind":"text","text":"Sources: PostgreSQL EXPLAIN docs (official).\n\nVideo credit: \"Container Orchestration Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=kBF6Bvth0zw\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '75 days',
    now()
  ),
(
    'feed-tech-150',
    'article',
    'Backups are a restore test, not a file',
    'You do not have a backup until you have restored it. The rest is hope. Hope is not a disaster plan.

Schedule the restore drill. Especially before you let an agent run DELETE.

Sources: PostgreSQL backup docs (official).

Video credit: "Cloud Native DevOps Explained" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.

Watch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE

Article text is original Comm Platform commentary (2026). It is not copied from a news outlet.',
    'https://www.youtube.com/watch?v=FzERTm_j2wE',
    'https://www.postgresql.org/docs/current/backup.html',
    'Comm Platform',
    true,
    '[{"id":"blk-150-t1","kind":"text","text":"You do not have a backup until you have restored it. The rest is hope. Hope is not a disaster plan."},{"id":"blk-150-t2","kind":"text","text":"Schedule the restore drill. Especially before you let an agent run DELETE."},{"id":"blk-150-v1","kind":"video","url":"https://www.youtube.com/watch?v=FzERTm_j2wE","caption":"IBM Technology: Cloud Native DevOps Explained (official public YouTube explainer, typically a few minutes)."},{"id":"blk-150-t3","kind":"text","text":"Sources: PostgreSQL backup docs (official).\n\nVideo credit: \"Cloud Native DevOps Explained\" by IBM Technology on YouTube. Comm Platform embeds the public watch link; we do not own or re-host the footage.\n\nWatch on YouTube: https://www.youtube.com/watch?v=FzERTm_j2wE\n\nArticle text is original Comm Platform commentary (2026). It is not copied from a news outlet."}]'::jsonb,
    now() - interval '76 days',
    now()
  )
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
