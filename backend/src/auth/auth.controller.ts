import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService, RegisterResult, LoginResult } from './auth.service';
import { RegisterDto } from './dto/register.dto'; // 🔥 Import DTO
import { LoginDto } from './dto/login.dto'; // 🔥 Import DTO

/**
 * Controller responsável por registro e login.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Rota de registro
   * 🔥 MUDANÇA: Usar RegisterDto em vez de objeto genérico
   */
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResult> {
    return this.authService.register(dto);
  }

  /**
   * Rota de login
   * 🔥 MUDANÇA: Usar LoginDto + HttpCode(200)
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.authService.login(dto);
  }
}
