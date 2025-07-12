import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUserDto,
  LoginDto,
  UserResponseDto,
} from '../users/dto/user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        latitude: -15.7942,
        longitude: -47.8822,
      };

      const expectedResponse = {
        user: mockUser,
        access_token: 'jwt-token',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);
      const result = await controller.register(createUserDto);
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        user: mockUser,
        access_token: 'jwt-token',
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);
      const result = await controller.login(loginDto);
      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getProfile', () => {
    it('should return the current user profile', async () => {
      const result = controller.getProfile(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
