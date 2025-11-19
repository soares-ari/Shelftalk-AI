"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  href?: string;
  label?: string;
};

export function BackButton({ href, label = "Voltar" }: Props) {
  const router = useRouter();

  function handleBack() {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  }

  return (
    <button
      onClick={handleBack}
      className="mb-4 -ml-2 px-3 py-2 flex items-center gap-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-md transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}