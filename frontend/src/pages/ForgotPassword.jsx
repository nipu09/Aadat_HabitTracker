import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import TextField from "../components/ui/TextField.jsx";
import Button from "../components/ui/Button.jsx";
import api, { errorMessage } from "../api/api.js";

export const RESET_EMAIL_KEY = "aadat:reset-email";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      sessionStorage.setItem(RESET_EMAIL_KEY, email.trim().toLowerCase());
      navigate("/reset-password", { state: { email: email.trim().toLowerCase() } });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout panelSide="right" panelColor="bg-blush">
      <h1 className="font-display text-[44px] leading-none tracking-tight">Forgot your password?</h1>
      <p className="mb-8 mt-3 text-[15px] text-muted">Enter your email and we'll send you a code to choose a new one.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField label="Email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit" size="lg" full disabled={busy}>
          {busy ? "Sending…" : "Send reset code"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-muted">
        <Link to="/login" className="font-medium text-link hover:underline">
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
}
