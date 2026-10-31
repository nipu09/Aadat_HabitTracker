require("dotenv").config();
const { z } = require("zod");

const isValidTimezone = (tz) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_KEY: z.string().min(32, "JWT_KEY must be at least 32 characters"),
    CLIENT_URL: z.string().default("http://localhost:5173"),
    COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),
    APP_TIMEZONE: z
      .string()
      .default("Asia/Kolkata")
      .refine(isValidTimezone, "APP_TIMEZONE must be a valid IANA timezone"),
    TRUST_PROXY: z.coerce.number().int().min(0).default(1),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    MAIL_FROM: z.string().default("Aadat <no-reply@aadat.app>"),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production") {
      for (const key of ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"]) {
        if (!env[key]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key],
            message: `${key} is required in production (emails are needed for verification)`,
          });
        }
      }
    }
  });

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${details}`);
}

const env = parsed.data;

env.allowedOrigins = env.CLIENT_URL.split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

module.exports = env;
