// src/api/authService.js
import apiClient from "./Apiclient";

const authService = {
  // POST /auth/register
  async signup({ username, email, password }) {
    const { data } = await apiClient.post("/auth/register", {
      username,
      email,
      password,
    });
    _saveTokens(data);
    return data.user;
  },

  // POST /auth/login  — FastAPI OAuth2 expects form-encoded body
  async login({ email, password }) {
    const form = new URLSearchParams();
    form.append("username", email); // FastAPI OAuth2 uses "username" field
    form.append("password", password);
    const { data } = await apiClient.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    _saveTokens(data);
    return data.user;
  },

  // GET /users/me
  async getMe() {
    const { data } = await apiClient.get("/users/me");
    return data;
  },

  // POST /auth/logout
  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};

function _saveTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem("access_token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
}

export default authService;