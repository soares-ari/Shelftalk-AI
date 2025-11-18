import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductForm } from "@/components/products/product-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <h1 className="text-3xl font-semibold mb-8">Criar Produto</h1>
      <ProductForm />
    </DashboardShell>
  );
}
