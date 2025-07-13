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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseWithItemsDto } from './dto/purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PurchaseService } from './purchase.service';

@ApiTags('Purchase')
@Controller('purchase')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new purchase' })
  @ApiResponse({
    status: 201,
    description: 'Purchase created successfully',
    type: PurchaseWithItemsDto,
  })
  create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @CurrentUser() user: any,
  ) {
    return this.purchaseService.create(createPurchaseDto, user.id);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all purchases (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all purchases',
    type: [PurchaseWithItemsDto],
  })
  findAll() {
    return this.purchaseService.findAll();
  }

  @Get('my-purchases')
  @ApiOperation({ summary: 'Get current user purchases' })
  @ApiResponse({
    status: 200,
    description: 'List of user purchases',
    type: [PurchaseWithItemsDto],
  })
  findMyPurchases(@CurrentUser() user: any) {
    return this.purchaseService.findByUser(user.id);
  }

  @Get('user/:userId')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get purchases by user ID (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of user purchases',
    type: [PurchaseWithItemsDto],
  })
  findByUser(@Param('userId') userId: string) {
    return this.purchaseService.findByUser(userId);
  }

  @Get('statistics')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get purchase statistics (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Purchase statistics',
    schema: {
      type: 'object',
      properties: {
        totalPurchases: { type: 'number' },
        totalSpent: { type: 'number' },
        totalProducts: { type: 'number' },
      },
    },
  })
  getStatistics() {
    return this.purchaseService.getPurchaseStatistics();
  }

  @Get('my-statistics')
  @ApiOperation({ summary: 'Get current user purchase statistics' })
  @ApiResponse({
    status: 200,
    description: 'User purchase statistics',
    schema: {
      type: 'object',
      properties: {
        totalPurchases: { type: 'number' },
        totalSpent: { type: 'number' },
        totalProducts: { type: 'number' },
      },
    },
  })
  getMyStatistics(@CurrentUser() user: any) {
    return this.purchaseService.getPurchaseStatistics(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase by ID' })
  @ApiResponse({
    status: 200,
    description: 'Purchase found',
    type: PurchaseWithItemsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Purchase not found',
  })
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a purchase (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Purchase updated successfully',
    type: PurchaseWithItemsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Purchase not found',
  })
  update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a purchase (admin only)' })
  @ApiResponse({
    status: 204,
    description: 'Purchase deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Purchase not found',
  })
  remove(@Param('id') id: string) {
    return this.purchaseService.remove(id);
  }
}
