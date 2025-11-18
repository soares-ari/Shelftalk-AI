import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { API_BASE_URL } from "@/lib/config";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types/product";

async function getProducts(): Promise<Product[]> {
  const cookieStore = await cookies(); // ✔️ FIX
  const accessToken = cookieStore.get("accessToken");

  if (!accessToken) {
    redirect("/login");
  }

  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/login");
  }

  return res.json();
}

export default async function DashboardPage() {
  const products = await getProducts();

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Seus Produtos</h1>

        <a
          href="/products/new"
          className="rounded-md bg-emerald-500 px-4 py-2 text-slate-950 text-sm font-medium hover:bg-emerald-400 transition-colors"
        >
          + Criar Produto
        </a>
      </div>

      {products.length === 0 && (
        <p className="text-slate-400">Você ainda não cadastrou nenhum produto.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </DashboardShell>
  );
}
