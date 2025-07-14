"use client";

import { apiService } from "@/service/api/api";
import {
  ShoppingListItemResponseDto,
  UserResponseDto,
} from "@/service/api/api.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  cartRefreshTrigger?: number;
}

export default function Header({ cartRefreshTrigger }: HeaderProps) {
  const [cartItems, setCartItems] = useState<ShoppingListItemResponseDto[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponseDto | null>(null);
  const router = useRouter();

  // Fetch shopping cart items
  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await apiService.get("/shopping-list");
      setCartItems(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao carregar itens do carrinho:", error);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const response = await apiService.get("/users/me");
      setCurrentUser(response);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      // If user data can't be fetched, try to get from cookie as fallback
      setCurrentUser(apiService.getCurrentUser());
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    try {
      await apiService.delete(`/shopping-list/${productId}`);
      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await apiService.delete("/shopping-list");
      setCartItems([]);
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Even if API call fails, clear local data and redirect
      await apiService.logout();
    }
  };

  // Load cart on component mount
  useEffect(() => {
    fetchCartItems();
    fetchCurrentUser();
  }, []);

  // Refresh cart when cartRefreshTrigger changes
  useEffect(() => {
    if (cartRefreshTrigger && cartRefreshTrigger > 0) {
      fetchCartItems();
    }
  }, [cartRefreshTrigger]);

  // Handle navigation to cart management page
  const handleGoToCart = () => {
    setIsCartOpen(false);
    router.push("/cart");
  };

  // Handle navigation to checkout page
  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/feed")}
            className="text-2xl hover:cursor-pointer font-bold text-gray-900"
          >
            MercadoPlace
          </button>

          <div className="flex items-center gap-4">
            {/* User Info */}
            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    {currentUser.name}
                  </span>
                  <span className="text-gray-600 ml-2">
                    • {currentUser.points} pontos
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 hover:cursor-pointer text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Sair
            </button>

            {/* Shopping Cart */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative hover:cursor-pointer px-2 py-1 rounded-xl hover:bg-blue-500/30 bg-blue-500/50 duration-200"
              >
                Carrinho
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Carrinho de Compras
                      </h3>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    {cartLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : cartItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p>Seu carrinho está vazio</p>
                      </div>
                    ) : (
                      <>
                        {/* Cart Items */}
                        <div className="max-h-64 overflow-y-auto">
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                            >
                              {/* Product Image */}
                              <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                                {item.product?.imageUrl ? (
                                  <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg
                                      className="w-6 h-6"
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
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {item.product?.name || "Produto sem nome"}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">
                                  {item.product?.description || "Sem descrição"}
                                </p>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-white hover:cursor-pointer"
                                title="Remover item"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="#000000"
                                  viewBox="0 0 256 256"
                                >
                                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Cart Actions */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Total de itens:</span>
                            <span className="font-medium">
                              {cartItems.length}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={handleGoToCart}
                              className="flex-1 hover:cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              Gerenciar Carrinho
                            </button>
                          </div>
                          {cartItems.length > 0 && (
                            <button
                              onClick={clearCart}
                              className="w-full hover:cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                            >
                              Limpar Carrinho
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {currentUser?.isAdmin && (
              <div className="text-sm text-purple-600 hover:cursor-pointer">
                <span onClick={() => router.push("/admin")}>
                  Painel de admin
                </span>
              </div>
            )}
            <div></div>
          </div>
        </div>
      </div>
    </header>
  );
}
