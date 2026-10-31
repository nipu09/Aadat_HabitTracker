import { useState } from "react";
import HabitHeatmap from "../HeatMap/HabitHeatmap";
import DeleteHabitModal from "../DeleteHabitModal/DeleteHabitModal";

const DISPLAY = "font-['Instrument_Serif',serif]";

export default function HabitTracker({ habits = [], onHabitDeleted }) {
  const [expanded, setExpanded] = useState({});
  const [everOpened, setEverOpened] = useState({}); // load a habit's heat map only once it's opened
  const [selected, setSelected] = useState(null);

  const toggleDetails = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    setEverOpened((prev) => ({ ...prev, [id]: true }));
  };

  const handleDeleted = async (id) => {
    await onHabitDeleted?.(id);
    setSelected(null);
  };

  const modal = (
    <DeleteHabitModal
      isOpen={!!selected}
      onClose={() => setSelected(null)}
      onDelete={handleDeleted}
      habitId={selected?.id}
      habitName={selected?.name}
    />
  );

  if (habits.length === 0) {
    return (
      <div className="rounded-3xl border border-[#ebe9f3] bg-white py-10 text-center text-sm text-[#6b6985]">
        No habits added yet. Start by creating one!
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:gap-6">
        {habits.map((habit) => {
          const isExpanded = !!expanded[habit.id];

          return (
            <section
              key={habit.id}
              className="rounded-3xl border border-[#ebe9f3] bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className={`${DISPLAY} break-words text-2xl text-[#2a2840]`}>{habit.name}</h2>
                  {habit.description && <p className="mt-1 break-words text-sm text-[#6b6985]">{habit.description}</p>}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    habit.done ? "bg-[#dff3e9] text-[#32765c]" : "bg-[#f4eafa] text-[#8064a5]"
                  }`}
                >
                  {habit.done ? "Completed today" : "Not completed today"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="rounded-xl bg-[#f7f5fb] px-4 py-3">
                  <p className="text-xs text-[#6b6985]">Current streak</p>
                  <p className="mt-1 text-lg font-semibold text-[#2a2840]">
                    {habit.streak} {habit.streak === 1 ? "day" : "days"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleDetails(habit.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`habit-details-${habit.id}`}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#ebe9f3] px-4 py-2.5 text-sm font-medium text-[#8064a5] transition-colors duration-200 hover:bg-[#f7f5fb] focus:outline-none focus:ring-2 focus:ring-[#b39cdd] focus:ring-offset-2"
                >
                  {isExpanded ? "Less details" : "More details"}
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>

              <div
                id={`habit-details-${habit.id}`}
                aria-hidden={!isExpanded}
                inert={!isExpanded}
                className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${
                  isExpanded ? "mt-6 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-[#f0edf6] pt-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-[#4a4864]">Activity history</h3>
                        <span className="text-xs text-[#6b6985]">Past 12 months</span>
                      </div>
                      <button type="button" className="btn_wht" onClick={() => setSelected(habit)}>
                        Delete habit
                      </button>
                    </div>

                    {everOpened[habit.id] && <HabitHeatmap habitId={habit.id} refreshKey={habit.done} />}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      {modal}
    </>
  );
}
