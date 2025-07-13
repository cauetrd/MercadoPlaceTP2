import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from '../auth/admin.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
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

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
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
      const products = [mockProduct];

      mockProductsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll({});

      expect(result).toEqual(products);
      expect(mockProductsService.findAll).toHaveBeenCalledWith({});
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
      const updateProductDto = { name: 'Updated Product' };
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

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(result).toBeUndefined();
      expect(mockProductsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
