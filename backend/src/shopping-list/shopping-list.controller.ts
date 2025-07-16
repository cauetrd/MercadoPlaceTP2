import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddMultipleToShoppingListDto,
  AddToShoppingListDto,
  CompareShoppingListDto,
} from './dto/shopping-list.dto';
import { ShoppingListCompareService } from './shopping-list-compare.service';
import { ShoppingListService } from './shopping-list.service';

@ApiTags('Shopping List')
@Controller('shopping-list')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShoppingListController {
  constructor(
    private readonly shoppingListService: ShoppingListService,
    private readonly shoppingListCompareService: ShoppingListCompareService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add product to shopping list' })
  @ApiResponse({
    status: 201,
    description: 'Product added to shopping list successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  addToShoppingList(
    @Body() addToShoppingListDto: AddToShoppingListDto,
    @CurrentUser() user: any,
  ) {
    return this.shoppingListService.addToShoppingList(
      user.id,
      addToShoppingListDto,
    );
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Add multiple products to shopping list' })
  @ApiResponse({
    status: 201,
    description: 'Products added to shopping list successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'One or more products not found',
  })
  addMultipleToShoppingList(
    @Body() addMultipleDto: AddMultipleToShoppingListDto,
    @CurrentUser() user: any,
  ) {
    return this.shoppingListService.addMultipleToShoppingList(
      user.id,
      addMultipleDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user shopping list' })
  @ApiResponse({
    status: 200,
    description: 'User shopping list retrieved successfully',
  })
  getShoppingList(@CurrentUser() user: any) {
    return this.shoppingListService.getShoppingList(user.id);
  }

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Compare prices for products in shopping list' })
  @ApiResponse({
    status: 200,
    description: 'Price comparison completed successfully',
  })
  async compareShoppingList(
    @Body() compareDto: CompareShoppingListDto,
    @CurrentUser() user: any,
  ) {
    const userInfo = await this.shoppingListService.getShoppingList(user.id);
    const userLocation = await this.getUserLocation(user.id);

    return this.shoppingListCompareService.compareMarketPrices(
      compareDto.productIds,
      userLocation?.latitude || undefined,
      userLocation?.longitude || undefined,
    );
  }

  private async getUserLocation(userId: string) {
    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { latitude: true, longitude: true },
    });
    return userData;
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove product from shopping list' })
  @ApiResponse({
    status: 204,
    description: 'Product removed from shopping list successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found in shopping list',
  })
  removeFromShoppingList(
    @Param('productId') productId: string,
    @CurrentUser() user: any,
  ) {
    return this.shoppingListService.removeFromShoppingList(user.id, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear shopping list' })
  @ApiResponse({
    status: 204,
    description: 'Shopping list cleared successfully',
  })
  clearShoppingList(@CurrentUser() user: any) {
    return this.shoppingListService.clearShoppingList(user.id);
  }
}
