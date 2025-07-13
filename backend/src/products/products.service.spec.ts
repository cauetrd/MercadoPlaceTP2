import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    product: {
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
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
      };

      const expectedProduct = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        imageUrl: 'https://example.com/image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.findUnique.mockResolvedValue(null);
      mockPrismaService.product.create.mockResolvedValue(expectedProduct);
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.create(createProductDto, 'user-id');

      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { points: { increment: 1 } },
      });
    });

    it('should throw BadRequestException if product name already exists', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
      };

      mockPrismaService.product.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.create(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const expectedProducts = [
        {
          id: '1',
          name: 'Test Product 1',
          description: 'Test Description 1',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(expectedProducts);

      const result = await service.findAll();

      expect(result).toEqual(expectedProducts);
    });

    it('should filter products by name', async () => {
      const expectedProducts = [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.product.findMany.mockResolvedValue(expectedProducts);

      const result = await service.findAll({ name: 'Test' });

      expect(result).toEqual(expectedProducts);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: { name: { contains: 'Test' } },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const expectedProduct = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.findUnique.mockResolvedValue(expectedProduct);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
      };

      const existingProduct = {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
      };

      const updatedProduct = {
        id: '1',
        name: 'Updated Product',
        description: 'Updated Description',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.findUnique
        .mockResolvedValueOnce(existingProduct)
        .mockResolvedValueOnce(null);
      mockPrismaService.product.update.mockResolvedValue(updatedProduct);
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.update('1', updateProductDto, 'user-id');

      expect(result).toEqual(updatedProduct);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: { points: { increment: 1 } },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const existingProduct = { id: '1' };

      mockPrismaService.product.findUnique.mockResolvedValue(existingProduct);
      mockPrismaService.product.delete.mockResolvedValue(existingProduct);

      await service.remove('1');

      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
