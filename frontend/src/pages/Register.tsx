import { useState, useRef, useEffect } from "react"
import { useRegister } from "../hooks/useAuth"

/* ─────────────────────────────────────────────
   Scoped styles
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Playfair+Display:ital@1&display=swap');

  .reg-root {
    --bg:        #0d0f14;
    --card:      #13161e;
    --surface:   #1a1d27;
    --border:    #252836;
    --border-focus: #4f8ef7;
    --ink:       #eceef4;
    --sub:       #6b7084;
    --accent:    #4f8ef7;
    --accent-glow: rgba(79,142,247,0.18);
    --success:   #3ecf8e;
    --err:       #f76f6f;
    --radius:    10px;
    --sans:      'Sora', sans-serif;
    --serif:     'Playfair Display', Georgia, serif;

    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 70% 50% at 20% -10%, rgba(79,142,247,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 90% 100%, rgba(62,207,142,0.08) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--sans);
    padding: 24px;
  }

  /* ── Layout ── */
  .reg-wrap {
    display: flex;
    width: 100%;
    max-width: 900px;
    min-height: 560px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.55);
    animation: rise .55s cubic-bezier(.22,1,.36,1) both;
  }

  /* ── Left panel ── */
  .reg-panel {
    flex: 1;
    background: linear-gradient(145deg, #0f1829 0%, #0d1520 100%);
    padding: 52px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }

  .reg-panel::before {
    content: '';
    position: absolute;
    top: -80px; left: -80px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(79,142,247,0.15), transparent 70%);
    pointer-events: none;
  }

  .reg-brand {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1.9rem;
    color: var(--ink);
    letter-spacing: -0.01em;
  }

  .reg-brand span { color: var(--accent); }

  .reg-panel-body { margin-top: auto; }

  .reg-panel-title {
    font-family: var(--serif);
    font-style: italic;
    font-size: 2.4rem;
    line-height: 1.2;
    color: var(--ink);
    margin-bottom: 16px;
  }

  .reg-panel-sub {
    font-size: .85rem;
    color: var(--sub);
    line-height: 1.7;
    max-width: 280px;
  }

  .reg-perks { margin-top: 36px; display: flex; flex-direction: column; gap: 14px; }

  .reg-perk {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: .82rem;
    color: #8890a8;
  }

  .reg-perk-dot {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: rgba(79,142,247,0.12);
    border: 1px solid rgba(79,142,247,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: .8rem;
    flex-shrink: 0;
  }

  /* ── Right card (form) ── */
  .reg-card {
    width: 400px;
    background: var(--card);
    padding: 48px 40px 40px;
    display: flex;
    flex-direction: column;
  }

  .reg-heading {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 4px;
  }

  .reg-sub {
    font-size: .78rem;
    color: var(--sub);
    margin-bottom: 32px;
  }

  /* ── Fields ── */
  .reg-field { margin-bottom: 18px; position: relative; }

  .reg-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: var(--sub);
    margin-bottom: 7px;
    transition: color .2s;
  }

  .reg-field:focus-within .reg-label { color: var(--accent); }

  .reg-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .reg-icon {
    position: absolute;
    left: 13px;
    font-size: .95rem;
    color: var(--sub);
    pointer-events: none;
    transition: color .2s;
  }

  .reg-field:focus-within .reg-icon { color: var(--accent); }

  .reg-input {
    width: 100%;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 11px 12px 11px 38px;
    font-family: var(--sans);
    font-size: .9rem;
    color: var(--ink);
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }

  .reg-input:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .reg-input::placeholder { color: #3a3e52; }

  .reg-input.valid { border-color: var(--success); }
  .reg-input.invalid { border-color: var(--err); }

  .reg-input-status {
    position: absolute;
    right: 12px;
    font-size: .85rem;
    pointer-events: none;
    transition: opacity .2s;
  }

  /* password toggle */
  .reg-pw-toggle {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: var(--sub);
    font-family: var(--sans);
    font-size: .68rem;
    letter-spacing: .06em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 4px;
    transition: color .15s, background .15s;
  }

  .reg-pw-toggle:hover { color: var(--ink); background: var(--border); }

  /* strength bar */
  .reg-strength { margin-top: 7px; display: flex; gap: 4px; }
  .reg-strength-bar {
    flex: 1; height: 3px; border-radius: 2px;
    background: var(--border); transition: background .3s;
  }

  .reg-strength-label {
    font-size: .65rem;
    color: var(--sub);
    margin-top: 4px;
    letter-spacing: .05em;
    text-transform: uppercase;
  }

  /* field hint */
  .reg-hint {
    font-size: .68rem;
    color: var(--sub);
    margin-top: 5px;
    padding-left: 2px;
  }

  .reg-hint.err { color: var(--err); }

  /* ── Error banner ── */
  .reg-error {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: rgba(247,111,111,0.08);
    border: 1px solid rgba(247,111,111,0.25);
    border-radius: var(--radius);
    padding: 10px 14px;
    margin-bottom: 20px;
    font-size: .8rem;
    color: var(--err);
    line-height: 1.5;
    animation: shake .35s cubic-bezier(.36,.07,.19,.97);
  }

  /* ── Success state ── */
  .reg-success {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    animation: rise .5s ease both;
  }

  .reg-success-icon {
    width: 64px; height: 64px;
    background: rgba(62,207,142,0.12);
    border: 1.5px solid rgba(62,207,142,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem;
    margin-bottom: 20px;
  }

  .reg-success-title {
    font-family: var(--serif);
    font-style: italic;
    font-size: 1.5rem;
    color: var(--ink);
    margin-bottom: 8px;
  }

  .reg-success-sub { font-size: .82rem; color: var(--sub); line-height: 1.6; }

  .reg-success-link {
    margin-top: 28px;
    display: inline-block;
    padding: 11px 28px;
    background: var(--accent);
    color: #fff;
    border-radius: var(--radius);
    font-size: .82rem;
    font-weight: 600;
    text-decoration: none;
    transition: opacity .2s;
  }

  .reg-success-link:hover { opacity: .85; }

  /* ── Submit ── */
  .reg-btn {
    width: 100%;
    margin-top: 6px;
    padding: 13px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-family: var(--sans);
    font-size: .85rem;
    font-weight: 600;
    letter-spacing: .04em;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: opacity .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(79,142,247,0.3);
  }

  .reg-btn:hover:not(:disabled) {
    opacity: .92;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(79,142,247,0.4);
  }

  .reg-btn:active:not(:disabled) { transform: translateY(0); }

  .reg-btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }

  .reg-btn span { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; }

  .reg-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Footer ── */
  .reg-footer {
    text-align: center;
    margin-top: 22px;
    font-size: .76rem;
    color: var(--sub);
  }

  .reg-footer a {
    color: var(--accent);
    font-weight: 500;
    text-decoration: none;
    border-bottom: 1px solid rgba(79,142,247,0.3);
    padding-bottom: 1px;
    transition: border-color .2s;
  }

  .reg-footer a:hover { border-color: var(--accent); }

  /* ── Divider ── */
  .reg-divider {
    height: 1px;
    background: var(--border);
    margin: 20px 0;
  }

  /* ── Animations ── */
  @keyframes rise {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-5px); }
    40%       { transform: translateX(5px); }
    60%       { transform: translateX(-3px); }
    80%       { transform: translateX(3px); }
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .reg-panel { display: none; }
    .reg-wrap  { max-width: 420px; border-radius: 14px; }
    .reg-card  { width: 100%; padding: 36px 28px; }
  }
