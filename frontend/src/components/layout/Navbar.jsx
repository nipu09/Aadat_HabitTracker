import Logo from "../common/Logo.jsx";
import Button from "../ui/Button.jsx";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="mx-auto flex h-[88px] w-full max-w-[80%] items-center justify-between px-5 md:px-0">
      <Logo />

      <nav
        className="flex items-center gap-4 text-[15px] text-muted sm:gap-7"
        aria-label="Main"
      >
        <a href="#features" className="hidden hover:text-ink sm:inline">
          Features
        </a>

        <a href="#how-it-works" className="hidden hover:text-ink sm:inline">
          How it works
        </a>

        <Link to="/login" className="font-medium text-ink">
          Log in
        </Link>

        <Button to="/signup">Get started</Button>
      </nav>
    </header>
  );
}

export default Navbar;
