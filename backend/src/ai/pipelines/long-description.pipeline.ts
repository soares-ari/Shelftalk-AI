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

  private readonly model = new ChatOpenAI({
    modelName: 'gpt-4o-mini' satisfies string,
    temperature: 0.7, // ← Mais criativa que title
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Executa a pipeline
  async run(input: BaseProductInput): Promise<GenerationResult> {
    this.logger.debug(`Gerando descrição longa para produto: ${input.name}`);

    // PROMPT TEMPLATE usando LangChain
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system', // ← Instrução do sistema (define comportamento)
        [
          'Você é um copywriter especializado em e-commerce.',
          'Gere uma descrição detalhada, envolvente e clara para o produto informado.',
          'Use português brasileiro, tom profissional mas acessível.',
          'Evite repetir o nome do produto em todas as frases.',
        ].join(' '),
      ],
      [
        'human', // ← Input do usuário
        [
          'Nome do produto: {name}',
          'Descrição base (se houver): {description}',
          '',
          'Gere um texto em 2 a 4 parágrafos, com foco em benefícios,',
          'sensação de uso e adequação a diferentes contextos.',
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

    return {
      text,
    };
  }
}
