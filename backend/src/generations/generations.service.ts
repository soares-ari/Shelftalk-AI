import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../products/product.entity';
import { Generation } from './generation.entity';
import { GenerateAllDto } from './dto/generate-all.dto';

import { AiService } from '../ai/ai.service';

@Injectable()
export class GenerationsService {
  constructor(
    @InjectRepository(Generation)
    private readonly genRepo: Repository<Generation>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly ai: AiService,
  ) {}

  async generateAll(ownerId: string, dto: GenerateAllDto) {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId, ownerId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 🔥 1. Collect prompts used
    const rawPrompt = {
      name: product.name,
      description: product.description,
    };

    // 🔥 2. Execute all AI pipelines
    const [title, longDesc, tags, social] = await Promise.all([
      this.ai.generateTitle(product.name, product.description, 80),
      this.ai.generateLongDescription(product.name, product.description),
      this.ai.generateTags(product.name, product.description),
      this.ai.generateSocial(product.name, product.description, 'instagram'),
    ]);

    // 🔥 3. Save in DB
    const generation = this.genRepo.create({
      product,
      title,
      longDescription: longDesc,
      tags,
      socialText: social,
      rawPrompt,
    });

    return this.genRepo.save(generation);
  }

  async findByProduct(ownerId: string, productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId, ownerId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.genRepo.find({
      where: { product: { id: productId } },
      order: { createdAt: 'DESC' },
    });
  }
}
