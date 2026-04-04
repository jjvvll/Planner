import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends session + XSRF cookies cross-origin
  withXSRFToken: true, // axios 1.6+ — auto-reads XSRF-TOKEN cookie and sets X-XSRF-TOKEN header
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest", // tells Laravel it's an AJAX request (prevents redirect to /login)
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Nothing extra needed — withXSRFToken handles the CSRF header automatically.
// Kept here as an extension point (e.g. injecting a request ID for tracing).
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Session expired or not authenticated.
      // Dispatch a custom event so the auth context can react (redirect to login)
      // without creating a circular import between axios and the auth store.
      window.dispatchEvent(new CustomEvent("auth:unauthenticated"));
    }

    if (error.response?.status === 419) {
      // CSRF token mismatch — session expired or cookie not set.
      // Re-fetch the CSRF cookie and let the user retry.
      window.dispatchEvent(new CustomEvent("auth:csrf-mismatch"));
    }

    return Promise.reject(error);
  },
);

/**
 * Call once before the first login or register request.
 * Sanctum sets the XSRF-TOKEN cookie which axios will use on all subsequent requests.
 */
export async function initCsrf(): Promise<void> {
  await api.get("/sanctum/csrf-cookie");
}

export default api;
