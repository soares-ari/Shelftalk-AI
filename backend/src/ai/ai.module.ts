// backend/src/ai/ai.module.ts

import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LongDescriptionPipeline } from './pipelines/long-description.pipeline';
import { TitlePipeline } from './pipelines/title.pipeline';
import { TagsPipeline } from './pipelines/tags.pipeline';
import { SocialPostPipeline } from './pipelines/social-post.pipeline';

@Module({
  imports: [],
  controllers: [AiController],
  providers: [
    AiService,
    LongDescriptionPipeline,
    TitlePipeline,
    TagsPipeline,
    SocialPostPipeline,
  ],
  exports: [AiService],
})
export class AiModule {}
