"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export function useRequireAuth(nextHref: string) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.hydrated && !auth.user) {
      router.replace(`/ingresar?next=${encodeURIComponent(nextHref)}`);
    }
  }, [auth.hydrated, auth.user, nextHref, router]);

  return auth;
}
