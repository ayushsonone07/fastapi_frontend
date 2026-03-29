import { useMutation } from "@tanstack/react-query"
import { login, register, forgotPassword } from "../api/Authservice"

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  username: string
  email: string
  password: string
}

interface ForgotPasswordPayload {
  email: string
}

// ─── Login ────────────────────────────────────────────────────────────────────

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      login(email, password),

    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token)
    },
  })
}

// ─── Register ─────────────────────────────────────────────────────────────────

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      register(payload),

    onSuccess: (data) => {
      // Automatically log the user in after successful registration
      // if the API returns a token; otherwise leave token unset so
      // the user is redirected to /login manually.
      if (data?.access_token) {
        localStorage.setItem("token", data.access_token)
      }
    },
  })
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ email }: ForgotPasswordPayload) =>
      forgotPassword(email),

    // No token to store — API sends a reset link to the user's email.
    // The component can check `isSuccess` to show a confirmation message.
  })
}
