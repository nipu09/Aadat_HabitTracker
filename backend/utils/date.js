// All "today" logic lives on the server so a user cannot cheat by changing their device clock.

const formatters = new Map();

function todayInTz(timeZone, now = new Date()) {
  let fmt = formatters.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    formatters.set(timeZone, fmt);
  }
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

// Today as YYYY-MM-DD in the configured APP_TIMEZONE
function getToday(now = new Date()) {
  return todayInTz(require("../config/env").APP_TIMEZONE, now);
}

function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

module.exports = { todayInTz, getToday, addDays };
