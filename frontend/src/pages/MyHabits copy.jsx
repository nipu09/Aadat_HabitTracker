
import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/layout/Sidebar";
import HabitTracker from "../components/pannel/HabitTracker";
import CreateHabitModal from "../components/CreateHabitModal/CreateHabitModal";
import DeleteHabitModal from "../components/DeleteHabitModal/DeleteHabitModal";

const DISPLAY = "font-['Instrument_Serif',serif] font-normal tracking-tight";

const MyHabits = () => {
  const user = {
    firstName: "Nipu",
    fullName: "Nipu",
    initials: "N",
  };

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Fetch habits
  useEffect(() => {
    let isMounted = true;

    const fetchHabits = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/habits/");
        const data = response.data;

        if (data?.success && Array.isArray(data.habits)) {
          const formattedHabits = data.habits.map((habit) => ({
            ...habit,
            id: habit._id ?? habit.id,
            name: habit.habitName ?? habit.name ?? "Untitled habit",
            note:
              habit.description ||
              habit.note ||
              "No description added",
            streak: habit.streak ?? 0,
            done: habit.done ?? false,
          }));

          if (isMounted) {
            setHabits(formattedHabits);
          }
        } else {
          if (isMounted) {
            setError(data?.message || "Unable to load habits.");
          }
        }
      } catch (err) {
        console.error("Error fetching habits:", err);

        if (isMounted) {
          setError(
            err.response?.data?.message || "Failed to load habits."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHabits();

    return () => {
      isMounted = false;
    };
  }, []);

  // Add a newly created habit
  const handleSaveHabit = (savedHabit) => {
    if (!savedHabit) return;

    const incomingHabits = Array.isArray(savedHabit)
      ? savedHabit
      : [savedHabit];

    const formattedHabits = incomingHabits
      .filter(Boolean)
      .map((habit) => ({
        ...habit,
        id: habit._id ?? habit.id,
        name: habit.habitName ?? habit.name ?? "Untitled habit",
        note:
          habit.description ||
          habit.note ||
          "No description added",
        streak: habit.streak ?? 0,
        done: habit.done ?? false,
      }))
      .filter((habit) => habit.id != null);

    if (formattedHabits.length) {
      setHabits((previousHabits) => {
        const existingIds = new Set(
          previousHabits.map((habit) => String(habit.id))
        );

        return [
          ...previousHabits,
          ...formattedHabits.filter(
            (habit) => !existingIds.has(String(habit.id))
          ),
        ];
      });
    }

    setIsHabitModalOpen(false);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (habit) => {
    setSelectedHabit(habit);
    setIsDeleteModalOpen(true);
  };

  // Remove the deleted habit from the UI
  const handleDeleteHabit = (deletedHabit) => {
    const deletedId =
      deletedHabit?._id ??
      deletedHabit?.id ??
      selectedHabit?.id;

    if (deletedId == null) return;

    setHabits((previousHabits) =>
      previousHabits.filter(
        (habit) => String(habit.id) !== String(deletedId)
      )
    );

    setIsDeleteModalOpen(false);
    setSelectedHabit(null);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedHabit(null);
  };

  // Statistics
  const total = habits.length;
  const completed = habits.filter((habit) => habit.done).length;
  const remaining = total - completed;

  const completionRate =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Total habits",
      value: total,
      description: "Little things, big change",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5h10M9 9h10M9 13h6M5 5h.01M5 9h.01M5 13h.01M5 17h14"
          />
        </svg>
      ),
      iconStyle: "bg-[#f0eafb] text-[#8064a5]",
    },
    {
      label: "Completed today",
      value: completed,
      description: `${completionRate}% of your daily goals`,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5 12 4 4L19 6"
          />
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
      iconStyle: "bg-[#e1f4e9] text-[#43866a]",
    },
    {
      label: "Still to do",
      value: remaining,
      description:
        remaining === 0
          ? "Everything is complete!"
          : "One step at a time",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7v5l3 2"
          />
        </svg>
      ),
      iconStyle: "bg-[#fff0df] text-[#bd8952]",
    },
  ];

  return (
    <>
      <div className="flex min-h-screen bg-[#faf9fc] font-['Figtree',system-ui,sans-serif] text-[#2a2840]">
        <Sidebar user={user} habitsLeft={remaining} />

        <main className="min-w-0 flex-1 px-5 py-7 sm:px-7 md:ml-60 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">
            {/* Statistics section */}
            <section className="mb-10" aria-label="Habit statistics">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a095b8]">
                    Your overview
                  </p>

                  <h2
                    className={`${DISPLAY} text-3xl text-[#2a2840] sm:text-4xl`}
                  >
                    A little progress
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="btn_ppl group"
                    onClick={() => setIsHabitModalOpen(true)}
                  >
                    Add habit
                  </button>
                </div>
              </div>

              {/* Statistics cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, index) => (
                  <article
                    key={stat.label}
                    className="group relative overflow-hidden rounded-3xl border border-[#eeeaf4] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#dcd0ef] hover:shadow-lg hover:shadow-[#c7b6e4]/10 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#77718d]">
                          {stat.label}
                        </p>

                        <p
                          className={`${DISPLAY} mt-3 text-5xl leading-none text-[#2a2840]`}
                        >
                          {String(stat.value).padStart(2, "0")}
                        </p>
                      </div>

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${stat.iconStyle}`}
                      >
                        {stat.icon}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                      {index === 1 ? (
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f0edf6]">
                          <div
                            className="h-full rounded-full bg-[#9b83c7] transition-all duration-500"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      ) : (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            index === 0
                              ? "bg-[#a48bcf]"
                              : "bg-[#d4a36e]"
                          }`}
                        />
                      )}

                      <p className="text-xs text-[#9991aa]">
                        {stat.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Loading state */}
            {loading && (
              <p
                className="mb-4 rounded-xl bg-white p-4 text-sm text-[#817895]"
                role="status"
              >
                Loading your habits…
              </p>
            )}

            {/* Error state */}
            {error && (
              <div
                className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                role="alert"
              >
                <p>{error}</p>

                <button
                  type="button"
                  className="mt-2 font-semibold underline"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Habit tracker section */}
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a095b8]">
                    One day at a time
                  </p>

                  <h2
                    className={`${DISPLAY} text-3xl text-[#2a2840] sm:text-4xl`}
                  >
                    Your daily rituals
                  </h2>

                  <p className="mt-2 text-sm text-[#817895]">
                    Show up for yourself, one habit at a time.
                  </p>
                </div>

                <div className="rounded-full border border-[#ebe5f4] bg-white px-4 py-2 text-xs font-medium text-[#8064a5]">
                  {completed} of {total} completed
                </div>
              </div>

              {!loading && !error && (
                <HabitTracker
                  habits={habits}
                  onDeleteHabit={handleOpenDeleteModal}
                />
              )}
            </section>

            {/* Footer */}
            <footer className="mt-8 rounded-2xl border border-[#eee8f5] bg-white/70 px-5 py-4 text-center">
              <p className="text-sm text-[#817895]">
                <span className="font-medium text-[#8064a5]">
                  Remember:
                </span>{" "}
                You don't have to be perfect. You just have to keep showing
                up. ♡
              </p>
            </footer>
          </div>
        </main>

        {/* Create habit modal */}
        <CreateHabitModal
          isOpen={isHabitModalOpen}
          onClose={() => setIsHabitModalOpen(false)}
          onSave={handleSaveHabit}
        />

        {/* Delete habit modal */}
        <DeleteHabitModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleDeleteHabit}
          habitId={selectedHabit?.id}
          habitName={selectedHabit?.name}
        />
      </div>
    </>
  );
};

export default MyHabits;
