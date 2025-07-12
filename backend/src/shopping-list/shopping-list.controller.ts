import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from '../users/dto/user.dto';
import {
  AddToShoppingListDto,
  FinalizePurchaseDto,
  ShoppingListItemResponseDto,
  UpdateShoppingListItemDto,
} from './dto/shopping-list.dto';
import { ShoppingListService } from './shopping-list.service';

@ApiTags('shopping-list')
@Controller('shopping-list')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Post('items')
  @ApiOperation({ summary: 'Adicionar item à lista de compras' })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado com sucesso',
    type: ShoppingListItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  addItem(
    @CurrentUser() user: UserResponseDto,
    @Body() addToShoppingListDto: AddToShoppingListDto,
  ) {
    return this.shoppingListService.addItem(user.id, addToShoppingListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obter lista de compras do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras',
    type: [ShoppingListItemResponseDto],
  })
  getShoppingList(@CurrentUser() user: UserResponseDto) {
    return this.shoppingListService.getShoppingList(user.id);
  }

  @Get('total')
  @ApiOperation({ summary: 'Obter total dos itens selecionados' })
  @ApiResponse({
    status: 200,
    description: 'Total dos itens selecionados',
    schema: {
      properties: {
        total: { type: 'number' },
        itemCount: { type: 'number' },
      },
    },
  })
  getSelectedItemsTotal(@CurrentUser() user: UserResponseDto) {
    return this.shoppingListService.getSelectedItemsTotal(user.id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Atualizar item da lista de compras' })
  @ApiResponse({
    status: 200,
    description: 'Item atualizado com sucesso',
    type: ShoppingListItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  updateItem(
    @CurrentUser() user: UserResponseDto,
    @Param('id') itemId: string,
    @Body() updateDto: UpdateShoppingListItemDto,
  ) {
    return this.shoppingListService.updateItem(user.id, itemId, updateDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remover item da lista de compras' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  removeItem(
    @CurrentUser() user: UserResponseDto,
    @Param('id') itemId: string,
  ) {
    return this.shoppingListService.removeItem(user.id, itemId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpar toda a lista de compras' })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras limpa com sucesso',
  })
  clearShoppingList(@CurrentUser() user: UserResponseDto) {
    return this.shoppingListService.clearShoppingList(user.id);
  }

  @Post('finalize')
  @ApiOperation({ summary: 'Finalizar compra dos itens selecionados' })
  @ApiResponse({
    status: 201,
    description: 'Compra finalizada com sucesso',
    schema: {
      properties: {
        id: { type: 'string' },
        totalCost: { type: 'number' },
        userId: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        purchasedItems: { type: 'array' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Nenhum item selecionado para finalizar compra',
  })
  finalizePurchase(
    @CurrentUser() user: UserResponseDto,
    @Body() finalizePurchaseDto: FinalizePurchaseDto,
  ) {
    return this.shoppingListService.finalizePurchase(
      user.id,
      finalizePurchaseDto,
    );
  }
}
