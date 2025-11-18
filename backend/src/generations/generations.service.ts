// backend/src/generations/generations.service.ts

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Generation } from './generation.entity';
import { AiService } from '../ai/ai.service';
import { ProductsService } from '../products/products.service';

/**
 * Service responsável pela lógica de negócio de gerações de conteúdo
 */
@Injectable()
export class GenerationsService {
  private readonly logger = new Logger(GenerationsService.name);

  constructor(
    @InjectRepository(Generation)
    private readonly generationRepository: Repository<Generation>,
    private readonly aiService: AiService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Gera todos os tipos de conteúdo para um produto
   * Inclui 4 versões de posts sociais: Instagram, TikTok, Facebook e Pinterest
   */
  async generateAll(productId: string, ownerId: string): Promise<Generation> {
    this.logger.log(`Gerando conteúdo para produto: ${productId}`);

    // Busca produto
    const product = await this.productsService.findOne(productId);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.ownerId !== ownerId) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Log de contexto
    if (product.imageUrl) {
      this.logger.debug(`Produto possui imagem: ${product.imageUrl}`);
    } else {
      this.logger.debug('Produto sem imagem - geração baseada apenas em texto');
    }

    // Gera todos os conteúdos em paralelo (7 chamadas à API)
    this.logger.debug('Iniciando geração de 7 tipos de conteúdo...');

    const [
      title,
      longDescription,
      tags,
      socialInstagram,
      socialTikTok,
      socialFacebook,
      socialPinterest,
    ] = await Promise.all([
      this.aiService.generateTitle(
        product.name,
        product.description,
        80,
        product.imageUrl,
      ),
      this.aiService.generateLongDescription(
        product.name,
        product.description,
        product.imageUrl,
      ),
      this.aiService.generateTags(
        product.name,
        product.description,
        product.imageUrl,
      ),
      this.aiService.generateSocial(
        product.name,
        product.description,
        'instagram',
        product.imageUrl,
      ),
      this.aiService.generateSocial(
        product.name,
        product.description,
        'tiktok',
        product.imageUrl,
      ),
      this.aiService.generateSocial(
        product.name,
        product.description,
        'facebook',
        product.imageUrl,
      ),
      this.aiService.generateSocial(
        product.name,
        product.description,
        'pinterest',
        product.imageUrl,
      ),
    ]);

    this.logger.debug('Geração concluída. Salvando no banco...');

    // Salva no banco com todas as 4 versões sociais
    const generation = this.generationRepository.create({
      product,
      title,
      longDescription,
      tags,
      socialInstagram,
      socialTikTok,
      socialFacebook,
      socialPinterest,
    });

    const saved = await this.generationRepository.save(generation);

    this.logger.log(`Geração salva com sucesso: ${saved.id}`);

    return saved;
  }

  /**
   * Busca todas as gerações de um produto
   */
  async findAllByProduct(productId: string): Promise<Generation[]> {
    return this.generationRepository.find({
      where: { product: { id: productId } },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca uma geração específica
   * ATUALIZADO: Inclui relação com product para verificar ownership
   */
  async findOne(id: string): Promise<Generation | null> {
    return this.generationRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }
}
