import { ProductResponseDto } from "@/service/api/api.types";
import { useEffect } from "react";

interface ProductDetailModalProps {
  product: ProductResponseDto | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: ProductResponseDto) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevenir scroll do body
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalhes do Produto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

        {/* Conteúdo do Modal */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagem do Produto */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-24 h-24"
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

            {/* Informações do Produto */}
            <div className="space-y-4">
              {/* Nome */}
              <h3 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h3>

              {/* Preço */}
              <div className="text-3xl font-bold text-green-600">
                R$ {product.currentPrice.toFixed(2)}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.isValid
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {product.isValid
                    ? "✅ Produto Válido"
                    : "⏳ Aguardando Aprovação"}
                </span>
              </div>

              {/* Descrição */}
              {product.description && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Descrição</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Informações Adicionais */}
              <div className="space-y-3 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">
                      Criado em:
                    </span>
                    <p className="text-gray-900">
                      {new Date(product.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Atualizado em:
                    </span>
                    <p className="text-gray-900">
                      {new Date(product.updatedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Histórico de Preços */}
              {product.priceHistory && product.priceHistory.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold text-gray-900">
                    Histórico de Preços
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {product.priceHistory.slice(0, 5).map((history) => (
                      <div
                        key={history.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-gray-600">
                          {new Date(history.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                        <span className="font-medium text-gray-900">
                          R$ {history.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer do Modal */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Fechar
          </button>
          {onAddToCart && product.isValid && (
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              🛒 Adicionar à Lista
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
