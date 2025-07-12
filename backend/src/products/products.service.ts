import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  ProductResponseDto,
  ProductSearchDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    userId?: string,
  ): Promise<ProductResponseDto> {
    // Verificar se produto com mesmo nome já existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new BadRequestException('Produto com este nome já existe');
    }

    // Criar histórico de preço inicial
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        priceHistory: {
          create: {
            price: createProductDto.currentPrice,
          },
        },
      },
      include: {
        priceHistory: true,
      },
    });

    // Se o usuário estiver criando o produto, dar pontos
    if (userId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: 1,
          },
        },
      });
    }

    return product;
  }

  async findAll(searchDto?: ProductSearchDto): Promise<ProductResponseDto[]> {
    const { name, sortBy, sortOrder, userLatitude, userLongitude } =
      searchDto || {};

    let where: any = {
      isValid: true, // Só mostrar produtos aprovados
    };

    if (name) {
      where.name = {
        contains: name,
      };
    }

    let orderBy: any = {};

    if (sortBy === 'price') {
      orderBy.currentPrice = sortOrder || 'asc';
    } else if (sortBy === 'name') {
      orderBy.name = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      include: {
        markets: userLatitude && userLongitude ? true : false,
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    // Se tem coordenadas do usuário, ordenar por distância
    if (userLatitude && userLongitude && !sortBy) {
      products.sort((a, b) => {
        const distanceA = this.calculateMinDistance(
          userLatitude,
          userLongitude,
          a.markets,
        );
        const distanceB = this.calculateMinDistance(
          userLatitude,
          userLongitude,
          b.markets,
        );
        return distanceA - distanceB;
      });
    }

    return products;
  }

  async findPendingApproval(): Promise<ProductResponseDto[]> {
    return this.prisma.product.findMany({
      where: { isValid: false },
      include: {
        priceHistory: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
        },
        markets: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId?: string,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    const updateData: any = { ...updateProductDto };

    // Se o preço mudou, criar um novo registro no histórico
    if (
      updateProductDto.currentPrice &&
      updateProductDto.currentPrice !== product.currentPrice
    ) {
      updateData.priceHistory = {
        create: {
          price: updateProductDto.currentPrice,
        },
      };
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        priceHistory: true,
      },
    });

    // Se o usuário estiver atualizando o produto, dar pontos
    if (
      userId &&
      (updateProductDto.currentPrice || updateProductDto.description)
    ) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: 1,
          },
        },
      });
    }

    return updatedProduct;
  }

  async approve(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.prisma.product.update({
      where: { id },
      data: { isValid: true },
    });
  }

  async reject(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.prisma.product.delete({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    await this.prisma.product.delete({ where: { id } });
  }

  async findByMarket(marketId: string): Promise<ProductResponseDto[]> {
    const market = await this.prisma.market.findUnique({
      where: { id: marketId },
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
      },
    });

    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    return market.availableProducts;
  }

  private calculateMinDistance(
    userLat: number,
    userLng: number,
    markets: any[],
  ): number {
    if (!markets || markets.length === 0) return Infinity;

    return Math.min(
      ...markets.map((market) =>
        this.calculateDistance(
          userLat,
          userLng,
          market.latitude,
          market.longitude,
        ),
      ),
    );
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
