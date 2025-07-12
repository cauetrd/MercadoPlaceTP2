import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from '../users/dto/user.dto';
import {
  AddToShoppingListDto,
  FinalizePurchaseDto,
  UpdateShoppingListItemDto,
} from './dto/shopping-list.dto';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';

describe('ShoppingListController', () => {
  let controller: ShoppingListController;
  let service: ShoppingListService;

  const mockShoppingListService = {
    addItem: jest.fn(),
    getShoppingList: jest.fn(),
    getSelectedItemsTotal: jest.fn(),
    updateItem: jest.fn(),
    removeItem: jest.fn(),
    clearShoppingList: jest.fn(),
    finalizePurchase: jest.fn(),
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

  const mockShoppingListItem = {
    id: '1',
    userId: '1',
    productId: '1',
    quantity: 2,
    isSelected: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoppingListController],
      providers: [
        {
          provide: ShoppingListService,
          useValue: mockShoppingListService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ShoppingListController>(ShoppingListController);
    service = module.get<ShoppingListService>(ShoppingListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addItem', () => {
    it('should add item to shopping list', async () => {
      const addToShoppingListDto: AddToShoppingListDto = {
        productId: '1',
        quantity: 2,
      };

      mockShoppingListService.addItem.mockResolvedValue(mockShoppingListItem);
      const result = await controller.addItem(mockUser, addToShoppingListDto);
      expect(result).toEqual(mockShoppingListItem);
      expect(mockShoppingListService.addItem).toHaveBeenCalledWith(
        mockUser.id,
        addToShoppingListDto,
      );
    });
  });

  describe('getShoppingList', () => {
    it('should return shopping list', async () => {
      const shoppingList = [mockShoppingListItem];

      mockShoppingListService.getShoppingList.mockResolvedValue(shoppingList);
      const result = await controller.getShoppingList(mockUser);
      expect(result).toEqual(shoppingList);
      expect(mockShoppingListService.getShoppingList).toHaveBeenCalledWith(
        mockUser.id,
      );
    });
  });

  describe('getSelectedItemsTotal', () => {
    it('should return selected items total', async () => {
      const total = { total: 50.0, itemCount: 3 };

      mockShoppingListService.getSelectedItemsTotal.mockResolvedValue(total);
      const result = await controller.getSelectedItemsTotal(mockUser);
      expect(result).toEqual(total);
      expect(
        mockShoppingListService.getSelectedItemsTotal,
      ).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('updateItem', () => {
    it('should update shopping list item', async () => {
      const updateDto: UpdateShoppingListItemDto = {
        quantity: 3,
        isSelected: false,
      };
      const updatedItem = {
        ...mockShoppingListItem,
        quantity: 3,
        isSelected: false,
      };

      mockShoppingListService.updateItem.mockResolvedValue(updatedItem);
      const result = await controller.updateItem(mockUser, '1', updateDto);
      expect(result).toEqual(updatedItem);
      expect(mockShoppingListService.updateItem).toHaveBeenCalledWith(
        mockUser.id,
        '1',
        updateDto,
      );
    });
  });

  describe('removeItem', () => {
    it('should remove shopping list item', async () => {
      mockShoppingListService.removeItem.mockResolvedValue(undefined);
      const result = await controller.removeItem(mockUser, '1');
      expect(result).toBeUndefined();
      expect(mockShoppingListService.removeItem).toHaveBeenCalledWith(
        mockUser.id,
        '1',
      );
    });
  });

  describe('clearShoppingList', () => {
    it('should clear shopping list', async () => {
      mockShoppingListService.clearShoppingList.mockResolvedValue(undefined);
      const result = await controller.clearShoppingList(mockUser);
      expect(result).toBeUndefined();
      expect(mockShoppingListService.clearShoppingList).toHaveBeenCalledWith(
        mockUser.id,
      );
    });
  });

  describe('finalizePurchase', () => {
    it('should finalize purchase', async () => {
      const finalizePurchaseDto: FinalizePurchaseDto = {
        selectedItemIds: ['1', '2'],
      };
      const purchase = {
        id: '1',
        totalCost: 50.0,
        userId: '1',
        createdAt: new Date(),
        purchasedItems: [],
      };

      mockShoppingListService.finalizePurchase.mockResolvedValue(purchase);
      const result = await controller.finalizePurchase(
        mockUser,
        finalizePurchaseDto,
      );
      expect(result).toEqual(purchase);
      expect(mockShoppingListService.finalizePurchase).toHaveBeenCalledWith(
        mockUser.id,
        finalizePurchaseDto,
      );
    });
  });
});
