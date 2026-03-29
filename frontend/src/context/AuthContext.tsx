// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../api/Authservice";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (info: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session
  const navigate = useNavigate();

  // On mount, restore session from stored token
  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService
        .getMe()
        .then(setUser)
        .catch(() => {
          // Token invalid — clear it
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(credentials) {
    const userData = await authService.login(credentials);
    setUser(userData);
    navigate("/");
  }

  async function signup(info) {
    const userData = await authService.signup(info);
    setUser(userData);
    navigate("/");
  }

  async function logout() {
    await authService.logout();
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth — call this anywhere in your app
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}