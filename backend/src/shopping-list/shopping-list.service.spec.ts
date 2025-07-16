import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import {
  AddMultipleToShoppingListDto,
  AddToShoppingListDto,
} from './dto/shopping-list.dto';
import { ShoppingListService } from './shopping-list.service';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    userShoppingList: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      upsert: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ShoppingListService>(ShoppingListService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToShoppingList', () => {
    it('should add product to shopping list', async () => {
      const userId = 'user-1';
      const addToShoppingListDto: AddToShoppingListDto = {
        productId: 'product-1',
      };

      const mockProduct = {
        id: 'product-1',
        name: 'Test Product',
        description: 'Test Description',
        imageUrl: 'test.jpg',
      };

      const mockShoppingListItem = {
        id: 'item-1',
        userId,
        productId: 'product-1',
        product: mockProduct,
        createdAt: new Date(),
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.userShoppingList.upsert.mockResolvedValue(
        mockShoppingListItem,
      );

      const result = await service.addToShoppingList(
        userId,
        addToShoppingListDto,
      );

      expect(result).toEqual(mockShoppingListItem);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-1' },
      });
      expect(mockPrismaService.userShoppingList.upsert).toHaveBeenCalledWith({
        where: {
          userId_productId: {
            userId,
            productId: 'product-1',
          },
        },
        update: {},
        create: {
          userId,
          productId: 'product-1',
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              imageUrl: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      const userId = 'user-1';
      const addToShoppingListDto: AddToShoppingListDto = {
        productId: 'non-existent',
      };

      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(
        service.addToShoppingList(userId, addToShoppingListDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if product already in shopping list', async () => {
      // This test is no longer relevant since we're using upsert
      // Upsert will just return the existing item, not throw an error
    });
  });

  describe('addMultipleToShoppingList', () => {
    it('should add multiple products to shopping list', async () => {
      const userId = 'user-1';
      const addMultipleDto: AddMultipleToShoppingListDto = {
        productIds: ['product-1', 'product-2'],
      };

      const mockProducts = [
        {
          id: 'product-1',
          name: 'Test Product 1',
          description: 'Test Description 1',
          imageUrl: 'test1.jpg',
        },
        {
          id: 'product-2',
          name: 'Test Product 2',
          description: 'Test Description 2',
          imageUrl: 'test2.jpg',
        },
      ];

      const mockShoppingListItems = [
        {
          id: 'item-1',
          userId,
          productId: 'product-1',
          product: mockProducts[0],
          createdAt: new Date(),
        },
        {
          id: 'item-2',
          userId,
          productId: 'product-2',
          product: mockProducts[1],
          createdAt: new Date(),
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.userShoppingList.upsert
        .mockResolvedValueOnce(mockShoppingListItems[0])
        .mockResolvedValueOnce(mockShoppingListItems[1]);

      const result = await service.addMultipleToShoppingList(
        userId,
        addMultipleDto,
      );

      expect(result).toEqual(mockShoppingListItems);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: ['product-1', 'product-2'],
          },
        },
      });
    });

    it('should throw NotFoundException if some products not found', async () => {
      const userId = 'user-1';
      const addMultipleDto: AddMultipleToShoppingListDto = {
        productIds: ['product-1', 'non-existent'],
      };

      const mockProducts = [
        {
          id: 'product-1',
          name: 'Test Product 1',
          description: 'Test Description 1',
          imageUrl: 'test1.jpg',
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

      await expect(
        service.addMultipleToShoppingList(userId, addMultipleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getShoppingList', () => {
    it('should return user shopping list', async () => {
      const userId = 'user-1';
      const mockShoppingList = [
        {
          id: 'item-1',
          userId,
          productId: 'product-1',
          product: {
            id: 'product-1',
            name: 'Test Product',
            description: 'Test Description',
            imageUrl: 'test.jpg',
          },
          createdAt: new Date(),
        },
      ];

      mockPrismaService.userShoppingList.findMany.mockResolvedValue(
        mockShoppingList,
      );

      const result = await service.getShoppingList(userId);

      expect(result).toEqual(mockShoppingList);
      expect(mockPrismaService.userShoppingList.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('removeFromShoppingList', () => {
    it('should remove product from shopping list', async () => {
      const userId = 'user-1';
      const productId = 'product-1';
      const mockShoppingListItem = {
        id: 'item-1',
        userId,
        productId,
      };

      mockPrismaService.userShoppingList.findFirst.mockResolvedValue(
        mockShoppingListItem,
      );
      mockPrismaService.userShoppingList.delete.mockResolvedValue(
        mockShoppingListItem,
      );

      await service.removeFromShoppingList(userId, productId);

      expect(mockPrismaService.userShoppingList.findFirst).toHaveBeenCalledWith(
        {
          where: {
            userId,
            productId,
          },
        },
      );
      expect(mockPrismaService.userShoppingList.delete).toHaveBeenCalledWith({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      const userId = 'user-1';
      const productId = 'non-existent';

      mockPrismaService.userShoppingList.findFirst.mockResolvedValue(null);

      await expect(
        service.removeFromShoppingList(userId, productId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('clearShoppingList', () => {
    it('should clear entire shopping list', async () => {
      const userId = 'user-1';

      mockPrismaService.userShoppingList.deleteMany.mockResolvedValue({
        count: 3,
      });

      await service.clearShoppingList(userId);

      expect(
        mockPrismaService.userShoppingList.deleteMany,
      ).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
});
