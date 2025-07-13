import { ApiProperty } from '@nestjs/swagger';

export class ReviewMarketDto {
  @ApiProperty({
    description: 'Review ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Market ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  marketId: string;

  @ApiProperty({
    description: 'User ID who created the review',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: 'Rating given to the market (1-5)',
    example: 5,
  })
  rating: number;

  @ApiProperty({
    description: 'Review comment',
    example: 'Great market with excellent service!',
    nullable: true,
  })
  comment: string | null;

  @ApiProperty({
    description: 'Date when the review was created',
    example: '2023-12-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the review was last updated',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date;
}
