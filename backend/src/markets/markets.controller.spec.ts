import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from '../users/dto/user.dto';
import { CreateMarketDto, UpdateMarketDto } from './dto/market.dto';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';

describe('MarketsController', () => {
  let controller: MarketsController;
  let service: MarketsService;

  const mockMarketsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findNearby: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addProduct: jest.fn(),
    removeProduct: jest.fn(),
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

  const mockMarket = {
    id: '1',
    name: 'Test Market',
    description: 'A test market',
    latitude: -15.7942,
    longitude: -47.8822,
    address: '123 Test Street',
    phone: '(11) 99999-9999',
    imageUrl: 'http://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketsController],
      providers: [
        {
          provide: MarketsService,
          useValue: mockMarketsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MarketsController>(MarketsController);
    service = module.get<MarketsService>(MarketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a market', async () => {
      const createMarketDto: CreateMarketDto = {
        name: 'New Market',
        latitude: -15.7942,
        longitude: -47.8822,
      };

      mockMarketsService.create.mockResolvedValue(mockMarket);
      const result = await controller.create(createMarketDto);
      expect(result).toEqual(mockMarket);
      expect(mockMarketsService.create).toHaveBeenCalledWith(createMarketDto);
    });
  });

  describe('findAll', () => {
    it('should return all markets', async () => {
      const markets = [mockMarket];
      mockMarketsService.findAll.mockResolvedValue(markets);
      const result = await controller.findAll();
      expect(result).toEqual(markets);
      expect(mockMarketsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findNearby', () => {
    it('should return nearby markets', async () => {
      const markets = [mockMarket];
      const latitude = -15.7942;
      const longitude = -47.8822;
      const radius = 10;

      mockMarketsService.findNearby.mockResolvedValue(markets);
      const result = await controller.findNearby(latitude, longitude, radius);
      expect(result).toEqual(markets);
      expect(mockMarketsService.findNearby).toHaveBeenCalledWith(
        latitude,
        longitude,
        radius,
      );
    });
  });

  describe('findOne', () => {
    it('should return a market by id', async () => {
      mockMarketsService.findOne.mockResolvedValue(mockMarket);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockMarket);
      expect(mockMarketsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a market', async () => {
      const updateMarketDto: UpdateMarketDto = {
        name: 'Updated Market',
      };
      const updatedMarket = { ...mockMarket, name: 'Updated Market' };

      mockMarketsService.update.mockResolvedValue(updatedMarket);
      const result = await controller.update('1', updateMarketDto);
      expect(result).toEqual(updatedMarket);
      expect(mockMarketsService.update).toHaveBeenCalledWith(
        '1',
        updateMarketDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a market', async () => {
      mockMarketsService.remove.mockResolvedValue(undefined);
      const result = await controller.remove('1');
      expect(result).toBeUndefined();
      expect(mockMarketsService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('addProduct', () => {
    it('should add a product to market', async () => {
      const marketProduct = {
        id: '1',
        marketId: '1',
        productId: '1',
        price: 19.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMarketsService.addProduct.mockResolvedValue(marketProduct);
      const result = await controller.addProduct('1', '1');
      expect(result).toEqual(marketProduct);
      expect(mockMarketsService.addProduct).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('removeProduct', () => {
    it('should remove a product from market', async () => {
      mockMarketsService.removeProduct.mockResolvedValue(undefined);
      const result = await controller.removeProduct('1', '1');
      expect(result).toBeUndefined();
      expect(mockMarketsService.removeProduct).toHaveBeenCalledWith('1', '1');
    });
  });
});
