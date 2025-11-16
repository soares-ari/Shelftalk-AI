import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

/**
 * ProductsService
 *
 * Contém toda a lógica de negócio relacionada a produtos.
 * Mantém isolamento de dados: um usuário só pode manipular os seus próprios produtos.
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  /**
   * Criação de produto.
   * Mapeamento seguro: evita quaisquer campos dinâmicos que possam gerar tipos incorretos.
   */
  async create(
    ownerId: string,
    dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = this.productsRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      ownerId,
    });

    const saved = await this.productsRepo.save(product);
    return this.toResponseDto(saved);
  }

  /**
   * Lista todos os produtos do usuário autenticado.
   */
  async findAllForUser(ownerId: string): Promise<ProductResponseDto[]> {
    const products = await this.productsRepo.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });

    return products.map((p) => this.toResponseDto(p));
  }

  /**
   * Retorna um produto do usuário.
   * Valida existência e propriedade.
   */
  async findOne(ownerId: string, id: string): Promise<ProductResponseDto> {
    const product = await this.productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this product');
    }

    return this.toResponseDto(product);
  }

  /**
   * Atualiza apenas os campos permitidos.
   * Sem Object.assign → evita problemas do TypeORM com tipos inválidos.
   */
  async update(
    ownerId: string,
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this product');
    }

    // Atualização segura: apenas campos explicitamente declarados
    if (dto.name !== undefined) {
      product.name = dto.name;
    }

    if (dto.description !== undefined) {
      product.description = dto.description ?? null;
    }

    const updated = await this.productsRepo.save(product);
    return this.toResponseDto(updated);
  }

  /**
   * Remove um produto.
   * Verifica existência e propriedade.
   */
  async remove(ownerId: string, id: string): Promise<void> {
    const product = await this.productsRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this product');
    }

    await this.productsRepo.remove(product);
  }

  /**
   * Converte entidade na resposta pública padrão.
   * Garante estabilidade da API e evita vazamento de dados internos.
   */
  private toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? null,
      ownerId: product.ownerId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
