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

    it('/shopping-list/multiple (POST)', async () => {
      // Create another product
      const createProductDto2 = {
        name: 'Shopping Product 2',
        description: 'Another product for shopping',
      };

      const productResponse2 = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createProductDto2);

      const addMultipleDto = {
        productIds: [productId, productResponse2.body.id],
      };

      const response = await request(app.getHttpServer())
        .post('/shopping-list/multiple')
        .set('Authorization', `Bearer ${authToken}`)
        .send(addMultipleDto)
        .expect(201);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    it('/shopping-list/compare (POST)', async () => {
      // Make user admin to create market and market-product
      await prismaService.user.update({
        where: { id: userId },
        data: { isAdmin: true },
      });

      // Create a market
      const createMarketDto = {
        name: 'Compare Test Market',
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
        productId: productId,
        price: 15.99,
      };

      const marketProductResponse = await request(app.getHttpServer())
        .post('/market-products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createMarketProductDto);

      // Approve the market-product
      await request(app.getHttpServer())
        .patch(`/market-products/${marketProductResponse.body.id}/approve`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Compare prices
      const compareDto = {
        productIds: [productId],
      };

      const response = await request(app.getHttpServer())
        .post('/shopping-list/compare')
        .set('Authorization', `Bearer ${authToken}`)
        .send(compareDto)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/shopping-list/:productId (DELETE)', async () => {
      // First add an item
      const addItemDto = {
        productId: productId,
      };

      await request(app.getHttpServer())
        .post('/shopping-list')
        .set('Authorization', `Bearer ${authToken}`)
        .send(addItemDto);

      // Then remove it
      await request(app.getHttpServer())
        .delete(`/shopping-list/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify it's gone
      const response = await request(app.getHttpServer())
        .get('/shopping-list')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.length).toBe(0);
    });

    it('/shopping-list (DELETE)', async () => {
      // First add an item
      const addItemDto = {
        productId: productId,
      };

      await request(app.getHttpServer())
        .post('/shopping-list')
        .set('Authorization', `Bearer ${authToken}`)
        .send(addItemDto);

      // Clear shopping list
      await request(app.getHttpServer())
        .delete('/shopping-list')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify it's empty
      const response = await request(app.getHttpServer())
        .get('/shopping-list')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.length).toBe(0);
    });
  });

  describe('Purchase', () => {
    let productId: string;
    let marketId: string;

    beforeEach(async () => {
      // Create user for purchase tests
      const createUserDto = {
        email: 'purchaseuser@example.com',
        name: 'Purchase User',
        password: 'password123',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);

      authToken = registerResponse.body.access_token;
      userId = registerResponse.body.user.id;

      // Make user admin to create market
      await prismaService.user.update({
        where: { id: userId },
        data: { isAdmin: true },
      });

      // Create a product
      const createProductDto = {
        name: 'Purchase Product',
        description: 'A product for purchase',
      };

      const productResponse = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createProductDto);

      productId = productResponse.body.id;

      // Create a market
      const createMarketDto = {
        name: 'Purchase Test Market',
        latitude: -15.7942,
        longitude: -47.8822,
      };

      const marketResponse = await request(app.getHttpServer())
        .post('/markets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createMarketDto);

      marketId = marketResponse.body.id;
    });

    it('/purchase (POST)', async () => {
      const createPurchaseDto = {
        items: [
          {
            productId: productId,
            marketId: marketId,
            price: 19.99,
          },
        ],
        purchaseDate: '2023-12-01T10:00:00.000Z',
      };

      const response = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPurchaseDto)
        .expect(201);

      expect(response.body.totalPrice).toBe(19.99);
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].productId).toBe(productId);
      expect(response.body.products[0].marketId).toBe(marketId);
    });

    it('/purchase/my-purchases (GET)', async () => {
      // First create a purchase
      const createPurchaseDto = {
        items: [
          {
            productId: productId,
            marketId: marketId,
            price: 19.99,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPurchaseDto);

      // Then get user purchases
      const response = await request(app.getHttpServer())
        .get('/purchase/my-purchases')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].totalPrice).toBe(19.99);
    });

    it('/purchase/my-statistics (GET)', async () => {
      // First create a purchase
      const createPurchaseDto = {
        items: [
          {
            productId: productId,
            marketId: marketId,
            price: 19.99,
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPurchaseDto);

      // Then get statistics
      const response = await request(app.getHttpServer())
        .get('/purchase/my-statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.totalPurchases).toBe(1);
      expect(response.body.totalSpent).toBe(19.99);
      expect(response.body.totalProducts).toBe(1);
    });

    it('/purchase/:id (GET)', async () => {
      // First create a purchase
      const createPurchaseDto = {
        items: [
          {
            productId: productId,
            marketId: marketId,
            price: 19.99,
          },
        ],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPurchaseDto);

      const purchaseId = createResponse.body.id;

      // Then get the purchase
      const response = await request(app.getHttpServer())
        .get(`/purchase/${purchaseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(purchaseId);
      expect(response.body.totalPrice).toBe(19.99);
    });

    it('/purchase/:id (PATCH) - admin only', async () => {
      // First create a purchase
      const createPurchaseDto = {
        items: [
          {
            productId: productId,
            marketId: marketId,
            price: 19.99,
          },
        ],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPurchaseDto);

      const purchaseId = createResponse.body.id;

      // Update the purchase
      const updatePurchaseDto = {
        items: [
          {
            productId: productId,
            marketId: marketId,
            price: 25.99,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .patch(`/purchase/${purchaseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatePurchaseDto)
        .expect(200);

      expect(response.body.totalPrice).toBe(25.99);
    });

    it('/purchase/:id (DELETE) - admin only', async () => {
      // First create a purchase
      const createPurchaseDto = {
        items: [
          {
            productId: productId,
            marketId: marketId,
            price: 19.99,
          },
        ],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPurchaseDto);

      const purchaseId = createResponse.body.id;

      // Delete the purchase
      await request(app.getHttpServer())
        .delete(`/purchase/${purchaseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // Verify it's gone
      await request(app.getHttpServer())
        .get(`/purchase/${purchaseId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
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
