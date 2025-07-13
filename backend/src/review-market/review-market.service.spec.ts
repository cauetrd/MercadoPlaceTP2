import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewMarketService } from './review-market.service';

describe('ReviewMarketService', () => {
  let service: ReviewMarketService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    reviewMarket: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      aggregate: jest.fn(),
    },
    market: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewMarketService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReviewMarketService>(ReviewMarketService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new review', async () => {
      const createReviewMarketDto = {
        marketId: '1',
        rating: 5,
        comment: 'Great market!',
      };

      const market = { id: '1', name: 'Test Market' };
      const expectedReview = {
        id: '1',
        marketId: '1',
        userId: 'user1',
        rating: 5,
        comment: 'Great market!',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.market.findUnique.mockResolvedValue(market);
      mockPrismaService.reviewMarket.findFirst.mockResolvedValue(null);
      mockPrismaService.reviewMarket.create.mockResolvedValue(expectedReview);

      const result = await service.create(createReviewMarketDto, 'user1');

      expect(result).toEqual(expectedReview);
      expect(mockPrismaService.reviewMarket.create).toHaveBeenCalledWith({
        data: {
          ...createReviewMarketDto,
          userId: 'user1',
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
    });

    it('should throw NotFoundException if market not found', async () => {
      const createReviewMarketDto = {
        marketId: '1',
        rating: 5,
        comment: 'Great market!',
      };

      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(
        service.create(createReviewMarketDto, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if user already reviewed the market', async () => {
      const createReviewMarketDto = {
        marketId: '1',
        rating: 5,
        comment: 'Great market!',
      };

      const market = { id: '1', name: 'Test Market' };
      const existingReview = { id: '1', marketId: '1', userId: 'user1' };

      mockPrismaService.market.findUnique.mockResolvedValue(market);
      mockPrismaService.reviewMarket.findFirst.mockResolvedValue(
        existingReview,
      );

      await expect(
        service.create(createReviewMarketDto, 'user1'),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all reviews', async () => {
      const expectedReviews = [
        {
          id: '1',
          marketId: '1',
          userId: 'user1',
          rating: 5,
          comment: 'Great market!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.reviewMarket.findMany.mockResolvedValue(
        expectedReviews,
      );

      const result = await service.findAll();

      expect(result).toEqual(expectedReviews);
      expect(mockPrismaService.reviewMarket.findMany).toHaveBeenCalledWith({
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
    });
  });

  describe('findByMarket', () => {
    it('should return reviews for a specific market', async () => {
      const market = { id: '1', name: 'Test Market' };
      const expectedReviews = [
        {
          id: '1',
          marketId: '1',
          userId: 'user1',
          rating: 5,
          comment: 'Great market!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.market.findUnique.mockResolvedValue(market);
      mockPrismaService.reviewMarket.findMany.mockResolvedValue(
        expectedReviews,
      );

      const result = await service.findByMarket('1');

      expect(result).toEqual(expectedReviews);
      expect(mockPrismaService.reviewMarket.findMany).toHaveBeenCalledWith({
        where: { marketId: '1' },
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
    });

    it('should throw NotFoundException if market not found', async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.findByMarket('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUser', () => {
    it('should return reviews by a specific user', async () => {
      const expectedReviews = [
        {
          id: '1',
          marketId: '1',
          userId: 'user1',
          rating: 5,
          comment: 'Great market!',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.reviewMarket.findMany.mockResolvedValue(
        expectedReviews,
      );

      const result = await service.findByUser('user1');

      expect(result).toEqual(expectedReviews);
      expect(mockPrismaService.reviewMarket.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
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
    });
  });

  describe('findOne', () => {
    it('should return a review by id', async () => {
      const expectedReview = {
        id: '1',
        marketId: '1',
        userId: 'user1',
        rating: 5,
        comment: 'Great market!',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.reviewMarket.findUnique.mockResolvedValue(
        expectedReview,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(expectedReview);
      expect(mockPrismaService.reviewMarket.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
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
    });

    it('should throw NotFoundException if review not found', async () => {
      mockPrismaService.reviewMarket.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const updateReviewMarketDto = {
        rating: 4,
        comment: 'Updated comment',
      };

      const existingReview = {
        id: '1',
        marketId: '1',
        userId: 'user1',
        rating: 5,
        comment: 'Great market!',
      };

      const updatedReview = {
        id: '1',
        marketId: '1',
        userId: 'user1',
        rating: 4,
        comment: 'Updated comment',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.reviewMarket.findUnique.mockResolvedValue(
        existingReview,
      );
      mockPrismaService.reviewMarket.update.mockResolvedValue(updatedReview);

      const result = await service.update('1', updateReviewMarketDto, 'user1');

      expect(result).toEqual(updatedReview);
      expect(mockPrismaService.reviewMarket.update).toHaveBeenCalledWith({
        where: { id: '1' },
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
    });

    it('should throw NotFoundException if review not found', async () => {
      mockPrismaService.reviewMarket.findUnique.mockResolvedValue(null);

      await expect(service.update('1', {}, 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw ConflictException if user tries to update another user's review", async () => {
      const existingReview = {
        id: '1',
        marketId: '1',
        userId: 'user1',
        rating: 5,
        comment: 'Great market!',
      };

      mockPrismaService.reviewMarket.findUnique.mockResolvedValue(
        existingReview,
      );

      await expect(service.update('1', {}, 'user2')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const existingReview = {
        id: '1',
        marketId: '1',
        userId: 'user1',
        rating: 5,
        comment: 'Great market!',
      };

      mockPrismaService.reviewMarket.findUnique.mockResolvedValue(
        existingReview,
      );
      mockPrismaService.reviewMarket.delete.mockResolvedValue(existingReview);

      await service.remove('1', 'user1');

      expect(mockPrismaService.reviewMarket.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if review not found', async () => {
      mockPrismaService.reviewMarket.findUnique.mockResolvedValue(null);

      await expect(service.remove('1', 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw ConflictException if user tries to delete another user's review", async () => {
      const existingReview = {
        id: '1',
        marketId: '1',
        userId: 'user1',
        rating: 5,
        comment: 'Great market!',
      };

      mockPrismaService.reviewMarket.findUnique.mockResolvedValue(
        existingReview,
      );

      await expect(service.remove('1', 'user2')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getMarketAverageRating', () => {
    it('should return average rating and total reviews for a market', async () => {
      const aggregateResult = {
        _avg: {
          rating: 4.5,
        },
        _count: {
          rating: 10,
        },
      };

      mockPrismaService.reviewMarket.aggregate.mockResolvedValue(
        aggregateResult,
      );

      const result = await service.getMarketAverageRating('1');

      expect(result).toEqual({
        averageRating: 4.5,
        totalReviews: 10,
      });
      expect(mockPrismaService.reviewMarket.aggregate).toHaveBeenCalledWith({
        where: { marketId: '1' },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });
    });

    it('should return 0 for average rating if no reviews', async () => {
      const aggregateResult = {
        _avg: {
          rating: null,
        },
        _count: {
          rating: 0,
        },
      };

      mockPrismaService.reviewMarket.aggregate.mockResolvedValue(
        aggregateResult,
      );

      const result = await service.getMarketAverageRating('1');

      expect(result).toEqual({
        averageRating: 0,
        totalReviews: 0,
      });
    });
  });
});
