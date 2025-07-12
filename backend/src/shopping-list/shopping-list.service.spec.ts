import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ShoppingListService } from './shopping-list.service';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let prismaService: PrismaService;

  const mockProduct = {
    id: 'product-1',
    name: 'Test Product',
    description: 'Test Description',
    currentPrice: 10.99,
    imageUrl: null,
    isValid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockShoppingListItem = {
    id: 'item-1',
    quantity: 2,
    isSelected: false,
    userId: 'user-1',
    productId: 'product-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    product: mockProduct,
  };

  const mockPrismaService = {
    product: {
      findUnique: jest.fn(),
    },
    itemListaDeCompra: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    compraFinalizada: {
      create: jest.fn(),
    },
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
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addItem', () => {
    it('should add a new item to shopping list', async () => {
      const addToShoppingListDto = {
        productId: 'product-1',
        quantity: 2,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.itemListaDeCompra.findUnique.mockResolvedValue(null);
      mockPrismaService.itemListaDeCompra.create.mockResolvedValue(
        mockShoppingListItem,
      );

      const result = await service.addItem('user-1', addToShoppingListDto);

      expect(result).toEqual(mockShoppingListItem);
      expect(mockPrismaService.itemListaDeCompra.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          productId: 'product-1',
          quantity: 2,
        },
        include: {
          product: true,
        },
      });
    });

    it('should update quantity if item already exists', async () => {
      const addToShoppingListDto = {
        productId: 'product-1',
        quantity: 1,
      };

      const existingItem = { ...mockShoppingListItem, quantity: 1 };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.itemListaDeCompra.findUnique.mockResolvedValue(
        existingItem,
      );
      mockPrismaService.itemListaDeCompra.update.mockResolvedValue({
        ...existingItem,
        quantity: 3,
      });

      const result = await service.addItem('user-1', addToShoppingListDto);

      expect(mockPrismaService.itemListaDeCompra.update).toHaveBeenCalledWith({
        where: { id: existingItem.id },
        data: { quantity: 2 },
        include: { product: true },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      const addToShoppingListDto = {
        productId: 'invalid-product',
        quantity: 1,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(
        service.addItem('user-1', addToShoppingListDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getShoppingList', () => {
    it('should return user shopping list', async () => {
      mockPrismaService.itemListaDeCompra.findMany.mockResolvedValue([
        mockShoppingListItem,
      ]);

      const result = await service.getShoppingList('user-1');

      expect(result).toEqual([mockShoppingListItem]);
      expect(mockPrismaService.itemListaDeCompra.findMany).toHaveBeenCalledWith(
        {
          where: { userId: 'user-1' },
          include: {
            product: {
              include: {
                priceHistory: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      );
    });
  });

  describe('updateItem', () => {
    it('should update shopping list item', async () => {
      const updateDto = { quantity: 5, isSelected: true };

      mockPrismaService.itemListaDeCompra.findFirst.mockResolvedValue(
        mockShoppingListItem,
      );
      mockPrismaService.itemListaDeCompra.update.mockResolvedValue({
        ...mockShoppingListItem,
        ...updateDto,
      });

      const result = await service.updateItem('user-1', 'item-1', updateDto);

      expect(result.quantity).toBe(5);
      expect(result.isSelected).toBe(true);
      expect(mockPrismaService.itemListaDeCompra.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: updateDto,
        include: { product: true },
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      mockPrismaService.itemListaDeCompra.findFirst.mockResolvedValue(null);

      await expect(
        service.updateItem('user-1', 'invalid-item', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('should remove item from shopping list', async () => {
      mockPrismaService.itemListaDeCompra.findFirst.mockResolvedValue(
        mockShoppingListItem,
      );
      mockPrismaService.itemListaDeCompra.delete.mockResolvedValue(
        mockShoppingListItem,
      );

      await service.removeItem('user-1', 'item-1');

      expect(mockPrismaService.itemListaDeCompra.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
    });

    it('should throw NotFoundException if item not found', async () => {
      mockPrismaService.itemListaDeCompra.findFirst.mockResolvedValue(null);

      await expect(
        service.removeItem('user-1', 'invalid-item'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('clearShoppingList', () => {
    it('should clear all items from shopping list', async () => {
      mockPrismaService.itemListaDeCompra.deleteMany.mockResolvedValue({
        count: 3,
      });

      await service.clearShoppingList('user-1');

      expect(
        mockPrismaService.itemListaDeCompra.deleteMany,
      ).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });
  });

  describe('finalizePurchase', () => {
    it('should finalize purchase with selected items', async () => {
      const finalizePurchaseDto = {
        selectedItemIds: ['item-1'],
      };

      const selectedItems = [{ ...mockShoppingListItem, isSelected: true }];
      const mockPurchase = {
        id: 'purchase-1',
        userId: 'user-1',
        totalCost: 21.98,
        purchasedItems: [],
        createdAt: new Date(),
      };

      mockPrismaService.itemListaDeCompra.findMany.mockResolvedValue(
        selectedItems,
      );
      mockPrismaService.compraFinalizada.create.mockResolvedValue(mockPurchase);
      mockPrismaService.itemListaDeCompra.deleteMany.mockResolvedValue({
        count: 1,
      });

      const result = await service.finalizePurchase(
        'user-1',
        finalizePurchaseDto,
      );

      expect(result).toEqual(mockPurchase);
      expect(mockPrismaService.compraFinalizada.create).toHaveBeenCalled();
      expect(
        mockPrismaService.itemListaDeCompra.deleteMany,
      ).toHaveBeenCalledWith({
        where: {
          id: { in: ['item-1'] },
          userId: 'user-1',
        },
      });
    });

    it('should throw BadRequestException if no items selected', async () => {
      const finalizePurchaseDto = {
        selectedItemIds: [],
      };

      await expect(
        service.finalizePurchase('user-1', finalizePurchaseDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if no valid items found', async () => {
      const finalizePurchaseDto = {
        selectedItemIds: ['item-1'],
      };

      mockPrismaService.itemListaDeCompra.findMany.mockResolvedValue([]);

      await expect(
        service.finalizePurchase('user-1', finalizePurchaseDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getSelectedItemsTotal', () => {
    it('should calculate total for selected items', async () => {
      const selectedItems = [
        { ...mockShoppingListItem, isSelected: true, quantity: 2 },
        { ...mockShoppingListItem, isSelected: true, quantity: 1 },
      ];

      mockPrismaService.itemListaDeCompra.findMany.mockResolvedValue(
        selectedItems,
      );

      const result = await service.getSelectedItemsTotal('user-1');

      expect(result.total).toBe(32.97); // (10.99 * 2) + (10.99 * 1)
      expect(result.itemCount).toBe(2);
    });

    it('should return zero if no selected items', async () => {
      mockPrismaService.itemListaDeCompra.findMany.mockResolvedValue([]);

      const result = await service.getSelectedItemsTotal('user-1');

      expect(result.total).toBe(0);
      expect(result.itemCount).toBe(0);
    });
  });
});
