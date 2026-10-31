import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas p-6 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-link">404</p>
        <h1 className="mt-2 font-display text-5xl">Page not found.</h1>
        <p className="mt-3 text-muted">The page you're looking for doesn't exist or was moved.</p>
        <Link to="/" className="btn_ppl mt-6">
          Go home
        </Link>
      </div>
    </div>
  );
}
