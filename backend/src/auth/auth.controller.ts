import { Controller, Post, Body } from '@nestjs/common';
import { AuthService, RegisterResult, LoginResult } from './auth.service';

/**
 * Controller responsável por registro e login.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Rota de registro
   */
  @Post('register')
  async register(
    @Body() dto: { email: string; password: string },
  ): Promise<RegisterResult> {
    return this.authService.register(dto);
  }

  /**
   * Rota de login
   */
  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
  ): Promise<LoginResult> {
    return this.authService.login(dto);
  }
}
