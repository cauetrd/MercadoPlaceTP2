import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewMarketDto {
  @ApiProperty({
    description: 'ID of the market being reviewed',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  marketId: string;

  @ApiProperty({
    description: 'Rating given to the market (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Review comment',
    example: 'Great market with excellent service!',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
