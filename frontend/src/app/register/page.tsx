// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('User Test');
  const [email, setEmail] = useState('test@shelftalk.ai');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Erro ao registrar.');
        return;
      }

      // Se o backend já logar ao registrar, os cookies já estarão setados.
      // Caso contrário, você pode redirecionar para /login.
      router.push('/login');
    } catch (err) {
      console.error(err);
      setError('Erro inesperado ao registrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-700 rounded-xl p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          ShelfTalk AI – Registro
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              type="text"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-700 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Já tem conta?{' '}
          <a
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 underline"
          >
            Fazer login
          </a>
        </p>
      </div>
    </main>
  );
}
