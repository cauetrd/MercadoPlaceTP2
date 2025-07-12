import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: PrismaService;

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    currentPrice: 10.99,
    imageUrl: 'http://example.com/image.jpg',
    isValid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
    market: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        name: 'New Product',
        description: 'New Description',
        currentPrice: 15.99,
        imageUrl: 'http://example.com/new-image.jpg',
      };

      mockPrismaService.product.findUnique.mockResolvedValue(null);
      mockPrismaService.product.create.mockResolvedValue({
        ...mockProduct,
        ...createProductDto,
        priceHistory: [{ price: 15.99 }],
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.create(createProductDto, 'user-id');

      expect(result).toBeDefined();
      expect(mockPrismaService.product.create).toHaveBeenCalled();
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if product name already exists', async () => {
      const createProductDto = {
        name: 'Existing Product',
        description: 'Description',
        currentPrice: 15.99,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.create(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.findAll();

      expect(result).toEqual([mockProduct]);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: { isValid: true },
        orderBy: { createdAt: 'desc' },
        include: {
          markets: false,
          priceHistory: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
    });

    it('should filter products by name', async () => {
      const searchDto = { name: 'test' };
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);

      const result = await service.findAll(searchDto);

      expect(result).toEqual([mockProduct]);
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          isValid: true,
          name: {
            contains: 'test',
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          markets: false,
          priceHistory: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = {
        name: 'Updated Product',
        currentPrice: 20.99,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        ...updateProductDto,
      });
      mockPrismaService.user.update.mockResolvedValue({});

      const result = await service.update('1', updateProductDto, 'user-id');

      expect(result).toBeDefined();
      expect(mockPrismaService.product.update).toHaveBeenCalled();
      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      const updateProductDto = { name: 'Updated Product' };
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.update('999', updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('approve', () => {
    it('should approve a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        isValid: true,
      });

      const result = await service.approve('1');

      expect(result.isValid).toBe(true);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isValid: true },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.approve('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      await service.remove('1');

      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
