import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";

const TopBar = ({ title = "Today" }) => {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-[#ebe9f3] bg-white/60 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 md:px-7">
      <div className="md:hidden">
        <Logo />
      </div>
      <nav aria-label="Breadcrumb" className="hidden text-sm text-[#6b6985] md:block">
        My workspace <span className="mx-1.5">›</span>
        <span className="font-medium text-[#2a2840]">{title}</span>
      </nav>
      <span className="text-sm font-medium text-[#2a2840] md:hidden">{title}</span>
      <button
        type="button"
        onClick={logout}
        className="rounded-xl bg-[#c1aee2] px-4 py-2.5 text-sm font-medium text-[#2a2840] transition-colors hover:bg-[#b49cd9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8470c2]"
      >
        Logout
      </button>
    </header>
  );
};

export default TopBar;
