"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorBox } from "@/components/feedback/error-box";
import { useRouter } from "next/navigation";

export function ProductForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (file) {
        formData.append("image", file);
      }

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Erro ao criar produto.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Erro inesperado ao criar produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome do Produto
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Tênis Nike Air Max"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="description"
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          rows={4}
          value={description}
          placeholder="Descrição curta do produto"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Upload */}
      <div className="space-y-2">
        <label htmlFor="image" className="text-sm font-medium">
          Imagem do Produto
        </label>

        <input
          className="block text-sm"
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <ErrorBox message={error ?? undefined} />

      <Button type="submit" loading={loading}>
        Criar Produto
      </Button>
    </form>
  );
}
