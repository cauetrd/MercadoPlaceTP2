import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { MarketsService } from './markets.service';

describe('MarketsService', () => {
  let service: MarketsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    market: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<MarketsService>(MarketsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new market', async () => {
      const createMarketDto = {
        name: 'Test Market',
        latitude: -15.7942,
        longitude: -47.8822,
      };

      const expectedMarket = {
        id: '1',
        name: 'Test Market',
        latitude: -15.7942,
        longitude: -47.8822,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.market.create.mockResolvedValue(expectedMarket);

      const result = await service.create(createMarketDto);

      expect(result).toEqual(expectedMarket);
      expect(mockPrismaService.market.create).toHaveBeenCalledWith({
        data: createMarketDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return all markets', async () => {
      const expectedMarkets = [
        {
          id: '1',
          name: 'Test Market 1',
          latitude: -15.7942,
          longitude: -47.8822,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Test Market 2',
          latitude: -15.8,
          longitude: -47.9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.market.findMany.mockResolvedValue(expectedMarkets);

      const result = await service.findAll();

      expect(result).toEqual(expectedMarkets);
      expect(mockPrismaService.market.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findNearby', () => {
    it('should return nearby markets within radius', async () => {
      const markets = [
        {
          id: '1',
          name: 'Close Market',
          latitude: -15.7942,
          longitude: -47.8822,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Far Market',
          latitude: -16.0,
          longitude: -48.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.market.findMany.mockResolvedValue(markets);

      const result = await service.findNearby(-15.7942, -47.8822, 10);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Close Market');
    });
  });

  describe('findOne', () => {
    it('should return a market by id', async () => {
      const expectedMarket = {
        id: '1',
        name: 'Test Market',
        latitude: -15.7942,
        longitude: -47.8822,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
        reviews: [],
      };

      mockPrismaService.market.findUnique.mockResolvedValue(expectedMarket);

      const result = await service.findOne('1');

      expect(result).toEqual(expectedMarket);
      expect(mockPrismaService.market.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          products: {
            where: { isValid: true },
            include: { product: true },
          },
          reviews: {
            include: {
              user: {
                select: { id: true, name: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });

    it('should throw NotFoundException if market not found', async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a market', async () => {
      const updateMarketDto = {
        name: 'Updated Market',
        latitude: -15.8,
        longitude: -47.9,
      };

      const existingMarket = {
        id: '1',
        name: 'Test Market',
        latitude: -15.7942,
        longitude: -47.8822,
      };

      const updatedMarket = {
        id: '1',
        name: 'Updated Market',
        latitude: -15.8,
        longitude: -47.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.market.findUnique.mockResolvedValue(existingMarket);
      mockPrismaService.market.update.mockResolvedValue(updatedMarket);

      const result = await service.update('1', updateMarketDto);

      expect(result).toEqual(updatedMarket);
      expect(mockPrismaService.market.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateMarketDto,
      });
    });

    it('should throw NotFoundException if market not found', async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a market', async () => {
      const existingMarket = { id: '1' };

      mockPrismaService.market.findUnique.mockResolvedValue(existingMarket);
      mockPrismaService.market.delete.mockResolvedValue(existingMarket);

      await service.remove('1');

      expect(mockPrismaService.market.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if market not found', async () => {
      mockPrismaService.market.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
