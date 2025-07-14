"use client";

import Header from "@/components/Header";
import { apiService } from "@/service/api/api";
import { ShoppingListItemResponseDto } from "@/service/api/api.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface MarketSubtotal {
  marketId: string;
  marketName: string;
  subtotal: number;
  products: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
  }>;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<ShoppingListItemResponseDto[]>([]);
  const [marketSubtotals, setMarketSubtotals] = useState<MarketSubtotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get("/shopping-list");
      setCartItems(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
      setError("Erro ao carregar carrinho. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketSubtotals = async (productIds: string[]) => {
    try {
      const response = await apiService.post(
        "/market-products/subtotals/by-market",
        { productIds }
      );
      console.log(response);
      if (Array.isArray(response)) {
        // Mapear para o formato esperado
        const mapped = response.map((item: any) => ({
          marketId: item.market.id,
          marketName: item.market.name,
          subtotal: item.total,
          products: item.products,
        }));
        setMarketSubtotals(mapped);
      } else {
        setMarketSubtotals([]);
      }
    } catch (err) {
      console.error("Erro ao carregar subtotais dos mercados:", err);
      toast.error("Erro ao calcular subtotais dos mercados.");
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await apiService.delete(`/shopping-list/${productId}`);
      const updatedCart = cartItems.filter(
        (item) => item.productId !== productId
      );
      setCartItems(updatedCart);
      toast.success("Item removido do carrinho!");

      if (updatedCart.length > 0) {
        const updatedProductIds = updatedCart.map((item) => item.productId);
        fetchMarketSubtotals(updatedProductIds);
      } else {
        setMarketSubtotals([]);
      }
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      toast.error("Erro ao remover item. Tente novamente.");
    }
  };

  const clearCart = async () => {
    try {
      await apiService.delete("/shopping-list");
      setCartItems([]);
      setMarketSubtotals([]);
      toast.success("Carrinho limpo!");
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      toast.error("Erro ao limpar carrinho. Tente novamente.");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      const productIds = cartItems.map((item) => item.productId);
      fetchMarketSubtotals(productIds);
    }
  }, [cartItems]);

  const handleGoToCheckout = () => {
    router.push("/checkout");
  };

  const handleBackToFeed = () => {
    router.push("/feed");
  };

  return (
    <>
      <Header />
      <ToastContainer
        aria-label="Notificações"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium text-gray-900 mb-2">
                Seu carrinho está vazio
              </p>
              <button
                onClick={handleBackToFeed}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Itens no Carrinho ({cartItems.length})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Limpar Carrinho
                </button>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-md">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex justify-center items-center h-full text-gray-400">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Adicionado em:{" "}
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-200"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

{/* Subtotais por mercado */}
{marketSubtotals.length > 0 && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Mercados que possuem todos os produtos:
    </h3>
    <div className="space-y-4">
      {marketSubtotals.map((market) => (
        <div
          key={market.marketId}
          className="border border-gray-200 rounded-lg p-4"
        >
          <div className="flex justify-between items-center mb-2">
            {/* Market name as clickable link */}
            <button
              className="font-medium text-lg text-blue-600 hover:underline"
              onClick={() => router.push(`/market/${market.marketId}`)}
              aria-label={`Ver página do mercado ${market.marketName}`}
            >
              {market.marketName}
            </button>
            <span className="text-green-600 font-semibold text-lg">
              Total: R$ {market.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-600">
              Produtos disponíveis:
            </h4>
            {market.products.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center text-sm"
              >
                <span>{product.name}</span>
                <span className="text-gray-600">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">
                    Total de itens: {cartItems.length}
                  </span>
                  <div className="flex gap-4">
                    <button
                      onClick={handleBackToFeed}
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200"
                    >
                      Continuar Comprando
                    </button>
                    <button
                      onClick={handleGoToCheckout}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
