import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useLogin } from "@/hooks/useAuth";
import type { LoginPayload, ValidationErrors } from "@/types/auth";
import styles from "./LoginPage.module.css";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  email: string;
  password: string;
  remember: boolean;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: false,
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error on change
    if (name in fieldErrors) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setGlobalError(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    const payload: LoginPayload = {
      email: form.email.trim(),
      password: form.password,
      remember: form.remember,
    };

    login(payload, {
      onError: (error) => {
        const axiosError = error as AxiosError<ValidationErrors>;
        const status = axiosError.response?.status;

        if (status === 422) {
          // Laravel validation errors — map to individual fields
          const errors = axiosError.response?.data?.errors ?? {};
          setFieldErrors({
            email: errors.email?.[0],
            password: errors.password?.[0],
          });
        } else if (status === 419) {
          setGlobalError(
            "Your session expired. Please refresh the page and try again.",
          );
        } else {
          setGlobalError(
            axiosError.response?.data?.message ??
              "Something went wrong. Please try again.",
          );
        }
      },
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          Plan<span>ner</span>
        </div>
        <p className={styles.tagline}>Your month, beautifully organized.</p>

        {/* Heading */}
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.subheading}>
          Sign in to your account to continue.
        </p>

        {/* Global error */}
        {globalError && <div className={styles.globalError}>{globalError}</div>}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={isPending}
              className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
            />
            {fieldErrors.email && (
              <span className={styles.fieldError}>{fieldErrors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <div className={styles.passwordRow}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={isPending}
              className={`${styles.input} ${fieldErrors.password ? styles.inputError : ""}`}
            />
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          {/* Remember me */}
          <div className={styles.rememberRow}>
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={form.remember}
              onChange={handleChange}
              disabled={isPending}
              className={styles.checkbox}
            />
            <label htmlFor="remember" className={styles.rememberLabel}>
              Keep me signed in
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !form.email || !form.password}
            className={styles.submitBtn}
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>

          {/* Register link */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <div className={styles.dividerLine} />
          </div>

          <div className={styles.registerRow}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.registerLink}>
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
