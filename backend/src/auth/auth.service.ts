import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Tipos explícitos para deixar claro o que cada função retorna
interface RegisterResult {
  id: number;
  email: string;
}

interface LoginResult {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, // Serviço que lida com o banco e o User entity
    private readonly jwtService: JwtService, // Responsável pela assinatura dos tokens
  ) {}

  /**
   * register()
   * -------------
   * Registra um novo usuário:
   * - verifica se email já existe
   * - gera hash da senha
   * - grava no banco
   */
  async register(dto: {
    email: string;
    password: string;
  }): Promise<RegisterResult> {
    const existing = await this.usersService.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Gera hash seguro da senha
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashed,
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  /**
   * validateUser()
   * --------------
   * Função interna usada pelo login:
   * - busca usuário por email
   * - compara hash da senha
   */
  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;

    return user;
  }

  /**
   * login()
   * -------
   * Gera o JWT caso o usuário seja válido.
   */
  async login(dto: { email: string; password: string }): Promise<LoginResult> {
    const user = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Payload que irá dentro do token
    const payload = { sub: user.id, email: user.email };

    // Geração do JWT usando o JwtService
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
