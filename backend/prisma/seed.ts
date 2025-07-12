import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mercadoplace.com' },
    update: {},
    create: {
      email: 'admin@mercadoplace.com',
      name: 'Administrador',
      password: adminPassword,
      isAdmin: true,
      points: 0,
      latitude: -15.7942,
      longitude: -47.8822,
    },
  });

  // Criar usuário comum
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@mercadoplace.com' },
    update: {},
    create: {
      email: 'user@mercadoplace.com',
      name: 'Usuário Teste',
      password: userPassword,
      isAdmin: false,
      points: 5,
      latitude: -15.8,
      longitude: -47.9,
    },
  });

  // Criar mercados
  const supermarket1 = await prisma.market.upsert({
    where: { id: 'market-1' },
    update: {},
    create: {
      id: 'market-1',
      name: 'Supermercado Central',
      latitude: -15.7942,
      longitude: -47.8822,
    },
  });

  const supermarket2 = await prisma.market.upsert({
    where: { id: 'market-2' },
    update: {},
    create: {
      id: 'market-2',
      name: 'Mercado do Bairro',
      latitude: -15.81,
      longitude: -47.91,
    },
  });

  const supermarket3 = await prisma.market.upsert({
    where: { id: 'market-3' },
    update: {},
    create: {
      id: 'market-3',
      name: 'Extra Hipermercado',
      latitude: -15.78,
      longitude: -47.85,
    },
  });

  // Criar produtos
  const products = [
    {
      id: 'product-1',
      name: 'Arroz Integral 1kg',
      description: 'Arroz integral orgânico de alta qualidade',
      currentPrice: 8.99,
      imageUrl: 'https://example.com/arroz.jpg',
      isValid: true,
    },
    {
      id: 'product-2',
      name: 'Feijão Preto 1kg',
      description: 'Feijão preto selecionado',
      currentPrice: 6.5,
      imageUrl: 'https://example.com/feijao.jpg',
      isValid: true,
    },
    {
      id: 'product-3',
      name: 'Óleo de Soja 900ml',
      description: 'Óleo de soja refinado',
      currentPrice: 4.99,
      imageUrl: 'https://example.com/oleo.jpg',
      isValid: true,
    },
    {
      id: 'product-4',
      name: 'Açúcar Cristal 1kg',
      description: 'Açúcar cristal branco',
      currentPrice: 3.99,
      imageUrl: 'https://example.com/acucar.jpg',
      isValid: true,
    },
    {
      id: 'product-5',
      name: 'Café Torrado 500g',
      description: 'Café torrado e moído tradicional',
      currentPrice: 12.99,
      imageUrl: 'https://example.com/cafe.jpg',
      isValid: true,
    },
    {
      id: 'product-6',
      name: 'Leite Integral 1L',
      description: 'Leite integral UHT',
      currentPrice: 4.5,
      imageUrl: 'https://example.com/leite.jpg',
      isValid: false, // Produto pendente de aprovação
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { id: productData.id },
      update: {},
      create: {
        ...productData,
        priceHistory: {
          create: {
            price: productData.currentPrice,
          },
        },
      },
    });

    // Conectar produtos aos mercados (alguns produtos em alguns mercados)
    if (productData.isValid) {
      await prisma.market.update({
        where: { id: supermarket1.id },
        data: {
          availableProducts: {
            connect: { id: product.id },
          },
        },
      });

      if (productData.id !== 'product-5') {
        await prisma.market.update({
          where: { id: supermarket2.id },
          data: {
            availableProducts: {
              connect: { id: product.id },
            },
          },
        });
      }

      if (['product-1', 'product-3', 'product-5'].includes(productData.id)) {
        await prisma.market.update({
          where: { id: supermarket3.id },
          data: {
            availableProducts: {
              connect: { id: product.id },
            },
          },
        });
      }
    }
  }

  // Criar algumas avaliações
  await prisma.reviewMarket.upsert({
    where: {
      userId_marketId: {
        userId: user.id,
        marketId: supermarket1.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      marketId: supermarket1.id,
      rating: 5,
      comment: 'Excelente mercado! Produtos frescos e bom atendimento.',
    },
  });

  await prisma.reviewMarket.upsert({
    where: {
      userId_marketId: {
        userId: user.id,
        marketId: supermarket2.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      marketId: supermarket2.id,
      rating: 4,
      comment: 'Bom mercado de bairro, preços justos.',
    },
  });

  // Adicionar alguns itens na lista de compras do usuário
  await prisma.itemListaDeCompra.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: 'product-1',
      },
    },
    update: {},
    create: {
      userId: user.id,
      productId: 'product-1',
      quantity: 2,
      isSelected: true,
    },
  });

  await prisma.itemListaDeCompra.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId: 'product-2',
      },
    },
    update: {},
    create: {
      userId: user.id,
      productId: 'product-2',
      quantity: 1,
      isSelected: false,
    },
  });

  // Criar uma compra finalizada histórica
  const purchase = await prisma.compraFinalizada.create({
    data: {
      userId: user.id,
      totalCost: 25.48,
      purchasedItems: {
        create: [
          {
            productName: 'Arroz Integral 1kg',
            priceAtTime: 8.99,
            quantity: 2,
            productId: 'product-1',
          },
          {
            productName: 'Óleo de Soja 900ml',
            priceAtTime: 4.99,
            quantity: 1,
            productId: 'product-3',
          },
          {
            productName: 'Açúcar Cristal 1kg',
            priceAtTime: 3.5, // Preço histórico diferente
            quantity: 1,
            productId: 'product-4',
          },
        ],
      },
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('📊 Dados criados:');
  console.log(`👤 Usuários: Admin (${admin.email}) e Usuário (${user.email})`);
  console.log(
    `🏪 Mercados: ${supermarket1.name}, ${supermarket2.name}, ${supermarket3.name}`,
  );
  console.log(`📦 Produtos: ${products.length} produtos criados`);
  console.log(`⭐ Avaliações: 2 avaliações criadas`);
  console.log(`🛒 Lista de compras: 2 itens na lista do usuário`);
  console.log(`💰 Compras: 1 compra histórica criada`);
  console.log('');
  console.log('🔑 Credenciais para teste:');
  console.log('Admin: admin@mercadoplace.com / admin123');
  console.log('Usuário: user@mercadoplace.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
