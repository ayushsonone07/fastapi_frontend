import { useState, useRef, useEffect } from "react"
import { useLogin } from "../hooks/useAuth"

/* ─────────────────────────────────────────────
   Scoped styles – no extra CSS file needed
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Playfair+Display:ital@1&display=swap');

  .login-root {
    --bg:      #f5f2ee;
    --card:    #ffffff;
    --ink:     #1a1714;
    --sub:     #7a7268;
    --line:    #e4dfd8;
    --accent:  #c0392b;
    --accent2: #e8d5b0;
    --err:     #c0392b;
    --radius:  4px;
    --sans:    'Sora', sans-serif;
    --serif:   'Playfair Display', Georgia, serif;

    min-height: 100vh;
    background: var(--bg);
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 39px,
        var(--line) 39px,
        var(--line) 40px
      );
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--sans);
    padding: 24px;
  }

  /* ── Card ── */
  .login-card {
    background: var(--card);
    width: 100%;
    max-width: 420px;
    padding: 52px 48px 44px;
    box-shadow:
      0 1px 2px rgba(0,0,0,.04),
      0 8px 40px rgba(0,0,0,.10),
      inset 0 0 0 1px var(--line);
    border-radius: 2px;
    position: relative;
    animation: rise .5s cubic-bezier(.22,1,.36,1) both;
  }

  /* red corner accent */
  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 56px;
    background: var(--accent);
    border-radius: 2px 0 0 0;
  }

  /* ── Header ── */
  .login-eyebrow {
    font-size: .7rem;
    font-weight: 500;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }

  .login-heading {
    font-family: var(--serif);
    font-style: italic;
    font-size: 2rem;
    line-height: 1.15;
    color: var(--ink);
    margin-bottom: 6px;
  }

  .login-sub {
    font-size: .8rem;
    color: var(--sub);
    margin-bottom: 40px;
    line-height: 1.5;
  }

  /* ── Fields ── */
  .login-field {
    position: relative;
    margin-bottom: 24px;
  }

  .login-label {
    display: block;
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--sub);
    margin-bottom: 8px;
    transition: color .2s;
  }

  .login-field:focus-within .login-label {
    color: var(--accent);
  }

  .login-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1.5px solid var(--line);
    padding: 8px 0 10px;
    font-family: var(--sans);
    font-size: .95rem;
    color: var(--ink);
    outline: none;
    transition: border-color .2s;
    border-radius: 0;
  }

  .login-input:focus {
    border-bottom-color: var(--accent);
  }

  .login-input::placeholder {
    color: #c4bdb4;
    font-size: .875rem;
  }

  /* password toggle */
  .login-pw-wrap {
    position: relative;
  }

  .login-pw-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--sub);
    font-size: .75rem;
    font-family: var(--sans);
    letter-spacing: .04em;
    text-transform: uppercase;
    transition: color .15s;
  }

  .login-pw-toggle:hover { color: var(--ink); }

  /* ── Error banner ── */
  .login-error {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #fdf0ef;
    border-left: 3px solid var(--err);
    border-radius: 0 var(--radius) var(--radius) 0;
    padding: 10px 14px;
    margin-bottom: 24px;
    font-size: .8rem;
    color: var(--err);
    line-height: 1.5;
    animation: shake .35s cubic-bezier(.36,.07,.19,.97);
  }

  /* ── Submit button ── */
  .login-btn {
    width: 100%;
    padding: 14px;
    background: var(--ink);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-family: var(--sans);
    font-size: .85rem;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background .2s, transform .15s;
    margin-top: 8px;
  }

  .login-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent);
    transform: translateX(-101%);
    transition: transform .3s cubic-bezier(.22,1,.36,1);
  }

  .login-btn:hover { transform: translateY(-1px); }
  .login-btn:hover::after { transform: translateX(0); }
  .login-btn:active { transform: translateY(0); }

  .login-btn span { position: relative; z-index: 1; }

  .login-btn:disabled {
    opacity: .55;
    cursor: not-allowed;
    transform: none;
  }
  .login-btn:disabled::after { display: none; }

  /* spinner inside button */
  .login-spinner {
    display: inline-block;
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* ── Footer link ── */
  .login-footer {
    text-align: center;
    margin-top: 28px;
    font-size: .78rem;
    color: var(--sub);
  }

  .login-footer a {
    color: var(--ink);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: var(--line);
    transition: text-decoration-color .2s;
  }

  .login-footer a:hover { text-decoration-color: var(--accent); }

  /* ── Divider ── */
  .login-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 28px 0;
    color: var(--sub);
    font-size: .7rem;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--line);
  }

  /* ── Animations ── */
  @keyframes rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-5px); }
    40%       { transform: translateX(5px); }
    60%       { transform: translateX(-3px); }
    80%       { transform: translateX(3px); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function Login() {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw]     = useState(false)
  const emailRef                = useRef<HTMLInputElement>(null)

  const loginMutation = useLogin()

  // auto-focus on mount
  useEffect(() => { emailRef.current?.focus() }, [])

  const isValid   = email.trim().length > 0 && password.length >= 1
  const isLoading = loginMutation.isPending
  const error     = loginMutation.error as Error | null

  const handleSubmit = () => {
    if (!isValid || isLoading) return
    loginMutation.mutate({ email: email.trim(), password })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <>
      <style>{styles}</style>

      <div className="login-root">
        <div className="login-card" role="main">

          {/* Header */}
          <p className="login-eyebrow">Threadline</p>
          <h1 className="login-heading">Welcome back.</h1>
          <p className="login-sub">Sign in to continue to your account.</p>

          {/* Error */}
          {error && (
            <div className="login-error" role="alert" aria-live="polite">
              <span>⚠</span>
              <span>{error.message || "Invalid credentials. Please try again."}</span>
            </div>
          )}

          {/* Email */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">Email address</label>
            <input
              ref={emailRef}
              id="login-email"
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              aria-required="true"
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-password">Password</label>
            <div className="login-pw-wrap">
              <input
                id="login-password"
                className="login-input"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                aria-required="true"
                style={{ paddingRight: 52 }}
              />
              <button
                className="login-pw-toggle"
                type="button"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            aria-busy={isLoading}
          >
            <span>
              {isLoading && <span className="login-spinner" aria-hidden="true" />}
              {isLoading ? "Signing in…" : "Sign In"}
            </span>
          </button>

          {/* Footer */}
          <p className="login-footer">
            Don't have an account? <a href="/register">Create one</a>
          </p>

        </div>
      </div>
    </>
  )
}