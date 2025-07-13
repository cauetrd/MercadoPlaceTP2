import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface MarketPriceComparison {
  market: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
  products: {
    [productId: string]: {
      price: number;
      name: string;
      available: boolean;
    };
  };
  subtotal: number;
  distance?: number;
}

@Injectable()
export class ShoppingListCompareService {
  constructor(private prisma: PrismaService) {}

  async compareMarketPrices(
    productIds: string[],
    userLatitude?: number,
    userLongitude?: number,
  ): Promise<MarketPriceComparison[]> {
    // Buscar todos os produtos solicitados
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        marketProducts: {
          where: {
            isValid: true,
          },
          include: {
            market: true,
          },
        },
      },
    });

    if (products.length === 0) {
      throw new NotFoundException('Nenhum produto encontrado');
    }

    // Agrupar por mercado
    const marketMap = new Map<string, MarketPriceComparison>();

    products.forEach((product) => {
      product.marketProducts.forEach((marketProduct) => {
        const marketId = marketProduct.market.id;

        if (!marketMap.has(marketId)) {
          marketMap.set(marketId, {
            market: {
              id: marketProduct.market.id,
              name: marketProduct.market.name,
              latitude: marketProduct.market.latitude,
              longitude: marketProduct.market.longitude,
            },
            products: {},
            subtotal: 0,
            distance:
              userLatitude && userLongitude
                ? this.calculateDistance(
                    userLatitude,
                    userLongitude,
                    marketProduct.market.latitude,
                    marketProduct.market.longitude,
                  )
                : undefined,
          });
        }

        const marketComparison = marketMap.get(marketId)!;
        marketComparison.products[product.id] = {
          price: marketProduct.price,
          name: product.name,
          available: true,
        };
      });
    });

    // Adicionar produtos não disponíveis e calcular subtotal
    const result: MarketPriceComparison[] = [];

    marketMap.forEach((marketComparison) => {
      // Verificar se todos os produtos estão disponíveis
      productIds.forEach((productId) => {
        if (!marketComparison.products[productId]) {
          const product = products.find((p) => p.id === productId);
          if (product) {
            marketComparison.products[productId] = {
              price: 0,
              name: product.name,
              available: false,
            };
          }
        }
      });

      // Calcular subtotal apenas dos produtos disponíveis
      marketComparison.subtotal = Object.values(marketComparison.products)
        .filter((product) => product.available)
        .reduce((sum, product) => sum + product.price, 0);

      result.push(marketComparison);
    });

    // Ordenar por preço crescente e depois por distância
    result.sort((a, b) => {
      // Primeiro por número de produtos disponíveis (mais produtos disponíveis primeiro)
      const aAvailable = Object.values(a.products).filter(
        (p) => p.available,
      ).length;
      const bAvailable = Object.values(b.products).filter(
        (p) => p.available,
      ).length;

      if (aAvailable !== bAvailable) {
        return bAvailable - aAvailable;
      }

      // Depois por preço (apenas para mercados com todos os produtos disponíveis)
      if (
        aAvailable === productIds.length &&
        bAvailable === productIds.length
      ) {
        if (a.subtotal !== b.subtotal) {
          return a.subtotal - b.subtotal;
        }
      }

      // Por último por distância
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }

      return 0;
    });

    return result;
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
