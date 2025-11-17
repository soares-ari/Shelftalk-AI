import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './config/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OpenAIModule } from './openai/openai.module';
import configuration from './config/configuration';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    DatabaseModule,

    UsersModule,

    AuthModule,

    ProductsModule,

    AiModule,

    OpenAIModule,
  ],
})
export class AppModule {}
