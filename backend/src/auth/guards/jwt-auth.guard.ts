/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que ativa a estratégia "jwt".
 * Usado com @UseGuards(JwtAuthGuard) em rotas protegidas.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt' as const) {}
