"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { mockUser } from "@/lib/data/account";
import type { AuthUser } from "@/types/user";

const STORAGE_KEY = "fv-auth-v1";

interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  login: (email: string) => AuthUser;
  signup: (input: SignupInput) => AuthUser;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);

function todayMemberLabel(): string {
  return new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());
}

function userFromEmail(email: string): AuthUser {
  if (email.trim().toLowerCase() === mockUser.email.toLowerCase()) {
    return {
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      memberSince: mockUser.memberSince,
    };
  }
  return {
    firstName: "Invitado",
    lastName: "",
    email,
    memberSince: todayMemberLabel(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed && typeof parsed.email === "string") {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage hydration
          setUser(parsed);
        }
      }
    } catch {
      // ignore corrupted localStorage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore quota errors
    }
  }, [user, hydrated]);

  const login = useCallback((email: string): AuthUser => {
    const next = userFromEmail(email);
    setUser(next);
    return next;
  }, []);

  const signup = useCallback(({ firstName, lastName, email }: SignupInput): AuthUser => {
    const next: AuthUser = {
      firstName: firstName.trim() || "Invitado",
      lastName: lastName.trim(),
      email,
      memberSince: todayMemberLabel(),
    };
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthState = useMemo(
    () => ({ user, hydrated, login, signup, logout }),
    [user, hydrated, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
