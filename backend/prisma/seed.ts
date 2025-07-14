import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data - Try/catch for tables that might not exist
  try {
    await prisma.userShoppingList.deleteMany();
  } catch (e) {
    console.log('UserShoppingList table cleanup skipped (table may not exist)');
  }

  try {
    await prisma.purchasedProduct.deleteMany();
  } catch (e) {
    console.log('PurchasedProduct table cleanup skipped (table may not exist)');
  }

  try {
    await prisma.purchase.deleteMany();
  } catch (e) {
    console.log('Purchase table cleanup skipped (table may not exist)');
  }

  try {
    await prisma.reviewMarket.deleteMany();
  } catch (e) {
    console.log('ReviewMarket table cleanup skipped (table may not exist)');
  }

  try {
    await prisma.marketProduct.deleteMany();
  } catch (e) {
    console.log('MarketProduct table cleanup skipped (table may not exist)');
  }

  try {
    await prisma.user.deleteMany();
  } catch (e) {
    console.log('User table cleanup skipped (table may not exist)');
  }

  try {
    await prisma.product.deleteMany();
  } catch (e) {
    console.log('Product table cleanup skipped (table may not exist)');
  }

  try {
    await prisma.market.deleteMany();
  } catch (e) {
    console.log('Market table cleanup skipped (table may not exist)');
  }

  // Create Users (expanded)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@mercadoplace.com',
        name: 'Admin User',
        password: await bcrypt.hash('admin123', 10),
        isAdmin: true,
        points: 100,
        latitude: -15.7942,
        longitude: -47.8822,
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.silva@email.com',
        name: 'Maria Silva',
        password: await bcrypt.hash('user123', 10),
        isAdmin: false,
        points: 150,
        latitude: -15.795,
        longitude: -47.883,
      },
    }),
    prisma.user.create({
      data: {
        email: 'joao.santos@email.com',
        name: 'João Santos',
        password: await bcrypt.hash('user123', 10),
        isAdmin: false,
        points: 75,
        latitude: -15.796,
        longitude: -47.884,
      },
    }),
    prisma.user.create({
      data: {
        email: 'ana.costa@email.com',
        name: 'Ana Costa',
        password: await bcrypt.hash('user123', 10),
        isAdmin: false,
        points: 200,
        latitude: -15.799,
        longitude: -47.886,
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos.pereira@email.com',
        name: 'Carlos Pereira',
        password: await bcrypt.hash('user123', 10),
        isAdmin: false,
        points: 50,
        latitude: -15.791,
        longitude: -47.879,
      },
    }),
    prisma.user.create({
      data: {
        email: 'fernanda.lima@email.com',
        name: 'Fernanda Lima',
        password: await bcrypt.hash('user123', 10),
        isAdmin: false,
        points: 125,
        latitude: -15.797,
        longitude: -47.885,
      },
    }),
    prisma.user.create({
      data: {
        email: 'rodrigo.alves@email.com',
        name: 'Rodrigo Alves',
        password: await bcrypt.hash('user123', 10),
        isAdmin: false,
        points: 90,
        latitude: -15.792,
        longitude: -47.88,
      },
    }),
    prisma.user.create({
      data: {
        email: 'lucia.mendes@email.com',
        name: 'Lucia Mendes',
        password: await bcrypt.hash('user123', 10),
        isAdmin: false,
        points: 175,
        latitude: -15.798,
        longitude: -47.887,
      },
    }),
  ]);

  console.log('✅ Users created');

  // Create Products (significantly expanded)
  const products = await Promise.all([
    // Grãos e Cereais
    prisma.product.create({
      data: {
        name: 'Arroz Integral 1kg',
        description: 'Arroz integral orgânico, rico em fibras e nutrientes',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-fCaWrQ5r9l0MJD3WeDdcWQrSAc9AmQDGIA&s',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Arroz Branco 5kg',
        description: 'Arroz branco tipo 1, grãos longos',
        imageUrl: 'https://example.com/arroz-branco.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Feijão Preto 1kg',
        description: 'Feijão preto tradicional, fonte de proteína vegetal',
        imageUrl: 'https://d3gdr9n5lqb5z7.cloudfront.net/fotos/1184.webp',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Feijão Carioca 1kg',
        description: 'Feijão carioca tradicional brasileiro',
        imageUrl: 'https://example.com/feijao-carioca.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Lentilha 500g',
        description: 'Lentilha rica em proteínas e ferro',
        imageUrl: 'https://example.com/lentilha.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Aveia em Flocos 500g',
        description: 'Aveia em flocos finos, ideal para vitaminas',
        imageUrl: 'https://example.com/aveia.jpg',
      },
    }),

    // Laticínios
    prisma.product.create({
      data: {
        name: 'Leite Integral 1L',
        description: 'Leite integral pasteurizado, rico em cálcio',
        imageUrl:
          'https://superprix.vteximg.com.br/arquivos/ids/208297/7898215151708--1-.jpg?v=637916015363630000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Leite Desnatado 1L',
        description: 'Leite desnatado, baixo teor de gordura',
        imageUrl: 'https://example.com/leite-desnatado.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Queijo Mussarela 500g',
        description: 'Queijo mussarela fatiado',
        imageUrl: 'https://example.com/queijo-mussarela.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Iogurte Natural 170g',
        description: 'Iogurte natural sem açúcar',
        imageUrl: 'https://example.com/iogurte.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Manteiga 200g',
        description: 'Manteiga com sal',
        imageUrl: 'https://example.com/manteiga.jpg',
      },
    }),

    // Panificação
    prisma.product.create({
      data: {
        name: 'Pão Francês',
        description: 'Pão francês tradicional, fresquinho',
        imageUrl:
          'https://cdn.2rscms.com.br/imgcache/5054/uploads/5054/layout/Linha%20Gold%20Paes/pao-frances-12h.png.webp',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pão de Forma Integral',
        description: 'Pão de forma integral, 500g',
        imageUrl: 'https://example.com/pao-forma.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Biscoito Cream Cracker',
        description: 'Biscoito cream cracker, 400g',
        imageUrl: 'https://example.com/biscoito.jpg',
      },
    }),

    // Frutas
    prisma.product.create({
      data: {
        name: 'Banana Nanica 1kg',
        description: 'Banana nanica madura, rica em potássio',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJItgpBcBYvvRQAgfTapDtbZBltTfri9BCDw&s',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Maçã Fuji 1kg',
        description: 'Maçã fuji doce e crocante, importada',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/746/397/products/maca-fuji1-d895cc170cce90621b15221694779422-640-0.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Laranja Lima 1kg',
        description: 'Laranja lima doce, rica em vitamina C',
        imageUrl: 'https://example.com/laranja.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mamão Papaya 1kg',
        description: 'Mamão papaya maduro',
        imageUrl: 'https://example.com/mamao.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Uva Itália 500g',
        description: 'Uva itália doce e suculenta',
        imageUrl: 'https://example.com/uva.jpg',
      },
    }),

    // Verduras e Legumes
    prisma.product.create({
      data: {
        name: 'Tomate 1kg',
        description: 'Tomate maduro para salada',
        imageUrl: 'https://example.com/tomate.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cebola 1kg',
        description: 'Cebola branca',
        imageUrl: 'https://example.com/cebola.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Alface Americana',
        description: 'Alface americana crocante',
        imageUrl: 'https://example.com/alface.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cenoura 1kg',
        description: 'Cenoura orgânica',
        imageUrl: 'https://example.com/cenoura.jpg',
      },
    }),

    // Carnes
    prisma.product.create({
      data: {
        name: 'Frango Inteiro 1kg',
        description: 'Frango inteiro congelado',
        imageUrl: 'https://example.com/frango.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Carne Moída 1kg',
        description: 'Carne moída bovina',
        imageUrl: 'https://example.com/carne-moida.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Linguiça Calabresa 500g',
        description: 'Linguiça calabresa defumada',
        imageUrl: 'https://example.com/linguica.jpg',
      },
    }),

    // Bebidas
    prisma.product.create({
      data: {
        name: 'Suco de Laranja 1L',
        description: 'Suco de laranja integral',
        imageUrl: 'https://example.com/suco-laranja.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Refrigerante Cola 2L',
        description: 'Refrigerante cola gelado',
        imageUrl: 'https://example.com/refrigerante.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Água Mineral 1,5L',
        description: 'Água mineral natural',
        imageUrl: 'https://example.com/agua.jpg',
      },
    }),

    // Limpeza
    prisma.product.create({
      data: {
        name: 'Detergente Líquido 500ml',
        description: 'Detergente líquido neutro',
        imageUrl: 'https://example.com/detergente.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Papel Higiênico 8 rolos',
        description: 'Papel higiênico folha dupla',
        imageUrl: 'https://example.com/papel-higienico.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sabão em Pó 1kg',
        description: 'Sabão em pó concentrado',
        imageUrl: 'https://example.com/sabao-po.jpg',
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create Markets (significantly expanded)
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
    prisma.market.create({
      data: {
        name: 'Mercado São João',
        latitude: -15.799,
        longitude: -47.886,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Supermercado Família',
        latitude: -15.791,
        longitude: -47.879,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Mercado Popular',
        latitude: -15.797,
        longitude: -47.885,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Atacadão do Povo',
        latitude: -15.792,
        longitude: -47.88,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Minimercado da Esquina',
        latitude: -15.798,
        longitude: -47.887,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Supermercado Boa Vista',
        latitude: -15.793,
        longitude: -47.881,
      },
    }),
    prisma.market.create({
      data: {
        name: 'Mercado Livre',
        latitude: -15.8,
        longitude: -47.888,
      },
    }),
  ]);

  console.log('✅ Markets created');

  // Create MarketProducts (extensive pricing variations)
  const marketProducts: Promise<any>[] = [];

  // Create market products with varied pricing for each product in different markets
  for (let marketIndex = 0; marketIndex < markets.length; marketIndex++) {
    const market = markets[marketIndex];

    // Each market will have 60-80% of all products
    const productCount = Math.floor(
      products.length * (0.6 + Math.random() * 0.2),
    );
    const shuffledProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, productCount);

    for (const product of shuffledProducts) {
      // Base price with variations per market
      let basePrice = 5.0;

      // Set different base prices for different product types
      if (product.name.includes('Arroz') || product.name.includes('Feijão')) {
        basePrice = 6.0 + Math.random() * 4.0;
      } else if (
        product.name.includes('Leite') ||
        product.name.includes('Iogurte')
      ) {
        basePrice = 3.0 + Math.random() * 3.0;
      } else if (
        product.name.includes('Pão') ||
        product.name.includes('Biscoito')
      ) {
        basePrice = 2.0 + Math.random() * 3.0;
      } else if (
        product.name.includes('Banana') ||
        product.name.includes('Maçã')
      ) {
        basePrice = 3.0 + Math.random() * 2.0;
      } else if (
        product.name.includes('Frango') ||
        product.name.includes('Carne')
      ) {
        basePrice = 12.0 + Math.random() * 8.0;
      } else if (
        product.name.includes('Detergente') ||
        product.name.includes('Sabão')
      ) {
        basePrice = 4.0 + Math.random() * 3.0;
      }

      // Apply market-specific multipliers
      const marketMultipliers = [
        1.0, 1.1, 0.95, 1.05, 0.9, 1.15, 0.85, 1.2, 1.0, 0.88,
      ];
      const finalPrice = basePrice * marketMultipliers[marketIndex];

      marketProducts.push(
        prisma.marketProduct.create({
          data: {
            marketId: market.id,
            productId: product.id,
            price: Math.round(finalPrice * 100) / 100,
            isValid: Math.random() > 0.1, // 90% approved, 10% pending
          },
        }),
      );
    }
  }

  await Promise.all(marketProducts);

  console.log('✅ Market products created');

  // Create Reviews (more extensive)
  const reviews: Promise<any>[] = [];
  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    const reviewCount = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per market

    for (let j = 0; j < reviewCount; j++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const rating = Math.floor(Math.random() * 5) + 1;
      const comments = [
        'Excelente mercado! Produtos frescos e bom atendimento.',
        'Bom mercado, preços justos.',
        'Mercado razoável, poderia melhorar o atendimento.',
        'Ótima variedade de produtos.',
        'Preços competitivos e ambiente limpo.',
        'Atendimento cordial e produtos de qualidade.',
        'Localização conveniente.',
        'Bom custo-benefício.',
      ];

      reviews.push(
        prisma.reviewMarket.create({
          data: {
            userId: randomUser.id,
            marketId: market.id,
            rating,
            comment: comments[Math.floor(Math.random() * comments.length)],
          },
        }),
      );
    }
  }

  await Promise.all(reviews);

  console.log('✅ Reviews created');

  // Create Purchase History (more extensive)
  const purchases: Promise<any>[] = [];
  const purchasedProducts: Promise<any>[] = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const purchaseCount = Math.floor(Math.random() * 4) + 1; // 1-4 purchases per user

    for (let j = 0; j < purchaseCount; j++) {
      const randomDate = new Date(
        2024,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      );
      const productsInPurchase = Math.floor(Math.random() * 5) + 1; // 1-5 products per purchase

      let totalPrice = 0;
      const purchaseProducts: any[] = [];

      for (let k = 0; k < productsInPurchase; k++) {
        const randomProduct =
          products[Math.floor(Math.random() * products.length)];
        const availableMarkets = markets.filter(() => Math.random() > 0.3); // Random market selection

        if (availableMarkets.length > 0) {
          const randomMarket =
            availableMarkets[
              Math.floor(Math.random() * availableMarkets.length)
            ];
          const price = 5.0 + Math.random() * 10.0; // Random price

          totalPrice += price;
          purchaseProducts.push({
            userId: user.id,
            productId: randomProduct.id,
            marketId: randomMarket.id,
            price,
          });
        }
      }

      if (purchaseProducts.length > 0) {
        const purchase = prisma.purchase.create({
          data: {
            userId: user.id,
            totalPrice: Math.round(totalPrice * 100) / 100,
            createdAt: randomDate,
          },
        });

        purchases.push(purchase);

        // Add purchased products
        purchase.then((p) => {
          purchaseProducts.forEach((pp) => {
            purchasedProducts.push(
              prisma.purchasedProduct.create({
                data: {
                  ...pp,
                  purchaseId: p.id,
                },
              }),
            );
          });
        });
      }
    }
  }

  await Promise.all(purchases);
  await Promise.all(purchasedProducts);

  console.log('✅ Purchase history created');

  // Create Shopping List items (more extensive)
  const shoppingLists: Promise<any>[] = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const itemCount = Math.floor(Math.random() * 6) + 2; // 2-7 items per user

    const userProducts = products
      .sort(() => 0.5 - Math.random())
      .slice(0, itemCount);

    for (const product of userProducts) {
      shoppingLists.push(
        prisma.userShoppingList.create({
          data: {
            userId: user.id,
            productId: product.id,
          },
        }),
      );
    }
  }

  await Promise.all(shoppingLists);

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
  console.log('Maria: maria.silva@email.com / user123');
  console.log('João: joao.santos@email.com / user123');
  console.log('Ana: ana.costa@email.com / user123');
  console.log('Carlos: carlos.pereira@email.com / user123');
  console.log('Fernanda: fernanda.lima@email.com / user123');
  console.log('Rodrigo: rodrigo.alves@email.com / user123');
  console.log('Lucia: lucia.mendes@email.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
