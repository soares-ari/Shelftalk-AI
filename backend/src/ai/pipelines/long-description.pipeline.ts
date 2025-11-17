// backend/src/ai/pipelines/long-description.pipeline.ts

import { Injectable, Logger } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { BaseProductInput, GenerationResult } from './ai-pipeline.types';

/**
 * LongDescriptionPipeline
 *
 * Responsável por gerar uma descrição longa e bem trabalhada
 * de produto, focada em e-commerce.
 */
@Injectable()
export class LongDescriptionPipeline {
  private readonly logger = new Logger(LongDescriptionPipeline.name);

  /**
   * O modelo do LangChain / OpenAI.
   * Aqui usamos um construtor direto, mas você pode
   * ajustar o modelo para o mesmo que já usou antes.
   */
  private readonly model = new ChatOpenAI({
    // Ajuste para o modelo que estiver usando no projeto
    // (por ex: 'gpt-4o-mini', 'gpt-4.1-mini', etc.).
    modelName: 'gpt-4o-mini' satisfies string,
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
  });

  /**
   * Executa a pipeline para gerar uma descrição longa.
   */
  async run(input: BaseProductInput): Promise<GenerationResult> {
    this.logger.debug(`Gerando descrição longa para produto: ${input.name}`);

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        [
          'Você é um copywriter especializado em e-commerce.',
          'Gere uma descrição detalhada, envolvente e clara para o produto informado.',
          'Use português brasileiro, tom profissional mas acessível.',
          'Evite repetir o nome do produto em todas as frases.',
        ].join(' '),
      ],
      [
        'human',
        [
          'Nome do produto: {name}',
          'Descrição base (se houver): {description}',
          '',
          'Gere um texto em 2 a 4 parágrafos, com foco em benefícios,',
          'sensação de uso e adequação a diferentes contextos.',
        ].join('\n'),
      ],
    ]);

    const chain = prompt.pipe(this.model);

    const response = await chain.invoke({
      name: input.name,
      description: input.description ?? '',
    });

    // Em versões atuais do LangChain, o retorno é um "AIMessage" com .content
    const text =
      typeof response === 'string' ? response : (response.content as string);

    return {
      text,
    };
  }
}
