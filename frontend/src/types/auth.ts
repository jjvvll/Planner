// ── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  timezone: string;
  reminder_days_before: number;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Request payloads ─────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  timezone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  timezone?: string;
  reminder_days_before?: number;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// ── Response shapes ───────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
}

export interface MessageResponse {
  message: string;
}

// ── Laravel validation error shape ───────────────────────────────────────────

export interface ValidationErrors {
  message: string;
  errors: Record<string, string[]>;
}
