import { useMutation } from "@tanstack/react-query";
import authService from "../api/Authservice"; // ✅ default import, not named

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

// interface ForgotPasswordPayload {
//   email: string;
// }

interface AuthResponse {
  access_token?: string;
  [key: string]: unknown;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export const useLogin = () => {
  return useMutation<AuthResponse, unknown, LoginPayload>({
    mutationFn: ({ email, password }: LoginPayload) =>
      authService.login({ email, password }),

    onSuccess: (data: AuthResponse) => {
      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
      }
    },
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const useRegister = () => {
  return useMutation<AuthResponse, unknown, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) =>
      authService.signup(payload),

    onSuccess: (data: AuthResponse) => {
      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
      }
    },
  });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

// export const useForgotPassword = () => {
//   return useMutation<unknown, unknown, ForgotPasswordPayload>({
//     mutationFn: ({ email }: ForgotPasswordPayload) =>
//       authService.forgotPassword(email),
  // });
// };