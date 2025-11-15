import { IsEmail, IsString } from 'class-validator';

/**
 * DTO utilizado no endpoint de autenticação (login).
 *
 * Mantém consistência com o RegisterDto, porém sem validação
 * de tamanho mínimo na senha — já que nesta etapa ela apenas
 * será comparada com o hash salvo no banco.
 */
export class LoginDto {
  /** Email do usuário cadastrado */
  @IsEmail()
  email: string;

  /** Senha em texto puro enviada para validação */
  @IsString()
  password: string;
}
