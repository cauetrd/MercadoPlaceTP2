import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'market-uuid', description: 'ID do mercado' })
  @IsString()
  marketId: string;

  @ApiProperty({
    example: 5,
    description: 'Nota da avaliação (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: 'Ótimo mercado, produtos frescos!',
    description: 'Comentário da avaliação',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto {
  @ApiPropertyOptional({
    example: 4,
    description: 'Nova nota da avaliação (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    example: 'Mercado bom, mas pode melhorar',
    description: 'Novo comentário da avaliação',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}

export class ReviewResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID único da avaliação' })
  id: string;

  @ApiProperty({ example: 5, description: 'Nota da avaliação' })
  rating: number;

  @ApiPropertyOptional({
    example: 'Ótimo mercado!',
    description: 'Comentário da avaliação',
  })
  comment?: string | null;

  @ApiProperty({
    example: 'user-uuid',
    description: 'ID do usuário que fez a avaliação',
  })
  userId: string;

  @ApiProperty({
    example: 'market-uuid',
    description: 'ID do mercado avaliado',
  })
  marketId: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Dados do usuário' })
  user?: any;

  @ApiPropertyOptional({ description: 'Dados do mercado' })
  market?: any;
}
