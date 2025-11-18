"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductView } from "@/components/products/product-view";
import type { Product } from "@/types/product";

type Props = { 
  params: Promise<{ id: string }> 
};

export default function ProductPage({ params }: Props) {

  const { id } = use(params);

  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`, {
          cache: "no-store",
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (res.status === 404) {
          router.push("/dashboard");
          return;
        }

        if (!res.ok) {
          setError("Erro ao carregar produto.");
          return;
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError("Erro inesperado ao carregar produto.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, router]);

  return (
    <DashboardShell>
      {loading && (
        <p className="text-slate-400">Carregando produto...</p>
      )}

      {error && (
        <p className="text-red-400 bg-red-950/40 border border-red-700 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {product && <ProductView product={product} />}
    </DashboardShell>
  );
}
