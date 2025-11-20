// backend/src/ai/pipelines/tags.pipeline.ts

import { Injectable, Logger } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { TagsInput, GenerationResult } from './ai-pipeline.types';

/**
 * TagsPipeline
 *
 * Gera uma lista de tags / palavras-chave para SEO e marketplaces.
 */
@Injectable()
export class TagsPipeline {
  private readonly logger = new Logger(TagsPipeline.name);

  private readonly model = new ChatOpenAI({
    modelName: 'gpt-4o-mini' satisfies string,
    temperature: 0.6, // ← Moderada
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Executa a pipeline
  async run(input: TagsInput): Promise<GenerationResult> {
    this.logger.debug(`Gerando tags para produto: ${input.name}`);

    const maxTags = input.maxTags ?? 10;

    // PROMPT TEMPLATE usando LangChain
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system', // ← Instrução do sistema (define comportamento)
        [
          'Gere uma lista de palavras-chave (tags) para e-commerce brasileiro.',
          'Responda APENAS com as tags separadas por vírgula.',
          `Gere no máximo ${maxTags} tags.`,
        ].join(' '),
      ],
      [
        'human', // ← Input do usuário
        [
          'Nome do produto: {name}',
          'Descrição base (se houver): {description}',
        ].join('\n'),
      ],
    ]);

    // CHAIN = Prompt + Model (padrão LangChain)
    const chain = prompt.pipe(this.model);

    // EXECUÇÃO
    const response = await chain.invoke({
      name: input.name,
      description: input.description ?? '',
    });

    // PARSE da resposta
    const text =
      typeof response === 'string' ? response : (response.content as string);

    // Normaliza espaços
    const normalized = text.replace(/\s*,\s*/g, ', ').trim();

    return {
      text: normalized,
    };
  }
}
