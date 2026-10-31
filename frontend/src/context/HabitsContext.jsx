import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api, { errorMessage } from "../api/api";

const HabitsContext = createContext(null);

const normalize = (h) => ({
  id: h._id,
  name: h.habitName,
  description: h.description || "",
  note: h.description || "",
  streak: h.streak ?? 0,
  longestStreak: h.longestStreak ?? 0,
  done: !!h.doneToday,
});

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [today, setToday] = useState(null); // YYYY-MM-DD from the server
  const [heatmap, setHeatmap] = useState({ values: [], startDate: null, endDate: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [pending, setPending] = useState({}); // habitId -> true while a check-in request is in flight
  const todayRef = useRef(null);

  const refreshHeatmap = useCallback(async () => {
    try {
      const res = await api.get("/habits/heatmap");
      setHeatmap({ values: res.data.values, startDate: res.data.startDate, endDate: res.data.endDate });
    } catch {
      /* keep the previous heat map; the main load already reports errors */
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, map] = await Promise.all([api.get("/habits"), api.get("/habits/heatmap")]);
      setHabits(list.data.habits.map(normalize));
      setToday(list.data.today);
      todayRef.current = list.data.today;
      setHeatmap({ values: map.data.values, startDate: map.data.startDate, endDate: map.data.endDate });
    } catch (err) {
      setError(errorMessage(err, "Failed to load your habits."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Check or uncheck TODAY. The server decides what "today" is and rejects anything else.
  const setDoneToday = useCallback(
    async (id, completed) => {
      if (pending[id]) return;
      setActionError("");
      setPending((p) => ({ ...p, [id]: true }));
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, done: completed } : h))); // optimistic

      try {
        const res = await api.put(`/habits/${id}/today`, { completed, date: todayRef.current });
        const fresh = normalize(res.data.habit);
        setHabits((prev) => prev.map((h) => (h.id === id ? fresh : h)));
        refreshHeatmap();
      } catch (err) {
        setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, done: !completed } : h))); // roll back
        if (err.response?.data?.code === "STALE_DATE") {
          setActionError("A new day has started. We've refreshed your habits.");
          load();
        } else {
          setActionError(errorMessage(err, "Couldn't update that habit."));
        }
      } finally {
        setPending((p) => {
          const next = { ...p };
          delete next[id];
          return next;
        });
      }
    },
    [pending, refreshHeatmap, load],
  );

  const toggle = useCallback(
    (id) => {
      const habit = habits.find((h) => h.id === id);
      if (habit) setDoneToday(id, !habit.done);
    },
    [habits, setDoneToday],
  );

  const addHabit = useCallback((raw) => setHabits((prev) => [normalize(raw), ...prev]), []);

  const removeHabit = useCallback(
    (id) => {
      setHabits((prev) => prev.filter((h) => h.id !== id));
      refreshHeatmap();
    },
    [refreshHeatmap],
  );

  const value = useMemo(() => {
    const total = habits.length;
    const doneCount = habits.filter((h) => h.done).length;
    return {
      habits,
      today,
      heatmap,
      loading,
      error,
      actionError,
      clearActionError: () => setActionError(""),
      pending,
      total,
      doneCount,
      remaining: total - doneCount,
      reload: load,
      toggle,
      addHabit,
      removeHabit,
    };
  }, [habits, today, heatmap, loading, error, actionError, pending, load, toggle, addHabit, removeHabit]);

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used inside <HabitsProvider>");
  return ctx;
}
