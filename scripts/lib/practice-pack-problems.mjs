/** Shared 38-problem curriculum (language packs assign ids + starter code). */
function tc(id, input, expectedOutput, hidden, sequence) {
  return { id, input, expectedOutput, hidden, sequence };
}

function examplesFrom(tests) {
  return tests
    .filter((t) => !t.hidden)
    .slice(0, 2)
    .map((t) => ({ input: t.input, output: t.expectedOutput }));
}

const TOPICS = [
  ['topic-input-output', 'Input/Output', 'input-output', 1],
  ['topic-conditionals', 'Conditionals', 'conditionals', 2],
  ['topic-loops', 'Loops', 'loops', 3],
  ['topic-math', 'Math', 'math', 4],
  ['topic-array', 'Array', 'array', 5],
  ['topic-string', 'String', 'string', 6],
  ['topic-searching', 'Searching', 'searching', 7],
  ['topic-sorting', 'Sorting', 'sorting', 8],
  ['topic-hashmap', 'HashMap', 'hashmap', 9],
  ['topic-stack', 'Stack', 'stack', 10],
  ['topic-two-pointers', 'Two Pointers', 'two-pointers', 11],
  ['topic-recursion', 'Recursion', 'recursion', 12],
  ['topic-dynamic-programming', 'Dynamic Programming', 'dynamic-programming', 13],
  ['topic-greedy', 'Greedy', 'greedy', 14],
  ['topic-matrix', 'Matrix', 'matrix', 15],
  ['topic-graph', 'Graph', 'graph', 16],
];

const problems = [];

function add(p) {
  const testCases = p.tests.map((t, i) => ({ ...t, sequence: t.sequence ?? i + 1 }));
  problems.push({
    sequence: p.sequence,
    title: p.title,
    slug: p.slug,
    difficulty: p.difficulty,
    levelId: p.difficulty === 'EASY' ? 'level-easy' : p.difficulty === 'MEDIUM' ? 'level-medium' : 'level-hard',
    description: p.description,
    inputFormat: p.inputFormat,
    outputFormat: p.outputFormat,
    constraints: p.constraints,
    topics: p.topics,
    examples: p.examples ?? examplesFrom(testCases),
    testCases,
  });
}

add({
  id: 101,
  sequence: 1,
  title: 'Desk Label',
  slug: 'desk-label',
  difficulty: 'EASY',
  topics: ['Input/Output'],
  description:
    'Print a two-line desk tag. The first line is a staff first name (a single word). The second line must be the text `ID: ` followed by their numeric badge, with a space after the colon.',
  inputFormat: 'Line 1: a single word (the name).\nLine 2: an integer badge id.',
  outputFormat: 'Two lines: the name, then `ID: <badge>`.',
  constraints: '1 <= name.length <= 20\nname contains only letters\n1 <= badge <= 10^6',
  tests: [
    tc('t101-1', 'Alice\n42', 'Alice\nID: 42', false, 1),
    tc('t101-2', 'Ravi\n7', 'Ravi\nID: 7', false, 2),
    tc('t101-3', 'Zara\n1001', 'Zara\nID: 1001', true, 3),
    tc('t101-4', 'Ken\n1', 'Ken\nID: 1', true, 4),
  ],
});

add({
  id: 102,
  sequence: 2,
  title: 'Pair Total',
  slug: 'pair-total',
  difficulty: 'EASY',
  topics: ['Math', 'Input/Output'],
  description: 'Read two integers and print their sum. This is the first arithmetic drill: parse two tokens and write one number.',
  inputFormat: 'A single line with two integers `a` and `b`.',
  outputFormat: 'One integer: `a + b`.',
  constraints: '-10^9 <= a, b <= 10^9',
  tests: [
    tc('t102-1', '1 2', '3', false, 1),
    tc('t102-2', '-5 10', '5', false, 2),
    tc('t102-3', '0 0', '0', true, 3),
    tc('t102-4', '1000000000 -1', '999999999', true, 4),
  ],
});

add({
  id: 103,
  sequence: 3,
  title: 'Shift Parity',
  slug: 'shift-parity',
  difficulty: 'EASY',
  topics: ['Conditionals', 'Math'],
  description: 'A machine reports a whole number. Print `EVEN` if it is divisible by 2, otherwise print `ODD`. Zero counts as even.',
  inputFormat: 'A single integer `n`.',
  outputFormat: '`EVEN` or `ODD`.',
  constraints: '-10^9 <= n <= 10^9',
  tests: [
    tc('t103-1', '4', 'EVEN', false, 1),
    tc('t103-2', '7', 'ODD', false, 2),
    tc('t103-3', '0', 'EVEN', true, 3),
    tc('t103-4', '-3', 'ODD', true, 4),
  ],
});

