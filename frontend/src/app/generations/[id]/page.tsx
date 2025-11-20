import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BackButton } from "@/components/layout/back-button";
import { GenerationTabs } from "@/components/generations/generation-tabs";

async function getGeneration(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) redirect("/login");
  
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/generations/${id}`, {
    method: "GET",
    headers: {
      Cookie: `accessToken=${token}`,
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
      <BackButton label="Voltar" />
      <h1 className="text-3xl font-semibold mb-8">Conteúdo Gerado</h1>
      <GenerationTabs data={generation} />
    </DashboardShell>
  );
}