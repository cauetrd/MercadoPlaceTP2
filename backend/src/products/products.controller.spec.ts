import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from '../users/dto/user.dto';
import {
  CreateProductDto,
  ProductSearchDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findPendingApproval: jest.fn(),
    findByMarket: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    approve: jest.fn(),
    reject: jest.fn(),
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

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'A test product',
    imageUrl: 'http://example.com/image.jpg',
    isApproved: true,
    createdById: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'A new product',
        currentPrice: 19.99,
        imageUrl: 'http://example.com/image.jpg',
      };

      mockProductsService.create.mockResolvedValue(mockProduct);
      const result = await controller.create(createProductDto, mockUser);
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.create).toHaveBeenCalledWith(
        createProductDto,
        mockUser.id,
      );
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const searchDto: ProductSearchDto = {};
      const products = [mockProduct];

      mockProductsService.findAll.mockResolvedValue(products);
      const result = await controller.findAll(searchDto);
      expect(result).toEqual(products);
      expect(mockProductsService.findAll).toHaveBeenCalledWith(searchDto);
    });

    it('should return products with search filters', async () => {
      const searchDto: ProductSearchDto = {
        name: 'Test',
        sortBy: 'name',
        sortOrder: 'asc',
        userLatitude: -15.7942,
        userLongitude: -47.8822,
      };
      const products = [mockProduct];

      mockProductsService.findAll.mockResolvedValue(products);
      const result = await controller.findAll(searchDto);
      expect(result).toEqual(products);
      expect(mockProductsService.findAll).toHaveBeenCalledWith(searchDto);
    });
  });

  describe('findPendingApproval', () => {
    it('should return pending products', async () => {
      const pendingProducts = [{ ...mockProduct, isApproved: false }];

      mockProductsService.findPendingApproval.mockResolvedValue(
        pendingProducts,
      );
      const result = await controller.findPendingApproval();
      expect(result).toEqual(pendingProducts);
      expect(mockProductsService.findPendingApproval).toHaveBeenCalled();
    });
  });

  describe('findByMarket', () => {
    it('should return products by market', async () => {
      const marketId = '1';
      const products = [mockProduct];

      mockProductsService.findByMarket.mockResolvedValue(products);
      const result = await controller.findByMarket(marketId);
      expect(result).toEqual(products);
      expect(mockProductsService.findByMarket).toHaveBeenCalledWith(marketId);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockProduct);
      expect(mockProductsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };
      const updatedProduct = { ...mockProduct, name: 'Updated Product' };

      mockProductsService.update.mockResolvedValue(updatedProduct);
      const result = await controller.update('1', updateProductDto, mockUser);
      expect(result).toEqual(updatedProduct);
      expect(mockProductsService.update).toHaveBeenCalledWith(
        '1',
        updateProductDto,
        mockUser.id,
      );
    });
  });

  describe('approve', () => {
    it('should approve a product', async () => {
      const approvedProduct = { ...mockProduct, isApproved: true };

      mockProductsService.approve.mockResolvedValue(approvedProduct);
      const result = await controller.approve('1');
      expect(result).toEqual(approvedProduct);
      expect(mockProductsService.approve).toHaveBeenCalledWith('1');
    });
  });

  describe('reject', () => {
    it('should reject a product', async () => {
      mockProductsService.reject.mockResolvedValue(undefined);
      const result = await controller.reject('1');
      expect(result).toBeUndefined();
      expect(mockProductsService.reject).toHaveBeenCalledWith('1');
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);
      const result = await controller.remove('1');
      expect(result).toBeUndefined();
      expect(mockProductsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
