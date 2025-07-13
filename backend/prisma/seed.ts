import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data
  await prisma.userShoppingList.deleteMany();
  await prisma.purchasedProduct.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.reviewMarket.deleteMany();
  await prisma.marketProduct.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.market.deleteMany();

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mercadoplace.com',
      name: 'Admin User',
      password: await bcrypt.hash('admin123', 10),
      isAdmin: true,
      points: 100,
      latitude: -15.7942,
      longitude: -47.8822,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      email: 'user@mercadoplace.com',
      name: 'Regular User',
      password: await bcrypt.hash('user123', 10),
      isAdmin: false,
      points: 25,
      latitude: -15.795,
      longitude: -47.883,
    },
  });

  const testUser = await prisma.user.create({
    data: {
      email: 'test@mercadoplace.com',
      name: 'Test User',
      password: await bcrypt.hash('test123', 10),
      isAdmin: false,
      points: 10,
      latitude: -15.796,
      longitude: -47.884,
    },
  });

  console.log('✅ Users created');

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Arroz Integral 1kg',
        description: 'Arroz integral orgânico, rico em fibras e nutrientes',
        imageUrl: 'https://example.com/arroz-integral.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Feijão Preto 1kg',
        description: 'Feijão preto tradicional, fonte de proteína vegetal',
        imageUrl: 'https://example.com/feijao-preto.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Leite Integral 1L',
        description: 'Leite integral pasteurizado, rico em cálcio',
        imageUrl: 'https://example.com/leite-integral.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pão Francês',
        description: 'Pão francês tradicional, fresquinho',
        imageUrl: 'https://example.com/pao-frances.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Banana Nanica 1kg',
        description: 'Banana nanica madura, rica em potássio',
        imageUrl: 'https://example.com/banana-nanica.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Maçã Fuji 1kg',
        description: 'Maçã fuji doce e crocante, importada',
        imageUrl: 'https://example.com/maca-fuji.jpg',
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create Markets
  const markets = await Promise.all([
    prisma.market.create({
      data: {
        name: 'Supermercado Central',
        latitude: -15.7942,
        longitude: -47.8822,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Mercado do Bairro',
        latitude: -15.795,
        longitude: -47.883,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Hipermercado Extra',
        latitude: -15.796,
        longitude: -47.884,
      },
    }),
  ]);

  console.log('✅ Markets created');

  // Create MarketProducts (some approved, some pending)
  const marketProducts = await Promise.all([
    // Supermercado Central
    prisma.marketProduct.create({
      data: {
        marketId: markets[0].id,
        productId: products[0].id, // Arroz Integral
        price: 8.99,
        isValid: true,
      },
    }),
    prisma.marketProduct.create({
      data: {
        marketId: markets[0].id,
        productId: products[1].id, // Feijão Preto
        price: 6.5,
        isValid: true,
      },
    }),
    prisma.marketProduct.create({
      data: {
        marketId: markets[0].id,
        productId: products[2].id, // Leite Integral
        price: 4.99,
        isValid: true,
      },
    }),
    // Mercado do Bairro
    prisma.marketProduct.create({
      data: {
        marketId: markets[1].id,
        productId: products[0].id, // Arroz Integral
        price: 9.5,
        isValid: true,
      },
    }),
    prisma.marketProduct.create({
      data: {
        marketId: markets[1].id,
        productId: products[3].id, // Pão Francês
        price: 0.8,
        isValid: true,
      },
    }),
    prisma.marketProduct.create({
      data: {
        marketId: markets[1].id,
        productId: products[4].id, // Banana Nanica
        price: 3.2,
        isValid: false, // Pending approval
      },
    }),
    // Hipermercado Extra
    prisma.marketProduct.create({
      data: {
        marketId: markets[2].id,
        productId: products[2].id, // Leite Integral
        price: 4.5,
        isValid: true,
      },
    }),
    prisma.marketProduct.create({
      data: {
        marketId: markets[2].id,
        productId: products[5].id, // Maçã Fuji
        price: 7.8,
        isValid: true,
      },
    }),
  ]);

  console.log('✅ Market products created');

  // Create Reviews
  await Promise.all([
    prisma.reviewMarket.create({
      data: {
        userId: regularUser.id,
        marketId: markets[0].id,
        rating: 5,
        comment: 'Excelente mercado! Produtos frescos e bom atendimento.',
      },
    }),
    prisma.reviewMarket.create({
      data: {
        userId: testUser.id,
        marketId: markets[0].id,
        rating: 4,
        comment: 'Bom mercado, preços justos.',
      },
    }),
    prisma.reviewMarket.create({
      data: {
        userId: regularUser.id,
        marketId: markets[1].id,
        rating: 3,
        comment: 'Mercado razoável, poderia melhorar o atendimento.',
      },
    }),
  ]);

  console.log('✅ Reviews created');

  // Create Purchase History
  const purchase1 = await prisma.purchase.create({
    data: {
      userId: regularUser.id,
      totalPrice: 20.48,
      createdAt: new Date('2024-01-15T10:30:00Z'),
    },
  });

  const purchase2 = await prisma.purchase.create({
    data: {
      userId: testUser.id,
      totalPrice: 15.3,
      createdAt: new Date('2024-01-20T15:45:00Z'),
    },
  });

  // Create Purchased Products
  await Promise.all([
    prisma.purchasedProduct.create({
      data: {
        userId: regularUser.id,
        productId: products[0].id, // Arroz Integral
        marketId: markets[0].id,
        purchaseId: purchase1.id,
        price: 8.99,
      },
    }),
    prisma.purchasedProduct.create({
      data: {
        userId: regularUser.id,
        productId: products[1].id, // Feijão Preto
        marketId: markets[0].id,
        purchaseId: purchase1.id,
        price: 6.5,
      },
    }),
    prisma.purchasedProduct.create({
      data: {
        userId: regularUser.id,
        productId: products[2].id, // Leite Integral
        marketId: markets[0].id,
        purchaseId: purchase1.id,
        price: 4.99,
      },
    }),
    prisma.purchasedProduct.create({
      data: {
        userId: testUser.id,
        productId: products[2].id, // Leite Integral
        marketId: markets[2].id,
        purchaseId: purchase2.id,
        price: 4.5,
      },
    }),
    prisma.purchasedProduct.create({
      data: {
        userId: testUser.id,
        productId: products[5].id, // Maçã Fuji
        marketId: markets[2].id,
        purchaseId: purchase2.id,
        price: 7.8,
      },
    }),
  ]);

  console.log('✅ Purchase history created');

  // Create Shopping List items
  await Promise.all([
    prisma.userShoppingList.create({
      data: {
        userId: regularUser.id,
        productId: products[3].id, // Pão Francês
      },
    }),
    prisma.userShoppingList.create({
      data: {
        userId: regularUser.id,
        productId: products[4].id, // Banana Nanica
      },
    }),
    prisma.userShoppingList.create({
      data: {
        userId: testUser.id,
        productId: products[0].id, // Arroz Integral
      },
    }),
    prisma.userShoppingList.create({
      data: {
        userId: testUser.id,
        productId: products[1].id, // Feijão Preto
      },
    }),
  ]);

  console.log('✅ Shopping list items created');

  // Display summary
  console.log('\n🎉 Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`👥 Users: ${await prisma.user.count()}`);
  console.log(`📦 Products: ${await prisma.product.count()}`);
  console.log(`🏪 Markets: ${await prisma.market.count()}`);
  console.log(`🛒 Market Products: ${await prisma.marketProduct.count()}`);
  console.log(`⭐ Reviews: ${await prisma.reviewMarket.count()}`);
  console.log(`💳 Purchases: ${await prisma.purchase.count()}`);
  console.log(
    `🛍️ Shopping List Items: ${await prisma.userShoppingList.count()}`,
  );

  console.log('\n🔑 Test Accounts:');
  console.log('Admin: admin@mercadoplace.com / admin123');
  console.log('User: user@mercadoplace.com / user123');
  console.log('Test: test@mercadoplace.com / test123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
