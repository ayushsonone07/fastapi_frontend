import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { signup } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!signup) {
        throw new Error("Signup function not available");
      }
      await (signup as (form: typeof form) => Promise<void>)(form); // navigates to "/" automatically via AuthContext
    } catch (err: any) {
      setError(err.response?.data?.detail ?? "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f4f4;
        }
        .auth-card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        .auth-card h2 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #1e1e2f;
        }
        .auth-card p {
          margin: 0 0 24px;
          color: #888;
          font-size: 14px;
        }
        .auth-field {
          width: 100%;
          padding: 10px 14px;
          margin-bottom: 14px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          box-sizing: border-box;
          outline: none;
          transition: border 0.2s;
        }
        .auth-field:focus {
          border-color: #4f46e5;
        }
        .auth-btn {
          width: 100%;
          padding: 11px;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .auth-btn:hover:not(:disabled) {
          background: #4338ca;
        }
        .auth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .auth-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          margin-bottom: 14px;
        }
        .auth-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #888;
        }
        .auth-footer a {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
        }
        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Create account</h2>
          <p>Join and start sharing with the world</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="auth-field"
              name="username"
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              className="auth-field"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="auth-field"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </>
  );
}