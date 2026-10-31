import { useEffect, useMemo, useRef } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./style.css";

// "2026-10-31" -> local Date (avoids the off-by-one you get from new Date("YYYY-MM-DD") in UTC)
const toLocalDate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const LABEL_FOR = (mode, key, count) => {
  if (mode === "individual") return `${key}: ${count ? "Done" : "Not done"}`;
  return `${key}: ${count} ${count === 1 ? "habit" : "habits"} completed`;
};

// mode "overall"    -> darker = more habits completed that day
// mode "individual" -> one colour = done, empty = not done
const HeatMap = ({ values = [], startDate, endDate, mode = "overall" }) => {
  const scrollRef = useRef(null);

  const start = useMemo(() => (startDate ? toLocalDate(startDate) : null), [startDate]);
  const end = useMemo(() => (endDate ? toLocalDate(endDate) : null), [endDate]);
  const cells = useMemo(() => values.map((v) => ({ date: toLocalDate(v.date), key: v.date, count: v.count })), [values]);

  // Show the most recent weeks first on small screens
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [start, end]);

  if (!start || !end) return null;

  const classForValue = (value) => {
    if (!value || !value.count) return "color-empty";
    if (mode === "individual") return "color-done";
    return `color-scale-${Math.min(value.count, 4)}`;
  };

  return (
    <div className="heatmap-scroll" ref={scrollRef}>
      <div className="heatmap-inner">
        <CalendarHeatmap
          startDate={start}
          endDate={end}
          values={cells}
          classForValue={classForValue}
          titleForValue={(value) => (value ? LABEL_FOR(mode, value.key, value.count) : null)}
        />
      </div>
    </div>
  );
};

export default HeatMap;
