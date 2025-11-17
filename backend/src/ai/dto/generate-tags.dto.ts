// backend/src/ai/dto/generate-tags.dto.ts

import { IsString, IsOptional, IsInt, Min } from 'class-validator';

/**
 * DTO para geração de tags de produto.
 */
export class GenerateTagsDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxTags?: number;
}
