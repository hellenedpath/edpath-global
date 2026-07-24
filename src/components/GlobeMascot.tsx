import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { className?: string };

/**
 * EdPath globe mascot — reusable brand character.
 * Colors are locked to the EdPath palette (navy / azul / crimson).
 */
export function GlobeMascot({ className, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 200 210"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="EdPath globe mascot"
      {...rest}
    >
      <defs>
        <clipPath id="edpath-globe-mascot-clip">
          <circle cx="100" cy="112" r="72" />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="196" rx="52" ry="9" fill="#051556" opacity=".12" />
      <circle cx="100" cy="112" r="72" fill="#396CD8" />
      <g clipPath="url(#edpath-globe-mascot-clip)">
        <path d="M40 86 q22 -13 42 -4 q15 7 6 24 q-11 17 -33 12 q-24 -5 -15 -32z" fill="#0b2586" />
        <path d="M120 74 q26 -6 34 12 q6 17 -13 24 q-21 6 -29 -9 q-8 -19 8 -27z" fill="#0b2586" />
        <path d="M68 134 q25 -8 46 6 q16 12 2 30 q-23 20 -48 8 q-21 -12 0 -44z" fill="#0b2586" />
        <ellipse cx="100" cy="112" rx="72" ry="28" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" />
        <line x1="28" y1="112" x2="172" y2="112" stroke="#fff" strokeOpacity=".35" strokeWidth="3" />
      </g>
      <circle cx="100" cy="112" r="72" fill="none" stroke="#0b2586" strokeWidth="4" />
      <circle cx="80" cy="106" r="11" fill="#fff" />
      <circle cx="82" cy="108" r="5" fill="#0b1030" />
      <circle cx="120" cy="106" r="11" fill="#fff" />
      <circle cx="122" cy="108" r="5" fill="#0b1030" />
      <circle cx="70" cy="126" r="6.5" fill="#E0405B" opacity=".5" />
      <circle cx="130" cy="126" r="6.5" fill="#E0405B" opacity=".5" />
      <path d="M84 128 q16 16 32 0" fill="none" stroke="#0b1030" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M84 52 L116 52 L110 66 Q100 72 90 66 Z" fill="#051556" />
      <path d="M100 30 L148 48 L100 66 L52 48 Z" fill="#0b1030" stroke="#051556" strokeWidth="1.5" />
      <circle cx="100" cy="48" r="4" fill="#E0405B" />
      <path d="M100 48 L140 48 L140 72" fill="none" stroke="#E0405B" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M134 70 L146 70 L143 82 L137 82 Z" fill="#E0405B" />
    </svg>
  );
}

export default GlobeMascot;