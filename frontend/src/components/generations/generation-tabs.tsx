"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import type { Generation } from "@/types/generation";

const TABS = [
  { key: "title", label: "Título SEO" },
  { key: "longDescription", label: "Descrição Longa" },
  { key: "tags", label: "Tags" },
  { key: "socialInstagram", label: "Instagram" },
  { key: "socialTikTok", label: "TikTok" },
  { key: "socialFacebook", label: "Facebook" },
  { key: "socialPinterest", label: "Pinterest" },
] as const;

export function GenerationTabs({ data }: { data: Generation }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("title");

  const value = data?.[active] ?? "";

  async function copyToClipboard() {
    if (!value) {
      toast.error("Nenhum conteúdo disponível para copiar");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success("Conteúdo copiado para a área de transferência!");
    } catch (err) {
      toast.error("Erro ao copiar conteúdo");
      console.error("Clipboard error:", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 border-b border-slate-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={[
              "px-4 py-2 rounded-md whitespace-nowrap text-sm transition-colors",
              active === tab.key
                ? "bg-emerald-500 text-black font-semibold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 space-y-4">
        <pre className="whitespace-pre-wrap text-slate-200 text-sm">
          {value || "Nenhum conteúdo disponível."}
        </pre>

        <Button onClick={copyToClipboard} disabled={!value}>
          Copiar
        </Button>
      </div>
    </div>
  );
}