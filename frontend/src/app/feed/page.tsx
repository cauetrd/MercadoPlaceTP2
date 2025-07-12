"use client";

import { useEffect, useState } from "react";

// Interface baseada na estrutura da API do backend
interface Product {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  imageUrl: string;
  isValid: boolean;
  createdAt: string;
  updatedAt: string;
}

// Componente de Item do Produto
function ProductItem({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Imagem do produto */}
      <div className="aspect-video bg-gray-200 relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {/* Badge de preço */}
        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          R$ {product.currentPrice.toFixed(2)}
        </div>
      </div>

      {/* Conteúdo do produto */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Data de atualização */}
        <div className="text-xs text-gray-400 mb-3">
          Atualizado em{" "}
          {new Date(product.updatedAt).toLocaleDateString("pt-BR")}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200">
            Ver Detalhes
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200">
            🛒 Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de Loading
function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-300"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-2 bg-gray-300 rounded w-1/2 mb-3"></div>
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Página principal do Feed
export default function FeedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Dados mock para demonstração (já que não vamos usar axios ainda)
  useEffect(() => {
    // Simulando carregamento da API
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Arroz Integral 1kg",
        description:
          "Arroz integral orgânico de alta qualidade, rico em fibras e nutrientes essenciais.",
        currentPrice: 8.99,
        imageUrl:
          "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
        isValid: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        name: "Feijão Preto 1kg",
        description:
          "Feijão preto selecionado, fonte de proteína vegetal e ferro.",
        currentPrice: 6.5,
        imageUrl:
          "https://images.unsplash.com/photo-1583327224991-db9b8c5c8b2d?w=400",
        isValid: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "3",
        name: "Óleo de Soja 900ml",
        description: "Óleo de soja refinado, ideal para cozinhar e frituras.",
        currentPrice: 4.99,
        imageUrl:
          "https://images.unsplash.com/photo-1601158935942-cb80dba60df0?w=400",
        isValid: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "4",
        name: "Açúcar Cristal 1kg",
        description:
          "Açúcar cristal refinado especial, perfeito para suas receitas.",
        currentPrice: 3.5,
        imageUrl:
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
        isValid: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "5",
        name: "Café Torrado 500g",
        description:
          "Café torrado e moído, sabor intenso para começar bem o dia.",
        currentPrice: 12.99,
        imageUrl:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
        isValid: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "6",
        name: "Macarrão Espaguete 500g",
        description:
          "Macarrão espaguete de sêmola de trigo durum, massa saborosa.",
        currentPrice: 4.25,
        imageUrl:
          "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
        isValid: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1500);
  }, []);

  // Filtrar e ordenar produtos
  const filteredAndSortedProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let result = 0;
      if (sortBy === "name") {
        result = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        result = a.currentPrice - b.currentPrice;
      }
      return sortOrder === "asc" ? result : -result;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🛒 MercadoPlace - Feed de Produtos
            </h1>
            <div className="text-sm text-gray-500">
              {products.length} produtos disponíveis
            </div>
          </div>
        </div>
      </header>

      {/* Filtros e Busca */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Buscar produtos
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar produtos..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Ordenação */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "price")}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Ordenar por Nome</option>
                <option value="price">Ordenar por Preço</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Loading state
            Array.from({ length: 8 }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          ) : filteredAndSortedProducts.length > 0 ? (
            // Produtos carregados
            filteredAndSortedProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))
          ) : (
            // Estado vazio
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-500">
                Tente ajustar seus filtros ou termos de busca.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
