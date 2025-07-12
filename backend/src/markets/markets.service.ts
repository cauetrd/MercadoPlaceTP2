import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMarketDto,
  MarketResponseDto,
  UpdateMarketDto,
} from './dto/market.dto';

@Injectable()
export class MarketsService {
  constructor(private prisma: PrismaService) {}

  async create(createMarketDto: CreateMarketDto): Promise<MarketResponseDto> {
    const { productIds, ...marketData } = createMarketDto;

    const market = await this.prisma.market.create({
      data: {
        ...marketData,
        availableProducts: productIds
          ? {
              connect: productIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        availableProducts: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return market;
  }

  async findAll(): Promise<MarketResponseDto[]> {
    return this.prisma.market.findMany({
      include: {
        availableProducts: {
          where: { isValid: true },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<MarketResponseDto> {
    const market = await this.prisma.market.findUnique({
      where: { id },
      include: {
        availableProducts: {
          where: { isValid: true },
          include: {
            priceHistory: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    return market;
  }

  async update(
    id: string,
    updateMarketDto: UpdateMarketDto,
  ): Promise<MarketResponseDto> {
    const market = await this.prisma.market.findUnique({ where: { id } });

    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    const { productIds, ...updateData } = updateMarketDto;

    const updatedMarket = await this.prisma.market.update({
      where: { id },
      data: {
        ...updateData,
        availableProducts: productIds
          ? {
              set: productIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        availableProducts: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return updatedMarket;
  }

  async remove(id: string): Promise<void> {
    const market = await this.prisma.market.findUnique({ where: { id } });

    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    await this.prisma.market.delete({ where: { id } });
  }

  async addProduct(
    marketId: string,
    productId: string,
  ): Promise<MarketResponseDto> {
    const market = await this.prisma.market.findUnique({
      where: { id: marketId },
    });
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.market.update({
      where: { id: marketId },
      data: {
        availableProducts: {
          connect: { id: productId },
        },
      },
      include: {
        availableProducts: true,
        reviews: true,
      },
    });
  }

  async removeProduct(
    marketId: string,
    productId: string,
  ): Promise<MarketResponseDto> {
    const market = await this.prisma.market.findUnique({
      where: { id: marketId },
    });

    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    return this.prisma.market.update({
      where: { id: marketId },
      data: {
        availableProducts: {
          disconnect: { id: productId },
        },
      },
      include: {
        availableProducts: true,
        reviews: true,
      },
    });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
  ): Promise<MarketResponseDto[]> {
    // filtro simples baseado em coordenadas
    // Em produção, seria melhor usar uma extensão de geo-localização
    const markets = await this.prisma.market.findMany({
      include: {
        availableProducts: {
          where: { isValid: true },
        },
        reviews: true,
      },
    });

    return markets
      .filter((market) => {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          market.latitude,
          market.longitude,
        );
        return distance <= radiusKm;
      })
      .sort((a, b) => {
        const distanceA = this.calculateDistance(
          latitude,
          longitude,
          a.latitude,
          a.longitude,
        );
        const distanceB = this.calculateDistance(
          latitude,
          longitude,
          b.latitude,
          b.longitude,
        );
        return distanceA - distanceB;
      });
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
