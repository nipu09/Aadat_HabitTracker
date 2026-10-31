import { NavLink } from "react-router-dom";
import { NAV } from "./navItems";

const ITEMS = [...NAV, { label: "Settings", href: "/settings" }];

// Bottom tab bar, phones only (the sidebar takes over from md and up)
export default function MobileNav({ habitsLeft = 0 }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e4f1] bg-[#f7f5fc]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-xl">
        {ITEMS.map((item) => (
          <li key={item.label} className="flex-1">
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-medium ${
                  isActive ? "text-[#514078]" : "text-[#77718e]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`h-1 w-6 rounded-full ${isActive ? "bg-[#9b83cb]" : "bg-transparent"}`} aria-hidden="true" />
                  <span className="flex items-center gap-1">
                    {item.label}
                    {item.badge && habitsLeft > 0 && (
                      <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#9b83cb] px-1 text-[10px] text-white">
                        {habitsLeft}
                      </span>
                    )}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
