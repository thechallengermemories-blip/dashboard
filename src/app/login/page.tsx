'use client';

import { useState, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('auth_token', data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=Inter:wght@300;400;500;600&display=swap');

        .login-root {
          min-height: 100vh;
          background-color: #07070D;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(196,168,130,0.07) 0%, transparent 70%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 39px,
              rgba(255,255,255,0.015) 39px,
              rgba(255,255,255,0.015) 40px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 39px,
              rgba(255,255,255,0.015) 39px,
              rgba(255,255,255,0.015) 40px
            );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Inter', sans-serif;
        }

        .login-shell {
          width: 100%;
          max-width: 420px;
        }

        /* ── emblem ── */
        .emblem-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
          gap: 0;
        }

        .emblem-ring {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 1.5px solid rgba(196,168,130,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: radial-gradient(circle at 40% 35%, rgba(196,168,130,0.08), transparent 70%);
          box-shadow: 0 0 0 1px rgba(196,168,130,0.08), inset 0 1px 0 rgba(196,168,130,0.12);
        }

        .emblem-ring::before {
          content: '';
          position: absolute;
          inset: 5px;
          border-radius: 50%;
          border: 1px dashed rgba(196,168,130,0.18);
        }

        .emblem-star {
          font-size: 22px;
          line-height: 1;
          filter: drop-shadow(0 0 6px rgba(196,168,130,0.5));
        }

        .emblem-line {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, rgba(196,168,130,0.4), transparent);
        }

        /* ── card ── */
        .login-card {
          background: #0F0F18;
          border: 1px solid rgba(196,168,130,0.12);
          border-radius: 4px;
          padding: 40px 40px 36px;
          position: relative;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.6),
            0 24px 64px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,168,130,0.35), transparent);
        }

        /* ── header ── */
        .card-header {
          margin-bottom: 32px;
        }

        .mission-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .mission-tag-line {
          flex: 1;
          height: 1px;
          background: rgba(196,168,130,0.18);
        }

        .mission-tag-text {
          font-family: 'Inter', monospace;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: rgba(196,168,130,0.5);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .card-title {
          font-family: 'EB Garamond', Georgia, serif;
          font-size: 26px;
          font-weight: 400;
          color: #E8E4D9;
          letter-spacing: 0.01em;
          line-height: 1.2;
          margin: 0 0 6px;
        }

        .card-subtitle {
          font-size: 12.5px;
          font-weight: 400;
          color: rgba(196,168,130,0.55);
          letter-spacing: 0.04em;
        }

        /* ── fields ── */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 24px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(232,228,217,0.5);
        }

        .field-input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(196,168,130,0.12);
          border-radius: 3px;
          color: #E8E4D9;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.02em;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -webkit-appearance: none;
        }

        .field-input::placeholder {
          color: rgba(232,228,217,0.2);
          font-weight: 300;
        }

        .field-input:focus {
          border-color: rgba(196,168,130,0.45);
          background: rgba(196,168,130,0.04);
          box-shadow: 0 0 0 3px rgba(196,168,130,0.06);
        }

        /* ── error ── */
        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 11px 14px;
          background: rgba(220,80,80,0.07);
          border: 1px solid rgba(220,80,80,0.2);
          border-radius: 3px;
          margin-bottom: 20px;
        }

        .error-icon {
          font-size: 12px;
          margin-top: 1px;
          flex-shrink: 0;
          opacity: 0.7;
        }

        .error-text {
          font-size: 12.5px;
          color: #E07070;
          letter-spacing: 0.02em;
          line-height: 1.45;
        }

        /* ── submit button ── */
        .submit-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #C4A882 0%, #A8895E 100%);
          border: none;
          border-radius: 3px;
          color: #07070D;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 12px rgba(196,168,130,0.2), inset 0 1px 0 rgba(255,255,255,0.15);
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          box-shadow: 0 4px 20px rgba(196,168,130,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
          opacity: 1;
        }

        .submit-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
        }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 12px;
          height: 12px;
          border: 1.5px solid rgba(7,7,13,0.3);
          border-top-color: #07070D;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── footer ── */
        .card-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(196,168,130,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .footer-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(196,168,130,0.25);
        }

        .footer-text {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(196,168,130,0.25);
        }

        @media (max-width: 480px) {
          .login-card { padding: 32px 24px 28px; }
        }
      `}</style>

      <div className="login-root">
        <div className="login-shell">

          {/* Emblem */}
          <div className="emblem-wrap">
            <div className="emblem-ring">
              <span className="emblem-star">✦</span>
            </div>
            <div className="emblem-line" />
          </div>

          {/* Card */}
          <div className="login-card">

            {/* Header */}
            <div className="card-header">
              <div className="mission-tag">
                <div className="mission-tag-line" />
                <span className="mission-tag-text">STS-51-L Archive</span>
                <div className="mission-tag-line" />
              </div>
              <h1 className="card-title">Challenger Archive</h1>
              <p className="card-subtitle">Restricted access — authorized personnel only</p>
            </div>

            {/* Fields */}
            <div className="field-group">
              <div className="field">
                <label htmlFor="email" className="field-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="field-input"
                  autoComplete="email"
                />
              </div>
              <div className="field">
                <label htmlFor="password" className="field-label">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="field-input"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-box">
                <span className="error-icon">⚠</span>
                <span className="error-text">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-btn"
            >
              <span className="btn-inner">
                {loading && <span className="spinner" />}
                {loading ? 'Authenticating…' : 'Sign In'}
              </span>
            </button>

            {/* Footer */}
            <div className="card-footer">
              <div className="footer-dot" />
              <span className="footer-text">Challenger Memorial Foundation</span>
              <div className="footer-dot" />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}