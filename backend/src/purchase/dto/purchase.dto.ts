import { ApiProperty } from '@nestjs/swagger';

export class PurchaseDto {
  @ApiProperty({
    description: 'Purchase ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who made the purchase',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Total price of the purchase',
    example: 45.5,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Date when the purchase was created',
    example: '2023-12-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the purchase was last updated',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date;
}

export class PurchaseItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  productId: string;

  @ApiProperty({
    description: 'Market ID where the product was purchased',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  marketId: string;

  @ApiProperty({
    description: 'Purchase ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  purchaseId: string;

  @ApiProperty({
    description: 'Price per unit at the time of purchase',
    example: 10.5,
  })
  price: number;

  @ApiProperty({
    description: 'Date when the product was purchased',
    example: '2023-12-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the product was last updated',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date;
}

export class PurchaseWithItemsDto extends PurchaseDto {
  @ApiProperty({
    description: 'List of purchased products',
    type: [PurchaseItemDto],
  })
  products: PurchaseItemDto[];

  @ApiProperty({
    description: 'List of purchased products (alias for compatibility)',
    type: [PurchaseItemDto],
  })
  purchasedProducts?: PurchaseItemDto[];
}
