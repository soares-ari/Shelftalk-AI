import { IsString, IsOptional } from 'class-validator';

/**
 * DTO para criação de produtos.
 * Define o formato e validação dos dados recebidos no POST /products.
 */
export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