add({
  id: 104,
  sequence: 4,
  title: 'Tallest of Trio',
  slug: 'tallest-of-trio',
  difficulty: 'EASY',
  topics: ['Conditionals'],
  description: 'Three height readings arrive on one line. Print the largest value. Ties are allowed; any of the equal maxima is fine because they share the same number.',
  inputFormat: 'Three integers `a`, `b`, and `c`.',
  outputFormat: 'The maximum of the three.',
  constraints: '-10^9 <= a, b, c <= 10^9',
  tests: [
    tc('t104-1', '1 9 3', '9', false, 1),
    tc('t104-2', '-1 -8 -3', '-1', false, 2),
    tc('t104-3', '5 5 5', '5', true, 3),
    tc('t104-4', '0 12 -20', '12', true, 4),
  ],
});

add({
  id: 105,
  sequence: 5,
  title: 'Times Chart',
  slug: 'times-chart',
  difficulty: 'EASY',
  topics: ['Loops', 'Math'],
  description: 'Print the first ten multiples of `n` on one line, separated by spaces: `n*1` through `n*10`.',
  inputFormat: 'A single integer `n`.',
  outputFormat: 'Ten space-separated integers.',
  constraints: '1 <= n <= 1000',
  tests: [
    tc('t105-1', '3', '3 6 9 12 15 18 21 24 27 30', false, 1),
    tc('t105-2', '1', '1 2 3 4 5 6 7 8 9 10', false, 2),
    tc('t105-3', '10', '10 20 30 40 50 60 70 80 90 100', true, 3),
    tc('t105-4', '7', '7 14 21 28 35 42 49 56 63 70', true, 4),
  ],
});

add({
  id: 106,
  sequence: 6,
  title: 'Lab Factorial',
  slug: 'lab-factorial',
  difficulty: 'EASY',
  topics: ['Loops', 'Math'],
  description: 'Compute `n!` using a loop (not recursion). Treat `0!` as 1. Values fit in a 32-bit signed integer for the given limits.',
  inputFormat: 'A single integer `n`.',
  outputFormat: 'One integer: `n!`.',
  constraints: '0 <= n <= 12',
  tests: [
    tc('t106-1', '5', '120', false, 1),
    tc('t106-2', '0', '1', false, 2),
    tc('t106-3', '7', '5040', true, 3),
    tc('t106-4', '12', '479001600', true, 4),
  ],
});

add({
  id: 107,
  sequence: 7,
  title: 'Digit Census',
  slug: 'digit-census',
  difficulty: 'EASY',
  topics: ['Math', 'Loops'],
  description: 'Count how many decimal digits `n` has. Ignore a leading minus sign. The number `0` has one digit.',
  inputFormat: 'A single integer `n`.',
  outputFormat: 'The digit count.',
  constraints: '-2^31 <= n <= 2^31 - 1',
  tests: [
    tc('t107-1', '123', '3', false, 1),
    tc('t107-2', '0', '1', false, 2),
    tc('t107-3', '-90', '2', true, 3),
    tc('t107-4', '100000', '6', true, 4),
  ],
});

add({
  id: 108,
  sequence: 8,
  title: 'Mirror Integer',
  slug: 'mirror-integer',
  difficulty: 'EASY',
  topics: ['Math'],
  description:
    'Reverse the decimal digits of `n` and print the result. Keep the original sign. Leading zeros created by reversing are dropped (so `-450` becomes `-54`).',
  inputFormat: 'A single integer `n`.',
  outputFormat: 'The reversed integer.',
  constraints: '-10^9 <= n <= 10^9',
  tests: [
    tc('t108-1', '123', '321', false, 1),
    tc('t108-2', '-450', '-54', false, 2),
    tc('t108-3', '0', '0', true, 3),
    tc('t108-4', '100', '1', true, 4),
  ],
});

add({
  id: 109,
  sequence: 9,
  title: 'Conveyor Total',
  slug: 'conveyor-total',
  difficulty: 'EASY',
  topics: ['Array', 'Loops'],
  description: 'A conveyor lists `n` package weights. Print the sum of all weights.',
  inputFormat: 'Line 1: integer `n`.\nLine 2: `n` space-separated integers.',
  outputFormat: 'The sum of the `n` values.',
  constraints: '1 <= n <= 10^5\n-10^4 <= a[i] <= 10^4',
  tests: [
    tc('t109-1', '3\n1 2 3', '6', false, 1),
    tc('t109-2', '1\n-4', '-4', false, 2),
    tc('t109-3', '5\n0 0 0 0 10', '10', true, 3),
    tc('t109-4', '4\n8 -2 1 -1', '6', true, 4),
  ],
});

