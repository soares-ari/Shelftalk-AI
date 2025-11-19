"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Hash,
  Instagram,
  Music,
  Facebook,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Generation } from "@/types/generation";

const TABS = [
  { key: "title", label: "Título SEO", icon: FileText },
  { key: "longDescription", label: "Descrição Longa", icon: FileText },
  { key: "tags", label: "Tags", icon: Hash },
  { key: "socialInstagram", label: "Instagram", icon: Instagram },
  { key: "socialTikTok", label: "TikTok", icon: Music },
  { key: "socialFacebook", label: "Facebook", icon: Facebook },
  { key: "socialPinterest", label: "Pinterest", icon: ImageIcon },
] as const;

export function GenerationTabs({ data }: { data: Generation }) {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("title");
  const scrollRef = useRef<HTMLDivElement>(null);

  const value = data?.[active] ?? "";
  const activeTab = TABS.find((tab) => tab.key === active);

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

  function scrollTabs(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-6">
      {/* Tabs Container */}
      <div className="relative">
        {/* Scroll Button Left */}
        <button
          onClick={() => scrollTabs("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-full hover:bg-slate-800 transition-colors shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Tabs */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-10 pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.key;
            
            return (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={[
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100",
                ].join(" ")}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Scroll Button Right */}
        <button
          onClick={() => scrollTabs("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-full hover:bg-slate-800 transition-colors shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeTab && <activeTab.icon className="w-5 h-5 text-emerald-400" />}
            <h3 className="font-semibold text-slate-100">{activeTab?.label}</h3>
          </div>
          <Button onClick={copyToClipboard} disabled={!value} size="sm">
            Copiar
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {value ? (
            <pre className="whitespace-pre-wrap text-slate-200 text-sm leading-relaxed font-mono">
              {value}
            </pre>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                {activeTab && <activeTab.icon className="w-8 h-8 text-slate-600" />}
              </div>
              <p className="text-slate-500">Nenhum conteúdo disponível.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}