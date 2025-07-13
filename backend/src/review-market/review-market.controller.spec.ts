import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReviewMarketController } from './review-market.controller';
import { ReviewMarketService } from './review-market.service';

describe('ReviewMarketController', () => {
  let controller: ReviewMarketController;
  let service: ReviewMarketService;

  const mockReviewMarketService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByMarket: jest.fn(),
    findByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getMarketAverageRating: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewMarketController],
      providers: [
        {
          provide: ReviewMarketService,
          useValue: mockReviewMarketService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<ReviewMarketController>(ReviewMarketController);
    service = module.get<ReviewMarketService>(ReviewMarketService);
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

      const expectedReview = {
        id: '1',
        marketId: '1',
        userId: 'user1',
        rating: 5,
        comment: 'Great market!',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const user = { id: 'user1', name: 'Test User' };

      mockReviewMarketService.create.mockResolvedValue(expectedReview);

      const result = await controller.create(createReviewMarketDto, user);

      expect(result).toEqual(expectedReview);
      expect(mockReviewMarketService.create).toHaveBeenCalledWith(
        createReviewMarketDto,
        user.id,
      );
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

      mockReviewMarketService.findAll.mockResolvedValue(expectedReviews);

      const result = await controller.findAll();

      expect(result).toEqual(expectedReviews);
      expect(mockReviewMarketService.findAll).toHaveBeenCalled();
    });
  });

  describe('findByMarket', () => {
    it('should return reviews for a specific market', async () => {
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

      mockReviewMarketService.findByMarket.mockResolvedValue(expectedReviews);

      const result = await controller.findByMarket('1');

      expect(result).toEqual(expectedReviews);
      expect(mockReviewMarketService.findByMarket).toHaveBeenCalledWith('1');
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

      mockReviewMarketService.findByUser.mockResolvedValue(expectedReviews);

      const result = await controller.findByUser('user1');

      expect(result).toEqual(expectedReviews);
      expect(mockReviewMarketService.findByUser).toHaveBeenCalledWith('user1');
    });
  });

  describe('getMarketAverageRating', () => {
    it('should return average rating for a market', async () => {
      const expectedResult = {
        averageRating: 4.5,
        totalReviews: 10,
      };

      mockReviewMarketService.getMarketAverageRating.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getMarketAverageRating('1');

      expect(result).toEqual(expectedResult);
      expect(
        mockReviewMarketService.getMarketAverageRating,
      ).toHaveBeenCalledWith('1');
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

      mockReviewMarketService.findOne.mockResolvedValue(expectedReview);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedReview);
      expect(mockReviewMarketService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const updateReviewMarketDto = {
        rating: 4,
        comment: 'Updated comment',
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

      const user = { id: 'user1', name: 'Test User' };

      mockReviewMarketService.update.mockResolvedValue(updatedReview);

      const result = await controller.update('1', updateReviewMarketDto, user);

      expect(result).toEqual(updatedReview);
      expect(mockReviewMarketService.update).toHaveBeenCalledWith(
        '1',
        updateReviewMarketDto,
        user.id,
      );
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const user = { id: 'user1', name: 'Test User' };

      await controller.remove('1', user);

      expect(mockReviewMarketService.remove).toHaveBeenCalledWith('1', user.id);
    });
  });
});
