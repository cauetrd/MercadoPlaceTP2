"use client";

import React, { useEffect, useState } from "react";
import { apiService } from "@/service/api/api";

interface Product {
  id: string;
  name: string;
  description?: string;
  currentPrice: number;
  imageUrl?: string;
  isValid: boolean;
}

interface ShoppingListItem {
  id: string;
  quantity: number;
  isSelected: boolean;
  productId: string;
  product: Product;
}

interface SelectedTotal {
  total: number;
  itemCount: number;
}

export default function ShoppingCartPage() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [selectedTotal, setSelectedTotal] = useState<SelectedTotal>({
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);

  // Buscar itens da lista de compras
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.get("/shopping-list");
      setItems(data);
    } catch (err) {
      setError("Erro ao carregar a lista de compras.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar total de itens selecionados
  const fetchSelectedTotal = async () => {
    try {
      const data = await apiService.get("/shopping-list/total");
      setSelectedTotal(data);
    } catch {
      // Ignorar erro silenciosamente
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSelectedTotal();
  }, []);

  // Alternar seleção de item
  const toggleSelect = async (itemId: string, isSelected: boolean) => {
    try {
      await apiService.patch(`/shopping-list/items/${itemId}`, {
        isSelected,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, isSelected } : item
        )
      );
      fetchSelectedTotal();
    } catch {
      setError("Erro ao atualizar seleção do item.");
    }
  };

  // Atualizar quantidade do item
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return; // Evitar quantidades inválidas
    try {
      await apiService.patch(`/shopping-list/items/${itemId}`, { quantity });
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
      fetchSelectedTotal();
    } catch {
      setError("Erro ao atualizar quantidade.");
    }
  };

  // Remover item da lista
  const removeItem = async (itemId: string) => {
    try {
      await apiService.delete(`/shopping-list/items/${itemId}`);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      fetchSelectedTotal();
    } catch {
      setError("Erro ao remover item.");
    }
  };

  // Finalizar compra
  const finalizePurchase = async () => {
    if (selectedTotal.itemCount === 0) {
      alert("Selecione ao menos um item para finalizar a compra.");
      return;
    }
    setFinalizing(true);
    try {
      await apiService.post("/shopping-list/finalize", {
        selectedItemIds: items.filter((item) => item.isSelected).map((item) => item.id),
      });
      alert("Compra finalizada com sucesso!");
      fetchItems();
      fetchSelectedTotal();
    } catch {
      setError("Erro ao finalizar compra.");
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Seu Carrinho de Compras</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 underline"
            aria-label="Fechar erro"
          >
            Fechar
          </button>
        </div>
      )}

      {loading ? (
        <p>Carregando itens...</p>
      ) : items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Selecionar</th>
              <th className="p-2 text-left">Produto</th>
              <th className="p-2 text-left">Quantidade</th>
              <th className="p-2 text-left">Preço</th>
              <th className="p-2 text-left">Subtotal</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ id, quantity, isSelected, product }) => (
              <tr key={id} className="border-t border-gray-300">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => toggleSelect(id, e.target.checked)}
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-4">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded" />
                    )}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    min={1}
                    className="w-16 border rounded px-2 py-1"
                    value={quantity}
                    onChange={(e) =>
                      updateQuantity(id, parseInt(e.target.value, 10))
                    }
                  />
                </td>
                <td className="p-2">R$ {product.currentPrice.toFixed(2)}</td>
                <td className="p-2">
                  R$ {(product.currentPrice * quantity).toFixed(2)}
                </td>
                <td className="p-2">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => removeItem(id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div>
          <strong>Itens selecionados:</strong> {selectedTotal.itemCount} <br />
          <strong>Total:</strong> R$ {selectedTotal.total.toFixed(2)}
        </div>

        <button
          disabled={finalizing}
          onClick={finalizePurchase}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {finalizing ? "Finalizando..." : "Finalizar Compra"}
        </button>
      </div>
    </main>
  );
}
