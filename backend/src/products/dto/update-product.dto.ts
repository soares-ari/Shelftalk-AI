import { IsString, IsOptional } from 'class-validator';

/**
 * DTO para atualização parcial de produtos.
 * Pode ser usado em PATCH /products/:id.
 */
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
