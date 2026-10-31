import { useHabits } from "../../context/HabitsContext";

const DISPLAY = "font-['Instrument_Serif',serif] font-normal tracking-tight";

export const GrowingStreaks = () => {
  const { habits } = useHabits();

  const top = [...habits]
    .filter((h) => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);
  const longest = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);

  return (
    <div className="rounded-3xl border border-[#ebe9f3] bg-white p-6">
      <h2 className={`${DISPLAY} text-2xl`}>Growing streaks</h2>
      {top.length > 0 ? (
        <ul className="mt-4 space-y-3 text-[15px]">
          {top.map((h) => (
            <li key={h.id} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">{h.name}</span>
              <span className="shrink-0 text-[#4a4864]">
                {h.streak} {h.streak === 1 ? "day" : "days"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[15px] text-[#6b6985]">Complete a habit today to start your first streak.</p>
      )}
      {longest > 0 && (
        <p className="mt-4 rounded-xl bg-[#f6daef] px-3.5 py-2.5 text-[13px] text-[#4a4864]">
          Your longest streak is {longest} {longest === 1 ? "day" : "days"}. Keep growing!
        </p>
      )}
    </div>
  );
};
export default GrowingStreaks;
