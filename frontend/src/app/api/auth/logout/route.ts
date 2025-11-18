// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  try {
    const res = NextResponse.json(
      { message: 'Logout realizado com sucesso.' },
      { status: 200 },
    );

    // "Limpa" os cookies setando com maxAge 0
    res.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    res.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return res;
  } catch (error) {
    console.error('Erro em /api/auth/logout:', error);
    return NextResponse.json(
      { message: 'Erro interno ao fazer logout.' },
      { status: 500 },
    );
  }
}
