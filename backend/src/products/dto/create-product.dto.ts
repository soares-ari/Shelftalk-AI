// backend/src/products/dto/create-product.dto.ts

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO para criação de produto
 */
export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto é obrigatório' })
  @MaxLength(255, { message: 'O nome não pode ter mais de 255 caracteres' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  // imageUrl será preenchida automaticamente pelo controller após upload
  // Não precisa ser validada no DTO de criação
}
