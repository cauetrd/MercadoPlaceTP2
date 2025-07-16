import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ShoppingListCompareService } from './shopping-list-compare.service';

describe('ShoppingListCompareService', () => {
  let service: ShoppingListCompareService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListCompareService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ShoppingListCompareService>(
      ShoppingListCompareService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('compareMarketPrices', () => {
    it('should compare market prices for products', async () => {
      const productIds = ['product-1', 'product-2'];
      const userLatitude = -15.7942;
      const userLongitude = -47.8822;

      const mockProducts = [
        {
          id: 'product-1',
          name: 'Product 1',
          marketProducts: [
            {
              id: 'mp-1',
              price: 10.5,
              isValid: true,
              market: {
                id: 'market-1',
                name: 'Market 1',
                latitude: -15.795,
                longitude: -47.883,
              },
            },
            {
              id: 'mp-2',
              price: 12.0,
              isValid: true,
              market: {
                id: 'market-2',
                name: 'Market 2',
                latitude: -15.796,
                longitude: -47.884,
              },
            },
          ],
        },
        {
          id: 'product-2',
          name: 'Product 2',
          marketProducts: [
            {
              id: 'mp-3',
              price: 5.99,
              isValid: true,
              market: {
                id: 'market-1',
                name: 'Market 1',
                latitude: -15.795,
                longitude: -47.883,
              },
            },
          ],
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.compareMarketPrices(
        productIds,
        userLatitude,
        userLongitude,
      );

      expect(result).toHaveLength(2);
      expect(result[0].market.name).toBe('Market 1');
      expect(result[0].subtotal).toBeCloseTo(16.49, 2); // 10.5 + 5.99
      expect(result[0].products['product-1'].available).toBe(true);
      expect(result[0].products['product-2'].available).toBe(true);
      expect(result[0].distance).toBeDefined();

      expect(result[1].market.name).toBe('Market 2');
      expect(result[1].subtotal).toBe(12.0);
      expect(result[1].products['product-1'].available).toBe(true);
      expect(result[1].products['product-2'].available).toBe(false);
      expect(result[1].products['product-2'].price).toBe(0);
    });

    it('should handle empty product list', async () => {
      const productIds: string[] = [];

      mockPrismaService.product.findMany.mockResolvedValue([]);

      await expect(service.compareMarketPrices(productIds)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should work without user location', async () => {
      const productIds = ['product-1'];

      const mockProducts = [
        {
          id: 'product-1',
          name: 'Product 1',
          marketProducts: [
            {
              id: 'mp-1',
              price: 10.5,
              isValid: true,
              market: {
                id: 'market-1',
                name: 'Market 1',
                latitude: -15.795,
                longitude: -47.883,
              },
            },
          ],
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.compareMarketPrices(productIds);

      expect(result).toHaveLength(1);
      expect(result[0].distance).toBeUndefined();
    });

    it('should sort markets by availability, then price, then distance', async () => {
      const productIds = ['product-1', 'product-2'];
      const userLatitude = -15.7942;
      const userLongitude = -47.8822;

      const mockProducts = [
        {
          id: 'product-1',
          name: 'Product 1',
          marketProducts: [
            {
              id: 'mp-1',
              price: 15.0,
              isValid: true,
              market: {
                id: 'market-1',
                name: 'Market 1',
                latitude: -15.795,
                longitude: -47.883,
              },
            },
            {
              id: 'mp-2',
              price: 10.0,
              isValid: true,
              market: {
                id: 'market-2',
                name: 'Market 2',
                latitude: -15.796,
                longitude: -47.884,
              },
            },
          ],
        },
        {
          id: 'product-2',
          name: 'Product 2',
          marketProducts: [
            {
              id: 'mp-3',
              price: 5.0,
              isValid: true,
              market: {
                id: 'market-1',
                name: 'Market 1',
                latitude: -15.795,
                longitude: -47.883,
              },
            },
            {
              id: 'mp-4',
              price: 8.0,
              isValid: true,
              market: {
                id: 'market-2',
                name: 'Market 2',
                latitude: -15.796,
                longitude: -47.884,
              },
            },
          ],
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.compareMarketPrices(
        productIds,
        userLatitude,
        userLongitude,
      );

      expect(result).toHaveLength(2);
      expect(result[0].market.name).toBe('Market 2'); // Lower total: 10 + 8 = 18
      expect(result[0].subtotal).toBe(18.0);
      expect(result[1].market.name).toBe('Market 1'); // Higher total: 15 + 5 = 20
      expect(result[1].subtotal).toBe(20.0);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const lat1 = -15.7942;
      const lon1 = -47.8822;
      const lat2 = -15.795;
      const lon2 = -47.883;

      const distance = service['calculateDistance'](lat1, lon1, lat2, lon2);

      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(1); // Should be less than 1km for nearby points
    });
  });

  describe('deg2rad', () => {
    it('should convert degrees to radians', () => {
      const degrees = 180;
      const radians = service['deg2rad'](degrees);

      expect(radians).toBeCloseTo(Math.PI, 5);
    });
  });
});
