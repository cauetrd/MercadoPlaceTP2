import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UserResponseDto } from '../users/dto/user.dto';
import {
  CreateMarketProductDto,
  MarketProductResponseDto,
  UpdateMarketProductDto,
} from './dto/market-product.dto';
import { MarketProductService } from './market-product.service';

@ApiTags('market-products')
@Controller('market-products')
export class MarketProductController {
  constructor(private readonly marketProductService: MarketProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo produto em um mercado' })
  @ApiResponse({
    status: 201,
    description: 'Produto do mercado criado com sucesso',
    type: MarketProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Produto já existe neste mercado' })
  @ApiResponse({
    status: 404,
    description: 'Mercado ou produto não encontrado',
  })
  create(@Body() createDto: CreateMarketProductDto) {
    return this.marketProductService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos de mercados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos de mercados',
    type: [MarketProductResponseDto],
  })
  @ApiQuery({
    name: 'marketId',
    required: false,
    description: 'ID do mercado para filtrar',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'ID do produto para filtrar',
  })
  findAll(
    @Query('marketId') marketId?: string,
    @Query('productId') productId?: string,
  ) {
    return this.marketProductService.findAll(marketId, productId);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar produtos de mercados pendentes de aprovação (Admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos de mercados pendentes',
    type: [MarketProductResponseDto],
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findPendingApproval() {
    return this.marketProductService.findPendingApproval();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter produto de mercado por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto de mercado encontrado',
    type: MarketProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto de mercado não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.marketProductService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto de mercado' })
  @ApiResponse({
    status: 200,
    description: 'Produto de mercado atualizado com sucesso',
    type: MarketProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto de mercado não encontrado',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMarketProductDto,
    @CurrentUser() user: UserResponseDto,
  ) {
    return this.marketProductService.update(id, updateDto, user.id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprovar produto de mercado (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Produto de mercado aprovado com sucesso',
    type: MarketProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produto de mercado não encontrado',
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  approve(@Param('id') id: string) {
    return this.marketProductService.approve(id);
  }

  @Delete(':id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reprovar produto de mercado (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Produto de mercado reprovado e removido',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto de mercado não encontrado',
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  reject(@Param('id') id: string) {
    return this.marketProductService.reject(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover produto de mercado (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Produto de mercado removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Produto de mercado não encontrado',
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  remove(@Param('id') id: string) {
    return this.marketProductService.remove(id);
  }
}
