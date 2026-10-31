import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import TextField from "../components/ui/TextField.jsx";
import Button from "../components/ui/Button.jsx";
import api, { errorMessage } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export const PENDING_EMAIL_KEY = "aadat:pending-email";

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();

  const email = location.state?.email || sessionStorage.getItem(PENDING_EMAIL_KEY) || "";
  const emailSent = location.state?.emailSent !== false;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(emailSent ? "" : "We couldn't send the email yet. Tap “Resend code”.");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(emailSent ? 60 : 0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!email) return <Navigate to="/signup" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await api.post("/auth/verify-otp", { email, otp: code });
      sessionStorage.removeItem(PENDING_EMAIL_KEY);
      setSession(res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError("");
    setInfo("");
    try {
      await api.post("/auth/resend-otp", { email });
      setInfo("A new code is on its way.");
      setCooldown(60);
    } catch (err) {
      const wait = err.response?.data?.retryAfter;
      if (wait) setCooldown(wait);
      setError(errorMessage(err));
    }
  };

  return (
    <AuthLayout panelSide="right" panelColor="bg-lilac-light">
      <h1 className="font-display text-[44px] leading-none tracking-tight">Check your email.</h1>
      <p className="mb-8 mt-3 text-[15px] text-muted">
        We sent a 6-digit code to <strong className="text-ink">{email}</strong>. It expires in 10 minutes.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          label="Verification code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="123456"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          error={error}
        />
        {info && (
          <p role="status" className="text-sm text-muted">
            {info}
          </p>
        )}
        <Button type="submit" size="lg" full disabled={busy}>
          {busy ? "Verifying…" : "Verify email"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-muted">
        Didn't get it?{" "}
        <button type="button" onClick={resend} disabled={cooldown > 0} className="font-medium text-link hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline">
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
      </p>
      <p className="mt-3 text-center text-[15px] text-muted">
        <Link to="/login" className="text-link hover:underline">
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  );
}
