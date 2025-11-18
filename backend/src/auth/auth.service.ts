import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export interface RegisterResult {
  id: string;
  email: string;
  name: string;
}

export interface LoginResult {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Registro de novo usuário.
   * Lança 409 se e-mail já existir.
   */
  async register(dto: {
    name: string;
    email: string;
    password: string;
  }): Promise<RegisterResult> {
    // Verifica se já existe
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Gera hash seguro
    const hashed = await bcrypt.hash(dto.password, 10);

    // Cria usuário com nome
    const user = await this.usersService.create(dto.name, dto.email, hashed);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  /**
   * Login de usuário existente.
   */
  async login(dto: { email: string; password: string }): Promise<LoginResult> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compara senha
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Gera JWT
    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { accessToken: token };
  }
}
