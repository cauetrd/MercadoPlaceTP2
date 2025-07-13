import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMarketDto {
  @ApiProperty({
    example: 'Supermercado Central',
    description: 'Nome do mercado',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: -15.7942,
    description: 'Latitude do mercado',
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: -47.8822,
    description: 'Longitude do mercado',
  })
  @IsNumber()
  longitude: number;
}

export class UpdateMarketDto {
  @ApiPropertyOptional({
    example: 'Supermercado Central Premium',
    description: 'Nome do mercado',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: -15.7942,
    description: 'Latitude do mercado',
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({
    example: -47.8822,
    description: 'Longitude do mercado',
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class MarketResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID único do mercado' })
  id: string;

  @ApiProperty({
    example: 'Supermercado Central',
    description: 'Nome do mercado',
  })
  name: string;

  @ApiProperty({
    example: -15.7942,
    description: 'Latitude do mercado',
  })
  latitude: number;

  @ApiProperty({
    example: -47.8822,
    description: 'Longitude do mercado',
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

  @ApiPropertyOptional({
    description: 'Produtos disponíveis no mercado',
    type: 'array',
  })
  products?: any[];

  @ApiPropertyOptional({
    description: 'Avaliações do mercado',
    type: 'array',
  })
  reviews?: any[];
}
