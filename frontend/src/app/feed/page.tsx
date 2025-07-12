"use client";

import ProductItem from "@/components/ProductItem";
import { apiService } from "@/service/api/api";
import { ProductResponseDto } from "@/service/api/api.types";
import { useEffect, useState } from "react";

// Interface baseada na estrutura da API do backend
interface Product extends ProductResponseDto {}

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
  const [error, setError] = useState<string | null>(null);

  // Funções para lidar com ações dos produtos
  const handleViewDetails = (product: Product) => {
    console.log("Ver detalhes do produto:", product);
    // TODO: Implementar navegação para página de detalhes
  };

  const handleAddToCart = (product: Product) => {
    console.log("Adicionar ao carrinho:", product);
    // TODO: Implementar adição ao carrinho/lista de compras
  };

  // Função para buscar produtos da API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query string manualmente
      const queryParams = new URLSearchParams();

      if (searchTerm.trim()) {
        queryParams.append("name", searchTerm.trim());
      }

      queryParams.append("sortBy", sortBy);
      queryParams.append("sortOrder", sortOrder);

      const queryString = queryParams.toString();
      const url = queryString ? `/products?${queryString}` : "/products";

      const response = await apiService.get(url);

      // A API já retorna apenas produtos válidos, mas vamos garantir
      const validProducts = Array.isArray(response)
        ? response.filter((product: Product) => product.isValid)
        : [];

      setProducts(validProducts);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar produtos na inicialização
  useEffect(() => {
    fetchProducts();
  }, []);

  // Buscar produtos quando filtros mudarem (com debounce para o search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500); // 500ms de debounce para o search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy, sortOrder]);

  // Produtos já vêm filtrados e ordenados da API
  const filteredAndSortedProducts = products;

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
              {loading
                ? "Carregando..."
                : `${products.length} produtos disponíveis`}
            </div>
          </div>
          {error && (
            <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => {
                      setError(null);
                      fetchProducts();
                    }}
                    className="text-red-600 hover:text-red-500 text-sm underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          )}
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
              <ProductItem
                key={product.id}
                product={product}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
              />
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