add({
  id: 110,
  sequence: 10,
  title: 'Peak Reading',
  slug: 'peak-reading',
  difficulty: 'EASY',
  topics: ['Array'],
  description: 'Print the largest value in an array of sensor readings.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers.',
  outputFormat: 'The maximum value.',
  constraints: '1 <= n <= 10^5\n-10^9 <= a[i] <= 10^9',
  tests: [
    tc('t110-1', '4\n2 8 1 5', '8', false, 1),
    tc('t110-2', '2\n-3 -1', '-1', false, 2),
    tc('t110-3', '1\n42', '42', true, 3),
    tc('t110-4', '5\n0 0 0 0 0', '0', true, 4),
  ],
});

add({
  id: 111,
  sequence: 11,
  title: 'Shelf Lookup',
  slug: 'shelf-lookup',
  difficulty: 'EASY',
  topics: ['Searching', 'Array'],
  description: 'Find the first 0-based index where `target` appears in the list. If it never appears, print `-1`.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers.\nLine 3: `target`.',
  outputFormat: 'The first matching index, or `-1`.',
  constraints: '1 <= n <= 10^5\n-10^9 <= a[i], target <= 10^9',
  tests: [
    tc('t111-1', '5\n4 9 1 9 2\n9', '1', false, 1),
    tc('t111-2', '3\n1 2 3\n7', '-1', false, 2),
    tc('t111-3', '1\n8\n8', '0', true, 3),
    tc('t111-4', '4\n5 5 5 5\n5', '0', true, 4),
  ],
});

add({
  id: 112,
  sequence: 12,
  title: 'Vowel Tally',
  slug: 'vowel-tally',
  difficulty: 'EASY',
  topics: ['String'],
  description: 'Count vowels in a word. Count both lowercase and uppercase `a e i o u`. The letter `y` is not a vowel here.',
  inputFormat: 'One line: a word `s` with no spaces.',
  outputFormat: 'The vowel count.',
  constraints: '1 <= |s| <= 10^5\ns contains only English letters',
  tests: [
    tc('t112-1', 'Education', '5', false, 1),
    tc('t112-2', 'rhythm', '0', false, 2),
    tc('t112-3', 'AEIOU', '5', true, 3),
    tc('t112-4', 'Java', '2', true, 4),
  ],
});

add({
  id: 113,
  sequence: 13,
  title: 'Echo Palindrome',
  slug: 'echo-palindrome',
  difficulty: 'EASY',
  topics: ['String', 'Two Pointers'],
  description: 'Print `YES` if the word reads the same forwards and backwards, otherwise `NO`. Comparison is case-sensitive and uses the characters exactly as given.',
  inputFormat: 'One line: string `s` with no spaces.',
  outputFormat: '`YES` or `NO`.',
  constraints: '1 <= |s| <= 10^5\ns contains only letters',
  tests: [
    tc('t113-1', 'level', 'YES', false, 1),
    tc('t113-2', 'Java', 'NO', false, 2),
    tc('t113-3', 'abba', 'YES', true, 3),
    tc('t113-4', 'a', 'YES', true, 4),
  ],
});

add({
  id: 114,
  sequence: 14,
  title: 'Report Bands',
  slug: 'report-bands',
  difficulty: 'EASY',
  topics: ['Conditionals'],
  description:
    'Map a score to a letter band:\n- A if score >= 90\n- B if score >= 80\n- C if score >= 70\n- D if score >= 60\n- F otherwise',
  inputFormat: 'A single integer `score`.',
  outputFormat: 'One letter: A, B, C, D, or F.',
  constraints: '0 <= score <= 100',
  tests: [
    tc('t114-1', '92', 'A', false, 1),
    tc('t114-2', '80', 'B', false, 2),
    tc('t114-3', '70', 'C', true, 3),
    tc('t114-4', '59', 'F', true, 4),
  ],
  examples: [
    { input: '92', output: 'A', explanation: '92 is at least 90.' },
    { input: '80', output: 'B', explanation: '80 is at least 80 but below 90.' },
  ],
});

