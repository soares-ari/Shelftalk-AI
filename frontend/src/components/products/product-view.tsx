"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProductEditForm } from "./product-edit-form";
import { GenerationsList } from "@/components/generations/generations-list";
import { GenerationLoading } from "../ui/generation-loading";

type ProductData = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

type Props = {
  product: ProductData;
};

export function ProductView({ product: initialProduct }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setIsGenerating(true);
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
      setIsGenerating(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Erro ao deletar produto");
        return;
      }

      toast.success("Produto deletado com sucesso!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Erro inesperado ao deletar produto");
      console.error("Delete error:", err);
    }
  }

  function handleEditSuccess(updatedProduct: ProductData) {
    setProduct(updatedProduct);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Editar Produto</h2>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <ProductEditForm
            product={product}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
  <>  
    <div className="space-y-8">
      {/* Seção do Produto */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="text-slate-400 mt-1">
              {product.description ?? "Sem descrição"}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/20 rounded-md transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <ConfirmDialog
              title="Deletar Produto"
              description={`Tem certeza que deseja deletar "${product.name}"? Esta ação não pode ser desfeita e todas as gerações vinculadas serão perdidas.`}
              confirmLabel="Deletar"
              onConfirm={handleDelete}
            >
              <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-md transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </ConfirmDialog>
          </div>
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
    <GenerationLoading isOpen={isGenerating} />
  </>
  );

}
