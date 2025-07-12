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
  CreateProductDto,
  ProductResponseDto,
  ProductSearchDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Produto com este nome já existe' })
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: UserResponseDto,
  ) {
    return this.productsService.create(createProductDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos (com filtros e ordenação)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos',
    type: [ProductResponseDto],
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nome do produto para buscar',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['price', 'name'],
    description: 'Campo para ordenação',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Direção da ordenação',
  })
  @ApiQuery({
    name: 'userLatitude',
    required: false,
    type: Number,
    description: 'Latitude para ordenação por distância',
  })
  @ApiQuery({
    name: 'userLongitude',
    required: false,
    type: Number,
    description: 'Longitude para ordenação por distância',
  })
  findAll(@Query() searchDto: ProductSearchDto) {
    return this.productsService.findAll(searchDto);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar produtos pendentes de aprovação (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos pendentes',
    type: [ProductResponseDto],
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findPendingApproval() {
    return this.productsService.findPendingApproval();
  }

  @Get('market/:marketId')
  @ApiOperation({ summary: 'Listar produtos de um mercado específico' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos do mercado',
    type: [ProductResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Mercado não encontrado' })
  findByMarket(@Param('marketId') marketId: string) {
    return this.productsService.findByMarket(marketId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter produto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @CurrentUser() user: UserResponseDto,
  ) {
    return this.productsService.update(id, updateProductDto, user.id);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprovar produto (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Produto aprovado com sucesso',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  approve(@Param('id') id: string) {
    return this.productsService.approve(id);
  }

  @Delete(':id/reject')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reprovar produto (Admin)' })
  @ApiResponse({ status: 200, description: 'Produto reprovado e removido' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  reject(@Param('id') id: string) {
    return this.productsService.reject(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover produto (Admin)' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
