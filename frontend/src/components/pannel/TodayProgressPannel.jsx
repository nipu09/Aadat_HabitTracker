import ProgressRing from "./ProgressRing";
import { useHabits } from "../../context/HabitsContext";

const DISPLAY = "font-['Instrument_Serif',serif] font-normal tracking-tight";

export const TodayProgressPannel = () => {
  const { total, doneCount, remaining } = useHabits();
  const percent = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className="rounded-3xl border border-[#ebe9f3] bg-white p-6">
      <h2 className={`${DISPLAY} text-2xl`}>Today’s progress</h2>
      <div className="mb-5 mt-7 flex items-center justify-center">
        <ProgressRing value={percent} />
      </div>
      <p className="mt-4 text-center text-[16px] font-medium">
        {doneCount} {doneCount === 1 ? "habit" : "habits"} done
      </p>
      <p className="mt-1 text-center text-[13px] text-[#6b6985]">
        {total === 0
          ? "Add your first habit to get started."
          : remaining > 0
            ? `Just ${remaining} more little ${remaining === 1 ? "win" : "wins"} to finish your day.`
            : "All done. Nicely grown today."}
      </p>
    </div>
  );
};
export default TodayProgressPannel;
