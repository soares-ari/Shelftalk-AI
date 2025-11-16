import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth.types'; // ← IMPORT TYPE

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * Controller responsável por expor as rotas HTTP do módulo de produtos.
 * Todas as rotas são protegidas por JWT, garantindo que apenas o usuário
 * autenticado consiga manipular seus próprios produtos.
 */
@Controller('products')
@UseGuards(JwtAuthGuard) // todas as rotas exigem token JWT
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * POST /products
   * Cria um novo produto associado ao usuário autenticado.
   */
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.id, dto);
  }

  /**
   * GET /products
   * Lista todos os produtos do usuário autenticado.
   */
  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.productsService.findAllForUser(user.id);
  }

  /**
   * GET /products/:id
   * Retorna um produto específico do usuário autenticado.
   */
  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.productsService.findOne(user.id, id);
  }

  /**
   * PATCH /products/:id
   * Atualiza parcialmente um produto do usuário.
   */
  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(user.id, id, dto);
  }

  /**
   * DELETE /products/:id
   * Remove um produto do usuário autenticado.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.productsService.remove(user.id, id);
  }
}
