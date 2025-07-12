import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({ example: 'Supermercado ABC', description: 'Nome do mercado' })
  @IsString()
  name: string;

  @ApiProperty({
    example: -15.7942,
    description: 'Latitude da localização do mercado',
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: -47.8822,
    description: 'Longitude da localização do mercado',
  })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({
    example: ['product-id-1', 'product-id-2'],
    description: 'IDs dos produtos disponíveis no mercado',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}

export class UpdateMarketDto {
  @ApiPropertyOptional({
    example: 'Supermercado ABC Premium',
    description: 'Nome do mercado',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: -15.7942,
    description: 'Latitude da localização do mercado',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    example: -47.8822,
    description: 'Longitude da localização do mercado',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({
    example: ['product-id-1', 'product-id-2'],
    description: 'IDs dos produtos disponíveis no mercado',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}

export class MarketResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID único do mercado' })
  id: string;

  @ApiProperty({ example: 'Supermercado ABC', description: 'Nome do mercado' })
  name: string;

  @ApiProperty({
    example: -15.7942,
    description: 'Latitude da localização do mercado',
  })
  latitude: number;

  @ApiProperty({
    example: -47.8822,
    description: 'Longitude da localização do mercado',
  })
  longitude: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Data de atualização',
  })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Produtos disponíveis no mercado' })
  availableProducts?: any[];

  @ApiPropertyOptional({ description: 'Avaliações do mercado' })
  reviews?: any[];
}
