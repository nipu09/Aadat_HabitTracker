import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";
import { useHabits } from "../../context/HabitsContext";

// Common frame for every signed-in page: sidebar on desktop, bottom tabs on phones.
export default function AppShell({ title, children }) {
  const { remaining } = useHabits();

  return (
    <div className="min-h-screen bg-[#faf9fc] font-['Figtree',system-ui,sans-serif] text-[#2a2840]">
      <Sidebar habitsLeft={remaining} />
      <div className="flex min-h-screen min-w-0 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:ml-[240px] md:pb-0">
        <TopBar title={title} />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 md:px-7 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      <MobileNav habitsLeft={remaining} />
    </div>
  );
}
