import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Controlador responsável por receber requisições relacionadas
 * à autenticação: registro e login.
 *
 * Ele delega toda a lógica de negócio ao AuthService,
 * mantendo o controller enxuto e fácil de testar.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Endpoint de criação de novos usuários */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /** Endpoint de login e geração de token JWT */
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
