import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

// Tipos de retorno (excelente para documentação e clareza)
export interface RegisterResult {
  id: string;
  email: string;
}

export interface LoginResult {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra um novo usuário no sistema.
   * - Gera hash seguro (bcrypt)
   * - Salva no banco
   * - Retorna apenas dados públicos (id/email)
   */
  async register(dto: {
    email: string;
    password: string;
  }): Promise<RegisterResult> {
    // Verifica se já existe um usuário com o mesmo email
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // Gera hash seguro da senha
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Cria o usuário no banco
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
    });

    // Retorna somente dados seguros (sem senha)
    return {
      id: user.id,
      email: user.email,
    };
  }

  /**
   * Realiza login.
   * - Busca usuário
   * - Compara senhas com bcrypt
   * - Gera access token JWT
   */
  async login(dto: { email: string; password: string }): Promise<LoginResult> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compara a senha em texto puro com o hash armazenado
    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Payload do token JWT
    const payload = { sub: user.id, email: user.email };

    // Gera token assinado
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
