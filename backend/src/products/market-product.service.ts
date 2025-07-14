import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Market } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMarketProductDto,
  MarketProductResponseDto,
  UpdateMarketProductDto,
} from './dto/market-product.dto';

@Injectable()
export class MarketProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDto: CreateMarketProductDto,
  ): Promise<MarketProductResponseDto> {
    const { marketId, productId, price } = createDto;

    // Verificar se o mercado existe
    const market = await this.prisma.market.findUnique({
      where: { id: marketId },
    });

    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    // Verificar se o produto existe
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se já existe um MarketProduct para este mercado e produto
    const existingMarketProduct = await this.prisma.marketProduct.findUnique({
      where: {
        marketId_productId: {
          marketId,
          productId,
        },
      },
    });

    if (existingMarketProduct) {
      throw new BadRequestException('Produto já existe neste mercado');
    }

    const marketProduct = await this.prisma.marketProduct.create({
      data: {
        marketId,
        productId,
        price,
        isValid: false, // Produtos precisam ser aprovados
      },
      include: {
        market: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
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
      },
    });

    return marketProduct;
  }

  async findAll(
    marketId?: string,
    productId?: string,
  ): Promise<MarketProductResponseDto[]> {
    const where: any = {};

    if (marketId) {
      where.marketId = marketId;
    }

    if (productId) {
      where.productId = productId;
    }

    const marketProducts = await this.prisma.marketProduct.findMany({
      where,
      include: {
        market: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
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
      },
    });

    return marketProducts;
  }

  async findPendingApproval(): Promise<MarketProductResponseDto[]> {
    const marketProducts = await this.prisma.marketProduct.findMany({
      where: {
        isValid: false,
      },
      include: {
        market: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
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
      },
    });

    return marketProducts;
  }

  async findOne(id: string): Promise<MarketProductResponseDto> {
    const marketProduct = await this.prisma.marketProduct.findUnique({
      where: { id },
      include: {
        market: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
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
      },
    });

    if (!marketProduct) {
      throw new NotFoundException('Produto do mercado não encontrado');
    }

    return marketProduct;
  }

  async update(
    id: string,
    updateDto: UpdateMarketProductDto,
    userId?: string,
  ): Promise<MarketProductResponseDto> {
    const marketProduct = await this.prisma.marketProduct.findUnique({
      where: { id },
    });

    if (!marketProduct) {
      throw new NotFoundException('Produto do mercado não encontrado');
    }

    // Se o preço está sendo alterado, salvar o preço anterior
    const updateData: any = { ...updateDto };
    if (updateDto.price && updateDto.price !== marketProduct.price) {
      updateData.lastPrice = marketProduct.price;
    }

    const updated = await this.prisma.marketProduct.update({
      where: { id },
      data: updateData,
      include: {
        market: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
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
      },
    });

    // Se o usuário estiver atualizando o preço, dar pontos
    if (userId && updateDto.price) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: 1,
          },
        },
      });
    }

    return updated;
  }

  async approve(id: string): Promise<MarketProductResponseDto> {
    const marketProduct = await this.prisma.marketProduct.findUnique({
      where: { id },
    });

    if (!marketProduct) {
      throw new NotFoundException('Produto do mercado não encontrado');
    }

    return this.prisma.marketProduct.update({
      where: { id },
      data: { isValid: true },
      include: {
        market: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
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
      },
    });
  }

  async reject(id: string): Promise<void> {
    const marketProduct = await this.prisma.marketProduct.findUnique({
      where: { id },
    });

    if (!marketProduct) {
      throw new NotFoundException('Produto do mercado não encontrado');
    }

    await this.prisma.marketProduct.delete({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const marketProduct = await this.prisma.marketProduct.findUnique({
      where: { id },
    });

    if (!marketProduct) {
      throw new NotFoundException('Produto do mercado não encontrado');
    }

    await this.prisma.marketProduct.delete({ where: { id } });
  }

  async findByProductId(
    productId: string,
  ): Promise<MarketProductResponseDto[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const results = await this.prisma.marketProduct.findMany({
      where: {
        productId,
        isValid: true, // apenas produtos aprovados
      },
      include: {
        market: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
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
      },
    });

    return results;
  }

  async getSubtotalsByMarket(userId: string) {
    // Obtem todos os produtos da lista de compras do usuário
    const userShoppingList = await this.prisma.userShoppingList.findMany({
      where: { userId },
      select: { productId: true },
    });

    const productIds = userShoppingList.map((item) => item.productId);

    if (productIds.length === 0) {
      return [];
    }

    // Busca os MarketProducts válidos com base nesses produtos
    const marketProducts = await this.prisma.marketProduct.findMany({
      where: {
        productId: { in: productIds },
        isValid: true,
      },
      include: {
        market: true,
      },
    });

    // Calcula os subtotais por mercado
    const subtotals: Record<string, { market: Market; total: number }> = {};

    for (const mp of marketProducts) {
      const marketId = mp.marketId;
      if (!subtotals[marketId]) {
        subtotals[marketId] = { market: mp.market, total: 0 };
      }
      subtotals[marketId].total += mp.price;
    }

    // Retorna os resultados como array ordenada pelo total
    return Object.values(subtotals).sort((a, b) => a.total - b.total);
  }

  async getSubtotalsByProductIds(productIds: string[]) {
    if (productIds.length === 0) return [];

    const marketProducts = await this.prisma.marketProduct.findMany({
      where: {
        productId: { in: productIds },
        isValid: true,
      },
      include: {
        market: true,
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

    const grouped: Record<
      string,
      {
        market: Market;
        total: number;
        count: number;
        products: Array<{
          id: string;
          marketProductId: string;
          name: string;
          description: string;
          imageUrl: string;
          price: number;
          lastPrice: number | null;
        }>;
      }
    > = {};

    for (const mp of marketProducts) {
      const marketId = mp.marketId;
      if (!grouped[marketId]) {
        grouped[marketId] = {
          market: mp.market,
          total: 0,
          count: 0,
          products: [],
        };
      }

      grouped[marketId].total += mp.price;
      grouped[marketId].count += 1;
      grouped[marketId].products.push({
        id: mp.product.id,
        marketProductId: mp.id,
        name: mp.product.name,
        description: mp.product.description ?? '',
        imageUrl: mp.product.imageUrl ?? '',
        price: mp.price,
        lastPrice: mp.lastPrice,
      });
    }

    const result = Object.values(grouped)
      .filter((entry) => entry.count === productIds.length) // apenas mercados que têm todos os produtos
      .map((entry) => ({
        market: entry.market,
        total: entry.total,
        products: entry.products,
      }))
      .sort((a, b) => a.total - b.total); // ordenado por total crescente

    return result;
  }
}