add({
  id: 115,
  sequence: 15,
  title: 'Clock Chime',
  slug: 'clock-chime',
  difficulty: 'EASY',
  topics: ['Loops', 'Conditionals'],
  description:
    'For each integer `i` from 1 to `n` print a token:\n- `Chime` if `i` is divisible by both 3 and 5\n- `Tick` if `i` is divisible only by 3\n- `Tock` if `i` is divisible only by 5\n- the number `i` otherwise\nPrint the tokens on one line, separated by spaces.',
  inputFormat: 'A single integer `n`.',
  outputFormat: '`n` space-separated tokens.',
  constraints: '1 <= n <= 200',
  tests: [
    tc('t115-1', '5', '1 2 Tick 4 Tock', false, 1),
    tc('t115-2', '15', '1 2 Tick 4 Tock Tick 7 8 Tick Tock 11 Tick 13 14 Chime', false, 2),
    tc('t115-3', '1', '1', true, 3),
    tc('t115-4', '10', '1 2 Tick 4 Tock Tick 7 8 Tick Tock', true, 4),
  ],
});

add({
  id: 116,
  sequence: 16,
  title: 'Prefix Walk',
  slug: 'prefix-walk',
  difficulty: 'EASY',
  topics: ['Array'],
  description: 'Print running totals: the k-th output value is the sum of the first k array elements.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers.',
  outputFormat: '`n` space-separated prefix sums.',
  constraints: '1 <= n <= 10^5\n-10^4 <= a[i] <= 10^4',
  tests: [
    tc('t116-1', '4\n1 2 3 4', '1 3 6 10', false, 1),
    tc('t116-2', '3\n-1 2 -3', '-1 1 -2', false, 2),
    tc('t116-3', '1\n9', '9', true, 3),
    tc('t116-4', '5\n0 0 5 0 1', '0 0 5 5 6', true, 4),
  ],
});

add({
  id: 117,
  sequence: 17,
  title: 'Checkout Pair',
  slug: 'checkout-pair',
  difficulty: 'MEDIUM',
  topics: ['Array', 'HashMap'],
  description:
    'A cashier has a list of item prices and a gift-card amount `target`. Print two 0-based indexes of prices that add up exactly to `target`. Exactly one valid pair exists. If several index pairs would work, print the pair whose left index is smallest; if still tied, the one with the smaller right index.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers (prices).\nLine 3: `target`.',
  outputFormat: 'Two space-separated indexes (0-based).',
  constraints: '2 <= n <= 10^4\n-10^9 <= prices[i], target <= 10^9',
  tests: [
    tc('t117-1', '4\n2 7 11 15\n9', '0 1', false, 1),
    tc('t117-2', '3\n3 2 4\n6', '1 2', false, 2),
    tc('t117-3', '2\n5 5\n10', '0 1', true, 3),
    tc('t117-4', '4\n0 4 -4 8\n0', '1 2', true, 4),
  ],
  examples: [
    { input: '4\n2 7 11 15\n9', output: '0 1', explanation: '2 + 7 = 9 at indexes 0 and 1.' },
    { input: '3\n3 2 4\n6', output: '1 2', explanation: '2 + 4 = 6.' },
  ],
});

add({
  id: 118,
  sequence: 18,
  title: 'Packed Zeros',
  slug: 'packed-zeros',
  difficulty: 'MEDIUM',
  topics: ['Array', 'Two Pointers'],
  description: 'Shift every zero to the end of the list while keeping the relative order of the non-zero values.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers.',
  outputFormat: 'The rearranged list, space-separated.',
  constraints: '1 <= n <= 10^5\n-10^4 <= a[i] <= 10^4',
  tests: [
    tc('t118-1', '5\n0 1 0 3 12', '1 3 12 0 0', false, 1),
    tc('t118-2', '4\n4 3 2 1', '4 3 2 1', false, 2),
    tc('t118-3', '1\n0', '0', true, 3),
    tc('t118-4', '6\n0 0 1 0 2 3', '1 2 3 0 0 0', true, 4),
  ],
});

add({
  id: 119,
  sequence: 19,
  title: 'First Lone Letter',
  slug: 'first-lone-letter',
  difficulty: 'MEDIUM',
  topics: ['String', 'HashMap'],
  description:
    'Find the first character that appears exactly once in `s` (left to right). If every character repeats, print `-`. Comparison is case-sensitive.',
  inputFormat: 'One line: string `s` with no spaces.',
  outputFormat: 'A single character, or `-`.',
  constraints: '1 <= |s| <= 10^5\ns contains only letters',
  tests: [
    tc('t119-1', 'leetcode', 'l', false, 1),
    tc('t119-2', 'aabb', '-', false, 2),
    tc('t119-3', 'loveleetcode', 'v', true, 3),
    tc('t119-4', 'z', 'z', true, 4),
  ],
});

