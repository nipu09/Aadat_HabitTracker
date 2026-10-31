import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

// status: "loading" | "authed" | "guest" | "error" (server unreachable)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const check = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      setStatus("authed");
    } catch (err) {
      setUser(null);
      // 401 = simply not logged in. No response / 5xx = server trouble, don't pretend they're logged out.
      const code = err.response?.status;
      setStatus(!code || code >= 500 ? "error" : "guest");
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setStatus("guest");
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const setSession = useCallback((nextUser) => {
    setUser(nextUser);
    setStatus(nextUser ? "authed" : "guest");
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* the cookie may already be gone; either way the user is signed out locally */
    }
    setSession(null);
  }, [setSession]);

  const value = useMemo(
    () => ({ user, status, setSession, logout, retry: check }),
    [user, status, setSession, logout, check],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
