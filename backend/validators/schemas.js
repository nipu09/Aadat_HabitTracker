const { z } = require("zod");

const email = z.string().trim().toLowerCase().email("Enter a valid email address.").max(254);
const newPassword = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be at most 72 characters.")
  .refine((p) => /[A-Za-z]/.test(p) && /\d/.test(p), "Use a mix of letters and numbers.");
const code = z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code.");

const habitName = z.string().trim().min(1, "Habit name is required.").max(100, "Habit name is too long.");
const description = z.string().trim().max(200, "Description is too long.");

// Accept both `description` and the older `habitDescription` field name
const withDescription = (obj) =>
  obj.transform(({ habitDescription, ...rest }) => ({
    ...rest,
    ...(rest.description === undefined && habitDescription !== undefined ? { description: habitDescription } : {}),
  }));

module.exports = {
  registerSchema: z.object({
    name: z.string().trim().min(1, "Enter your name.").max(60, "Name is too long."),
    email,
    password: newPassword,
  }),
  loginSchema: z.object({ email, password: z.string().min(1, "Enter your password.").max(200) }),
  verifyOtpSchema: z.object({ email, otp: code }),
  emailOnlySchema: z.object({ email }),
  resetPasswordSchema: z.object({ email, code, password: newPassword }),
  changePasswordSchema: z.object({
    currentPassword: z.string().min(1, "Enter your current password.").max(200),
    newPassword,
  }),
  deleteAccountSchema: z.object({ password: z.string().min(1, "Enter your password.").max(200) }),

  createHabitSchema: withDescription(
    z.object({ habitName, description: description.optional(), habitDescription: description.optional() }),
  ),
  updateHabitSchema: withDescription(
    z.object({ habitName: habitName.optional(), description: description.optional(), habitDescription: description.optional() }),
  ).refine((b) => Object.keys(b).length > 0, "Provide at least one field to update."),
  checkInSchema: z.object({
    completed: z.boolean({ required_error: "completed (true/false) is required." }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  }),
};
