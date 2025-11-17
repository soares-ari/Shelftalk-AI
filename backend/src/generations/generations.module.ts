import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GenerationsService } from './generations.service';
import { GenerationsController } from './generations.controller';

import { Product } from '../products/product.entity';
import { Generation } from './generation.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Generation, Product]), AiModule],
  providers: [GenerationsService],
  controllers: [GenerationsController],
})
export class GenerationsModule {}
