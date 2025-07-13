import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewMarketDto } from './dto/create-review-market.dto';
import { UpdateReviewMarketDto } from './dto/update-review-market.dto';

@Injectable()
export class ReviewMarketService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewMarketDto: CreateReviewMarketDto, userId: string) {
    // Check if market exists
    const market = await this.prisma.market.findUnique({
      where: { id: createReviewMarketDto.marketId },
    });

    if (!market) {
      throw new NotFoundException('Market not found');
    }

    // Check if user already reviewed this market
    const existingReview = await this.prisma.reviewMarket.findFirst({
      where: {
        marketId: createReviewMarketDto.marketId,
        userId: userId,
      },
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this market');
    }

    return this.prisma.reviewMarket.create({
      data: {
        ...createReviewMarketDto,
        userId,
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

  async findAll() {
    return this.prisma.reviewMarket.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByMarket(marketId: string) {
    // Check if market exists
    const market = await this.prisma.market.findUnique({
      where: { id: marketId },
    });

    if (!market) {
      throw new NotFoundException('Market not found');
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

  async findByUser(userId: string) {
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

  async findOne(id: string) {
    const reviewMarket = await this.prisma.reviewMarket.findUnique({
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

    if (!reviewMarket) {
      throw new NotFoundException('Review not found');
    }

    return reviewMarket;
  }

  async update(
    id: string,
    updateReviewMarketDto: UpdateReviewMarketDto,
    userId: string,
  ) {
    const reviewMarket = await this.prisma.reviewMarket.findUnique({
      where: { id },
    });

    if (!reviewMarket) {
      throw new NotFoundException('Review not found');
    }

    if (reviewMarket.userId !== userId) {
      throw new ConflictException('You can only update your own reviews');
    }

    return this.prisma.reviewMarket.update({
      where: { id },
      data: updateReviewMarketDto,
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

  async remove(id: string, userId: string) {
    const reviewMarket = await this.prisma.reviewMarket.findUnique({
      where: { id },
    });

    if (!reviewMarket) {
      throw new NotFoundException('Review not found');
    }

    if (reviewMarket.userId !== userId) {
      throw new ConflictException('You can only delete your own reviews');
    }

    return this.prisma.reviewMarket.delete({
      where: { id },
    });
  }

  async getMarketAverageRating(marketId: string) {
    const result = await this.prisma.reviewMarket.aggregate({
      where: { marketId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.rating,
    };
  }
}
