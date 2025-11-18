import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      );
    }

    const backendRes = await fetch(`${API_BASE_URL}/generations/${params.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("Erro em GET /api/generations/[id]:", err);
    return NextResponse.json(
      { message: "Erro ao buscar conteúdo gerado." },
      { status: 500 }
    );
  }
}
