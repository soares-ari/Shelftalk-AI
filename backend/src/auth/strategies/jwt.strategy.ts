/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from '../auth.types';

/**
 * Estratégia JWT usada pelo Passport.
 * Responsável por validar e decodificar o token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');

    if (!secret) {
      // Ajuda bastante em debug e em entrevista (falha cedo se env estiver errado)
      throw new Error('JWT_SECRET is missing in environment variables');
    }

    // Chamada ao construtor da Strategy (lib externa, mal tipada p/ nosso ESLint)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Retorna o usuário autenticado a partir do payload do token.
   * O retorno vira req.user nas rotas protegidas.
   *
   * Importante: não precisa ser async, não há await aqui.
   */
  validate(payload: { sub: string; email: string }): AuthUser {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
