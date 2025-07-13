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
    const market = await this.prisma.market.create({
      data: createMarketDto,
    });

    return market;
  }

  async findAll(): Promise<MarketResponseDto[]> {
    return this.prisma.market.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
  ): Promise<MarketResponseDto[]> {
    // Buscar todos os mercados e filtrar por distância
    const markets = await this.prisma.market.findMany();

    const nearbyMarkets = markets
      .map((market) => ({
        ...market,
        distance: this.calculateDistance(
          latitude,
          longitude,
          market.latitude,
          market.longitude,
        ),
      }))
      .filter((market) => market.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);

    return nearbyMarkets;
  }

  async findOne(id: string): Promise<MarketResponseDto> {
    const market = await this.prisma.market.findUnique({
      where: { id },
      include: {
        products: {
          where: { isValid: true },
          include: {
            product: true,
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

    const updatedMarket = await this.prisma.market.update({
      where: { id },
      data: updateMarketDto,
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

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
