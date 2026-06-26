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
      {/* Import clean sans-serif and monospace typography */}
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="relative flex min-h-screen items-center justify-center bg-[#06070B] px-6 py-12 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]
        bg-[linear-gradient(to_right,rgba(15,23,42,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.3)_1px,transparent_1px)] 
        bg-[size:24px_24px]"
      >
        {/* Dynamic backdrop ambient glows */}
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[400px] bg-teal-500/5 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[440px] z-10 space-y-6">
          
          {/* Header & Status Indicator */}
          <div className="flex flex-col items-center text-center space-y-4">
            
            {/* Pulsing Telemetry Emblem */}
            <div className="relative flex items-center justify-center w-14 h-14">
              <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping opacity-60" />
              <div className="absolute inset-1 rounded-full border border-dashed border-teal-500/30" />
              <div className="absolute inset-2.5 rounded-full bg-slate-950 border border-teal-500/40 flex items-center justify-center">
                <svg className="w-4.5 h-4.5 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>

            {/* Network Active Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/5 border border-teal-500/15 rounded-full text-[10px] font-['JetBrains_Mono',monospace] text-teal-400 tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
              </span>
              SECURE ACCESS NODE // ACTIVE
            </div>
          </div>

          {/* Core Login Card */}
          <div className="relative bg-[#0C0D14]/80 backdrop-blur-xl border border-slate-800/80 rounded-xl p-8 sm:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-slate-800">
            
            {/* Top scanning laser edge glow */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

            <div className="mb-8">
              <h1 className="text-xl font-semibold text-slate-100 tracking-tight mb-1.5">
                Challenger Archive
              </h1>
              <p className="text-xs text-slate-400 tracking-wide font-light">
                Please authenticate to decrypt mission telemetry logs.
              </p>
            </div>

            {/* Inputs Container */}
            <div className="space-y-5 mb-6">
              
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[10px] font-bold font-['JetBrains_Mono',monospace] tracking-wider uppercase text-slate-400">
                  User Terminal ID
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="you@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-slate-100 text-sm tracking-wide placeholder-slate-600 focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/15 focus:bg-slate-950/90 transition-all duration-200"
                    autoComplete="email"
                  />
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-teal-500/50 transition-colors">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-[10px] font-bold font-['JetBrains_Mono',monospace] tracking-wider uppercase text-slate-400">
                  Security Passcode
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-slate-100 text-sm tracking-wide placeholder-slate-600 focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/15 focus:bg-slate-950/90 transition-all duration-200"
                    autoComplete="current-password"
                  />
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-600 group-focus-within:text-teal-500/50 transition-colors">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Output Panel */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-950/15 border border-red-900/35 rounded-lg mb-6 animate-fadeIn">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div className="text-xs text-red-400 font-['JetBrains_Mono',monospace] tracking-tight leading-relaxed">
                  <span className="font-bold text-red-300">DECRYPTION_ERROR:</span> {error}
                </div>
              </div>
            )}

            {/* Action Trigger Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 rounded-lg text-slate-950 font-['JetBrains_Mono',monospace] text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 shadow-[0_0_24px_rgba(20,184,166,0.15)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 opacity-50 hover:opacity-100 pointer-events-none transition-opacity" />
              <span className="flex items-center justify-center gap-2">
                {loading && (
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? 'Decrypting Secure Node…' : 'Establish Link'}
              </span>
            </button>

            {/* Technical Sub-metadata Footer */}
            <div className="mt-8 pt-6 border-t border-slate-900 flex items-center justify-between text-[10px] font-['JetBrains_Mono',monospace] tracking-wider text-slate-500">
              <span>SYS_INIT: STS-51-L</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <span>ARCHIVE_TRUSTEE_V.04</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}