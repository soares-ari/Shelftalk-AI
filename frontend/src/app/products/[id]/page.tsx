import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProductView } from "@/components/products/product-view";

async function getProduct(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/login");

  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 404) redirect("/dashboard");
  if (!res.ok) redirect("/login");

  return res.json();
}

export default async function ProductPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const product = await getProduct(id);

  return (
    <DashboardShell>
      <ProductView product={product} />
    </DashboardShell>
  );
}
