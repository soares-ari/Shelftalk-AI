// backend/src/products/products.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * Service responsável pela lógica de negócio de produtos
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Criar novo produto
   *
   * ATUALIZADO: Agora aceita imageUrl
   */
  async create(
    data: CreateProductDto & { ownerId: string; imageUrl?: string | null },
  ): Promise<Product> {
    const product = this.productRepository.create({
      name: data.name,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      ownerId: data.ownerId,
    });

    return this.productRepository.save(product);
  }

  /**
   * Buscar todos os produtos de um usuário
   */
  async findAllByOwner(ownerId: string): Promise<Product[]> {
    return this.productRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Buscar produto por ID
   */
  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  /**
   * Atualizar produto
   *
   * ATUALIZADO: Permite atualizar imageUrl
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto & { imageUrl?: string },
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Produto não encontrado após atualização');
    }
    return updated;
  }

  /**
   * Deletar produto
   */
  async remove(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }
}
