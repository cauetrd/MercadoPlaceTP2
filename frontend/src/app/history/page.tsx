"use client";

import Header from "@/components/Header";
import { apiService } from "@/service/api/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PurchasedProduct {
  id: string;
  userId: string;
  productId: string;
  marketId: string;
  purchaseId: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
  };
  market: {
    id: string;
    name: string;
  };
}

interface Purchase {
  id: string;
  userId: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  products: PurchasedProduct[];
}

interface GroupedPurchase {
  market: {
    id: string;
    name: string;
  };
  products: PurchasedProduct[];
  subtotal: number;
}

export default function HistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const fetchPurchaseHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.get("purchase/my-purchases");

      const data = response;
      console.log("Purchase history data:", data);

      setPurchases(data);
    } catch (err) {
      console.error("Error fetching purchase history:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      toast.error("Erro ao carregar histórico de compras");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Data inválida";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }

      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const groupProductsByMarket = (
    products: PurchasedProduct[]
  ): GroupedPurchase[] => {
    const marketGroups: { [marketId: string]: GroupedPurchase } = {};

    products.forEach((product) => {
      const marketId = product.market.id;

      if (!marketGroups[marketId]) {
        marketGroups[marketId] = {
          market: product.market,
          products: [],
          subtotal: 0,
        };
      }

      marketGroups[marketId].products.push(product);
      marketGroups[marketId].subtotal += product.price;
    });

    return Object.values(marketGroups);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Erro ao carregar histórico</p>
            <p>{error}</p>
          </div>
          <button
            onClick={fetchPurchaseHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Histórico de Compras
            </h1>
          </div>

          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma compra encontrada
              </h3>
              <p className="text-gray-500">
                Suas compras aparecerão aqui depois que você fizer um pedido.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {purchases.map((purchase) => {
                const purchasedProducts = purchase.products || [];
                const purchaseDate = purchase.createdAt;
                const groupedProducts =
                  groupProductsByMarket(purchasedProducts);
                const totalItems = purchasedProducts.length;

                return (
                  <div
                    key={purchase.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* Header da compra */}
                    <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Compra de {formatDate(purchaseDate)}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            ID da compra: {purchase.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(purchase.totalPrice)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {totalItems} item(s)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Produtos agrupados por mercado */}
                    <div className="p-6">
                      {groupedProducts.map((group, index) => (
                        <div
                          key={group.market.id}
                          className={
                            index > 0
                              ? "mt-6 pt-6 border-t border-gray-200"
                              : ""
                          }
                        >
                          {/* Informações do mercado */}
                          <div className="flex items-center mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {group.market.name}
                              </h4>
                            </div>
                            <div className="ml-auto text-right">
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(group.subtotal)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {group.products.length} produto(s)
                              </p>
                            </div>
                          </div>

                          {/* Lista de produtos */}
                          <div className="space-y-3">
                            {group.products.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  {item.product.imageUrl && (
                                    <img
                                      src={item.product.imageUrl}
                                      alt={item.product.name}
                                      className="h-12 w-12 object-cover rounded-lg"
                                    />
                                  )}
                                  <div>
                                    <h5 className="font-medium text-gray-900">
                                      {item.product.name}
                                    </h5>
                                    <p className="text-sm text-gray-600">
                                      {item.product.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(item.price)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
