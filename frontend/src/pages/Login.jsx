import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout.jsx";
import TextField from "../components/ui/TextField.jsx";
import Button from "../components/ui/Button.jsx";
import api, { errorMessage } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PENDING_EMAIL_KEY } from "./OtpVerify.jsx";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await api.post("/auth/login", { email: email.trim(), password });
      // The token lives in an httpOnly cookie; we only keep the user's public details
      setSession(res.data.user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const data = error.response?.data;
      if (data?.code === "EMAIL_NOT_VERIFIED") {
        const target = data.email || email.trim();
        sessionStorage.setItem(PENDING_EMAIL_KEY, target);
        navigate("/otpverify", { state: { email: target, emailSent: true } });
        return;
      }
      setErrors({ form: errorMessage(error, "Invalid email or password.") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout panelSide="right" panelColor="bg-mint">
      <h1 className="font-display text-[48px] leading-none tracking-tight">Welcome back.</h1>
      <p className="mb-8 mt-3 text-[15px] text-muted">Log in to pick up where you left off.</p>

      {location.state?.notice && (
        <p role="status" className="mb-4 rounded-xl bg-mint px-4 py-3 text-sm">
          {location.state.notice}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {errors.form && (
          <p role="alert" className="text-sm text-red-600">
            {errors.form}
          </p>
        )}
        <TextField label="Email" type="email" name="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          labelAction={
            <Link to="/forgot-password" className="text-sm text-link hover:underline">
              Forgot password?
            </Link>
          }
        />
        <Button type="submit" size="lg" full disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-muted">
        New to Aadat?{" "}
        <Link to="/signup" className="font-medium text-link hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};
export default Login;
