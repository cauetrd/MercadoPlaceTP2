import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePurchaseItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Market ID where the product was purchased',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  marketId: string;

  @ApiProperty({
    description: 'Price per unit at the time of purchase',
    example: 10.5,
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreatePurchaseDto {
  @ApiProperty({
    description: 'List of items in the purchase',
    type: [CreatePurchaseItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items: CreatePurchaseItemDto[];

  @ApiProperty({
    description: 'Purchase date',
    example: '2023-12-01T10:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  purchaseDate?: string;
}
