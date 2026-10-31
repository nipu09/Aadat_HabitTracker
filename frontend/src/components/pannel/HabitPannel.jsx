import { Link } from "react-router-dom";
import { useHabits } from "../../context/HabitsContext";

const DISPLAY = "font-['Instrument_Serif',serif] font-normal tracking-tight";

const Check = ({ checked }) => (
  <span
    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
      checked ? "border-[#8470c2] bg-[#8470c2] text-white" : "border-[#d8d5e5] bg-white"
    }`}
  >
    {checked && (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 6" />
      </svg>
    )}
  </span>
);

export const HabitPannel = () => {
  const { habits, loading, error, actionError, clearActionError, pending, toggle, doneCount, total, reload } = useHabits();

  return (
    <div className="rounded-3xl border border-[#ebe9f3] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className={`${DISPLAY} text-[26px]`}>Today’s habits</h2>
        <span className="rounded-full bg-[#ccefe8] px-2.5 py-0.5 text-xs text-[#4a4864]">
          {doneCount} of {total} done
        </span>
      </div>

      {actionError && (
        <p role="alert" className="mt-4 flex items-start justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{actionError}</span>
          <button type="button" onClick={clearActionError} aria-label="Dismiss" className="shrink-0 font-semibold">
            ×
          </button>
        </p>
      )}

      {loading ? (
        <div className="mt-6 py-6 text-center text-sm text-[#6b6985]">Loading habits…</div>
      ) : error ? (
        <div className="mt-6 py-6 text-center text-sm text-red-500">
          <p role="alert">{error}</p>
          <button type="button" onClick={reload} className="btn_wht mt-3">
            Try again
          </button>
        </div>
      ) : habits.length > 0 ? (
        <ul className="mt-4 divide-y divide-[#f0eef6]">
          {habits.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={h.done}
                disabled={!!pending[h.id]}
                onClick={() => toggle(h.id)}
                className="flex min-h-14 w-full items-center gap-3.5 rounded-lg py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8470c2] disabled:opacity-70"
              >
                <Check checked={h.done} />
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-[16px] leading-tight">{h.name}</span>
                  {h.note && <span className="mt-0.5 block break-words text-[13px] text-[#6b6985]">{h.note}</span>}
                </span>
                <span className="shrink-0 rounded-full bg-[#f6daef] px-2.5 py-0.5 text-xs text-[#4a4864]">{h.streak}d</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 py-6 text-center text-sm text-[#6b6985]">
          <p>No habits added yet.</p>
          <Link to="/myhabits" className="btn_ppl mt-4">
            Create your first habit
          </Link>
        </div>
      )}
    </div>
  );
};

export default HabitPannel;
