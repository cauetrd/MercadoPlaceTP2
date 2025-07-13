import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewMarketController } from './review-market.controller';
import { ReviewMarketService } from './review-market.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewMarketController],
  providers: [ReviewMarketService],
  exports: [ReviewMarketService],
})
export class ReviewMarketModule {}
