"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GenerationsList } from "@/components/generations/generations-list";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  product: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
  };
};

export function ProductView({ product }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Erro ao gerar conteúdo.");
        return;
      }

      router.push(`/generations/${data.id}`);
    } catch (err) {
      setError("Erro inesperado ao gerar conteúdo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Seção do Produto */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-slate-400 mt-1">
            {product.description ?? "Sem descrição"}
          </p>
        </div>

        <div className="rounded-lg overflow-hidden border border-slate-800">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={600}
              className="w-full object-cover"
            />
          ) : (
            <div className="p-20 text-center text-slate-500">
              Sem imagem disponível
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-700 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Gerando..." : "Gerar Conteúdo"}
        </Button>
      </div>

      {/* Separador */}
      <div className="border-t border-slate-800"></div>

      {/* Lista de Gerações */}
      <GenerationsList productId={product.id} />
    </div>
  );
}