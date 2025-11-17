// backend/src/ai/pipelines/title.pipeline.ts

import { Injectable, Logger } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { TitleInput, GenerationResult } from './ai-pipeline.types';

/**
 * TitlePipeline
 *
 * Gera um título otimizado para marketplace / e-commerce.
 */
@Injectable()
export class TitlePipeline {
  private readonly logger = new Logger(TitlePipeline.name);

  private readonly model = new ChatOpenAI({
    modelName: 'gpt-4o-mini' satisfies string,
    temperature: 0.5,
    apiKey: process.env.OPENAI_API_KEY,
  });

  async run(input: TitleInput): Promise<GenerationResult> {
    this.logger.debug(`Gerando título SEO para produto: ${input.name}`);

    const maxLength = input.maxLength ?? 80;

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        [
          'Você é especialista em títulos de produtos para e-commerce brasileiro.',
          'Gere UM título otimizado para SEO, claro e atrativo.',
          'Não use aspas, emojis ou caracteres especiais desnecessários.',
          `Limite aproximado de tamanho: até ${maxLength} caracteres.`,
        ].join(' '),
      ],
      [
        'human',
        [
          'Nome do produto: {name}',
          'Descrição base (se houver): {description}',
          'Marketplace alvo (se informado): {marketplace}',
        ].join('\n'),
      ],
    ]);

    const chain = prompt.pipe(this.model);

    const response = await chain.invoke({
      name: input.name,
      description: input.description ?? '',
      marketplace: input.marketplace ?? 'generic',
    });

    const text =
      typeof response === 'string' ? response : (response.content as string);

    // Força remoção de quebras de linha, caso venham
    const normalized = text.replace(/\s+/g, ' ').trim();

    return {
      text: normalized,
    };
  }
}
