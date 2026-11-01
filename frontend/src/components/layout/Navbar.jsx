import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-canvas/90 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
        <Link to="/" className="font-display text-xl">
          Aadat
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-muted hover:text-ink">Features</a>
          <a href="#how-it-works" className="text-sm text-muted hover:text-ink">How it works</a>
          <Button to="/login" variant="secondary">Log in</Button>
          <Button to="/signup">Get started</Button>
        </div>

        {/* Mobile: Get started stays visible + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <Button to="/signup" size="sm">Get started</Button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="rounded-lg p-2 hover:bg-black/5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-black/5 px-4 pb-4 pt-2 md:hidden">
          <a href="#features" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-muted hover:bg-black/5">
            Features
          </a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-muted hover:bg-black/5">
            How it works
          </a>
          <Button to="/login" variant="secondary" className="mt-2 w-full" onClick={() => setOpen(false)}>
            Log in
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
