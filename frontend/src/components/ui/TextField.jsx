import { useId } from "react";

// Labelled input. `labelAction` sits on the right of the label row (e.g. "Forgot password?").
export default function TextField({ label, labelAction, error, className = "", ...props }) {
  const id = useId();
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {labelAction}
      </div>
      <input
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-[15px] placeholder:text-muted/60 ${
          error ? "border-red-400" : "border-line"
        } focus:border-lilac-dark focus:outline-none focus:ring-2 focus:ring-lilac/50`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
