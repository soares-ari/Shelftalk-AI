// backend/src/products/products.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/auth.types';
import { multerConfig } from '../config/multer.config';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const baseUrl =
      process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`;
    const imageUrl = file
      ? `${baseUrl}/uploads/products/${file.filename}`
      : null;

    const product = await this.productsService.create({
      ...createProductDto,
      imageUrl,
      ownerId: user.id,
    });

    return product;
  }

  @Get()
  async findAll(@CurrentUser() user: AuthUser) {
    return this.productsService.findAllByOwner(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.ownerId !== user.id) {
      throw new ForbiddenException('Você não tem acesso a este produto');
    }

    return product;
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.ownerId !== user.id) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este produto',
      );
    }

    const updateData: UpdateProductDto & { imageUrl?: string } = {
      ...updateProductDto,
    };

    if (file) {
      const baseUrl =
        process.env.APP_URL || `http://localhost:${process.env.PORT || 3001}`;
      updateData.imageUrl = `${baseUrl}/uploads/products/${file.filename}`;
    }

    return this.productsService.update(id, updateData);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.ownerId !== user.id) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este produto',
      );
    }

    await this.productsService.remove(id);
  }
}