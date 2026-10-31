const crypto = require("crypto");
const express = require("express");

const env = require("../config/env");
const User = require("../models/user");
const Habit = require("../models/habit");
const Entry = require("../models/entry");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { authLimiter, codeLimiter } = require("../middleware/rateLimit");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { hashPassword, comparePassword } = require("../utils/hashpassword");
const { setAuthCookie, clearAuthCookie } = require("../utils/token");
const { sendVerificationEmail, sendResetEmail } = require("../utils/mailer");
const {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  emailOnlySchema,
  resetPasswordSchema,
  changePasswordSchema,
  deleteAccountSchema,
} = require("../validators/schemas");

const router = express.Router();

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
// Used so a login for an unknown email takes as long as one for a real email
const DUMMY_HASH = "$2a$12$Md8YXtMcpI5YK/buR2b/9uRVBRYVTRGrFhOyIQMC4unr9C85zIR4i";

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, createdAt: u.createdAt });

// ---- one-time code helpers (purpose = "otp" for email verification, "reset" for passwords) ----
const hashCode = (purpose, email, code) =>
  crypto.createHmac("sha256", env.JWT_KEY).update(`${purpose}:${email}:${code}`).digest("hex");

const safeEqual = (a, b) => {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && crypto.timingSafeEqual(A, B);
};

const newCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, "0");

const onCooldown = (sentAt) => sentAt && Date.now() - sentAt.getTime() < RESEND_COOLDOWN_MS;

const retryAfter = (sentAt) => Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - sentAt.getTime())) / 1000);

async function issueCode(user, purpose) {
  const code = newCode();
  user[`${purpose}Hash`] = hashCode(purpose, user.email, code);
  user[`${purpose}Expires`] = new Date(Date.now() + CODE_TTL_MS);
  user[`${purpose}Attempts`] = 0;
  user[`${purpose}SentAt`] = new Date();
  await user.save();
  if (purpose === "otp") await sendVerificationEmail(user.email, user.name, code);
  else await sendResetEmail(user.email, user.name, code);
}

async function checkCode(user, purpose, code) {
  const hash = user[`${purpose}Hash`];
  const expires = user[`${purpose}Expires`];
  if (!hash || !expires || expires < new Date()) {
    throw new AppError(400, "This code has expired. Request a new one.", "CODE_EXPIRED");
  }
  if (user[`${purpose}Attempts`] >= MAX_ATTEMPTS) {
    throw new AppError(429, "Too many incorrect attempts. Request a new code.", "TOO_MANY_ATTEMPTS");
  }
  if (!safeEqual(hash, hashCode(purpose, user.email, code))) {
    await User.updateOne({ _id: user._id }, { $inc: { [`${purpose}Attempts`]: 1 } });
    throw new AppError(400, "Incorrect code. Please try again.", "CODE_INVALID");
  }
}

function clearCode(user, purpose) {
  user[`${purpose}Hash`] = undefined;
  user[`${purpose}Expires`] = undefined;
  user[`${purpose}Attempts`] = 0;
}

const INVALID_CODE = () => new AppError(400, "Invalid or expired code.", "CODE_INVALID");

// POST /auth/register
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing?.isVerified) {
      throw new AppError(409, "An account with this email already exists.", "EMAIL_TAKEN");
    }

    const hashed = await hashPassword(password);
    const user = existing || new User({ email });
    user.name = name;
    user.password = hashed; // an unverified signup can be retried with new details
    await user.save();

    let emailSent = true;
    try {
      await issueCode(user, "otp");
    } catch (err) {
      emailSent = false;
      console.error("Could not send verification email:", err.message);
    }

    res.status(201).json({
      success: true,
      message: emailSent ? "Account created. Check your email for a verification code." : "Account created, but we couldn't send the email. Use \"Resend code\".",
      email: user.email,
      emailSent,
    });
  }),
);

// POST /auth/verify-otp
router.post(
  "/verify-otp",
  codeLimiter,
  validate(verifyOtpSchema),
  asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select("+otpHash");
    if (!user || user.isVerified) throw INVALID_CODE();

    await checkCode(user, "otp", otp);

    user.isVerified = true;
    clearCode(user, "otp");
    await user.save();

    setAuthCookie(res, user);
    res.json({ success: true, message: "Email verified.", user: publicUser(user) });
  }),
);

