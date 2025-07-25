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

  @Post('with-market')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar produto com mercado' })
  @ApiResponse({
    status: 201,
    description: 'Produto e produto-mercado criados com sucesso',
  })
  async createWithMarket(
    @Body()
    createDto: {
      name: string;
      description?: string;
      imageUrl?: string;
      marketId: string;
      price: number;
    },
    @CurrentUser() user: UserResponseDto,
  ) {
    const { marketId, price, ...productData } = createDto;
    return this.productsService.createWithMarketProduct(
      productData,
      marketId,
      price,
      user.id,
      user.isAdmin,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar produtos (com filtros)' })
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
    name: 'userLatitude',
    required: false,
    description: 'Latitude do usuário',
  })
  @ApiQuery({
    name: 'userLongitude',
    required: false,
    description: 'Longitude do usuário',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Campo para ordenação',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Ordem de classificação',
  })
  findAll(@Query() searchDto: ProductSearchDto) {
    return this.productsService.findAll(searchDto);
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
