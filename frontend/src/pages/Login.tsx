import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
      await login(form);
    } catch (err: any) {
      let msg = "Login failed. Check your credentials.";
  
      if (err?.response?.data?.detail) {
        const detail = err.response.data.detail;
  
        if (typeof detail === "string") {
          msg = detail;
        } else if (Array.isArray(detail)) {
          msg = detail.map((d: any) => d.msg).join(", ");
        } else {
          msg = JSON.stringify(detail);
        }
      }
  
      setError(msg);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <>
      <style>{`
        .auth-wrapper{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f4f4f4}
        .auth-card{background:white;padding:40px;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.1);width:100%;max-width:400px}
        .auth-card h2{margin:0 0 8px;font-size:24px;color:#1e1e2f}
        .auth-card p{margin:0 0 24px;color:#888;font-size:14px}
        .auth-field{width:100%;padding:10px 14px;margin-bottom:14px;border:1px solid #ddd;border-radius:8px;font-size:15px;box-sizing:border-box;outline:none;transition:border 0.2s}
        .auth-field:focus{border-color:#4f46e5}
        .auth-btn{width:100%;padding:11px;background:#4f46e5;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;transition:background 0.2s}
        .auth-btn:hover:not(:disabled){background:#4338ca}
        .auth-btn:disabled{opacity:0.6;cursor:not-allowed}
        .auth-error{background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:8px;padding:10px 14px;font-size:14px;margin-bottom:14px}
        .auth-footer{text-align:center;margin-top:20px;font-size:14px;color:#888}
        .auth-footer a{color:#4f46e5;text-decoration:none;font-weight:600}
      `}</style>

      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p>Log in to your account</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
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
            />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="auth-footer">
            No account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
