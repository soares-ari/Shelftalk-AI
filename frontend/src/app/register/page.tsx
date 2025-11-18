'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthContainer } from "@/components/layout/auth-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorBox } from "@/components/feedback/error-box";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("User Test");
  const [email, setEmail] = useState("test@shelftalk.ai");
  const [password, setPassword] = useState("123456");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Não foi possível registrar.");
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Erro inesperado ao registrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContainer>
      <h1 className="text-2xl font-semibold mb-6 text-center">
        ShelfTalk AI – Criar Conta
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Nome */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            autoComplete="name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Campo Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo Senha */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <ErrorBox message={error ?? undefined} />

        <Button type="submit" loading={loading}>
          Registrar
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        Já tem conta?{" "}
        <a
          href="/login"
          className="text-emerald-400 hover:text-emerald-300 underline"
        >
          Fazer login
        </a>
      </p>
    </AuthContainer>
  );
}
