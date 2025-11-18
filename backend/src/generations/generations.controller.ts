import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { GenerationsService } from './generations.service';
import { GenerateAllDto } from './dto/generate-all.dto';
import type { AuthUser } from '../auth/auth.types';

@Controller('generations')
@UseGuards(JwtAuthGuard)
export class GenerationsController {
  constructor(private readonly service: GenerationsService) {}

  @Post('generate-all')
  generate(@CurrentUser() user: AuthUser, @Body() dto: GenerateAllDto) {
    return this.service.generateAll(dto.productId, user.id);
  }

  @Get('product/:id')
  findByProduct(@Param('id') id: string) {
    return this.service.findAllByProduct(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const generation = await this.service.findOne(id);

    if (!generation) {
      throw new NotFoundException('Geração não encontrada');
    }

    if (generation.product.ownerId !== user.id) {
      throw new ForbiddenException('Acesso negado a esta geração');
    }

    return generation;
  }
}
