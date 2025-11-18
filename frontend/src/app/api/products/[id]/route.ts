// src/app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

export async function GET(
  _req: NextRequest,
  args: { params: Promise<{ id: string }> }
) {
  try {
    // NEXT 16 → params é uma PROMISE
    const { id } = await args.params;

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      );
    }

    const serverRes = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await serverRes.json();

    return NextResponse.json(data, { status: serverRes.status });
  } catch (err) {
    console.error("Erro em GET /api/products/[id]:", err);
    return NextResponse.json(
      { message: "Erro ao buscar produto." },
      { status: 500 }
    );
  }
}
