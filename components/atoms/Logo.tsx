interface DragonflyProps {
  size?: number;
  color?: string;
}

export function Dragonfly({ size = 28, color = "#00A651" }: DragonflyProps) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 80 60" aria-hidden>
      <ellipse cx="40" cy="36" rx="2.2" ry="13" fill={color} />
      <circle cx="40" cy="22" r="3.5" fill={color} />
      <ellipse cx="24" cy="28" rx="16" ry="5" fill={color} opacity="0.85" />
      <ellipse cx="56" cy="28" rx="16" ry="5" fill={color} opacity="0.85" />
      <ellipse cx="26" cy="40" rx="13" ry="4" fill={color} opacity="0.6" />
      <ellipse cx="54" cy="40" rx="13" ry="4" fill={color} opacity="0.6" />
    </svg>
  );
}

interface LogoProps {
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
}

const SIZES = {
  sm: { df: 22, t: 14 },
  md: { df: 28, t: 18 },
  lg: { df: 38, t: 24 },
} as const;

export function Logo({ size = "md", onDark = false }: LogoProps) {
  const S = SIZES[size];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <Dragonfly size={S.df} color={onDark ? "#CDDC39" : "#00A651"} />
      <div style={{ lineHeight: 1 }}>
        <div
          className="pro-serif"
          style={{ fontSize: S.t, color: onDark ? "#fff" : "#1A1320", fontWeight: 400 }}
        >
          Farmacia
        </div>
        <div
          className="pro-serif"
          style={{
            fontSize: S.t * 1.25,
            color: onDark ? "#fff" : "#5C1A6E",
            marginTop: -3,
            fontStyle: "italic",
          }}
        >
          Vázquez
        </div>
      </div>
    </div>
  );
}
