
export default Greeting;
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

const DISPLAY = "font-['Instrument_Serif',serif] font-normal tracking-tight";

function greeting(date) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const Greeting = () => {
  const { user } = useAuth();
  const now = useMemo(() => new Date(), []);

  const dateLabel = now
    .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    .toUpperCase();
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="rounded-3xl bg-[#ccefe8] p-6">
      <p className="text-xs tracking-wide text-[#4a4864]">{dateLabel}</p>
      <h1 className={`${DISPLAY} mt-3 text-[34px] leading-[1.05] sm:text-[40px]`}>
        {greeting(now)}, {firstName || "there"}.
      </h1>
      <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[#4a4864]">
        You’re growing, one small habit at a time. Let’s keep going.
      </p>
    </div>
  );
};

export default Greeting;
