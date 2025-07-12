// Componente de Loading para o Modal
export function LoadingModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
          <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-300 rounded-lg animate-pulse"></div>

            {/* Info skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <div className="h-9 w-16 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-9 w-32 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Hook personalizado para buscar detalhes do produto
import { apiService } from "@/service/api/api";
import { ProductResponseDto } from "@/service/api/api.types";
import { useEffect, useState } from "react";

export function useProductDetails(productId: string | null) {
  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.get(`/products/${productId}`);
        setProduct(response);
      } catch (err) {
        console.error("Erro ao buscar detalhes do produto:", err);
        setError("Erro ao carregar detalhes do produto");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  return { product, loading, error };
}
