"use client";

import Header from "@/components/Header";
import ProductItem from "@/components/ProductItem";
import { apiService } from "@/service/api/api";
import { ProductResponseDto } from "@/service/api/api.types";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

// Função utilitária para normalizar texto (remove acentos, converte para minúsculas, etc.)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD") // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .replace(/[çÇ]/g, "c") // Corrige cedilha (tanto minúscula quanto maiúscula)
    .replace(/[ñÑ]/g, "n") // Eñe espanhol
    .replace(/[^a-z0-9\s]/g, "") // Remove caracteres especiais, mantém apenas letras, números e espaços
    .replace(/\s+/g, " ") // Substitui múltiplos espaços por um único espaço
    .trim(); // Remove espaços no início e fim
};

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
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [error, setError] = useState<string | null>(null);
  const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);
  const notify = (message: string) =>
    toast.info(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleAddToCart = async (product: ProductResponseDto) => {
    try {
      await apiService.post("/shopping-list", {
        productId: product.id,
      });
      console.log("Produto adicionado à lista de compras:", product);
      notify(`Produto "${product.name}" adicionado à lista de compras!`);

      // Trigger cart refresh in header
      setCartRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao adicionar produto à lista:", error);
      notify("Erro ao adicionar produto à lista. Tente novamente.");
    }
  };

  // Função para buscar produtos da API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir query string baseada nos endpoints do backend
      const queryParams = new URLSearchParams();

      if (searchTerm.trim()) {
        queryParams.append("name", searchTerm);
      }

      // Usar campos válidos do ProductResponseDto
      if (sortBy === "name" || sortBy === "createdAt") {
        queryParams.append("sortBy", sortBy);
      }

      const queryString = queryParams.toString();
      const url = queryString ? `/products?${queryString}` : "/products";

      const response = await apiService.get(url);

      // A API retorna produtos com marketProducts incluídos
      const validProducts = Array.isArray(response)
        ? response.map((product: ProductResponseDto) => ({
            ...product,
            normalizedName: normalizeText(product.name),
            normalizedDescription: normalizeText(product.description || ""),
          }))
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

  // Buscar produtos quando filtros mudarem
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, sortBy]);

  // Filtro adicional no frontend para busca mais refinada
  const filteredAndSortedProducts = products.filter((product) => {
    if (!searchTerm.trim()) return true;

    const normalizedSearch = normalizeText(searchTerm);

    const normalizedProductName = (product as any).normalizedName;
    const normalizedProductDescription = (product as any).normalizedDescription;

    // Busca tanto no nome quanto na descrição, normalizados
    return (
      normalizedProductName.includes(normalizedSearch) ||
      normalizedProductDescription.includes(normalizedSearch)
    );
  });

  return (
    <>
      {/* Header */}
      <Header cartRefreshTrigger={cartRefreshTrigger} />

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
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
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ToastContainer
          aria-label={"Notificações"}
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
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
                  placeholder="Buscar produtos... (ex: açúcar, café, arroz)"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-1 text-xs text-gray-500">
                  Buscando por: "{searchTerm}" (normalizado: "
                  {normalizeText(searchTerm)}")
                </div>
              )}
            </div>

            {/* Ordenação */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "createdAt")
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Ordenar por Nome</option>
                <option value="createdAt">Ordenar por Data</option>
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
              {searchTerm && (
                <p className="text-gray-400 text-sm mt-2">
                  Nenhum resultado para "{searchTerm}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
