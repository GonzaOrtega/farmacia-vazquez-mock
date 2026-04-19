"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface Props {
  id: string;
  children: ReactNode;
}

export function ProductCardLink({ id, children }: Props) {
  const router = useRouter();
  const href = `/producto/${id}`;

  const go = () => router.push(href);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    go();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      aria-label={`Ver producto ${id}`}
      className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--pro-primary)] rounded-[16px]"
    >
      {children}
    </div>
  );
}
