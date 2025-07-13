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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateMarketDto,
  MarketResponseDto,
  UpdateMarketDto,
} from './dto/market.dto';
import { MarketsService } from './markets.service';

@ApiTags('markets')
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar um novo mercado (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Mercado criado com sucesso',
    type: MarketResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  create(@Body() createMarketDto: CreateMarketDto) {
    return this.marketsService.create(createMarketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os mercados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mercados',
    type: [MarketResponseDto],
  })
  findAll() {
    return this.marketsService.findAll();
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Buscar mercados próximos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de mercados próximos',
    type: [MarketResponseDto],
  })
  @ApiQuery({
    name: 'latitude',
    type: Number,
    description: 'Latitude da localização',
  })
  @ApiQuery({
    name: 'longitude',
    type: Number,
    description: 'Longitude da localização',
  })
  @ApiQuery({
    name: 'radius',
    type: Number,
    required: false,
    description: 'Raio em km (padrão: 10)',
  })
  findNearby(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
  ) {
    return this.marketsService.findNearby(latitude, longitude, radius);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter mercado por ID' })
  @ApiResponse({
    status: 200,
    description: 'Mercado encontrado',
    type: MarketResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Mercado não encontrado' })
  findOne(@Param('id') id: string) {
    return this.marketsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar mercado (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Mercado atualizado com sucesso',
    type: MarketResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Mercado não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(@Param('id') id: string, @Body() updateMarketDto: UpdateMarketDto) {
    return this.marketsService.update(id, updateMarketDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover mercado (Admin)' })
  @ApiResponse({ status: 200, description: 'Mercado removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Mercado não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  remove(@Param('id') id: string) {
    return this.marketsService.remove(id);
  }
}
