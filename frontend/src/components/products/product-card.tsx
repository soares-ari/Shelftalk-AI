// src/components/products/product-card.tsx
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group rounded-xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-emerald-500 transition-colors"
    >
      <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="flex items-center justify-center text-slate-500 h-full">
            Sem imagem
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{product.name}</h2>

        <p className="text-sm text-slate-400">
          {product.description ? product.description.slice(0, 80) : "Sem descrição"}
        </p>
      </div>
    </Link>
  );
}
