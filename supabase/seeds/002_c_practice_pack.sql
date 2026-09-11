-- C practice pack for Comm Platform
-- 38 original problems (16 easy, 14 medium, 8 hard).
-- IDs 201-238 avoid clashing with seed questions (ids 1-6) and other language packs.
--
-- Run this entire file in the Supabase SQL editor as the postgres role.
-- Do not run scripts/*.mjs — those are JavaScript generators, not SQL.
-- After it succeeds, open Admin → Skills → C to review/edit.
-- Student app lists published problems for skill-c.
--
-- Catalog
-- 01. [EASY  ] Desk Label  (desk-label)
-- 02. [EASY  ] Pair Total  (pair-total)
-- 03. [EASY  ] Shift Parity  (shift-parity)
-- 04. [EASY  ] Tallest of Trio  (tallest-of-trio)
-- 05. [EASY  ] Times Chart  (times-chart)
-- 06. [EASY  ] Lab Factorial  (lab-factorial)
-- 07. [EASY  ] Digit Census  (digit-census)
-- 08. [EASY  ] Mirror Integer  (mirror-integer)
-- 09. [EASY  ] Conveyor Total  (conveyor-total)
-- 10. [EASY  ] Peak Reading  (peak-reading)
-- 11. [EASY  ] Shelf Lookup  (shelf-lookup)
-- 12. [EASY  ] Vowel Tally  (vowel-tally)
-- 13. [EASY  ] Echo Palindrome  (echo-palindrome)
-- 14. [EASY  ] Report Bands  (report-bands)
-- 15. [EASY  ] Clock Chime  (clock-chime)
-- 16. [EASY  ] Prefix Walk  (prefix-walk)
-- 17. [MEDIUM] Checkout Pair  (checkout-pair)
-- 18. [MEDIUM] Packed Zeros  (packed-zeros)
-- 19. [MEDIUM] First Lone Letter  (first-lone-letter)
-- 20. [MEDIUM] Letter Bag Match  (letter-bag-match)
-- 21. [MEDIUM] Sorted Probe  (sorted-probe)
-- 22. [MEDIUM] Belt Rotate  (belt-rotate)
-- 23. [MEDIUM] Best Stretch Sum  (best-stretch-sum)
-- 24. [MEDIUM] Crowd Leader  (crowd-leader)
-- 25. [MEDIUM] Bracket Balance  (bracket-balance)
-- 26. [MEDIUM] Twin Lists Merge  (twin-lists-merge)
-- 27. [MEDIUM] Grid Trace  (grid-trace)
-- 28. [MEDIUM] Run Length Note  (run-length-note)
-- 29. [MEDIUM] Next Taller  (next-taller)
-- 30. [MEDIUM] Unique Compact  (unique-compact)
-- 31. [HARD  ] Valley Reservoir  (valley-reservoir)
-- 32. [HARD  ] Rising Sequence  (rising-sequence)
-- 33. [HARD  ] Token Machine  (token-machine)
-- 34. [HARD  ] Phrase Split  (phrase-split)
-- 35. [HARD  ] Tightest Cover  (tightest-cover)
-- 36. [HARD  ] Spell Distance  (spell-distance)
-- 37. [HARD  ] Seat Queens  (seat-queens)
-- 38. [HARD  ] Island Census  (island-census)

begin;

insert into public.practice_skills (id, name, slug, language_key, sequence, enabled)
values ('skill-c', 'C', 'c', 'c', 2, true)
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
  ('topic-input-output', 'Input/Output', 'input-output', 1, true),
  ('topic-conditionals', 'Conditionals', 'conditionals', 2, true),
  ('topic-loops', 'Loops', 'loops', 3, true),
  ('topic-math', 'Math', 'math', 4, true),
  ('topic-array', 'Array', 'array', 5, true),
  ('topic-string', 'String', 'string', 6, true),
  ('topic-searching', 'Searching', 'searching', 7, true),
  ('topic-sorting', 'Sorting', 'sorting', 8, true),
  ('topic-hashmap', 'HashMap', 'hashmap', 9, true),
  ('topic-stack', 'Stack', 'stack', 10, true),
  ('topic-two-pointers', 'Two Pointers', 'two-pointers', 11, true),
  ('topic-recursion', 'Recursion', 'recursion', 12, true),
  ('topic-dynamic-programming', 'Dynamic Programming', 'dynamic-programming', 13, true),
  ('topic-greedy', 'Greedy', 'greedy', 14, true),
  ('topic-matrix', 'Matrix', 'matrix', 15, true),
  ('topic-graph', 'Graph', 'graph', 16, true),
  ('topic-hashing', 'Hashing', 'hashing', 17, true)
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
(
    201,
    'ps-skill-c',
    1,
    'Desk Label',
    'desk-label',
    'EASY',
    'Print a two-line desk tag. The first line is a staff first name (a single word). The second line must be the text `ID: ` followed by their numeric badge, with a space after the colon.',
    'Line 1: a single word (the name).
Line 2: an integer badge id.',
    'Two lines: the name, then `ID: <badge>`.',
    '1 <= name.length <= 20
name contains only letters
1 <= badge <= 10^6',
    '[{"input":"Alice\n42","output":"Alice\nID: 42"},{"input":"Ravi\n7","output":"Ravi\nID: 7"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Input/Output"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t201-1","input":"Alice\n42","expectedOutput":"Alice\nID: 42","hidden":false,"sequence":1},{"id":"t201-2","input":"Ravi\n7","expectedOutput":"Ravi\nID: 7","hidden":false,"sequence":2},{"id":"t201-3","input":"Zara\n1001","expectedOutput":"Zara\nID: 1001","hidden":true,"sequence":3},{"id":"t201-4","input":"Ken\n1","expectedOutput":"Ken\nID: 1","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    202,
    'ps-skill-c',
    2,
    'Pair Total',
    'pair-total',
    'EASY',
    'Read two integers and print their sum. This is the first arithmetic drill: parse two tokens and write one number.',
    'A single line with two integers `a` and `b`.',
    'One integer: `a + b`.',
    '-10^9 <= a, b <= 10^9',
    '[{"input":"1 2","output":"3"},{"input":"-5 10","output":"5"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Math","Input/Output"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t202-1","input":"1 2","expectedOutput":"3","hidden":false,"sequence":1},{"id":"t202-2","input":"-5 10","expectedOutput":"5","hidden":false,"sequence":2},{"id":"t202-3","input":"0 0","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t202-4","input":"1000000000 -1","expectedOutput":"999999999","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    203,
    'ps-skill-c',
    3,
    'Shift Parity',
    'shift-parity',
    'EASY',
    'A machine reports a whole number. Print `EVEN` if it is divisible by 2, otherwise print `ODD`. Zero counts as even.',
    'A single integer `n`.',
    '`EVEN` or `ODD`.',
    '-10^9 <= n <= 10^9',
    '[{"input":"4","output":"EVEN"},{"input":"7","output":"ODD"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Conditionals","Math"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t203-1","input":"4","expectedOutput":"EVEN","hidden":false,"sequence":1},{"id":"t203-2","input":"7","expectedOutput":"ODD","hidden":false,"sequence":2},{"id":"t203-3","input":"0","expectedOutput":"EVEN","hidden":true,"sequence":3},{"id":"t203-4","input":"-3","expectedOutput":"ODD","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    204,
    'ps-skill-c',
    4,
    'Tallest of Trio',
    'tallest-of-trio',
    'EASY',
    'Three height readings arrive on one line. Print the largest value. Ties are allowed; any of the equal maxima is fine because they share the same number.',
    'Three integers `a`, `b`, and `c`.',
    'The maximum of the three.',
    '-10^9 <= a, b, c <= 10^9',
    '[{"input":"1 9 3","output":"9"},{"input":"-1 -8 -3","output":"-1"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Conditionals"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t204-1","input":"1 9 3","expectedOutput":"9","hidden":false,"sequence":1},{"id":"t204-2","input":"-1 -8 -3","expectedOutput":"-1","hidden":false,"sequence":2},{"id":"t204-3","input":"5 5 5","expectedOutput":"5","hidden":true,"sequence":3},{"id":"t204-4","input":"0 12 -20","expectedOutput":"12","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    205,
    'ps-skill-c',
    5,
    'Times Chart',
    'times-chart',
    'EASY',
    'Print the first ten multiples of `n` on one line, separated by spaces: `n*1` through `n*10`.',
    'A single integer `n`.',
    'Ten space-separated integers.',
    '1 <= n <= 1000',
    '[{"input":"3","output":"3 6 9 12 15 18 21 24 27 30"},{"input":"1","output":"1 2 3 4 5 6 7 8 9 10"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Loops","Math"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t205-1","input":"3","expectedOutput":"3 6 9 12 15 18 21 24 27 30","hidden":false,"sequence":1},{"id":"t205-2","input":"1","expectedOutput":"1 2 3 4 5 6 7 8 9 10","hidden":false,"sequence":2},{"id":"t205-3","input":"10","expectedOutput":"10 20 30 40 50 60 70 80 90 100","hidden":true,"sequence":3},{"id":"t205-4","input":"7","expectedOutput":"7 14 21 28 35 42 49 56 63 70","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    206,
    'ps-skill-c',
    6,
    'Lab Factorial',
    'lab-factorial',
    'EASY',
    'Compute `n!` using a loop (not recursion). Treat `0!` as 1. Values fit in a 32-bit signed integer for the given limits.',
    'A single integer `n`.',
    'One integer: `n!`.',
    '0 <= n <= 12',
    '[{"input":"5","output":"120"},{"input":"0","output":"1"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Loops","Math"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t206-1","input":"5","expectedOutput":"120","hidden":false,"sequence":1},{"id":"t206-2","input":"0","expectedOutput":"1","hidden":false,"sequence":2},{"id":"t206-3","input":"7","expectedOutput":"5040","hidden":true,"sequence":3},{"id":"t206-4","input":"12","expectedOutput":"479001600","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    207,
    'ps-skill-c',
    7,
    'Digit Census',
    'digit-census',
    'EASY',
    'Count how many decimal digits `n` has. Ignore a leading minus sign. The number `0` has one digit.',
    'A single integer `n`.',
    'The digit count.',
    '-2^31 <= n <= 2^31 - 1',
    '[{"input":"123","output":"3"},{"input":"0","output":"1"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Math","Loops"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t207-1","input":"123","expectedOutput":"3","hidden":false,"sequence":1},{"id":"t207-2","input":"0","expectedOutput":"1","hidden":false,"sequence":2},{"id":"t207-3","input":"-90","expectedOutput":"2","hidden":true,"sequence":3},{"id":"t207-4","input":"100000","expectedOutput":"6","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    208,
    'ps-skill-c',
    8,
    'Mirror Integer',
    'mirror-integer',
    'EASY',
    'Reverse the decimal digits of `n` and print the result. Keep the original sign. Leading zeros created by reversing are dropped (so `-450` becomes `-54`).',
    'A single integer `n`.',
    'The reversed integer.',
    '-10^9 <= n <= 10^9',
    '[{"input":"123","output":"321"},{"input":"-450","output":"-54"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Math"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t208-1","input":"123","expectedOutput":"321","hidden":false,"sequence":1},{"id":"t208-2","input":"-450","expectedOutput":"-54","hidden":false,"sequence":2},{"id":"t208-3","input":"0","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t208-4","input":"100","expectedOutput":"1","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    209,
    'ps-skill-c',
    9,
    'Conveyor Total',
    'conveyor-total',
    'EASY',
    'A conveyor lists `n` package weights. Print the sum of all weights.',
    'Line 1: integer `n`.
Line 2: `n` space-separated integers.',
    'The sum of the `n` values.',
    '1 <= n <= 10^5
-10^4 <= a[i] <= 10^4',
    '[{"input":"3\n1 2 3","output":"6"},{"input":"1\n-4","output":"-4"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Array","Loops"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t209-1","input":"3\n1 2 3","expectedOutput":"6","hidden":false,"sequence":1},{"id":"t209-2","input":"1\n-4","expectedOutput":"-4","hidden":false,"sequence":2},{"id":"t209-3","input":"5\n0 0 0 0 10","expectedOutput":"10","hidden":true,"sequence":3},{"id":"t209-4","input":"4\n8 -2 1 -1","expectedOutput":"6","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    210,
    'ps-skill-c',
    10,
    'Peak Reading',
    'peak-reading',
    'EASY',
    'Print the largest value in an array of sensor readings.',
    'Line 1: `n`.
Line 2: `n` integers.',
    'The maximum value.',
    '1 <= n <= 10^5
-10^9 <= a[i] <= 10^9',
    '[{"input":"4\n2 8 1 5","output":"8"},{"input":"2\n-3 -1","output":"-1"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t210-1","input":"4\n2 8 1 5","expectedOutput":"8","hidden":false,"sequence":1},{"id":"t210-2","input":"2\n-3 -1","expectedOutput":"-1","hidden":false,"sequence":2},{"id":"t210-3","input":"1\n42","expectedOutput":"42","hidden":true,"sequence":3},{"id":"t210-4","input":"5\n0 0 0 0 0","expectedOutput":"0","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    211,
    'ps-skill-c',
    11,
    'Shelf Lookup',
    'shelf-lookup',
    'EASY',
    'Find the first 0-based index where `target` appears in the list. If it never appears, print `-1`.',
    'Line 1: `n`.
Line 2: `n` integers.
Line 3: `target`.',
    'The first matching index, or `-1`.',
    '1 <= n <= 10^5
-10^9 <= a[i], target <= 10^9',
    '[{"input":"5\n4 9 1 9 2\n9","output":"1"},{"input":"3\n1 2 3\n7","output":"-1"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Searching","Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t211-1","input":"5\n4 9 1 9 2\n9","expectedOutput":"1","hidden":false,"sequence":1},{"id":"t211-2","input":"3\n1 2 3\n7","expectedOutput":"-1","hidden":false,"sequence":2},{"id":"t211-3","input":"1\n8\n8","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t211-4","input":"4\n5 5 5 5\n5","expectedOutput":"0","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    212,
    'ps-skill-c',
    12,
    'Vowel Tally',
    'vowel-tally',
    'EASY',
    'Count vowels in a word. Count both lowercase and uppercase `a e i o u`. The letter `y` is not a vowel here.',
    'One line: a word `s` with no spaces.',
    'The vowel count.',
    '1 <= |s| <= 10^5
s contains only English letters',
    '[{"input":"Education","output":"5"},{"input":"rhythm","output":"0"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["String"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t212-1","input":"Education","expectedOutput":"5","hidden":false,"sequence":1},{"id":"t212-2","input":"rhythm","expectedOutput":"0","hidden":false,"sequence":2},{"id":"t212-3","input":"AEIOU","expectedOutput":"5","hidden":true,"sequence":3},{"id":"t212-4","input":"Java","expectedOutput":"2","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    213,
    'ps-skill-c',
    13,
    'Echo Palindrome',
    'echo-palindrome',
    'EASY',
    'Print `YES` if the word reads the same forwards and backwards, otherwise `NO`. Comparison is case-sensitive and uses the characters exactly as given.',
    'One line: string `s` with no spaces.',
    '`YES` or `NO`.',
    '1 <= |s| <= 10^5
s contains only letters',
    '[{"input":"level","output":"YES"},{"input":"Java","output":"NO"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["String","Two Pointers"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t213-1","input":"level","expectedOutput":"YES","hidden":false,"sequence":1},{"id":"t213-2","input":"Java","expectedOutput":"NO","hidden":false,"sequence":2},{"id":"t213-3","input":"abba","expectedOutput":"YES","hidden":true,"sequence":3},{"id":"t213-4","input":"a","expectedOutput":"YES","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    214,
    'ps-skill-c',
    14,
    'Report Bands',
    'report-bands',
    'EASY',
    'Map a score to a letter band:
- A if score >= 90
- B if score >= 80
- C if score >= 70
- D if score >= 60
- F otherwise',
    'A single integer `score`.',
    'One letter: A, B, C, D, or F.',
    '0 <= score <= 100',
    '[{"input":"92","output":"A","explanation":"92 is at least 90."},{"input":"80","output":"B","explanation":"80 is at least 80 but below 90."}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Conditionals"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t214-1","input":"92","expectedOutput":"A","hidden":false,"sequence":1},{"id":"t214-2","input":"80","expectedOutput":"B","hidden":false,"sequence":2},{"id":"t214-3","input":"70","expectedOutput":"C","hidden":true,"sequence":3},{"id":"t214-4","input":"59","expectedOutput":"F","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    215,
    'ps-skill-c',
    15,
    'Clock Chime',
    'clock-chime',
    'EASY',
    'For each integer `i` from 1 to `n` print a token:
- `Chime` if `i` is divisible by both 3 and 5
- `Tick` if `i` is divisible only by 3
- `Tock` if `i` is divisible only by 5
- the number `i` otherwise
Print the tokens on one line, separated by spaces.',
    'A single integer `n`.',
    '`n` space-separated tokens.',
    '1 <= n <= 200',
    '[{"input":"5","output":"1 2 Tick 4 Tock"},{"input":"15","output":"1 2 Tick 4 Tock Tick 7 8 Tick Tock 11 Tick 13 14 Chime"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Loops","Conditionals"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t215-1","input":"5","expectedOutput":"1 2 Tick 4 Tock","hidden":false,"sequence":1},{"id":"t215-2","input":"15","expectedOutput":"1 2 Tick 4 Tock Tick 7 8 Tick Tock 11 Tick 13 14 Chime","hidden":false,"sequence":2},{"id":"t215-3","input":"1","expectedOutput":"1","hidden":true,"sequence":3},{"id":"t215-4","input":"10","expectedOutput":"1 2 Tick 4 Tock Tick 7 8 Tick Tock","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    216,
    'ps-skill-c',
    16,
    'Prefix Walk',
    'prefix-walk',
    'EASY',
    'Print running totals: the k-th output value is the sum of the first k array elements.',
    'Line 1: `n`.
Line 2: `n` integers.',
    '`n` space-separated prefix sums.',
    '1 <= n <= 10^5
-10^4 <= a[i] <= 10^4',
    '[{"input":"4\n1 2 3 4","output":"1 3 6 10"},{"input":"3\n-1 2 -3","output":"-1 1 -2"}]'::jsonb,
    'skill-c',
    'level-easy',
    '["Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t216-1","input":"4\n1 2 3 4","expectedOutput":"1 3 6 10","hidden":false,"sequence":1},{"id":"t216-2","input":"3\n-1 2 -3","expectedOutput":"-1 1 -2","hidden":false,"sequence":2},{"id":"t216-3","input":"1\n9","expectedOutput":"9","hidden":true,"sequence":3},{"id":"t216-4","input":"5\n0 0 5 0 1","expectedOutput":"0 0 5 5 6","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    217,
    'ps-skill-c',
    17,
    'Checkout Pair',
    'checkout-pair',
    'MEDIUM',
    'A cashier has a list of item prices and a gift-card amount `target`. Print two 0-based indexes of prices that add up exactly to `target`. Exactly one valid pair exists. If several index pairs would work, print the pair whose left index is smallest; if still tied, the one with the smaller right index.',
    'Line 1: `n`.
Line 2: `n` integers (prices).
Line 3: `target`.',
    'Two space-separated indexes (0-based).',
    '2 <= n <= 10^4
-10^9 <= prices[i], target <= 10^9',
    '[{"input":"4\n2 7 11 15\n9","output":"0 1","explanation":"2 + 7 = 9 at indexes 0 and 1."},{"input":"3\n3 2 4\n6","output":"1 2","explanation":"2 + 4 = 6."}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Array","Hashing"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t217-1","input":"4\n2 7 11 15\n9","expectedOutput":"0 1","hidden":false,"sequence":1},{"id":"t217-2","input":"3\n3 2 4\n6","expectedOutput":"1 2","hidden":false,"sequence":2},{"id":"t217-3","input":"2\n5 5\n10","expectedOutput":"0 1","hidden":true,"sequence":3},{"id":"t217-4","input":"4\n0 4 -4 8\n0","expectedOutput":"1 2","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    218,
    'ps-skill-c',
    18,
    'Packed Zeros',
    'packed-zeros',
    'MEDIUM',
    'Shift every zero to the end of the list while keeping the relative order of the non-zero values.',
    'Line 1: `n`.
Line 2: `n` integers.',
    'The rearranged list, space-separated.',
    '1 <= n <= 10^5
-10^4 <= a[i] <= 10^4',
    '[{"input":"5\n0 1 0 3 12","output":"1 3 12 0 0"},{"input":"4\n4 3 2 1","output":"4 3 2 1"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Array","Two Pointers"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t218-1","input":"5\n0 1 0 3 12","expectedOutput":"1 3 12 0 0","hidden":false,"sequence":1},{"id":"t218-2","input":"4\n4 3 2 1","expectedOutput":"4 3 2 1","hidden":false,"sequence":2},{"id":"t218-3","input":"1\n0","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t218-4","input":"6\n0 0 1 0 2 3","expectedOutput":"1 2 3 0 0 0","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    219,
    'ps-skill-c',
    19,
    'First Lone Letter',
    'first-lone-letter',
    'MEDIUM',
    'Find the first character that appears exactly once in `s` (left to right). If every character repeats, print `-`. Comparison is case-sensitive.',
    'One line: string `s` with no spaces.',
    'A single character, or `-`.',
    '1 <= |s| <= 10^5
s contains only letters',
    '[{"input":"leetcode","output":"l"},{"input":"aabb","output":"-"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["String","Hashing"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t219-1","input":"leetcode","expectedOutput":"l","hidden":false,"sequence":1},{"id":"t219-2","input":"aabb","expectedOutput":"-","hidden":false,"sequence":2},{"id":"t219-3","input":"loveleetcode","expectedOutput":"v","hidden":true,"sequence":3},{"id":"t219-4","input":"z","expectedOutput":"z","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    220,
    'ps-skill-c',
    20,
    'Letter Bag Match',
    'letter-bag-match',
    'MEDIUM',
    'Print `YES` if the two words use exactly the same letters with the same frequencies (an anagram), otherwise `NO`. Case-sensitive.',
    'Line 1: string `a`.
Line 2: string `b`.',
    '`YES` or `NO`.',
    '1 <= |a|, |b| <= 10^5',
    '[{"input":"listen\nsilent","output":"YES"},{"input":"rat\ncar","output":"NO"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["String","Hashing"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t220-1","input":"listen\nsilent","expectedOutput":"YES","hidden":false,"sequence":1},{"id":"t220-2","input":"rat\ncar","expectedOutput":"NO","hidden":false,"sequence":2},{"id":"t220-3","input":"a\na","expectedOutput":"YES","hidden":true,"sequence":3},{"id":"t220-4","input":"aabb\nabab","expectedOutput":"YES","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    221,
    'ps-skill-c',
    21,
    'Sorted Probe',
    'sorted-probe',
    'MEDIUM',
    'The array is sorted in non-decreasing order. Return the 0-based index of `target`, or `-1` if it is missing. Duplicate values: return any valid index. Aim for logarithmic time.',
    'Line 1: `n`.
Line 2: `n` sorted integers.
Line 3: `target`.',
    'Index of `target`, or `-1`.',
    '1 <= n <= 10^5
-10^9 <= a[i], target <= 10^9',
    '[{"input":"5\n-1 0 3 5 9\n3","output":"2"},{"input":"5\n-1 0 3 5 9\n2","output":"-1"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Searching","Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t221-1","input":"5\n-1 0 3 5 9\n3","expectedOutput":"2","hidden":false,"sequence":1},{"id":"t221-2","input":"5\n-1 0 3 5 9\n2","expectedOutput":"-1","hidden":false,"sequence":2},{"id":"t221-3","input":"1\n1\n1","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t221-4","input":"6\n1 2 2 2 3 4\n4","expectedOutput":"5","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    222,
    'ps-skill-c',
    22,
    'Belt Rotate',
    'belt-rotate',
    'MEDIUM',
    'Rotate the list to the right by `k` positions. `k` may be larger than `n`; use `k modulo n`. Right rotate means the last element moves to the front, `k` times.',
    'Line 1: `n` and `k`.
Line 2: `n` integers.',
    'The rotated list, space-separated.',
    '1 <= n <= 10^5
0 <= k <= 10^9
-10^4 <= a[i] <= 10^4',
    '[{"input":"5 3\n1 2 3 4 5","output":"3 4 5 1 2"},{"input":"4 2\n-1 -100 3 99","output":"3 99 -1 -100"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t222-1","input":"5 3\n1 2 3 4 5","expectedOutput":"3 4 5 1 2","hidden":false,"sequence":1},{"id":"t222-2","input":"4 2\n-1 -100 3 99","expectedOutput":"3 99 -1 -100","hidden":false,"sequence":2},{"id":"t222-3","input":"1 99\n7","expectedOutput":"7","hidden":true,"sequence":3},{"id":"t222-4","input":"3 0\n1 2 3","expectedOutput":"1 2 3","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    223,
    'ps-skill-c',
    23,
    'Best Stretch Sum',
    'best-stretch-sum',
    'MEDIUM',
    'Find a contiguous slice of the array whose values add up to the largest possible total, and print that total. The slice must contain at least one element (so an all-negative array yields the largest single value).',
    'Line 1: `n`.
Line 2: `n` integers.',
    'The maximum contiguous sum.',
    '1 <= n <= 10^5
-10^4 <= a[i] <= 10^4',
    '[{"input":"9\n-2 1 -3 4 -1 2 1 -5 4","output":"6"},{"input":"1\n-5","output":"-5"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Array","Dynamic Programming"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t223-1","input":"9\n-2 1 -3 4 -1 2 1 -5 4","expectedOutput":"6","hidden":false,"sequence":1},{"id":"t223-2","input":"1\n-5","expectedOutput":"-5","hidden":false,"sequence":2},{"id":"t223-3","input":"3\n1 2 3","expectedOutput":"6","hidden":true,"sequence":3},{"id":"t223-4","input":"4\n-1 -2 -3 -4","expectedOutput":"-1","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    224,
    'ps-skill-c',
    24,
    'Crowd Leader',
    'crowd-leader',
    'MEDIUM',
    'Exactly one value appears more than `n / 2` times (integer division). Print that value.',
    'Line 1: `n`.
Line 2: `n` integers.',
    'The majority value.',
    '1 <= n <= 10^5
-10^9 <= a[i] <= 10^9',
    '[{"input":"3\n3 2 3","output":"3"},{"input":"7\n2 2 1 1 1 2 2","output":"2"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Hashing","Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t224-1","input":"3\n3 2 3","expectedOutput":"3","hidden":false,"sequence":1},{"id":"t224-2","input":"7\n2 2 1 1 1 2 2","expectedOutput":"2","hidden":false,"sequence":2},{"id":"t224-3","input":"1\n8","expectedOutput":"8","hidden":true,"sequence":3},{"id":"t224-4","input":"5\n0 0 1 0 2","expectedOutput":"0","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    225,
    'ps-skill-c',
    25,
    'Bracket Balance',
    'bracket-balance',
    'MEDIUM',
    'A string contains only `()`, `[]`, and `{}`. Print `YES` if every opening bracket is closed by the matching type in the correct order, otherwise `NO`.',
    'One line: bracket string `s`.',
    '`YES` or `NO`.',
    '1 <= |s| <= 10^5
s contains only ()[]{}',
    '[{"input":"()[]{}","output":"YES"},{"input":"(]","output":"NO"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Stack","String"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t225-1","input":"()[]{}","expectedOutput":"YES","hidden":false,"sequence":1},{"id":"t225-2","input":"(]","expectedOutput":"NO","hidden":false,"sequence":2},{"id":"t225-3","input":"{[]}","expectedOutput":"YES","hidden":true,"sequence":3},{"id":"t225-4","input":"([)]","expectedOutput":"NO","hidden":true,"sequence":4},{"id":"t225-5","input":"((","expectedOutput":"NO","hidden":true,"sequence":5}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    226,
    'ps-skill-c',
    26,
    'Twin Lists Merge',
    'twin-lists-merge',
    'MEDIUM',
    'Merge two already-sorted (non-decreasing) lists into one sorted list.',
    'Line 1: `n` and `m`.
Line 2: `n` sorted integers.
Line 3: `m` sorted integers.',
    '`n + m` space-separated integers in non-decreasing order.',
    '1 <= n, m <= 10^5
-10^9 <= values <= 10^9',
    '[{"input":"2 3\n1 3\n2 4 6","output":"1 2 3 4 6"},{"input":"1 1\n5\n2","output":"2 5"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Sorting","Two Pointers","Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t226-1","input":"2 3\n1 3\n2 4 6","expectedOutput":"1 2 3 4 6","hidden":false,"sequence":1},{"id":"t226-2","input":"1 1\n5\n2","expectedOutput":"2 5","hidden":false,"sequence":2},{"id":"t226-3","input":"3 1\n1 1 1\n1","expectedOutput":"1 1 1 1","hidden":true,"sequence":3},{"id":"t226-4","input":"2 2\n-5 0\n-3 8","expectedOutput":"-5 -3 0 8","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    227,
    'ps-skill-c',
    27,
    'Grid Trace',
    'grid-trace',
    'MEDIUM',
    'Given an `n` by `n` grid, print the sum of the main diagonal (cells where row index equals column index, 0-based).',
    'Line 1: `n`.
Next `n` lines: `n` integers each.',
    'The main-diagonal sum.',
    '1 <= n <= 200
-10^4 <= grid[i][j] <= 10^4',
    '[{"input":"3\n1 2 3\n4 5 6\n7 8 9","output":"15"},{"input":"2\n10 0\n0 -4","output":"6"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Matrix","Math"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t227-1","input":"3\n1 2 3\n4 5 6\n7 8 9","expectedOutput":"15","hidden":false,"sequence":1},{"id":"t227-2","input":"2\n10 0\n0 -4","expectedOutput":"6","hidden":false,"sequence":2},{"id":"t227-3","input":"1\n9","expectedOutput":"9","hidden":true,"sequence":3},{"id":"t227-4","input":"3\n0 1 2\n3 0 4\n5 6 0","expectedOutput":"0","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    228,
    'ps-skill-c',
    28,
    'Run Length Note',
    'run-length-note',
    'MEDIUM',
    'Compress consecutive repeats: for each run of the same character, write the character once. If the run length is greater than 1, append that count immediately after the character. Example: `aabccc` becomes `a2bc3`.',
    'One line: string `s` of lowercase letters.',
    'The compressed string.',
    '1 <= |s| <= 10^5',
    '[{"input":"aabccc","output":"a2bc3"},{"input":"abc","output":"abc"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["String"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t228-1","input":"aabccc","expectedOutput":"a2bc3","hidden":false,"sequence":1},{"id":"t228-2","input":"abc","expectedOutput":"abc","hidden":false,"sequence":2},{"id":"t228-3","input":"zzzz","expectedOutput":"z4","hidden":true,"sequence":3},{"id":"t228-4","input":"aaabaa","expectedOutput":"a3ba2","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    229,
    'ps-skill-c',
    29,
    'Next Taller',
    'next-taller',
    'MEDIUM',
    'For each height, print the nearest strictly taller height to its right. If none exists, print `-1` for that position. Scan from the right with a stack for an efficient solution.',
    'Line 1: `n`.
Line 2: `n` integers.',
    '`n` space-separated answers.',
    '1 <= n <= 10^5
1 <= h[i] <= 10^9',
    '[{"input":"4\n2 1 2 4","output":"4 2 4 -1"},{"input":"3\n3 2 1","output":"-1 -1 -1"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Stack","Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t229-1","input":"4\n2 1 2 4","expectedOutput":"4 2 4 -1","hidden":false,"sequence":1},{"id":"t229-2","input":"3\n3 2 1","expectedOutput":"-1 -1 -1","hidden":false,"sequence":2},{"id":"t229-3","input":"1\n7","expectedOutput":"-1","hidden":true,"sequence":3},{"id":"t229-4","input":"5\n1 3 2 4 4","expectedOutput":"3 4 4 -1 -1","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    230,
    'ps-skill-c',
    30,
    'Unique Compact',
    'unique-compact',
    'MEDIUM',
    'The array is sorted non-decreasing. Print the distinct values in order, once each.',
    'Line 1: `n`.
Line 2: `n` sorted integers.',
    'The unique values, space-separated.',
    '1 <= n <= 10^5
-10^9 <= a[i] <= 10^9',
    '[{"input":"5\n1 1 2 2 3","output":"1 2 3"},{"input":"4\n0 0 0 0","output":"0"}]'::jsonb,
    'skill-c',
    'level-medium',
    '["Array","Two Pointers"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t230-1","input":"5\n1 1 2 2 3","expectedOutput":"1 2 3","hidden":false,"sequence":1},{"id":"t230-2","input":"4\n0 0 0 0","expectedOutput":"0","hidden":false,"sequence":2},{"id":"t230-3","input":"3\n-2 -2 5","expectedOutput":"-2 5","hidden":true,"sequence":3},{"id":"t230-4","input":"1\n9","expectedOutput":"9","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    231,
    'ps-skill-c',
    31,
    'Valley Reservoir',
    'valley-reservoir',
    'HARD',
    'Bars of width 1 stand at heights `h[i]`. Rain fills every unit that is trapped between taller bars. Water cannot sit on top of a bar. Print how many unit squares of water remain after it settles.',
    'Line 1: `n`.
Line 2: `n` non-negative integers.',
    'Total trapped units.',
    '1 <= n <= 2 * 10^4
0 <= h[i] <= 10^5',
    '[{"input":"12\n0 1 0 2 1 0 1 3 2 1 2 1","output":"6"},{"input":"3\n2 0 2","output":"2"}]'::jsonb,
    'skill-c',
    'level-hard',
    '["Array","Two Pointers"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t231-1","input":"12\n0 1 0 2 1 0 1 3 2 1 2 1","expectedOutput":"6","hidden":false,"sequence":1},{"id":"t231-2","input":"3\n2 0 2","expectedOutput":"2","hidden":false,"sequence":2},{"id":"t231-3","input":"1\n5","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t231-4","input":"6\n4 2 0 3 2 5","expectedOutput":"9","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    232,
    'ps-skill-c',
    32,
    'Rising Sequence',
    'rising-sequence',
    'HARD',
    'Print the length of the longest strictly increasing subsequence (not necessarily contiguous).',
    'Line 1: `n`.
Line 2: `n` integers.',
    'The length of the longest strictly increasing subsequence.',
    '1 <= n <= 2000
-10^9 <= a[i] <= 10^9',
    '[{"input":"8\n10 9 2 5 3 7 101 18","output":"4"},{"input":"5\n5 4 3 2 1","output":"1"}]'::jsonb,
    'skill-c',
    'level-hard',
    '["Dynamic Programming","Array"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t232-1","input":"8\n10 9 2 5 3 7 101 18","expectedOutput":"4","hidden":false,"sequence":1},{"id":"t232-2","input":"5\n5 4 3 2 1","expectedOutput":"1","hidden":false,"sequence":2},{"id":"t232-3","input":"1\n7","expectedOutput":"1","hidden":true,"sequence":3},{"id":"t232-4","input":"6\n1 2 3 4 5 6","expectedOutput":"6","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    233,
    'ps-skill-c',
    33,
    'Token Machine',
    'token-machine',
    'HARD',
    'A machine accepts unlimited coins of the given denominations. Print the fewest coins needed to make exactly `amount`. If it is impossible, print `-1`. Making amount `0` takes `0` coins.',
    'Line 1: `n` (number of denominations) and `amount`.
Line 2: `n` distinct positive integers (coin values).',
    'Minimum coins, or `-1`.',
    '1 <= n <= 50
0 <= amount <= 5000
1 <= coin[i] <= 10^4',
    '[{"input":"3 11\n1 2 5","output":"3","explanation":"5 + 5 + 1 uses three coins."},{"input":"1 3\n2","output":"-1","explanation":"Odd amounts cannot be formed with only 2."}]'::jsonb,
    'skill-c',
    'level-hard',
    '["Dynamic Programming","Greedy"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t233-1","input":"3 11\n1 2 5","expectedOutput":"3","hidden":false,"sequence":1},{"id":"t233-2","input":"1 3\n2","expectedOutput":"-1","hidden":false,"sequence":2},{"id":"t233-3","input":"2 0\n1 2","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t233-4","input":"3 30\n1 5 10","expectedOutput":"3","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    234,
    'ps-skill-c',
    34,
    'Phrase Split',
    'phrase-split',
    'HARD',
    'Print `YES` if the word `s` can be assembled by concatenating words from the dictionary (each dictionary word may be reused). Print `NO` otherwise.',
    'Line 1: string `s`.
Line 2: integer `k`.
Next `k` lines: dictionary words.',
    '`YES` or `NO`.',
    '1 <= |s| <= 200
1 <= k <= 50
1 <= |word| <= 20',
    '[{"input":"applepenapple\n2\napple\npen","output":"YES"},{"input":"catsandog\n5\ncats\ndog\nsand\nand\ncat","output":"NO"}]'::jsonb,
    'skill-c',
    'level-hard',
    '["Dynamic Programming","String","Hashing"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t234-1","input":"applepenapple\n2\napple\npen","expectedOutput":"YES","hidden":false,"sequence":1},{"id":"t234-2","input":"catsandog\n5\ncats\ndog\nsand\nand\ncat","expectedOutput":"NO","hidden":false,"sequence":2},{"id":"t234-3","input":"aaaaaaa\n2\naaaa\naaa","expectedOutput":"YES","hidden":true,"sequence":3},{"id":"t234-4","input":"a\n1\nb","expectedOutput":"NO","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    235,
    'ps-skill-c',
    35,
    'Tightest Cover',
    'tightest-cover',
    'HARD',
    'Find the shortest substring of `s` that contains every character of `t` (including duplicates). If several shortest windows exist, print the leftmost one. If none exists, print `EMPTY`.',
    'Line 1: string `s`.
Line 2: string `t`.',
    'The shortest covering substring, or `EMPTY`.',
    '1 <= |s| <= 2000
1 <= |t| <= 80
s and t contain uppercase letters only',
    '[{"input":"ADOBECODEBANC\nABC","output":"BANC"},{"input":"A\nA","output":"A"}]'::jsonb,
    'skill-c',
    'level-hard',
    '["String","Hashing","Two Pointers"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t235-1","input":"ADOBECODEBANC\nABC","expectedOutput":"BANC","hidden":false,"sequence":1},{"id":"t235-2","input":"A\nA","expectedOutput":"A","hidden":false,"sequence":2},{"id":"t235-3","input":"A\nAA","expectedOutput":"EMPTY","hidden":true,"sequence":3},{"id":"t235-4","input":"AA\nAA","expectedOutput":"AA","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    236,
    'ps-skill-c',
    36,
    'Spell Distance',
    'spell-distance',
    'HARD',
    'Convert word `a` into word `b` using single-character inserts, deletes, or replacements. Print the minimum number of operations.',
    'Line 1: string `a`.
Line 2: string `b`.',
    'The edit distance (a non-negative integer).',
    '1 <= |a|, |b| <= 200
lowercase English letters only',
    '[{"input":"horse\nros","output":"3"},{"input":"intention\nexecution","output":"5"}]'::jsonb,
    'skill-c',
    'level-hard',
    '["Dynamic Programming","String"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t236-1","input":"horse\nros","expectedOutput":"3","hidden":false,"sequence":1},{"id":"t236-2","input":"intention\nexecution","expectedOutput":"5","hidden":false,"sequence":2},{"id":"t236-3","input":"a\na","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t236-4","input":"abc\ndef","expectedOutput":"3","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    237,
    'ps-skill-c',
    37,
    'Seat Queens',
    'seat-queens',
    'HARD',
    'Count the ways to place `n` queens on an `n` by `n` board so that none share a row, column, or diagonal. Print the number of distinct boards. Rotations count as different if the cell sets differ.',
    'A single integer `n`.',
    'The number of solutions.',
    '1 <= n <= 8',
    '[{"input":"4","output":"2"},{"input":"1","output":"1"}]'::jsonb,
    'skill-c',
    'level-hard',
    '["Recursion","Matrix"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t237-1","input":"4","expectedOutput":"2","hidden":false,"sequence":1},{"id":"t237-2","input":"1","expectedOutput":"1","hidden":false,"sequence":2},{"id":"t237-3","input":"2","expectedOutput":"0","hidden":true,"sequence":3},{"id":"t237-4","input":"5","expectedOutput":"10","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  ),
(
    238,
    'ps-skill-c',
    38,
    'Island Census',
    'island-census',
    'HARD',
    'A grid of `0` (water) and `1` (land). An island is a group of land cells connected by 4-direction edges (up/down/left/right, not diagonals). Print how many islands are on the map.',
    'Line 1: `rows` and `cols`.
Next `rows` lines: `cols` integers (`0` or `1`) each.',
    'The island count.',
    '1 <= rows, cols <= 50',
    '[{"input":"4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1","output":"3"},{"input":"1 1\n0","output":"0"}]'::jsonb,
    'skill-c',
    'level-hard',
    '["Graph","Matrix","Recursion"]'::jsonb,
    '["c"]'::jsonb,
    '{"c":"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n    \n    return 0;\n}"}'::jsonb,
    '[{"id":"t238-1","input":"4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1","expectedOutput":"3","hidden":false,"sequence":1},{"id":"t238-2","input":"1 1\n0","expectedOutput":"0","hidden":false,"sequence":2},{"id":"t238-3","input":"2 2\n1 0\n0 1","expectedOutput":"2","hidden":true,"sequence":3},{"id":"t238-4","input":"1 4\n1 1 1 1","expectedOutput":"1","hidden":true,"sequence":4}]'::jsonb,
    true,
    now(),
    now()
  )
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
