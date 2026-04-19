import type { SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "fill" | "stroke"> {
  size?: number;
  stroke?: string;
  fill?: string;
  sw?: number;
}

export function Icon({
  size = 20,
  stroke = "currentColor",
  fill = "none",
  sw = 1.6,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
);
export const IconCart = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 5h2l2.2 11.2a1.6 1.6 0 0 0 1.6 1.3h8.8a1.6 1.6 0 0 0 1.5-1.1L21 8H6" />
    <circle cx="10" cy="21" r="1.2" />
    <circle cx="17" cy="21" r="1.2" />
  </Icon>
);
export const IconHeart = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10z" />
  </Icon>
);
export const IconUser = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </Icon>
);
export const IconMenu = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);
export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
export const IconPin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" />
    <circle cx="12" cy="9" r="2.5" />
  </Icon>
);
export const IconClock = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);
export const IconTruck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </Icon>
);
export const IconCross = (p: IconProps) => (
  <Icon {...p} sw={0}>
    <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" fill="currentColor" />
  </Icon>
);
export const IconChat = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1.4 3.2A8 8 0 0 1 21 12z" />
  </Icon>
);
export const IconInstagram = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </Icon>
);
export const IconWhatsapp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 12a8 8 0 0 1-12.2 6.8L4 20l1.3-3.6A8 8 0 1 1 20 12z" />
  </Icon>
);
export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const IconMinus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);
export const IconArrow = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
export const IconStar = (p: IconProps) => (
  <Icon {...p} sw={0}>
    <path
      d="M12 3l2.6 5.6 6.1.6-4.6 4.2 1.4 6L12 16.8 6.5 19.4l1.4-6L3.3 9.2l6.1-.6z"
      fill="currentColor"
    />
  </Icon>
);
export const IconShield = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.5 8.5-8 9-4.5-.5-8-4.5-8-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);
export const IconRx = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 4h6a4 4 0 0 1 0 8H8" />
    <path d="M8 4v16" />
    <path d="M10 12l8 8M14 14l4-4" />
  </Icon>
);
export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12l4 4L19 7" />
  </Icon>
);
export const IconInfo = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v0M12 11v6" />
  </Icon>
);
export const IconFilter = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 5h16M6 12h12M10 19h4" />
  </Icon>
);
export const IconChevronLeft = (p: IconProps) => (
  <Icon {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Icon>
);
export const IconChevronRight = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 18l6-6-6-6" />
  </Icon>
);
