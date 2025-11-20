import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService, RegisterResult, LoginResult } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Controller responsável por registro e login.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Rota de registro
   *
   */
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<RegisterResult> {
    return this.authService.register(dto);
  }

  /**
   * Rota de login
   *
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResult> {
    return this.authService.login(dto);
  }
}
