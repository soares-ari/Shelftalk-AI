"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Generation } from "@/types/generation";

type Props = {
  productId: string;
};

export function GenerationsList({ productId }: Props) {
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGenerations() {
      try {
        const res = await fetch(`/api/generations/product/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setGenerations(data);
        }
      } catch (err) {
        console.error("Error fetching generations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGenerations();
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Gerações Anteriores</h2>
        <div className="animate-pulse space-y-2">
          <div className="h-20 bg-slate-800 rounded-lg"></div>
          <div className="h-20 bg-slate-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (generations.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Gerações Anteriores</h2>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 text-center">
          <p className="text-slate-400">
            Nenhuma geração encontrada. Clique em &quot;Gerar Conteúdo&quot; para criar a
            primeira!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">
        Gerações Anteriores ({generations.length})
      </h2>
      <div className="space-y-3">
        {generations.map((gen) => (
          <button
            key={gen.id}
            onClick={() => router.push(`/generations/${gen.id}`)}
            className="w-full bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-lg p-4 text-left transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">
                  {gen.title || "Geração sem título"}
                </p>
                <p className="text-xs text-slate-500">
                  {gen.createdAt
                    ? new Date(gen.createdAt).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Data não disponível"}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}