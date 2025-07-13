import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MarketProductController } from './market-product.controller';
import { MarketProductService } from './market-product.service';

describe('MarketProductController', () => {
  let controller: MarketProductController;
  let service: MarketProductService;

  const mockMarketProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findPendingApproval: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    approve: jest.fn(),
    reject: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    isAdmin: false,
    points: 0,
    latitude: null,
    longitude: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMarketProduct = {
    id: '1',
    marketId: 'market-1',
    productId: 'product-1',
    price: 10.99,
    lastPrice: null,
    isValid: false,
    market: {
      id: 'market-1',
      name: 'Test Market',
      latitude: -15.7942,
      longitude: -47.8822,
    },
    product: {
      id: 'product-1',
      name: 'Test Product',
      description: null,
      imageUrl: null,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketProductController],
      providers: [
        { provide: MarketProductService, useValue: mockMarketProductService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MarketProductController>(MarketProductController);
    service = module.get<MarketProductService>(MarketProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a market product', async () => {
      const createDto = {
        marketId: 'market-1',
        productId: 'product-1',
        price: 10.99,
      };

      mockMarketProductService.create.mockResolvedValue(mockMarketProduct);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockMarketProduct);
      expect(mockMarketProductService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all market products', async () => {
      const marketProducts = [mockMarketProduct];

      mockMarketProductService.findAll.mockResolvedValue(marketProducts);

      const result = await controller.findAll();

      expect(result).toEqual(marketProducts);
      expect(mockMarketProductService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
    });

    it('should filter by marketId', async () => {
      const marketProducts = [mockMarketProduct];

      mockMarketProductService.findAll.mockResolvedValue(marketProducts);

      const result = await controller.findAll('market-1');

      expect(result).toEqual(marketProducts);
      expect(mockMarketProductService.findAll).toHaveBeenCalledWith(
        'market-1',
        undefined,
      );
    });
  });

  describe('findPendingApproval', () => {
    it('should return pending market products', async () => {
      const pendingMarketProducts = [mockMarketProduct];

      mockMarketProductService.findPendingApproval.mockResolvedValue(
        pendingMarketProducts,
      );

      const result = await controller.findPendingApproval();

      expect(result).toEqual(pendingMarketProducts);
      expect(mockMarketProductService.findPendingApproval).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a market product by id', async () => {
      mockMarketProductService.findOne.mockResolvedValue(mockMarketProduct);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockMarketProduct);
      expect(mockMarketProductService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a market product', async () => {
      const updateDto = { price: 12.99 };
      const updatedMarketProduct = { ...mockMarketProduct, price: 12.99 };

      mockMarketProductService.update.mockResolvedValue(updatedMarketProduct);

      const result = await controller.update('1', updateDto, mockUser);

      expect(result).toEqual(updatedMarketProduct);
      expect(mockMarketProductService.update).toHaveBeenCalledWith(
        '1',
        updateDto,
        mockUser.id,
      );
    });
  });

  describe('approve', () => {
    it('should approve a market product', async () => {
      const approvedMarketProduct = { ...mockMarketProduct, isValid: true };

      mockMarketProductService.approve.mockResolvedValue(approvedMarketProduct);

      const result = await controller.approve('1');

      expect(result).toEqual(approvedMarketProduct);
      expect(mockMarketProductService.approve).toHaveBeenCalledWith('1');
    });
  });

  describe('reject', () => {
    it('should reject a market product', async () => {
      mockMarketProductService.reject.mockResolvedValue(undefined);

      const result = await controller.reject('1');

      expect(result).toBeUndefined();
      expect(mockMarketProductService.reject).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should remove a market product', async () => {
      mockMarketProductService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(result).toBeUndefined();
      expect(mockMarketProductService.remove).toHaveBeenCalledWith('1');
    });
  });
});
