import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import TextField from "../components/ui/TextField.jsx";
import Button from "../components/ui/Button.jsx";
import PasswordStrength from "../components/pannel/PasswordStrength.jsx";
import api, { errorMessage } from "../api/api.js";
import { PENDING_EMAIL_KEY } from "./OtpVerify.jsx";

const benefits = [
  "Build calm morning and evening rituals",
  "See a full year of progress at a glance",
  "Progress, not perfection",
];

function BenefitsPanel() {
  return (
    <>
      <h2 className="font-display text-[52px] leading-[1.05] tracking-tight">Grow one small habit at a time.</h2>
      <ul className="mt-8 space-y-3">
        {benefits.map((b) => (
          <li key={b} className="rounded-xl bg-white px-5 py-3.5 text-[15px]">
            {b}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) next.password = "Use a mix of letters and numbers.";
    if (!agreed) next.terms = "Agree to the Terms and Privacy Policy to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const res = await api.post("/auth/register", { ...form, name: form.name.trim(), email: form.email.trim() });
      sessionStorage.setItem(PENDING_EMAIL_KEY, res.data.email);
      navigate("/otpverify", { state: { email: res.data.email, emailSent: res.data.emailSent } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else if (err.response?.status === 409) setErrors({ email: "An account with this email already exists." });
      else setErrors({ form: errorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout panelSide="left" panelColor="bg-blush" panel={<BenefitsPanel />}>
      <h1 className="font-display text-[45px] leading-none tracking-tight">Create your account.</h1>
      <p className="mb-7 mt-3 text-[15px] text-muted">It only takes a minute to get started.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField label="Full name" name="name" autoComplete="name" placeholder="Your name" maxLength={60} value={form.name} onChange={update("name")} error={errors.name} />
        <TextField label="Email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update("email")} error={errors.email} />
        <div>
          <TextField label="Password" type="password" name="password" autoComplete="new-password" placeholder="At least 8 characters" maxLength={72} value={form.password} onChange={update("password")} error={errors.password} />
          <PasswordStrength password={form.password} />
        </div>

        <div>
          <label className="flex items-center gap-3 text-[15px]">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="h-[18px] w-[18px] rounded border-line accent-lilac-dark" />
            <span>
              I agree to the{" "}
              <a href="#" className="text-link hover:underline">Terms</a> and{" "}
              <a href="#" className="text-link hover:underline">Privacy Policy</a>.
            </span>
          </label>
          {errors.terms && <p className="mt-1.5 text-sm text-red-600">{errors.terms}</p>}
        </div>

        {errors.form && (
          <p role="alert" className="text-sm text-red-600">
            {errors.form}
          </p>
        )}

        <Button type="submit" size="lg" full disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-link hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
