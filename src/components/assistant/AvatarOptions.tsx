type Props = { className?: string };

const COMMON = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ACCENT = "#E0405B";

// Option 1 — Opening Path: a single stroke opening/branching into a path,
// with a crimson dot marking the destination.
export function AvatarOpeningPath({ className }: Props) {
  return (
    <svg {...COMMON} className={className} xmlns="http://www.w3.org/2000/svg">
      {/* single origin stroke rising from bottom */}
      <path d="M12 40 C 16 32, 20 28, 24 24" />
      {/* branch A — curves up-right */}
      <path d="M24 24 C 28 20, 32 16, 36 10" />
      {/* branch B — curves right */}
      <path d="M24 24 C 30 26, 34 28, 40 30" />
      {/* subtle third branch */}
      <path d="M24 24 C 26 20, 27 16, 27 12" opacity="0.55" />
      {/* destination marker */}
      <circle cx="36" cy="10" r="2.5" fill={ACCENT} stroke="none" />
    </svg>
  );
}

// Option 2 — Compass Point: abstract four-point star navigator mark
// with the north point in crimson.
export function AvatarCompassPoint({ className }: Props) {
  return (
    <svg {...COMMON} className={className} xmlns="http://www.w3.org/2000/svg">
      {/* east point */}
      <path d="M24 24 L 40 24 L 24 26 Z" />
      {/* south point */}
      <path d="M24 24 L 24 40 L 22 24 Z" />
      {/* west point */}
      <path d="M24 24 L 8 24 L 24 22 Z" />
      {/* north point — crimson accent */}
      <path
        d="M24 24 L 24 8 L 26 24 Z"
        stroke={ACCENT}
        fill={ACCENT}
        fillOpacity="0.12"
      />
    </svg>
  );
}

// Option 3 — Waypoint Trail: four nodes connected by a rising line,
// final node crimson and emphasized.
export function AvatarWaypointTrail({ className }: Props) {
  return (
    <svg {...COMMON} className={className} xmlns="http://www.w3.org/2000/svg">
      {/* connecting rising line */}
      <path d="M10 36 L 20 28 L 30 20 L 38 12" />
      {/* nodes */}
      <circle cx="10" cy="36" r="2.25" />
      <circle cx="20" cy="28" r="2.25" />
      <circle cx="30" cy="20" r="2.25" />
      {/* final destination node — crimson, emphasized */}
      <circle cx="38" cy="12" r="3.25" fill={ACCENT} stroke={ACCENT} />
    </svg>
  );
}