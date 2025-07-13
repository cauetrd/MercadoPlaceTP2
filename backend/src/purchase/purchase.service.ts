import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async create(createPurchaseDto: CreatePurchaseDto, userId: string) {
    const { items, purchaseDate } = createPurchaseDto;

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    // Create purchase with items in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create the purchase
      const purchase = await tx.purchase.create({
        data: {
          userId,
          totalPrice,
          createdAt: purchaseDate ? new Date(purchaseDate) : undefined,
        },
      });

      // Create purchased products
      const purchasedProducts = await Promise.all(
        items.map((item) =>
          tx.purchasedProduct.create({
            data: {
              userId,
              productId: item.productId,
              marketId: item.marketId,
              purchaseId: purchase.id,
              price: item.price,
            },
          }),
        ),
      );

      return {
        ...purchase,
        products: purchasedProducts,
      };
    });
  }

  async findAll() {
    return this.prisma.purchase.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
              },
            },
            market: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
              },
            },
            market: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
              },
            },
            market: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return purchase;
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    const { items, purchaseDate } = updatePurchaseDto;

    if (items && items.length > 0) {
      // Calculate new total price
      const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

      return this.prisma.$transaction(async (tx) => {
        // Delete existing purchased products
        await tx.purchasedProduct.deleteMany({
          where: { purchaseId: id },
        });

        // Create new purchased products
        const purchasedProducts = await Promise.all(
          items.map((item) =>
            tx.purchasedProduct.create({
              data: {
                userId: purchase.userId,
                productId: item.productId,
                marketId: item.marketId,
                purchaseId: id,
                price: item.price,
              },
            }),
          ),
        );

        // Update purchase
        const updatedPurchase = await tx.purchase.update({
          where: { id },
          data: {
            totalPrice,
            ...(purchaseDate && { createdAt: new Date(purchaseDate) }),
          },
        });

        return {
          ...updatedPurchase,
          products: purchasedProducts,
        };
      });
    }

    // If only updating purchase date
    return this.prisma.purchase.update({
      where: { id },
      data: {
        ...(purchaseDate && { createdAt: new Date(purchaseDate) }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
              },
            },
            market: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // Delete purchased products first
      await tx.purchasedProduct.deleteMany({
        where: { purchaseId: id },
      });

      // Delete purchase
      return tx.purchase.delete({
        where: { id },
      });
    });
  }

  async getPurchaseStatistics(userId?: string) {
    const whereClause = userId ? { userId } : {};

    const totalPurchases = await this.prisma.purchase.count({
      where: whereClause,
    });

    const totalSpent = await this.prisma.purchase.aggregate({
      where: whereClause,
      _sum: {
        totalPrice: true,
      },
    });

    const totalProducts = await this.prisma.purchasedProduct.count({
      where: userId ? { purchase: { userId } } : {},
    });

    return {
      totalPurchases,
      totalSpent: totalSpent._sum.totalPrice || 0,
      totalProducts,
    };
  }
}
