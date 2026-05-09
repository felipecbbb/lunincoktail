import Link from "next/link";

type Props = {
  size?: "sm" | "md" | "lg" | "xl";
  withTagline?: boolean;
  href?: string | null;
  className?: string;
};

const sizeMap = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl md:text-6xl",
  xl: "text-6xl md:text-7xl",
} as const;

export function Logo({ size = "md", withTagline = false, href = "/", className = "" }: Props) {
  const content = (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span
        className={`lunin-wordmark text-lunin-cream leading-none ${sizeMap[size]}`}
      >
        LUNIN
      </span>
      {withTagline && (
        <span
          className="mt-2 text-[0.6rem] tracking-[0.42em] uppercase text-lunin-cream/60 font-headline"
        >
          Cocktail Bar
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} aria-label="Lunin Cocktail Bar" className="inline-flex">
      {content}
    </Link>
  );
}

export function Submark({ size = 36, className = "" }: { size?: number; className?: string }) {
  const stroke = "currentColor";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke={stroke} strokeWidth="2" />
      <text
        x="50"
        y="64"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="48"
        fill={stroke}
      >
        L
      </text>
    </svg>
  );
}
