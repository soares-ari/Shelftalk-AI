import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BackButton } from "@/components/layout/back-button";
import { GenerationTabs } from "@/components/generations/generation-tabs";
import { API_BASE_URL } from "@/lib/config";

async function getGeneration(id: string, token: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/generations/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Error fetching generation:", error);
    return null;
  }
}

export default async function GenerationPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;
  
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  const generation = await getGeneration(id, token);

  if (!generation) {
    redirect("/dashboard");
  }

  return (
    <DashboardShell>
      <BackButton label="Voltar" />
      <h1 className="text-3xl font-semibold mb-8">Conteúdo Gerado</h1>
      <GenerationTabs data={generation} />
    </DashboardShell>
  );
}