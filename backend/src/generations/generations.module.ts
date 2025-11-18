import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GenerationsService } from './generations.service';
import { GenerationsController } from './generations.controller';

import { Generation } from './generation.entity';
import { AiModule } from '../ai/ai.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([Generation]), AiModule, ProductsModule],
  providers: [GenerationsService],
  controllers: [GenerationsController],
})
export class GenerationsModule {}
