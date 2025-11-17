// src/openai/openai.controller.ts

import { Controller, Post } from '@nestjs/common';
import { OpenAIService } from './openai.service';

/**
 * Controller temporário usado para validar se a OPENAI_API_KEY
 * está funcionando corretamente.
 */
@Controller()
export class OpenAIController {
  constructor(private readonly openai: OpenAIService) {}

  @Post('test-openai')
  async test() {
    const msg = await this.openai.testConnection();
    return { message: msg };
  }
}
