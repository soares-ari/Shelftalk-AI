// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const nestRes = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await nestRes.json();

    if (!nestRes.ok) {
      return NextResponse.json(
        { message: data.message ?? 'Erro ao registrar.' },
        { status: nestRes.status },
      );
    }

    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    const res = NextResponse.json(
      {
        user: data.user ?? null,
        message: 'Registro realizado com sucesso.',
      },
      { status: 201 },
    );

    if (accessToken) {
      res.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hora
      });
    }

    if (refreshToken) {
      res.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }

    return res;
  } catch (error) {
    console.error('Erro em /api/auth/register:', error);
    return NextResponse.json(
      { message: 'Erro interno ao registrar.' },
      { status: 500 },
    );
  }
}
