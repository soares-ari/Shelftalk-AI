// src/ai/ai.controller.ts

import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { AiService } from './ai.service';
import { GenerateDescriptionDto } from './dto/generate-description.dto';

// Guards e decorator de usuário atual já existentes no seu projeto
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';

/**
 * AiController
 *
 * Exponde endpoints HTTP relacionados a IA.
 * Aqui não tem regra de negócio pesada — só orquestra a chamada
 * para o AiService e controla aspectos HTTP (status code, body, etc).
 */
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /**
   * POST /ai/preview-description
   *
   * Gera uma descrição de produto usando IA, sem salvar nada no banco.
   * Útil para o usuário brincar com variações antes de "confirmar".
   */
  @UseGuards(JwtAuthGuard)
  @Post('preview-description')
  async previewDescription(
    @CurrentUser() user: AuthUser,
    @Body() dto: GenerateDescriptionDto,
  ) {
    // Neste momento, "user" já vem decodificado do JWT via JwtStrategy.
    // Estamos pegando apenas o id por enquanto, mas ele pode ser usado
    // futuramente para logging, limites por usuário, billing, etc.
    const ownerId = user.id;

    const input = this.aiService.mapDtoToInput(dto);
    const text = await this.aiService.generateProductDescription(input);

    return {
      ownerId, // opcional, mas bom para debugging no frontend
      prompt: {
        name: dto.name,
        description: dto.description ?? null,
      },
      result: text,
    };
  }
}
