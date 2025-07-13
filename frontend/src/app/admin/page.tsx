"use client";

import Header from "@/components/Header";
import { apiService } from "@/service/api/api";
import {
  MarketProductResponseDto,
  MarketResponseDto,
  ProductResponseDto,
  UserResponseDto,
} from "@/service/api/api.types";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

type AdminTab =
  | "pending"
  | "products"
  | "markets"
  | "market-products"
  | "users";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [pendingMarketProducts, setPendingMarketProducts] = useState<
    MarketProductResponseDto[]
  >([]);
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [markets, setMarkets] = useState<MarketResponseDto[]>([]);
  const [marketProducts, setMarketProducts] = useState<
    MarketProductResponseDto[]
  >([]);
  const [users, setUsers] = useState<UserResponseDto[]>([]);

  // Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Fetch pending market products for approval
  const fetchPendingMarketProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/market-products/pending");
      setPendingMarketProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching pending market products:", err);
      setError("Erro ao carregar produtos pendentes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/products");
      setProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  // Fetch markets
  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/markets");
      setMarkets(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching markets:", err);
      setError("Erro ao carregar mercados");
    } finally {
      setLoading(false);
    }
  };

  // Fetch market products
  const fetchMarketProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/market-products");
      setMarketProducts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching market products:", err);
      setError("Erro ao carregar produtos de mercados");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/users");
      setUsers(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  // Approve market product
  const approveMarketProduct = async (id: string) => {
    try {
      await apiService.patch(`/market-products/${id}/approve`, {});
      toast.success("Produto aprovado com sucesso!");
      fetchPendingMarketProducts();
    } catch (err) {
      console.error("Error approving market product:", err);
      toast.error("Erro ao aprovar produto");
    }
  };

  // Reject market product
  const rejectMarketProduct = async (id: string) => {
    try {
      await apiService.delete(`/market-products/${id}/reject`);
      toast.success("Produto rejeitado com sucesso!");
      fetchPendingMarketProducts();
    } catch (err) {
      console.error("Error rejecting market product:", err);
      toast.error("Erro ao rejeitar produto");
    }
  };

  // Generic delete function
  const deleteItem = async (type: string, id: string) => {
    try {
      let endpoint = "";
      switch (type) {
        case "product":
          endpoint = `/products/${id}`;
          break;
        case "market":
          endpoint = `/markets/${id}`;
          break;
        case "market-product":
          endpoint = `/market-products/${id}`;
          break;
        case "user":
          endpoint = `/users/${id}`;
          break;
        default:
          throw new Error("Tipo inválido");
      }

      await apiService.delete(endpoint);
      toast.success("Item excluído com sucesso!");

      // Refresh data
      switch (type) {
        case "product":
          fetchProducts();
          break;
        case "market":
          fetchMarkets();
          break;
        case "market-product":
          fetchMarketProducts();
          break;
        case "user":
          fetchUsers();
          break;
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      toast.error("Erro ao excluir item");
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let endpoint = "";
      let method = editingItem ? "patch" : "post";

      switch (activeTab) {
        case "products":
          endpoint = editingItem ? `/products/${editingItem.id}` : "/products";
          break;
        case "markets":
          endpoint = editingItem ? `/markets/${editingItem.id}` : "/markets";
          break;
        case "market-products":
          endpoint = editingItem
            ? `/market-products/${editingItem.id}`
            : "/market-products";
          break;
        case "users":
          endpoint = editingItem ? `/users/${editingItem.id}` : "/users";
          break;
        default:
          throw new Error("Tab inválida");
      }

      if (method === "post") {
        await apiService.post(endpoint, formData);
      } else {
        await apiService.patch(endpoint, formData);
      }

      toast.success(
        editingItem
          ? "Item atualizado com sucesso!"
          : "Item criado com sucesso!"
      );

      // Reset form and close modal
      setFormData({});
      setEditingItem(null);
      setShowCreateModal(false);
      setShowEditModal(false);

      // Refresh data
      switch (activeTab) {
        case "products":
          fetchProducts();
          break;
        case "markets":
          fetchMarkets();
          break;
        case "market-products":
          fetchMarketProducts();
          break;
        case "users":
          fetchUsers();
          break;
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Erro ao salvar item");
    }
  };

  // Handle edit
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setShowEditModal(true);
  };

  // Handle create
  const handleCreate = () => {
    setFormData({});
    setEditingItem(null);
    setShowCreateModal(true);
  };

  // Load initial data
  useEffect(() => {
    switch (activeTab) {
      case "pending":
        fetchPendingMarketProducts();
        break;
      case "products":
        fetchProducts();
        break;
      case "markets":
        fetchMarkets();
        break;
      case "market-products":
        fetchMarketProducts();
        break;
      case "users":
        fetchUsers();
        break;
    }
  }, [activeTab]);

  // Tab navigation
  const tabs = [
    { id: "pending", label: "Produtos Pendentes" },
    { id: "products", label: "Produtos" },
    { id: "markets", label: "Mercados" },
    { id: "market-products", label: "Produtos de Mercados" },
    { id: "users", label: "Usuários" },
  ];

  return (
    <>
      <Header />

      <ToastContainer
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
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center hover:cursor-pointer gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors min-w-0 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
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
                  onClick={() => setError(null)}
                  className="text-red-600 hover:cursor-pointer hover:text-red-500 text-sm underline"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Pending Market Products */}
          {activeTab === "pending" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Produtos Pendentes de Aprovação
                </h2>
                <div className="text-sm text-gray-500">
                  {pendingMarketProducts.length} produtos pendentes
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : pendingMarketProducts.length === 0 ? (
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
                    Nenhum produto pendente
                  </h3>
                  <p className="text-gray-500">
                    Todos os produtos foram aprovados ou rejeitados.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingMarketProducts.map((marketProduct) => (
                    <div
                      key={marketProduct.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {marketProduct.product?.name || "Produto sem nome"}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {marketProduct.product?.description ||
                              "Sem descrição"}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">
                                Mercado:
                              </span>{" "}
                              {marketProduct.market?.name || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Preço:
                              </span>{" "}
                              R$ {marketProduct.price?.toFixed(2) || "0.00"}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() =>
                              approveMarketProduct(marketProduct.id)
                            }
                            className="bg-green-600 hover:cursor-pointer text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() =>
                              rejectMarketProduct(marketProduct.id)
                            }
                            className="bg-red-600 hover:cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                          >
                            Rejeitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gerenciar Produtos
                </h2>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Criar Produto
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descrição
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criado em
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {product.description || "Sem descrição"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-blue-600 hover:cursor-pointer hover:text-blue-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  deleteItem("product", product.id)
                                }
                                className="text-red-600 hover:cursor-pointer hover:text-red-900"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Markets Tab */}
          {activeTab === "markets" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gerenciar Mercados
                </h2>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white hover:cursor-pointer px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Criar Mercado
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Localização
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criado em
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {markets.map((market) => (
                        <tr key={market.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {market.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {market.latitude.toFixed(4)},{" "}
                              {market.longitude.toFixed(4)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(market.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(market)}
                                className="text-blue-600 hover:cursor-pointer hover:text-blue-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => deleteItem("market", market.id)}
                                className="text-red-600 hover:cursor-pointer hover:text-red-900"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Market Products Tab */}
          {activeTab === "market-products" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gerenciar Produtos de Mercados
                </h2>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white hover:cursor-pointer px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Criar Produto de Mercado
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mercado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço anterior
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {marketProducts.map((marketProduct) => (
                        <tr key={marketProduct.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {marketProduct.product?.name || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {marketProduct.market?.name || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              R$ {marketProduct.price?.toFixed(2) || "0.00"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              R$ {marketProduct.lastPrice?.toFixed(2) || "0.00"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                marketProduct.isValid
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {marketProduct.isValid ? "Aprovado" : "Pendente"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(marketProduct)}
                                className="text-blue-600 hover:cursor-pointer hover:text-blue-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  deleteItem("market-product", marketProduct.id)
                                }
                                className="text-red-600 hover:cursor-pointer hover:text-red-900"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gerenciar Usuários
                </h2>
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Criar Usuário
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pontos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criado em
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.points}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isAdmin
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {user.isAdmin ? "Admin" : "Usuário"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-blue-600 hover:cursor-pointer hover:text-blue-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => deleteItem("user", user.id)}
                                className="text-red-600 hover:cursor-pointer hover:text-red-900"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Editar" : "Criar"}{" "}
                {activeTab === "products"
                  ? "Produto"
                  : activeTab === "markets"
                  ? "Mercado"
                  : activeTab === "market-products"
                  ? "Produto de Mercado"
                  : activeTab === "users"
                  ? "Usuário"
                  : "Item"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingItem(null);
                  setFormData({});
                }}
                className="text-gray-400 hover:cursor-pointer hover:text-gray-600"
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Form */}
              {activeTab === "products" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Market Form */}
              {activeTab === "markets" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Mercado
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.latitude || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            latitude: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.longitude || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longitude: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Market Product Form */}
              {activeTab === "market-products" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID do Mercado
                    </label>
                    <input
                      type="text"
                      value={formData.marketId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, marketId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      disabled={editingItem}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID do Produto
                    </label>
                    <input
                      type="text"
                      value={formData.productId || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, productId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                      disabled={editingItem}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                </>
              )}

              {/* User Form */}
              {activeTab === "users" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {!editingItem && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Senha
                      </label>
                      <input
                        type="password"
                        value={formData.password || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      checked={formData.isAdmin || false}
                      onChange={(e) =>
                        setFormData({ ...formData, isAdmin: e.target.checked })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isAdmin"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Administrador
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingItem(null);
                    setFormData({});
                  }}
                  className="px-4 py-2 hover:cursor-pointer text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm hover:cursor-pointer font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingItem ? "Atualizar" : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
