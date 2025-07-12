import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Arroz Integral 1kg',
    description: 'Nome do produto',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'Arroz integral orgânico de alta qualidade',
    description: 'Descrição do produto',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 15.99, description: 'Preço atual do produto' })
  @IsNumber()
  currentPrice: number;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'URL da imagem do produto',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    example: 'Arroz Integral 1kg Premium',
    description: 'Nome do produto',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Arroz integral orgânico premium',
    description: 'Descrição do produto',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 17.99,
    description: 'Preço atual do produto',
  })
  @IsOptional()
  @IsNumber()
  currentPrice?: number;

  @ApiPropertyOptional({
    example: 'https://example.com/new-image.jpg',
    description: 'URL da imagem do produto',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Se o produto é válido/aprovado',
  })
  @IsOptional()
  @IsBoolean()
  isValid?: boolean;
}

export class ProductResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID único do produto' })
  id: string;

  @ApiProperty({
    example: 'Arroz Integral 1kg',
    description: 'Nome do produto',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Arroz integral orgânico de alta qualidade',
    description: 'Descrição do produto',
  })
  description?: string | null;

  @ApiProperty({ example: 15.99, description: 'Preço atual do produto' })
  currentPrice: number;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'URL da imagem do produto',
  })
  imageUrl?: string | null;

  @ApiProperty({ example: true, description: 'Se o produto é válido/aprovado' })
  isValid: boolean;

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
}

export class ProductSearchDto {
  @ApiPropertyOptional({
    example: 'arroz',
    description: 'Nome do produto para buscar',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'price',
    description: 'Campo para ordenação (price, name)',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'name';

  @ApiPropertyOptional({ example: 'asc', description: 'Direção da ordenação' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({
    example: -15.7942,
    description: 'Latitude para ordenação por distância',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  userLatitude?: number;

  @ApiPropertyOptional({
    example: -47.8822,
    description: 'Longitude para ordenação por distância',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  userLongitude?: number;
}