// POST /auth/resend-otp
router.post(
  "/resend-otp",
  codeLimiter,
  validate(emailOnlySchema),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && !user.isVerified) {
      if (onCooldown(user.otpSentAt)) {
        throw new AppError(429, "Please wait before requesting another code.", "COOLDOWN", {
          retryAfter: retryAfter(user.otpSentAt),
        });
      }
      try {
        await issueCode(user, "otp");
      } catch (err) {
        console.error("Could not send verification email:", err.message);
        throw new AppError(502, "We couldn't send the email. Please try again shortly.", "EMAIL_FAILED");
      }
    }
    // Same response whether or not the account exists
    res.json({ success: true, message: "If that account needs verification, a new code is on its way." });
  }),
);

// POST /auth/login
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    const valid = await comparePassword(password, user?.password || DUMMY_HASH);
    if (!user || !valid) throw new AppError(401, "Invalid email or password.", "INVALID_CREDENTIALS");

    if (!user.isVerified) {
      if (!onCooldown(user.otpSentAt)) {
        try {
          await issueCode(user, "otp");
        } catch (err) {
          console.error("Could not send verification email:", err.message);
        }
      }
      throw new AppError(403, "Please verify your email to continue.", "EMAIL_NOT_VERIFIED", { email: user.email });
    }

    setAuthCookie(res, user);
    res.json({ success: true, message: "Login successful.", user: publicUser(user) });
  }),
);

// POST /auth/logout
router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: "Logged out." });
});

// GET /auth/me
router.get("/me", authMiddleware, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

// POST /auth/forgot-password
router.post(
  "/forgot-password",
  codeLimiter,
  validate(emailOnlySchema),
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user?.isVerified && !onCooldown(user.resetSentAt)) {
      try {
        await issueCode(user, "reset");
      } catch (err) {
        console.error("Could not send reset email:", err.message);
      }
    }
    // Never reveal whether the email is registered
    res.json({ success: true, message: "If an account exists for that email, we've sent a reset code." });
  }),
);

// POST /auth/reset-password
router.post(
  "/reset-password",
  codeLimiter,
  validate(resetPasswordSchema),
  asyncHandler(async (req, res) => {
    const { email, code, password } = req.body;
    const user = await User.findOne({ email }).select("+resetHash");
    if (!user) throw INVALID_CODE();

    await checkCode(user, "reset", code);

    user.password = await hashPassword(password);
    user.tokenVersion += 1; // signs out every existing session
    user.isVerified = true; // they proved they control the inbox
    clearCode(user, "reset");
    await user.save();

    clearAuthCookie(res);
    res.json({ success: true, message: "Password updated. You can now log in." });
  }),
);

// POST /auth/change-password
router.post(
  "/change-password",
  authLimiter,
  authMiddleware,
  validate(changePasswordSchema),
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await comparePassword(currentPassword, user.password))) {
      throw new AppError(400, "Your current password is incorrect.", "WRONG_PASSWORD");
    }
    if (currentPassword === newPassword) {
      throw new AppError(400, "Choose a password you haven't used just now.", "SAME_PASSWORD");
    }

    user.password = await hashPassword(newPassword);
    user.tokenVersion += 1;
    await user.save();

    setAuthCookie(res, user); // keep this device signed in, sign out all others
    res.json({ success: true, message: "Password changed." });
  }),
);

// DELETE /auth/account
router.delete(
  "/account",
  authLimiter,
  authMiddleware,
  validate(deleteAccountSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("+password");
    if (!(await comparePassword(req.body.password, user.password))) {
      throw new AppError(400, "Your password is incorrect.", "WRONG_PASSWORD");
    }

    await Promise.all([Entry.deleteMany({ user: user._id }), Habit.deleteMany({ user: user._id })]);
    await User.deleteOne({ _id: user._id });

    clearAuthCookie(res);
    res.json({ success: true, message: "Your account and all its data were deleted." });
  }),
);

module.exports = router;
