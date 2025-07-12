import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReviewDto,
  ReviewResponseDto,
  UpdateReviewDto,
} from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const { marketId, rating, comment } = createReviewDto;

    // Verificar se o mercado existe
    const market = await this.prisma.market.findUnique({
      where: { id: marketId },
    });
    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    // Verificar se o usuário já avaliou este mercado
    const existingReview = await this.prisma.reviewMarket.findUnique({
      where: {
        userId_marketId: {
          userId,
          marketId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'Você já avaliou este mercado. Use a rota de atualização para modificar sua avaliação.',
      );
    }

    return this.prisma.reviewMarket.create({
      data: {
        userId,
        marketId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        market: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findByMarket(marketId: string): Promise<ReviewResponseDto[]> {
    const market = await this.prisma.market.findUnique({
      where: { id: marketId },
    });
    if (!market) {
      throw new NotFoundException('Mercado não encontrado');
    }

    return this.prisma.reviewMarket.findMany({
      where: { marketId },
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
    });
  }

  async findByUser(userId: string): Promise<ReviewResponseDto[]> {
    return this.prisma.reviewMarket.findMany({
      where: { userId },
      include: {
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

  async findOne(id: string): Promise<ReviewResponseDto> {
    const review = await this.prisma.reviewMarket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        market: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    return review;
  }

  async update(
    userId: string,
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const review = await this.prisma.reviewMarket.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    if (review.userId !== userId) {
      throw new BadRequestException(
        'Você só pode atualizar suas próprias avaliações',
      );
    }

    return this.prisma.reviewMarket.update({
      where: { id },
      data: updateReviewDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        market: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(userId: string, id: string): Promise<void> {
    const review = await this.prisma.reviewMarket.findUnique({ where: { id } });

    if (!review) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    if (review.userId !== userId) {
      throw new BadRequestException(
        'Você só pode remover suas próprias avaliações',
      );
    }

    await this.prisma.reviewMarket.delete({ where: { id } });
  }

  async getMarketAverageRating(
    marketId: string,
  ): Promise<{ averageRating: number; totalReviews: number }> {
    const reviews = await this.prisma.reviewMarket.findMany({
      where: { marketId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Arredondar para 1 casa decimal
      totalReviews: reviews.length,
    };
  }
}
