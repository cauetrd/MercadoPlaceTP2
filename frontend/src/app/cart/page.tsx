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
    marketProductId: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    lastPrice?: number;
  }>;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<ShoppingListItemResponseDto[]>([]);
  const [marketSubtotals, setMarketSubtotals] = useState<MarketSubtotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{
    marketProductId: string;
    marketName: string;
    productName: string;
    price: number;
  } | null>(null);
  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<number>(0);
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
        // Selecionar automaticamente o primeiro mercado (menor preço)
        if (mapped.length > 0 && !selectedMarketId) {
          setSelectedMarketId(mapped[0].marketId);
        }
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

  const updatePrice = async () => {
    if (!selectedProduct) return;

    try {
      await apiService.patch(
        `/market-products/${selectedProduct.marketProductId}`,
        {
          price: newPrice,
        }
      );

      toast.success("Preço atualizado com sucesso!");
      setEditingPrice(false);

      // Update the local state
      setMarketSubtotals((prev) =>
        prev.map((market) => ({
          ...market,
          products: market.products.map((product) =>
            product.marketProductId === selectedProduct.marketProductId
              ? { ...product, price: newPrice }
              : product
          ),
          subtotal: market.products.reduce(
            (sum, product) =>
              sum +
              (product.marketProductId === selectedProduct.marketProductId
                ? newPrice
                : product.price),
            0
          ),
        }))
      );

      // Update selected product with new price
      setSelectedProduct((prev) =>
        prev ? { ...prev, price: newPrice } : null
      );
    } catch (error) {
      console.error("Erro ao atualizar preço:", error);
      toast.error("Erro ao atualizar preço. Tente novamente.");
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setEditingPrice(false);
    setNewPrice(0);
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

  const handleSavePurchase = async () => {
    if (cartItems.length === 0) {
      toast.error(
        "Carrinho vazio. Adicione produtos antes de finalizar a compra."
      );
      return;
    }

    if (marketSubtotals.length === 0) {
      toast.error(
        "Não há mercados disponíveis para todos os produtos do carrinho."
      );
      return;
    }

    try {
      // Usar o mercado selecionado ou o primeiro (menor preço) como padrão
      const selectedMarket = selectedMarketId
        ? marketSubtotals.find((m) => m.marketId === selectedMarketId) ||
          marketSubtotals[0]
        : marketSubtotals[0];

      // Mapear produtos para o formato esperado pela API
      const purchaseItems = selectedMarket.products.map((product) => ({
        productId: product.id,
        marketId: selectedMarket.marketId,
        price: product.price,
      }));

      // Criar a compra
      const purchaseData = {
        items: purchaseItems,
        purchaseDate: new Date().toISOString(),
      };

      await apiService.post("/purchase", purchaseData);

      // Limpar o carrinho após salvar a compra
      await apiService.delete("/shopping-list");
      setCartItems([]);
      setMarketSubtotals([]);
      setSelectedMarketId(null);

      toast.success(
        `Compra realizada com sucesso no ${
          selectedMarket.marketName
        }! Total: R$ ${selectedMarket.subtotal.toFixed(2)}`
      );
    } catch (error) {
      console.error("Erro ao salvar compra:", error);
      toast.error("Erro ao finalizar compra. Tente novamente.");
    }
  };

  const handleHistory = () => {
    router.push("/history");
  };

  const handleBackToFeed = () => {
    router.push("/feed");
  };

  const openProductModal = (
    marketProductId: string,
    marketName: string,
    productName: string,
    price: number
  ) => {
    setSelectedProduct({ marketProductId, marketName, productName, price });
    setNewPrice(price);
    setEditingPrice(false);
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
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedMarketId === market.marketId
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedMarketId(market.marketId)}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="selectedMarket"
                              checked={selectedMarketId === market.marketId}
                              onChange={() =>
                                setSelectedMarketId(market.marketId)
                              }
                              className="text-blue-600"
                            />
                            <button
                              className="font-medium hover:underline hover:cursor-pointer text-lg"
                              onClick={() =>
                                router.push(`/market/${market.marketId}`)
                              }
                            >
                              {market.marketName}
                            </button>
                          </div>
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
                              <button
                                onClick={() =>
                                  openProductModal(
                                    product.marketProductId,
                                    market.marketName,
                                    product.name,
                                    product.price
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800 hover:underline text-left"
                              >
                                {product.name}
                              </button>
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
                      onClick={handleHistory}
                      className="bg-gray-100 hover:cursor-pointer text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200"
                    >
                      Ver compras anteriores
                    </button>
                    <button
                      onClick={handleSavePurchase}
                      disabled={marketSubtotals.length === 0}
                      className={`px-6 py-2 rounded-md ${
                        marketSubtotals.length === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 hover:cursor-pointer text-white hover:bg-green-700"
                      }`}
                    >
                      {marketSubtotals.length > 0
                        ? (() => {
                            const selectedMarket = selectedMarketId
                              ? marketSubtotals.find(
                                  (m) => m.marketId === selectedMarketId
                                ) || marketSubtotals[0]
                              : marketSubtotals[0];
                            return `Finalizar compra no ${
                              selectedMarket.marketName
                            } (R$ ${selectedMarket.subtotal.toFixed(2)})`;
                          })()
                        : "Finalizar compra"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de detalhes do produto */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeProductModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes do Produto
              </h3>
              <button
                onClick={closeProductModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supermercado:
                </label>
                <p className="text-gray-900">{selectedProduct.marketName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Produto:
                </label>
                <p className="text-gray-900">{selectedProduct.productName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço:
                </label>
                {editingPrice ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPrice}
                      onChange={(e) =>
                        setNewPrice(parseFloat(e.target.value) || 0)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={updatePrice}
                      className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setEditingPrice(false);
                        setNewPrice(selectedProduct.price);
                      }}
                      className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-green-600 font-semibold text-lg">
                      R$ {selectedProduct.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        setEditingPrice(true);
                        setNewPrice(selectedProduct.price);
                      }}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-200 text-sm"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeProductModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
