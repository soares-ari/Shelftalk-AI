import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
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
    // CORRIGIDO: Passa dto.productId (string) e user.id (string) na ordem correta
    return this.service.generateAll(dto.productId, user.id);
  }

  @Get('product/:id')
  findByProduct(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    // CORRIGIDO: Usa método correto findAllByProduct e remove user.id (desnecessário)
    return this.service.findAllByProduct(id);
  }
}
