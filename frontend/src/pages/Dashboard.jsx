import AppShell from "../components/layout/AppShell";
import HeatMap from "../components/HeatMap/index";
import Greeting from "../components/common/Greeting";
import HabitPannel from "../components/pannel/HabitPannel";
import TodayProgressPannel from "../components/pannel/TodayProgressPannel";
import GrowingStreaks from "../components/pannel/GrowingStreaks";
import { useHabits } from "../context/HabitsContext";

export default function Dashboard() {
  const { heatmap, loading } = useHabits();

  return (
    <AppShell title="Today">
      <div className="space-y-5">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
          <Greeting />

          <div className="min-w-0 rounded-3xl border border-[#ebe9f3] bg-white p-5 sm:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-['Instrument_Serif',serif] text-2xl font-normal tracking-tight">Habit activity</h2>
              <span className="text-xs text-[#6b6985]">Past 12 months</span>
            </div>

            <div className="mt-4">
              {loading && !heatmap.startDate ? (
                <p className="py-6 text-center text-sm text-[#6b6985]">Loading activity…</p>
              ) : (
                <HeatMap mode="overall" values={heatmap.values} startDate={heatmap.startDate} endDate={heatmap.endDate} />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#6b6985]">Each square is one day. Darker means more habits completed.</p>
              <div className="flex items-center gap-2 text-xs text-[#6b6985]">
                <span>Less</span>
                <span className="h-3 w-3 rounded-sm bg-[#eeeaf7]" />
                <span className="h-3 w-3 rounded-sm bg-[#d5c7ed]" />
                <span className="h-3 w-3 rounded-sm bg-[#b39cdd]" />
                <span className="h-3 w-3 rounded-sm bg-[#8b70c3]" />
                <span className="h-3 w-3 rounded-sm bg-[#6a4fa6]" />
                <span>More</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <HabitPannel />
          <div className="space-y-5">
            <TodayProgressPannel />
            <GrowingStreaks />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
