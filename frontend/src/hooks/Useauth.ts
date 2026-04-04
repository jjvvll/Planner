import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/Authservice";
import type {
  LoginPayload,
  RegisterPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
  User,
} from "../types/auth";

// ── Query keys ────────────────────────────────────────────────────────────────

export const authKeys = {
  user: ["auth", "user"] as const,
};

// ── useCurrentUser ────────────────────────────────────────────────────────────

/**
 * Fetches the currently authenticated user.
 * Returns null (not undefined) when unauthenticated so consumers can distinguish
 * "not yet loaded" (undefined) from "definitely not logged in" (null).
 */
export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: authKeys.user,
    queryFn: async () => {
      try {
        return await AuthService.me();
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 min — don't refetch on every focus
    retry: false, // a 401 is not a transient error
  });
}

// ── useRegister ───────────────────────────────────────────────────────────────

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => AuthService.register(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user, user);
      navigate("/");
    },
  });
}

// ── useLogin ──────────────────────────────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => AuthService.login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.user, user);
      navigate("/");
    },
  });
}

// ── useLogout ─────────────────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSettled: () => {
      // Clear all cached data regardless of success/failure
      queryClient.clear();
      navigate("/login");
    },
  });
}

// ── useUpdateProfile ──────────────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      AuthService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.user, updatedUser);
    },
  });
}

// ── useUpdatePassword ─────────────────────────────────────────────────────────

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) =>
      AuthService.updatePassword(payload),
  });
}
