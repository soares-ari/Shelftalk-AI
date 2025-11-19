"use client";

import { Loader2, Sparkles } from "lucide-react";

type Props = {
  isOpen: boolean;
};

export function GenerationLoading({ isOpen }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 max-w-md w-full mx-4 space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin absolute inset-0" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-slate-100">
            Gerando Conteúdo
          </h3>
          <p className="text-sm text-slate-400">
            Estamos criando 7 tipos de conteúdo para seu produto usando IA...
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Analisando produto
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-600" />
            Gerando títulos e descrições
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-2 h-2 rounded-full bg-slate-600" />
            Criando posts para redes sociais
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-slate-500 text-center">
          Este processo pode levar até 20 segundos
        </p>
      </div>
    </div>
  );
}