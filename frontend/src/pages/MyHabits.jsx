import { useState } from "react";
import AppShell from "../components/layout/AppShell";
import HabitTracker from "../components/pannel/HabitTracker";
import CreateHabitModal from "../components/CreateHabitModal/CreateHabitModal";
import { useHabits } from "../context/HabitsContext";

export default function MyHabits() {
  const { habits, loading, error, reload, total, doneCount, remaining, addHabit, removeHabit } = useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: "Total habits", value: total },
    { label: "Completed today", value: doneCount },
    { label: "Still to do", value: remaining },
  ];

  return (
    <AppShell title="My habits">
      <section className="mb-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#a095b8]">Your overview</p>
            <h2 className="font-['Instrument_Serif',serif] text-4xl">A little progress</h2>
          </div>
          <button type="button" onClick={() => setIsModalOpen(true)} className="btn_ppl">
            Add habit
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#eeeaf4] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6"
            >
              <p className="text-sm text-[#77718d]">{stat.label}</p>
              <p className="mt-3 font-['Instrument_Serif',serif] text-5xl">{String(stat.value).padStart(2, "0")}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#a095b8]">One day at a time</p>
            <h2 className="font-['Instrument_Serif',serif] text-4xl">Your daily rituals</h2>
            <p className="mt-2 text-sm text-[#817895]">Show up for yourself, one habit at a time.</p>
          </div>
          <div className="rounded-full border border-[#ebe5f4] bg-white px-4 py-2 text-xs text-[#8064a5]">
            {doneCount} of {total} completed
          </div>
        </div>

        {loading && <p className="mb-4 rounded-xl bg-white p-4 text-sm text-[#817895]">Loading your habits…</p>}
        {error && (
          <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>
            <button type="button" onClick={reload} className="btn_wht">
              Try again
            </button>
          </div>
        )}
        {!loading && !error && <HabitTracker habits={habits} onHabitDeleted={removeHabit} />}
      </section>

      <footer className="mt-8 rounded-2xl border border-[#eee8f5] bg-white px-5 py-4 text-center">
        <p className="text-sm text-[#817895]">
          <span className="font-medium text-[#8064a5]">Remember:</span> You don't have to be perfect. Just keep showing up. ♡
        </p>
      </footer>

      <CreateHabitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addHabit} />
    </AppShell>
  );
}
