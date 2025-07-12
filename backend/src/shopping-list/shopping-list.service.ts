import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddToShoppingListDto,
  FinalizePurchaseDto,
  ShoppingListItemResponseDto,
  UpdateShoppingListItemDto,
} from './dto/shopping-list.dto';

@Injectable()
export class ShoppingListService {
  constructor(private prisma: PrismaService) {}

  async addItem(
    userId: string,
    addToShoppingListDto: AddToShoppingListDto,
  ): Promise<ShoppingListItemResponseDto> {
    const { productId, quantity } = addToShoppingListDto;

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se o item já existe na lista
    const existingItem = await this.prisma.itemListaDeCompra.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Se já existe, atualizar a quantidade
      return this.prisma.itemListaDeCompra.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });
    }

    // Se não existe, criar novo item
    return this.prisma.itemListaDeCompra.create({
      data: {
        userId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async getShoppingList(
    userId: string,
  ): Promise<ShoppingListItemResponseDto[]> {
    return this.prisma.itemListaDeCompra.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            priceHistory: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateItem(
    userId: string,
    itemId: string,
    updateDto: UpdateShoppingListItemDto,
  ): Promise<ShoppingListItemResponseDto> {
    const item = await this.prisma.itemListaDeCompra.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado na lista de compras');
    }

    return this.prisma.itemListaDeCompra.update({
      where: { id: itemId },
      data: updateDto,
      include: {
        product: true,
      },
    });
  }

  async removeItem(userId: string, itemId: string): Promise<void> {
    const item = await this.prisma.itemListaDeCompra.findFirst({
      where: {
        id: itemId,
        userId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item não encontrado na lista de compras');
    }

    await this.prisma.itemListaDeCompra.delete({
      where: { id: itemId },
    });
  }

  async clearShoppingList(userId: string): Promise<void> {
    await this.prisma.itemListaDeCompra.deleteMany({
      where: { userId },
    });
  }

  async finalizePurchase(
    userId: string,
    finalizePurchaseDto: FinalizePurchaseDto,
  ) {
    const { selectedItemIds } = finalizePurchaseDto;

    if (!selectedItemIds || selectedItemIds.length === 0) {
      throw new BadRequestException(
        'Nenhum item selecionado para finalizar compra',
      );
    }

    // Buscar os itens selecionados
    const selectedItems = await this.prisma.itemListaDeCompra.findMany({
      where: {
        id: { in: selectedItemIds },
        userId,
        isSelected: true,
      },
      include: {
        product: true,
      },
    });

    if (selectedItems.length === 0) {
      throw new BadRequestException('Nenhum item válido selecionado');
    }

    // Calcular o total
    const totalCost = selectedItems.reduce((total, item) => {
      return total + item.product.currentPrice * item.quantity;
    }, 0);

    // Criar a compra finalizada
    const purchase = await this.prisma.compraFinalizada.create({
      data: {
        userId,
        totalCost,
        purchasedItems: {
          create: selectedItems.map((item) => ({
            productName: item.product.name,
            priceAtTime: item.product.currentPrice,
            quantity: item.quantity,
            productId: item.product.id,
          })),
        },
      },
      include: {
        purchasedItems: true,
      },
    });

    // Remover os itens finalizados da lista de compras
    await this.prisma.itemListaDeCompra.deleteMany({
      where: {
        id: { in: selectedItemIds },
        userId,
      },
    });

    return purchase;
  }

  async getSelectedItemsTotal(
    userId: string,
  ): Promise<{ total: number; itemCount: number }> {
    const selectedItems = await this.prisma.itemListaDeCompra.findMany({
      where: {
        userId,
        isSelected: true,
      },
      include: {
        product: true,
      },
    });

    const total = selectedItems.reduce((sum, item) => {
      return sum + item.product.currentPrice * item.quantity;
    }, 0);

    return {
      total,
      itemCount: selectedItems.length,
    };
  }
}
