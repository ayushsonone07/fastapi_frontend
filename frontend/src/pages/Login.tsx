// src/pages/LoginPage.jsx  — example showing useAuth in a form
// Plug your existing UI around this logic

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form); // navigates to "/" on success (handled in AuthContext)
    } catch (err) {
      setError(
        err.response?.data?.detail ?? "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log in</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}