"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href: string;
};

export function Breadcrumb() {
  const pathname = usePathname();

  // Não mostrar breadcrumb em páginas de auth
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  const items: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];

  // Adicionar items baseado na rota
  if (pathname.startsWith("/products/")) {
    items.push({ label: "Produto", href: pathname });
  }

  if (pathname.startsWith("/generations/")) {
    items.push({ label: "Geração", href: pathname });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
      <Link
        href="/dashboard"
        className="hover:text-emerald-400 transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>

      {items.slice(1).map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4" />
          {index === items.length - 2 ? (
            <span className="text-slate-200 font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-emerald-400 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}