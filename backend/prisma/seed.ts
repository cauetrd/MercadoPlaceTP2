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
        imageUrl:
          'https://prezunic.vtexassets.com/arquivos/ids/177896/65429da79d89f88ff4704b67.jpg?v=638344613617770000',
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
        imageUrl:
          'https://redemix.vteximg.com.br/arquivos/ids/209460-1000-1000/7897136400155.jpg?v=638350604534800000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Lentilha 500g',
        description: 'Lentilha rica em proteínas e ferro',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVCHUqZOlG3kQx_7lcmflT2LAoOkn98EmgxQ&s',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Aveia em Flocos 500g',
        description: 'Aveia em flocos finos, ideal para vitaminas',
        imageUrl:
          'https://www.davo.com.br/ccstore/v1/images/?source=/file/v518286595085818477/products/prod_7892840815752.imagem1.jpg&height=940&width=940',
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
        imageUrl:
          'https://piracanjuba-institucional-prd.s3.sa-east-1.amazonaws.com/product_images/image/leite-desnatado-piracanjuba-frente-1l-848x1007px-470.webp',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Queijo Mussarela 500g',
        description: 'Queijo mussarela fatiado',
        imageUrl:
          'https://www.arenaatacado.com.br/on/demandware.static/-/Sites-storefront-catalog-sv/default/dw31d3d5e7/Produtos/965715-7896275980870-queijo%20mussarela%20frimesa%20fatiado%20500g-frimesa-1.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Iogurte Natural 170g',
        description: 'Iogurte natural sem açúcar',
        imageUrl:
          'https://superprix.vteximg.com.br/arquivos/ids/173130-600-600/Iogurte-Itambe-Morango-170g.png?v=636132684249730000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Manteiga 200g',
        description: 'Manteiga com sal',
        imageUrl:
          'https://comper.vteximg.com.br/arquivos/ids/160711-1000-1000/1027484.jpg?v=637210548673100000',
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
        imageUrl:
          'https://superprix.vteximg.com.br/arquivos/ids/182349/816124.jpg?v=637122110583200000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Biscoito Cream Cracker',
        description: 'Biscoito cream cracker, 400g',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyeKOfE7pogtwCT7QdKEHA-vzxVswJo3uLaA&s',
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
        imageUrl:
          'https://obahortifruti.vtexassets.com/arquivos/ids/6157809/Laranja-Lima-Kg.png?v=638461110560830000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mamão Papaya 1kg',
        description: 'Mamão papaya maduro',
        imageUrl: 'https://vallefrutas.com.br/wp-content/uploads/papaya-01.png',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Uva Itália 500g',
        description: 'Uva itália doce e suculenta',
        imageUrl:
          'https://scfoods.fbitsstatic.net/img/p/uva-italia-500g-70940/257559.jpg?w=800&h=800&v=no-change&qs=ignore',
      },
    }),

    // Verduras e Legumes
    prisma.product.create({
      data: {
        name: 'Tomate 1kg',
        description: 'Tomate maduro para salada',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVGZn_5pooSLj0gbgR_rk3PXNDKzo7m7jY0A&s',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cebola 1kg',
        description: 'Cebola branca',
        imageUrl:
          'https://cdn.awsli.com.br/300x300/305/305913/produto/10293544/cebola-1d05720a.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Alface Americana',
        description: 'Alface americana crocante',
        imageUrl:
          'https://superprix.vteximg.com.br/arquivos/ids/178850/Alface-Crespa-Verde-Un-396.png?v=636934628540170000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cenoura 1kg',
        description: 'Cenoura orgânica',
        imageUrl:
          'https://ibassets.com.br/ib.item.image.big/b-d5de058c7a7d492f9d36f64f01b8ee17.jpg',
      },
    }),

    // Carnes
    prisma.product.create({
      data: {
        name: 'Frango Inteiro 1kg',
        description: 'Frango inteiro congelado',
        imageUrl:
          'https://carrefourbrfood.vtexassets.com/arquivos/ids/138226020/7087942.png?v=638446527623200000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Carne Moída 1kg',
        description: 'Carne moída bovina',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOoEEHn9j-ve7DmxyF-t_Mr6bN9ajcnyw4ww&s',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Linguiça Calabresa 500g',
        description: 'Linguiça calabresa defumada',
        imageUrl:
          'https://bretas.vtexassets.com/arquivos/ids/215140/65ce2283f63f6ecb008825bd.jpg?v=638436048678830000',
      },
    }),

    // Bebidas
    prisma.product.create({
      data: {
        name: 'Suco de Laranja 1L',
        description: 'Suco de laranja integral',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNbAwyEfpD25c4YHth27yxMZxJHuxUNhFfJQ&s',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Refrigerante Cola 2L',
        description: 'Refrigerante cola gelado',
        imageUrl:
          'https://superprix.vteximg.com.br/arquivos/ids/210608-600-600/BMo6Zlso.png?v=638083543189830000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Água Mineral 1,5L',
        description: 'Água mineral natural',
        imageUrl:
          'https://www.extramercado.com.br/img/uploads/1/298/33182298.png',
      },
    }),

    // Limpeza
    prisma.product.create({
      data: {
        name: 'Detergente Líquido 500ml',
        description: 'Detergente líquido neutro',
        imageUrl:
          'https://tb0932.vtexassets.com/arquivos/ids/169546/Detergente%20Neutro%20500ml%20Ype%20101095.png.png?v=638773003324270000',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Papel Higiênico 8 rolos',
        description: 'Papel higiênico folha dupla',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF5u7_QoyB8M8frlf1_kFdqzxKNaCZDC92pA&s',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sabão em Pó 1kg',
        description: 'Sabão em pó concentrado',
        imageUrl:
          'https://t10917.vteximg.com.br/arquivos/ids/170084-1000-1000/SABAO-PO-EMB---4-KG-TIXAN-PRIMAVERA_IMG1.jpg?v=638751553953870000',
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

  // Helper function to process promises in batches
  async function processBatches<T>(
    promises: Promise<T>[],
    batchSize: number = 50,
  ): Promise<T[]> {
    const results: T[] = [];

    for (let i = 0; i < promises.length; i += batchSize) {
      const batch = promises.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch);
      results.push(...batchResults);

      if (i + batchSize < promises.length) {
        console.log(
          `✅ Processed batch ${
            Math.floor(i / batchSize) + 1
          } of ${Math.ceil(promises.length / batchSize)}`,
        );
      }
    }

    return results;
  }

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

  // Process market products in batches
  await processBatches(marketProducts, 30);

  console.log('✅ Market products created');

  // Create Reviews (more extensive)
  const reviews: Promise<any>[] = [];

  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];

    // Shuffle users and take the first 1-3 for this market
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    const reviewCount = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per market
    const reviewers = shuffledUsers.slice(
      0,
      Math.min(reviewCount, users.length),
    );

    for (const reviewer of reviewers) {
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
            userId: reviewer.id,
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

  // Create Purchase History (more extensive) - Sequential processing
  console.log('Creating purchase history...');

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const purchaseCount = Math.floor(Math.random() * 4) + 1; // 1-4 purchases per user

    console.log(`Processing purchases for user ${i + 1}/${users.length}...`);

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
        // Create the purchase first, then create purchased products sequentially
        const purchase = await prisma.purchase.create({
          data: {
            userId: user.id,
            totalPrice: Math.round(totalPrice * 100) / 100,
            createdAt: randomDate,
          },
        });

        // Create purchased products one by one to avoid timeout
        for (const pp of purchaseProducts) {
          await prisma.purchasedProduct.create({
            data: {
              purchaseId: purchase.id,
              userId: pp.userId,
              productId: pp.productId,
              marketId: pp.marketId,
              price: pp.price,
            },
          });
        }
      }
    }
  }

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
