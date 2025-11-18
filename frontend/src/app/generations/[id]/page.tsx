import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { GenerationTabs } from "@/components/generations/generation-tabs";

async function getGeneration(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/login");

  const res = await fetch(`${API_BASE_URL}/generations/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status === 404) redirect("/dashboard");
  if (!res.ok) redirect("/login");

  return res.json();
}

export default async function GenerationPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  const generation = await getGeneration(id);

  return (
    <DashboardShell>
      <h1 className="text-3xl font-semibold mb-8">Conteúdo Gerado</h1>
      <GenerationTabs data={generation} />
    </DashboardShell>
  );
}
