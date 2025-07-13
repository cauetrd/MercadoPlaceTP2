import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();

    // Clean database before each test
    // Order matters: delete children first, then parents
    try {
      await prismaService.userShoppingList.deleteMany();
    } catch (error) {
      // Table might not exist yet
    }
    try {
      await prismaService.purchasedProduct.deleteMany();
    } catch (error) {
      // Table might not exist yet
    }
    try {
      await prismaService.purchase.deleteMany();
    } catch (error) {
      // Table might not exist yet
    }
    try {
      await prismaService.reviewMarket.deleteMany();
    } catch (error) {
      // Table might not exist yet
    }
    try {
      await prismaService.marketProduct.deleteMany();
    } catch (error) {
      // Table might not exist yet
    }
    try {
      await prismaService.user.deleteMany();
    } catch (error) {
      // Table might not exist yet
    }
    try {
      await prismaService.product.deleteMany();
    } catch (error) {
      // Table might not exist yet
    }
    try {
      await prismaService.market.deleteMany();
    } catch (error) {
      // Table might not exist yet
    }
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('Authentication', () => {
    it('/auth/register (POST)', async () => {
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        latitude: -15.7942,
        longitude: -47.8822,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toBe(createUserDto.email);
      expect(response.body.user).not.toHaveProperty('password');

      // Store for other tests
      authToken = response.body.access_token;
      userId = response.body.user.id;
    });

    it('/auth/login (POST)', async () => {
      // First create a user
      const createUserDto = {
        email: 'login@example.com',
        name: 'Login User',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);

      // Then login
      const loginDto = {
        email: 'login@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.email).toBe(loginDto.email);
    });

    it('/users/me (GET)', async () => {
      // First register and get token
      const createUserDto = {
        email: 'profile@example.com',
        name: 'Profile User',
        password: 'password123',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);

      const token = registerResponse.body.access_token;

      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('Products', () => {
    beforeEach(async () => {
      // Create a user and get token for product tests
      const createUserDto = {
        email: 'productuser@example.com',
        name: 'Product User',
        password: 'password123',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);

      authToken = registerResponse.body.access_token;
      userId = registerResponse.body.user.id;
    });

    it('/products (POST)', async () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'A test product',
        imageUrl: 'http://example.com/image.jpg',
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createProductDto)
        .expect(201);

      expect(response.body.name).toBe(createProductDto.name);
      expect(response.body.description).toBe(createProductDto.description);
    });

    it('/products (GET)', async () => {
      // First create a product
      const createProductDto = {
        name: 'Listed Product for GET Test',
        description: 'A product to be listed',
      };

      const productResponse = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createProductDto);

      // Make user admin to create market
      await prismaService.user.update({
        where: { id: userId },
        data: { isAdmin: true },
      });

      // Create a market
      const createMarketDto = {
        name: 'GET Test Market',
        latitude: -15.7942,
        longitude: -47.8822,
      };

      const marketResponse = await request(app.getHttpServer())
        .post('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createMarketDto);

      // Create a market-product
      const createMarketProductDto = {
        marketId: marketResponse.body.id,
        productId: productResponse.body.id,
        price: 25.99,
      };

      const marketProductResponse = await request(app.getHttpServer())
        .post('/market-products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createMarketProductDto);

      expect(marketProductResponse.status).toBe(201);

      // Approve the market-product as admin (user is already admin)
      await request(app.getHttpServer())
        .patch(`/market-products/${marketProductResponse.body.id}/approve`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Now list products
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/products/search with name filter (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/products?name=test')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/products/search with location parameters (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/products?userLatitude=-15.7942&userLongitude=-47.8822')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('/products/search with all parameters (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get(
          '/products?name=test&sortBy=price&sortOrder=asc&userLatitude=-15.7942&userLongitude=-47.8822',
        )
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Shopping List', () => {
    let productId: string;

    beforeEach(async () => {
      // Create user and product for shopping list tests
      const createUserDto = {
        email: 'shoppinguser@example.com',
        name: 'Shopping User',
        password: 'password123',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);

      authToken = registerResponse.body.access_token;
      userId = registerResponse.body.user.id;

      // Create and approve a product
      const createProductDto = {
        name: 'Shopping Product',
        description: 'A product for shopping',
      };

      const productResponse = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createProductDto);

      productId = productResponse.body.id;

      // No need to approve products anymore - only market-products need approval
    });

    it('/shopping-list (POST)', async () => {
      const addItemDto = {
        productId: productId,
      };

      const response = await request(app.getHttpServer())
        .post('/shopping-list')
        .set('Authorization', `Bearer ${authToken}`)
        .send(addItemDto)
        .expect(201);

      expect(response.body.productId).toBe(productId);
      expect(response.body.userId).toBe(userId);
    });

    it('/shopping-list (GET)', async () => {
      // First add an item
      const addItemDto = {
        productId: productId,
      };

      await request(app.getHttpServer())
        .post('/shopping-list')
        .set('Authorization', `Bearer ${authToken}`)
        .send(addItemDto);

      // Then get the shopping list
      const response = await request(app.getHttpServer())
        .get('/shopping-list')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].productId).toBe(productId);
    });
  });

  describe('Error handling', () => {
    it('should return 401 for protected routes without token', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('should return 400 for invalid data', async () => {
      const invalidUserDto = {
        email: 'invalid-email',
        password: '123', // Too short
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUserDto)
        .expect(400);
    });
  });
});
