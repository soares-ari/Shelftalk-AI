import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

/**
 * Tipo retornado no registro
 */
export interface RegisterResult {
  id: string;
  email: string;
}

/**
 * Tipo retornado no login
 */
export interface LoginResult {
  accessToken: string;
}

/**
 * Serviço responsável por registro + login.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Registro de usuário
   */
  async register(dto: {
    email: string;
    password: string;
  }): Promise<RegisterResult> {
    // Gera hash seguro
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Cria o usuário no banco
    const user = await this.usersService.create(dto.email, passwordHash);

    return {
      id: user.id,
      email: user.email,
    };
  }

  /**
   * Login do usuário
   */
  async login(dto: { email: string; password: string }): Promise<LoginResult> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Valida senha
    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Cria token JWT
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
    };
  }
}
