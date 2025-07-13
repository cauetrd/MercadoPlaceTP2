"use client";

import Header from "@/components/Header";
import { apiService } from "@/service/api/api";
import { ShoppingListItemResponseDto } from "@/service/api/api.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<ShoppingListItemResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch cart items
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

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    try {
      await apiService.delete(`/shopping-list/${productId}`);
      setCartItems(cartItems.filter((item) => item.productId !== productId));
      toast.success("Item removido do carrinho!");
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
      toast.error("Erro ao remover item. Tente novamente.");
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await apiService.delete("/shopping-list");
      setCartItems([]);
      toast.success("Carrinho limpo!");
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      toast.error("Erro ao limpar carrinho. Tente novamente.");
    }
  };

  // Load cart on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Handle navigation to checkout
  const handleGoToCheckout = () => {
    router.push("/checkout");
  };

  // Handle navigation back to feed
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
                    fetchCartItems();
                  }}
                  className="text-red-600 hover:text-red-500 hover:cursor-pointer text-sm underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-gray-300"
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
                Seu carrinho está vazio
              </h3>
              <p className="text-gray-500 mb-4">
                Adicione produtos ao seu carrinho para continuar comprando.
              </p>
              <button
                onClick={handleBackToFeed}
                className="bg-blue-600 hover:cursor-pointer text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
                  className="text-red-600 hover:cursor-pointer hover:text-red-700 text-sm font-medium"
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
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product?.name || "Produto sem nome"}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {item.product?.description || "Sem descrição"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Adicionado em:{" "}
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="bg-red-50 text-red-600 hover:cursor-pointer hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium text-gray-900">
                      Total de itens: {cartItems.length}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleBackToFeed}
                      className="bg-gray-100 text-gray-700 hover:cursor-pointer px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Continuar Comprando
                    </button>
                    <button
                      onClick={handleGoToCheckout}
                      className="bg-green-600 text-white hover:cursor-pointer px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
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
