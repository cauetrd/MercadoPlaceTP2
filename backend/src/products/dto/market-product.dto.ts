import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMarketProductDto {
  @ApiProperty({
    example: 'market-uuid',
    description: 'ID do mercado',
  })
  @IsString()
  marketId: string;

  @ApiProperty({
    example: 'product-uuid',
    description: 'ID do produto',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 15.99,
    description: 'Preço do produto no mercado',
  })
  @IsNumber()
  @Type(() => Number)
  price: number;
}

export class UpdateMarketProductDto {
  @ApiPropertyOptional({
    example: 17.99,
    description: 'Novo preço do produto no mercado',
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Se o produto está válido/aprovado',
  })
  @IsOptional()
  @IsBoolean()
  isValid?: boolean;
}

export class MarketProductResponseDto {
  @ApiProperty({
    example: 'uuid-string',
    description: 'ID único do produto do mercado',
  })
  id: string;

  @ApiProperty({ example: 'market-uuid', description: 'ID do mercado' })
  marketId: string;

  @ApiProperty({ example: 'product-uuid', description: 'ID do produto' })
  productId: string;

  @ApiProperty({
    example: 15.99,
    description: 'Preço atual do produto no mercado',
  })
  price: number;

  @ApiPropertyOptional({
    example: 14.99,
    description: 'Preço anterior do produto',
    nullable: true,
  })
  lastPrice: number | null;

  @ApiProperty({
    example: true,
    description: 'Se o produto está válido/aprovado',
  })
  isValid: boolean;

  @ApiProperty({ description: 'Dados do mercado' })
  market: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };

  @ApiProperty({ description: 'Dados do produto' })
  product: {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
  };
}
