// backend/src/ai/dto/generate-description.dto.ts

import { IsString, IsOptional } from 'class-validator';

/**
 * DTO para geração de descrição longa de produto.
 */
export class GenerateDescriptionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
