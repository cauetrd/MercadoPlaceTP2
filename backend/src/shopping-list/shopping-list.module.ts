import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ShoppingListCompareService } from './shopping-list-compare.service';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShoppingListController],
  providers: [ShoppingListService, ShoppingListCompareService],
  exports: [ShoppingListService, ShoppingListCompareService],
})
export class ShoppingListModule {}
