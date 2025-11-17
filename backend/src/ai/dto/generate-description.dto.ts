// src/ai/dto/generate-description.dto.ts

import { IsString, IsOptional } from 'class-validator';

/**
 * GenerateDescriptionDto
 *
 * Define o formato dos dados que o frontend envia
 * quando quer gerar uma descrição de produto com IA.
 */
export class GenerateDescriptionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
