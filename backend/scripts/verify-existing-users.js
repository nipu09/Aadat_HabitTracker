// One-time migration: accounts created before email verification existed have
// isVerified=false and would be locked out. Run ONCE before launch:
//   npm run migrate:verify-existing -- --yes
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");

(async () => {
  if (!process.argv.includes("--yes")) {
    console.log("This marks ALL currently unverified users as verified. Re-run with --yes to confirm.");
    process.exit(0);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.updateMany({ isVerified: false }, { $set: { isVerified: true } });
  console.log(`Marked ${result.modifiedCount} user(s) as verified.`);
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
