// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Busca um usuário pelo email.
   * Retorna `User` caso exista, ou `null` caso contrário.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Cria um novo usuário.
   * Recebe um objeto com email e hash da senha (passwordHash).
   * Retorna a entidade User já salva no banco.
   */
  async create(data: { email: string; passwordHash: string }): Promise<User> {
    const user = this.usersRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
    });

    return this.usersRepository.save(user);
  }
}
