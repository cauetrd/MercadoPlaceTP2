"use client";

import { apiService } from "@/service/api/api";
import { MarketResponseDto } from "@/service/api/api.types";
import { useEffect, useState } from "react";

interface CreateProductDto {
  name: string;
  description?: string;
  imageUrl?: string;
  marketId: string;
  price: number;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: () => void;
}

const CreateProductModal = ({
  isOpen,
  onClose,
  onProductCreated,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    imageUrl: "",
    marketId: "",
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [markets, setMarkets] = useState<MarketResponseDto[]>([]);

  // Fetch markets when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMarkets();
    }
  }, [isOpen]);

  const fetchMarkets = async () => {
    try {
      const response = await apiService.get("/markets");
      setMarkets(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao carregar mercados:", error);
      setError("Erro ao carregar mercados");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Preparar dados para envio
      const productData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        imageUrl: formData.imageUrl?.trim() || undefined,
        marketId: formData.marketId,
        price: formData.price,
      };

      const result = await apiService.post(
        "/products/with-market",
        productData
      );

      // Verificar se o produto foi aprovado automaticamente ou está pendente
      if (result.marketProduct.isValid) {
        setSuccess("Produto criado e aprovado com sucesso!");
      } else {
        setSuccess("Produto criado e enviado para aprovação!");
      }

      // Limpar formulário
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        marketId: "",
        price: 0,
      });

      // Chamar callback para atualizar a lista de produtos
      if (onProductCreated) {
        onProductCreated();
      }

      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        marketId: "",
        price: 0,
      });
      setError(null);
      setSuccess(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Criar Novo Produto
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 hover:cursor-pointer transition-colors"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome do Produto */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Produto *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Ex: Arroz Integral 1kg"
            />
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Descreva o produto..."
            />
          </div>

          {/* URL da Imagem */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              URL da Imagem (opcional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          {/* Mercado */}
          <div>
            <label
              htmlFor="marketId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mercado *
            </label>
            <select
              id="marketId"
              name="marketId"
              value={formData.marketId}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Selecione um mercado</option>
              {markets.map((market) => (
                <option key={market.id} value={market.id}>
                  {market.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preço */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço (R$) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="0.00"
            />
          </div>

          {/* Mensagens de erro e sucesso */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border hover:cursor-pointer border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !formData.name.trim() ||
                !formData.marketId ||
                formData.price <= 0
              }
              className="flex-1 px-4 py-2 bg-blue-600 hover:cursor-pointer text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Criando..." : "Criar Produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
