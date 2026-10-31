// Lightweight SVG ring (replaces the heavy Material UI dependency)
const ProgressRing = ({ value = 0, size = 120, thickness = 6 }) => {
  const progress = Math.min(100, Math.max(0, value));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-label={`Progress: ${Math.round(progress)}%`}
      >
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0ebf7" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#a48bcf"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-semibold leading-none tracking-tight text-[#132507]" style={{ fontSize: size * 0.18 }}>
          {Math.round(progress)}%
        </span>
        <span className="mt-1 font-medium tracking-wider text-[#8b849d]" style={{ fontSize: size * 0.085 }}>
          COMPLETE
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
