import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePurchasedProductDto } from './dto/create-purchased-product.dto';
import { PurchasedProductDto } from './dto/purchased-product.dto';
import { UpdatePurchasedProductDto } from './dto/update-purchased-product.dto';
import { PurchasedProductService } from './purchased-product.service';

@ApiTags('Purchased Product')
@Controller('purchased-product')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PurchasedProductController {
  constructor(
    private readonly purchasedProductService: PurchasedProductService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchased product record' })
  @ApiResponse({
    status: 201,
    description: 'Purchased product created successfully',
    type: PurchasedProductDto,
  })
  create(
    @Body() createPurchasedProductDto: CreatePurchasedProductDto,
    @CurrentUser() user: any,
  ) {
    return this.purchasedProductService.create(
      createPurchasedProductDto,
      user.id,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all purchased products (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all purchased products',
    type: [PurchasedProductDto],
  })
  findAll() {
    return this.purchasedProductService.findAll();
  }

  @Get('my-purchases')
  @ApiOperation({ summary: 'Get current user purchased products' })
  @ApiResponse({
    status: 200,
    description: 'List of user purchased products',
    type: [PurchasedProductDto],
  })
  findMyPurchases(@CurrentUser() user: any) {
    return this.purchasedProductService.findByUser(user.id);
  }

  @Get('user/:userId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get purchased products by user ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of user purchased products',
    type: [PurchasedProductDto],
  })
  findByUser(@Param('userId') userId: string) {
    return this.purchasedProductService.findByUser(userId);
  }

  @Get('product/:productId')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Get purchased products by product ID (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of purchased products for a specific product',
    type: [PurchasedProductDto],
  })
  findByProduct(@Param('productId') productId: string) {
    return this.purchasedProductService.findByProduct(productId);
  }

  @Get('market/:marketId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get purchased products by market ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of purchased products for a specific market',
    type: [PurchasedProductDto],
  })
  findByMarket(@Param('marketId') marketId: string) {
    return this.purchasedProductService.findByMarket(marketId);
  }

  @Get('purchase/:purchaseId')
  @ApiOperation({ summary: 'Get purchased products by purchase ID' })
  @ApiResponse({
    status: 200,
    description: 'List of purchased products for a specific purchase',
    type: [PurchasedProductDto],
  })
  findByPurchase(@Param('purchaseId') purchaseId: string) {
    return this.purchasedProductService.findByPurchase(purchaseId);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular products based on purchase count' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of products to return',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of popular products',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          product: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              imageUrl: { type: 'string' },
            },
          },
          purchaseCount: { type: 'number' },
        },
      },
    },
  })
  getPopularProducts(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.purchasedProductService.getPopularProducts(limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchased product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Purchased product found',
    type: PurchasedProductDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Purchased product not found',
  })
  findOne(@Param('id') id: string) {
    return this.purchasedProductService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a purchased product (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Purchased product updated successfully',
    type: PurchasedProductDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Purchased product not found',
  })
  update(
    @Param('id') id: string,
    @Body() updatePurchasedProductDto: UpdatePurchasedProductDto,
  ) {
    return this.purchasedProductService.update(id, updatePurchasedProductDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a purchased product (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'Purchased product deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Purchased product not found',
  })
  remove(@Param('id') id: string) {
    return this.purchasedProductService.remove(id);
  }
}
