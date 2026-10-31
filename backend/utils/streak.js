const { addDays } = require("./date");

// dates: iterable of YYYY-MM-DD strings on which the habit was completed.
// The current streak stays alive if today is not done yet but yesterday was.
function computeStreaks(dates, today) {
  const set = new Set(dates);
  if (set.size === 0) return { current: 0, longest: 0 };

  let current = 0;
  let cursor = set.has(today) ? today : addDays(today, -1);
  while (set.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  const sorted = [...set].sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    run = addDays(sorted[i - 1], 1) === sorted[i] ? run + 1 : 1;
    if (run > longest) longest = run;
  }

  return { current, longest };
}

module.exports = { computeStreaks };
