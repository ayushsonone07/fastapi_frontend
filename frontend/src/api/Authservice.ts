// src/api/authService.js
import apiClient from "./Apiclient";

const authService = {
  // POST /auth/register
  async signup({ username, email, password }: { username: string, email: string, password: string }) {
    const { data } = await apiClient.post("/auth/register", {
      username,
      email,
      password,
    });
    _saveTokens(data);
    return data.user;
  },

  // POST /auth/login  — FastAPI OAuth2 expects form-encoded body
  // POST /auth/login
  async login({ email, password }: { email: string; password: string }) {
    const { data } = await apiClient.post("/auth/login", {
      email,
      password,
    });

    _saveTokens(data);

    return this.getMe();
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

function _saveTokens({ access_token, refresh_token } : { access_token: string, refresh_token: string }) {
  if (access_token) localStorage.setItem("access_token", access_token);
  if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
}

// forgotPassword: async (email: string) => {
//   const response = await apiClient.post("/auth/forgot-password", { email });
//   return response.data;
// },

export default authService;