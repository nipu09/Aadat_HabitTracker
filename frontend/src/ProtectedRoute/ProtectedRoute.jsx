import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HabitsProvider } from "../context/HabitsContext";

function FullScreenMessage({ children }) {
  return <div className="grid min-h-screen place-items-center bg-canvas p-6 text-center text-muted">{children}</div>;
}

// Wraps every signed-in page. Habits are loaded once here and shared by all of them.
export default function ProtectedRoute() {
  const { status, retry } = useAuth();

  if (status === "loading") return <FullScreenMessage>Loading…</FullScreenMessage>;
  if (status === "error") {
    return (
      <FullScreenMessage>
        <div>
          <p>Can't reach the server right now.</p>
          <button type="button" onClick={retry} className="btn_ppl mt-4">
            Try again
          </button>
        </div>
      </FullScreenMessage>
    );
  }
  if (status !== "authed") return <Navigate to="/login" replace />;

  return (
    <HabitsProvider>
      <Outlet />
    </HabitsProvider>
  );
}

// Login / sign-up pages: signed-in users go straight to the dashboard
export function PublicOnlyRoute() {
  const { status } = useAuth();
  if (status === "authed") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
