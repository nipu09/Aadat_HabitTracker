// Scores 0-4: length 8+, letters and numbers, 12+ characters, upper/lower case or a symbol.
export function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Za-z]/.test(pw) && /\d/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if ((/[a-z]/.test(pw) && /[A-Z]/.test(pw)) || /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const labels = ["Too short", "Weak", "Okay", "Good", "Strong"];

export default function PasswordStrength({ password }) {
  const score = scorePassword(password);
  return (
    <div className="mt-2">
      <div className="flex gap-2" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1 flex-1 rounded-full ${score >= n ? "bg-lilac" : "bg-lilac-light"}`} />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        Use 8 or more characters with a mix of letters and numbers.
        {password && <span className="sr-only"> Strength: {labels[score]}.</span>}
      </p>
    </div>
  );
}
