const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    habitName: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 200, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Habit", habitSchema);
