import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import TextField from "../components/ui/TextField.jsx";
import Button from "../components/ui/Button.jsx";
import PasswordStrength from "../components/pannel/PasswordStrength.jsx";
import api, { errorMessage } from "../api/api.js";
import { RESET_EMAIL_KEY } from "./ForgotPassword.jsx";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem(RESET_EMAIL_KEY) || "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (!email) return <Navigate to="/forgot-password" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!/^\d{6}$/.test(code)) next.code = "Enter the 6-digit code from your email.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) next.password = "Use a mix of letters and numbers.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await api.post("/auth/reset-password", { email, code, password });
      sessionStorage.removeItem(RESET_EMAIL_KEY);
      navigate("/login", { replace: true, state: { notice: "Password updated. Log in with your new password." } });
    } catch (err) {
      setErrors({ form: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout panelSide="right" panelColor="bg-blush">
      <h1 className="font-display text-[44px] leading-none tracking-tight">Choose a new password.</h1>
      <p className="mb-8 mt-3 text-[15px] text-muted">
        Enter the code we sent to <strong className="text-ink">{email}</strong> and your new password.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.form && (
          <p role="alert" className="text-sm text-red-600">
            {errors.form}
          </p>
        )}
        <TextField label="Reset code" name="code" inputMode="numeric" autoComplete="one-time-code" placeholder="123456" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} error={errors.code} />
        <div>
          <TextField label="New password" type="password" name="password" autoComplete="new-password" placeholder="At least 8 characters" maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
          <PasswordStrength password={password} />
        </div>
        <Button type="submit" size="lg" full disabled={busy}>
          {busy ? "Saving…" : "Update password"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-muted">
        No code?{" "}
        <Link to="/forgot-password" className="font-medium text-link hover:underline">
          Send a new one
        </Link>
      </p>
    </AuthLayout>
  );
}
