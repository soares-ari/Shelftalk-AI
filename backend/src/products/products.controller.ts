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
  Request,
  NotFoundException,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { multerConfig } from '../config/multer.config';

/**
 * Interface para Request com user autenticado
 */
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

/**
 * Controller de produtos
 */
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Criar produto com upload opcional de imagem
   *
   * Aceita multipart/form-data com campo 'image'
   */
  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.userId;

    // Caminho relativo da imagem (se houver)
    const imageUrl = file ? `uploads/products/${file.filename}` : null;

    const product = await this.productsService.create({
      ...createProductDto,
      imageUrl,
      ownerId: userId,
    });

    return product;
  }

  /**
   * Listar todos os produtos do usuário autenticado
   */
  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.productsService.findAllByOwner(userId);
  }

  /**
   * Buscar produto específico
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.ownerId !== userId) {
      throw new ForbiddenException('Você não tem acesso a este produto');
    }

    return product;
  }

  /**
   * Atualizar produto com upload opcional de nova imagem
   *
   * Permite atualizar imagem do produto
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.userId;
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.ownerId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este produto',
      );
    }

    // Atualizar imageUrl se houver novo upload
    const updateData: UpdateProductDto & { imageUrl?: string } = {
      ...updateProductDto,
    };

    if (file) {
      updateData.imageUrl = `uploads/products/${file.filename}`;

      // TODO: Deletar imagem antiga se existir
      // Implementar limpeza de arquivos órfãos depois
    }

    return this.productsService.update(id, updateData);
  }

  /**
   * Deletar produto
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.ownerId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar este produto',
      );
    }

    await this.productsService.remove(id);

    return { message: 'Produto deletado com sucesso' };
  }
}
