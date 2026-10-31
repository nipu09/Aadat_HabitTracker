import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import TextField from "../components/ui/TextField";
import Button from "../components/ui/Button";
import PasswordStrength from "../components/pannel/PasswordStrength";
import api, { errorMessage } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Card = ({ title, children, tone = "default" }) => (
  <section className={`rounded-3xl border bg-white p-5 sm:p-6 ${tone === "danger" ? "border-red-200" : "border-[#ebe9f3]"}`}>
    <h2 className="font-['Instrument_Serif',serif] text-2xl">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setDone(false);
    const next = {};
    if (!form.currentPassword) next.currentPassword = "Enter your current password.";
    if (form.newPassword.length < 8) next.newPassword = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(form.newPassword) || !/\d/.test(form.newPassword)) next.newPassword = "Use a mix of letters and numbers.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await api.post("/auth/change-password", form);
      setForm({ currentPassword: "", newPassword: "" });
      setDone(true);
    } catch (err) {
      setErrors({ form: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-md space-y-4">
      {errors.form && <p role="alert" className="text-sm text-red-600">{errors.form}</p>}
      {done && <p role="status" className="rounded-xl bg-mint px-4 py-3 text-sm">Password changed. Your other devices were signed out.</p>}
      <TextField label="Current password" type="password" autoComplete="current-password" value={form.currentPassword} onChange={(e) => setForm((f) => ({ ...f, currentPassword: e.target.value }))} error={errors.currentPassword} />
      <div>
        <TextField label="New password" type="password" autoComplete="new-password" maxLength={72} value={form.newPassword} onChange={(e) => setForm((f) => ({ ...f, newPassword: e.target.value }))} error={errors.newPassword} />
        <PasswordStrength password={form.newPassword} />
      </div>
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Change password"}</Button>
    </form>
  );
}

function DeleteAccount() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError("Enter your password to confirm.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.delete("/auth/account", { data: { password } });
      setSession(null);
      navigate("/", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <>
        <p className="text-sm text-[#6b6985]">Permanently delete your account, all your habits and your whole history. This can't be undone.</p>
        <button type="button" className="btn_wht mt-4" onClick={() => setOpen(true)}>
          Delete my account
        </button>
      </>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-md space-y-4">
      <p className="text-sm text-red-600">This permanently deletes your account and every habit. Enter your password to confirm.</p>
      <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className="inline-flex h-11 items-center rounded-xl bg-red-600 px-5 text-[15px] font-medium text-white hover:bg-red-700 disabled:opacity-60">
          {busy ? "Deleting…" : "Yes, delete everything"}
        </button>
        <Button type="button" variant="secondary" onClick={() => { setOpen(false); setPassword(""); setError(""); }} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { user } = useAuth();

  return (
    <AppShell title="Settings">
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#a095b8]">Your account</p>
        <h1 className="font-['Instrument_Serif',serif] text-4xl">Settings</h1>
      </div>

      <div className="space-y-5">
        <Card title="Profile">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#77718d]">Name</dt>
              <dd className="mt-1 break-words font-medium">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-[#77718d]">Email</dt>
              <dd className="mt-1 break-all font-medium">{user?.email}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Change password">
          <ChangePassword />
        </Card>
        <Card title="Delete account" tone="danger">
          <DeleteAccount />
        </Card>
      </div>
    </AppShell>
  );
}
