import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PurchasedProductController } from './purchased-product.controller';
import { PurchasedProductService } from './purchased-product.service';

@Module({
  imports: [PrismaModule],
  controllers: [PurchasedProductController],
  providers: [PurchasedProductService],
  exports: [PurchasedProductService],
})
export class PurchasedProductModule {}
