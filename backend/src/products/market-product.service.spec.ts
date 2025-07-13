import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { MarketProductService } from './market-product.service';

describe('MarketProductService', () => {
  let service: MarketProductService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    market: {
      findUnique: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
    marketProduct: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MarketProductService>(MarketProductService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new market product', async () => {
      const createDto = {
        marketId: 'market-1',
        productId: 'product-1',
        price: 10.99,
      };

      const market = { id: 'market-1', name: 'Test Market' };
      const product = { id: 'product-1', name: 'Test Product' };
      const expectedMarketProduct = {
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

      mockPrismaService.market.findUnique.mockResolvedValue(market);
      mockPrismaService.product.findUnique.mockResolvedValue(product);
      mockPrismaService.marketProduct.findUnique.mockResolvedValue(null);
      mockPrismaService.marketProduct.create.mockResolvedValue(
        expectedMarketProduct,
      );

      const result = await service.create(createDto);

      expect(result).toEqual(expectedMarketProduct);
    });

    it('should throw NotFoundException if market not found', async () => {
      const createDto = {
        marketId: 'market-1',
        productId: 'product-1',
        price: 10.99,
      };

      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if product already exists in market', async () => {
      const createDto = {
        marketId: 'market-1',
        productId: 'product-1',
        price: 10.99,
      };

      const market = { id: 'market-1', name: 'Test Market' };
      const product = { id: 'product-1', name: 'Test Product' };
      const existingMarketProduct = { id: '1' };

      mockPrismaService.market.findUnique.mockResolvedValue(market);
      mockPrismaService.product.findUnique.mockResolvedValue(product);
      mockPrismaService.marketProduct.findUnique.mockResolvedValue(
        existingMarketProduct,
      );

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all market products', async () => {
      const expectedMarketProducts = [
        {
          id: '1',
          marketId: 'market-1',
          productId: 'product-1',
          price: 10.99,
          lastPrice: null,
          isValid: true,
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
        },
      ];

      mockPrismaService.marketProduct.findMany.mockResolvedValue(
        expectedMarketProducts,
      );

      const result = await service.findAll();

      expect(result).toEqual(expectedMarketProducts);
    });
  });

  describe('findOne', () => {
    it('should return a market product by id', async () => {
      const expectedMarketProduct = {
        id: '1',
        marketId: 'market-1',
        productId: 'product-1',
        price: 10.99,
        lastPrice: null,
        isValid: true,
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

      mockPrismaService.marketProduct.findUnique.mockResolvedValue(
        expectedMarketProduct,
      );

      const result = await service.findOne('1');

      expect(result).toEqual(expectedMarketProduct);
    });

    it('should throw NotFoundException if market product not found', async () => {
      mockPrismaService.marketProduct.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('approve', () => {
    it('should approve a market product', async () => {
      const marketProduct = { id: '1', isValid: false };
      const approvedMarketProduct = {
        id: '1',
        marketId: 'market-1',
        productId: 'product-1',
        price: 10.99,
        lastPrice: null,
        isValid: true,
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

      mockPrismaService.marketProduct.findUnique.mockResolvedValue(
        marketProduct,
      );
      mockPrismaService.marketProduct.update.mockResolvedValue(
        approvedMarketProduct,
      );

      const result = await service.approve('1');

      expect(result).toEqual(approvedMarketProduct);
      expect(mockPrismaService.marketProduct.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isValid: true },
        include: expect.any(Object),
      });
    });
  });

  describe('reject', () => {
    it('should reject and delete a market product', async () => {
      const marketProduct = { id: '1', isValid: false };

      mockPrismaService.marketProduct.findUnique.mockResolvedValue(
        marketProduct,
      );
      mockPrismaService.marketProduct.delete.mockResolvedValue(marketProduct);

      await service.reject('1');

      expect(mockPrismaService.marketProduct.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if market product not found', async () => {
      mockPrismaService.marketProduct.findUnique.mockResolvedValue(null);

      await expect(service.reject('1')).rejects.toThrow(NotFoundException);
    });
  });
});
