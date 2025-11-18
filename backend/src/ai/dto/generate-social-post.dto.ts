// backend/src/ai/dto/generate-social-post.dto.ts

import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

/**
 * DTO para gerar post social
 */
export class GenerateSocialPostDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['instagram', 'tiktok', 'facebook', 'pinterest'])
  channel: 'instagram' | 'tiktok' | 'facebook' | 'pinterest';

  @IsOptional()
  @IsIn(['casual', 'premium', 'jovem', 'neutro'])
  tone?: 'casual' | 'premium' | 'jovem' | 'neutro';
}
