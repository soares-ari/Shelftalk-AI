// backend/src/ai/dto/generate-title.dto.ts

import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';

/**
 * DTO para geração de título SEO.
 */
export class GenerateTitleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(20)
  maxLength?: number;

  @IsOptional()
  @IsIn(['mercado_livre', 'amazon', 'shopee', 'generic'])
  marketplace?: 'mercado_livre' | 'amazon' | 'shopee' | 'generic';
}
