import { NavLink } from "react-router-dom";
import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";
import { NAV } from "./navItems";

const DISPLAY = "font-['Instrument_Serif',serif] font-normal tracking-tight";

const linkBase =
  "rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#66627f] transition-colors hover:bg-[#eeeaf7] hover:text-[#514078]";

const Sidebar = ({ habitsLeft = 0 }) => {
  const { user, logout } = useAuth();

  const fullName = user?.name || "User";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] flex-col overflow-y-auto border-r border-[#e7e4f1] bg-[#f7f5fc] px-4 py-5 md:flex">
      <div className="shrink-0 px-1">
        <Logo />
      </div>

      <div className="mt-9 shrink-0">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b87a5]">Your space</p>

        <nav className="flex flex-col gap-1" aria-label="Main">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-xl px-3 py-3 text-[14px] font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8470c2] ${
                  isActive ? "bg-[#e7def8] text-[#514078] shadow-sm" : "text-[#66627f] hover:bg-[#eeeaf7] hover:text-[#514078]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`grid h-6 min-w-6 place-items-center rounded-lg px-1.5 text-xs font-semibold transition-colors duration-200 ${
                        isActive ? "bg-[#9b83cb] text-white" : "bg-white text-[#77718e] group-hover:bg-[#e2daf2]"
                      }`}
                      aria-label={`${habitsLeft} habits left today`}
                    >
                      {habitsLeft}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto shrink-0 pt-8">
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#f0d5eb] bg-[#fbeaf5] p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-lg text-[#a16f9c]">✳</div>
          <p className={`${DISPLAY} text-[26px] leading-tight text-[#39334e]`}>
            A little,
            <br />
            every day.
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-[#777087]">
            Small habits grow into a life you love. Keep showing up.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <NavLink to="/settings" className={({ isActive }) => `${linkBase} ${isActive ? "bg-[#e7def8] text-[#514078]" : ""}`}>
            Settings
          </NavLink>
          <button type="button" onClick={logout} className={`${linkBase} text-left`}>
            Logout
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-[#e7e2f0] px-1 pt-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white bg-[#d8f0e9] text-sm font-semibold text-[#425f59]">
            {initials || "U"}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-semibold text-[#39334e]">{fullName}</p>
            <p className="mt-1 text-[11px] text-[#8b87a5]">Personal workspace</p>
          </div>
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#80bca8]" title="Active" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
