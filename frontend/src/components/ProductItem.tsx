import { ProductResponseDto } from "@/service/api/api.types";

// Interface para as props do componente
interface ProductItemProps {
  product: ProductResponseDto;
  onViewDetails?: (product: ProductResponseDto) => void;
  onAddToCart?: (product: ProductResponseDto) => void;
  showActions?: boolean;
}

// Componente de Item do Produto
export default function ProductItem({
  product,
  onViewDetails,
  onAddToCart,
  showActions = true,
}: ProductItemProps) {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Imagem do produto */}
      <div className="aspect-video bg-gray-200 relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {/* Badge de preço */}
        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          R$ {product.currentPrice.toFixed(2)}
        </div>
      </div>

      {/* Conteúdo do produto */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || "Sem descrição disponível"}
        </p>

        {/* Data de atualização */}
        <div className="text-xs text-gray-400 mb-3">
          Atualizado em{" "}
          {new Date(product.updatedAt).toLocaleDateString("pt-BR")}
        </div>

        {/* Botões de ação */}
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={handleViewDetails}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Ver Detalhes
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
            >
              🛒 Adicionar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
