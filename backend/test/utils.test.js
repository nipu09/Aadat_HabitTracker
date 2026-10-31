process.env.MONGO_URI = "mongodb://localhost/test";
process.env.JWT_KEY = "x".repeat(40);
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const { todayInTz, addDays } = require("../utils/date");
const { computeStreaks } = require("../utils/streak");

test("todayInTz respects the timezone", () => {
  const instant = new Date("2026-10-31T20:00:00Z"); // already Nov 1 in India
  assert.equal(todayInTz("UTC", instant), "2026-10-31");
  assert.equal(todayInTz("Asia/Kolkata", instant), "2026-11-01");
});

test("addDays crosses month and year boundaries", () => {
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2028-03-01", -1), "2028-02-29");
});

test("streak counts back from today", () => {
  const r = computeStreaks(["2026-10-29", "2026-10-30", "2026-10-31"], "2026-10-31");
  assert.deepEqual(r, { current: 3, longest: 3 });
});

test("streak stays alive when today is not done yet", () => {
  const r = computeStreaks(["2026-10-29", "2026-10-30"], "2026-10-31");
  assert.equal(r.current, 2);
});

test("streak resets after a missed day, longest is remembered", () => {
  const r = computeStreaks(["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-30"], "2026-10-31");
  assert.deepEqual(r, { current: 1, longest: 3 });
});

test("no entries gives zero", () => {
  assert.deepEqual(computeStreaks([], "2026-10-31"), { current: 0, longest: 0 });
});
