"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductCard } from "@/components/products/product-card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/product";

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        
        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [router]);

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Meus Produtos</h1>
        <button
          onClick={() => router.push("/products/new")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <Plus className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            Nenhum produto cadastrado
          </h3>
          <p className="text-slate-500 mb-6">
            Comece criando seu primeiro produto
          </p>
          <button
            onClick={() => router.push("/products/new")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-md hover:bg-emerald-400 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Criar Primeiro Produto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}