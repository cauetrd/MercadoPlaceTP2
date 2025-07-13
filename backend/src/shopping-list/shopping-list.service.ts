import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddMultipleToShoppingListDto,
  AddToShoppingListDto,
} from './dto/shopping-list.dto';

@Injectable()
export class ShoppingListService {
  constructor(private prisma: PrismaService) {}

  async addToShoppingList(
    userId: string,
    addToShoppingListDto: AddToShoppingListDto,
  ) {
    const { productId } = addToShoppingListDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Add to shopping list (upsert to avoid duplicates)
    return this.prisma.userShoppingList.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId,
        productId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
          },
        },
      },
    });
  }

  async addMultipleToShoppingList(
    userId: string,
    addMultipleDto: AddMultipleToShoppingListDto,
  ) {
    const { productIds } = addMultipleDto;

    // Check if all products exist
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    // Add all products to shopping list
    const promises = productIds.map((productId) =>
      this.prisma.userShoppingList.upsert({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        update: {},
        create: {
          userId,
          productId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              imageUrl: true,
            },
          },
        },
      }),
    );

    return Promise.all(promises);
  }

  async getShoppingList(userId: string) {
    return this.prisma.userShoppingList.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async removeFromShoppingList(userId: string, productId: string) {
    const item = await this.prisma.userShoppingList.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found in shopping list');
    }

    return this.prisma.userShoppingList.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async clearShoppingList(userId: string) {
    return this.prisma.userShoppingList.deleteMany({
      where: { userId },
    });
  }
}