add({
  id: 120,
  sequence: 20,
  title: 'Letter Bag Match',
  slug: 'letter-bag-match',
  difficulty: 'MEDIUM',
  topics: ['String', 'HashMap'],
  description: 'Print `YES` if the two words use exactly the same letters with the same frequencies (an anagram), otherwise `NO`. Case-sensitive.',
  inputFormat: 'Line 1: string `a`.\nLine 2: string `b`.',
  outputFormat: '`YES` or `NO`.',
  constraints: '1 <= |a|, |b| <= 10^5',
  tests: [
    tc('t120-1', 'listen\nsilent', 'YES', false, 1),
    tc('t120-2', 'rat\ncar', 'NO', false, 2),
    tc('t120-3', 'a\na', 'YES', true, 3),
    tc('t120-4', 'aabb\nabab', 'YES', true, 4),
  ],
});

add({
  id: 121,
  sequence: 21,
  title: 'Sorted Probe',
  slug: 'sorted-probe',
  difficulty: 'MEDIUM',
  topics: ['Searching', 'Array'],
  description: 'The array is sorted in non-decreasing order. Return the 0-based index of `target`, or `-1` if it is missing. Duplicate values: return any valid index. Aim for logarithmic time.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` sorted integers.\nLine 3: `target`.',
  outputFormat: 'Index of `target`, or `-1`.',
  constraints: '1 <= n <= 10^5\n-10^9 <= a[i], target <= 10^9',
  tests: [
    tc('t121-1', '5\n-1 0 3 5 9\n3', '2', false, 1),
    tc('t121-2', '5\n-1 0 3 5 9\n2', '-1', false, 2),
    tc('t121-3', '1\n1\n1', '0', true, 3),
    tc('t121-4', '6\n1 2 2 2 3 4\n4', '5', true, 4),
  ],
});

add({
  id: 122,
  sequence: 22,
  title: 'Belt Rotate',
  slug: 'belt-rotate',
  difficulty: 'MEDIUM',
  topics: ['Array'],
  description: 'Rotate the list to the right by `k` positions. `k` may be larger than `n`; use `k modulo n`. Right rotate means the last element moves to the front, `k` times.',
  inputFormat: 'Line 1: `n` and `k`.\nLine 2: `n` integers.',
  outputFormat: 'The rotated list, space-separated.',
  constraints: '1 <= n <= 10^5\n0 <= k <= 10^9\n-10^4 <= a[i] <= 10^4',
  tests: [
    tc('t122-1', '5 3\n1 2 3 4 5', '3 4 5 1 2', false, 1),
    tc('t122-2', '4 2\n-1 -100 3 99', '3 99 -1 -100', false, 2),
    tc('t122-3', '1 99\n7', '7', true, 3),
    tc('t122-4', '3 0\n1 2 3', '1 2 3', true, 4),
  ],
});

add({
  id: 123,
  sequence: 23,
  title: 'Best Stretch Sum',
  slug: 'best-stretch-sum',
  difficulty: 'MEDIUM',
  topics: ['Array', 'Dynamic Programming'],
  description: 'Find a contiguous slice of the array whose values add up to the largest possible total, and print that total. The slice must contain at least one element (so an all-negative array yields the largest single value).',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers.',
  outputFormat: 'The maximum contiguous sum.',
  constraints: '1 <= n <= 10^5\n-10^4 <= a[i] <= 10^4',
  tests: [
    tc('t123-1', '9\n-2 1 -3 4 -1 2 1 -5 4', '6', false, 1),
    tc('t123-2', '1\n-5', '-5', false, 2),
    tc('t123-3', '3\n1 2 3', '6', true, 3),
    tc('t123-4', '4\n-1 -2 -3 -4', '-1', true, 4),
  ],
});

add({
  id: 124,
  sequence: 24,
  title: 'Crowd Leader',
  slug: 'crowd-leader',
  difficulty: 'MEDIUM',
  topics: ['HashMap', 'Array'],
  description: 'Exactly one value appears more than `n / 2` times (integer division). Print that value.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers.',
  outputFormat: 'The majority value.',
  constraints: '1 <= n <= 10^5\n-10^9 <= a[i] <= 10^9',
  tests: [
    tc('t124-1', '3\n3 2 3', '3', false, 1),
    tc('t124-2', '7\n2 2 1 1 1 2 2', '2', false, 2),
    tc('t124-3', '1\n8', '8', true, 3),
    tc('t124-4', '5\n0 0 1 0 2', '0', true, 4),
  ],
});

