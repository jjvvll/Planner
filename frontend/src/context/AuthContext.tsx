import { createContext, useContext, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useAuth";
import { authKeys } from "@/hooks/useAuth";
import type { User } from "@/types/auth";

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();

  // Listen for 401 events fired by the axios interceptor
  useEffect(() => {
    function onUnauthenticated() {
      queryClient.setQueryData(authKeys.user, null);
    }

    function onCsrfMismatch() {
      // CSRF cookie expired — clear user so the app redirects to login
      queryClient.setQueryData(authKeys.user, null);
    }

    window.addEventListener("auth:unauthenticated", onUnauthenticated);
    window.addEventListener("auth:csrf-mismatch", onCsrfMismatch);

    return () => {
      window.removeEventListener("auth:unauthenticated", onUnauthenticated);
      window.removeEventListener("auth:csrf-mismatch", onCsrfMismatch);
    };
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Consumer hook ─────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
