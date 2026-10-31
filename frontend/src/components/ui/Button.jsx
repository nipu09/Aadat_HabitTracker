
import { Link } from "react-router-dom";

const variants = {
  primary: "bg-lilac text-ink hover:bg-lilac-dark hover:text-white",
  secondary: "border border-line bg-white text-ink hover:bg-lilac-light",
  light: "bg-canvas text-ink hover:bg-white",
};

const sizes = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-[52px] px-6 text-base",
};

function Button({
  to,
  variant = "primary",
  size = "md",
  full = false,
  className = "",
  children,
  ...props
}) {
  const classes = [
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    full ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
