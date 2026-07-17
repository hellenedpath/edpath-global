import { cn } from "@/lib/utils";

type FlagCode = "canada" | "usa" | "uk" | "australia" | "ireland" | "brazil";

interface FlagProps {
  code: FlagCode;
  className?: string;
  title?: string;
}

/**
 * Crisp, vector SVG country flags. Consistent 3:2 viewBox (60x40) so sizing
 * by width in Tailwind (e.g. w-5) yields a proportional flag.
 */
export function Flag({ code, className, title }: FlagProps) {
  const cls = cn(
    "block rounded-[3px] overflow-hidden ring-1 ring-black/10 shadow-sm",
    className,
  );
  const common = {
    viewBox: "0 0 60 40",
    className: cls,
    role: "img" as const,
    "aria-label": title ?? code,
  };

  switch (code) {
    case "canada":
      return (
        <svg {...common}>
          <rect width="60" height="40" fill="#fff" />
          <rect width="15" height="40" fill="#D52B1E" />
          <rect x="45" width="15" height="40" fill="#D52B1E" />
          {/* Stylised maple leaf */}
          <path
            fill="#D52B1E"
            d="M30 8.5l1.6 3.5 3.6-.7-1.5 3.3 3.1 1.9-3.3 1 .5 3.6-3-1.4-1 3.9-1-3.9-3 1.4.5-3.6-3.3-1 3.1-1.9-1.5-3.3 3.6.7z"
          />
        </svg>
      );
    case "usa":
      return (
        <svg {...common}>
          {Array.from({ length: 13 }).map((_, i) => (
            <rect
              key={i}
              y={i * (40 / 13)}
              width="60"
              height={40 / 13}
              fill={i % 2 === 0 ? "#B22234" : "#fff"}
            />
          ))}
          <rect width="24" height={(40 * 7) / 13} fill="#3C3B6E" />
          <g fill="#fff">
            {Array.from({ length: 5 }).flatMap((_, row) =>
              Array.from({ length: 6 }).map((_, col) => (
                <circle
                  key={`${row}-${col}`}
                  cx={2 + col * 3.6}
                  cy={2 + row * 4}
                  r={0.7}
                />
              )),
            )}
          </g>
        </svg>
      );
    case "uk":
      return (
        <svg {...common}>
          <clipPath id="uk-clip">
            <rect width="60" height="40" />
          </clipPath>
          <g clipPath="url(#uk-clip)">
            <rect width="60" height="40" fill="#012169" />
            <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
            <path
              d="M0,0 L60,40 M60,0 L0,40"
              stroke="#C8102E"
              strokeWidth="3"
              clipPath="url(#uk-clip)"
            />
            <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      );
    case "australia":
      return (
        <svg {...common}>
          <rect width="60" height="40" fill="#012169" />
          {/* Canton (UK flag scaled) */}
          <g transform="translate(0,0) scale(0.5)">
            <rect width="60" height="40" fill="#012169" />
            <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
            <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3" />
            <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
          </g>
          {/* Commonwealth + Southern Cross stars */}
          <g fill="#fff">
            <circle cx="15" cy="30" r="2" />
            <circle cx="42" cy="10" r="1.8" />
            <circle cx="50" cy="18" r="1.8" />
            <circle cx="45" cy="26" r="1.6" />
            <circle cx="53" cy="28" r="1.2" />
            <circle cx="48" cy="34" r="1.6" />
          </g>
        </svg>
      );
    case "ireland":
      return (
        <svg {...common}>
          <rect width="20" height="40" fill="#169B62" />
          <rect x="20" width="20" height="40" fill="#fff" />
          <rect x="40" width="20" height="40" fill="#FF883E" />
        </svg>
      );
    case "brazil":
      return (
        <svg {...common}>
          <rect width="60" height="40" fill="#009B3A" />
          <path d="M30 4 L56 20 L30 36 L4 20 Z" fill="#FEDF00" />
          <circle cx="30" cy="20" r="7.5" fill="#002776" />
        </svg>
      );
    default:
      return null;
  }
}

export default Flag;