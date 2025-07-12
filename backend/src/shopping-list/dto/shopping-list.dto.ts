import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AddToShoppingListDto {
  @ApiProperty({ example: 'product-uuid', description: 'ID do produto' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateShoppingListItemDto {
  @ApiPropertyOptional({
    example: 3,
    description: 'Nova quantidade do produto',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Se o item está selecionado para compra',
  })
  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;
}

export class ShoppingListItemResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID único do item' })
  id: string;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  quantity: number;

  @ApiProperty({
    example: true,
    description: 'Se o item está selecionado para compra',
  })
  isSelected: boolean;

  @ApiProperty({ example: 'user-uuid', description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ example: 'product-uuid', description: 'ID do produto' })
  productId: string;

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

  @ApiPropertyOptional({ description: 'Dados do produto' })
  product?: any;
}

export class FinalizePurchaseDto {
  @ApiProperty({
    example: ['item-id-1', 'item-id-2'],
    description: 'IDs dos itens selecionados para finalizar compra',
  })
  @IsString({ each: true })
  selectedItemIds: string[];
}
