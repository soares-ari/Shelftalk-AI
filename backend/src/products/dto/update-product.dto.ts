// backend/src/products/dto/update-product.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

/**
 * DTO para atualização de produto
 * Todos os campos são opcionais (herda de CreateProductDto)
 */
export class UpdateProductDto implements Partial<CreateProductDto> {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
