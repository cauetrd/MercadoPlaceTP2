import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchasedProductDto } from './dto/create-purchased-product.dto';
import { UpdatePurchasedProductDto } from './dto/update-purchased-product.dto';

@Injectable()
export class PurchasedProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPurchasedProductDto: CreatePurchasedProductDto,
    userId: string,
  ) {
    return this.prisma.purchasedProduct.create({
      data: {
        ...createPurchasedProductDto,
        userId,
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
        market: {
          select: {
            id: true,
            name: true,
          },
        },
        purchase: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.purchasedProduct.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
        purchase: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.purchasedProduct.findMany({
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
        market: {
          select: {
            id: true,
            name: true,
          },
        },
        purchase: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.purchasedProduct.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        market: {
          select: {
            id: true,
            name: true,
          },
        },
        purchase: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByMarket(marketId: string) {
    return this.prisma.purchasedProduct.findMany({
      where: { marketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
          },
        },
        purchase: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByPurchase(purchaseId: string) {
    return this.prisma.purchasedProduct.findMany({
      where: { purchaseId },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const purchasedProduct = await this.prisma.purchasedProduct.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
        purchase: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
    });

    if (!purchasedProduct) {
      throw new NotFoundException('Purchased product not found');
    }

    return purchasedProduct;
  }

  async update(
    id: string,
    updatePurchasedProductDto: UpdatePurchasedProductDto,
  ) {
    const purchasedProduct = await this.prisma.purchasedProduct.findUnique({
      where: { id },
    });

    if (!purchasedProduct) {
      throw new NotFoundException('Purchased product not found');
    }

    return this.prisma.purchasedProduct.update({
      where: { id },
      data: updatePurchasedProductDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
        purchase: {
          select: {
            id: true,
            totalPrice: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const purchasedProduct = await this.prisma.purchasedProduct.findUnique({
      where: { id },
    });

    if (!purchasedProduct) {
      throw new NotFoundException('Purchased product not found');
    }

    return this.prisma.purchasedProduct.delete({
      where: { id },
    });
  }

  async getPopularProducts(limit: number = 10) {
    const result = await this.prisma.purchasedProduct.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: limit,
    });

    const productIds = result.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
      },
    });

    return result.map((item) => ({
      product: products.find((p) => p.id === item.productId),
      purchaseCount: item._count.productId,
    }));
  }
}
