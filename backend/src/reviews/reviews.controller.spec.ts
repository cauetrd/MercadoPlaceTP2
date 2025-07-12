import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from '../users/dto/user.dto';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let service: ReviewsService;

  const mockReviewsService = {
    create: jest.fn(),
    findByMarket: jest.fn(),
    getMarketAverageRating: jest.fn(),
    findByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: UserResponseDto = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    isAdmin: false,
    latitude: -15.7942,
    longitude: -47.8822,
    points: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockReview = {
    id: '1',
    userId: '1',
    marketId: '1',
    rating: 5,
    comment: 'Great market!',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a review', async () => {
      const createReviewDto: CreateReviewDto = {
        marketId: '1',
        rating: 5,
        comment: 'Great market!',
      };

      mockReviewsService.create.mockResolvedValue(mockReview);
      const result = await controller.create(mockUser, createReviewDto);
      expect(result).toEqual(mockReview);
      expect(mockReviewsService.create).toHaveBeenCalledWith(
        mockUser.id,
        createReviewDto,
      );
    });
  });

  describe('findByMarket', () => {
    it('should return reviews for a market', async () => {
      const reviews = [mockReview];
      mockReviewsService.findByMarket.mockResolvedValue(reviews);
      const result = await controller.findByMarket('1');
      expect(result).toEqual(reviews);
      expect(mockReviewsService.findByMarket).toHaveBeenCalledWith('1');
    });
  });

  describe('getMarketAverageRating', () => {
    it('should return market rating', async () => {
      const rating = { averageRating: 4.5, totalReviews: 10 };
      mockReviewsService.getMarketAverageRating.mockResolvedValue(rating);
      const result = await controller.getMarketAverageRating('1');
      expect(result).toEqual(rating);
      expect(mockReviewsService.getMarketAverageRating).toHaveBeenCalledWith(
        '1',
      );
    });
  });

  describe('findByUser', () => {
    it('should return reviews by user', async () => {
      const reviews = [mockReview];
      mockReviewsService.findByUser.mockResolvedValue(reviews);
      const result = await controller.findByUser(mockUser);
      expect(result).toEqual(reviews);
      expect(mockReviewsService.findByUser).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findOne', () => {
    it('should return a review by id', async () => {
      mockReviewsService.findOne.mockResolvedValue(mockReview);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockReview);
      expect(mockReviewsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const updateReviewDto: UpdateReviewDto = {
        rating: 4,
        comment: 'Good market!',
      };
      const updatedReview = { ...mockReview, ...updateReviewDto };

      mockReviewsService.update.mockResolvedValue(updatedReview);
      const result = await controller.update(mockUser, '1', updateReviewDto);
      expect(result).toEqual(updatedReview);
      expect(mockReviewsService.update).toHaveBeenCalledWith(
        mockUser.id,
        '1',
        updateReviewDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      mockReviewsService.remove.mockResolvedValue(undefined);
      const result = await controller.remove(mockUser, '1');
      expect(result).toBeUndefined();
      expect(mockReviewsService.remove).toHaveBeenCalledWith(mockUser.id, '1');
    });
  });
});
