"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { GenerationTabs } from "@/components/generations/generation-tabs";
import type { Generation } from "@/types/generation";

type Props = {
  params: { id: string };
};

export default function GenerationPage({ params }: Props) {
  const { id } = params;
  const router = useRouter();

  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGeneration() {
      try {
        const res = await fetch(`/api/generations/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          setError("Erro ao carregar conteúdo gerado.");
          return;
        }

        const data = await res.json();
        setGeneration(data);
      } catch (e) {
        setError("Erro inesperado ao carregar conteúdo.");
      } finally {
        setLoading(false);
      }
    }

    fetchGeneration();
  }, [id, router]);

  return (
    <DashboardShell>
      <h1 className="text-3xl font-semibold mb-6">Conteúdo Gerado</h1>

      {loading && (
        <p className="text-slate-400">Carregando conteúdo gerado...</p>
      )}

      {error && (
        <p className="text-red-400 bg-red-950/40 border border-red-700 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {generation && <GenerationTabs data={generation} />}
    </DashboardShell>
  );
}
