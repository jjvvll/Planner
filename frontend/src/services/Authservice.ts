import api, { initCsrf } from "../lib/axios";
import type {
  User,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UpdatePasswordPayload,
  MessageResponse,
} from "../types/auth";

const AuthService = {
  /**
   * GET /sanctum/csrf-cookie
   * Must be called before login or register so Sanctum can set the XSRF-TOKEN cookie.
   */
  async csrf(): Promise<void> {
    await initCsrf();
  },

  /**
   * POST /api/auth/register
   * Creates a new user and logs them in. Returns the new user.
   */
  async register(payload: RegisterPayload): Promise<User> {
    await initCsrf();
    const { data } = await api.post<User>("/api/auth/register", payload);
    return data;
  },

  /**
   * POST /api/auth/login
   * Authenticates the user and starts a session. Returns the authenticated user.
   */
  async login(payload: LoginPayload): Promise<User> {
    await initCsrf();
    const { data } = await api.post<User>("/api/auth/login", payload);
    return data;
  },

  /**
   * POST /api/auth/logout
   * Destroys the session server-side and clears cookies.
   */
  async logout(): Promise<MessageResponse> {
    const { data } = await api.post<MessageResponse>("/api/auth/logout");
    return data;
  },

  /**
   * GET /api/auth/me
   * Returns the currently authenticated user.
   * Throws a 401 if no valid session exists.
   */
  async me(): Promise<User> {
    const { data } = await api.get<User>("/api/auth/me");
    return data;
  },

  /**
   * PATCH /api/auth/profile
   * Updates name, timezone, or reminder preferences.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await api.patch<User>("/api/auth/profile", payload);
    return data;
  },

  /**
   * PATCH /api/auth/profile/password
   * Changes the user's password. Requires current_password for verification.
   */
  async updatePassword(
    payload: UpdatePasswordPayload,
  ): Promise<MessageResponse> {
    const { data } = await api.patch<MessageResponse>(
      "/api/auth/profile/password",
      payload,
    );
    return data;
  },
};

export default AuthService;
