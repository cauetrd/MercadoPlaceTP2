import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
    example: 'https://example.com/new-image.jpg',
    description: 'URL da imagem do produto',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Se o produto está válido/aprovado',
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

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'URL da imagem do produto',
  })
  imageUrl?: string | null;

  @ApiProperty({
    example: true,
    description: 'Se o produto está válido/aprovado',
  })
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
    example: -15.7942,
    description: 'Latitude do usuário',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userLatitude?: number;

  @ApiPropertyOptional({
    example: -47.8822,
    description: 'Longitude do usuário',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userLongitude?: number;

  @ApiPropertyOptional({
    example: 'price',
    description: 'Campo para ordenação',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    example: 'asc',
    description: 'Ordem de classificação',
  })
  @IsOptional()
  @IsString()
  sortOrder?: string;
}
