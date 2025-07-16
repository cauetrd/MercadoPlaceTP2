import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PurchaseService } from './purchase.service';

describe('PurchaseService', () => {
  let service: PurchaseService;
  let prisma: PrismaService;

  const mockPrismaService = {
    purchase: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    purchasedProduct: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a purchase with items', async () => {
      const createPurchaseDto: CreatePurchaseDto = {
        items: [
          {
            productId: 'product-1',
            marketId: 'market-1',
            price: 10.5,
          },
          {
            productId: 'product-2',
            marketId: 'market-1',
            price: 5.99,
          },
        ],
        purchaseDate: '2023-12-01T10:00:00.000Z',
      };

      const userId = 'user-1';
      const mockPurchase = {
        id: 'purchase-1',
        userId,
        totalPrice: 16.49,
        createdAt: new Date('2023-12-01T10:00:00.000Z'),
      };

      const mockPurchasedProducts = [
        {
          id: 'pp-1',
          userId,
          productId: 'product-1',
          marketId: 'market-1',
          purchaseId: 'purchase-1',
          price: 10.5,
        },
        {
          id: 'pp-2',
          userId,
          productId: 'product-2',
          marketId: 'market-1',
          purchaseId: 'purchase-1',
          price: 5.99,
        },
      ];

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          purchase: {
            create: jest.fn().mockResolvedValue(mockPurchase),
          },
          purchasedProduct: {
            create: jest
              .fn()
              .mockResolvedValueOnce(mockPurchasedProducts[0])
              .mockResolvedValueOnce(mockPurchasedProducts[1]),
          },
        };

        return callback(mockTx);
      });

      const result = await service.create(createPurchaseDto, userId);

      expect(result).toEqual({
        ...mockPurchase,
        products: mockPurchasedProducts,
      });
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should create purchase without purchaseDate', async () => {
      const createPurchaseDto: CreatePurchaseDto = {
        items: [
          {
            productId: 'product-1',
            marketId: 'market-1',
            price: 10.5,
          },
        ],
      };

      const userId = 'user-1';
      const mockPurchase = {
        id: 'purchase-1',
        userId,
        totalPrice: 10.5,
        createdAt: new Date(),
      };

      const mockPurchasedProduct = {
        id: 'pp-1',
        userId,
        productId: 'product-1',
        marketId: 'market-1',
        purchaseId: 'purchase-1',
        price: 10.5,
      };

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          purchase: {
            create: jest.fn().mockResolvedValue(mockPurchase),
          },
          purchasedProduct: {
            create: jest.fn().mockResolvedValue(mockPurchasedProduct),
          },
        };

        return callback(mockTx);
      });

      const result = await service.create(createPurchaseDto, userId);

      expect(result).toEqual({
        ...mockPurchase,
        products: [mockPurchasedProduct],
      });
    });
  });

  describe('findAll', () => {
    it('should return all purchases', async () => {
      const mockPurchases = [
        {
          id: 'purchase-1',
          userId: 'user-1',
          totalPrice: 16.49,
          createdAt: new Date(),
          user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
          products: [],
        },
      ];

      mockPrismaService.purchase.findMany.mockResolvedValue(mockPurchases);

      const result = await service.findAll();

      expect(result).toEqual(mockPurchases);
      expect(mockPrismaService.purchase.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  imageUrl: true,
                },
              },
              market: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('findByUser', () => {
    it('should return purchases by user ID', async () => {
      const userId = 'user-1';
      const mockPurchases = [
        {
          id: 'purchase-1',
          userId,
          totalPrice: 16.49,
          createdAt: new Date(),
          products: [],
        },
      ];

      mockPrismaService.purchase.findMany.mockResolvedValue(mockPurchases);

      const result = await service.findByUser(userId);

      expect(result).toEqual(mockPurchases);
      expect(mockPrismaService.purchase.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  imageUrl: true,
                },
              },
              market: {
                select: {
                  id: true,
                  name: true,
                },
              },
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
    it('should return a purchase by ID', async () => {
      const purchaseId = 'purchase-1';
      const mockPurchase = {
        id: purchaseId,
        userId: 'user-1',
        totalPrice: 16.49,
        createdAt: new Date(),
        user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
        products: [],
      };

      mockPrismaService.purchase.findUnique.mockResolvedValue(mockPurchase);

      const result = await service.findOne(purchaseId);

      expect(result).toEqual(mockPurchase);
      expect(mockPrismaService.purchase.findUnique).toHaveBeenCalledWith({
        where: { id: purchaseId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  imageUrl: true,
                },
              },
              market: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw NotFoundException if purchase not found', async () => {
      const purchaseId = 'non-existent';

      mockPrismaService.purchase.findUnique.mockResolvedValue(null);

      await expect(service.findOne(purchaseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update purchase with new items', async () => {
      const purchaseId = 'purchase-1';
      const updatePurchaseDto: UpdatePurchaseDto = {
        items: [
          {
            productId: 'product-1',
            marketId: 'market-1',
            price: 12.0,
          },
        ],
        purchaseDate: '2023-12-02T10:00:00.000Z',
      };

      const mockExistingPurchase = {
        id: purchaseId,
        userId: 'user-1',
        totalPrice: 16.49,
        createdAt: new Date(),
      };

      const mockUpdatedPurchase = {
        ...mockExistingPurchase,
        totalPrice: 12.0,
        createdAt: new Date('2023-12-02T10:00:00.000Z'),
      };

      const mockPurchasedProduct = {
        id: 'pp-1',
        userId: 'user-1',
        productId: 'product-1',
        marketId: 'market-1',
        purchaseId,
        price: 12.0,
      };

      mockPrismaService.purchase.findUnique.mockResolvedValue(
        mockExistingPurchase,
      );
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          purchasedProduct: {
            deleteMany: jest.fn(),
            create: jest.fn().mockResolvedValue(mockPurchasedProduct),
          },
          purchase: {
            update: jest.fn().mockResolvedValue(mockUpdatedPurchase),
          },
        };

        return callback(mockTx);
      });

      const result = await service.update(purchaseId, updatePurchaseDto);

      expect(result).toEqual({
        ...mockUpdatedPurchase,
        products: [mockPurchasedProduct],
      });
    });

    it('should update only purchase date', async () => {
      const purchaseId = 'purchase-1';
      const updatePurchaseDto: UpdatePurchaseDto = {
        purchaseDate: '2023-12-02T10:00:00.000Z',
      };

      const mockExistingPurchase = {
        id: purchaseId,
        userId: 'user-1',
        totalPrice: 16.49,
        createdAt: new Date(),
      };

      const mockUpdatedPurchase = {
        ...mockExistingPurchase,
        createdAt: new Date('2023-12-02T10:00:00.000Z'),
        user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
        products: [],
      };

      mockPrismaService.purchase.findUnique.mockResolvedValue(
        mockExistingPurchase,
      );
      mockPrismaService.purchase.update.mockResolvedValue(mockUpdatedPurchase);

      const result = await service.update(purchaseId, updatePurchaseDto);

      expect(result).toEqual(mockUpdatedPurchase);
      expect(mockPrismaService.purchase.update).toHaveBeenCalledWith({
        where: { id: purchaseId },
        data: {
          createdAt: new Date('2023-12-02T10:00:00.000Z'),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  imageUrl: true,
                },
              },
              market: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw NotFoundException if purchase not found', async () => {
      const purchaseId = 'non-existent';
      const updatePurchaseDto: UpdatePurchaseDto = {
        purchaseDate: '2023-12-02T10:00:00.000Z',
      };

      mockPrismaService.purchase.findUnique.mockResolvedValue(null);

      await expect(
        service.update(purchaseId, updatePurchaseDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a purchase', async () => {
      const purchaseId = 'purchase-1';
      const mockPurchase = {
        id: purchaseId,
        userId: 'user-1',
        totalPrice: 16.49,
        createdAt: new Date(),
      };

      mockPrismaService.purchase.findUnique.mockResolvedValue(mockPurchase);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          purchasedProduct: {
            deleteMany: jest.fn(),
          },
          purchase: {
            delete: jest.fn().mockResolvedValue(mockPurchase),
          },
        };

        return callback(mockTx);
      });

      const result = await service.remove(purchaseId);

      expect(result).toEqual(mockPurchase);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if purchase not found', async () => {
      const purchaseId = 'non-existent';

      mockPrismaService.purchase.findUnique.mockResolvedValue(null);

      await expect(service.remove(purchaseId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPurchaseStatistics', () => {
    it('should return statistics for all purchases', async () => {
      const mockStats = {
        totalPurchases: 10,
        totalSpent: 150.99,
        totalProducts: 25,
      };

      mockPrismaService.purchase.count.mockResolvedValue(
        mockStats.totalPurchases,
      );
      mockPrismaService.purchase.aggregate.mockResolvedValue({
        _sum: { totalPrice: mockStats.totalSpent },
      });
      mockPrismaService.purchasedProduct.count.mockResolvedValue(
        mockStats.totalProducts,
      );

      const result = await service.getPurchaseStatistics();

      expect(result).toEqual(mockStats);
      expect(mockPrismaService.purchase.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(mockPrismaService.purchase.aggregate).toHaveBeenCalledWith({
        where: {},
        _sum: {
          totalPrice: true,
        },
      });
      expect(mockPrismaService.purchasedProduct.count).toHaveBeenCalledWith({
        where: {},
      });
    });

    it('should return statistics for specific user', async () => {
      const userId = 'user-1';
      const mockStats = {
        totalPurchases: 5,
        totalSpent: 75.5,
        totalProducts: 12,
      };

      mockPrismaService.purchase.count.mockResolvedValue(
        mockStats.totalPurchases,
      );
      mockPrismaService.purchase.aggregate.mockResolvedValue({
        _sum: { totalPrice: mockStats.totalSpent },
      });
      mockPrismaService.purchasedProduct.count.mockResolvedValue(
        mockStats.totalProducts,
      );

      const result = await service.getPurchaseStatistics(userId);

      expect(result).toEqual(mockStats);
      expect(mockPrismaService.purchase.count).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(mockPrismaService.purchase.aggregate).toHaveBeenCalledWith({
        where: { userId },
        _sum: {
          totalPrice: true,
        },
      });
      expect(mockPrismaService.purchasedProduct.count).toHaveBeenCalledWith({
        where: { purchase: { userId } },
      });
    });

    it('should handle null totalSpent', async () => {
      const userId = 'user-1';

      mockPrismaService.purchase.count.mockResolvedValue(0);
      mockPrismaService.purchase.aggregate.mockResolvedValue({
        _sum: { totalPrice: null },
      });
      mockPrismaService.purchasedProduct.count.mockResolvedValue(0);

      const result = await service.getPurchaseStatistics(userId);

      expect(result).toEqual({
        totalPurchases: 0,
        totalSpent: 0,
        totalProducts: 0,
      });
    });
  });
});
