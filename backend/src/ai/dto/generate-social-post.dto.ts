// backend/src/ai/dto/generate-social-post.dto.ts

import { IsString, IsOptional, IsIn } from 'class-validator';

/**
 * DTO para geração de posts sociais.
 */
export class GenerateSocialPostDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsIn(['instagram', 'tiktok', 'threads', 'linkedin'])
  channel: 'instagram' | 'tiktok' | 'threads' | 'linkedin';

  @IsOptional()
  @IsIn(['casual', 'premium', 'jovem', 'neutro'])
  tone?: 'casual' | 'premium' | 'jovem' | 'neutro';
}
