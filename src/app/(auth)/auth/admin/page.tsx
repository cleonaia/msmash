'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message = typeof data?.message === 'string' ? data.message : 'Credenciales inválidas';
        setError(message);
        setLoading(false);
        return;
      }

      const nextFromQuery = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('next')
        : null;
      const nextPath = nextFromQuery || '/admin/dashboard';
      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError('Error al conectar. Intenta de nuevo.');
      console.error(err);
      setLoading(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-smash-border bg-smash-smoke/50 px-4 py-3 text-sm text-smash-cream placeholder:text-smash-cream/40 focus:outline-none focus:ring-2 focus:ring-smash-turquoise/50 transition';

  return (
    <div className="flex min-h-screen items-center justify-center bg-smash-black px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl uppercase tracking-widest text-smash-cream mb-2">
            M SMASH
          </h1>
          <p className="text-smash-cream/50 text-sm uppercase tracking-[0.2em]">Panel Administrativo</p>
        </div>

        {/* Form Card */}
        <div className="bg-smash-smoke border border-smash-border rounded-2xl p-8 shadow-2xl">
          <h2 className="mb-8 font-display text-2xl uppercase tracking-wide text-smash-cream">
            Acceso Admin
          </h2>

          {error && (
            <div className="mb-6 flex gap-3 rounded-lg bg-smash-fire/10 border border-smash-fire/30 p-4">
              <AlertCircle className="w-5 h-5 text-smash-fire flex-shrink-0 mt-0.5" />
              <p className="text-sm text-smash-fire">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-smash-cream/60">
                Usuario
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-smash-cream/30" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@example.com"
                  className={inputCls + ' pl-10'}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-smash-cream/60">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-smash-cream/30" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls + ' pl-10 pr-10'}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-smash-cream/30 hover:text-smash-cream/60 transition-colors"
                  disabled={loading}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full mt-8 px-6 py-3 bg-smash-fire text-white font-bold uppercase text-sm tracking-[0.2em] rounded-lg hover:bg-smash-fire/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Autenticando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Acceder
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-smash-cream/40">
          <p>© 2026 M SMASH BURGER · Acceso Privado</p>
        </div>
      </div>
    </div>
  );
}
