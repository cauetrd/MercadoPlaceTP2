import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';

describe('MarketsController', () => {
  let controller: MarketsController;
  let service: MarketsService;

  const mockMarketsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findNearby: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketsController],
      providers: [
        {
          provide: MarketsService,
          useValue: mockMarketsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<MarketsController>(MarketsController);
    service = module.get<MarketsService>(MarketsService);
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

      mockMarketsService.create.mockResolvedValue(expectedMarket);

      const result = await controller.create(createMarketDto);

      expect(result).toEqual(expectedMarket);
      expect(mockMarketsService.create).toHaveBeenCalledWith(createMarketDto);
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

      mockMarketsService.findAll.mockResolvedValue(expectedMarkets);

      const result = await controller.findAll();

      expect(result).toEqual(expectedMarkets);
      expect(mockMarketsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findNearby', () => {
    it('should return nearby markets', async () => {
      const expectedMarkets = [
        {
          id: '1',
          name: 'Close Market',
          latitude: -15.7942,
          longitude: -47.8822,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockMarketsService.findNearby.mockResolvedValue(expectedMarkets);

      const result = await controller.findNearby(-15.7942, -47.8822, 10);

      expect(result).toEqual(expectedMarkets);
      expect(mockMarketsService.findNearby).toHaveBeenCalledWith(
        -15.7942,
        -47.8822,
        10,
      );
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

      mockMarketsService.findOne.mockResolvedValue(expectedMarket);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedMarket);
      expect(mockMarketsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a market', async () => {
      const updateMarketDto = {
        name: 'Updated Market',
        latitude: -15.8,
        longitude: -47.9,
      };

      const updatedMarket = {
        id: '1',
        name: 'Updated Market',
        latitude: -15.8,
        longitude: -47.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMarketsService.update.mockResolvedValue(updatedMarket);

      const result = await controller.update('1', updateMarketDto);

      expect(result).toEqual(updatedMarket);
      expect(mockMarketsService.update).toHaveBeenCalledWith(
        '1',
        updateMarketDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a market', async () => {
      await controller.remove('1');

      expect(mockMarketsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
