import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, RegisterResult, LoginResult } from './auth.service';

/**
 * AuthController
 * ---------------
 * Controlador responsável por expor as rotas públicas de autenticação.
 * Ele mantém o controller "fino", delegando toda a lógica ao AuthService.
 *
 * Rotas expostas:
 * - POST /auth/register → cria um novo usuário
 * - POST /auth/login → autentica e retorna um JWT
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registro de novos usuários.
   *
   * A rota recebe email + senha em texto puro e delega para o AuthService,
   * que cuida de:
   * - validar usuário existente
   * - gerar hash seguro (bcrypt)
   * - criar o usuário no banco
   * - retornar somente dados seguros (id e email)
   *
   * @param dto objeto com email e password enviados no body
   * @returns RegisterResult → id + email do usuário criado
   */
  @Post('register')
  async register(
    @Body() dto: { email: string; password: string },
  ): Promise<RegisterResult> {
    return this.authService.register(dto);
  }

  /**
   * Login do usuário.
   *
   * A rota recebe email + senha, e o AuthService:
   * - busca usuário pelo email
   * - compara hash da senha (bcrypt.compare)
   * - assina um token JWT válido por 1 hora
   * - retorna { accessToken }
   *
   * @param dto objeto com email e password enviados no body
   * @returns LoginResult → objeto contendo o token JWT
   */
  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
  ): Promise<LoginResult> {
    return this.authService.login(dto);
  }
}
