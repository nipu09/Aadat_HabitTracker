import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import getQuotes from "../api/Quotes";

const DISPLAY = "font-['Instrument_Serif',serif] font-normal tracking-tight";

function greeting(date) {
  const h = date.getHours();

  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const Greeting = () => {
  const { user } = useAuth();
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuotes();
        setQuote(data[0]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const now = useMemo(() => new Date(), []);

  const dateLabel = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="rounded-3xl bg-[#ccefe8] p-6">
      <p className="text-xs tracking-wide text-[#4a4864]">
        {dateLabel}
      </p>

      <h1 className={`${DISPLAY} mt-3 text-[34px] leading-[1.05] sm:text-[40px]`}>
        {greeting(now)}, {firstName || "there"}.
      </h1>

      <div className="relative mt-5">
        <span className="absolute -left-1 -top-7 font-serif text-5xl text-[#65b9a9]/60">
          “
        </span>

        <p className={`${DISPLAY} pl-5 text-[22px] leading-relaxed text-[#34334a] sm:text-[26px]`}>
          {quote?.quote || "A little inspiration goes a long way."}
        </p>
      </div>
    </div>
  );
};

export default Greeting;
