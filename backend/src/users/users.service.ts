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

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Cria um novo usuário no banco.
   * Agora inclui o campo `name`.
   */
  async create(
    name: string,
    email: string,
    passwordHash: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      name,
      email,
      passwordHash,
    });

    return this.usersRepository.save(user);
  }
}
