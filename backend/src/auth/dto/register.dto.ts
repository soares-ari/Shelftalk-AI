import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO destinado ao endpoint de registro de novos usuários.
 *
 * Este padrão garante:
 * - validação automática dos campos recebidos
 * - mensagens de erro consistentes
 * - proteção contra payloads inesperados
 */
export class RegisterDto {
  /**
   * Email do usuário, validado automaticamente pelo class-validator.
   * Obrigatório e deve seguir formato de email válido.
   */
  @IsEmail()
  email: string;

  /**
   * Senha em texto puro enviada no momento do registro.
   * Regras aplicadas:
   * - precisa ter no mínimo 6 caracteres
   * - será convertida para hash antes de salvar no banco
   */
  @IsString()
  @MinLength(6)
  password: string;
}
