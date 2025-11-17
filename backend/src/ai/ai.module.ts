// src/ai/ai.module.ts

import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

/**
 * AiModule
 *
 * Módulo responsável por toda a lógica de IA do backend:
 * - Centraliza integrações com LLMs (OpenAI via LangChain)
 * - Exponde endpoints de "preview" e geração de textos
 * - Pode ser reutilizado em outros módulos (products, etc.)
 */
@Module({
  imports: [],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService], // permite que outros módulos usem o AiService
})
export class AiModule {}
