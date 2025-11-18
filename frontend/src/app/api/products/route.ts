// src/app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Não autenticado." },
        { status: 401 }
      );
    }

    // Recebe formData do frontend
    const formData = await req.formData();

    // Envia exatamente o mesmo formData para o Nest
    const serverRes = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Mantém multipart original
    });

    const data = await serverRes.json();

    if (!serverRes.ok) {
      return NextResponse.json(data, { status: serverRes.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Erro no proxy /api/products:", err);
    return NextResponse.json(
      { message: "Erro ao criar produto." },
      { status: 500 }
    );
  }
}
