// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContainer } from "@/components/layout/auth-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorBox } from "@/components/feedback/error-box";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test@shelftalk.ai");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      router.push("/dashboard");
    } catch (err) {
      setError("Falha inesperada ao fazer login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContainer>
      <h1 className="text-2xl font-semibold mb-6 text-center">
        ShelfTalk AI – Login
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <ErrorBox message={error ?? undefined} />

        <Button type="submit" loading={loading}>
          Entrar
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-400">
        Ainda não tem conta?{" "}
        <a
          href="/register"
          className="text-emerald-400 hover:text-emerald-300 underline"
        >
          Registrar
        </a>
      </p>
    </AuthContainer>
  );
}
