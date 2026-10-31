const mongoose = require("mongoose");

// One document per habit per completed day (powers the heat maps).
// An unchecked day simply has no document.
const entrySchema = new mongoose.Schema(
  {
    habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }, // YYYY-MM-DD
    completed: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// One entry per habit per day
entrySchema.index({ habit: 1, date: 1 }, { unique: true });
// Fast per-user date-range queries for the overall heat map
entrySchema.index({ user: 1, date: 1 });

module.exports = mongoose.model("Entry", entrySchema);
