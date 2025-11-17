// src/openai/openai.service.ts

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

/**
 * Serviço responsável por integração com a API da OpenAI.
 * Ele inicializa o cliente usando a OPENAI_API_KEY do .env
 * e expõe métodos para gerar textos, títulos, descrições etc.
 */
@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Método simples apenas para testar se o backend consegue
   * se comunicar com a API da OpenAI.
   */
  async testConnection(): Promise<string> {
    try {
      const result = await this.client.responses.create({
        model: 'gpt-4.1-mini',
        input: 'Diga apenas: OK',
      });

      return result.output_text;
    } catch (error) {
      console.error('Erro ao testar OpenAI:', error);
      throw new InternalServerErrorException(
        'Falha ao se comunicar com a OpenAI',
      );
    }
  }
}
