import type { ProductArt as Kind } from "@/types/product";

interface Props {
  kind?: Kind;
  colorA?: string;
  colorB?: string;
  brand?: string;
  name?: string;
  size?: string;
  width?: number;
  height?: number;
}

export function ProductArt({
  kind = "bottle",
  colorA = "#E8F4F8",
  colorB = "#5C1A6E",
  brand = "VÁZQUEZ",
  name = "Producto",
  size = "L",
  width = 160,
  height = 200,
}: Props) {
  const shapes: Record<Kind, React.ReactNode> = {
    bottle: (
      <g>
        <rect x="66" y="18" width="28" height="14" rx="3" fill={colorB} />
        <rect x="62" y="32" width="36" height="6" fill={colorB} opacity="0.8" />
        <path
          d="M58 38 h44 v140 a8 8 0 0 1 -8 8 h-28 a8 8 0 0 1 -8 -8 z"
          fill={colorA}
        />
        <rect x="64" y="70" width="32" height="70" fill="#fff" />
      </g>
    ),
    tube: (
      <g>
        <rect x="58" y="20" width="44" height="8" rx="2" fill={colorB} />
        <path
          d="M56 28 h48 l-5 150 a6 6 0 0 1 -6 6 h-26 a6 6 0 0 1 -6 -6 z"
          fill={colorA}
        />
        <rect x="64" y="62" width="32" height="86" fill="#fff" />
      </g>
    ),
    box: (
      <g>
        <rect x="38" y="22" width="84" height="160" rx="4" fill={colorA} />
        <rect x="38" y="22" width="84" height="20" fill={colorB} />
        <rect x="48" y="62" width="64" height="104" fill="#fff" />
      </g>
    ),
    jar: (
      <g>
        <rect x="42" y="32" width="76" height="14" rx="3" fill={colorB} />
        <rect x="38" y="46" width="84" height="140" rx="10" fill={colorA} />
        <rect x="52" y="76" width="56" height="92" fill="#fff" />
      </g>
    ),
    round: (
      <g>
        <rect x="70" y="14" width="20" height="16" rx="3" fill={colorB} />
        <ellipse cx="80" cy="120" rx="52" ry="70" fill={colorA} />
        <rect x="52" y="88" width="56" height="72" fill="#fff" />
      </g>
    ),
  };
  return (
    <svg width={width} height={height} viewBox="0 0 160 200" aria-label={name}>
      {shapes[kind]}
      <text
        x="80"
        y="92"
        textAnchor="middle"
        fontFamily="Inter"
        fontWeight="700"
        fontSize="9"
        fill={colorB}
        style={{ letterSpacing: "0.12em" }}
      >
        {brand}
      </text>
      <text
        x="80"
        y="110"
        textAnchor="middle"
        fontFamily="Instrument Serif, serif"
        fontStyle="italic"
        fontSize="16"
        fill="#1A1320"
      >
        {name}
      </text>
      <line x1="64" y1="120" x2="96" y2="120" stroke={colorB} strokeWidth="1.5" />
      <text
        x="80"
        y="138"
        textAnchor="middle"
        fontFamily="Inter"
        fontSize="8"
        fill="#7A7185"
        style={{ letterSpacing: "0.1em" }}
      >
        {size}
      </text>
    </svg>
  );
}