add({
  id: 125,
  sequence: 25,
  title: 'Bracket Balance',
  slug: 'bracket-balance',
  difficulty: 'MEDIUM',
  topics: ['Stack', 'String'],
  description:
    'A string contains only `()`, `[]`, and `{}`. Print `YES` if every opening bracket is closed by the matching type in the correct order, otherwise `NO`.',
  inputFormat: 'One line: bracket string `s`.',
  outputFormat: '`YES` or `NO`.',
  constraints: '1 <= |s| <= 10^5\ns contains only ()[]{}',
  tests: [
    tc('t125-1', '()[]{}', 'YES', false, 1),
    tc('t125-2', '(]', 'NO', false, 2),
    tc('t125-3', '{[]}', 'YES', true, 3),
    tc('t125-4', '([)]', 'NO', true, 4),
    tc('t125-5', '((', 'NO', true, 5),
  ],
});

add({
  id: 126,
  sequence: 26,
  title: 'Twin Lists Merge',
  slug: 'twin-lists-merge',
  difficulty: 'MEDIUM',
  topics: ['Sorting', 'Two Pointers', 'Array'],
  description: 'Merge two already-sorted (non-decreasing) lists into one sorted list.',
  inputFormat: 'Line 1: `n` and `m`.\nLine 2: `n` sorted integers.\nLine 3: `m` sorted integers.',
  outputFormat: '`n + m` space-separated integers in non-decreasing order.',
  constraints: '1 <= n, m <= 10^5\n-10^9 <= values <= 10^9',
  tests: [
    tc('t126-1', '2 3\n1 3\n2 4 6', '1 2 3 4 6', false, 1),
    tc('t126-2', '1 1\n5\n2', '2 5', false, 2),
    tc('t126-3', '3 1\n1 1 1\n1', '1 1 1 1', true, 3),
    tc('t126-4', '2 2\n-5 0\n-3 8', '-5 -3 0 8', true, 4),
  ],
});

add({
  id: 127,
  sequence: 27,
  title: 'Grid Trace',
  slug: 'grid-trace',
  difficulty: 'MEDIUM',
  topics: ['Matrix', 'Math'],
  description: 'Given an `n` by `n` grid, print the sum of the main diagonal (cells where row index equals column index, 0-based).',
  inputFormat: 'Line 1: `n`.\nNext `n` lines: `n` integers each.',
  outputFormat: 'The main-diagonal sum.',
  constraints: '1 <= n <= 200\n-10^4 <= grid[i][j] <= 10^4',
  tests: [
    tc('t127-1', '3\n1 2 3\n4 5 6\n7 8 9', '15', false, 1),
    tc('t127-2', '2\n10 0\n0 -4', '6', false, 2),
    tc('t127-3', '1\n9', '9', true, 3),
    tc('t127-4', '3\n0 1 2\n3 0 4\n5 6 0', '0', true, 4),
  ],
});

add({
  id: 128,
  sequence: 28,
  title: 'Run Length Note',
  slug: 'run-length-note',
  difficulty: 'MEDIUM',
  topics: ['String'],
  description:
    'Compress consecutive repeats: for each run of the same character, write the character once. If the run length is greater than 1, append that count immediately after the character. Example: `aabccc` becomes `a2bc3`.',
  inputFormat: 'One line: string `s` of lowercase letters.',
  outputFormat: 'The compressed string.',
  constraints: '1 <= |s| <= 10^5',
  tests: [
    tc('t128-1', 'aabccc', 'a2bc3', false, 1),
    tc('t128-2', 'abc', 'abc', false, 2),
    tc('t128-3', 'zzzz', 'z4', true, 3),
    tc('t128-4', 'aaabaa', 'a3ba2', true, 4),
  ],
});

add({
  id: 129,
  sequence: 29,
  title: 'Next Taller',
  slug: 'next-taller',
  difficulty: 'MEDIUM',
  topics: ['Stack', 'Array'],
  description:
    'For each height, print the nearest strictly taller height to its right. If none exists, print `-1` for that position. Scan from the right with a stack for an efficient solution.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers.',
  outputFormat: '`n` space-separated answers.',
  constraints: '1 <= n <= 10^5\n1 <= h[i] <= 10^9',
  tests: [
    tc('t129-1', '4\n2 1 2 4', '4 2 4 -1', false, 1),
    tc('t129-2', '3\n3 2 1', '-1 -1 -1', false, 2),
    tc('t129-3', '1\n7', '-1', true, 3),
    tc('t129-4', '5\n1 3 2 4 4', '3 4 4 -1 -1', true, 4),
  ],
});

