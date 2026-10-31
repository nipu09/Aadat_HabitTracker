import { useEffect, useState } from "react";
import api, { errorMessage } from "../../api/api";
import HeatMap from "./index";

// Done / not-done history for a single habit. Loads when first shown.
export default function HabitHeatmap({ habitId, refreshKey }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setError("");
    api
      .get(`/habits/${habitId}/heatmap`)
      .then((res) => !cancelled && setData(res.data))
      .catch((err) => !cancelled && setError(errorMessage(err, "Couldn't load activity.")));
    return () => {
      cancelled = true;
    };
  }, [habitId, refreshKey]);

  if (error) return <p role="alert" className="text-sm text-red-500">{error}</p>;
  if (!data) return <p className="text-sm text-[#6b6985]">Loading activity…</p>;

  return (
    <>
      <HeatMap mode="individual" values={data.values} startDate={data.startDate} endDate={data.endDate} />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#6b6985]">
          Each square is one day. {data.values.length} {data.values.length === 1 ? "day" : "days"} done in the past 12 months.
        </p>
        <div className="flex items-center gap-2 text-xs text-[#6b6985]">
          <span className="h-3 w-3 rounded-sm bg-[#eeeaf7]" />
          <span>Not done</span>
          <span className="ml-2 h-3 w-3 rounded-sm bg-[#8b70c3]" />
          <span>Done</span>
        </div>
      </div>
    </>
  );
}
