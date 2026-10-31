
import { Link } from "react-router-dom";

function Logo({ size = "md" }) {
  const box = size === "lg" ? "h-10 w-10" : "h-8 w-8";
  const text = size === "lg" ? "text-[26px]" : "text-2xl";

  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3"
      aria-label="Aadat home"
    >
      <span
        className={`${box} flex items-center justify-center rounded-lg bg-lilac`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ink"
          aria-hidden="true"
        >
          <path d="M12 21v-8" />
          <path d="M12 13c0-3-2-5-5-5 0 3 2 5 5 5z" />
          <path d="M12 11c0-3 2-5 5-5 0 3-2 5-5 5z" />
        </svg>
      </span>

      <span className={`${text} font-normal tracking-tight text-ink`}>
        Aadat
      </span>
    </Link>
  );
}

export default Logo;