add({
  id: 130,
  sequence: 30,
  title: 'Unique Compact',
  slug: 'unique-compact',
  difficulty: 'MEDIUM',
  topics: ['Array', 'Two Pointers'],
  description: 'The array is sorted non-decreasing. Print the distinct values in order, once each.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` sorted integers.',
  outputFormat: 'The unique values, space-separated.',
  constraints: '1 <= n <= 10^5\n-10^9 <= a[i] <= 10^9',
  tests: [
    tc('t130-1', '5\n1 1 2 2 3', '1 2 3', false, 1),
    tc('t130-2', '4\n0 0 0 0', '0', false, 2),
    tc('t130-3', '3\n-2 -2 5', '-2 5', true, 3),
    tc('t130-4', '1\n9', '9', true, 4),
  ],
});

add({
  id: 131,
  sequence: 31,
  title: 'Valley Reservoir',
  slug: 'valley-reservoir',
  difficulty: 'HARD',
  topics: ['Array', 'Two Pointers'],
  description:
    'Bars of width 1 stand at heights `h[i]`. Rain fills every unit that is trapped between taller bars. Water cannot sit on top of a bar. Print how many unit squares of water remain after it settles.',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` non-negative integers.',
  outputFormat: 'Total trapped units.',
  constraints: '1 <= n <= 2 * 10^4\n0 <= h[i] <= 10^5',
  tests: [
    tc('t131-1', '12\n0 1 0 2 1 0 1 3 2 1 2 1', '6', false, 1),
    tc('t131-2', '3\n2 0 2', '2', false, 2),
    tc('t131-3', '1\n5', '0', true, 3),
    tc('t131-4', '6\n4 2 0 3 2 5', '9', true, 4),
  ],
});

add({
  id: 132,
  sequence: 32,
  title: 'Rising Sequence',
  slug: 'rising-sequence',
  difficulty: 'HARD',
  topics: ['Dynamic Programming', 'Array'],
  description: 'Print the length of the longest strictly increasing subsequence (not necessarily contiguous).',
  inputFormat: 'Line 1: `n`.\nLine 2: `n` integers.',
  outputFormat: 'The length of the longest strictly increasing subsequence.',
  constraints: '1 <= n <= 2000\n-10^9 <= a[i] <= 10^9',
  tests: [
    tc('t132-1', '8\n10 9 2 5 3 7 101 18', '4', false, 1),
    tc('t132-2', '5\n5 4 3 2 1', '1', false, 2),
    tc('t132-3', '1\n7', '1', true, 3),
    tc('t132-4', '6\n1 2 3 4 5 6', '6', true, 4),
  ],
});

add({
  id: 133,
  sequence: 33,
  title: 'Token Machine',
  slug: 'token-machine',
  difficulty: 'HARD',
  topics: ['Dynamic Programming', 'Greedy'],
  description:
    'A machine accepts unlimited coins of the given denominations. Print the fewest coins needed to make exactly `amount`. If it is impossible, print `-1`. Making amount `0` takes `0` coins.',
  inputFormat: 'Line 1: `n` (number of denominations) and `amount`.\nLine 2: `n` distinct positive integers (coin values).',
  outputFormat: 'Minimum coins, or `-1`.',
  constraints: '1 <= n <= 50\n0 <= amount <= 5000\n1 <= coin[i] <= 10^4',
  tests: [
    tc('t133-1', '3 11\n1 2 5', '3', false, 1),
    tc('t133-2', '1 3\n2', '-1', false, 2),
    tc('t133-3', '2 0\n1 2', '0', true, 3),
    tc('t133-4', '3 30\n1 5 10', '3', true, 4),
  ],
  examples: [
    { input: '3 11\n1 2 5', output: '3', explanation: '5 + 5 + 1 uses three coins.' },
    { input: '1 3\n2', output: '-1', explanation: 'Odd amounts cannot be formed with only 2.' },
  ],
});

add({
  id: 134,
  sequence: 34,
  title: 'Phrase Split',
  slug: 'phrase-split',
  difficulty: 'HARD',
  topics: ['Dynamic Programming', 'String', 'HashMap'],
  description:
    'Print `YES` if the word `s` can be assembled by concatenating words from the dictionary (each dictionary word may be reused). Print `NO` otherwise.',
  inputFormat: 'Line 1: string `s`.\nLine 2: integer `k`.\nNext `k` lines: dictionary words.',
  outputFormat: '`YES` or `NO`.',
  constraints: '1 <= |s| <= 200\n1 <= k <= 50\n1 <= |word| <= 20',
  tests: [
    tc('t134-1', 'applepenapple\n2\napple\npen', 'YES', false, 1),
    tc('t134-2', 'catsandog\n5\ncats\ndog\nsand\nand\ncat', 'NO', false, 2),
    tc('t134-3', 'aaaaaaa\n2\naaaa\naaa', 'YES', true, 3),
    tc('t134-4', 'a\n1\nb', 'NO', true, 4),
  ],
});

add({
  id: 135,
  sequence: 35,
  title: 'Tightest Cover',
  slug: 'tightest-cover',
  difficulty: 'HARD',
  topics: ['String', 'HashMap', 'Two Pointers'],
  description:
    'Find the shortest substring of `s` that contains every character of `t` (including duplicates). If several shortest windows exist, print the leftmost one. If none exists, print `EMPTY`.',
  inputFormat: 'Line 1: string `s`.\nLine 2: string `t`.',
  outputFormat: 'The shortest covering substring, or `EMPTY`.',
  constraints: '1 <= |s| <= 2000\n1 <= |t| <= 80\ns and t contain uppercase letters only',
  tests: [
    tc('t135-1', 'ADOBECODEBANC\nABC', 'BANC', false, 1),
    tc('t135-2', 'A\nA', 'A', false, 2),
    tc('t135-3', 'A\nAA', 'EMPTY', true, 3),
    tc('t135-4', 'AA\nAA', 'AA', true, 4),
  ],
});

add({
  id: 136,
  sequence: 36,
  title: 'Spell Distance',
  slug: 'spell-distance',
  difficulty: 'HARD',
  topics: ['Dynamic Programming', 'String'],
  description:
    'Convert word `a` into word `b` using single-character inserts, deletes, or replacements. Print the minimum number of operations.',
  inputFormat: 'Line 1: string `a`.\nLine 2: string `b`.',
  outputFormat: 'The edit distance (a non-negative integer).',
  constraints: '1 <= |a|, |b| <= 200\nlowercase English letters only',
  tests: [
    tc('t136-1', 'horse\nros', '3', false, 1),
    tc('t136-2', 'intention\nexecution', '5', false, 2),
    tc('t136-3', 'a\na', '0', true, 3),
    tc('t136-4', 'abc\ndef', '3', true, 4),
  ],
});

add({
  id: 137,
  sequence: 37,
  title: 'Seat Queens',
  slug: 'seat-queens',
  difficulty: 'HARD',
  topics: ['Recursion', 'Matrix'],
  description:
    'Count the ways to place `n` queens on an `n` by `n` board so that none share a row, column, or diagonal. Print the number of distinct boards. Rotations count as different if the cell sets differ.',
  inputFormat: 'A single integer `n`.',
  outputFormat: 'The number of solutions.',
  constraints: '1 <= n <= 8',
  tests: [
    tc('t137-1', '4', '2', false, 1),
    tc('t137-2', '1', '1', false, 2),
    tc('t137-3', '2', '0', true, 3),
    tc('t137-4', '5', '10', true, 4),
  ],
});

add({
  id: 138,
  sequence: 38,
  title: 'Island Census',
  slug: 'island-census',
  difficulty: 'HARD',
  topics: ['Graph', 'Matrix', 'Recursion'],
  description:
    'A grid of `0` (water) and `1` (land). An island is a group of land cells connected by 4-direction edges (up/down/left/right, not diagonals). Print how many islands are on the map.',
  inputFormat: 'Line 1: `rows` and `cols`.\nNext `rows` lines: `cols` integers (`0` or `1`) each.',
  outputFormat: 'The island count.',
  constraints: '1 <= rows, cols <= 50',
  tests: [
    tc('t138-1', '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', '3', false, 1),
    tc('t138-2', '1 1\n0', '0', false, 2),
    tc('t138-3', '2 2\n1 0\n0 1', '2', true, 3),
    tc('t138-4', '1 4\n1 1 1 1', '1', true, 4),
  ],
});

export function problemsForPack(idBase) {
  return problems.map((p) => {
    const id = idBase + p.sequence;
    return {
      ...p,
      id,
      testCases: p.testCases.map((t) => ({ ...t, id: `t${id}-${t.sequence}` })),
    };
  });
}

export { TOPICS };