`

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" }
  let score = 0
  if (pw.length >= 6)  score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: "Weak", color: "#f76f6f" }
  if (score <= 3) return { score, label: "Fair", color: "#f7b96f" }
  return { score, label: "Strong", color: "#3ecf8e" }
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function Register() {
  const [form, setForm] = useState({
    username: "ayush",
    email:    "ayush@test.com",
    password: "123456",
  })
  const [showPw, setShowPw]         = useState(false)
  const [touched, setTouched]       = useState<Record<string, boolean>>({})
  const [registered, setRegistered] = useState(false)
  const usernameRef                 = useRef<HTMLInputElement>(null)

  const registerMutation = useRegister()

  useEffect(() => { usernameRef.current?.focus() }, [])

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const blur = (k: string) => () =>
    setTouched(t => ({ ...t, [k]: true }))

  const strength = passwordStrength(form.password)

  // validation
  const errs = {
    username: !form.username.trim()
      ? "Username is required"
      : form.username.length < 3
      ? "Min 3 characters"
      : null,
    email: !form.email.trim()
      ? "Email is required"
      : !isValidEmail(form.email)
      ? "Invalid email address"
      : null,
    password: !form.password
      ? "Password is required"
      : form.password.length < 6
      ? "Min 6 characters"
      : null,
  }

  const isValid   = !errs.username && !errs.email && !errs.password
  const isLoading = registerMutation.isPending
  const apiError  = registerMutation.error as Error | null

  const handleSubmit = () => {
    setTouched({ username: true, email: true, password: true })
    if (!isValid || isLoading) return
    registerMutation.mutate(
      { username: form.username.trim(), email: form.email.trim(), password: form.password },
      { onSuccess: () => setRegistered(true) }
    )
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit()
  }

  const fieldClass = (k: string, extra = "") => {
    if (!touched[k]) return `reg-input${extra ? " " + extra : ""}`
    if (errs[k as keyof typeof errs]) return `reg-input invalid${extra ? " " + extra : ""}`
    return `reg-input valid${extra ? " " + extra : ""}`
  }

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        <div className="reg-wrap">

          {/* ── Left panel ── */}
          <div className="reg-panel">
            <div className="reg-brand">Thread<span>line</span></div>
            <div className="reg-panel-body">
              <div className="reg-panel-title">Start your<br />story here.</div>
              <p className="reg-panel-sub">
                Join thousands of people sharing ideas,
                building communities, and connecting with others.
              </p>
              <div className="reg-perks">
                {[
                  { icon: "✦", text: "Create and share posts instantly" },
                  { icon: "◈", text: "Like and comment on threads" },
                  { icon: "⬡", text: "Build your personal profile" },
                ].map(p => (
                  <div className="reg-perk" key={p.text}>
                    <div className="reg-perk-dot">{p.icon}</div>
                    {p.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right card ── */}
          <div className="reg-card">
            {registered ? (
              <div className="reg-success">
                <div className="reg-success-icon">✓</div>
                <div className="reg-success-title">You're in, {form.username}!</div>
                <p className="reg-success-sub">
                  Your account has been created.<br />
                  Head over to sign in and get started.
                </p>
                <a href="/login" className="reg-success-link">Go to Sign In →</a>
              </div>
            ) : (
              <>
                <div className="reg-heading">Create your account</div>
                <div className="reg-sub">Fill in the details below to get started</div>

                {/* API error */}
                {apiError && (
                  <div className="reg-error" role="alert" aria-live="polite">
                    <span>⚠</span>
                    <span>{apiError.message || "Registration failed. Please try again."}</span>
                  </div>
                )}

                {/* Username */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-username">
                    Username
                    {touched.username && errs.username && (
                      <span style={{ color: "var(--err)", textTransform: "none", letterSpacing: 0, fontSize: ".68rem", fontWeight: 400 }}>{errs.username}</span>
                    )}
                  </label>
                  <div className="reg-input-wrap">
                    <span className="reg-icon">@</span>
                    <input
                      ref={usernameRef}
                      id="reg-username"
                      className={fieldClass("username")}
                      type="text"
                      placeholder="yourhandle"
                      value={form.username}
                      autoComplete="username"
                      onChange={set("username")}
                      onBlur={blur("username")}
                      onKeyDown={handleKey}
                      disabled={isLoading}
                      aria-required="true"
                      aria-describedby="username-hint"
                    />
                    {touched.username && (
                      <span className="reg-input-status">
                        {errs.username ? "✕" : <span style={{ color: "var(--success)" }}>✓</span>}
                      </span>
                    )}
                  </div>
                  <p className="reg-hint" id="username-hint">This is how others will find you.</p>
                </div>

                {/* Email */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-email">
                    Email address
                    {touched.email && errs.email && (
                      <span style={{ color: "var(--err)", textTransform: "none", letterSpacing: 0, fontSize: ".68rem", fontWeight: 400 }}>{errs.email}</span>
                    )}
                  </label>
                  <div className="reg-input-wrap">
                    <span className="reg-icon" style={{ fontSize: ".85rem" }}>✉</span>
                    <input
                      id="reg-email"
                      className={fieldClass("email")}
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      autoComplete="email"
                      onChange={set("email")}
                      onBlur={blur("email")}
                      onKeyDown={handleKey}
                      disabled={isLoading}
                      aria-required="true"
                    />
                    {touched.email && (
                      <span className="reg-input-status">
                        {errs.email ? "✕" : <span style={{ color: "var(--success)" }}>✓</span>}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="reg-password">
                    Password
                    {touched.password && errs.password && (
                      <span style={{ color: "var(--err)", textTransform: "none", letterSpacing: 0, fontSize: ".68rem", fontWeight: 400 }}>{errs.password}</span>
                    )}
                  </label>
                  <div className="reg-input-wrap">
                    <span className="reg-icon" style={{ fontSize: ".85rem" }}>⚿</span>
                    <input
                      id="reg-password"
                      className={fieldClass("password")}
                      type={showPw ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      autoComplete="new-password"
                      onChange={set("password")}
                      onBlur={blur("password")}
                      onKeyDown={handleKey}
                      disabled={isLoading}
                      aria-required="true"
                      style={{ paddingRight: 56 }}
                    />
                    <button
                      className="reg-pw-toggle"
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {form.password && (
                    <>
                      <div className="reg-strength">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className="reg-strength-bar"
                            style={{ background: i <= strength.score ? strength.color : undefined }}
                          />
                        ))}
                      </div>
                      <p className="reg-strength-label" style={{ color: strength.color }}>
                        {strength.label} password
                      </p>
                    </>
                  )}
                </div>

                <div className="reg-divider" />

                {/* Submit */}
                <button
                  className="reg-btn"
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                  aria-busy={isLoading}
                >
                  <span>
                    {isLoading && <span className="reg-spinner" aria-hidden="true" />}
                    {isLoading ? "Creating account…" : "Create Account"}
                  </span>
                </button>

                <p className="reg-footer">
                  Already have an account? <a href="/login">Sign in</a>
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}