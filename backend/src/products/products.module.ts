import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MarketProductController } from './market-product.controller';
import { MarketProductService } from './market-product.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController, MarketProductController],
  providers: [ProductsService, MarketProductService],
  exports: [ProductsService, MarketProductService],
})
export class ProductsModule {}
