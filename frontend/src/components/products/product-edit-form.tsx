"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

type ProductData = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
};

type Props = {
  product: ProductData;
  onSuccess: (updatedProduct: ProductData) => void;
  onCancel: () => void;
};

export function ProductEditForm({ product, onSuccess, onCancel }: Props) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message ?? "Erro ao atualizar produto");
        return;
      }

      const data = await res.json() as ProductData;
      toast.success("Produto atualizado com sucesso!");
      onSuccess(data);
    } catch (err) {
      toast.error("Erro inesperado ao atualizar produto");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Nome do Produto *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Upload de Imagem */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Nova Imagem (opcional)
        </label>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-md cursor-pointer hover:bg-slate-700 transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">
              {image ? image.name : "Escolher arquivo"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
          {image && (
            <button
              type="button"
              onClick={() => setImage(null)}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {image && (
          <p className="text-xs text-slate-500 mt-1">
            Nova imagem será enviada ao salvar
          </p>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}