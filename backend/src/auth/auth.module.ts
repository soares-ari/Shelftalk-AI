import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

/**
 * AuthModule
 * ----------
 * Este módulo define tudo o que pertence ao sistema de autenticação:
 * - Providers: AuthService
 * - Controllers: AuthController
 * - Imports: UsersModule e JwtModule
 *
 * Observação:
 * O JwtModule precisa ser configurado com a chave secreta (vinda do .env)
 * e com o tempo de expiração do token.
 */
@Module({
  imports: [
    // Importa UsersModule para permitir consultar/criar usuários
    UsersModule,

    // Configura JWT com chave secreta e validade
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret', // ⚠ deve ser definida no .env
      signOptions: { expiresIn: '7d' }, // Token válido por 7 dias
    }),
  ],

  controllers: [
    // Controller responsável por /auth/register e /auth/login
    AuthController,
  ],

  providers: [
    // Serviço principal de autenticação (hash, validação, login)
    AuthService,
  ],

  exports: [
    // Exporta AuthService caso outros módulos precisem usar login/validar usuário
    AuthService,
  ],
})
export class AuthModule {}
