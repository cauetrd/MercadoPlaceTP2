import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MarketsModule } from './markets/markets.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PurchasedProductModule } from './purchased-product/purchased-product.module';
import { ReviewMarketModule } from './review-market/review-market.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    MarketsModule,
    ShoppingListModule,
    ReviewMarketModule,
    PurchaseModule,
    PurchasedProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
