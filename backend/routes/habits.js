const express = require("express");
const mongoose = require("mongoose");

const Habit = require("../models/habit");
const Entry = require("../models/entry");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { getToday, addDays } = require("../utils/date");
const { computeStreaks } = require("../utils/streak");
const { createHabitSchema, updateHabitSchema, checkInSchema } = require("../validators/schemas");

const router = express.Router();
router.use(authMiddleware);

const MAX_HABITS_PER_USER = 50;
const HEATMAP_DAYS = 365; // rolling window ending today
const STREAK_LOOKBACK_DAYS = 366;

router.param("id", (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id) || String(id).length !== 24) {
    return next(new AppError(400, "Invalid habit ID.", "BAD_ID"));
  }
  next();
});

const shape = (habit, { done = false, streak = 0, longest = 0 } = {}) => ({
  _id: habit._id,
  habitName: habit.habitName,
  description: habit.description || "",
  createdAt: habit.createdAt,
  doneToday: done,
  streak,
  longestStreak: longest,
});

async function findOwnedHabit(req) {
  const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
  if (!habit) throw new AppError(404, "Habit not found.", "NOT_FOUND");
  return habit;
}

// GET /habits -> all habits with today's status and streaks
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const today = getToday();
    const since = addDays(today, -STREAK_LOOKBACK_DAYS);

    const [habits, entries] = await Promise.all([
      Habit.find({ user: req.user._id }).sort({ createdAt: -1 }),
      Entry.find({ user: req.user._id, completed: true, date: { $gte: since, $lte: today } })
        .select("habit date")
        .lean(),
    ]);

    const byHabit = new Map();
    for (const e of entries) {
      const key = String(e.habit);
      if (!byHabit.has(key)) byHabit.set(key, []);
      byHabit.get(key).push(e.date);
    }

    res.json({
      success: true,
      today,
      count: habits.length,
      habits: habits.map((h) => {
        const dates = byHabit.get(String(h._id)) || [];
        const { current, longest } = computeStreaks(dates, today);
        return shape(h, { done: dates.includes(today), streak: current, longest });
      }),
    });
  }),
);

// GET /habits/heatmap -> overall activity: number of habits completed on each day
router.get(
  "/heatmap",
  asyncHandler(async (req, res) => {
    const endDate = getToday();
    const startDate = addDays(endDate, -(HEATMAP_DAYS - 1));

    const [rows, totalHabits] = await Promise.all([
      Entry.aggregate([
        { $match: { user: req.user._id, completed: true, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: "$date", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Habit.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      success: true,
      startDate,
      endDate,
      totalHabits,
      values: rows.map((r) => ({ date: r._id, count: r.count })),
    });
  }),
);

// POST /habits -> create
router.post(
  "/",
  validate(createHabitSchema),
  asyncHandler(async (req, res) => {
    const count = await Habit.countDocuments({ user: req.user._id });
    if (count >= MAX_HABITS_PER_USER) {
      throw new AppError(400, `You can track up to ${MAX_HABITS_PER_USER} habits.`, "HABIT_LIMIT");
    }
    const habit = await Habit.create({
      habitName: req.body.habitName,
      description: req.body.description || "",
      user: req.user._id,
    });
    res.status(201).json({ success: true, message: "Habit created.", habit: shape(habit) });
  }),
);

// GET /habits/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const habit = await findOwnedHabit(req);
    res.json({ success: true, habit: shape(habit) });
  }),
);

// PATCH /habits/:id -> rename / change description
router.patch(
  "/:id",
  validate(updateHabitSchema),
  asyncHandler(async (req, res) => {
    const habit = await findOwnedHabit(req);
    if (req.body.habitName !== undefined) habit.habitName = req.body.habitName;
    if (req.body.description !== undefined) habit.description = req.body.description;
    await habit.save();
    res.json({ success: true, message: "Habit updated.", habit: shape(habit) });
  }),
);

// DELETE /habits/:id -> removes the habit and all of its history
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const habit = await findOwnedHabit(req);
    await Entry.deleteMany({ habit: habit._id });
    await habit.deleteOne();
    res.json({ success: true, message: "Habit deleted.", habit: { _id: habit._id } });
  }),
);

// PUT /habits/:id/today -> check or uncheck TODAY only
router.put(
  "/:id/today",
  validate(checkInSchema),
  asyncHandler(async (req, res) => {
    const today = getToday(); // decided by the server, never the client
    const { completed, date } = req.body;

    if (date && date !== today) {
      throw new AppError(409, "It's a new day. Refresh to update today's habits.", "STALE_DATE", { today });
    }

    const habit = await findOwnedHabit(req);

    if (completed) {
      try {
        await Entry.updateOne(
          { habit: habit._id, date: today },
          { $set: { user: req.user._id, completed: true } },
          { upsert: true },
        );
      } catch (err) {
        if (err.code !== 11000) throw err; // a concurrent request already created it
      }
    } else {
      await Entry.deleteOne({ habit: habit._id, date: today });
    }

    const entries = await Entry.find({
      habit: habit._id,
      completed: true,
      date: { $gte: addDays(today, -STREAK_LOOKBACK_DAYS), $lte: today },
    })
      .select("date")
      .lean();
    const dates = entries.map((e) => e.date);
    const { current, longest } = computeStreaks(dates, today);

    res.json({
      success: true,
      today,
      habit: shape(habit, { done: dates.includes(today), streak: current, longest }),
    });
  }),
);

// GET /habits/:id/heatmap -> done / not done per day for one habit
router.get(
  "/:id/heatmap",
  asyncHandler(async (req, res) => {
    const habit = await findOwnedHabit(req);
    const endDate = getToday();
    const startDate = addDays(endDate, -(HEATMAP_DAYS - 1));

    const entries = await Entry.find({
      habit: habit._id,
      completed: true,
      date: { $gte: startDate, $lte: endDate },
    })
      .select("date")
      .sort({ date: 1 })
      .lean();

    res.json({
      success: true,
      startDate,
      endDate,
      values: entries.map((e) => ({ date: e.date, count: 1 })),
    });
  }),
);

module.exports = router;
